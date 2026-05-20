import React, { useContext, useRef, useCallback } from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import Matter from 'matter-js';
import { NAV_ITEMS } from '../constants/navItems';
import { PhysicsContext } from '../contexts/PhysicsContext';

export const Navigation = ({ discoveredNodes }: { discoveredNodes: string[] }) => {
  const { zoomToElement } = useControls();
  const { transformRef, engine, runner } = useContext(PhysicsContext);
  const isZoomingRef = useRef(false);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNav = useCallback((id: string, w: number, h: number, x: number, y: number) => {
    // Debounce: if already zooming, cancel previous and start new
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }

    const sw = window.innerWidth;
    const sh = window.innerHeight;
    const targetScale = Math.min((sw * 0.84) / w, (sh * 0.84) / h, 1.4);

    // Calculate distance from current view center to target node center
    const currentX = transformRef.current?.x ?? 0;
    const currentY = transformRef.current?.y ?? 0;
    const currentScale = transformRef.current?.scale ?? 1;

    // Current view center in canvas coordinates
    const viewCenterX = (sw / 2 - currentX) / currentScale;
    const viewCenterY = (sh / 2 - currentY) / currentScale;

    // Target node center
    const targetCenterX = x + w / 2;
    const targetCenterY = y + h / 2;

    // Distance between centers
    const distance = Math.sqrt(
      Math.pow(viewCenterX - targetCenterX, 2) +
      Math.pow(viewCenterY - targetCenterY, 2)
    );

    // Dynamic duration based on distance (min 600ms, max 1500ms)
    const baseDuration = 600;
    const distanceFactor = 0.6; // ms per pixel
    const duration = Math.min(1500, Math.max(baseDuration, baseDuration + distance * distanceFactor));

    isZoomingRef.current = true;
    
    // Find target body and freeze it
    let targetBody: Matter.Body | undefined;
    let originalIsStatic = false;
    
    if (engine) {
      targetBody = engine.world.bodies.find(b => b.label === id);
      if (targetBody) {
        originalIsStatic = targetBody.isStatic;
        Matter.Body.setStatic(targetBody, true);
        Matter.Body.setVelocity(targetBody, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(targetBody, 0);
      }
    }

    zoomToElement(id, targetScale, duration, 'easeInOutQuad');

    // Small buffer after animation
    zoomTimeoutRef.current = setTimeout(() => {
      isZoomingRef.current = false;
      if (targetBody && !originalIsStatic) {
        // Wake it back up so it doesn't stay frozen forever
        Matter.Body.setStatic(targetBody, false);
      }
    }, duration + 50);
  }, [zoomToElement, transformRef, engine, runner]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4 md:gap-8 bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden">
      {NAV_ITEMS.map(item => {
        if (!discoveredNodes.includes(item.id)) return null;
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id, item.w, item.h, item.x, item.y)}
            className="font-mono text-xs md:text-sm uppercase tracking-widest text-[#ccff00] hover:text-white transition-colors"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
