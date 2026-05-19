import React, { useRef, useState, useEffect, useCallback, createContext, useContext, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Move, Github, Linkedin, Twitter, Dribbble, ExternalLink, ArrowUpRight, X, Copy, Check, MapPin, Clock, Volume2, VolumeX, Box, LayoutGrid, ArrowRight, Sparkles } from 'lucide-react';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { ProcessTimeline } from './components/ProcessTimeline';
import { ExpertiseSection } from './components/ExpertiseSection';
import { ScrambleText } from './components/ScrambleText';
import { MobileLayout } from './components/MobileLayout';
import { Navigation } from './components/Navigation';
import { GravityButton } from './components/GravityButton';
import { ProjectDetailPanel } from './components/ProjectDetailPanel';
import { CustomCursor } from './components/CustomCursor';
import { FlashlightSection } from './components/FlashlightSection';
import { Magnetic } from './components/Magnetic';
import { InitialCentering } from './components/InitialCentering';
import { KeyboardNavigation } from './components/KeyboardNavigation';
import { useIsMobile } from './hooks/useIsMobile';
import { useAudio } from './contexts/AudioContext';
import { NAV_ITEMS, NODE_ORDER } from './constants/navItems';
import { Project, PROJECTS } from './constants/projects';
import { PhysicsContextType, InteractiveNodeProps } from './types';
import { PhysicsContext } from './contexts/PhysicsContext';

// Lazy load heavy components (Three.js, Matter.js)
const Background3D = React.lazy(() => import('./components/Background3D'));
const PhysicsStack = React.lazy(() => import('./components/PhysicsStack'));
import InteractiveNode from './components/InteractiveNode';
import Matter from 'matter-js';

// Re-export for backward compatibility
export { PhysicsContext };



