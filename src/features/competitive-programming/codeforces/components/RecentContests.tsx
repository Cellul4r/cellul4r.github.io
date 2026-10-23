import { ArrowUpRight } from 'lucide-react'
import { formatDate, formatNumber } from '../config'
import type { RatingPoint } from '../types'
import styles from '../CodeforcesProfile.module.css'

export function RecentContests({ points }: { points: RatingPoint[] }) {
  const recent = points.slice(-5).reverse()
  return <>
    <div className={styles.chartHeading}><h2 id="cf-recent-title">Recent rated contests</h2><span className={styles.chartNote}>Latest five</span></div>
    {!recent.length ? <p className={styles.empty}>Rated contest results will appear here.</p> : <table className={styles.recentTable}>
      <thead><tr><th scope="col">Contest</th><th scope="col">Rating updated</th><th scope="col">Rank</th><th scope="col">Change</th></tr></thead>
      <tbody>{recent.map(point => <tr key={point.contestId}>
        <th scope="row"><a href={`https://codeforces.com/contest/${point.contestId}`} target="_blank" rel="noopener noreferrer">{point.contestName} <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></th>
        <td data-label="Rating updated"><time dateTime={new Date(point.timestamp).toISOString()}>{formatDate(point.ratingUpdateTimeSeconds)}</time></td>
        <td data-label="Rank">{formatNumber(point.rank)}</td>
        <td data-label="Change" className={point.change >= 0 ? styles.positive : styles.negative}>{point.change > 0 ? '+' : ''}{point.change}</td>
      </tr>)}</tbody>
    </table>}
    <p className={styles.chartNote}>Dates show rating updates in your local time zone. Ranks are those recorded at the rating update.</p>
  </>
}
