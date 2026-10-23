import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useReducedMotion } from 'framer-motion'
import { formatDate, formatNumber } from '../config'
import type { RatingPoint } from '../types'
import { buildRatingTimeline, formatRatingDateTime, formatRatingMonth } from '../ratingTimeline'
import styles from '../CodeforcesProfile.module.css'

export function RatingHistoryChart({ points }: { points: RatingPoint[] }) {
  const reduced = useReducedMotion()
  const [width, setWidth] = useState(760)
  const timeline = useMemo(() => buildRatingTimeline(points, width), [points, width])
  const latest = points[points.length - 1]
  const peak = points.reduce<RatingPoint | undefined>((highest, point) => !highest || point.newRating > highest.newRating ? point : highest, undefined)
  return <>
    <div className={styles.chartHeading}><h2 id="cf-rating-title">Rating history</h2>{timeline.rangeLabel && <span className={styles.chartRange}>{timeline.rangeLabel}</span>}</div>
    {points.length === 0 ? <p className={styles.empty}>No rated contests yet. Rating history will appear after the first rated contest.</p> : <>
      <div className={styles.ratingChart} role="region" aria-label="Rating history chart. Use arrow keys to explore contests, or open the data table below.">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={value => setWidth(Math.round(value))}>
          <LineChart data={points} accessibilityLayer margin={{ top: 24, right: 12, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="#d8d4c6" strokeOpacity={.6} strokeDasharray="2 7" vertical={false} />
            <XAxis dataKey="timestamp" type="number" scale="time" domain={timeline.domain} ticks={timeline.ticks} tickFormatter={formatRatingMonth} interval={0} height={46} padding={{ left: 36, right: 36 }} tick={{ fontSize: 14, fill: '#455a50' }} tickMargin={14} axisLine={false} tickLine={false} />
            <YAxis width={48} domain={['auto', 'auto']} tick={{ fontSize: 14, fill: '#455a50' }} axisLine={false} tickLine={false} />
            <Tooltip content={({ active, payload }) => {
              const point = payload?.[0]?.payload as RatingPoint | undefined
              return active && point ? <div className={styles.tooltip}><strong>{point.contestName}</strong><span>Rating updated {formatRatingDateTime(point.timestamp)}</span><b>{formatNumber(point.newRating)} <span className={point.change >= 0 ? styles.positive : styles.negative}>({point.change > 0 ? '+' : ''}{point.change})</span></b></div> : null
            }} />
            <Line type="linear" dataKey="newRating" name="Rating" stroke="#873747" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: '#fffaf0', strokeWidth: 2 }} isAnimationActive={!reduced} animationDuration={450} />
            {peak && <ReferenceDot x={peak.timestamp} y={peak.newRating} r={7} fill="#a97822" stroke="#fffdf6" strokeWidth={2} shape={({ cx = 0, cy = 0 }) => <path d={`M${cx},${cy - 7} l7,7 -7,7 -7,-7 Z`} fill="#a97822" stroke="#fffdf6" strokeWidth={1.5} />} />}
            {latest && <ReferenceDot x={latest.timestamp} y={latest.newRating} r={4} fill="#347554" stroke="#fffdf6" strokeWidth={1.5} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.ratingMarkers}>
        {peak && <span><i className={styles.peakMark} aria-hidden="true" />Peak in chart <strong>{formatNumber(peak.newRating)}</strong></span>}
        {latest && <span><i className={styles.latestMark} aria-hidden="true" />Latest <strong>{formatNumber(latest.newRating)}</strong></span>}
      </div>
      <details className={styles.dataTable}><summary>View rating history as a table</summary><div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Complete rating history"><table><thead><tr><th scope="col">Contest</th><th scope="col">Rating updated</th><th scope="col">Rating</th><th scope="col">Change</th></tr></thead><tbody>{points.map(point => <tr key={point.contestId}><th scope="row"><a href={`https://codeforces.com/contest/${point.contestId}`} target="_blank" rel="noopener noreferrer">{point.contestName}<span className="sr-only"> (opens in a new tab)</span></a></th><td>{formatDate(point.ratingUpdateTimeSeconds)}</td><td>{formatNumber(point.newRating)}</td><td>{point.change > 0 ? '+' : ''}{point.change}</td></tr>)}</tbody></table></div></details>
    </>}
  </>
}
