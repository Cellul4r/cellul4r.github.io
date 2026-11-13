import { ArrowDownRight } from 'lucide-react'
import { ProjectCard } from '../components/ProjectCard'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { projects } from '../data/portfolio'
import './ProjectsPage.css'

export function ProjectsPage() {
  usePageMetadata('Projects | Theerada Siri', 'Three completed team projects: event registration, an LLM financial-tool prototype, and a Java typing game.')
  return (
    <div className="page projects-page">
      <header className="page-hero container">
        <p className="eyebrow">Project library / {String(projects.length).padStart(2, '0')} builds</p>
        <div className="page-title-row">
          <h1>Things I’ve<br /><em>helped build.</em></h1>
          <p>Three team projects: an event registration platform, an LLM financial-tool prototype, and a typing action game. Explore what each does and the engineering work I contributed.</p>
        </div>
        <ArrowDownRight className="page-hero-icon" aria-hidden="true" />
      </header>
      <section className="container project-library" aria-label="Completed projects">
        <div className="library-label"><span>Completed work</span><span>{projects.length} projects</span></div>
        <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>
    </div>
  )
}
