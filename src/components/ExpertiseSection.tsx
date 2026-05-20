import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

interface WordData {
  word: string;
  label: string;
  sublabel: string;
  desc: string;
  color: string;
}

const words: WordData[] = [
  { 
    word: 'HIRE', 
    label: 'DON\'T HIRE ME', 
    sublabel: 'UNLESS YOU WANT RESULTS', 
    desc: 'I don\'t have 5+ years of experience. I have something better.',
    color: '#ff6b6b'
  },
  { 
    word: 'PROVE', 
    label: 'GIVE ME A PROJECT', 
    sublabel: 'AND WATCH ME BUILD IT', 
    desc: 'One project is all I need. The work speaks for itself.',
    color: '#ccff00'
  },
  { 
    word: 'SHIP', 
    label: 'I SHIP FAST', 
    sublabel: 'AI-AUGMENTED. ZERO LIMITS.', 
    desc: 'I architect. AI executes. The speed is exponential.',
    color: '#00ffcc'
  }
];

// Generate points for letters - BIGGER scale
const getLetterPath = (letter: string, x: number, y: number, size: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const s = size;
  
  const p = (px: number, py: number) => points.push({ x: x + px * s, y: y + py * s });

  switch (letter) {
    case 'H':
      p(0, 0); p(0, 1); p(0, 2); p(0, 3); p(0, 4);
      p(1, 0); p(1, 1); p(1, 2); p(1, 3); p(1, 4);
      p(0.5, 2); p(1, 2);
      break;
    case 'I':
      p(0, 0); p(0.5, 0); p(0.5, 1); p(0.5, 2); p(0.5, 3); p(0.5, 4); p(0, 4);
      break;
    case 'R':
      p(0, 0); p(0, 1); p(0, 2); p(0, 3); p(0, 4);
      p(0.5, 0); p(1, 0.5); p(1, 1); p(0.5, 1.5);
      p(0.7, 1.8); p(1, 2.5);
      break;
    case 'E':
      p(1, 0); p(0, 0); p(0, 1); p(0, 2); p(0, 3); p(0, 4); p(1, 4);
      p(0, 2); p(0.7, 2);
      break;
    case 'P':
      p(0, 0); p(0, 1); p(0, 2); p(0, 3); p(0, 4);
      p(0.5, 0); p(1, 0.5); p(1, 1); p(0.5, 1.5);
      break;
    case 'O':
      p(0.5, 0); p(0, 0.5); p(0, 1.5); p(0.5, 2); p(1, 1.5); p(1, 0.5); p(0.5, 0);
      break;
    case 'V':
      p(0, 0); p(0.5, 2); p(1, 0);
      break;
    case 'S':
      p(1, 0.3); p(0.5, 0); p(0, 0.5); p(0.5, 1); p(1, 1.5); p(0.5, 2); p(0, 1.7);
      break;
    case 'A':
      p(0, 2.5); p(0.5, 0); p(1, 2.5);
      p(0.3, 1.3); p(0.7, 1.3);
      break;
    case 'C':
      p(1, 0.3); p(0.5, 0); p(0, 0.5); p(0, 1.5); p(0.5, 2); p(1, 1.7);
      break;
    case 'F':
      p(1, 0); p(0, 0); p(0, 1); p(0, 2); p(0, 3); p(0, 4); p(0, 2); p(0.7, 2);
      break;
    case 'T':
      p(0, 0); p(1, 0); p(0.5, 0); p(0.5, 1); p(0.5, 2); p(0.5, 3); p(0.5, 4);
      break;
    default:
      p(0, 0); p(0.5, 1); p(0, 2);
  }
  
  return points;
};

// Generate all points for a word
const getWordPoints = (word: string, centerX: number, centerY: number, size: number = 60): { x: number; y: number }[] => {
  const allPoints: { x: number; y: number }[] = [];
  const letterSpacing = size * 1.6;
  const startX = centerX - (word.length * letterSpacing) / 2;
  
  for (let i = 0; i < word.length; i++) {
    const letterPoints = getLetterPath(word[i], startX + i * letterSpacing, centerY - size, size / 2);
    allPoints.push(...letterPoints);
  }
  
  return allPoints;
};

