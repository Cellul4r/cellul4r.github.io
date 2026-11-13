export type Accent = 'software' | 'cloud' | 'network' | 'algorithm'

export interface Profile {
  name: string
  role: string
  headline: string
  intro: string
  internship: string
  github: string
  email: string
  linkedin: string
  resumeUrl?: string
}

export interface ProjectMedia {
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export interface Project {
  slug: string
  title: string
  eyebrow: string
  description: string
  cardDescription?: string
  cardDecoration?: { src: string; width: number; height: number }
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
  id: string
  isPodium: boolean
  year: string
  title: string
  date?: string
  placement: string
  rank: string
  field: string
  venue: string
  teamName?: string
  sourceLinks?: { url: string; label: string }[]
  highlights?: { label: string; value: string }[]
  photos?: ContestPhoto[]
}

export interface ContestPhoto {
  src: string
  previewSrc: string
  thumbnailSrc: string
  width: number
  height: number
  alt: string
  caption: string
}
