import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'
import { ScrollReveal } from './ScrollReveal'
import { SkillsSection } from './SkillsSection'

vi.mock('framer-motion', async importOriginal => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: vi.fn(() => false),
}))

let enterViewport: (visible: boolean) => void

beforeEach(() => {
  vi.mocked(useReducedMotion).mockReturnValue(false)
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback
    }
    private callback: IntersectionObserverCallback
    observe(target: Element) {
      enterViewport = visible => this.callback([
        { target, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 } as IntersectionObserverEntry,
      ], this as unknown as IntersectionObserver)
    }
    unobserve() {}
    disconnect() {}
  })
})

it('reveals once and remains visible after leaving the viewport', async () => {
  render(<ScrollReveal duration={0}><p>Project evidence</p></ScrollReveal>)
  const reveal = screen.getByText('Project evidence').parentElement!
  expect(reveal.style.opacity).toBe('0')
  act(() => enterViewport(true))
  await waitFor(() => expect(reveal.style.opacity).toBe('1'))
  act(() => enterViewport(false))
  expect(reveal.style.opacity).toBe('1')
})

it('makes an unrevealed section visible when a link receives keyboard focus', async () => {
  render(<ScrollReveal duration={0}><a href="/projects">View projects</a></ScrollReveal>)
  const link = screen.getByRole('link', { name: 'View projects' })
  expect(link.parentElement!.style.opacity).toBe('0')
  fireEvent.focusIn(link)
  await waitFor(() => expect(link.parentElement!.style.opacity).toBe('1'))
})

it.each(['reduced motion', 'missing IntersectionObserver'])('keeps skills and links visible with %s', mode => {
  if (mode === 'reduced motion') vi.mocked(useReducedMotion).mockReturnValue(true)
  else vi.stubGlobal('IntersectionObserver', undefined)
  const { container } = render(<MemoryRouter><SkillsSection /></MemoryRouter>)
  const technical = screen.getByRole('region', { name: 'My Skills' })
  expect(technical.style.opacity).toBe('1')
  for (const category of container.querySelectorAll<HTMLElement>('.skills-category')) {
    expect(category.style.opacity).toBe('1')
    expect(category.style.transform).toBe('none')
  }
  expect(screen.getByRole('link', { name: 'Explore Noona case study' }).getAttribute('href')).toBe('/projects/noona-appointment')
  const learning = screen.getByRole('region', { name: 'Where I’m growing.' })
  expect(learning.style.opacity).toBe('1')
  expect(learning.textContent).toContain('Currently developing')
  expect(learning.textContent).toContain('Microsoft Azure')
})
