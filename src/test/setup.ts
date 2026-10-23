import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => { cleanup(); vi.useRealTimers() })

Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn(() => ({
  matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
})) })

class TestResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}
  observe(target: Element) {
    this.callback([{ target, contentRect: { width: 600, height: 320 } } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = TestResizeObserver
