import { describe, expect, it, vi } from 'vitest'
import { RequestQueue } from './requestQueue'

describe('Codeforces request queue', () => {
  it('spaces actual request starts by at least 2.1 seconds', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const queue = new RequestQueue()
    const starts: number[] = []
    const work = () => { starts.push(Date.now()); return Promise.resolve() }
    const promises = [queue.run(work), queue.run(work), queue.run(work)]
    await vi.runAllTimersAsync()
    await Promise.all(promises)
    expect(starts).toEqual([0, 2100, 4200])
  })
  it('rejects a cancelled queued request immediately and never starts its work', async () => {
    const queue = new RequestQueue(0)
    let release!: () => void
    const first = queue.run(() => new Promise<void>(resolve => { release = resolve }))
    await Promise.resolve()
    const controller = new AbortController()
    const work = vi.fn(() => Promise.resolve())
    const second = queue.run(work, controller.signal)
    const rejection = expect(second).rejects.toMatchObject({ name: 'AbortError' })
    controller.abort()
    await rejection
    release()
    await first
    await queue.run(() => Promise.resolve())
    expect(work).not.toHaveBeenCalled()
  })
  it('continues serving later requests after an earlier failure', async () => {
    const queue = new RequestQueue(0)
    await expect(queue.run(() => Promise.reject(new Error('failure')))).rejects.toThrow('failure')
    await expect(queue.run(() => Promise.resolve('next'))).resolves.toBe('next')
  })
})
