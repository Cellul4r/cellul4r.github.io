import type { RatingPoint } from './types'

export const formatRatingMonth = (timestamp: number) => new Intl.DateTimeFormat(undefined, {
  month: 'short', year: 'numeric',
}).format(new Date(timestamp))

export const formatRatingDateTime = (timestamp: number) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(timestamp))

export interface RatingTimeline {
  domain: [number, number]
  ticks: number[]
  rangeLabel: string
}

function calendarTicks(start: number, end: number, step: number): number[] {
  const first = new Date(start)
  let month = Math.ceil((first.getFullYear() * 12 + first.getMonth()) / step) * step
  const ticks: number[] = []
  while (true) {
    const date = new Date(0)
    date.setFullYear(Math.floor(month / 12), month % 12, 1)
    date.setHours(0, 0, 0, 0)
    const timestamp = date.getTime()
    if (timestamp > end) break
    if (timestamp >= start) ticks.push(timestamp)
    month += step
  }
  return ticks
}

export function buildRatingTimeline(points: readonly Pick<RatingPoint, 'timestamp'>[], width: number): RatingTimeline {
  const timestamps = points.map(point => point.timestamp).filter(timestamp => Number.isFinite(new Date(timestamp).getTime())).sort((a, b) => a - b)
  if (!timestamps.length) return { domain: [0, 1], ticks: [], rangeLabel: '' }
  const first = timestamps[0]
  const last = timestamps[timestamps.length - 1]
  const from = formatRatingMonth(first)
  const to = formatRatingMonth(last)
  const rangeLabel = from === to ? from : `${from} – ${to}`
  if (first === last) return { domain: [first - 86400000, last + 86400000], ticks: [first], rangeLabel }

  // Reserve space for the Y axis, edge labels, and full month/year tick text.
  const availableWidth = Number.isFinite(width) ? Math.max(width, 0) : 760
  const maxTicks = Math.max(2, Math.min(8, Math.floor((availableWidth - 128) / 100)))
  const monthSpan = (new Date(last).getFullYear() - new Date(first).getFullYear()) * 12 + new Date(last).getMonth() - new Date(first).getMonth()
  const steps = [1, 3, 6, 12, 24, 60, 120, Math.max(240, Math.ceil(monthSpan / maxTicks))]
  for (const step of steps) {
    const ticks = calendarTicks(first, last, step)
    if (ticks.length > maxTicks) continue
    return { domain: [first, last], ticks: ticks.length ? ticks : [first + (last - first) / 2], rangeLabel }
  }
  return { domain: [first, last], ticks: [first, last], rangeLabel }
}
