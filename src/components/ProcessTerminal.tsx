import React, { useState, useEffect, useRef } from 'react';

interface ProcessStep {
  line: number;
  keyword: string;
  variable: string;
  function: string;
  comment: string[];
  duration: string;
}

const steps: ProcessStep[] = [
  {
    line: 3,
    keyword: 'let',
    variable: 'idea',
    function: 'find_problem()',
    comment: [
      'Find a problem nobody has solved',
      'Identify why existing solutions fail',
      'See what others cannot see yet'
    ],
    duration: 'IDEA'
  },
  {
    line: 4,
    keyword: 'let',
    variable: 'arch',
    function: 'design(idea)',
    comment: [
      'Design the breakthroughs',
      'Map the system from first principles',
      'Every decision is mine'
    ],
    duration: 'DESIGN'
  },
  {
    line: 5,
    keyword: 'let',
    variable: 'code',
    function: 'ai_execute(arch)',
    comment: [
      'AI as force multiplier',
      'I architect, AI implements',
      'The speed is exponential'
    ],
    duration: 'BUILD'
  },
  {
    line: 6,
    keyword: '',
    variable: '',
    function: 'ship(code)',
    comment: [
      'Deploy, test, iterate',
      '90% accuracy, zero regrets',
      'The system speaks for itself'
    ],
    duration: 'SHIP'
  }
];

export const ProcessTerminal = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [typedLines, setTypedLines] = useState<number[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect on mount
  useEffect(() => {
    const allLines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentLine = 0;

    const typeNextLine = () => {
      if (currentLine < allLines.length) {
        setTypedLines(prev => [...prev, allLines[currentLine]]);
        currentLine++;
        setTimeout(typeNextLine, 150 + Math.random() * 100);
      }
    };

    setTimeout(typeNextLine, 500);
  }, []);

  const isLineTyped = (line: number) => typedLines.includes(line);

  return (
    <div ref={terminalRef} className="w-full h-full flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
      {/* Terminal Frame */}
      <div className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex-1 flex flex-col">
        {/* Title Bar */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-gray-400 ml-4">process.ts</span>
          </div>
          <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            SYS.PROCESS_FLOW
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-6 font-mono text-sm overflow-hidden">
          {/* Function declaration */}
          <div className={`transition-opacity duration-300 ${isLineTyped(1) ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[#c586c0]">fn</span>
            <span className="text-[#dcdcaa]"> build_impossible_idea</span>
            <span className="text-gray-400">()</span>
            <span className="text-gray-400"> {'{'}</span>
          </div>

          {/* Empty line */}
          <div className={`h-6 transition-opacity duration-300 ${isLineTyped(2) ? 'opacity-100' : 'opacity-0'}`} />

          {/* Process Steps */}
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`group relative transition-all duration-500 ${
                isLineTyped(step.line) ? 'opacity-100' : 'opacity-0'
              } ${activeStep === idx ? 'bg-[#ccff00]/5' : ''}`}
              onMouseEnter={() => setActiveStep(idx)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Code Line */}
              <div className="flex items-center">
                {/* Line Number */}
                <span className="w-8 text-gray-600 text-xs mr-4 select-none">{step.line}</span>
                
                {/* Code */}
                {step.keyword && (
                  <span className="text-[#569cd6]">{step.keyword} </span>
                )}
                {step.variable && (
                  <>
                    <span className="text-[#9cdcfe]">{step.variable}</span>
                    <span className="text-gray-400"> = </span>
                  </>
                )}
                <span className="text-[#dcdcaa]">{step.function}</span>
                <span className="text-gray-400">;</span>

                {/* Active indicator */}
                {activeStep === idx && (
                  <span className="ml-4 text-[#ccff00] text-xs animate-pulse">← ACTIVE</span>
                )}
              </div>

              {/* Expanded Details */}
              <div className={`overflow-hidden transition-all duration-500 ${
                activeStep === idx ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}>
                <div className="pl-12 border-l-2 border-[#ccff00]/30 ml-4 py-2">
                  {step.comment.map((line, i) => (
                    <div key={i} className="text-gray-500 text-xs mb-1 flex items-center gap-2">
                      <span className="text-[#ccff00]">╰─</span>
                      <span>{line}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[#ccff00] text-xs">╰─</span>
                    <span className="text-[#ccff00] text-xs font-bold">Duration: {step.duration}</span>
                  </div>
                </div>
              </div>

              {/* Active line glow */}
              {activeStep === idx && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.5)] rounded-l" />
              )}
            </div>
          ))}

          {/* Empty line */}
          <div className={`h-6 transition-opacity duration-300 ${isLineTyped(7) ? 'opacity-100' : 'opacity-0'}`} />

          {/* Return statement */}
          <div className={`transition-opacity duration-300 ${isLineTyped(8) ? 'opacity-100' : 'opacity-0'}`}>
            <span className="w-8 text-gray-600 text-xs mr-4 select-none inline-block">8</span>
            <span className="text-[#569cd6]">return</span>
            <span className="text-[#ce9178]"> "done"</span>
            <span className="text-gray-400">;</span>
          </div>

          {/* Closing brace */}
          <div className={`transition-opacity duration-300 ${isLineTyped(9) ? 'opacity-100' : 'opacity-0'}`}>
            <span className="w-8 text-gray-600 text-xs mr-4 select-none inline-block">9</span>
            <span className="text-gray-400">{'}'}</span>
          </div>

          {/* Cursor */}
          <div className={`mt-4 ${typedLines.length >= 9 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[#ccff00]">{'>'}</span>
            <span className={`inline-block w-2 h-4 bg-[#ccff00] ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>

        {/* Output Section */}
        <div className={`bg-[#1a1a1a] px-6 py-4 border-t border-white/5 transition-opacity duration-1000 ${
          typedLines.length >= 9 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#28c840] text-xs">▶</span>
            <span className="text-gray-500 text-xs uppercase tracking-widest">Output</span>
          </div>
          <div className="text-[#28c840] text-sm font-mono">
            3 systems built, 0 regrets. The impossible became real.
          </div>
        </div>
      </div>
    </div>
  );
};
