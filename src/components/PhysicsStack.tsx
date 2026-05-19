import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useAudio } from '../contexts/AudioContext';

export const PhysicsStack = ({ width = 1600, height = 600 }: { width?: number; height?: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const pillBodiesRef = useRef<Matter.Body[]>([]);
    const isMouseInsideRef = useRef(false);
    const isMouseDownRef = useRef(false);
    const localMousePosRef = useRef({ x: width / 2, y: height / 2 });
    const [elements, setElements] = useState<{ id: number; x: number; y: number; text: string; angle: number; color: string; w: number; h: number }[]>([]);
    const { playTick, playWhoosh, startHum, stopHum } = useAudio();

    const marquees = [
        { text: 'REACT // NEXT.JS // TYPESCRIPT // ', color: '#ccff00' },
        { text: 'GSAP // THREE.JS // WEBGL // ', color: 'white' },
        { text: 'NODE.JS // POSTGRES // SUPABASE // ', color: '#60a5fa' },
    ];

    const updateMousePos = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate local coordinates taking CSS scale into account
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        localMousePosRef.current = {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Create localized engine with ZERO gravity
        const engine = Matter.Engine.create({
            gravity: { x: 0, y: 0, scale: 0.001 }
        });
        engineRef.current = engine;

        // Bounds
        const thickness = 200;
        const walls = [
            Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true, friction: 0.1, restitution: 0.8 }), // bottom
            Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true, friction: 0.1, restitution: 0.8 }), // top
            Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 3, { isStatic: true, friction: 0.1, restitution: 0.8 }), // left
            Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 3, { isStatic: true, friction: 0.1, restitution: 0.8 }), // right
        ];

        Matter.Composite.add(engine.world, walls);

        // Runner
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        const skills = [
            { text: 'React', color: '#ccff00' }, { text: 'Next.js', color: '#ccff00' },
            { text: 'TypeScript', color: '#ccff00' }, { text: 'Three.js', color: '#ccff00' },
            { text: 'GSAP', color: '#ccff00' }, { text: 'WebGL', color: '#ccff00' },
            { text: 'Motion', color: '#ccff00' }, { text: 'Tailwind', color: '#ccff00' },
            { text: 'Node.js', color: '#60a5fa' }, { text: 'Postgres', color: '#60a5fa' },
            { text: 'Supabase', color: '#60a5fa' }, { text: 'Docker', color: '#60a5fa' },
            { text: 'AWS', color: '#60a5fa' }, { text: 'Redis', color: '#60a5fa' },
            { text: 'Figma', color: '#c084fc' }, { text: 'Spline', color: '#c084fc' },
            { text: 'Cinema4D', color: '#c084fc' }, { text: 'Blender', color: '#c084fc' },
            { text: 'Typography', color: '#c084fc' }, { text: 'UX/UI', color: '#c084fc' }
        ];

        const bodies: Matter.Body[] = [];
        const elementsData: any[] = [];

        // Create elements
        setTimeout(() => {
            skills.forEach((skill, idx) => {
                const charCount = skill.text.length;
                const w = Math.max(90, charCount * 14 + 40); 
                const h = 48;

                // Start them in a rough circle
                const angle = (idx / skills.length) * Math.PI * 2;
                const radius = 200 + Math.random() * 100;
                const x = width / 2 + Math.cos(angle) * radius;
                const y = height / 2 + Math.sin(angle) * radius;

                const body = Matter.Bodies.rectangle(x, y, w, h, {
                    restitution: 0.8, // Bouncy for the supernova
                    frictionAir: 0.015, // Low air friction for orbiting
                    friction: 0.05,
                    density: 0.05,
                    chamfer: { radius: h / 2 } 
                });

                // Give them an initial tangential velocity to start the orbit
                const speed = 5;
                Matter.Body.setVelocity(body, {
                    x: -Math.sin(angle) * speed,
                    y: Math.cos(angle) * speed
                });

                Matter.Body.setAngle(body, angle);

                bodies.push(body);
                elementsData.push({ id: body.id, text: skill.text, color: skill.color, w, h });
            });

            pillBodiesRef.current = bodies;
            Matter.Composite.add(engine.world, bodies);
        }, 100);

        const triggerSupernova = (x: number, y: number) => {
            if (!pillBodiesRef.current.length) return;
            playWhoosh();
            stopHum();
            
            pillBodiesRef.current.forEach(body => {
                const dx = body.position.x - x;
                const dy = body.position.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                
                // Massive outward force proportional to mass
                const explosionStrength = 0.08 * body.mass; 
                Matter.Body.applyForce(body, body.position, {
                    x: (dx / dist) * explosionStrength,
                    y: (dy / dist) * explosionStrength
                });
            });
        };

        // Global pointer up to catch releases outside the container
        const handleGlobalPointerUp = () => {
            if (isMouseDownRef.current) {
                isMouseDownRef.current = false;
                triggerSupernova(localMousePosRef.current.x, localMousePosRef.current.y);
            }
        };
        window.addEventListener('pointerup', handleGlobalPointerUp);

        // Collision Sounds
        Matter.Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            let shouldPlaySound = false;
            
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const velocityA = pair.bodyA.velocity;
                const velocityB = pair.bodyB.velocity;
                const relativeVelocity = Math.sqrt(
                    Math.pow(velocityA.x - velocityB.x, 2) + 
                    Math.pow(velocityA.y - velocityB.y, 2)
                );

                if (relativeVelocity > 3) {
                    shouldPlaySound = true;
                    break;
                }
            }

            if (shouldPlaySound && Math.random() > 0.6) {
                playTick();
            }
        });

        // The Singularity Logic
        Matter.Events.on(engine, 'beforeUpdate', () => {
            if (!pillBodiesRef.current.length) return;

            const cx = width / 2;
            const cy = height / 2;

            pillBodiesRef.current.forEach(body => {
                if (isMouseDownRef.current && isMouseInsideRef.current) {
                    // BLACK HOLE (Suck towards mouse)
                    const mousePos = localMousePosRef.current;
                    const dx = mousePos.x - body.position.x;
                    const dy = mousePos.y - body.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const safeDist = Math.max(dist, 50);

                    const forceMagnitude = (0.006 * body.mass); 
                    Matter.Body.applyForce(body, body.position, {
                        x: (dx / safeDist) * forceMagnitude,
                        y: (dy / safeDist) * forceMagnitude
                    });
                    
                    // Add a swirl effect
                    const swirlStrength = 0.003 * body.mass;
                    Matter.Body.applyForce(body, body.position, {
                        x: (-dy / safeDist) * swirlStrength,
                        y: (dx / safeDist) * swirlStrength
                    });

                } else {
                    // ORBIT (Gentle pull to center + tangential force)
                    const dx = cx - body.position.x;
                    const dy = cy - body.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                    const pullStrength = 0.00001 * body.mass;
                    const orbitStrength = 0.00005 * body.mass;

                    Matter.Body.applyForce(body, body.position, {
                        x: (dx / dist) * pullStrength + (-dy / dist) * orbitStrength,
                        y: (dy / dist) * pullStrength + (dx / dist) * orbitStrength
                    });
                    
                    // Speed limit for orbit
                    const maxSpeed = 5;
                    if (body.speed > maxSpeed) {
                        Matter.Body.setVelocity(body, {
                            x: (body.velocity.x / body.speed) * maxSpeed,
                            y: (body.velocity.y / body.speed) * maxSpeed
                        });
                    }
                }
            });
        });

        let animationFrameId: number;
        const update = () => {
            const newElements = bodies.map((body, i) => ({
                id: body.id,
                x: body.position.x,
                y: body.position.y,
                angle: body.angle,
                text: elementsData[i].text,
                color: elementsData[i].color,
                w: elementsData[i].w,
                h: elementsData[i].h
            }));
            setElements(newElements);
            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => {
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            cancelAnimationFrame(animationFrameId);
            Matter.Events.off(engine, 'beforeUpdate', () => {});
            Matter.Events.off(engine, 'collisionStart', () => {});
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            pillBodiesRef.current = [];
        };
    }, [width, height, playTick, playWhoosh, stopHum]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden bg-zinc-950 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl cursor-crosshair"
            onPointerEnter={() => { isMouseInsideRef.current = true; }}
            onPointerLeave={() => { isMouseInsideRef.current = false; }}
            onPointerMove={(e) => {
                updateMousePos(e.clientX, e.clientY);
            }}
            onPointerDown={(e) => {
                e.stopPropagation(); // Prevent react-zoom-pan-pinch from stealing the event
                isMouseDownRef.current = true;
                updateMousePos(e.clientX, e.clientY);
                startHum();
            }}
        >
            {/* Brutalist Marquee Background */}
            <div className="absolute inset-0 flex flex-col justify-center gap-[4vh] opacity-[0.08] select-none pointer-events-none z-0 overflow-hidden mix-blend-screen mix-blend-plus-lighter">
                {marquees.map((m, i) => (
                    <div key={i} className="whitespace-nowrap flex" style={{ transform: `rotate(${i === 1 ? -2 : i === 0 ? 1 : 2}deg) scale(1.1)` }}>
                        <div className={`font-display text-[150px] leading-[0.8] tracking-tighter uppercase flex-shrink-0 animate-marquee ${i % 2 !== 0 ? 'animate-marquee-reverse' : ''}`} style={{ color: m.color }}>
                            {m.text.repeat(10)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Header Overlay */}
            <div className="absolute top-12 left-14 pointer-events-none z-10 flex flex-col">
                <h2 className="text-[120px] font-display uppercase tracking-tighter text-white leading-[0.8] opacity-90 drop-shadow-2xl">TECH STACK</h2>
            </div>

            <div className="absolute bottom-12 right-14 pointer-events-none z-10 flex gap-3">
                {['Click & Hold', 'Singularity', 'Release'].map((t, idx) => (
                    <span key={t} className="font-mono text-xs px-4 py-1.5 rounded-full border border-[#ccff00]/30 text-[#ccff00] bg-[#ccff00]/10 backdrop-blur uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" style={{ animationDelay: `${idx * 0.2}s` }} />
                        {t}
                    </span>
                ))}
            </div>

            {/* Physics DOM Elements mapped to Matter bodies */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {elements.map((el) => (
                    <div
                        key={el.id}
                        className="physics-pill absolute top-0 left-0 flex items-center justify-center font-mono text-[16px] font-bold tracking-widest uppercase rounded-full border-2 transition-colors select-none backdrop-blur-md"
                        style={{
                            width: el.w,
                            height: el.h,
                            transform: `translate(${el.x - el.w / 2}px, ${el.y - el.h / 2}px) rotate(${el.angle}rad)`,
                            color: el.color,
                            borderColor: el.color,
                            backgroundColor: `${el.color}1a`,
                            boxShadow: `0 8px 32px ${el.color}30`
                        }}
                    >
                        {el.text}
                    </div>
                ))}
            </div>
        </div>
    );
};
