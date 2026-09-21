import { ArrowDown, ArrowRight, Braces, Cloud, Code2, Network } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { HeroIllustration } from '../components/HeroIllustration'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { contests, profile, projects, technicalAreas } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import theeradaProfile from '../assets/theerada-profile.webp'

const icons = { software: Braces, cloud: Cloud, network: Network }

export function HomePage() {
  useDocumentTitle('Technical Portfolio')
  const reduceMotion = useReducedMotion()

  return (
    <div className="home-page">
      <section className="hero">
        <AmbientBackground />
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={reduceMotion ? false : { y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.65 }}>
            <p className="availability"><span /> A very curious engineer</p>
            <p className="hero-kicker">{profile.role}</p>
            <h1><span>Theerada</span><br />Siri<i>.</i></h1>
            <p className="hero-headline">{profile.headline}</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/projects">Explore my work <ArrowRight size={18} /></Link>
              <Link className="button button-quiet" to="/competitive-programming">Contest results</Link>
            </div>
            <div className="hero-links">
              <Link to="/resume">View résumé <ArrowRight size={14} /></Link>
              <a href={profile.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a>
            </div>
          </motion.div>

          <HeroIllustration />
        </div>
        <a className="scroll-cue" href="#about"><ArrowDown size={15} /> Meet me</a>
      </section>

      <section className="human-section" id="about" aria-labelledby="human-title">
        <div className="container human-grid">
          <motion.figure className="profile-polaroid" initial={{ opacity: 0, x: -35, rotate: -7 }} whileInView={{ opacity: 1, x: 0, rotate: -3 }} whileHover={{ rotate: 0, scale: 1.02 }} viewport={{ once: true }}>
            <div className="profile-photo-wrap"><img src={theeradaProfile} alt="Theerada Siri smiling and making a peace sign" /></div>
            <figcaption>Yep, that’s me. Nice to meet you! ✌</figcaption>
            <span className="photo-tape" aria-hidden="true" />
          </motion.figure>
          <motion.div className="human-copy" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="eyebrow">The human behind the code</p>
            <h2 id="human-title">Curious about how<br /><em>the whole system fits.</em></h2>
            <p>I’m Theerada, a Computer Science student who enjoys moving between application code, the infrastructure underneath it, the networks connecting it, and the algorithms that make it efficient.</p>
            <div className="human-notes" aria-label="Portfolio at a glance">
              <span><strong>03</strong> completed projects</span>
              <span><strong>02</strong> ICPC podium finishes</span>
              <span><strong>04</strong> technical directions</span>
            </div>
            <p className="handwritten-note">Still learning. Always building. ↗</p>
          </motion.div>
        </div>
      </section>

      <section className="section directions" id="directions">
        <div className="container">
          <SectionHeading eyebrow="Engineering directions" title="Broad interests. Clear evidence." copy="I separate what I have built from what I am actively learning—so every claim is easy to discuss in an interview." />
          <div className="area-grid">
            {technicalAreas.map((area) => {
              const Icon = icons[area.key]
              return (
                <motion.article className={`area-card area-${area.key}`} key={area.key} initial={{ opacity: 0, y: 34, rotate: area.index === '02' ? 1 : -1 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} whileHover={{ y: -9, rotate: area.index === '02' ? 1 : -1 }} viewport={{ once: true }} transition={{ duration: .5 }}>
                  <div className="area-top"><span>{area.index}</span><Icon size={23} aria-hidden="true" /></div>
                  <p className="status-label"><span /> {area.status}</p>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <ul>{area.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  {area.key === 'software' ? <Link to="/projects">See evidence <ArrowRight size={15} /></Link> : <span className="learning-note">Building foundations now</span>}
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section work-section">
        <div className="container">
          <div className="section-row">
            <SectionHeading eyebrow="Selected work" title="Built, tested, explained." copy="Each case study focuses on the problem, the engineering choices, and my specific contribution." />
            <Link className="text-link section-link" to="/projects">All projects <ArrowRight size={17} /></Link>
          </div>
          <div className="project-grid festive-projects">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
        </div>
      </section>

      <section className="section cp-preview">
        <div className="container cp-preview-grid">
          <motion.div initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="eyebrow">Competitive programming</p>
            <h2>Pressure-tested<br /><em>problem solving.</em></h2>
            <p>Contest programming is the algorithmic foundation behind how I break down difficult problems, reason about constraints, and write precise code.</p>
            <Link className="button button-primary" to="/competitive-programming">View contest journey <ArrowRight size={18} /></Link>
          </motion.div>
          <motion.div className="scoreboard" aria-label="ICPC results" initial={{ opacity: 0, rotate: 2, scale: .96 }} whileInView={{ opacity: 1, rotate: -1, scale: 1 }} whileHover={{ rotate: 0, scale: 1.01 }} viewport={{ once: true }}>
            <div className="scoreboard-head"><span>ICPC THAILAND</span><span>RESULT</span></div>
            {contests.map((contest) => (
              <div className="score-row" key={contest.year}>
                <div><span>{contest.year}</span><small>{contest.placement}</small></div>
                <strong>{contest.rank}</strong>
                <span>{contest.field}</span>
              </div>
            ))}
            <div className="scoreboard-foot"><span>+ Weekly tutoring / TA</span><span>Algorithms & data structures</span></div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
