import { Cloud, CodeXml, Network } from 'lucide-react'
import { motion } from 'framer-motion'
import { technicalAreas } from '../../data/portfolio'
import { HomeReveal, useHomeMotion } from './HomeMotion'
import { SeasonalFoliage } from '../decorations/SeasonalFoliage'
import portrait from '../../assets/theerada-profile.webp'

const icons = { software: CodeXml, cloud: Cloud, network: Network }

export function AboutLearning() {
  const { enabled } = useHomeMotion()
  return <section className="home-about home-section" id="about" aria-labelledby="home-about-title">
    <div className="container">
      <HomeReveal className="home-about-intro">
        <div className="home-about-photo-wrap"><figure className="home-about-photo"><img src={portrait} alt="Theerada Siri smiling and making a peace sign" loading="lazy" /><figcaption>The human behind the keyboard.</figcaption></figure><SeasonalFoliage variant="sprig" className="home-about-foliage" /></div>
        <div><p className="home-handwritten">More than a list of technologies</p><h2 id="home-about-title">Curiosity connects{' '}<br />the dots.</h2><p className="home-about-text">I’m a third-year Computer Science student. I like building things, figuring out what happens underneath, and sharing what I learn.</p><p className="home-about-text">Software, infrastructure, networks. Different angles on the same question: how does this all work together?</p></div>
      </HomeReveal>
      <HomeReveal className="home-interests" >
        <div id="skills" className="home-skills-anchor" />
        {technicalAreas.map(area => {
          const Icon = icons[area.key]
          return <motion.article className={`home-interest home-interest-${area.key}`} key={area.key} whileHover={enabled ? { rotate: 0, y: -5 } : undefined}>
            <span className="home-note-pin" aria-hidden="true" /><Icon size={26} strokeWidth={1.6} aria-hidden="true" />
            <h3>{area.title}</h3><p className="home-interest-status">{area.key === 'network' ? 'Learning & fundamentals' : area.status}</p>
            <p>{area.description}</p><ul>{area.items.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul>
          </motion.article>
        })}
      </HomeReveal>
      <p className="home-learning-note">Docker: used in completed projects. Azure & cloud operations: currently learning.</p>
    </div>
  </section>
}
