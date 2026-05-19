import React, { useState } from 'react';

export const FlashlightSection = ({ children, className = "", style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div
      className={`relative ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
    >
      <div className="relative z-10 h-full flex flex-col" style={{ transformStyle: 'preserve-3d' }}>{children}</div>
      <div className="absolute inset-0 pointer-events-none z-0 rounded-[inherit] overflow-hidden" style={{ transform: 'translateZ(-1px)' }}>
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(204,255,0,0.15) 0%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
};
