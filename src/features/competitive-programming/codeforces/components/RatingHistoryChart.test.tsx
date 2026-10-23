import { render, screen, waitFor } from '@testing-library/react'
import { expect, it } from 'vitest'
import { RatingHistoryChart } from './RatingHistoryChart'
import { formatNumber } from '../config'
import type { RatingPoint } from '../types'

const points: RatingPoint[] = [
  { timestamp: new Date(2023, 1, 15, 12).getTime(), newRating: 1000 },
  { timestamp: new Date(2024, 4, 15, 12).getTime(), newRating: 1700 },
  { timestamp: new Date(2026, 9, 15, 12).getTime(), newRating: 1600 },
].map((item, index) => ({ ...item, contestId: index + 1, contestName: `Fixture Round ${index + 1}`, rank: 100, ratingUpdateTimeSeconds: item.timestamp / 1000, oldRating: 900, change: item.newRating - 900 }))

it('renders full-year axis labels, the complete date range, and distinct latest/peak markers', async () => {
  const { container } = render(<RatingHistoryChart points={points} />)
  expect(screen.getByText(/2023.*2026/)).toBeTruthy()
  await waitFor(() => expect(container.querySelectorAll('.recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value').length).toBeGreaterThan(0))
  const labels = [...container.querySelectorAll('.recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value')].map(element => element.textContent)
  expect(labels.every(label => /20\d{2}/.test(label ?? ''))).toBe(true)
  expect(screen.getByText('Peak in chart')).toBeTruthy()
  expect(screen.getByText('Latest')).toBeTruthy()
  expect(screen.getAllByText(formatNumber(1700)).length).toBeGreaterThan(0)
  expect(container.querySelectorAll('.recharts-reference-dot')).toHaveLength(2)
  expect(screen.getByText('View rating history as a table')).toBeTruthy()
})

it('keeps empty and single-point charts useful', async () => {
  const view = render(<RatingHistoryChart points={[]} />)
  expect(screen.getByText(/No rated contests yet/)).toBeTruthy()
  view.rerender(<RatingHistoryChart points={[points[0]]} />)
  expect(screen.getAllByText(/2023/).length).toBeGreaterThan(0)
  await waitFor(() => expect(view.container.querySelectorAll('.recharts-reference-dot')).toHaveLength(2))
})
