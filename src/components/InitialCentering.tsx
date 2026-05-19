import React, { useRef, useEffect } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

export const InitialCentering = () => {
  const { zoomToElement } = useControls();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (hasCentered.current) return;

    // Wait for the DOM and TransformWrapper to finish mounting
    const timer = setTimeout(() => {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const targetScale = Math.min((sw * 0.84) / 1200, (sh * 0.84) / 800, 1.4);
      // Center instantly (0ms) on the Start node
      zoomToElement('node-start', targetScale, 0);
      hasCentered.current = true;
    }, 50);
    return () => clearTimeout(timer);
  }, [zoomToElement]);

  return null;
};
