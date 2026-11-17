import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => { cleanup(); vi.useRealTimers() })

// The app formats with the visitor's default locale. Pin that default so assertions
// do not depend on the host (e.g. th-TH would render Buddhist-calendar years).
const TEST_LOCALE = 'en-US'
function withTestLocale<T extends typeof Intl.DateTimeFormat | typeof Intl.NumberFormat>(Format: T): T {
  return new Proxy(Format, {
    construct: (target, [locales, options]) => new (target as typeof Intl.DateTimeFormat)(locales ?? TEST_LOCALE, options),
    apply: (target, _this, [locales, options]) => (target as typeof Intl.DateTimeFormat)(locales ?? TEST_LOCALE, options),
  })
}
Intl.DateTimeFormat = withTestLocale(Intl.DateTimeFormat)
Intl.NumberFormat = withTestLocale(Intl.NumberFormat)

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
