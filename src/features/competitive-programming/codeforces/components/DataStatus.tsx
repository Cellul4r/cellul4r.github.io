import { RefreshCw } from 'lucide-react'
import styles from '../CodeforcesProfile.module.css'

interface Props { updatedAt?: number; refreshing: boolean; paused: boolean; failed: boolean; onRefresh: () => void }

export function DataStatus({ updatedAt, refreshing, paused, failed, onRefresh }: Props) {
  const formatted = updatedAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(updatedAt)) : null
  return <footer className={styles.dataStatus}>
    <div><p>{formatted ? <>Last checked <time dateTime={new Date(updatedAt!).toISOString()}>{formatted}</time></> : 'Public data from the Codeforces API'}</p>
      <span role="status">{paused ? 'You’re offline. Data will load when the connection returns.' : refreshing ? 'Checking for updates…' : failed ? 'Some data could not be updated. Available results are still shown.' : 'Cached for 15 minutes. Times follow your device settings.'}</span>
    </div>
    <button type="button" onClick={onRefresh} disabled={refreshing || paused} className={styles.refreshButton}><RefreshCw size={16} aria-hidden="true" />{refreshing ? 'Refreshing' : 'Refresh'}</button>
  </footer>
}
