function abortError() { return new DOMException('Request cancelled', 'AbortError') }

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) { reject(abortError()); return }
    const finish = () => { signal?.removeEventListener('abort', cancel); resolve() }
    const timer = setTimeout(finish, ms)
    const cancel = () => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(abortError()) }
    signal?.addEventListener('abort', cancel, { once: true })
  })
}

/** All Codeforces requests, including pagination and retries, share one queue. */
export class RequestQueue {
  private tail: Promise<void> = Promise.resolve()
  private nextStart = 0

  constructor(private readonly interval = 2100) {}

  run<T>(work: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    if (signal?.aborted) return Promise.reject(abortError())
    const operation = this.tail.then(async () => {
      if (signal?.aborted) throw abortError()
      const delay = this.nextStart - Date.now()
      if (delay > 0) await wait(delay, signal)
      if (signal?.aborted) throw abortError()
      this.nextStart = Date.now() + this.interval
      return work()
    })
    this.tail = operation.then(() => undefined, () => undefined)
    return new Promise<T>((resolve, reject) => {
      const cancel = () => reject(abortError())
      signal?.addEventListener('abort', cancel, { once: true })
      operation.then(resolve, reject).finally(() => signal?.removeEventListener('abort', cancel))
    })
  }
}

export const codeforcesQueue = new RequestQueue()
