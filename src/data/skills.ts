interface SkillGroup {
  title: string
  items: string[]
}

interface WorkingSkill {
  title: string
  evidence: string
  to: string
  linkLabel: string
}

export const technicalSkillGroups: SkillGroup[] = [
  { title: 'Languages', items: ['Python', 'Go', 'Java', 'C++', 'JavaScript'] },
  { title: 'Frameworks & Technologies', items: ['FastAPI', 'Fiber', 'React', 'Vue 3', 'Streamlit', 'Node.js'] },
  { title: 'Databases', items: ['PostgreSQL', 'MongoDB', 'SQLAlchemy'] },
  { title: 'Tools & Platforms', items: ['Git', 'GitHub', 'Docker', 'Vercel', 'Supabase'] },
  { title: 'Engineering Practices', items: ['Object-oriented programming', 'REST APIs', 'Relational database modeling', 'Database transactions', 'Concurrency control'] },
  { title: 'Development Workflows', items: ['Agile development', 'Scrum-style sprints', 'Sprint planning', 'User stories', 'Jira', 'Git collaboration'] },
  { title: 'Computer Networking', items: ['TCP/IP', 'IPv4/IPv6', 'Subnetting', 'VLANs', 'Routing', 'Network troubleshooting'] },
  { title: 'Algorithms & Data Structures', items: ['Competitive programming', 'Algorithm design', 'Dynamic programming'] },
]

export const cloudSkillGroups: SkillGroup[] = [
  { title: 'Microsoft Azure', items: ['Compute & storage', 'Identity & access management', 'Cloud networking', 'Monitoring'] },
  { title: 'DevOps & Deployment', items: ['CI/CD pipelines', 'Cloud deployment', 'Automation'] },
]

export const workingSkills: WorkingSkill[] = [
  {
    title: 'Collaboration & leadership',
    evidence: 'Led a 4-person development team, coordinating implementation responsibilities and driving system and database design.',
    to: '/projects/noona-appointment',
    linkLabel: 'Explore Noona case study',
  },
  {
    title: 'Problem solving',
    evidence: 'Strengthened algorithmic problem-solving skills through ICPC competitions, placing 2nd of 61 teams in 2026 and 3rd of 74 teams in 2025.',
    to: '/competitive-programming',
    linkLabel: 'View ICPC results',
  },
  {
    title: 'Communication & teaching',
    evidence: 'Tutored 5–20 university students in weekly programming sessions, explaining algorithms and facilitating collaborative problem solving.',
    to: '/competitive-programming',
    linkLabel: 'View tutoring activity',
  },
]
