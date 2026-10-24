import { useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { codeforcesProfile } from '../config'
import codeforcesLogo from '../../../../assets/brands/codeforces.png'
import type { CodeforcesUser } from '../types'
import { CodeforcesMascot } from './CodeforcesMascot'
import styles from '../CodeforcesProfile.module.css'

const rankColors: Record<string, string> = {
  newbie: '#656565', pupil: '#267332', specialist: '#167b82', expert: '#315db3',
  'candidate master': '#8b42a0', master: '#986214', 'international master': '#986214',
  grandmaster: '#ae303c', 'international grandmaster': '#ae303c', 'legendary grandmaster': '#ae303c',
}

export function ProfileHeader({ user }: { user?: CodeforcesUser }) {
  const [failedSource, setFailedSource] = useState<string>()
  return (
    <header className={styles.profileHeader}>
      <div className={styles.identity}>
        <span className={styles.avatar}>
          <span aria-hidden="true">C</span>
          {user?.avatar && failedSource !== user.avatar && <img src={user.avatar} width={88} height={88} alt={`${user.handle}'s Codeforces avatar`} onError={() => setFailedSource(user.avatar)} />}
        </span>
        <div><p className={styles.eyebrow}><img src={codeforcesLogo} width={16} height={16} alt="" aria-hidden="true" />Codeforces</p><h1>{user?.handle ?? codeforcesProfile.handle}</h1>
          <div className={styles.profileDetails}>
            {user && <span className={styles.rank} style={{ color: rankColors[user.rank ?? ''] ?? '#526a5b' }}>{user.rank ?? 'Unrated'}</span>}
            {user?.organization && <span><MapPin size={15} aria-hidden="true" />{user.organization}</span>}
          </div>
        </div>
      </div>
      <a className={styles.externalLink} href={codeforcesProfile.url} target="_blank" rel="noopener noreferrer">View on Codeforces <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      <CodeforcesMascot />
    </header>
  )
}
