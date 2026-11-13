import { ArrowUpRight, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { contests } from '../../data/portfolio'
import { SeasonalFoliage } from '../decorations/SeasonalFoliage'
import { HomeReveal, useHomeMotion } from './HomeMotion'

export function CompetitiveHighlights() {
  const { enabled } = useHomeMotion()
  const podiums = contests.filter(contest => contest.isPodium)
  return <section className="home-contests home-section" aria-labelledby="home-contests-title">
    <HomeReveal className="container home-contest-grid">
      <div className="home-contest-scrapbook">
        <SeasonalFoliage variant="full" className="home-contest-foliage" />
        {podiums.slice(0, 2).map((contest, index) => {
          const photo = contest.photos?.[0]
          return photo && <motion.figure className={`home-contest-photo home-contest-photo-${index}`} key={contest.id} initial={false} animate={enabled ? { rotate: index === 0 ? [-7, -5, -7] : [7, 5, 7], y: [0, -5, 0] } : { rotate: index === 0 ? -6 : 6, y: 0 }} transition={{ duration: enabled ? 7 + index : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }}>
            <img src={photo.previewSrc} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" /><figcaption>ICPC Thailand {contest.year}</figcaption>
          </motion.figure>
        })}
        <span className="home-contest-sticker" aria-hidden="true"><Trophy size={25} />Made of<br />teamwork.</span>
      </div>
      <div className="home-contest-copy">
        <p className="home-handwritten">A few moments worth keeping</p>
        <h2 id="home-contests-title">Think. Try.{' '}<br />Solve together.</h2>
        <ul className="home-podiums">{podiums.map(contest => <li key={contest.id}>
          <p className="home-contest-rank"><strong>{contest.rank}</strong><span>{contest.field}</span></p>
          <div><h3>{contest.title}</h3><p>{contest.placement}</p></div>
        </li>)}</ul>
        <p className="home-tutoring">I also take turns as a tutor and TA in weekly competitive-programming sessions for 5–20 university students.</p>
        <Link className="home-text-link" to="/competitive-programming">Contest results & teaching<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </HomeReveal>
  </section>
}
