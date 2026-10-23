import { CODEFORCES_API, SUBMISSION_PAGE_SIZE } from './config'
import { codeforcesQueue } from './requestQueue'
import { calculatePractice } from './statistics'
import type { CodeforcesUser, Problem, RatingChange, Submission } from './types'

export class CodeforcesError extends Error {
  constructor(message: string, public readonly retryable = false) { super(message); this.name = 'CodeforcesError' }
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const malformed = () => new CodeforcesError('Codeforces returned an unexpected response. Please try again later.')

async function request(method: string, params: Record<string, string | number>, signal?: AbortSignal): Promise<unknown> {
  const url = new URL(method, CODEFORCES_API)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value))
  url.searchParams.set('lang', 'en')
  return codeforcesQueue.run(async () => {
    const controller = new AbortController()
    const cancel = () => controller.abort()
    signal?.addEventListener('abort', cancel, { once: true })
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new CodeforcesError('Codeforces is unavailable. Please try again later.', response.status === 429 || response.status >= 500)
      const body: unknown = await response.json()
      if (!record(body)) throw malformed()
      if (body.status === 'FAILED') {
        const message = typeof body.comment === 'string' ? body.comment : 'Codeforces could not complete this request.'
        throw new CodeforcesError(message, /limit exceeded|temporarily|unavailable/i.test(message))
      }
      if (body.status !== 'OK' || !('result' in body)) throw malformed()
      return body.result
    } catch (error) {
      if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError')
      if (error instanceof CodeforcesError) throw error
      throw new CodeforcesError('Could not reach Codeforces. Please check your connection or try again later.', true)
    } finally {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', cancel)
    }
  }, signal)
}

export async function fetchUser(handle: string, signal?: AbortSignal): Promise<CodeforcesUser> {
  const result = await request('user.info', { handles: handle }, signal)
  if (!Array.isArray(result) || !record(result[0]) || typeof result[0].handle !== 'string') throw malformed()
  const user = result[0]
  for (const key of ['avatar', 'organization', 'rank', 'maxRank']) if (user[key] !== undefined && typeof user[key] !== 'string') throw malformed()
  for (const key of ['rating', 'maxRating']) if (user[key] !== undefined && !finite(user[key])) throw malformed()
  return user as unknown as CodeforcesUser
}

export async function fetchRatings(handle: string, signal?: AbortSignal): Promise<RatingChange[]> {
  const result = await request('user.rating', { handle }, signal)
  if (!Array.isArray(result) || !result.every(item => record(item) && typeof item.contestName === 'string'
    && ['contestId', 'rank', 'ratingUpdateTimeSeconds', 'oldRating', 'newRating'].every(key => finite(item[key])))) throw malformed()
  return result as RatingChange[]
}

function isProblem(value: unknown): value is Problem {
  return record(value) && typeof value.index === 'string' && typeof value.name === 'string'
    && Array.isArray(value.tags) && value.tags.every(tag => typeof tag === 'string')
    && (value.contestId === undefined || finite(value.contestId))
    && (value.problemsetName === undefined || typeof value.problemsetName === 'string')
    && (value.rating === undefined || finite(value.rating))
}

export async function fetchPractice(handle: string, signal?: AbortSignal) {
  const submissions = new Map<number, Submission>()
  let from = 1
  while (true) {
    const page = await request('user.status', { handle, from, count: SUBMISSION_PAGE_SIZE }, signal)
    if (!Array.isArray(page) || !page.every(item => record(item) && finite(item.id) && isProblem(item.problem)
      && (item.verdict === undefined || typeof item.verdict === 'string'))) throw malformed()
    const previousSize = submissions.size
    for (const submission of page as Submission[]) submissions.set(submission.id, submission)
    if (page.length < SUBMISSION_PAGE_SIZE) break
    // Guard against a broken endpoint returning the same page indefinitely.
    if (submissions.size === previousSize) throw malformed()
    from += page.length
  }
  return calculatePractice(submissions.values())
}
