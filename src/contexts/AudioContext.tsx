import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playTick: () => void;
  playClick: () => void;
  playUnlock: () => void;
  playWhoosh: () => void;
  startHum: () => void;
  stopHum: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode[]>([]);
  const humGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (!next) {
        initAudio();
      } else {
        stopHum();
      }
      return next;
    });
  };

  // Crisp, high-tech glass tap
  const playTick = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }, [isMuted]);

  // Deep, satisfying mechanical/digital confirmation
  const playClick = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(300, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.1);
  }, [isMuted]);

  // Shimmering, ascending chime for unlocking nodes
  const playUnlock = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C major chord
    const duration = 0.6;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + duration);
    });
  }, [isMuted]);

  // Low-pass filtered sweep for zooming/transitions
  const playWhoosh = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start();
  }, [isMuted]);

  // Richer drone with detuned oscillators
  const startHum = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    if (humOscRef.current.length === 0) {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 1);
      
      const freqs = [45, 45.5, 90]; // Deep fundamental, slight detune, and octave
      
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        humOscRef.current.push(osc);
      });

      gain.connect(ctx.destination);
      humGainRef.current = gain;
    }
  }, [isMuted]);

  const stopHum = useCallback(() => {
    if (!audioCtxRef.current || !humGainRef.current || humOscRef.current.length === 0) return;
    const ctx = audioCtxRef.current;
    const gain = humGainRef.current;
    
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    
    setTimeout(() => {
      try {
        humOscRef.current.forEach(osc => {
          osc.stop();
          osc.disconnect();
        });
        gain.disconnect();
      } catch (e) {}
      humOscRef.current = [];
      humGainRef.current = null;
    }, 500);
  }, []);

  // Global interaction listeners for hover and click sounds
  useEffect(() => {
    let lastTickTime = 0;
    
    const handleMouseOver = (e: MouseEvent) => {
      if (isMuted) return;
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('button, a, .cursor-pointer, [data-cursor]');
      
      if (interactiveEl && !interactiveEl.hasAttribute('data-hovered')) {
        const now = performance.now();
        // Debounce to prevent rapid firing on nested elements
        if (now - lastTickTime > 50) {
          playTick();
          lastTickTime = now;
        }
        
        interactiveEl.setAttribute('data-hovered', 'true');
        interactiveEl.addEventListener('mouseleave', () => {
          interactiveEl.removeAttribute('data-hovered');
        }, { once: true });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (isMuted) return;
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .cursor-pointer')) {
        playClick();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, [isMuted, playTick, playClick]);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playTick, playClick, playUnlock, playWhoosh, startHum, stopHum }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
