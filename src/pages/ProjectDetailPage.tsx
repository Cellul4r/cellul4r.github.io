import { ArrowLeft, Check, GitBranch, ShieldCheck, UserRound, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { TechBadge } from '../components/TechBadge'
import { projects } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  useDocumentTitle(project?.title ?? 'Project not found')
  if (!project) return <div className="container empty-state"><p className="eyebrow">404</p><h1>Project not found.</h1><Link className="button button-primary" to="/projects">Back to projects</Link></div>

  return (
    <article className={`project-detail detail-${project.accent}`}>
      <header className="project-detail-hero">
        <div className="container">
          <Link className="back-link" to="/projects"><ArrowLeft size={16} /> All projects</Link>
          <div className="detail-title-grid">
            <div>
              <p className="eyebrow">{project.eyebrow}</p>
              <h1>{project.title}</h1>
              <p className="detail-lead">{project.description}</p>
            </div>
            <div className="detail-meta">
              <div><UserRound size={17} /><span>My role</span><strong>{project.role}</strong></div>
              <div><Users size={17} /><span>Collaboration</span><strong>{project.teamSize}-person team</strong></div>
              <div><ShieldCheck size={17} /><span>Status</span><strong>Completed project</strong></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container detail-content">
        <motion.section className="detail-section detail-overview" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
          <div><p className="eyebrow">01 / What it does</p><h2>From user need to working flow.</h2></div>
          <ul className="capability-list">{project.capabilities.map((capability) => <li key={capability}><Check size={17} />{capability}</li>)}</ul>
        </motion.section>

        <motion.section className="detail-section" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
          <div><p className="eyebrow">02 / System view</p><h2>Architecture at a glance.</h2></div>
          <div className="architecture-flow">
            {project.architecture.map((item, index) => (
              <div className="architecture-node" key={item.label}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.label}</strong><p>{item.detail}</p>
                {index < project.architecture.length - 1 && <GitBranch className="flow-icon" size={19} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="detail-section decision-section" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
          <div><p className="eyebrow">03 / Engineering decision</p><h2>A constraint worth solving.</h2></div>
          <div className="decision-grid">
            <div><span>Challenge</span><p>{project.challenge}</p></div>
            <div><span>Decision</span><p>{project.decision}</p></div>
          </div>
        </motion.section>

        <motion.section className="detail-section contribution-section" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
          <div><p className="eyebrow">04 / Contribution</p><h2>What I owned.</h2></div>
          <div>
            <p className="large-copy">{project.contribution}</p>
            <ul className="highlight-list">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </div>
        </motion.section>

        <motion.section className="detail-section stack-section" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
          <div><p className="eyebrow">05 / Toolkit</p><h2>Technology used.</h2></div>
          <div><div className="tech-list large">{project.stack.map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}</div>{project.note && <p className="project-note">Note: {project.note}</p>}</div>
        </motion.section>

        <div className="detail-next">
          <p>Keep exploring</p>
          <Link to="/projects">Browse all completed projects <ArrowLeft className="rotate" size={18} /></Link>
        </div>
      </div>
    </article>
  )
}
