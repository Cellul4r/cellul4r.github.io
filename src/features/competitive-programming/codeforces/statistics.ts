import type { PracticeStatistics, Problem, RatingChange, RatingPoint, Submission } from './types'

export function problemKey(problem: Problem): string | null {
  if (problem.contestId !== undefined) return `contest:${problem.contestId}:${problem.index}`
  if (problem.problemsetName) return `set:${problem.problemsetName}:${problem.index}`
  return null
}

export function calculatePractice(submissions: Iterable<Submission>): PracticeStatistics {
  const solved = new Map<string, Problem>()
  let unidentified = 0
  for (const submission of submissions) {
    if (submission.verdict !== 'OK') continue
    const key = problemKey(submission.problem)
    if (key) solved.set(key, submission.problem)
    else unidentified++
  }
  const difficulty = new Map<number, number>()
  const topics = new Map<string, number>()
  let unrated = 0
  for (const problem of solved.values()) {
    if (problem.rating === undefined) unrated++
    else difficulty.set(problem.rating, (difficulty.get(problem.rating) ?? 0) + 1)
    for (const tag of new Set(problem.tags)) topics.set(tag, (topics.get(tag) ?? 0) + 1)
  }
  return {
    solved: solved.size,
    difficulty: [...difficulty].sort(([a], [b]) => a - b).map(([rating, count]) => ({ label: String(rating), count }))
      .concat(unrated ? [{ label: 'Unrated', count: unrated }] : []),
    topics: [...topics].sort(([a, x], [b, y]) => y - x || a.localeCompare(b)).slice(0, 8).map(([label, count]) => ({ label, count })),
    unidentified,
  }
}

export function ratingPoints(history: RatingChange[]): RatingPoint[] {
  return [...history].sort((a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds)
    .map(item => ({ ...item, timestamp: item.ratingUpdateTimeSeconds * 1000, change: item.newRating - item.oldRating }))
}
