import { ArrowUpRight, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../types/portfolio'
import { TechBadge } from './TechBadge'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className={`project-card accent-${project.accent}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -10, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
    >
      <span className="card-ornament" aria-hidden="true">✦</span>
      <div className="project-card-top">
        <span className="mono-index">0{index + 1}</span>
        <span className="project-eyebrow">{project.eyebrow}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-meta">
        <span>{project.role}</span>
        <span><Users size={14} aria-hidden="true" /> {project.teamSize}-person team</span>
      </div>
      <div className="tech-list" aria-label="Technologies">
        {project.stack.slice(0, 4).map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}
      </div>
      <Link className="text-link" to={`/projects/${project.slug}`}>
        Read case study <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </motion.article>
  )
}
