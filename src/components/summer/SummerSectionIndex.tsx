import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { summerSections } from '../../data/summer'
import { PaperReveal } from './SummerMotion'

export function SummerSectionIndex() {
  return <section className="summer-section-index" id="sections" aria-labelledby="summer-index-title">
    <div className="summer-section-rule"><span>Inside the paper</span><span>Keep exploring</span></div>
    <h2 id="summer-index-title">More in this edition.</h2>
    <nav aria-label="Newspaper sections">
      <PaperReveal className="summer-index-grid">
        {summerSections.map(section => <Link key={section.to} to={section.to} className="summer-index-link" aria-label={section.action}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
          <span className="summer-index-action">{section.action}<ArrowUpRight size={17} aria-hidden="true" /></span>
        </Link>)}
      </PaperReveal>
    </nav>
  </section>
}
