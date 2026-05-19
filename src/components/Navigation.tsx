import React from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { NAV_ITEMS } from '../constants/navItems';

export const Navigation = ({ discoveredNodes }: { discoveredNodes: string[] }) => {
  const { zoomToElement } = useControls();

  const handleNav = (id: string, w: number, h: number) => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    const targetScale = Math.min((sw * 0.84) / w, (sh * 0.84) / h, 1.4);
    zoomToElement(id, targetScale, 600, 'easeInOutCubic');
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4 md:gap-8 bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden">
      {NAV_ITEMS.map(item => {
        if (!discoveredNodes.includes(item.id)) return null;
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id, item.w, item.h)}
            className="font-mono text-xs md:text-sm uppercase tracking-widest text-[#ccff00] hover:text-white transition-colors"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
