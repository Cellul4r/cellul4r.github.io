import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import anyaFace from '../../assets/anya-nav-friendly.png'
import portrait from '../../assets/theerada-profile.webp'
import { contests, profile } from '../../data/portfolio'
import { usePaperTilt, useSummerMotion, useSummerScene } from './SummerMotion'

export function SummerCover() {
  const { enabled } = useSummerMotion()
  const { ref, moving } = useSummerScene()
  const tilt = usePaperTilt()
  const contest = contests.find(entry => entry.id === 'icpc-thailand-national-2026')
  return <section className="summer-cover" id="cover" aria-labelledby="summer-name">
    <div className="summer-cover-edition"><span><Sun size={15} aria-hidden="true" />The summer edition</span><span>A personal portfolio</span></div>
    <h1 className="summer-masthead" id="summer-name">{profile.name}</h1>
    <div className="summer-cover-byline" id="skills"><span>{profile.role}</span><span>{profile.headline}</span></div>
    <div ref={ref} className="summer-cover-grid">
      <div className="summer-cover-copy">
        <p className="summer-kicker">A mind that likes to wander</p>
        <h2>Curious about how everything works.</h2>
        <p className="summer-introduction">Hi, I’m Theerada! I’m a Computer Science student interested in building scalable software and understanding the systems behind it. I’m also exploring cloud infrastructure and computer networks, and I enjoy solving algorithmic problems through competitive programming.</p>
        <Link className="summer-button" to="/#feature" preventScrollReset>Read the feature<ArrowDown size={17} aria-hidden="true" /></Link>
        <div className="summer-cover-links"><a href={`mailto:${profile.email}`}>Email me</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} aria-hidden="true" /></a>{profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Resume<ArrowUpRight size={13} aria-hidden="true" /></a>}</div>
      </div>
      <div className="summer-portrait-stage" onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
        <motion.div className="summer-sun-disc" aria-hidden="true" animate={moving ? { rotate: [0, 8, 0] } : { rotate: 0 }} transition={{ duration: moving ? 18 : 0, repeat: moving ? Infinity : 0, ease: 'easeInOut' }}><svg viewBox="0 0 200 200" fill="none" focusable="false"><circle cx="100" cy="100" r="69" />{Array.from({ length: 16 }, (_, i) => <path key={i} d="M100 5v13" transform={`rotate(${i * 22.5} 100 100)`} />)}</svg></motion.div>
        <motion.figure className="summer-portrait" style={tilt.style} initial={enabled ? { y: 12, rotate: -2 } : false} animate={{ y: 0, rotate: -2 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
          <div className="summer-portrait-print"><img src={portrait} alt="Theerada Siri" width={1540} height={2048} fetchPriority="high" /></div>
          <figcaption><span>The person behind the projects.</span><span aria-hidden="true">TS.</span></figcaption>
        </motion.figure>
        <div className="summer-margin-note"><svg viewBox="0 0 80 60" fill="none" aria-hidden="true" focusable="false"><path d="M7 6c48-10 63 17 39 36m-4-14 2 17 17-5" /></svg><p>Summer edition.<br />I’m happier when it’s warm.</p></div>
        <span className="summer-anya-sticker" aria-hidden="true"><img src={anyaFace} width={60} height={60} alt="" /></span>
      </div>
    </div>
    <div className="summer-cover-foot">{contest && <><p>From the contest floor<strong>{contest.placement}</strong></p><Link to="/competitive-programming"><span className="summer-result-rank">{contest.rank}</span><span>{contest.field}<br />ICPC Thailand {contest.year}</span><ArrowUpRight size={17} aria-hidden="true" /></Link></>}</div>
  </section>
}
