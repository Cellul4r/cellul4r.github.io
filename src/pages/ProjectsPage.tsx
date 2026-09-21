import { ArrowDownRight } from 'lucide-react'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ProjectsPage() {
  useDocumentTitle('Project Library')
  return (
    <div className="page">
      <header className="page-hero container">
        <p className="eyebrow">Project library / 03 builds</p>
        <div className="page-title-row">
          <h1>Things I’ve<br /><em>helped build.</em></h1>
          <p>Completed team projects across web systems, LLM tool-calling, and game development. Every case study names my actual role and contribution.</p>
        </div>
        <ArrowDownRight className="page-hero-icon" aria-hidden="true" />
      </header>
      <section className="container project-library" aria-label="Completed projects">
        <div className="library-label"><span>Completed work</span><span>{projects.length} projects</span></div>
        <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>
      <section className="container evidence-note">
        <span>About the scope</span>
        <p>This library contains completed work only. Cloud and network topics are described as current learning until they are supported by finished projects or labs.</p>
      </section>
    </div>
  )
}
