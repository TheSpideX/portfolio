import React, { useState, useContext } from 'react';
import Matter from 'matter-js';
import { PhysicsContext } from '../App';

export const GravityButton = () => {
  const { engine } = useContext(PhysicsContext);
  const [isGravityOn, setIsGravityOn] = useState(false);

  const toggleGravity = () => {
    if (!engine) return;
    const newGravity = !isGravityOn;
    setIsGravityOn(newGravity);

    engine.gravity.y = newGravity ? 1 : 0;

    Matter.Composite.allBodies(engine.world).forEach(body => {
      Matter.Sleeping.set(body, false);
    });
  };

  return (
    <button
      onClick={toggleGravity}
      className={`fixed bottom-8 right-8 z-[100] font-mono font-bold px-6 py-3 rounded-full uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] ${isGravityOn ? 'bg-red-600 text-white hover:bg-red-500 hover:scale-110' : 'bg-white text-black hover:bg-gray-200 hover:scale-110'}`}
    >
      {isGravityOn ? 'GRAVITY: ON' : 'GRAVITY: OFF'}
    </button>
  );
};
