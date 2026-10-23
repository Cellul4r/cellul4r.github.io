import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { formatDate, formatNumber } from '../config'
import type { RatingPoint } from '../types'
import { RatingHistoryTable } from './RatingHistoryTable'

const history = (count: number): RatingPoint[] => Array.from({ length: count }, (_, index) => ({
  contestId: index + 1,
  contestName: `Fixture Round ${index + 1}`,
  timestamp: new Date(2025, 0, index + 1, 12).getTime(),
  ratingUpdateTimeSeconds: new Date(2025, 0, index + 1, 12).getTime() / 1000,
  rank: 100,
  oldRating: 1000 + index,
  newRating: 1010 + index,
  change: 10,
}))

const toggleTable = () => fireEvent.click(screen.getByText('View rating history as a table'))
const next = () => screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement
const previous = () => screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement
const contestNames = () => within(screen.getByRole('table')).getAllByRole('link').map(link => link.textContent?.replace(' (opens in a new tab)', ''))

it('shows ten newest contests without mutating the chronological history', () => {
  const points = Object.freeze(history(23).map(point => Object.freeze(point)))
  render(<RatingHistoryTable points={points} />)
  toggleTable()
  expect(contestNames()).toEqual(Array.from({ length: 10 }, (_, index) => `Fixture Round ${23 - index}`))
  expect(points.map(point => point.contestId)).toEqual(Array.from({ length: 23 }, (_, index) => index + 1))
  expect(screen.getByRole('status').textContent).toBe('Showing 1–10 of 23 contests')
  expect(screen.getByText('Page 1 of 3')).toBeTruthy()
  expect(previous().disabled).toBe(true)
  expect(next().disabled).toBe(false)
  const link = screen.getByRole('link', { name: /Fixture Round 23/ }) as HTMLAnchorElement
  expect(link.href).toBe('https://codeforces.com/contest/23')
  expect(link.target).toBe('_blank')
  expect(within(screen.getAllByRole('row')[1]).getByText(formatDate(points[22].ratingUpdateTimeSeconds))).toBeTruthy()
  expect(within(screen.getAllByRole('row')[1]).getByText(formatNumber(points[22].newRating))).toBeTruthy()
})

it('moves through middle and incomplete final pages, then back', () => {
  render(<RatingHistoryTable points={history(23)} />)
  toggleTable()
  fireEvent.click(next())
  expect(contestNames()).toHaveLength(10)
  expect(contestNames()[0]).toBe('Fixture Round 13')
  expect(screen.getByRole('status').textContent).toBe('Showing 11–20 of 23 contests')
  expect(previous().disabled).toBe(false)
  expect(next().disabled).toBe(false)
  fireEvent.click(next())
  expect(contestNames()).toEqual(['Fixture Round 3', 'Fixture Round 2', 'Fixture Round 1'])
  expect(screen.getByRole('status').textContent).toBe('Showing 21–23 of 23 contests')
  expect(next().disabled).toBe(true)
  fireEvent.click(previous())
  expect(screen.getByText('Page 2 of 3')).toBeTruthy()
  fireEvent.click(previous())
  expect(screen.getByText('Page 1 of 3')).toBeTruthy()
  expect(previous().disabled).toBe(true)
})

it('preserves the page when reopened and when refreshed', () => {
  const view = render(<RatingHistoryTable points={history(23)} />)
  toggleTable()
  fireEvent.click(next())
  toggleTable()
  expect(view.container.querySelector('details')?.open).toBe(false)
  toggleTable()
  expect(screen.getByText('Page 2 of 3')).toBeTruthy()
  view.rerender(<RatingHistoryTable points={history(24)} />)
  expect(screen.getByText('Page 2 of 3')).toBeTruthy()
  expect(contestNames()[0]).toBe('Fixture Round 14')
})

it('clamps the page when data shrinks and retains that page if history grows again', () => {
  const view = render(<RatingHistoryTable points={history(23)} />)
  toggleTable()
  fireEvent.click(next())
  fireEvent.click(next())
  view.rerender(<RatingHistoryTable points={history(12)} />)
  expect(screen.getByText('Page 2 of 2')).toBeTruthy()
  expect(contestNames()).toEqual(['Fixture Round 2', 'Fixture Round 1'])
  expect(next().disabled).toBe(true)
  view.rerender(<RatingHistoryTable points={history(23)} />)
  expect(screen.getByText('Page 2 of 3')).toBeTruthy()
  view.rerender(<RatingHistoryTable points={history(1)} />)
  expect(contestNames()).toEqual(['Fixture Round 1'])
  expect(screen.queryByRole('navigation')).toBeNull()
})

it.each([1, 10])('hides pagination controls for %i contests', count => {
  render(<RatingHistoryTable points={history(count)} />)
  toggleTable()
  expect(contestNames()).toHaveLength(count)
  expect(screen.queryByRole('navigation')).toBeNull()
  expect(screen.getByRole('status').textContent).toBe(`Showing 1–${count} of ${count} contests`)
})

it('renders no table or navigation for an empty history', () => {
  const { container } = render(<RatingHistoryTable points={[]} />)
  expect(container.childElementCount).toBe(0)
})
