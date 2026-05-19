import React from 'react';
import Matter from 'matter-js';

export interface PhysicsContextType {
  engine: Matter.Engine | null;
  transformRef: React.RefObject<{ x: number, y: number, scale: number }>;
  setIsDragging: (isDragging: boolean) => void;
}

export interface InteractiveNodeProps {
  children: React.ReactNode;
  startX: number;
  startY: number;
  width: number;
  height: number;
  shape?: 'rectangle' | 'circle';
  zIndex?: number;
  delay?: number;
  id?: string;
  innerClassName?: string;
  loadingProgress?: number;
}
