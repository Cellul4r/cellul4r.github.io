# AGENTS.md — Theerada Siri Personal Portfolio

## Mission

Build a polished personal technical portfolio for **Theerada Siri**, a Computer Science student whose interests span:

1. Software Engineering
2. Cloud / Infrastructure Engineering
3. Network Engineering
4. Competitive Programming

Do **not** position the entire website as only a Software Engineer portfolio.

The portfolio should communicate a broad but coherent engineering identity: I like building software, understanding the infrastructure that runs it, learning computer networks, and solving algorithmic problems.

A recruiter should understand within roughly 10 seconds:

- who I am;
- which technical areas I care about;
- what I have actually built;
- what technologies I have used;
- my competitive-programming achievements;
- what I am currently learning;
- where to find my GitHub and resume.

Always distinguish between:

- **Built / completed work** — projects, contest results, tutoring, deployed applications.
- **Learning / exploration** — Azure, cloud topics, networking topics, or anything not yet backed by a completed project.

Never present learning as professional or production experience.

---

## Tech Stack

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React

Deployment:

- GitHub Pages
- GitHub Actions
- automatic deployment from `main`

Do not use:

- Next.js
- a backend unless it is genuinely needed
- unnecessary heavy dependencies
- Three.js unless there is a strong visual reason

Use strict TypeScript and reusable components.

---

## Product Identity

Primary identity:

**Theerada Siri**  
**Computer Science Student**

Suggested supporting line:

**Software • Cloud • Networks • Competitive Programming**

Suggested short introduction:

> I enjoy building software, understanding the infrastructure behind it, exploring computer networks, and solving challenging algorithmic problems.

Do not make the site sound as if I have already chosen only one career track.

---

## Visual Direction

Create a modern, technical, premium, slightly playful portfolio.

The visual identity should use a sophisticated green/red palette inspired by Christmas colors **without looking like a Christmas website**.

Preferred palette:

- very dark evergreen background;
- forest-green accents;
- deep muted burgundy/red accents;
- warm off-white text;
- subtle muted-gold highlights when useful.

Avoid:

- Santa;
- Christmas trees;
- snowmen;
- candy canes;
- literal holiday graphics;
- excessive gradients;
- excessive glassmorphism;
- overly rounded cards;
- distracting animation;
- generic SaaS-dashboard aesthetics.

The result should feel distinctive, technical, warm, and memorable.

### Semantic color use

Use the palette consistently rather than assigning the whole site to only two categories.

Suggested accents:

- Software Engineering → burgundy / deep red
- Cloud & Infrastructure → evergreen / teal-green
- Networking → muted gold / amber
- Competitive Programming → green with subtle gold accents

These are accents, not isolated mini-themes. The entire site must still feel cohesive.

---

## Information Architecture

Primary routes:

- `/` — Home
- `/projects` — Project Library
- `/projects/:slug` — Project Detail
- `/competitive-programming` — Competitive Programming

Cloud and Networking may initially be sections on the home/about experience rather than separate routes. They should be easy to promote into dedicated pages later when there is enough project evidence.

The navigation should also expose:

- Resume
- GitHub
- About / technical interests when useful

---

## Home Page Goals

### Hero

Show:

- Theerada Siri
- Computer Science Student
- Software • Cloud • Networks • Competitive Programming
- a concise introduction

Primary actions:

- Explore My Work
- Competitive Programming
- View Resume
- GitHub

Use a subtle animated ambient background. Do not obscure text.

### Technical Areas

Present three engineering directions:

#### 1. Software Engineering

Topics may include:

- full-stack development
- backend systems
- REST APIs
- databases
- system design
- object-oriented programming
- concurrency / transactions
- testing and deployment

Relevant technologies currently supported by real work include:

- Python
- Go
- Java
- C++
- JavaScript / TypeScript
- React
- Vue
- FastAPI
- Fiber
- PostgreSQL
- MongoDB
- Docker

Link to relevant projects.

#### 2. Cloud & Infrastructure

Present this primarily as a **learning / exploration area** unless later backed by completed projects.

Topics may include:

- Microsoft Azure
- Docker
- deployment
- compute
- storage
- identity
- cloud networking
- monitoring
- CI/CD

Clearly label what is being learned versus what has been used in completed projects.

#### 3. Network Engineering

Present networking knowledge and labs separately from production experience.

Topics may include:

- TCP/IP
- IPv4 / IPv6
- subnetting
- VLANs
- switching
- routing
- routing protocols
- network troubleshooting
- Cisco labs

