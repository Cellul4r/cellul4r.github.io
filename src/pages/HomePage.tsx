import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { HeroIllustration } from '../components/HeroIllustration'
import { ContactSection } from '../components/ContactSection'
import { ProfileBranches } from '../components/ProfileBranches'
import { ScrollReveal } from '../components/ScrollReveal'
import { profile } from '../data/portfolio'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import theeradaProfile from '../assets/theerada-profile.webp'

export function HomePage() {
  useDocumentTitle('Website Portfolio')
  const reduceMotion = useReducedMotion()

  return (
    <div className="home-page">
      <section className="hero">
        <AmbientBackground />
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={reduceMotion ? false : { y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.65 }}>
            <p className="availability"><span />Hi! Let me introduce myself</p>
            <p className="hero-kicker">{profile.role}</p>
            <h1><span>Theerada</span><br />Siri<i>.</i></h1>
            <p className="hero-headline">{profile.headline}</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/projects">Explore my work <ArrowRight size={18} /></Link>
              <Link className="button button-quiet" to="/competitive-programming">Contest results</Link>
            </div>
          </motion.div>

          <HeroIllustration />
        </div>
      </section>

      <section className="human-section" id="about" aria-labelledby="human-title">
        <ScrollReveal className="container human-grid">
          <motion.figure className="profile-polaroid" initial={false} style={{ rotate: reduceMotion ? 0 : -3 }} whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.02 }}>
            <div className="profile-photo-wrap"><img src={theeradaProfile} alt="Theerada Siri smiling and making a peace sign" /></div>
            <figcaption>Yep, that’s me. Nice to meet you! ✌</figcaption>
            <span className="photo-tape" aria-hidden="true" />
          </motion.figure>
          <div className="human-copy">
            <p className="eyebrow">The human behind the code</p>
            <h2 id="human-title">Always curious.<br /><em>Never done learning.</em></h2>
            <p>I’m Theerada, a Computer Science student who enjoys moving between application code, the infrastructure underneath it, the networks connecting it, and the algorithms that make it efficient.</p>
            <ProfileBranches />
          </div>
        </ScrollReveal>
      </section>

      <ContactSection />
    </div>
  )
}
