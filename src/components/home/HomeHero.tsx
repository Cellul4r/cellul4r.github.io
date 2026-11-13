import { ArrowDown, ArrowUpRight, Mail, Pause, Play, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '../../data/portfolio'
import { HeroIllustration } from '../HeroIllustration'
import { SeasonalFoliage } from '../decorations/SeasonalFoliage'
import { useHomeMotion } from './HomeMotion'
import githubLogo from '../../assets/brands/github.svg'

export function HomeHero() {
  const { enabled, toggle } = useHomeMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-.5, .5], [5, -5]), { stiffness: 100, damping: 25 })
  const rotateY = useSpring(useTransform(pointerX, [-.5, .5], [-6, 6]), { stiffness: 100, damping: 25 })
  return <section className="home-intro" aria-labelledby="home-title">
    <div className="home-paper-grain" aria-hidden="true" />
    <div className="container home-intro-grid">
      <motion.div className="home-intro-copy" initial={enabled ? { y: 24 } : false} animate={{ y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
        <p className="home-handwritten">Hello there, I’m</p>
        <h1 id="home-title">Theerada{' '}<br />Siri<span>.</span></h1>
        <p className="home-role">{profile.role}</p>
        <p className="home-intro-text">{profile.intro}</p>
        <Link className="home-primary-link" to="/#work" preventScrollReset>See selected work <ArrowDown size={18} aria-hidden="true" /></Link>
        <div className="home-quick-links" aria-label="Connect with Theerada">
          <a href={`mailto:${profile.email}`}><Mail size={16} aria-hidden="true" />Email me</a>
          <a href={profile.github} target="_blank" rel="noreferrer"><img src={githubLogo} width={16} height={16} alt="" />GitHub<ArrowUpRight size={13} aria-hidden="true" /></a>
          {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Resume<ArrowUpRight size={13} aria-hidden="true" /></a>}
        </div>
      </motion.div>
      <div className="home-hero-scene" onPointerMove={event => {
        if (!enabled || event.pointerType !== 'mouse') return
        const rect = event.currentTarget.getBoundingClientRect()
        pointerX.set((event.clientX - rect.left) / rect.width - .5)
        pointerY.set((event.clientY - rect.top) / rect.height - .5)
      }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }}>
        <div className="home-scene-shape" aria-hidden="true" />
        <svg className="home-doodle-orbit" viewBox="0 0 500 500" fill="none" aria-hidden="true" focusable="false"><motion.path d="M430 145C560 330 242 491 102 361S112 14 310 64" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 9" initial={enabled ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 2 }} /><path d="m292 52 20 12-19 11M65 112l10-25 11 25-11-9-10 9ZM442 375l7-16 7 16-7-6-7 6Z" stroke="currentColor" strokeWidth="2" /></svg>
        <motion.div className="home-character-depth" style={{ rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0 }}>
          <motion.div animate={enabled ? { y: [0, -12, 0] } : { y: 0 }} transition={{ duration: enabled ? 5.5 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }}><HeroIllustration motionEnabled={enabled} /></motion.div>
        </motion.div>
        <motion.div className="home-scene-note" animate={enabled ? { rotate: [-5, -2, -5], y: [0, -5, 0] } : { rotate: -4, y: 0 }} transition={{ duration: enabled ? 6 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }}><Sparkles size={18} aria-hidden="true" /><span>A little curiosity.<br />A lot to build.</span></motion.div>
        <p className="home-character-caption">Psst… Anya is interactive.</p>
        <SeasonalFoliage variant="sprig" className="home-hero-sprig" />
      </div>
    </div>
    <div className="container home-intro-foot">
      <p className="home-disciplines">{profile.headline}</p>
      <div className="home-intro-status"><p className="home-availability"><span aria-hidden="true" />Open to internships</p><button type="button" className="home-motion-toggle" onClick={toggle} aria-label={enabled ? 'Pause animations' : 'Play animations'} aria-pressed={enabled}>{enabled ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}{enabled ? 'Pause motion' : 'Play motion'}</button></div>
    </div>
  </section>
}
