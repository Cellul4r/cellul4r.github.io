import { Code2, ExternalLink, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contests, profile, projects, technicalAreas } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ResumePage() {
  useDocumentTitle('Résumé')
  return (
    <div className="resume-page">
      <div className="container resume-toolbar">
        <Link to="/">← Back home</Link>
        <button type="button" onClick={() => window.print()}><Printer size={16} /> Print / save PDF</button>
      </div>
      <article className="resume-sheet">
        <header className="resume-head">
          <div><p>THEERADA SIRI</p><h1>Computer Science Student</h1><span>Software · Cloud · Networks · Competitive Programming</span></div>
          <a href={profile.github} target="_blank" rel="noreferrer"><Code2 size={16} /> github.com/Cellul4r <ExternalLink size={13} /></a>
        </header>
        <section className="resume-intro"><p>{profile.intro}</p></section>
        <section className="resume-block">
          <h2>Selected projects</h2>
          <div>{projects.map((project) => <div className="resume-item" key={project.slug}><h3>{project.title}</h3><p className="resume-role">{project.role} · {project.teamSize}-person team</p><p>{project.description}</p><p className="resume-stack">{project.stack.join(' · ')}</p></div>)}</div>
        </section>
        <section className="resume-block">
          <h2>Competitive programming</h2>
          <div>{contests.map((contest) => <div className="resume-line" key={contest.year}><strong>ICPC Thailand National Contest {contest.year}</strong><span>{contest.placement} · {contest.rank} {contest.field}</span></div>)}</div>
          <p className="resume-subnote">Weekly university competitive-programming sessions as tutor or teaching assistant/helper; typical group size of 5–20 students.</p>
        </section>
        <section className="resume-block resume-skills">
          <h2>Technical direction</h2>
          <div>{technicalAreas.map((area) => <div key={area.key}><h3>{area.title}</h3><span>{area.status}</span><p>{area.items.join(' · ')}</p></div>)}</div>
        </section>
        <p className="resume-note">This web résumé is generated from the same verified content as the portfolio. Use “Print / save PDF” for a portable copy.</p>
      </article>
    </div>
  )
}
