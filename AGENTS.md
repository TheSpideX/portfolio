# Project Core Matrix: Kumar Satyam — Expressive Portfolio

## 1. Concrete System Stack
- **Engine/Runtime:** Node.js v22 TypeScript / Vite
- **Framework Core:** React 19 + Tailwind CSS v4 + GSAP + Three.js (R3F)
- **Physics Engine:** Matter.js (client-side physics for draggable nodes)
- **Hosting:** Vercel (spidexlab.me)
- **Test Infrastructure:** TypeScript type checking (`npm run lint`)

## 2. Structural Codebase Map
- `src/App.tsx` → Desktop layout — infinite canvas with physics nodes, navigation, cursor
- `src/components/MobileLayout.tsx` → Mobile layout — vertical scroll with desktop recommendation dialog
- `src/components/Background3D.tsx` → Three.js wireframe terrain + floating particles
- `src/components/ExpertiseSection.tsx` → Expertise/skills grid cards (responsive)
- `src/components/PhysicsStack.tsx` → Matter.js physics-based tech stack
- `src/components/ProcessTimeline.tsx` → Work process accordion timeline
- `src/components/ScrambleText.tsx` → Text scramble hover effect
- `src/hooks/useIsMobile.ts` → Mobile detection hook
- `src/contexts/AudioContext.tsx` → Web Audio API synthesized UI sounds
- `src/index.css` → Global styles, custom cursor, animations
- `public/` → Static assets (favicon.svg, og-image.svg, myself.png)

## 3. Design System
- **Colors:** Dark theme (zinc-950), accent `#ccff00` (lime)
- **Fonts:** Anton (display), JetBrains Mono (mono), Inter (sans)
- **Responsive:** Desktop = infinite canvas, Mobile = vertical scroll (<1024px)
- **3D Background:** Preserved on both mobile and desktop

## 4. Key Files
- `index.html` → Favicon, OG meta tags, Twitter cards
- `AGENTS.md` → This file (project context)
- `resume.pdf` → Kumar's resume (not deployed)

## 5. Deployment
- **GitHub:** TheSpideX/portfolio
- **Vercel:** spidexlab.me (auto-deploys from main branch)
- **Custom Domain:** spidexlab.me (via Namecheap + Vercel DNS)

## 6. Kumar's Profile
- **Name:** Kumar Satyam
- **Education:** IIT Dhanbad (ISM), B.Tech CSE, CGPA 8.59
- **JEE Advanced:** AIR 5007
- **Identity:** Systems architect, idea-first builder, AI-augmented execution
- **GitHub:** TheSpideX
- **LinkedIn:** kumar-satyam-64a807255
- **LeetCode:** spideX
- **Email:** satyamiitdnbd@gmail.com
