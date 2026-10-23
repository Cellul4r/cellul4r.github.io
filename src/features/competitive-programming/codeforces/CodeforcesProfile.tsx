import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { codeforcesProfile } from './config'
import { codeforcesKeys, useCodeforcesPractice, useCodeforcesProfile, useCodeforcesRatings } from './queries'
import { ratingPoints } from './statistics'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileStats } from './components/ProfileStats'
import { RatingHistoryChart } from './components/RatingHistoryChart'
import { PracticeBreakdown } from './components/PracticeBreakdown'
import { RecentContests } from './components/RecentContests'
import { DataStatus } from './components/DataStatus'
import { CodeforcesPageSkeleton } from './components/CodeforcesPageSkeleton'
import styles from './CodeforcesProfile.module.css'

function QueryFeedback({ error, blocked, label }: { error: Error | null; blocked: boolean; label: string }) {
  if (error || blocked) return <p className={styles.feedback} role="status">{error?.message ?? 'This data is currently unavailable.'} Use Refresh to try again.</p>
  return <div className={styles.loading} role="status"><span className={styles.skeleton} aria-hidden="true" /><span>{label}</span></div>
}

export function CodeforcesProfile() {
  const handle = codeforcesProfile.handle
  const client = useQueryClient()
  const profile = useCodeforcesProfile(handle)
  const ratings = useCodeforcesRatings(handle, Boolean(profile.data))
  const practice = useCodeforcesPractice(handle, Boolean(profile.data))
  const points = useMemo(() => ratingPoints(ratings.data ?? []), [ratings.data])
  const queries = [profile, ratings, practice]
  const refreshing = queries.some(query => query.isFetching)
  const paused = queries.some(query => query.fetchStatus === 'paused')
  const failed = queries.some(query => query.isError)
  const timestamps = queries.map(query => query.dataUpdatedAt).filter(value => value > 0)
  const updatedAt = timestamps.length ? Math.min(...timestamps) : undefined
  const refresh = () => { void client.invalidateQueries({ queryKey: codeforcesKeys.all(handle) }) }
  const footer = <DataStatus updatedAt={updatedAt} refreshing={refreshing} paused={paused} failed={failed} onRefresh={refresh} />

  if (!profile.data && !profile.isError) return <CodeforcesPageSkeleton footer={footer} />

  return <div className={`page ${styles.page}`}>
    <div className={`container ${styles.content}`}>
      <Link to="/competitive-programming" className={styles.backLink}><ArrowLeft size={17} aria-hidden="true" />Competitive Programming</Link>
      <ProfileHeader user={profile.data} />
      {profile.isError && <p className={styles.feedback} role="status">{profile.error.message}{profile.data ? ' Showing the last available profile.' : ''}</p>}
      <ProfileStats user={profile.data} contestCount={ratings.data?.length} solved={practice.data?.solved} errors={[profile.isError && !profile.data, ratings.isError && !ratings.data, practice.isError && !practice.data]} />
      <section className={`${styles.panel} ${styles.ratingPanel}`} aria-labelledby="cf-rating-title">
        {ratings.data ? <RatingHistoryChart points={points} /> : <><h2 id="cf-rating-title">Rating history</h2><QueryFeedback error={ratings.error} blocked={profile.isError && !profile.data} label="Loading rating history…" /></>}
      </section>
      {practice.data ? <PracticeBreakdown statistics={practice.data} /> : <section className={`${styles.panel} ${styles.difficultyPanel}`} aria-labelledby="cf-practice-title"><h2 id="cf-practice-title">Practice breakdown</h2><QueryFeedback error={practice.error} blocked={profile.isError && !profile.data} label="Loading complete public submission history…" /></section>}
      <section className={`${styles.panel} ${styles.recentPanel}`} aria-labelledby="cf-recent-title">
        {ratings.data ? <RecentContests points={points} /> : <><h2 id="cf-recent-title">Recent rated contests</h2><QueryFeedback error={ratings.error} blocked={profile.isError && !profile.data} label="Loading recent contests…" /></>}
      </section>
      {footer}
    </div>
  </div>
}
