import type { Contest, Project } from '../types/portfolio'

export const profile = {
  name: 'Theerada Siri',
  role: 'Computer Science Student',
  headline: 'Software • Cloud • Networks • Competitive Programming',
  intro: 'I enjoy building software, understanding the infrastructure behind it, exploring computer networks, and solving challenging algorithmic problems.',
  github: 'https://github.com/Cellul4r',
}

export const projects: Project[] = [
  {
    slug: 'noona-appointment',
    title: 'Noona Appointment',
    eyebrow: 'Registration platform',
    description: 'A multi-session event platform for registration, waitlists, schedules, and email reminders—with careful handling of simultaneous seat requests.',
    role: 'Team Lead & Full-Stack Developer',
    teamSize: 4,
    accent: 'software',
    stack: ['Vue 3', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Docker', 'Vercel'],
    capabilities: ['Create multi-session events', 'Register or join a waitlist', 'Manage schedules', 'Receive email reminders'],
    highlights: ['Designed the system and relational data model', 'Used transactions and row-level locking to prevent overbooking', 'Modeled confirmed, waitlist, and available registration states'],
    architecture: [
      { label: 'Client', detail: 'Vue 3 interface for hosts and participants' },
      { label: 'API', detail: 'Layered FastAPI application and business rules' },
      { label: 'Data', detail: 'PostgreSQL with SQLAlchemy and transactional writes' },
    ],
    challenge: 'Two participants can request the final seat at nearly the same time. A simple capacity check followed by an insert leaves a race condition.',
    decision: 'Keep the capacity decision inside a database transaction and lock the relevant row so concurrent requests resolve in a consistent order.',
    contribution: 'I led system and database design, worked across the Vue and FastAPI layers, and helped implement the registration rules with the team.',
    note: 'Docker was used for a consistent containerized development environment.',
  },
  {
    slug: 'llm-financial-advisor',
    title: 'LLM Financial Advisor',
    eyebrow: 'Tool-calling prototype',
    description: 'A prototype that translates Thai or English financial questions into structured calls to deterministic calculators.',
    role: 'Developer',
    teamSize: 4,
    accent: 'cloud',
    stack: ['Python', 'Streamlit', 'LiteLLM'],
    capabilities: ['Interpret natural-language requests', 'Select an appropriate financial tool', 'Extract structured arguments', 'Return calculated results'],
    highlights: ['Designed a schema-driven function-calling architecture', 'Separated model interaction from deterministic financial logic', 'Validated the workflow with 13 Thai and English scenarios'],
    architecture: [
      { label: 'Interface', detail: 'Streamlit conversation and results view' },
      { label: 'Routing', detail: 'LiteLLM selects tools and extracts arguments' },
      { label: 'Execution', detail: 'Reusable ToolExecutor runs deterministic logic' },
    ],
    challenge: 'Language models are useful for interpreting intent, but financial calculations need repeatable rules and validated inputs.',
    decision: 'Limit the model to tool selection and argument extraction. Keep tax brackets, deductions, and calculations in deterministic Python functions.',
    contribution: 'I designed the function-calling structure and reusable executor, and helped validate tax and financial scenarios in both Thai and English.',
    note: 'This is an educational prototype, not a certified or production-ready financial service.',
  },
  {
    slug: 'typing-vs-demon',
    title: 'Typing VS Demon',
    eyebrow: 'Java action game',
    description: 'A five-lane typing action game where players type words to defeat enemies, survive escalating waves, and collect power-ups.',
    role: 'Team Lead & Developer',
    teamSize: 5,
    accent: 'network',
    stack: ['Java', 'Object-Oriented Programming'],
    capabilities: ['Move across five lanes', 'Match typed words to enemies', 'Survive progressive waves', 'Use three power-up types'],
    highlights: ['Built reusable entity and word-object hierarchies', 'Personally implemented the Wave subsystem', 'Showcased at CMU Science Week to 60+ students'],
    architecture: [
      { label: 'Entities', detail: 'Shared behavior for enemies, items, and player objects' },
      { label: 'Words', detail: 'Typed-word matching and target behavior' },
      { label: 'Waves', detail: 'Spawning, progression, scoring, and difficulty scaling' },
    ],
    challenge: 'Enemy spawning, input matching, collisions, scoring, and difficulty all evolve together during a live game loop.',
    decision: 'Use focused object hierarchies and a dedicated Wave subsystem so progression logic stays separate from individual entity behavior.',
    contribution: 'I implemented much of the core architecture and gameplay, including the Wave subsystem. I planned a GameState redesign and delegated its implementation to a teammate.',
  },
]

export const contests: Contest[] = [
  {
    year: '2026',
    placement: 'First Runner-Up',
    rank: '2nd',
    field: 'of 61 teams',
    venue: 'Faculty of Computer Science, Kasetsart University, Bangkok',
  },
  {
    year: '2025',
    placement: 'Second Runner-Up',
    rank: '3rd',
    field: 'of 74 teams',
    venue: "School of Science, King Mongkut's Institute of Technology Ladkrabang",
  },
]

export const technicalAreas = [
  {
    key: 'software',
    index: '01',
    title: 'Software Engineering',
    status: 'Built & practiced',
    description: 'Full-stack applications, backend systems, data modeling, concurrency, testing, and deployment.',
    items: ['React / Vue', 'FastAPI / Fiber', 'PostgreSQL / MongoDB', 'Python / Go / Java / C++'],
  },
  {
    key: 'cloud',
    index: '02',
    title: 'Cloud & Infrastructure',
    status: 'Currently exploring',
    description: 'Learning how applications are packaged, deployed, observed, and operated—with a current focus on Microsoft Azure.',
    items: ['Azure fundamentals', 'Docker', 'Compute & storage', 'Identity / CI/CD'],
  },
  {
    key: 'network',
    index: '03',
    title: 'Network Engineering',
    status: 'Fundamentals & labs',
    description: 'Studying the protocols and design decisions that let systems communicate reliably.',
    items: ['TCP/IP', 'IPv4 / IPv6', 'VLANs & switching', 'Routing & troubleshooting'],
  },
] as const
