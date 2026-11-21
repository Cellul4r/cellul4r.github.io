import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { SummerMotionProvider } from '../summer/SummerMotion'
import { EmailPipelineDiagram, PIPELINE_STEP_MS } from './NoonaDiagrams'

vi.mock('framer-motion', async importOriginal => ({ ...await importOriginal<typeof import('framer-motion')>(), useInView: () => true }))

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(window.matchMedia).mockImplementation(() => ({ matches: false, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList)
})
afterEach(() => { vi.mocked(window.matchMedia).mockImplementation(() => ({ matches: true, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList) })

it('walks the envelope through every pipeline step to the inbox, then stops', () => {
  const clear = vi.spyOn(window, 'clearInterval')
  const { unmount } = render(<SummerMotionProvider><EmailPipelineDiagram /></SummerMotionProvider>)
  const steps = within(screen.getByRole('list', { name: 'Email pipeline' })).getAllByRole('listitem')
  expect(steps[0].getAttribute('data-active')).toBe('true')
  act(() => { vi.advanceTimersByTime(PIPELINE_STEP_MS * 5) })
  expect(steps[5].getAttribute('data-active')).toBe('true')
  act(() => { vi.advanceTimersByTime(PIPELINE_STEP_MS) })
  expect(steps.every(step => step.getAttribute('data-active') === null)).toBe(true)
  expect(steps.slice(0, 5).every(step => step.getAttribute('data-visited') === 'true')).toBe(true)
  expect(clear).toHaveBeenCalled()
  const settled = steps.map(step => step.outerHTML)
  act(() => { vi.advanceTimersByTime(PIPELINE_STEP_MS * 4) })
  expect(steps.map(step => step.outerHTML)).toEqual(settled)
  unmount()
})

it('clears its timer when unmounted mid-run', () => {
  const { unmount } = render(<SummerMotionProvider><EmailPipelineDiagram /></SummerMotionProvider>)
  act(() => { vi.advanceTimersByTime(PIPELINE_STEP_MS * 2) })
  const clear = vi.spyOn(window, 'clearInterval')
  unmount()
  expect(clear).toHaveBeenCalled()
})
