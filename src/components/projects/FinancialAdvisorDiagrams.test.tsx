import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { SummerMotionProvider } from '../summer/SummerMotion'
import { ToolCallingDiagram } from './FinancialAdvisorDiagrams'

let setInView: (visible: boolean) => void
let stacked = false

beforeEach(() => {
  stacked = false
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const positions: Record<string, [number, number, number, number]> = stacked ? {
      interface: [28, 28, 264, 100], model: [28, 160, 264, 120], request: [28, 390, 264, 120],
      executor: [28, 542, 264, 100], tool: [28, 674, 264, 100], result: [28, 806, 264, 120], response: [28, 1100, 264, 140],
    } : {
      interface: [28, 28, 400, 100], model: [460, 28, 400, 100], request: [28, 220, 400, 90],
      executor: [28, 342, 400, 90], tool: [28, 464, 400, 90], result: [28, 586, 400, 90], response: [460, 220, 400, 90],
    }
    const [left, top, width, height] = positions[this.dataset.flowNode ?? ''] ?? [0, 0, stacked ? 320 : 900, stacked ? 1300 : 850]
    return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {} }
  })
  vi.stubGlobal('IntersectionObserver', class {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      setInView = visible => this.callback([{ target, isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
    }
    unobserve() {}
    disconnect() {}
  })
})

function renderFlow(reducedMotion = false) {
  let changePreference: () => void = () => {}
  const preference = {
    matches: reducedMotion,
    addEventListener: (_: string, listener: () => void) => { changePreference = listener },
    removeEventListener() {}, addListener() {}, removeListener() {},
  }
  vi.spyOn(window, 'matchMedia').mockReturnValue(preference as unknown as MediaQueryList)
  const view = render(<SummerMotionProvider><ToolCallingDiagram /></SummerMotionProvider>)
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  return {
    ...view,
    setReducedMotion(value: boolean) { act(() => { preference.matches = value; changePreference() }) },
    tick(ms: number) { act(() => { vi.advanceTimersByTime(ms) }) },
  }
}

it('traces the function path once, pauses offscreen, and supports pause and replay', () => {
  const app = renderFlow()
  try {
    expect(screen.getByRole('status').textContent).toContain('follow either response path')
    act(() => setInView(true))
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13: Streamlit')
    app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13: Model via LiteLLM')
    act(() => setInView(false))
    app.tick(3000)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13')
    act(() => setInView(true))
    fireEvent.click(screen.getByRole('button', { name: 'Pause walkthrough' }))
    app.tick(3000)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13')
    fireEvent.click(screen.getByRole('button', { name: 'Play walkthrough' }))
    for (let i = 0; i < 5; i++) app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Step 7 of 13: Model reads the tool result')
    expect(app.container.querySelector('[data-current="true"] strong')?.textContent).toBe('Model via LiteLLM')
    app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Another function request')
    for (let i = 0; i < 5; i++) app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Step 13 of 13: Final explanation · Complete')
    app.tick(720)
    expect(screen.getByRole('button', { name: 'Replay walkthrough' })).toBeTruthy()
    app.tick(5000)
    expect(screen.getByRole('status').textContent).toContain('Step 13 of 13')
    fireEvent.click(screen.getByRole('button', { name: 'Replay walkthrough' }))
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13')
  } finally { app.unmount() }
})

it('automatically restarts when response type changes and clears the other path', () => {
  const app = renderFlow()
  try {
    act(() => setInView(true))
    const direct = screen.getByRole('button', { name: 'Direct response' })
    direct.focus()
    expect(document.activeElement).toBe(direct)
    fireEvent.click(direct)
    expect(direct.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Function path' }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: 'Pause walkthrough' })).toBeTruthy()
    app.tick(720)
    app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Step 3 of 3: Final text response · Complete')
    expect(app.container.querySelector('[data-current="true"] strong')?.textContent).toBe('Final text response')
    expect(app.container.querySelector('.finance-branch:not(.finance-branch-direct) [data-current]')).toBeNull()
    expect(screen.getByText(/Schematic of the shared team architecture/)).toBeTruthy()
    app.tick(720)
    fireEvent.click(screen.getByRole('button', { name: 'Function path' }))
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13: Streamlit')
    expect(screen.getByRole('button', { name: 'Pause walkthrough' })).toBeTruthy()
    expect(app.container.querySelector('[data-flow-node="response"] [data-current]')).toBeNull()
    app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13')
    app.tick(300)
    fireEvent.click(screen.getByRole('button', { name: 'Function path' }))
    app.tick(719)
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13')
    app.tick(1)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13')
  } finally { app.unmount() }
})

it('uses manual steps under reduced motion and stops autoplay if the preference changes', () => {
  const app = renderFlow(true)
  try {
    act(() => setInView(true))
    app.tick(5000)
    expect(screen.getByRole('status').textContent).toContain('follow either response path')
    expect(screen.queryByRole('button', { name: /Play walkthrough/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13')
    app.tick(5000)
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13')
    app.setReducedMotion(false)
    fireEvent.click(screen.getByRole('button', { name: 'Play walkthrough' }))
    app.tick(720)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13')
    app.setReducedMotion(true)
    app.tick(5000)
    expect(screen.getByRole('status').textContent).toContain('Step 2 of 13')
    for (let i = 0; i < 11; i++) fireEvent.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByRole('button', { name: 'Restart walkthrough' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Restart walkthrough' }))
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 13')
    fireEvent.click(screen.getByRole('button', { name: 'Direct response' }))
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 3')
    app.tick(5000)
    expect(screen.getByRole('status').textContent).toContain('Step 1 of 3')
    expect(screen.getByRole('button', { name: 'Next step' })).toBeTruthy()
  } finally { app.unmount() }
})

it.each([false, true])('draws two model-decision arrows and a tool-result loop when stacked: %s', mobile => {
  stacked = mobile
  const app = renderFlow()
  try {
    const functionArrow = app.container.querySelector('[data-flow-edge="model-request"]')!
    const responseArrow = app.container.querySelector('[data-flow-edge="model-response"]')!
    expect(functionArrow.getAttribute('d')).not.toBe(responseArrow.getAttribute('d'))
    for (const arrow of [functionArrow, responseArrow, app.container.querySelector('[data-flow-edge="result-model"]')!]) {
      expect(arrow.getAttribute('marker-end')).toMatch(/^url\(#.+-arrow\)$/)
      expect(arrow.getAttribute('d')).not.toContain('NaN')
    }
    if (mobile) expect(responseArrow.getAttribute('d')).toContain('H 308')
    expect(screen.getByRole('img', { name: /^Schematic tool-calling flow:/ }).getAttribute('aria-label')).toMatch(/Two branching arrows.*tool-result arrow loops back to the model.*10 model turns/)
    expect(screen.getByText(/Return to the model/)).toBeTruthy()
    expect(screen.getByText(/illustrates two tool calls before a final reply/)).toBeTruthy()
  } finally { app.unmount() }
})