The UI should make this section easy to extend later with networking labs, diagrams, certifications, or projects.

### Competitive Programming

Treat Competitive Programming as a strong technical foundation and evidence of algorithmic problem solving, not as one of the three career tracks.

Highlight:

- ICPC results
- contest timeline
- algorithms / data structures
- tutoring / TA involvement
- programming profiles

---

## Project Library

Project cards must communicate what each project does before diving into implementation details.

Each card should show:

- project title
- concise description
- my role
- team size
- tech stack
- 2–3 key engineering highlights
- GitHub
- live demo when available

Do not create fake metrics, usage counts, or technical claims.

### Project 1 — Noona Appointment Web App

Role:

**Team Lead & Full-Stack Developer — 4-person team**

Stack:

- Vue 3
- FastAPI
- PostgreSQL
- SQLAlchemy
- Docker
- Vercel

What it does:

An event and session registration platform where hosts can create multi-session events and participants can register for sessions, join waitlists, manage schedules, and receive email reminders.

Engineering highlights:

- led the team in system and database design;
- Vue frontend with layered FastAPI backend;
- PostgreSQL relational model for users, events, sessions, and registrations;
- concurrent seat registration;
- database transactions;
- row-level locking;
- prevention of overbooking under simultaneous requests;
- seat-capacity and per-user registration limits;
- `CONFIRMED`, `WAITLIST`, and `AVAILABLE` registration states.

Do not describe Docker Compose as sophisticated “service orchestration.” Prefer accurate wording such as containerized development environment.

### Project 2 — LLM Financial Advisor

Role:

**Developer — 4-person team**

Stack:

- Python
- Streamlit
- LiteLLM

What it does:

An LLM-powered financial advisor where natural-language requests are routed to specialized deterministic financial tools.

Engineering highlights:

- designed a schema-driven function-calling architecture;
- reusable `ToolExecutor`;
- separation between model interaction and financial logic;
- automatic tool selection and structured argument extraction;
- Thai personal-income Tax Calculator;
- progressive and flat-tax calculations;
- deduction constraints;
- validated the workflow with 13 Thai and English financial scenarios.

Do not imply the application is currently production-ready or financially certified.

### Project 3 — Typing VS Demon

Role:

**Team Lead & Developer — 5-person team**

Stack:

- Java
- Object-Oriented Programming

What it does:

A 2D typing action game where players move across five lanes, type displayed words to defeat enemies, survive increasingly difficult waves, and use power-ups.

Engineering highlights:

- implemented much of the core OOP architecture and gameplay with teammates;
- reusable entity / word-object hierarchies;
- personally implemented the `Wave` subsystem;
- enemy spawning and progression;
- typed-word matching;
- enemy/item behavior;
- collision handling;
- scoring;
- difficulty scaling;
- planned the redesigned `GameState` architecture and delegated its implementation to a teammate;
- 3 enemy types;
- 3 power-up types;
- showcased at Chiang Mai University Science Week;
- played by 60+ elementary and high-school students.

Do not claim I personally implemented the redesigned GameState system.

---

## Project Detail Pages

Each project detail route should feel like an engineering case study, not an oversized resume card.

Suggested sections:

1. Overview
2. What the application does
3. My role
4. Architecture / system design
5. Important engineering decisions
6. Technical challenges
7. My contributions
8. Tech stack
9. Screenshots / media
10. GitHub / Live Demo

Use diagrams, timelines, code-like UI, or system-flow visuals only when they improve understanding.

Avoid walls of text.

---

## Competitive Programming Page

Use a visually distinct but cohesive green/gold identity.

### ICPC Thailand National Contest 2026

- First Runner-Up
- 2nd of 61 teams
- Faculty of Computer Science, Kasetsart University, Bangkok

### ICPC Thailand National Contest 2025

- Second Runner-Up
- 3rd of 74 teams
- School of Science, King Mongkut's Institute of Technology Ladkrabang (KMITL)

### Tutoring / TA Activity

I participated in weekly competitive-programming sessions for university students.

My role alternated between:

- tutor;
- teaching assistant / helper.

Typical session size:

- 5–20 students

Topics included:

- mathematics
- binary search
- prefix sums
- recursion
- dynamic programming

Do not state that I was the lead tutor every session.

Subtle visual motifs may reference:

- graph nodes / edges;
- grids;
- shortest paths;
- dynamic-programming tables;
- contest timers.

