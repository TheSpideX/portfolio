import React from 'react';

export const FlashlightSection = ({ children, className = "", style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  return (
    <div
      className={`relative ${className}`}
      style={style}
    >
      <div className="relative z-10 h-full flex flex-col" style={{ transformStyle: 'preserve-3d' }}>{children}</div>
    </div>
  );
};
