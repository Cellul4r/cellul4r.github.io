export type Accent = 'software' | 'cloud' | 'network' | 'algorithm'

export interface Project {
  slug: string
  title: string
  eyebrow: string
  description: string
  role: string
  teamSize: number
  accent: Accent
  stack: string[]
  highlights: string[]
  capabilities: string[]
  architecture: { label: string; detail: string }[]
  challenge: string
  decision: string
  contribution: string
  note?: string
}

export interface Contest {
  year: string
  placement: string
  rank: string
  field: string
  venue: string
}
