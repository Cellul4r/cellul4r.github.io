import { useId, useMemo, useState } from 'react'
import { formatDate, formatNumber } from '../config'
import type { RatingPoint } from '../types'
import styles from '../CodeforcesProfile.module.css'

const PAGE_SIZE = 10

export function RatingHistoryTable({ points }: { points: readonly RatingPoint[] }) {
  const tableId = useId()
  const [page, setPage] = useState(1)
  const newestFirst = useMemo(() => [...points].sort((a, b) => b.timestamp - a.timestamp), [points])
  const pageCount = Math.max(1, Math.ceil(newestFirst.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  if (page !== currentPage) setPage(currentPage)

  if (!newestFirst.length) return null
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = newestFirst.slice(start, start + PAGE_SIZE)

  return <details className={styles.dataTable}>
    <summary>View rating history as a table</summary>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Rating history table">
      <table id={tableId}>
        <thead><tr><th scope="col">Contest</th><th scope="col">Rating updated</th><th scope="col">Rating</th><th scope="col">Change</th></tr></thead>
        <tbody>{rows.map(point => <tr key={point.contestId}>
          <th scope="row"><a href={`https://codeforces.com/contest/${point.contestId}`} target="_blank" rel="noopener noreferrer">{point.contestName}<span className="sr-only"> (opens in a new tab)</span></a></th>
          <td>{formatDate(point.ratingUpdateTimeSeconds)}</td>
          <td>{formatNumber(point.newRating)}</td>
          <td>{point.change > 0 ? '+' : ''}{point.change}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className={styles.paginationFooter}>
      <p role="status" aria-live="polite" aria-atomic="true">Showing {formatNumber(start + 1)}–{formatNumber(start + rows.length)} of {formatNumber(newestFirst.length)} contests</p>
      {pageCount > 1 && <nav className={styles.pagination} aria-label="Rating history pages">
        <button type="button" aria-controls={tableId} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
        <span>Page {formatNumber(currentPage)} of {formatNumber(pageCount)}</span>
        <button type="button" aria-controls={tableId} disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button>
      </nav>}
    </div>
  </details>
}
