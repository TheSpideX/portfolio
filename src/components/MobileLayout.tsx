import React, { useState, useEffect } from 'react';
import { ScrambleText } from './ScrambleText';
import { ExpertiseSection } from './ExpertiseSection';
import { ProcessTimeline } from './ProcessTimeline';
import { Github, ExternalLink, ArrowUpRight, MapPin, Clock, Copy, Check, Monitor, X } from 'lucide-react';

const projects = [
  { title: 'SystemSim', type: 'Distributed Systems Platform', year: '2025', desc: 'A reality-grounded distributed systems simulator. Innovated an ACID-like Isolation architecture for emergent resource contention.', tech: ['Go', 'gRPC', 'WebSocket', 'PostgreSQL', 'Redis', 'Docker'], link: 'https://github.com/TheSpideX/SystemSim' },
  { title: 'NoRegret', type: 'Mesh Networking Stack', year: '2025', desc: 'A serverless mesh networking stack that operates without internet or cellular infrastructure.', tech: ['C++', 'Kotlin', 'JNI', 'CAF', 'Go', 'Yggdrasil'], link: 'https://github.com/TheSpideX/NoRegret' },
  { title: 'This Portfolio', type: 'Interactive Canvas', year: '2026', desc: 'An infinite canvas with physics simulation, 3D terrain, audio synthesis, and draggable nodes.', tech: ['React', 'Three.js', 'Matter.js', 'GSAP', 'Web Audio'], link: '#' },
];

