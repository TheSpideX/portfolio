import React, { useEffect } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

export const KeyboardNavigation = ({ transformRef }: { transformRef: any }) => {
  const { setTransform, zoomToElement } = useControls();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const panAmount = 150;
      let { x, y, scale } = transformRef.current;
      let moved = false;

      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': y += panAmount; moved = true; break;
        case 's': case 'arrowdown': y -= panAmount; moved = true; break;
        case 'a': case 'arrowleft': x += panAmount; moved = true; break;
        case 'd': case 'arrowright': x -= panAmount; moved = true; break;
        case ' ': // Spacebar
          e.preventDefault();
          const sw = window.innerWidth;
          const sh = window.innerHeight;
          const targetScale = Math.min((sw * 0.84) / 1100, (sh * 0.84) / 700, 1.4);
          zoomToElement('node-hero', targetScale, 600, 'easeOut');
          break;
      }

      if (moved) setTransform(x, y, scale, 150, 'linear');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTransform, zoomToElement, transformRef]);

  return null;
};
