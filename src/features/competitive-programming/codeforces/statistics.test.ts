import { describe, expect, it, vi } from 'vitest'
import { calculatePractice, problemKey, ratingPoints } from './statistics'
import type { Problem, Submission } from './types'
import { formatDate } from './config'

const problem: Problem = { contestId: 1, index: 'A', name: 'Example', tags: ['dp', 'math', 'math'], rating: 1200 }
const submission = (id: number, partial: Partial<Problem> = {}, verdict = 'OK'): Submission => ({ id, verdict, problem: { ...problem, ...partial } })

describe('practice statistics', () => {
  it('counts distinct accepted problems, includes Gym, and separates unrated problems', () => {
    const stats = calculatePractice([
      submission(1), submission(2), submission(3, { index: 'B' }, 'WRONG_ANSWER'),
      submission(4, { contestId: 100001, rating: undefined, tags: ['graphs'] }),
      submission(5, { contestId: undefined, problemsetName: 'acmsguru', tags: [], rating: 800 }),
    ])
    expect(stats.solved).toBe(3)
    expect(stats.difficulty).toEqual([{ label: '800', count: 1 }, { label: '1200', count: 1 }, { label: 'Unrated', count: 1 }])
    expect(stats.topics).toEqual([{ label: 'dp', count: 1 }, { label: 'graphs', count: 1 }, { label: 'math', count: 1 }])
  })
  it('does not identify problems using their titles alone', () => {
    expect(problemKey({ ...problem, contestId: 2 })).not.toBe(problemKey(problem))
    expect(calculatePractice([submission(1, { contestId: undefined })])).toMatchObject({ solved: 0, unidentified: 1 })
  })
  it('handles empty histories and limits topics to eight in descending count order', () => {
    expect(calculatePractice([])).toEqual({ solved: 0, difficulty: [], topics: [], unidentified: 0 })
    const stats = calculatePractice(Array.from({ length: 12 }, (_, i) => submission(i, { index: String(i), tags: ['dp', `tag-${i}`] })))
    expect(stats.topics).toHaveLength(8)
    expect(stats.topics[0]).toEqual({ label: 'dp', count: 12 })
  })
})

it('orders rating updates without mutating the source and calculates signed changes', () => {
  const history = [2, 1].map(id => ({ contestId: id, contestName: `Contest ${id}`, rank: 20, ratingUpdateTimeSeconds: id * 100, oldRating: 1000, newRating: id === 1 ? 1100 : 950 }))
  expect(ratingPoints(history).map(point => [point.contestId, point.change])).toEqual([[1, 100], [2, -50]])
  expect(history[0].contestId).toBe(2)
})

it('formats dates using the visitor locale and local time zone', () => {
  const seconds = Date.parse('2025-11-02T00:30:00Z') / 1000
  const rendered: string[] = []
  try {
    for (const zone of ['Pacific/Honolulu', 'Asia/Tokyo']) {
      vi.stubEnv('TZ', zone)
      const expected = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: zone }).format(new Date(seconds * 1000))
      expect(formatDate(seconds)).toBe(expected)
      rendered.push(formatDate(seconds))
    }
    expect(rendered[0]).not.toBe(rendered[1])
  } finally {
    vi.unstubAllEnvs()
  }
})
