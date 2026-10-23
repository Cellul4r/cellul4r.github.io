import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ProfileHeader } from './ProfileHeader'
import { ProfileStats } from './ProfileStats'
import styles from '../CodeforcesProfile.module.css'

// This shell is eager-loaded; it must not import queries or chart libraries.
export function CodeforcesPageSkeleton({ footer }: { footer?: ReactNode }) {
  return <div className={`page ${styles.page}`} aria-busy="true">
    <div className={`container ${styles.content}`}>
      <p className="sr-only" role="status">Loading Codeforces profile…</p>
      <Link to="/competitive-programming" className={styles.backLink}><ArrowLeft size={17} aria-hidden="true" />Competitive Programming</Link>
      <ProfileHeader />
      <ProfileStats errors={[false, false, false]} />
      <section className={`${styles.panel} ${styles.ratingPanel}`} aria-label="Rating history loading">
        <h2>Rating history</h2><div className={styles.loading} aria-hidden="true"><span className={styles.skeleton} /></div>
      </section>
      <div className={styles.practiceGrid}>
        {['Problems by difficulty', 'Most-practiced topics'].map((title, index) => <section className={`${styles.panel} ${index === 0 ? styles.difficultyPanel : styles.topicsPanel}`} key={title} aria-label={`${title} loading`}><h2>{title}</h2><div className={styles.loading} aria-hidden="true"><span className={styles.skeleton} /></div></section>)}
      </div>
      <section className={`${styles.panel} ${styles.recentPanel}`} aria-label="Recent contests loading"><h2>Recent rated contests</h2><div className={styles.skeletonRows} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span key={index} />)}</div></section>
      {footer}
    </div>
  </div>
}