export const MobileLayout = () => {
  const [badgeIdx, setBadgeIdx] = useState(0);
  const badges = ['Open for Freelance', 'IIT Graduate', 'AI-Augmented Builder'];
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState('');
  const [showDesktopDialog, setShowDesktopDialog] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBadgeIdx(i => (i + 1) % badges.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    updateTime();
    const iv = setInterval(updateTime, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contact@spidexlab.me');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-10 min-h-screen text-white font-sans">
      {/* Desktop Recommendation Dialog */}
      {showDesktopDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-[#ccff00]" />
              </div>
              <button 
                onClick={() => setShowDesktopDialog(false)}
                className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:border-[#ccff00]/50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <h3 className="text-2xl font-display uppercase text-white mb-3">Better on Desktop</h3>
            <p className="font-mono text-sm text-gray-400 leading-relaxed mb-6">
              This portfolio features an infinite canvas with physics simulation, 3D terrain, and interactive nodes — best experienced on a desktop browser.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowDesktopDialog(false)}
                className="w-full bg-[#ccff00] text-black font-mono font-bold text-sm py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-widest"
              >
                Continue on Mobile
              </button>
              <p className="font-mono text-[10px] text-gray-600 text-center uppercase tracking-widest">
                Fully optimized for desktop browsers
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-20">
        <div className="mb-6 inline-flex items-center gap-3 bg-[#ccff00]/10 border border-[#ccff00]/30 px-4 py-2 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#ccff00]">
            {badges[badgeIdx]}
          </span>
        </div>
        
        <h1 className="text-[80px] font-display uppercase leading-[0.85] tracking-tighter mb-2">SYSTEMS</h1>
        <h1 className="text-[80px] font-display uppercase leading-[0.85] tracking-tighter mb-2 outline-text">BREAKTHROUGH</h1>
        <h1 className="text-[80px] font-display uppercase leading-[0.85] tracking-tighter mb-8">ENGINEER</h1>
        
        <p className="font-mono text-sm text-gray-400 leading-relaxed mb-8 max-w-md">
          I design novel system architectures and build what others say can't be done. Every project starts as an impossible idea — I make it real.
        </p>
        
        <div className="flex gap-6">
          <div className="text-center">
            <div className="font-display text-3xl text-[#ccff00]">3+</div>
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Novel Systems</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl text-[#ccff00]">Top 0.1%</div>
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">JEE Advanced</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl text-[#ccff00]">8.59</div>
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">CGPA / 10</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16">
        <h2 className="text-5xl font-display uppercase text-[#ccff00] mb-8">About</h2>
        
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="font-mono text-xs text-[#ccff00] uppercase tracking-[0.2em]">Available for Freelance</span>
          </div>
          <h3 className="text-4xl font-display uppercase text-white mb-2">KUMAR SATYAM</h3>
          <p className="font-mono text-sm text-gray-500 uppercase tracking-[0.18em] mb-4">Systems Architect & Idea-First Builder</p>
          <p className="font-mono text-xs text-gray-400 leading-relaxed">
            I architect novel systems and use AI to build them fast. Every project I touch starts as an impossible idea — I design the breakthroughs, then execute. Not limited to any language or domain.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-950 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#ccff00]" />
            <div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">India</div>
              <div className="font-mono text-[9px] text-gray-600">IIT Graduate, India</div>
            </div>
          </div>
          <div className="bg-zinc-950 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#ccff00]" />
            <div>
              <div className="font-mono text-[10px] text-gray-400 uppercase">Local Time</div>
              <div className="font-mono text-[9px] text-gray-600">{time}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#ccff00] rounded-2xl p-6 text-black">
          <div className="grid grid-cols-2 gap-4">
            <div><div className="font-display text-3xl">3</div><div className="font-mono text-[10px] uppercase tracking-widest opacity-70">Novel Systems</div></div>
            <div><div className="font-display text-3xl">300+</div><div className="font-mono text-[10px] uppercase tracking-widest opacity-70">LeetCode Solved</div></div>
            <div><div className="font-display text-3xl">8.59</div><div className="font-mono text-[10px] uppercase tracking-widest opacity-70">CGPA / 10</div></div>
            <div><div className="font-display text-3xl">∞</div><div className="font-mono text-[10px] uppercase tracking-widest opacity-70">Coffees</div></div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section className="px-6 py-16">
        <h2 className="text-5xl font-display uppercase text-white mb-2">Systems I Built</h2>
        <span className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-8 block">2024 — 2026</span>
        
        {projects.map((project, idx) => (
          <a key={idx} href={project.link} target="_blank" rel="noopener noreferrer" className="block mb-4">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#ccff00]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-gray-600 text-sm">0{idx + 1}</span>
                  <h3 className="text-3xl font-display uppercase text-white">{project.title}</h3>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-gray-500">{project.year}</span>
                <span className="font-mono text-xs text-gray-400">{project.type}</span>
              </div>
              <p className="font-mono text-xs text-gray-400 leading-relaxed mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="font-mono text-[10px] px-2 py-1 border border-white/10 text-gray-500 rounded">{t}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Expertise Section */}
      <section className="px-6 py-16">
        <h2 className="text-5xl font-display uppercase text-[#ccff00] mb-8">Expertise</h2>
        <ExpertiseSection />
      </section>

      {/* Process Section */}
      <section className="px-6 py-16">
        <h2 className="text-5xl font-display uppercase text-[#ccff00] mb-8">How I Work</h2>
        <ProcessTimeline />
      </section>

      {/* Manifesto Section */}
      <section className="px-6 py-16">
        <div className="bg-[#ccff00] rounded-2xl p-8 text-black">
          <h2 className="text-3xl font-display uppercase leading-snug">
            I build things that should not exist. Every project starts as an impossible idea — a problem nobody has solved, a system nobody has architected. I do not accept limitations on language, domain, or tool. I design the breakthroughs, then I execute. AI is my force multiplier, not my replacement. The architecture is mine. The vision is mine. The result speaks for itself.
          </h2>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16 pb-32">
        <h2 className="text-5xl font-display uppercase text-white mb-8">Let's Talk</h2>
        
        <button
          onClick={handleCopyEmail}
          className="w-full bg-[#ccff00] text-black font-mono font-bold text-lg py-4 rounded-full mb-6 flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Copied!' : 'contact@spidexlab.me'}
        </button>

        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://github.com/TheSpideX" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-gray-400 hover:text-[#ccff00] transition-colors uppercase tracking-widest">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/kumar-satyam-64a807255" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-gray-400 hover:text-[#ccff00] transition-colors uppercase tracking-widest">
            LinkedIn
          </a>
          <a href="https://leetcode.com/u/spideX/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-gray-400 hover:text-[#ccff00] transition-colors uppercase tracking-widest">
            LeetCode
          </a>
        </div>
      </section>
    </div>
  );
};
