import { formatNumber } from '../config'
import type { CodeforcesUser } from '../types'
import styles from '../CodeforcesProfile.module.css'

interface Props {
  user?: CodeforcesUser
  contestCount?: number
  solved?: number
  errors: [boolean, boolean, boolean]
}

export function ProfileStats({ user, contestCount, solved, errors }: Props) {
  const stats = [
    { label: 'Current rating', value: user?.rating, detail: user?.rank ?? (user ? 'Unrated' : 'Public profile'), error: errors[0], ready: Boolean(user) },
    { label: 'Highest rating', value: user?.maxRating, detail: user?.maxRank ?? (user ? 'Unrated' : 'Personal best'), error: errors[0], ready: Boolean(user) },
    { label: 'Rated contests', value: contestCount, detail: 'Official rating history', error: errors[1], ready: contestCount !== undefined },
    { label: 'Unique problems solved', value: solved, detail: 'All public accepted solves', error: errors[2], ready: solved !== undefined },
  ]
  return <dl className={styles.stats}>{stats.map(stat => <div key={stat.label} className={styles.stat}>
    <dt>{stat.label}</dt><dd aria-label={stat.value === undefined ? `${stat.label}: ${stat.error ? 'unavailable' : stat.ready ? 'unrated' : 'loading'}` : undefined}>{!stat.ready && !stat.error ? <span className={styles.skeletonValue} aria-hidden="true" /> : stat.value === undefined ? '—' : formatNumber(stat.value)}</dd>
    <span>{stat.error ? 'Currently unavailable' : stat.detail}</span>
  </div>)}</dl>
}
