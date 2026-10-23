import { QueryClient } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { CodeforcesError, fetchUser } from './api'
import { codeforcesKeys, codeforcesQueryDefaults, profileOptions } from './queries'

vi.mock('./api', async importOriginal => ({ ...await importOriginal<typeof import('./api')>(), fetchUser: vi.fn() }))

it('keeps handle and data scope in distinct stable query keys', () => {
  expect(codeforcesKeys.profile('Cellul4r')).toEqual(codeforcesKeys.profile('cellul4r'))
  expect(codeforcesKeys.profile('Cellul4r')).not.toEqual(codeforcesKeys.profile('different'))
  expect(codeforcesKeys.practice('Cellul4r')).not.toEqual(codeforcesKeys.ratings('Cellul4r'))
})

it('reuses fresh data, then refreshes it after fifteen minutes', async () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  vi.mocked(fetchUser).mockReset().mockResolvedValue({ handle: 'Cellul4r', rating: 1500 })
  const client = new QueryClient({ defaultOptions: { queries: { ...codeforcesQueryDefaults, gcTime: Infinity, retry: false } } })
  try {
    await client.fetchQuery(profileOptions('Cellul4r'))
    await vi.advanceTimersByTimeAsync(14 * 60 * 1000)
    await client.fetchQuery(profileOptions('Cellul4r'))
    expect(fetchUser).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(60 * 1000 + 1)
    await client.fetchQuery(profileOptions('Cellul4r'))
    expect(fetchUser).toHaveBeenCalledTimes(2)
  } finally { client.clear() }
})

it('retries only one transient API failure and never retries permanent or aborted failures', () => {
  expect(codeforcesQueryDefaults.retry(0, new CodeforcesError('temporarily offline', true))).toBe(true)
  expect(codeforcesQueryDefaults.retry(1, new CodeforcesError('temporarily offline', true))).toBe(false)
  expect(codeforcesQueryDefaults.retry(0, new CodeforcesError('invalid handle'))).toBe(false)
  expect(codeforcesQueryDefaults.retry(0, new DOMException('cancelled', 'AbortError'))).toBe(false)
})
