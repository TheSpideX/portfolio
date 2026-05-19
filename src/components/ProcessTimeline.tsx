import React, { useState } from 'react';

const steps = [
  { num: '01', title: 'Discover', desc: 'Deep-dive into brand, audience & goals. Research competitors, define creative direction.', duration: '1W', details: ['Interviews', 'Analysis', 'Brief'] },
  { num: '02', title: 'Design', desc: 'Wireframes & high-fidelity Figma prototypes. Every pixel intentional, every interaction polished.', duration: '2W', details: ['Wireframes', 'Hi-fi Mocks', 'Motion'] },
  { num: '03', title: 'Build', desc: 'Production-grade code. Performance, accessibility and animation are non-negotiable.', duration: '3W', details: ['Architecture', 'WebGL/GSAP', 'CI/CD'] },
  { num: '04', title: 'Ship', desc: 'Deploy, test, iterate. Post-launch support ensures everything runs flawlessly.', duration: '1W', details: ['Audit', 'A/B Test', 'Support'] },
];

export const ProcessTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative h-full flex flex-col justify-center gap-4" style={{ transformStyle: 'preserve-3d' }}>
      {steps.map((step, idx) => {
        const isActive = activeStep === idx;
        return (
          <div
            key={idx}
            className={`relative group cursor-pointer flex flex-col p-6 rounded-xl border transition-all duration-500 ${isActive ? 'bg-[#ccff00]/5 border-[#ccff00]/30' : 'bg-black/40 border-white/10 hover:border-white/20'}`}
            style={{ transformStyle: 'preserve-3d', transform: `translateZ(${isActive ? 40 : 0}px)` }}
            onMouseEnter={() => setActiveStep(idx)}
          >
            {/* Tech Grid Background for Active Step */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" style={{ transform: 'translateZ(-1px)' }}>
              <div className={`absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(204,255,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,1)_1px,transparent_1px)] bg-[size:20px_20px] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* Top Header Row */}
            <div className="relative z-10 flex items-center justify-between" style={{ transform: `translateZ(${isActive ? 20 : 0}px)` }}>
              <div className="flex items-center gap-6">
                <span className={`font-mono text-sm tracking-widest transition-colors duration-300 ${isActive ? 'text-[#ccff00]' : 'text-gray-600'}`}>
                  [{step.num}]
                </span>
                <h3 className={`font-display text-4xl uppercase transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {step.title}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-[10px] px-3 py-1 rounded-full border transition-colors duration-300 ${isActive ? 'border-[#ccff00]/30 text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-600'}`}>
                  {step.duration}
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 w-16 text-right ${isActive ? 'text-[#ccff00] animate-pulse' : 'text-transparent'}`}>
                  Active
                </span>
              </div>
            </div>

            {/* Expandable Content */}
            <div className={`relative z-10 grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
              <div className="overflow-hidden">
                <div className="pl-14 border-l border-dashed border-white/20 ml-[18px] py-2">
                  <p className="font-mono text-gray-400 text-sm leading-relaxed max-w-xl mb-6">{step.desc}</p>
                  <div className="flex gap-3 flex-wrap">
                    {step.details.map(d => (
                      <span key={d} className="font-mono text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded border border-white/5">
                        <span className="w-1 h-1 bg-[#ccff00] rounded-full" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Indicator Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.5)] transition-transform duration-500 origin-top rounded-l-xl ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
          </div>
        );
      })}
    </div>
  );
};
