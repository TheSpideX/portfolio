import React, { useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'THE IMPOSSIBLE IDEA',
    shortTitle: 'IDEA',
    desc: 'Find a problem nobody has solved. Identify why existing solutions fail. See what others cannot see yet.',
    details: ['Problem Analysis', 'Gap Identification', 'Novel Approach']
  },
  {
    num: '02',
    title: 'ARCHITECTURE',
    shortTitle: 'ARCH',
    desc: 'Design the breakthroughs. Map the system from first principles. Every decision is mine — the architecture, the algorithms, the isolation model.',
    details: ['System Design', 'Breakthrough Logic', 'First Principles']
  },
  {
    num: '03',
    title: 'AI-AUGMENTED BUILD',
    shortTitle: 'BUILD',
    desc: 'Execute rapidly using AI as a force multiplier. I architect, AI implements. The idea is mine, the speed is exponential.',
    details: ['AI Tools', 'Rapid Iteration', 'Any Stack']
  },
  {
    num: '04',
    title: 'SHIP & PROVE',
    shortTitle: 'SHIP',
    desc: 'Deploy, test, and prove it works. The system speaks for itself — 90% accuracy, zero infrastructure dependency, novel patterns.',
    details: ['Validation', 'Metrics', 'Documentation']
  }
];

export const ProcessPipeline = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div style={{
      display: 'flex',
      gap: '3px',
      height: '100%',
      width: '100%'
    }}>
      {steps.map((step, idx) => {
        const isActive = idx === activeIdx;
        return (
          <div
            key={idx}
            onMouseEnter={() => setActiveIdx(idx)}
            style={{
              flex: isActive ? 4 : 1,
              background: isActive 
                ? 'rgba(204,255,0,0.04)'
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isActive ? 'rgba(204,255,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Active left bar */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: isActive ? '3px' : '1px',
              background: isActive ? '#ccff00' : 'rgba(255,255,255,0.08)',
              boxShadow: isActive ? '0 0 20px rgba(204,255,0,0.5)' : 'none',
              transition: 'all 0.5s ease'
            }} />

            {/* Grid pattern for active */}
            {isActive && (
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.02,
                backgroundImage: 'linear-gradient(rgba(204,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,1) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                pointerEvents: 'none'
              }} />
            )}

            {/* Collapsed state */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              opacity: isActive ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              {/* Step number */}
              <span style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ccff00',
                letterSpacing: '3px',
                opacity: 0.8
              }}>
                {step.num}
              </span>

              {/* Vertical line */}
              <div style={{
                width: '1px',
                height: '32px',
                background: 'linear-gradient(to bottom, rgba(204,255,0,0.4), transparent)'
              }} />

              {/* Vertical title - more visible */}
              <span style={{
                fontFamily: 'Anton, sans-serif',
                fontSize: '22px',
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'uppercase',
                letterSpacing: '5px',
                writingMode: 'vertical-lr',
                transform: 'rotate(180deg)',
                textShadow: '0 0 10px rgba(255,255,255,0.15)'
              }}>
                {step.shortTitle}
              </span>

              {/* Bottom indicator */}
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                border: '1px solid rgba(204,255,0,0.3)',
                background: 'rgba(204,255,0,0.1)',
                marginTop: '4px'
              }} />
            </div>

            {/* Expanded state */}
            <div style={{
              position: 'absolute',
              inset: 0,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.4s ease 0.1s'
            }}>
              {/* Top bar with phase indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontFamily: 'monospace',
                  color: '#ccff00',
                  fontSize: '12px',
                  letterSpacing: '3px',
                  fontWeight: 600
                }}>
                  {step.num}
                </span>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(204,255,0,0.15)'
                }} />
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  PHASE {step.num}
                </span>
              </div>

              {/* Title with accent underline */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 'clamp(24px, 2.5vw, 36px)',
                  textTransform: 'uppercase',
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: '8px'
                }}>
                  {step.title}
                </h3>
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: '#ccff00',
                  boxShadow: '0 0 10px rgba(204,255,0,0.3)'
                }} />
              </div>

              {/* Description */}
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: '#777',
                lineHeight: 1.9,
                marginBottom: '24px',
                flex: 1,
                borderLeft: '1px solid rgba(204,255,0,0.1)',
                paddingLeft: '16px'
              }}>
                {step.desc}
              </p>

              {/* Tags with terminal style */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '20px'
              }}>
                {step.details.map((detail, i) => (
                  <span key={i} style={{
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    padding: '5px 12px',
                    background: 'rgba(204,255,0,0.05)',
                    border: '1px solid rgba(204,255,0,0.1)',
                    color: 'rgba(204,255,0,0.6)',
                    borderRadius: '3px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px'
                  }}>
                    {`> ${detail}`}
                  </span>
                ))}
              </div>

              {/* Bottom status bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.04)'
              }}>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '8px', 
                  color: '#444', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px' 
                }}>
                  PROCESS.{step.num}
                </span>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '8px', 
                  color: '#444', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px' 
                }}>
                  {idx + 1}/{steps.length}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
