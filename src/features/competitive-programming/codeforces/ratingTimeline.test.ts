import { describe, expect, it, vi } from 'vitest'
import { buildRatingTimeline, formatRatingDateTime, formatRatingMonth } from './ratingTimeline'

const point = (date: string) => ({ timestamp: new Date(date).getTime() })

describe('calendar-aligned rating timeline', () => {
  it('uses full years and reduces calendar ticks on narrow screens', () => {
    const points = [point('2023-02-15T12:00:00Z'), point('2026-10-15T12:00:00Z')]
    const desktop = buildRatingTimeline(points, 1100)
    const mobile = buildRatingTimeline(points, 320)
    expect(desktop.ticks.length).toBeGreaterThan(mobile.ticks.length)
    expect(mobile.ticks.length).toBeLessThanOrEqual(2)
    for (const timeline of [desktop, mobile]) {
      expect(timeline.rangeLabel).toMatch(/2023.*2026/)
      expect(timeline.domain).toEqual([points[0].timestamp, points[1].timestamp])
      expect(new Set(timeline.ticks).size).toBe(timeline.ticks.length)
      for (const tick of timeline.ticks) {
        expect(tick).toBeGreaterThanOrEqual(timeline.domain[0])
        expect(tick).toBeLessThanOrEqual(timeline.domain[1])
        expect(new Date(tick).getDate()).toBe(1)
        expect(new Date(tick).getHours()).toBe(0)
        expect(formatRatingMonth(tick)).toMatch(/20\d{2}/)
      }
    }
  })

  it('marks the new year explicitly across December and January', () => {
    const timeline = buildRatingTimeline([point('2024-12-05T12:00:00Z'), point('2025-02-05T12:00:00Z')], 800)
    expect(timeline.rangeLabel).toMatch(/2024.*2025/)
    expect(timeline.ticks.some(tick => new Date(tick).getFullYear() === 2025 && new Date(tick).getMonth() === 0)).toBe(true)
  })

  it('handles empty, invalid, single-point, and short histories', () => {
    expect(buildRatingTimeline([], 320).ticks).toEqual([])
    expect(buildRatingTimeline([{ timestamp: NaN }], 320).ticks).toEqual([])
    const single = point('2025-06-15T12:00:00Z')
    const one = buildRatingTimeline([single], 320)
    expect(one.ticks).toEqual([single.timestamp])
    expect(one.domain[0]).toBeLessThan(single.timestamp)
    expect(one.domain[1]).toBeGreaterThan(single.timestamp)
    const short = buildRatingTimeline([single, point('2025-06-17T12:00:00Z')], 320)
    expect(short.ticks).toHaveLength(1)
    expect(formatRatingMonth(short.ticks[0])).toMatch(/2025/)
  })

  it('handles unsorted histories, duplicate timestamps, very long spans, and unknown width', () => {
    const points = [point('2026-10-01T12:00:00Z'), point('2000-02-01T12:00:00Z'), point('2026-10-01T12:00:00Z')]
    const copy = [...points]
    for (const width of [0, 320, 768, 1440, NaN]) {
      const result = buildRatingTimeline(points, width)
      expect(result.ticks.length).toBeGreaterThan(0)
      expect(result.ticks.length).toBeLessThanOrEqual(8)
      expect(result.ticks.every(tick => tick >= result.domain[0] && tick <= result.domain[1])).toBe(true)
    }
    expect(points).toEqual(copy)
  })

  it('uses the visitor time zone for calendar boundaries, month labels, and tooltips', () => {
    const timestamp = Date.parse('2025-01-01T00:30:00Z')
    const labels: string[] = []
    try {
      for (const zone of ['Pacific/Honolulu', 'Asia/Tokyo']) {
        vi.stubEnv('TZ', zone)
        const expected = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric', timeZone: zone }).format(new Date(timestamp))
        expect(formatRatingMonth(timestamp)).toBe(expected)
        const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone: zone }).format(new Date(timestamp))
        expect(formatRatingDateTime(timestamp)).toBe(dateTime)
        const timeline = buildRatingTimeline([point('2024-11-15T12:00:00Z'), point('2025-03-15T12:00:00Z')], 900)
        expect(timeline.ticks.every(tick => new Date(tick).getDate() === 1 && new Date(tick).getHours() === 0)).toBe(true)
        labels.push(expected)
      }
      expect(labels[0]).not.toBe(labels[1])
    } finally { vi.unstubAllEnvs() }
  })
})
