import { createContext } from 'react';
import { PhysicsContextType } from '../types';

export const PhysicsContext = createContext<PhysicsContextType>({
  engine: null,
  transformRef: { current: { x: 0, y: 0, scale: 1 } },
  setIsDragging: () => { }
});
