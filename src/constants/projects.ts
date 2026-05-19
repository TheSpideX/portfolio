export interface Project {
  title: string;
  type: string;
  year: string;
  desc: string;
  tech: string[];
  img: string;
  link: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'SystemSim',
    type: 'Distributed Systems Platform',
    year: '2025',
    img: '10',
    desc: 'A reality-grounded distributed systems simulator. Innovated an ACID-like Isolation architecture for emergent resource contention. Built 4 universal base engines in Go with 90-92% hardware-level accuracy using real Intel/Samsung profiles.',
    tech: ['Go', 'gRPC', 'WebSocket', 'PostgreSQL', 'Redis', 'Docker', 'React'],
    link: 'https://github.com/TheSpideX/SystemSim'
  },
  {
    title: 'NoRegret',
    type: 'Mesh Networking Stack',
    year: '2025',
    img: '20',
    desc: 'A serverless mesh networking stack that operates without internet or cellular infrastructure. Architected a Digital Factory C++ engine using the Actor model with NASA-grade FEC and Yggdrasil routing for resilient packet processing.',
    tech: ['C++', 'Kotlin', 'JNI', 'CAF', 'Go', 'Yggdrasil', 'Noise Protocol'],
    link: 'https://github.com/TheSpideX/NoRegret'
  },
  {
    title: 'This Portfolio',
    type: 'Interactive Canvas',
    year: '2026',
    img: '30',
    desc: 'The portfolio you are exploring right now. An infinite canvas with physics simulation, 3D terrain, audio synthesis, and draggable nodes. Designed the architecture, used AI to build it. Proof that I can make anything I can imagine.',
    tech: ['React', 'Three.js', 'Matter.js', 'GSAP', 'Web Audio', 'Tailwind'],
    link: '#'
  },
  {
    title: 'Next Project',
    type: 'Your Idea Here',
    year: '2026',
    img: '40',
    desc: 'Have a problem that needs a novel solution? I architect systems that do not exist yet, then build them. Tell me what you need.',
    tech: ['Any Stack', 'Any Domain', 'AI-Augmented'],
    link: '#contact'
  }
];
