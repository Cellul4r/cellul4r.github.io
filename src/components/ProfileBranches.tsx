import { ArrowUpRight, FolderCode, Trophy } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { contests, projects } from '../data/portfolio'

const destinations = [
  {
    to: '/projects',
    title: 'Projects',
    summary: `${projects.length} completed projects`,
    description: 'Event registration, an LLM financial-tool prototype, and a typing action game.',
    icon: FolderCode,
    theme: 'projects',
    number: '01',
  },
  {
    to: '/competitive-programming',
    title: 'Competitive Programming',
    summary: `${contests.length} ICPC podium finishes`,
    description: 'Algorithms, contest results, and weekly tutoring / TA sessions.',
    icon: Trophy,
    theme: 'contests',
    number: '02',
  },
] as const

function NavigationTree() {
  return (
    <svg className="navigation-tree" aria-hidden="true" focusable="false" viewBox="0 0 360 290" fill="none">
      <ellipse cx="180" cy="272" rx="78" ry="7" fill="#174d38" opacity=".08" />
      <path d="M171 225h18v42h-18z" fill="#805713" />
      <path d="M180 46c-12 30-29 51-51 70l25-2c-19 29-39 48-65 65l38-4c-21 25-43 42-68 57 84 19 158 19 242 0-25-15-47-32-68-57l38 4c-26-17-46-36-65-65l25 2c-22-19-39-40-51-70Z" fill="#174d38" />
      <path d="M180 46c-12 30-29 51-51 70 25 4 45-1 51-8V46Z" fill="#32765a" />
      <path d="M154 114c-19 29-39 48-65 65 42 6 74-2 91-16v-55c-6 7-14 10-26 6Z" fill="#28664c" />
      <path d="M127 175c-21 25-43 42-68 57 49 11 89 13 121 10v-79c-17 14-32 18-53 12Z" fill="#205a43" />
      <path d="M180 66v171m-35-112 35 21 34-21m-66 58 32 20 43-26" stroke="#e8e5c9" strokeOpacity=".17" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M144 105c23 15 43 20 69 26m-99 30c31 19 66 24 124 28m-142 25c45 17 105 24 169 12" stroke="#d3aa63" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
      <path d="m180 10 6 15 16 1-12 11 4 16-14-8-14 8 4-16-12-11 16-1Z" fill="#d3aa63" stroke="#a7792e" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m177 20 3-7 3 14 12 1-12 3-3 12-3-12-11-3 11-1Z" fill="#f9e4ab" opacity=".8" />
      <g stroke="#d3aa63" strokeWidth="1.5" strokeLinecap="round">
        <path d="M145 20h-6m77 29 5 3M153 57l-4 4m62-47 4-5" />
        <path d="M143 139v9m74 59v8m-63-11v7" />
      </g>
      <circle cx="143" cy="153" r="8" fill="#b44c60" stroke="#e3b981" strokeWidth="1.5" />
      <circle cx="217" cy="221" r="9" fill="#b44c60" stroke="#e3b981" strokeWidth="1.5" />
      <circle cx="154" cy="216" r="6" fill="#d3aa63" />
      <circle cx="194" cy="158" r="4" fill="#f0d99c" />
    </svg>
  )
}

export function ProfileBranches() {
  const reduceMotion = useReducedMotion()

  return (
    <nav aria-label="Explore my work and contest journey" className="portfolio-tree mt-8">
      <div className="tree-crown">
        <p className="tree-invitation">Pick a branch<span aria-hidden="true"> &#8600;</span></p>
        <NavigationTree />
        <svg className="tree-hanging-cords" aria-hidden="true" focusable="false" viewBox="0 0 600 72" preserveAspectRatio="none" fill="none">
          <path d="M255 0C245 35 145 15 145 72m200-72c10 35 110 15 110 72" stroke="#a7792e" strokeWidth="1.5" />
        </svg>
        <span className="tree-side-note" aria-hidden="true">a little curiosity,<br />a lot to explore.</span>
      </div>
      <div className="tree-destinations grid gap-7">
        {destinations.map(({ to, title, summary, description, icon: Icon, theme, number }) => (
          <motion.div key={to} className={`tree-tag-wrap tree-tag-wrap-${theme}`} style={{ rotate: reduceMotion ? 0 : theme === 'projects' ? -2 : 2 }} whileHover={reduceMotion ? undefined : { y: -4, rotate: 0 }}>
            <Link to={to} className={`tree-tag tree-tag-${theme} group relative block min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-burgundy`}>
              <span className="tag-eyelet" aria-hidden="true" />
              <span className="tag-topline"><Icon size={21} aria-hidden="true" /><span aria-hidden="true">{number} / EXPLORE</span><ArrowUpRight size={19} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p className="tag-summary">{summary}</p>
              <p className="tag-description">{description}</p>
              <span className="tag-action">Follow this branch <ArrowUpRight size={14} aria-hidden="true" /></span>
            </Link>
          </motion.div>
        ))}
      </div>
      <p className="tree-footnote" aria-hidden="true"><span />Rooted in curiosity. Growing through practice.<span /></p>
    </nav>
  )
}
