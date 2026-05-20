import React, { useRef, useEffect, useContext, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Matter from 'matter-js';
import { PhysicsContext } from '../contexts/PhysicsContext';
import { InteractiveNodeProps } from '../types';
import { NODE_ORDER } from '../constants/navItems';

const InteractiveNode = ({ children, startX, startY, width, height, shape = 'rectangle', zIndex = 10, delay = 0, id, innerClassName = "", loadingProgress }: InteractiveNodeProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const { engine, transformRef, setIsDragging } = useContext(PhysicsContext);
  const bodyRef = useRef<Matter.Body | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);

  // Visibility tracking
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  // Track recent pointer positions for throw velocity
  const pointerHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);

  // IntersectionObserver for visibility detection
  useEffect(() => {
    const element = nodeRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        isVisibleRef.current = visible;
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  // Physics Body Initialization
  useEffect(() => {
    if (!engine) return;

    const options: Matter.IChamferableBodyDefinition = {
      label: id || 'interactive-node',
      restitution: 0.3,
      friction: 0.05,
      frictionAir: 0.08,
      angle: 0,
      inertia: Infinity,
      sleepThreshold: 60, // Frames of inactivity before sleeping
    };

    const initialX = startX + width / 2;
    const initialY = startY + height / 2;

    const body = shape === 'circle'
      ? Matter.Bodies.circle(initialX, initialY, width / 2, options)
      : Matter.Bodies.rectangle(initialX, initialY, width, height, { ...options, chamfer: { radius: 32 } });

    bodyRef.current = body;
    Matter.World.add(engine.world, body);

    let animationFrameId: number;
    const updateTransform = () => {
      if (nodeRef.current && bodyRef.current) {
        const { x, y } = bodyRef.current.position;
        nodeRef.current.style.transform = `translate(${x - width / 2}px, ${y - height / 2}px)`;

        // Remove manual sleep logic, matter.js handles it automatically based on sleepThreshold
      }
      animationFrameId = requestAnimationFrame(updateTransform);
    };

    updateTransform();

    // Collision wake-up: wake sleeping bodies when hit
    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach(pair => {
        if (pair.bodyA.isSleeping) Matter.Sleeping.set(pair.bodyA, false);
        if (pair.bodyB.isSleeping) Matter.Sleeping.set(pair.bodyB, false);
      });
    };

    Matter.Events.on(engine, 'collisionStart', handleCollision);

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Events.off(engine, 'collisionStart', handleCollision);
      Matter.World.remove(engine.world, body);
    };
  }, [engine, startX, startY, width, height, shape]);

  // Drag Handling - direct setPosition approach (no constraints)
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, textarea, .no-drag')) return;

    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    isDraggingRef.current = true;

    if (!engine || !bodyRef.current || !transformRef.current) return;

    // Wake up body if sleeping
    if (bodyRef.current.isSleeping) {
      Matter.Sleeping.set(bodyRef.current, false);
    }

    // Zero velocity immediately to prevent momentum fighting
    Matter.Body.setVelocity(bodyRef.current, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(bodyRef.current, 0);

    // Make body static so physics doesn't interfere during drag
    Matter.Body.setStatic(bodyRef.current, true);

    // Pause the floating animation so it doesn't fight positioning
    if (floatTweenRef.current) {
      floatTweenRef.current.pause();
      gsap.set(floatRef.current, { y: 0, rotation: 0 });
    }

    const { x: tx, y: ty, scale } = transformRef.current;
    const canvasX = (e.clientX - tx) / scale;
    const canvasY = (e.clientY - ty) / scale;

    // Store offset between click point and body center
    dragOffsetRef.current = {
      x: canvasX - bodyRef.current.position.x,
      y: canvasY - bodyRef.current.position.y,
    };

    // Clear pointer history and seed with current position
    pointerHistoryRef.current = [{ x: canvasX, y: canvasY, t: performance.now() }];
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !bodyRef.current || !transformRef.current) return;

    const { x: tx, y: ty, scale } = transformRef.current;
    const canvasX = (e.clientX - tx) / scale;
    const canvasY = (e.clientY - ty) / scale;

    // Move body directly to follow cursor (offset-adjusted)
    Matter.Body.setPosition(bodyRef.current, {
      x: canvasX - dragOffsetRef.current.x,
      y: canvasY - dragOffsetRef.current.y,
    });

    // Track pointer for throw velocity (keep last 5 samples)
    const now = performance.now();
    pointerHistoryRef.current.push({ x: canvasX, y: canvasY, t: now });
    if (pointerHistoryRef.current.length > 5) {
      pointerHistoryRef.current.shift();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    isDraggingRef.current = false;

    if (bodyRef.current) {
      // Restore dynamic body
      Matter.Body.setStatic(bodyRef.current, false);

      // Compute throw velocity from pointer history
      const history = pointerHistoryRef.current;
      if (history.length >= 2) {
        const oldest = history[0];
        const newest = history[history.length - 1];
        const dt = (newest.t - oldest.t) / 1000; // seconds
        if (dt > 0.01) {
          const vx = ((newest.x - oldest.x) / dt) * 0.05; // scale down for physics
          const vy = ((newest.y - oldest.y) / dt) * 0.05;
          // Clamp velocity to prevent insane throws
          const maxV = 25;
          Matter.Body.setVelocity(bodyRef.current, {
            x: Math.max(-maxV, Math.min(maxV, vx)),
            y: Math.max(-maxV, Math.min(maxV, vy)),
          });
        }
      }
    }

    // Resume floating animation
    if (floatTweenRef.current) {
      floatTweenRef.current.resume();
    }

    pointerHistoryRef.current = [];
  };

  // Visibility-based GSAP control
  useEffect(() => {
    if (!floatTweenRef.current) return;

    if (isVisible) {
      // Node entered viewport - resume animation from start
      floatTweenRef.current.restart();
    } else {
      // Node left viewport - reset to start and pause
      floatTweenRef.current.progress(0);
      floatTweenRef.current.pause();
    }
  }, [isVisible]);

  useGSAP(() => {
    // Ambient floating (starts after initial reveal)
    floatTweenRef.current = gsap.to(floatRef.current, {
      y: "+=40",
      rotation: () => Math.random() * 4 - 2,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5 + delay, // Wait for initial reveal
      paused: !isVisible, // Start paused if not visible
    });

    // 3D Tilt effect
    const element = tiltRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "rotationY", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "rotationX", { duration: 0.8, ease: "power3.out" });

    // Throttle tilt to 30fps (every other frame)
    let tiltThrottleId: number | null = null;
    let lastMouseEvent: MouseEvent | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseEvent = e;
      if (tiltThrottleId !== null) return;

      tiltThrottleId = requestAnimationFrame(() => {
        if (!lastMouseEvent) return;
        const rect = element.getBoundingClientRect();
        const x = (lastMouseEvent.clientX - rect.left) / rect.width - 0.5;
        const y = (lastMouseEvent.clientY - rect.top) / rect.height - 0.5;

        // Scale tilt strength with canvas zoom so it feels consistent at any zoom level.
        const canvasScale = transformRef.current?.scale ?? 1;
        const tiltStrength = Math.min(30, Math.max(8, 30 * canvasScale));

        xTo(x * tiltStrength);
        yTo(-y * tiltStrength);

        tiltThrottleId = null;
        lastMouseEvent = null;
      });
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      id={id}
      ref={nodeRef}
      className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
      style={{
        width,
        height,
        zIndex,
        perspective: '2000px',
        transform: `translate(${startX}px, ${startY}px)`
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div ref={floatRef} className={`w-full h-full node-element ${innerClassName}`}>
        <div ref={tiltRef} className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>

          {/* SKELETON OVERLAY */}
          {(() => {
            const nodeIndex = NODE_ORDER.indexOf(id || '');
            const isSkeleton = loadingProgress !== undefined && loadingProgress < Math.min(100, (nodeIndex + 1) * 12.5);

            return (
              <div className={`absolute inset-0 z-50 w-full h-full border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center p-8 bg-black/80 backdrop-blur-md transition-opacity duration-700 pointer-events-none ${isSkeleton ? 'opacity-100' : 'opacity-0'}`}>
                <div className="font-mono text-sm uppercase tracking-widest text-[#ccff00] animate-[pulse_2s_ease-in-out_infinite]">Initializing Node...</div>
              </div>
            );
          })()}

          {/* ALWAYS RENDER CHILDREN FOR GSAP / PHYSICS */}
          {(() => {
            const nodeIndex = NODE_ORDER.indexOf(id || '');
            const isSkeleton = loadingProgress !== undefined && loadingProgress < Math.min(100, (nodeIndex + 1) * 12.5);

            return (
              <div className={`w-full h-full transition-opacity duration-700 ${isSkeleton ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ transformStyle: 'preserve-3d' }}>
                {children}
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
};

export default InteractiveNode;
