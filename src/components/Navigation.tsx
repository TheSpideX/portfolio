import React, { useContext } from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { NAV_ITEMS } from '../constants/navItems';
import { PhysicsContext } from '../contexts/PhysicsContext';

export const Navigation = ({ discoveredNodes }: { discoveredNodes: string[] }) => {
  const { zoomToElement } = useControls();
  const { transformRef } = useContext(PhysicsContext);

  const handleNav = (id: string, w: number, h: number, x: number, y: number) => {
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

    // Dynamic duration based on distance (min 500ms, max 1200ms)
    const baseDuration = 500;
    const distanceFactor = 0.5; // ms per pixel
    const duration = Math.min(1200, Math.max(baseDuration, baseDuration + distance * distanceFactor));

    zoomToElement(id, targetScale, duration, 'easeInOutCubic');
  };

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
