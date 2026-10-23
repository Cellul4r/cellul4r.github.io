import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useReducedMotion } from 'framer-motion'
import { formatNumber } from '../config'
import type { DistributionPoint, PracticeStatistics } from '../types'
import styles from '../CodeforcesProfile.module.css'

export function PracticeBreakdown({ statistics }: { statistics: PracticeStatistics }) {
  const reduced = useReducedMotion()
  const difficultyColor = (label: string) => label === 'Unrated' ? '#828880' : Number(label) < 1400 ? '#4d815c' : '#277e87'
  return <div className={styles.practiceGrid}>
    <section className={`${styles.panel} ${styles.difficultyPanel}`} aria-labelledby="cf-difficulty-title">
      <h2 id="cf-difficulty-title">Problems by difficulty</h2>
      {statistics.difficulty.length ? <><div className={styles.barChart} role="region" aria-label="Unique solved problems by Codeforces difficulty">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={statistics.difficulty} accessibilityLayer margin={{ top: 15, right: 4, left: -24, bottom: 5 }}>
          <CartesianGrid stroke="#98b397" strokeOpacity={.3} strokeDasharray="2 7" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 14, fill: '#526a5b' }} minTickGap={12} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#526a5b' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={value => [value, 'Unique problems']} labelFormatter={label => label === 'Unrated' ? 'Unrated problems' : `Difficulty ${label}`} contentStyle={{ borderRadius: 6, borderColor: '#cad6bf', background: '#fffdf5', fontSize: 14 }} />
          <Bar dataKey="count" fill="#4d815c" maxBarSize={36} isAnimationActive={!reduced} animationDuration={400} shape={props => <Rectangle x={Number(props.x)} y={Number(props.y)} width={Number(props.width)} height={Number(props.height)} radius={[2, 2, 0, 0]} fill={difficultyColor((props.payload as DistributionPoint).label)} />} />
        </BarChart></ResponsiveContainer>
      </div><details className={styles.dataTable}><summary>View difficulty counts</summary><dl className={styles.countList}>{statistics.difficulty.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{formatNumber(item.count)}</dd></div>)}</dl></details></> : <p className={styles.empty}>No accepted problems in the public history yet.</p>}
      <p className={styles.chartNote}>One count per solved problem. Unrated problems stay separate.</p>
    </section>
    <section className={`${styles.panel} ${styles.topicsPanel}`} aria-labelledby="cf-topics-title">
      <h2 id="cf-topics-title">Most-practiced topics</h2>
      {statistics.topics.length ? <><div className={styles.barChart} role="region" aria-label="Eight most-practiced problem topics">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={statistics.topics} layout="vertical" accessibilityLayer margin={{ top: 8, right: 32, left: 0, bottom: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis dataKey="label" type="category" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: '#526a5b' }} />
          <Tooltip formatter={value => [value, 'Unique problems']} contentStyle={{ borderRadius: 6, borderColor: '#cad6bf', background: '#fffdf5', fontSize: 14 }} cursor={{ fill: '#edf2e4' }} />
          <Bar dataKey="count" fill="#995163" maxBarSize={18} isAnimationActive={!reduced} animationDuration={400} shape={props => <Rectangle x={Number(props.x)} y={Number(props.y)} width={Number(props.width)} height={Number(props.height)} radius={[0, 2, 2, 0]} fill={(props.payload as DistributionPoint).label === statistics.topics[0]?.label ? '#a97822' : '#995163'} />}><LabelList dataKey="count" position="right" fill="#455a50" fontSize={14} /></Bar>
        </BarChart></ResponsiveContainer>
      </div><details className={styles.dataTable}><summary>View topic counts</summary><dl className={styles.countList}>{statistics.topics.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{formatNumber(item.count)}</dd></div>)}</dl></details></> : <p className={styles.empty}>No topic tags available for the solved problems.</p>}
      <p className={styles.chartNote}>A problem can have several tags, so topic counts overlap.</p>
    </section>
    {statistics.unidentified > 0 && <p className={styles.chartNote}>Some accepted submissions have no public problem identifier and could not be included in the unique count.</p>}
  </div>
}
