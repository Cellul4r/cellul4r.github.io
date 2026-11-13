import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../../data/portfolio'
import { homeProjectPresentation } from '../../data/home'
import { HomeReveal, useHomeMotion } from './HomeMotion'
import { ProjectArtwork } from './ProjectArtwork'

export function SelectedWork() {
  const { enabled } = useHomeMotion()
  return <section className="home-work home-section" id="work" aria-labelledby="home-work-title">
    <div className="container">
      <HomeReveal className="home-section-heading"><div><p className="home-handwritten">From idea to something real</p><h2 id="home-work-title">Things I’ve built.</h2></div><p>Team projects, a few hard problems,<br />and plenty learned along the way.</p></HomeReveal>
      <div className="home-projects">
        {projects.map((project, index) => {
          const presentation = homeProjectPresentation[project.slug]
          return <HomeReveal key={project.slug} delay={index * .08} className={`home-work-item home-work-item-${project.slug}`}>
            <motion.article className="home-project" whileHover={enabled ? { y: -6 } : undefined} transition={{ duration: .25 }}>
              <ProjectArtwork slug={project.slug} />
              <div className="home-project-copy">
                <p className="home-project-kind">{project.eyebrow}</p>
                <h3><Link to={`/projects/${project.slug}`} aria-label={`${project.title} case study`}>{project.title}<span className="home-project-arrow"><ArrowUpRight size={20} aria-hidden="true" /></span></Link></h3>
                <p className="home-project-description">{presentation?.description ?? project.description}</p>
                <p className="home-project-role">{project.role}<span>{project.teamSize}-person team</span></p>
                <ul className="home-project-highlights">{(presentation?.highlights ?? project.highlights.slice(0, 2)).map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                <ul className="home-tech-list" aria-label={`${project.title} technologies`}>{project.stack.slice(0, 4).map(tech => <li key={tech}>{tech}</li>)}</ul>
              </div>
            </motion.article>
          </HomeReveal>
        })}
      </div>
    </div>
  </section>
}
