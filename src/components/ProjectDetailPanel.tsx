import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Github, ExternalLink, X } from 'lucide-react';
import { Project } from '../constants/projects';

export const ProjectDetailPanel = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (project) {
      gsap.fromTo(panelRef.current, { x: '100%', opacity: 0 }, { x: '0%', opacity: 1, duration: 0.6, ease: 'power4.out' });
    }
  }, [project]);
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-[500] pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
      <div ref={panelRef} className="absolute right-0 top-0 h-full w-[520px] bg-zinc-950 border-l border-white/10 pointer-events-auto overflow-y-auto" style={{ transform: 'translateX(100%)' }}>
        <div className="relative">
          <img src={`https://picsum.photos/seed/project${project.img}/1040/600?grayscale`} alt={project.title} className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
          <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:border-[#ccff00] hover:text-[#ccff00] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-12 flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-6xl font-display uppercase text-white">{project.title}</h3>
              <p className="font-mono text-[#ccff00] text-lg uppercase tracking-widest mt-2">{project.type} - {project.year}</p>
            </div>
          </div>
          <p className="font-mono text-gray-400 text-xl leading-relaxed border-t border-white/10 pt-8">{project.desc}</p>
          <div className="flex flex-wrap gap-3">
            {project.tech.map(t => (
              <span key={t} className="font-mono text-sm px-4 py-2 border border-white/20 rounded-full text-gray-300 hover:border-[#ccff00] hover:text-[#ccff00] transition-colors">{t}</span>
            ))}
          </div>
          <div className="flex gap-4 border-t border-white/10 pt-8">
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono font-bold text-black bg-[#ccff00] px-8 py-4 rounded-full hover:scale-105 transition-transform uppercase tracking-widest">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-white border border-white/20 px-8 py-4 rounded-full hover:border-[#ccff00] hover:text-[#ccff00] transition-colors uppercase tracking-widest">
              <ExternalLink className="w-4 h-4" /> View Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
