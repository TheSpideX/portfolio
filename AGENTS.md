# Project Core Matrix: Kumar Satyam — Expressive Portfolio

## 1. Concrete System Stack
- **Engine/Runtime:** Node.js v22 TypeScript / Vite
- **Framework Core:** React 19 + Tailwind CSS v4 + GSAP + Three.js (R3F)
- **Physics Engine:** Matter.js (client-side physics for draggable nodes)
- **Persistence Layer:** None (static portfolio, no backend)
- **Test Infrastructure:** TypeScript type checking (`npm run lint`)

## 2. Structural Codebase Map
- `src/App.tsx` → Main application — ALL portfolio nodes, navigation, cursor, physics context, loading, easter eggs (~76KB monolith)
- `src/components/Background3D.tsx` → Three.js wireframe terrain + floating particles background
- `src/components/ExpertiseSection.tsx` → Expertise/skills grid cards with 3D tilt
- `src/components/PhysicsStack.tsx` → Matter.js physics-based tech stack with orbiting pills
- `src/components/ProcessTimeline.tsx` → Work process accordion timeline
- `src/contexts/AudioContext.tsx` → Web Audio API synthesized UI sounds
- `src/index.css` → Global styles, custom cursor, animations, typography

## 3. Strict Project Conventions
- **Naming Constraints:** PascalCase for components, camelCase for hooks/variables
- **Design System:** Dark theme (zinc-950), accent color `#ccff00` (lime), Anton display font, JetBrains Mono
- **Interaction Philosophy:** Every section should be interactive — no static walls of text
- **Content Rule:** All content must reflect Kumar's REAL identity — systems architect, idea-first builder, AI-assisted execution

## 4. Active Milestone & Git Triggers
- **Active Branch:** `main`
- **Current Sprint Objective:** Replace all placeholder content with Kumar's real narrative
- **No-Touch Zones:** `src/contexts/AudioContext.tsx`, `src/components/Background3D.tsx` (unless feature changes are explicitly requested)
- **Commit Trigger:** After each section transformation, commit with descriptive message

## 5. Content Transformation Map
### Sections to Transform (in order):
1. **Hero Section** — Title, subtitle, rotating badges, stats
2. **About Section** — Name, bio, profile image, location, tags
3. **Work Section** — Projects (SystemSim, NoRegret, Portfolio itself)
4. **Expertise Section** — Skills cards (Architecture, AI-Assisted Dev, Rapid Prototyping)
5. **Process Timeline** — How Kumar works (Idea → Architecture → AI Build → Ship)
6. **Manifesto** — Kumar's engineering philosophy
7. **Contact Section** — Real email, availability
8. **Tech Stack** — Physics pills with real tech + "AI-Assisted" as a skill
9. **Navigation & Metadata** — Page title, meta tags

## 6. Kumar's Profile (for content reference)
- **Name:** Kumar Satyam
- **Education:** IIT Dhanbad (ISM), B.Tech CSE, CGPA 8.59
- **JEE Advanced:** AIR 5007
- **Identity:** Architect of ideas, not limited to any language/domain
- **Pattern:** Problem → Novel Architecture → AI-Assisted Implementation → Ship
- **Projects:** SystemSim (Go), NoRegret (C++), this portfolio (React)
- **GitHub:** TheSpideX
- **Email:** satyamiitdnbd@gmail.com
- **Skills:** C++, Go, Kotlin, TypeScript, gRPC, WebSocket, PostgreSQL, Redis, Docker, React, Android SDK (Jetpack Compose)
- **Approach:** Uses AI as a build tool, not a crutch. Architects the system, designs the breakthroughs, then executes.
