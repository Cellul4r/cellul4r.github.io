import { Binary, BookOpen, ChevronRight, Sigma, Trophy, Users } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { ContestCard } from '../components/ContestCard'
import { MatchingDemo } from '../components/MatchingDemo'
import { ScrollReveal } from '../components/ScrollReveal'
import { contests } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './CompetitiveProgrammingPage.css'

const topics = ['Mathematics', 'Binary search', 'Prefix sums', 'Recursion', 'Dynamic programming']

export function CompetitiveProgrammingPage() {
  useDocumentTitle('Competitive Programming')
  const reduceMotion = useReducedMotion()
  return (
    <div className="page cp-page">
      <header className="cp-hero">
        <div className="container cp-introduction">
          <div>
            <p className="eyebrow">Competitive programming</p>
            <h1>Think clearly.<br /><em>Code precisely.</em></h1>
            <p>Algorithms and data structures are more than contest tools—they shape how I reason about constraints, trade-offs, and correctness.</p>
          </div>
          <MatchingDemo />
        </div>
      </header>

      <section className="section container icpc-achievements" aria-labelledby="icpc-results-title">
        <div className="cp-section-head"><div><p className="eyebrow">ICPC Thailand</p><h2 id="icpc-results-title">A journey in problem solving.</h2></div><Trophy size={30} aria-hidden="true" /></div>
        <div className="icpc-results">
          {contests.map((contest) => (
            <ScrollReveal key={contest.year}>
              <ContestCard contest={contest} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section tutoring-section" aria-labelledby="tutoring-title">
        <div className="container tutoring-grid">
          <div>
            <p className="eyebrow">Beyond competition</p>
            <h2 id="tutoring-title">Learning by<br /><em>helping others.</em></h2>
            <p>I participate in weekly competitive-programming sessions for university students, alternating between tutor and teaching assistant/helper roles.</p>
            <div className="session-stat"><Users size={22} /><div><strong>5–20</strong><span>students in a typical session</span></div></div>
          </div>
          <motion.div className="topic-board" initial={reduceMotion ? false : { opacity: 0, y: 35, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: reduceMotion ? 0 : -1 }} whileHover={reduceMotion ? undefined : { rotate: 0 }} viewport={{ once: true }}>
            <div className="topic-board-head"><span>SESSION TOPICS</span><Binary size={18} /></div>
            {topics.map((topic, index) => <div className="topic-row" key={topic}><span>{String(index + 1).padStart(2, '0')}</span><strong>{topic}</strong><ChevronRight size={16} /></div>)}
            <div className="topic-board-foot"><BookOpen size={17} /><span>Tutor · TA · Helper</span><Sigma size={17} /></div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