// Easter Egg Component
const EasterEgg = () => {
  const { zoomToElement } = useControls();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let keys = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      keys += e.key.toLowerCase();
      if (keys.length > 4) keys = keys.slice(-4);
      if (keys === 'void' && !unlocked) {
        setUnlocked(true);
        // Play a little success animation then fly to the secret node
        setTimeout(() => {
          zoomToElement('node-secret', 1.2, 2500, "easeInOutCubic");
        }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked, zoomToElement]);

  return (
    <InteractiveNode
      id="node-secret"
      startX={4500}
      startY={-1500}
      width={800}
      height={500}
      zIndex={50}
      delay={0}
      innerClassName={`transition-all duration-1000 ${unlocked ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
    >
      <div className="w-full h-full bg-black border border-[#ccff00] p-20 rounded-3xl shadow-[0_0_150px_rgba(204,255,0,0.4)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/void/800/800')] opacity-20 mix-blend-luminosity animate-pulse" />
        <div className="relative z-10">
          <h2 className="text-9xl font-display uppercase text-[#ccff00] mb-8 tracking-tighter" style={{ transform: 'translateZ(60px)' }}>THE VOID</h2>
          <p className="font-mono text-xl text-white leading-relaxed" style={{ transform: 'translateZ(30px)' }}>
            You found the secret node.
            <br /><br />
            "In the infinite canvas of the web, curiosity is the only compass."
          </p>
        </div>
      </div>
    </InteractiveNode>
  );
};

const StartNodeContent = ({ started, onStart, loadingProgress }: { started: boolean, onStart: (mode: 'explore' | 'direct') => void, loadingProgress: number }) => {
  const { zoomToElement } = useControls();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (loadingProgress >= 100 && !started) {
      const tl = gsap.timeline();
      tl.fromTo('.split-reveal',
        { y: 60, opacity: 0, rotationX: -20 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.8 }
      );
    }
  }, { scope: containerRef, dependencies: [loadingProgress, started] });

  const handleSelect = (id: string, w: number, h: number, mode: 'explore' | 'direct') => {
    gsap.to('.split-reveal', {
      y: -40, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power3.in"
    });

    setTimeout(() => {
      onStart(mode);
      setTimeout(() => {
        const sw = window.innerWidth;
        const sh = window.innerHeight;
        const targetScale = Math.min((sw * 0.84) / w, (sh * 0.84) / h, 1.4);
        zoomToElement(id, targetScale, 1500, 'easeInOutCubic');
      }, 50);
    }, 500);
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050505] rounded-[40px] border border-white/10 overflow-hidden relative flex shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>

      {/* Loading Overlay */}
      <div
        className="absolute inset-0 z-50 bg-[#050505] flex flex-col justify-between p-12 transition-transform duration-1000 delay-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: loadingProgress >= 100 ? 'translateY(-100%)' : 'translateY(0%)', transformStyle: 'preserve-3d' }}
      >
        <div className="flex justify-between items-start font-mono text-xs uppercase tracking-widest text-white/50" style={{ transform: 'translateZ(40px)' }}>
          <span>System Initialization</span>
          <span className="text-[#ccff00]">{loadingProgress < 100 ? 'Loading...' : 'Complete'}</span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto" style={{ transform: 'translateZ(80px)' }}>

          {/* Main Counter */}
          <div className="relative flex flex-col items-center justify-center w-full py-20 mb-12">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#ccff00]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-start gap-6 z-10">
              <span className="text-[240px] font-display leading-none text-white tracking-tighter font-light tabular-nums drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                {loadingProgress.toString().padStart(3, '0')}
              </span>
              <span className="text-3xl font-mono text-[#ccff00] mt-10">%</span>
            </div>

            {/* Decorative technical brackets */}
            <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[40px]" />
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-[#ccff00]/50 rounded-tl-[40px]" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-[#ccff00]/50 rounded-tr-[40px]" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-[#ccff00]/50 rounded-bl-[40px]" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-[#ccff00]/50 rounded-br-[40px]" />
          </div>

          {/* High-tech Progress Bar */}
          <div className="w-full relative" style={{ transform: 'translateZ(60px)' }}>
            {/* Track */}
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
              {/* Fill */}
              <div
                className="absolute top-0 left-0 h-full bg-[#ccff00] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(204,255,0,0.6)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            {/* Glowing Leading Edge */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[2px] h-8 bg-white transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,255,255,1)]"
              style={{ left: `calc(${loadingProgress}% - 1px)` }}
            />

            {/* Decorative ticks */}
            <div className="absolute top-6 left-0 w-full flex justify-between px-1">
              {[0, 25, 50, 75, 100].map(tick => (
                <div key={tick} className="flex flex-col items-center gap-3">
                  <div className={`w-[1px] h-2 ${loadingProgress >= tick ? 'bg-[#ccff00]' : 'bg-white/20'} transition-colors duration-500`} />
                  <span className={`font-mono text-[10px] ${loadingProgress >= tick ? 'text-[#ccff00]' : 'text-white/20'} transition-colors duration-500`}>{tick}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Split Screen */}
      <button
        onClick={() => handleSelect('node-hero', 1100, 700, 'explore')}
        className="group relative flex-1 flex flex-col justify-between p-12 border-r border-white/10 text-left overflow-hidden no-drag cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Hover Fill */}
        <div className="absolute inset-0 bg-[#ccff00] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />

        {/* Massive Background Number */}
        <div className="split-reveal absolute -bottom-12 -right-12 z-0 pointer-events-none">
          <div className="text-[300px] font-display leading-none text-white/5 group-hover:text-black/10 transition-colors duration-700" style={{ transform: 'translateZ(20px)' }}>
            01
          </div>
        </div>

        <div className="split-reveal flex justify-between items-start z-10 w-full">
          <div className="w-full flex justify-between items-start" style={{ transform: 'translateZ(60px)' }}>
            <div className="font-mono text-xs uppercase tracking-widest text-[#ccff00] group-hover:text-black/60 transition-colors duration-700">
              Path One
            </div>
            <ArrowRight className="w-8 h-8 text-white group-hover:text-black transition-all duration-700 -rotate-45 group-hover:rotate-0" />
          </div>
        </div>

        <div className="z-10 w-full" style={{ transformStyle: 'preserve-3d' }}>
          <div className="split-reveal">
            <h2 className="text-7xl font-display uppercase mb-6 text-white group-hover:text-black transition-colors duration-700 tracking-tight" style={{ transform: 'translateZ(100px)' }}>
              Exploration<br/>Mode
            </h2>
          </div>
          <div className="split-reveal">
            <p className="font-mono text-sm text-white/50 group-hover:text-black/70 transition-colors duration-700 max-w-[280px] leading-relaxed" style={{ transform: 'translateZ(80px)' }}>
              Free-roam 3D canvas. Discover hidden nodes organically to unlock navigation tabs.
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => handleSelect('node-hero', 1100, 700, 'direct')}
        className="group relative flex-1 flex flex-col justify-between p-12 text-left overflow-hidden no-drag cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Hover Fill */}
        <div className="absolute inset-0 bg-[#ccff00] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />

        {/* Massive Background Number */}
        <div className="split-reveal absolute -bottom-12 -right-12 z-0 pointer-events-none">
          <div className="text-[300px] font-display leading-none text-white/5 group-hover:text-black/10 transition-colors duration-700" style={{ transform: 'translateZ(20px)' }}>
            02
          </div>
        </div>

        <div className="split-reveal flex justify-between items-start z-10 w-full">
          <div className="w-full flex justify-between items-start" style={{ transform: 'translateZ(60px)' }}>
            <div className="font-mono text-xs uppercase tracking-widest text-[#ccff00] group-hover:text-black/60 transition-colors duration-700">
              Path Two
            </div>
            <ArrowRight className="w-8 h-8 text-white group-hover:text-black transition-all duration-700 -rotate-45 group-hover:rotate-0" />
          </div>
        </div>

        <div className="z-10 w-full" style={{ transformStyle: 'preserve-3d' }}>
          <div className="split-reveal">
            <h2 className="text-7xl font-display uppercase mb-6 text-white group-hover:text-black transition-colors duration-700 tracking-tight" style={{ transform: 'translateZ(100px)' }}>
              Direct<br/>Access
            </h2>
          </div>
          <div className="split-reveal">
            <p className="font-mono text-sm text-white/50 group-hover:text-black/70 transition-colors duration-700 max-w-[280px] leading-relaxed" style={{ transform: 'translateZ(80px)' }}>
              All navigation tabs are unlocked from the start. Instantly jump to any section.
            </p>
          </div>
        </div>
      </button>

    </div>
  );
};

export default function App() {
  const isMobile = useIsMobile();

  // Mobile layout with 3D background
  if (isMobile) {
    return <MobileApp />;
  }

  return <DesktopApp />;
}

// Separate mobile component to avoid hooks order issues
function MobileApp() {
  const transformRef = useRef({ x: -1000, y: -800, scale: 0.6 });

  return (
    <div className="relative w-full h-screen text-white font-sans overflow-x-hidden overflow-y-auto">
      <Suspense fallback={null}>
        <Background3D transformRef={transformRef} />
      </Suspense>
      <div className="grid-bg fixed inset-0 pointer-events-none" />
      <div className="noise-bg fixed inset-0 pointer-events-none" />
      <MobileLayout />
    </div>
  );
}

// Desktop component with all the original functionality
function DesktopApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [experienceStarted, setExperienceStarted] = useState(false);
  const transformRef = useRef({ x: -1000, y: -800, scale: 0.6 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { startHum, stopHum, isMuted, toggleMute, playUnlock, playWhoosh } = useAudio();
  const [discoveredNodes, setDiscoveredNodes] = useState<string[]>(['node-hero']);
  const discoveredNodesRef = useRef<Set<string>>(new Set(['node-hero']));

  const handleStart = (mode: 'explore' | 'direct') => {
    setExperienceStarted(true);
    playWhoosh();
    if (mode === 'direct') {
      const allIds = NAV_ITEMS.map(n => n.id);
      setDiscoveredNodes(allIds);
      discoveredNodesRef.current = new Set(allIds);
    }
  };

  const engineRef = useRef<Matter.Engine | null>(null);
  if (!engineRef.current) {
    const newEngine = Matter.Engine.create();
    newEngine.gravity.x = 0;
    newEngine.gravity.y = 0;
    engineRef.current = newEngine;
  }
  const engine = engineRef.current;

  useEffect(() => {
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const wallOptions = { isStatic: true, render: { visible: false }, friction: 0.5, restitution: 0.2 };
    const boundaries = [
      Matter.Bodies.rectangle(2500, -100, 5200, 200, wallOptions), // Top
      Matter.Bodies.rectangle(2500, 4100, 5200, 200, wallOptions), // Bottom
      Matter.Bodies.rectangle(-100, 2000, 200, 4200, wallOptions), // Left
      Matter.Bodies.rectangle(5100, 2000, 200, 4200, wallOptions), // Right
    ];
    Matter.World.add(engine.world, boundaries);

    return () => {
      Matter.Runner.stop(runner);
      Matter.World.remove(engine.world, boundaries);
    };
  }, [engine]);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Preloader Animation
    tl.to({ value: 0 }, {
      value: 100,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: function () {
        setLoadingProgress(Math.round(this.targets()[0].value));
      }
    });

  }, { scope: containerRef });

  useGSAP(() => {
    if (experienceStarted) {
      const tl = gsap.timeline();

      tl.from(':not(#node-start) > .node-element', {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 1.5,
        stagger: 0.1,
        ease: "power3.out"
      })
      .from('.hero-text-line', {
        y: 150,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        rotation: 5,
        transformOrigin: "left top"
      }, "-=1")
      .from('.hero-subtext', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8");
    }
  }, { scope: containerRef, dependencies: [experienceStarted] });

  return (
    <PhysicsContext.Provider value={{ engine, transformRef, setIsDragging }}>
      <div ref={containerRef} className="relative w-full h-screen text-white font-sans overflow-hidden">
        <CustomCursor />
        <Suspense fallback={null}>
          <Background3D transformRef={transformRef} />
        </Suspense>
        <div className="grid-bg fixed inset-0 pointer-events-none" />
        <div className="noise-bg fixed inset-0 pointer-events-none" />
        <ProjectDetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />

        {/* Audio Toggle Button */}
        <button
          onClick={toggleMute}
          className="fixed bottom-8 right-8 z-[10000] bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-full text-white hover:text-[#ccff00] hover:border-[#ccff00]/50 transition-all duration-300 group"
          data-cursor="SOUND"
          data-cursor-size="6"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isMuted ? 'Sound Off' : 'Sound On'}
          </span>
        </button>

        {/* UI Overlay */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none mix-blend-difference flex flex-col items-center gap-2">
          <Move className="w-6 h-6 animate-bounce text-[#ccff00]" />
          <p className="font-mono text-xs tracking-widest uppercase">Drag to pan • Scroll to zoom</p>
        </div>

        <GravityButton />

        <TransformWrapper
          panning={{ disabled: isDragging }}
          initialScale={1.0}
          initialPositionX={-1050}
          initialPositionY={-1350}
          minScale={0.15}
          maxScale={2}
          limitToBounds={false}
          wheel={{ step: 0.08 }}
          onPanningStart={startHum}
          onPanningStop={stopHum}
          onTransformed={(ref) => {
            transformRef.current = {
              x: ref.state.positionX,
              y: ref.state.positionY,
              scale: ref.state.scale
            };

            const sw = window.innerWidth;
            const sh = window.innerHeight;
            const cx = (sw / 2 - ref.state.positionX) / ref.state.scale;
            const cy = (sh / 2 - ref.state.positionY) / ref.state.scale;
            const threshold = Math.max(sw, sh) / ref.state.scale * 0.7;
            let newDiscoveries = false;

            NAV_ITEMS.forEach(n => {
              if (discoveredNodesRef.current.has(n.id)) return;
              const nodeCx = n.x + n.w / 2;
              const nodeCy = n.y + n.h / 2;
              const dist = Math.hypot(cx - nodeCx, cy - nodeCy);
              if (dist < threshold) {
                discoveredNodesRef.current.add(n.id);
                newDiscoveries = true;
              }
            });
            if (newDiscoveries) {
              playUnlock();
              setDiscoveredNodes(Array.from(discoveredNodesRef.current));
            }
          }}
        >
          <InitialCentering />
          <KeyboardNavigation transformRef={transformRef} />
          {experienceStarted && <Navigation discoveredNodes={discoveredNodes} />}
          <TransformComponent wrapperStyle={{ width: "100vw", height: "100vh", cursor: "grab" }}>
            <div className="w-[5000px] h-[4000px] relative">

              {/* NODE START: Loading & Selection */}
              <InteractiveNode id="node-start" startX={1500} startY={-1000} width={1200} height={800} zIndex={20} delay={0} innerClassName={`bg-transparent relative transition-all duration-1000 ${experienceStarted ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <StartNodeContent started={experienceStarted} onStart={handleStart} loadingProgress={loadingProgress} />
              </InteractiveNode>

              {/* PORTFOLIO NODES (Always in DOM, visibility controlled by GSAP/CSS) */}
              <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ${experienceStarted ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* SVG Connections with Flowing Animation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" style={{ zIndex: 0 }}>
                    <style>{`
                      @keyframes flow { to { stroke-dashoffset: -24; } }
                      .path-flow { animation: flow 1.4s linear infinite; }
                    `}</style>
                    {/* Contact → About */}
                    <path className="path-flow" d="M 950 525 Q 1300 350 1700 395" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* About → Manifesto */}
                    <path className="path-flow" d="M 2800 395 Q 3050 360 3300 450" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Hero → About */}
                    <path className="path-flow" d="M 2050 1500 Q 2100 1000 2250 710" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Hero → Process */}
                    <path className="path-flow" d="M 1500 1850 Q 1275 1850 1050 1850" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Hero → Work */}
                    <path className="path-flow" d="M 2600 1850 Q 2800 1800 3000 1850" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Hero → Manifesto */}
                    <path className="path-flow" d="M 2600 1560 Q 3100 1100 3500 850" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Process → Expertise */}
                    <path className="path-flow" d="M 575 2600 Q 575 2750 600 2900" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Hero → TechStack */}
                    <path className="path-flow" d="M 2050 2200 Q 2100 2575 2200 2950" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                    {/* Expertise → TechStack */}
                    <path className="path-flow" d="M 1250 3375 Q 1420 3250 1600 3100" stroke="#ccff00" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                  </svg>
                  <EasterEgg />

                  {/* NODE 1: HERO (CENTER - initial focal point) */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-hero" startX={1500} startY={1500} width={1100} height={700} zIndex={10} delay={0} innerClassName="bg-black/40 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-2xl relative">



                {/* Rotating Role Badge */}
                {(() => {
                  const [badgeIdx, setBadgeIdx] = useState(0);
                  const badges = ['Open for Freelance', 'IIT Dhanbad CSE', 'AI-Augmented Builder'];
                  useEffect(() => {
                    const interval = setInterval(() => setBadgeIdx(i => (i + 1) % badges.length), 3000);
                    return () => clearInterval(interval);
                  }, []);
                  return (
                    <div className="hero-subtext mb-6 inline-flex items-center gap-3 bg-[#ccff00]/10 border border-[#ccff00]/30 px-6 py-2 rounded-full" style={{ transform: 'translateZ(80px)' }}>
                      <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                      <span className="font-mono text-sm uppercase tracking-widest text-[#ccff00]">
                        <ScrambleText text={badges[badgeIdx]} key={badgeIdx} />
                      </span>
                    </div>
                  );
                })()}
                {/* Particle-spawning hero words */}
                {(['SYSTEMS', 'BREAKTHROUGH', 'ENGINEER'] as const).map((word, idx) => {
                  const isOutline = word === 'BREAKTHROUGH';
                  const zDepth = [120, 160, 100][idx];
                  return (
                    <div key={word} className="text-reveal-mask overflow-hidden pb-8 pt-4 -mt-4 relative" style={{ transform: `translateZ(${zDepth}px)` }}>
                      <h1
                        className={`hero-text-line text-[150px] font-display uppercase leading-none tracking-tighter ${isOutline ? 'outline-text hover-expand' : 'text-white'} relative`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          for (let p = 0; p < 8; p++) {
                            const particle = document.createElement('div');
                            particle.className = 'letter-particle';
                            particle.style.left = `${rect.left + Math.random() * rect.width}px`;
                            particle.style.top = `${rect.top + Math.random() * rect.height}px`;
                            particle.style.position = 'fixed';
                            document.body.appendChild(particle);
                            gsap.to(particle, {
                              x: (Math.random() - 0.5) * 200,
                              y: -Math.random() * 150 - 50,
                              opacity: 0,
                              scale: 0,
                              duration: 0.8 + Math.random() * 0.5,
                              ease: 'power2.out',
                              onComplete: () => particle.remove()
                            });
                          }
                        }}
                      >
                        <ScrambleText text={word} />
                      </h1>
                    </div>
                  );
                })}

                <div className="hero-subtext mt-8 flex justify-between items-end gap-8 border-t border-white/20 pt-6" style={{ transform: 'translateZ(60px)' }}>
                  <p className="font-mono text-xl max-w-lg text-gray-400">
                    I design novel system architectures and build what others say can't be done. Every project starts as an impossible idea - I make it real.
                  </p>
                  {/* Stats strip */}
                  <div className="flex gap-8 shrink-0">
                    {[{ n: '3+', l: 'Novel Systems' }, { n: 'AIR 5007', l: 'JEE Advanced' }, { n: '8.59', l: 'CGPA / 10' }].map(s => (
                      <div key={s.l} className="text-center">
                        <div className="font-display text-4xl text-[#ccff00]">{s.n}</div>
                        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </InteractiveNode>

              {/* NODE 2: MANIFESTO (FAR TOP RIGHT) */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-manifesto" startX={3300} startY={50} width={1200} height={800} zIndex={10} delay={0.2} innerClassName="bg-[#ccff00] text-black p-20 rounded-3xl shadow-[0_0_100px_rgba(204,255,0,0.2)] border border-[#ccff00]/50 relative">
                {(() => {
                  const manifestoRef = useRef<HTMLDivElement>(null);
                  const signatureRef = useRef<SVGPathElement>(null);
                  const containerRef2 = useRef<HTMLDivElement>(null);

                  useEffect(() => {
                    if (!manifestoRef.current) return;
                    const words = manifestoRef.current.querySelectorAll('.manifesto-word');
                    // Animate immediately on render (since the component mounts precisely when its loader skeleton finishes)
                    const tween = gsap.fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'power2.out', delay: 0.5 });

                    let timeoutId: NodeJS.Timeout;
                    if (signatureRef.current) {
                      timeoutId = setTimeout(() => {
                        signatureRef.current?.classList.add('animate');
                      }, 1000);
                    }

                    return () => {
                      tween.kill();
                      clearTimeout(timeoutId);
                    };
                  }, []);

                  const handleMouseMove = (e: React.MouseEvent) => {
                    if (!containerRef2.current) return;
                    const rect = containerRef2.current.getBoundingClientRect();
                    const xRatio = (e.clientX - rect.left) / rect.width;
                    const hueShift = xRatio * 30 - 15;
                    containerRef2.current.style.filter = `hue-rotate(${hueShift}deg)`;
                  };

                  return (
                    <div ref={containerRef2} onMouseMove={handleMouseMove} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'hue-rotate(0deg)'; }} className="w-full h-full relative transition-[filter] duration-300" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Background pattern layer (clipped) */}
                      <div className="absolute -inset-20 rounded-3xl overflow-hidden pointer-events-none" style={{ transform: 'translateZ(-50px)' }}>
                        <div className="w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-multiply" />
                      </div>

                      {/* Giant quotation marks */}
                      <div className="absolute top-4 left-6 text-[160px] font-display leading-none text-black/10 pointer-events-none select-none" style={{ transform: 'translateZ(-30px) rotate(-5deg)' }}>“</div>
                      <div className="absolute bottom-4 right-6 text-[160px] font-display leading-none text-black/10 pointer-events-none select-none" style={{ transform: 'translateZ(-30px) rotate(5deg)' }}>”</div>

                      <div ref={manifestoRef} style={{ transformStyle: 'preserve-3d' }}>
                        <h2 className="text-5xl font-display uppercase leading-snug relative z-10" style={{ transform: 'translateZ(100px)', transformStyle: 'preserve-3d' }}>
                          {("I build things that should not exist. Every project starts as an impossible idea - a problem nobody has solved, a system nobody has architected. I do not accept limitations on language, domain, or tool. I design the breakthroughs, then I execute. AI is my force multiplier, not my replacement. The architecture is mine. The vision is mine. The result speaks for itself.").split(' ').map((word, i) => (
                            <span key={i} className="manifesto-word inline-block mr-4" style={{ transformStyle: 'preserve-3d' }}>
                              <span className="manifesto-word-hover cursor-default">{word}</span>
                            </span>
                          ))}
                        </h2>
                      </div>

                      {/* SVG Signature */}
                      <svg className="absolute bottom-8 right-12 w-48 h-16 z-10" viewBox="0 0 200 60" style={{ transform: 'translateZ(60px)' }}>
                        <path ref={signatureRef} className="signature-path" d="M10 45 C30 10, 50 50, 70 30 S100 10, 120 35 S150 50, 170 25 Q180 15, 190 30" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  );
                })()}
              </InteractiveNode>

              {/* NODE 3: WORK (RIGHT, beside hero) */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-work" startX={3000} startY={1450} width={1600} height={900} zIndex={10} delay={0.4} innerClassName="bg-black/40 backdrop-blur-md rounded-3xl p-14 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-baseline mb-8" style={{ transform: 'translateZ(150px)' }}>
                  <h2 className="text-[120px] font-display uppercase tracking-wide text-white">Systems I Built</h2>
                  <span className="font-mono text-gray-500 text-xl uppercase tracking-widest">2024 - 2026</span>
                </div>
                <div className="flex flex-col w-full border-t border-white/20">
                  {PROJECTS.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedProject(item)}
                      className="group relative border-b border-white/20 py-10 flex justify-between items-center cursor-pointer hover:px-12 transition-all duration-500 hover:bg-[#ccff00]/5 backdrop-blur-sm no-drag"
                      data-cursor="VIEW"
                      style={{ transform: `translateZ(${60 + index * 20}px)`, transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center gap-8 relative z-10" style={{ transform: 'translateZ(40px)' }}>
                        <span className="font-mono text-gray-600 text-xl w-8">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-7xl font-display uppercase text-white group-hover:text-[#ccff00] transition-colors">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-6 relative z-10" style={{ transform: 'translateZ(20px)' }}>
                        <span className="font-mono text-gray-500 text-lg">{item.year}</span>
                        <span className="font-mono text-xl text-gray-400 group-hover:text-[#ccff00] transition-colors">{item.type}</span>
                        <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover:text-[#ccff00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      {/* Hover Image Reveal */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] aspect-video pointer-events-none opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 z-0 overflow-hidden rounded-2xl shadow-2xl" style={{ transform: 'translate(-50%, -50%) translateZ(-50px)' }}>
                        <img src={`https://picsum.photos/seed/brutalist${item.img}/1000/600?grayscale`} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  ))}
                </div>
              </InteractiveNode>

              {/* NODE 4: EXPERTISE (FAR BOTTOM LEFT) */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-expertise" startX={200} startY={2900} width={1050} height={960} zIndex={10} delay={0.6} innerClassName="[transform-style:preserve-3d]">
                <FlashlightSection className="bg-zinc-950 p-20 rounded-3xl border border-white/10 h-full w-full shadow-2xl flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="flex justify-between items-end mb-12 shrink-0" style={{ transform: 'translateZ(120px)' }}>
                    <h2 className="text-[100px] font-display uppercase tracking-wide text-[#ccff00] leading-none">Expertise</h2>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hidden md:block">CORE_MODULES</div>
                  </div>
                  <div className="flex-1 min-h-0" style={{ transformStyle: 'preserve-3d' }}>
                    <ExpertiseSection />
                  </div>
                </FlashlightSection>
              </InteractiveNode>

              {/* NODE 5: CONTACT (FAR TOP LEFT) */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-contact" startX={100} startY={100} width={850} height={850} shape="circle" zIndex={10} delay={0.8} innerClassName="rounded-full relative object-cover bg-black border-[3px] border-white text-white shadow-2xl overflow-hidden group">
                <div
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-none transition-colors duration-700"
                  data-cursor="HELLO"
                  data-cursor-size="8"
                  data-cursor-inverted="true"
                >
                  <Magnetic>
                    <h2 className="text-[120px] font-display leading-[0.8] uppercase tracking-tighter text-center mix-blend-difference z-10 select-none">
                      LET'S TALK
                    </h2>
                  </Magnetic>

                  {/* Copy Email Button */}
                  <div className="absolute bottom-24 z-20 flex flex-col items-center gap-4">
                    {(() => {
                      const [copied, setCopied] = useState(false);
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText('satyamiitdnbd@gmail.com');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="font-mono text-lg border-b-2 border-white/30 pb-1 hover:text-[#ccff00] hover:border-[#ccff00] transition-colors mix-blend-difference cursor-pointer"
                        >
                          {copied ? 'COPIED TO CLIPBOARD' : 'satyamiitdnbd@gmail.com'}
                        </button>
                      );
                    })()}
                    
                    {/* Social Links */}
                    <div className="flex gap-4">
                      <a href="https://github.com/TheSpideX" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-gray-500 hover:text-[#ccff00] transition-colors uppercase tracking-widest mix-blend-difference">
                        GitHub
                      </a>
                      <a href="https://www.linkedin.com/in/kumar-satyam-64a807255" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-gray-500 hover:text-[#ccff00] transition-colors uppercase tracking-widest mix-blend-difference">
                        LinkedIn
                      </a>
                      <a href="https://leetcode.com/u/spideX/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-gray-500 hover:text-[#ccff00] transition-colors uppercase tracking-widest mix-blend-difference">
                        LeetCode
                      </a>
                    </div>
                  </div>

                  {/* Decorative rotating border inside */}
                  <div className="absolute inset-4 rounded-full border border-white/20 border-dashed animate-[spin_30s_linear_infinite] pointer-events-none opacity-50" />
                </div>
              </InteractiveNode>

              {/* NODE 6: ABOUT - Bento Grid */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-about" startX={1700} startY={80} width={1100} height={700} zIndex={10} delay={1.0} innerClassName="bg-black/40 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/10">
                <div className="w-full h-full grid grid-cols-12 grid-rows-6 gap-4" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Block 1: Name and Title */}
                  <div className="col-span-7 row-span-4 rounded-2xl p-10 flex flex-col justify-between group relative" style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}>
                    {/* Background Layer */}
                    <div className="absolute inset-0 bg-zinc-950 rounded-2xl border border-white/5 group-hover:border-[#ccff00]/50 transition-colors overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-2 mb-2" style={{ transform: 'translateZ(40px)' }}>
                      <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                      <span className="font-mono text-xs text-[#ccff00] uppercase tracking-[0.2em] relative z-10">Available for Freelance</span>
                    </div>
                    <h2 className="text-[100px] font-display uppercase text-white leading-[0.85] tracking-tighter mb-4 transition-transform duration-500 group-hover:scale-105 origin-left relative z-10 w-full" style={{ transform: 'translateZ(100px)' }}>
                      <ScrambleText text="KUMAR" /><br />
                      <span className="text-[#ccff00]">SATYAM</span>
                    </h2>
                    <p className="font-mono text-gray-500 text-sm uppercase tracking-[0.18em] relative z-10" style={{ transform: 'translateZ(60px)' }}>
                      Systems Architect &amp; Idea-First Builder
                    </p>
                  </div>

                  {/* Block 2: Profile Image with colorize on hover + live clock */}
                  <div className="col-span-5 row-span-3 rounded-2xl relative group" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
                    {/* Background Layer */}
                    <div className="absolute inset-0 bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden pointer-events-none">
                      <img src="/myself.png" alt="Kumar Satyam" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 group-hover:grayscale-0 grayscale" />
                      <div className="absolute inset-0 bg-[#ccff00] mix-blend-overlay opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    </div>
                    {/* Live Clock */}
                    {(() => {
                      const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                      useEffect(() => {
                        const iv = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000);
                        return () => clearInterval(iv);
                      }, []);
                      return (
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md font-mono text-xs text-[#ccff00] px-3 py-1.5 rounded-full border border-[#ccff00]/30 flex items-center gap-2" style={{ transform: 'translateZ(60px)' }}>
                          <Clock className="w-3 h-3" />
                          {time}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Block 3: Stats with counter animation */}
                  {(() => {
                    const statsRef = useRef<HTMLDivElement>(null);
                    const [counted, setCounted] = useState(false);
                    const [vals, setVals] = useState([0, 0, 0]);
                    useEffect(() => {
                      if (!statsRef.current) return;
                      if (!counted) {
                        setCounted(true);
                        const targets = [3, 300, 859];
                        targets.forEach((target, i) => {
                          gsap.to({ v: 0 }, { v: target, duration: 1.5, delay: 0.8 + i * 0.2, ease: 'power2.out', onUpdate: function () { setVals(prev => { const n = [...prev]; n[i] = Math.round(this.targets()[0].v); return n; }); } });
                        });
                      }
                    }, [counted]);
                    return (
                      <div ref={statsRef} className="col-span-5 row-span-3 rounded-2xl p-8 flex flex-col justify-center gap-6 text-black group relative" style={{ transform: 'translateZ(80px)', transformStyle: 'preserve-3d' }}>
                        {/* Background Layer */}
                        <div className="absolute inset-0 bg-[#ccff00] rounded-2xl border border-[#ccff00] group-hover:bg-[#b3ff00] transition-colors overflow-hidden pointer-events-none">
                          <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500">
                            <div className="text-[150px] font-display leading-none">{vals[0]}+</div>
                          </div>
                        </div>
                        {/* Content */}
                        <div className="grid grid-cols-2 gap-6 relative z-10" style={{ transform: 'translateZ(50px)' }}>
                          <div><div className="font-display text-5xl">{vals[0]}</div><div className="font-mono text-xs uppercase tracking-widest mt-1 opacity-70">Novel Systems</div></div>
                          <div><div className="font-display text-5xl">{vals[1]}+</div><div className="font-mono text-xs uppercase tracking-widest mt-1 opacity-70">LeetCode Solved</div></div>
                          <div><div className="font-display text-5xl">{vals[2] / 100}</div><div className="font-mono text-xs uppercase tracking-widest mt-1 opacity-70">CGPA / 10</div></div>
                          <div><div className="font-display text-5xl">∞</div><div className="font-mono text-xs uppercase tracking-widest mt-1 opacity-70">Coffees</div></div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Block 4: Bio, Location Map, & Spotify */}
                  <div className="col-span-7 row-span-2 rounded-2xl p-6 flex gap-6 group relative" style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}>
                    {/* Background Layer */}
                    <div className="absolute inset-0 bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden pointer-events-none">
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ccff00] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                    </div>
                    {/* Left: Bio */}
                    <div className="flex-1 flex flex-col justify-between relative z-10" style={{ transform: 'translateZ(30px)' }}>
                      <p className="font-mono text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                        I architect novel systems and use AI to build them fast. Every project I touch starts as an impossible idea - I design the breakthroughs, then execute. Not limited to any language or domain.
                      </p>
                      <div className="flex gap-2 relative z-10 mt-2">
                        {['Freelance', 'Open Source', 'System Design'].map(tag => (
                          <span key={tag} className="font-mono text-[10px] px-3 py-1 bg-white/5 text-gray-300 rounded-full group-hover:border-[#ccff00]/30 border border-transparent transition-colors uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                    </div>
                    {/* Right: Location + Spotify */}
                    <div className="flex flex-col gap-3 w-[180px] shrink-0 relative z-10" style={{ transform: 'translateZ(60px)' }}>
                      {/* Location Map Dot */}
                      <div className="bg-zinc-900/80 rounded-xl p-3 border border-white/5 flex items-center gap-3 hover:border-[#ccff00]/50 transition-colors">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-[#ccff00]" />
                          <div className="absolute inset-0 bg-[#ccff00]/20 rounded-full animate-ping" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Dhanbad</div>
                          <div className="font-mono text-[9px] text-gray-600">IIT Dhanbad, India</div>
                        </div>
                      </div>
                      {/* Spotify Now Playing */}
                      <div className="bg-zinc-900/80 rounded-xl p-3 border border-white/5 flex items-center gap-3 hover:border-green-500/50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">♪</div>
                        <div className="overflow-hidden flex-1">
                          <div className="font-mono text-[10px] text-white truncate">SystemSim</div>
                          <div className="font-mono text-[9px] text-gray-500 truncate">Currently Building</div>
                        </div>
                        {/* Equalizer */}
                        <div className="flex items-end gap-[2px] h-4">
                          {[0.2, 0.5, 0.3, 0.7, 0.4].map((d, i) => (
                            <div key={i} className="w-[2px] bg-green-500 rounded-full eq-bar" style={{ height: '4px', animationDelay: `${d}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </InteractiveNode>

              {/* NODE 7: TECH STACK - Physics Marquee */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-stack" startX={1600} startY={2950} width={1600} height={600} zIndex={10} delay={1.2}>
                <Suspense fallback={null}>
                  <PhysicsStack width={1600} height={600} />
                </Suspense>
              </InteractiveNode>

              {/* NODE 8: PROCESS - Timeline (LEFT, beside Hero) */}
              <InteractiveNode loadingProgress={loadingProgress} id="node-process" startX={100} startY={1500} width={950} height={840} zIndex={10} delay={1.4} innerClassName="bg-black border border-white/10 p-14 rounded-3xl relative flex flex-col [transform-style:preserve-3d]">
                {/* BG watermark */}
                <div className="absolute right-4 bottom-2 font-display text-[260px] text-white/[0.025] leading-none pointer-events-none select-none" style={{ transform: 'translateZ(-50px)' }}>04</div>
                <div className="flex justify-between items-end mb-14 shrink-0" style={{ transform: 'translateZ(100px)' }}>
                  <h2 className="text-[72px] font-display uppercase text-[#ccff00] leading-none">How I Work</h2>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hidden md:block">SYS.PROCESS_FLOW</div>
                </div>
                {/* Timeline */}
                <div className="flex-1 min-h-0" style={{ transformStyle: 'preserve-3d' }}>
                  <ProcessTimeline />
                </div>
              </InteractiveNode>

              {/* Ambient Background Elements - scattered across full canvas */}
              <div className="absolute top-[1600px] left-[1800px] w-[1200px] h-[1200px] bg-[#ccff00] rounded-full mix-blend-overlay filter blur-[300px] opacity-8 pointer-events-none" />
              <div className="absolute top-[400px] left-[3800px] w-[1000px] h-[1000px] bg-purple-600 rounded-full mix-blend-overlay filter blur-[250px] opacity-8 pointer-events-none" />
              <div className="absolute top-[2800px] left-[2000px] w-[900px] h-[900px] bg-blue-900 rounded-full mix-blend-overlay filter blur-[200px] opacity-10 pointer-events-none" />
              <div className="absolute top-[200px] left-[400px] w-[600px] h-[600px] bg-emerald-900 rounded-full mix-blend-overlay filter blur-[200px] opacity-8 pointer-events-none" />
              </div>

            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </PhysicsContext.Provider >
  );
}
