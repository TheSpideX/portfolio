import React, { useState } from 'react';
import { Server, Sparkles, Lightbulb } from 'lucide-react';

const expertise = [
  {
    title: 'Systems Architecture',
    desc: 'Designing novel system architectures that solve problems others have not attempted. From ACID-like isolation to mesh networking — I architect what does not exist yet.',
    tags: ['Distributed Systems', 'Microservices', 'gRPC', 'WebSocket'],
    icon: Server
  },
  {
    title: 'AI-Augmented Build',
    desc: 'Using AI as a force multiplier. I design the architecture and breakthroughs, then leverage AI to execute rapidly. The idea is mine, the speed is exponential.',
    tags: ['Rapid Prototyping', 'AI Tools', 'Full-Stack', 'Any Stack'],
    icon: Sparkles
  },
  {
    title: 'Breakthrough Thinking',
    desc: 'Every project starts as an impossible idea. I find the novel approach, design the algorithm, and build what others say cannot be done. Not limited to any domain.',
    tags: ['Algorithm Design', 'Problem Solving', 'Novel Patterns', 'Research'],
    icon: Lightbulb
  }
];

export const ExpertiseSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 h-full" style={{ transformStyle: 'preserve-3d' }}>
      {expertise.map((item, idx) => {
        const isHovered = hoveredIdx === idx;
        const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;
        const isWide = idx === 0;
        const Icon = item.icon;

        return (
          <div
            key={idx}
            className={`relative group cursor-pointer rounded-xl border transition-all duration-500 bg-black/40 backdrop-blur-sm ${isWide ? 'col-span-2' : 'col-span-1'}`}
            style={{
              transform: `translateZ(${isHovered ? 60 : isOtherHovered ? 10 : 30}px) scale(${isHovered ? 1.02 : isOtherHovered ? 0.98 : 1})`,
              borderColor: isHovered ? 'rgba(204, 255, 0, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              opacity: isOtherHovered ? 0.4 : 1,
              transformStyle: 'preserve-3d'
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Background Layer with Overflow Hidden */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" style={{ transform: 'translateZ(-1px)' }}>
              {/* Tech Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              {/* Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-[#ccff00]/10 to-transparent transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Scanning Line */}
              <div className={`absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/50 to-transparent pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100 animate-[scan_2s_ease-in-out_infinite]' : 'opacity-0'}`} />
            </div>

            <div className="relative z-10 p-6 flex flex-col h-full justify-between gap-4" style={{ transformStyle: 'preserve-3d' }}>
              {/* Top Bar */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2" style={{ transform: `translateZ(${isHovered ? 20 : 0}px)` }}>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  MOD // 0{idx + 1}
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 ${isHovered ? 'text-[#ccff00] animate-pulse' : 'text-transparent'}`}>
                  Active
                </span>
              </div>

              <div className="flex items-center gap-4" style={{ transform: `translateZ(${isHovered ? 40 : 10}px)` }}>
                <div className="relative">
                  <Icon className={`w-10 h-10 transition-colors duration-300 relative z-10 ${isHovered ? 'text-[#ccff00] drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'text-gray-600'}`} />
                  {/* Floating 3D Icon Shadow */}
                  <Icon className={`w-10 h-10 absolute top-0 left-0 transition-all duration-500 blur-md ${isHovered ? 'text-[#ccff00] opacity-50 translate-x-2 translate-y-2' : 'text-transparent opacity-0'}`} style={{ transform: 'translateZ(-20px)' }} />
                </div>
                <h3 className={`text-3xl font-display uppercase transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-400'}`}>
                  {item.title}
                </h3>
              </div>

              <p
                className="font-mono text-sm text-gray-400 leading-relaxed transition-colors duration-300"
                style={{ transform: `translateZ(${isHovered ? 20 : 0}px)` }}
              >
                {item.desc}
              </p>

              <div
                className="flex flex-wrap gap-2 mt-auto pt-4"
                style={{ transform: `translateZ(${isHovered ? 30 : 10}px)` }}
              >
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className={`font-mono text-[10px] px-2 py-1 border transition-all duration-300 uppercase tracking-wider ${isHovered ? 'border-[#ccff00]/30 text-[#ccff00] bg-[#ccff00]/5' : 'border-white/10 text-gray-500'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Corner Accents */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l rounded-tl-xl transition-colors duration-300 ${isHovered ? 'border-[#ccff00]' : 'border-white/20'}`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r rounded-br-xl transition-colors duration-300 ${isHovered ? 'border-[#ccff00]' : 'border-white/20'}`} />
          </div>
        );
      })}
    </div>
  );
};