Do not make the page look like a coding-course website.

---

## Animation Rules

Use Framer Motion.

Good uses:

- hero entrance;
- slow ambient green/red background lights;
- subtle cursor-reactive glow;
- section reveals;
- card elevation;
- border/glow transitions;
- page transitions;
- subtle graph/node movement.

Animation should support hierarchy and interaction, not become the content.

Requirements:

- respect `prefers-reduced-motion`;
- do not animate every element;
- avoid long blocking intro animations;
- keep interactions responsive;
- ensure mobile performance remains strong.

---

## Responsive Design

Support:

- desktop
- laptop
- tablet
- mobile

Mobile must be intentionally designed, not merely a scaled-down desktop layout.

Check:

- readable typography;
- usable navigation;
- stacked cards;
- no horizontal overflow;
- touch-friendly targets;
- sensible spacing;
- animations that remain performant.

---

## Accessibility

Require:

- semantic HTML;
- proper heading hierarchy;
- keyboard-accessible navigation;
- visible focus states;
- meaningful link labels;
- alt text;
- sufficient contrast;
- reduced-motion support.

Do not rely on color alone to convey meaning.

---

## Code Quality

Keep the codebase understandable and maintainable.

Preferred structure:

```text
src/
  components/
  layouts/
  pages/
  data/
  hooks/
  assets/
  types/
```

Prefer reusable components such as:

- `Navbar`
- `Hero`
- `SectionHeading`
- `ProjectCard`
- `ProjectDetailSection`
- `TechBadge`
- `ContestCard`
- `AchievementCard`
- `AnimatedBackground`
- `Footer`

Store repeated portfolio content in typed data files rather than duplicating it across components.

Use strict TypeScript.

Avoid:

- giant components;
- duplicated markup;
- premature abstraction;
- unnecessary dependencies;
- hard-coded repeated content;
- excessive comments.

---

## Deployment

Target GitHub Pages with GitHub Actions.

Required scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`

Configure:

- production build to `dist`;
- GitHub Actions deployment from `main`;
- Vite `base` based on the actual repository name;
- SPA routing so direct navigation / refresh does not break project detail routes;
- compatibility with a future custom domain.

If the repository is `Cellul4r.github.io`, use root hosting semantics.

If it is a project repository, configure the correct repository base path instead of assuming `/`.

Do not hard-code a deployment base path before inspecting the repository.

---

## SEO / Metadata

Add:

- meaningful document title;
- site description;
- route-specific titles;
- favicon;
- useful social-preview metadata when feasible in a static Vite application.

Do not over-engineer SEO at the cost of maintainability.

---

## Implementation Process

Before making large changes:

1. inspect the repository;
2. understand what already exists;
3. preserve good existing work;
4. propose or confirm the component/page structure;
5. implement incrementally.

Suggested phases:

### Phase 1 — Foundation

- React + Vite + TypeScript
- Tailwind
- React Router
- shared layout
- navigation
- design tokens
- typed content models

### Phase 2 — Home

- hero
- technical areas
- featured projects
- competitive-programming preview
- responsive layout

### Phase 3 — Projects

- project data model
- project library
- reusable project cards
- project detail routes

### Phase 4 — Competitive Programming

- ICPC achievements
- timeline
- tutoring / TA
- algorithmic visual motifs

### Phase 5 — Motion and Polish

- Framer Motion
- reduced-motion behavior
- hover/focus refinement
- mobile refinement
- accessibility audit

### Phase 6 — Deployment

- GitHub Actions
- GitHub Pages configuration
- routing fallback
- metadata
- production build verification

After meaningful implementation changes:

- run TypeScript / lint checks if configured;
- run `npm run build`;
- fix errors before moving on.

Do not sacrifice maintainability or accessibility for visual effects.

---

## Content Integrity

Never invent:

- project metrics;
- users;
- dates;
- awards;
- technologies;
- responsibilities;
- certifications;
- cloud/network experience.

If content is missing, create a placeholder in the data model or ask for the missing information rather than fabricating it.

The portfolio should be truthful enough that every technical statement can be defended in an interview.

---

## Final Quality Bar

The site should feel like a real technical portfolio, not:

- a generic AI-generated portfolio;
- a student assignment;
- a Christmas landing page;
- a flashy animation demo.

The final experience should communicate:

**I build software, I care about systems and infrastructure, I understand networking fundamentals, and I have strong algorithmic problem-solving experience.**
