import { Binary, BookOpen, ChevronRight, Sigma, Trophy, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { contests } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const topics = ['Mathematics', 'Binary search', 'Prefix sums', 'Recursion', 'Dynamic programming']

export function CompetitiveProgrammingPage() {
  useDocumentTitle('Competitive Programming')
  return (
    <div className="page cp-page">
      <header className="cp-hero">
        <div className="container cp-hero-grid">
          <div>
            <p className="eyebrow">Competitive programming</p>
            <h1>Think clearly.<br /><em>Code precisely.</em></h1>
            <p>Algorithms and data structures are more than contest tools—they shape how I reason about constraints, trade-offs, and correctness.</p>
          </div>
          <div className="algorithm-motif" aria-hidden="true">
            <span>dist[u] + w &lt; dist[v]</span>
            <div className="nodes"><i /><i /><i /><i /><i /></div>
            <strong>O(E log V)</strong>
          </div>
        </div>
      </header>

      <section className="section container">
        <div className="cp-section-head"><div><p className="eyebrow">ICPC Thailand</p><h2>Contest results</h2></div><Trophy size={36} /></div>
        <div className="contest-list">
          {contests.map((contest, index) => (
            <motion.article className="contest-card" key={contest.year} initial={{ opacity: 0, x: index % 2 ? 45 : -45, rotate: index % 2 ? 1 : -1 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} whileHover={{ y: -6, rotate: index % 2 ? 1 : -1 }} viewport={{ once: true }} transition={{ duration: .5 }}>
              <div className="contest-year"><span>20</span><strong>{contest.year.slice(2)}</strong></div>
              <div className="contest-place"><p>{contest.placement}</p><h3>{contest.rank} <span>{contest.field}</span></h3></div>
              <div className="contest-venue"><span>Host venue</span><p>{contest.venue}</p></div>
              <span className="contest-number">0{index + 1}</span>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section tutoring-section">
        <div className="container tutoring-grid">
          <div>
            <p className="eyebrow">Beyond competition</p>
            <h2>Learning by<br /><em>helping others.</em></h2>
            <p>I participate in weekly competitive-programming sessions for university students, alternating between tutor and teaching assistant/helper roles.</p>
            <div className="session-stat"><Users size={22} /><div><strong>5–20</strong><span>students in a typical session</span></div></div>
          </div>
          <motion.div className="topic-board" initial={{ opacity: 0, y: 35, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: -1 }} whileHover={{ rotate: 0 }} viewport={{ once: true }}>
            <div className="topic-board-head"><span>SESSION TOPICS</span><Binary size={18} /></div>
            {topics.map((topic, index) => <div className="topic-row" key={topic}><span>{String(index + 1).padStart(2, '0')}</span><strong>{topic}</strong><ChevronRight size={16} /></div>)}
            <div className="topic-board-foot"><BookOpen size={17} /><span>Tutor · TA · Helper</span><Sigma size={17} /></div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