export const ExpertiseSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentPointsRef = useRef<Point[]>([]);
  const targetPointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);
  const animFrameRef = useRef<number>(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  const initPoints = useCallback((wordIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 40;
    
    const points = getWordPoints(words[wordIdx].word, centerX, centerY, 70);
    
    // If no current points, initialize directly
    if (currentPointsRef.current.length === 0) {
      currentPointsRef.current = points.map(p => ({ ...p, targetX: p.x, targetY: p.y }));
    }
    
    targetPointsRef.current = points.map(p => ({ ...p, targetX: p.x, targetY: p.y }));
  }, []);

  const spawnParticles = useCallback((count: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentWord = words[currentIdx];
    const time = Date.now() / 1000;

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(204,255,0,0.015)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Update points with spring physics
    const currentPoints = currentPointsRef.current;
    const targetPoints = targetPointsRef.current;

    // Interpolate between current and target
    for (let i = 0; i < currentPoints.length; i++) {
      if (i < targetPoints.length) {
        const dx = targetPoints[i].x - currentPoints[i].x;
        const dy = targetPoints[i].y - currentPoints[i].y;
        
        currentPoints[i].x += dx * 0.06;
        currentPoints[i].y += dy * 0.06;
      }
    }

    // Draw strings connecting points - THICKER and more visible
    ctx.strokeStyle = currentWord.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    
    for (let i = 0; i < currentPoints.length - 1; i++) {
      const p1 = currentPoints[i];
      const p2 = currentPoints[i + 1];
      
      // Only connect if points are close (same letter)
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        
        // Add vibration - more intense when transitioning
        const vibration = Math.sin(time * 4 + i * 0.5) * (isTransitioning ? 6 : 2);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 + vibration;
        
        ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
        ctx.stroke();
        
        // Glow effect
        ctx.strokeStyle = currentWord.color;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = currentWord.color;
      }
    }
    ctx.globalAlpha = 1;

    // Draw points - BIGGER with glow
    currentPoints.forEach((point, i) => {
      const pulse = Math.sin(time * 2.5 + i * 0.3) * 0.3 + 0.7;
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = currentWord.color;
      ctx.globalAlpha = 0.08;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Inner glow
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = currentWord.color;
      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Core dot
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = currentWord.color;
      ctx.globalAlpha = pulse;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw particles
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.015;
      
      const radius = Math.max(0.1, 3 * p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life * 0.6);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw clean text below strings - no box, just text
    const textY = canvas.height - 100;
    
    // Main label - large and bold
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Anton, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText(currentWord.label, canvas.width / 2, textY);
    
    // Sublabel - colored accent
    ctx.fillStyle = currentWord.color;
    ctx.font = '10px monospace';
    ctx.fillText(currentWord.sublabel, canvas.width / 2, textY + 25);
    
    // Small decorative line
    ctx.strokeStyle = currentWord.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 40, textY + 35);
    ctx.lineTo(canvas.width / 2 + 40, textY + 35);
    ctx.stroke();
    ctx.globalAlpha = 1;

    animFrameRef.current = requestAnimationFrame(animate);
  }, [currentIdx, isTransitioning]);

  const transition = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    spawnParticles(40, words[currentIdx].color);
    
    const nextIdx = (currentIdx + 1) % words.length;
    
    // Scramble current points
    currentPointsRef.current.forEach(p => {
      p.x += (Math.random() - 0.5) * 150;
      p.y += (Math.random() - 0.5) * 150;
    });
    
    setTimeout(() => {
      setCurrentIdx(nextIdx);
      initPoints(nextIdx);
      spawnParticles(40, words[nextIdx].color);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 400);
  }, [currentIdx, isTransitioning, initPoints, spawnParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initPoints(currentIdx);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    // Auto-rotate every 4 seconds
    autoRotateRef.current = setInterval(() => {
      transition();
    }, 4000);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [animate, initPoints, currentIdx]);

  return (
    <div 
      className="relative w-full h-full" 
      style={{ background: '#0a0a0a' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            transition();
          }}
          className="font-mono text-[10px] px-4 py-2 border transition-all duration-300 uppercase tracking-[3px] hover:opacity-80"
          style={{
            borderColor: words[currentIdx].color + '50',
            color: words[currentIdx].color,
            background: words[currentIdx].color + '15',
            boxShadow: `0 0 20px ${words[currentIdx].color}20`
          }}
        >
          Next →
        </button>
        <div className="flex gap-2">
          {words.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: idx === currentIdx ? words[currentIdx].color : 'rgba(255,255,255,0.1)',
                boxShadow: idx === currentIdx ? `0 0 10px ${words[currentIdx].color}` : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
