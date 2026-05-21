import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Project, PROJECTS } from '../constants/projects';
import { Magnetic } from './Magnetic';

export function WorkSection() {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-baseline mb-12 shrink-0">
        <h2 className="text-[120px] font-display uppercase tracking-wide text-[#ccff00]">Systems Built</h2>
        <span className="font-mono text-gray-500 text-xl uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hidden md:block">SYS.PROJECT_ARCHIVE</span>
      </div>

      <div className="flex flex-1 gap-12 overflow-hidden min-h-0 relative">
        {/* Left Side: List */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-4 pb-12 no-drag no-wheel relative min-h-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {PROJECTS.map((item, index) => {
            const isActive = activeProject.title === item.title;
            return (
              <div
                key={index}
                onClick={() => setActiveProject(item)}
                className={`group py-6 px-8 rounded-2xl cursor-pointer transition-all duration-500 border relative overflow-hidden ${isActive ? 'bg-zinc-900 border-[#ccff00]/50' : 'bg-black/20 border-white/5 hover:bg-zinc-900 hover:border-white/20'}`}
                data-cursor="SELECT"
              >
                {/* Active glow */}
                {isActive && <div className="absolute inset-0 bg-[#ccff00]/5 pointer-events-none" />}
                
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <span className={`font-mono text-sm tracking-widest transition-colors ${isActive ? 'text-[#ccff00]' : 'text-gray-500'}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-xs text-gray-600 group-hover:text-gray-400 transition-colors uppercase">{item.year}</span>
                </div>
                <h3 className={`text-4xl font-display uppercase transition-colors relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{item.title}</h3>
                <p className={`font-mono text-xs tracking-widest uppercase mt-4 transition-colors relative z-10 ${isActive ? 'text-[#ccff00]' : 'text-gray-600'}`}>{item.type}</p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Details & Image */}
        <div className="flex-1 bg-zinc-900/50 rounded-3xl border border-white/10 overflow-hidden relative flex no-drag min-h-0 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col"
            >
              {/* GitHub icon in top right */}
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-6 right-6 z-20 p-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full hover:bg-zinc-800 hover:border-white/30 transition-all"
                  data-cursor="GITHUB"
                  data-cursor-size="2.5"
                  data-cursor-icon="github"
                >
                  <FaGithub className="w-6 h-6 text-white" />
                </a>
              )}
              
              <div className="h-[45%] overflow-hidden relative shrink-0">
                <img 
                  src={`https://picsum.photos/seed/tech${activeProject.img}/1200/600?grayscale`} 
                  alt={activeProject.title} 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-8 left-12">
                  <span className="font-mono text-[#ccff00] text-sm uppercase tracking-widest">
                    {activeProject.type}
                  </span>
                  <h3 className="text-7xl font-display uppercase tracking-tight text-white leading-none mt-2">
                    {activeProject.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto no-wheel min-h-0 bg-zinc-950" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>                
                <div className="p-12 flex flex-col justify-start min-h-full relative">
                  <p className="text-gray-400 text-2xl leading-relaxed font-light font-sans mb-10 max-w-3xl">
                    {activeProject.desc}
                  </p>
                  
                  <div className="mb-12">
                    <h4 className="font-mono text-gray-500 text-sm uppercase tracking-widest mb-6 flex items-center gap-4">
                      <span className="w-8 h-[1px] bg-white/20"></span>
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {activeProject.tech.map((t, i) => (
                        <span key={i} className="px-5 py-2.5 bg-black/50 border border-white/10 rounded-full font-mono text-sm text-gray-300 shadow-inner">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-8 flex flex-wrap items-center gap-6 shrink-0 pb-4">
                    {activeProject.link && activeProject.link !== '#' && (
                      <Magnetic>
                        <a 
                          href={activeProject.link}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-[#ccff00] text-black px-8 py-4 rounded-full font-mono font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors w-max"
                        >
                          Deploy Live <ArrowUpRight className="w-5 h-5" />
                        </a>
                      </Magnetic>
                    )}
                    {activeProject.github && (
                      <Magnetic>
                        <a 
                          href={activeProject.github}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-zinc-800 text-white border border-white/10 px-8 py-4 rounded-full font-mono font-bold text-sm uppercase tracking-widest hover:bg-zinc-700 hover:border-white/30 transition-colors w-max"
                          data-cursor="GITHUB"
                          data-cursor-size="2.5"
                          data-cursor-icon="github"
                        >
                          <FaGithub className="w-5 h-5" />
                          Source Code
                        </a>
                      </Magnetic>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
