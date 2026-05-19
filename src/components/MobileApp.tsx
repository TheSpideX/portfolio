import React, { useRef, Suspense } from 'react';
import { MobileLayout } from './MobileLayout';

const Background3D = React.lazy(() => import('./Background3D'));

export default function MobileApp() {
  const transformRef = useRef({ x: -1000, y: -800, scale: 0.6 });

  return (
    <div className="relative w-full h-screen text-white font-sans overflow-x-hidden overflow-y-auto">
      <Suspense fallback={null}>
        <Background3D transformRef={transformRef} />
      </Suspense>
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <div className="noise-bg fixed inset-0 pointer-events-none" />
      <MobileLayout />
    </div>
  );
}
