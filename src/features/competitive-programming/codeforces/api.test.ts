import { beforeEach, expect, it, vi } from 'vitest'
import type { Submission } from './types'

beforeEach(() => { vi.resetModules(); vi.useFakeTimers() })
const response = (result: unknown) => new Response(JSON.stringify({ status: 'OK', result }), { status: 200 })

it('retrieves every submission page before publishing complete statistics', async () => {
  const page: Submission[] = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, verdict: 'OK', problem: { contestId: i + 1, index: 'A', name: 'Example', tags: ['dp'] } }))
  const fetcher = vi.fn().mockResolvedValueOnce(response(page)).mockResolvedValueOnce(response([page[0]]))
  vi.stubGlobal('fetch', fetcher)
  const { fetchPractice } = await import('./api')
  const pending = fetchPractice('Cellul4r')
  await vi.runAllTimersAsync()
  expect((await pending).solved).toBe(1000)
  expect(fetcher).toHaveBeenCalledTimes(2)
  expect(String(fetcher.mock.calls[1][0])).toContain('from=1001')
})

it('rejects an incomplete history rather than returning partial totals', async () => {
  const page = Array.from({ length: 1000 }, (_, id) => ({ id, verdict: 'OK', problem: { contestId: id, index: 'A', name: 'Example', tags: [] } }))
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(response(page)).mockRejectedValueOnce(new TypeError('offline')))
  const { fetchPractice } = await import('./api')
  const assertion = expect(fetchPractice('Cellul4r')).rejects.toMatchObject({ retryable: true })
  await vi.runAllTimersAsync()
  await assertion
})

it('validates API responses and does not treat an invalid handle as a transient error', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ status: 'FAILED', comment: 'handles: User not found' })))
    .mockResolvedValueOnce(response([{ handle: 'Cellul4r', rating: 'wrong type' }]))
  vi.stubGlobal('fetch', fetcher)
  const { fetchUser } = await import('./api')
  await expect(fetchUser('missing')).rejects.toMatchObject({ retryable: false })
  const assertion = expect(fetchUser('Cellul4r')).rejects.toMatchObject({ retryable: false })
  await vi.runAllTimersAsync()
  await assertion
})

it('times out stalled requests and supports query cancellation', async () => {
  vi.stubGlobal('fetch', vi.fn((_url, options: RequestInit) => new Promise((_resolve, reject) => {
    options.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
  })))
  const { fetchUser } = await import('./api')
  const timeout = expect(fetchUser('Cellul4r')).rejects.toMatchObject({ retryable: true })
  await vi.advanceTimersByTimeAsync(15000)
  await timeout
  const controller = new AbortController()
  const cancelled = expect(fetchUser('Cellul4r', controller.signal)).rejects.toMatchObject({ name: 'AbortError' })
  controller.abort()
  await cancelled
})
