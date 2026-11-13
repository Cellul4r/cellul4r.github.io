import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../types/portfolio'
import { NoonaIllustration } from './NoonaIllustration'
import { PaperReveal } from './SummerMotion'

export function NoonaFeature({ project }: { project: Project }) {
  return <section className="summer-feature" id="feature" aria-labelledby="summer-feature-title">
    <div className="summer-section-rule"><span>From the workbench</span><span>Featured project</span></div>
    <PaperReveal className="summer-feature-grid">
      <div className="summer-feature-visual"><span className="summer-feature-seal" aria-hidden="true">Built<br />together.</span><NoonaIllustration /></div>
      <div className="summer-feature-copy">
        <p className="summer-kicker">{project.eyebrow}</p>
        <h2 id="summer-feature-title">A place for{' '}<br />every session.</h2>
        <p className="summer-project-name">{project.title}</p>
        <p className="summer-feature-description">Hosts create multi-session events; participants register, join waitlists, and manage their schedules. Behind the scenes, transactions and row-level locking help prevent overbooking.</p>
        <dl className="summer-project-credit"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>The team</dt><dd>{project.teamSize} people</dd></div></dl>
        <ul className="summer-engineering-notes"><li>Led system & relational database design</li><li>Transactional seat registration with row-level locking</li></ul>
        <ul className="summer-tech" aria-label="Noona technologies">{project.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>
        <Link className="summer-case-link" to={`/projects/${project.slug}`}>Read case study<ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </PaperReveal>
    <div className="summer-feature-foot"><span>Software, with the systems in mind.</span><span>Vue 3 → FastAPI → PostgreSQL</span></div>
  </section>
}
