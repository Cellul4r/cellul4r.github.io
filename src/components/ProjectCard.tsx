import { ArrowUpRight, Users } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../types/portfolio'
import { TechBadge } from './TechBadge'
import './ProjectCard.css'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion()
  const caseStudyLink = (
    <Link className="text-link project-card-link" to={`/projects/${project.slug}`} aria-label={`Read case study: ${project.title}`}>
      Read case study <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  )

  return (
    <motion.article
      className={`project-card accent-${project.accent}`}
      data-feedback="action"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.06 }}
    >
      <span className="card-ornament" aria-hidden="true">✦</span>
      <div className="project-card-top">
        <span className="mono-index">0{index + 1}</span>
        <span className="project-eyebrow">{project.eyebrow}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.cardDescription ?? project.description}</p>
      <div className="project-meta">
        <span>{project.role}</span>
        <span><Users size={14} aria-hidden="true" /> {project.teamSize}-person team</span>
      </div>
      <div className="tech-list" aria-label="Technologies">
        {project.stack.slice(0, 4).map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}
      </div>
      {project.cardDecoration ? (
        <div className="project-card-footer">
          {caseStudyLink}
          <img className="project-card-sprite" src={project.cardDecoration.src} width={project.cardDecoration.width} height={project.cardDecoration.height} alt="" aria-hidden="true" draggable={false} loading="lazy" decoding="async" />
        </div>
      ) : caseStudyLink}
    </motion.article>
  )
}
