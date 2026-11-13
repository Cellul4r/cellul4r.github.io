import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { lazy, Suspense } from 'react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { beforeEach, expect, it, vi } from 'vitest'
import { SkillsSection } from '../components/SkillsSection'
import { SiteLayout } from '../layouts/SiteLayout'
import { useHashScroll } from './useHashScroll'

vi.mock('framer-motion', async importOriginal => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: vi.fn(() => false),
}))

const scrollIntoView = vi.fn()

beforeEach(() => {
  scrollIntoView.mockClear()
  vi.mocked(useReducedMotion).mockReturnValue(false)
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView })
})

function Sections() {
  return <><section id="icpc"><h1>ICPC results</h1></section><section id="tutoring-activity"><h2>Tutoring activity</h2></section></>
}

function setup(initialEntry = '/') {
  let resolveModule!: (module: { default: typeof Sections }) => void
  const promise = new Promise<{ default: typeof Sections }>(resolve => { resolveModule = resolve })
  const DeferredPage = lazy(() => promise)
  const router = createMemoryRouter([{
    path: '/', element: <SiteLayout />, children: [
      { index: true, element: <><SkillsSection /><section id="contact">Get in touch</section></> },
      { path: 'competitive-programming', element: <Suspense fallback={<p role="status">Loading sections</p>}><DeferredPage /></Suspense> },
    ],
  }], { initialEntries: [initialEntry] })
  const view = render(<RouterProvider router={router} />)
  return {
    router,
    reveal: () => act(async () => resolveModule({ default: Sections })),
    close: () => { view.unmount(); router.dispose() },
  }
}

it.each([
  { label: 'View ICPC results', id: 'icpc' },
  { label: 'View tutoring activity', id: 'tutoring-activity' },
])('routes the homepage $label link to its section after the lazy page mounts', async ({ label, id }) => {
  const app = setup()
  try {
    const link = screen.getByRole('link', { name: label })
    expect(link.getAttribute('href')).toBe(`/competitive-programming#${id}`)
    fireEvent.click(link)
    expect(app.router.state.location.hash).toBe(`#${id}`)
    expect(screen.getByRole('status').textContent).toBe('Loading sections')
    expect(scrollIntoView).not.toHaveBeenCalled()
    await app.reveal()
    await waitFor(() => expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById(id)))
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' })
  } finally { app.close() }
})

it('supports a direct fragment URL and switching between sections on the loaded page', async () => {
  const app = setup('/competitive-programming#icpc')
  try {
    await app.reveal()
    await waitFor(() => expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('icpc')))
    await act(() => app.router.navigate('/competitive-programming#tutoring-activity'))
    await waitFor(() => expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('tutoring-activity')))
  } finally { app.close() }
})

it('preserves scrolling to the home contact section', async () => {
  const app = setup('/#contact')
  try {
    await waitFor(() => expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('contact')))
  } finally { app.close() }
})

it('uses instant anchor scrolling when reduced motion is preferred', async () => {
  vi.mocked(useReducedMotion).mockReturnValue(true)
  const app = setup('/#skills')
  try {
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' }))
    expect(scrollIntoView).not.toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' })
  } finally { app.close() }
})

it('does not restart smooth scrolling when page animation completion retries the same anchor', () => {
  function RetryScroll() {
    const scroll = useHashScroll()
    return <main id="main-content"><section id="skills">Skills</section><button onClick={() => scroll()}>Animation complete</button></main>
  }
  render(<MemoryRouter initialEntries={['/#skills']}><RetryScroll /></MemoryRouter>)
  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: 'Animation complete' }))
  expect(scrollIntoView).toHaveBeenCalledTimes(1)
})

it('routes the navbar Contact link home and scrolls to contact', async () => {
  const app = setup('/competitive-programming')
  try {
    await app.reveal()
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    const contactLink = within(navigation).getByRole('link', { name: 'Contact' })
    expect(contactLink.getAttribute('href')).toBe('/#contact')
    fireEvent.click(contactLink)
    await waitFor(() => expect(app.router.state.location.pathname).toBe('/'))
    expect(app.router.state.location.hash).toBe('#contact')
    await waitFor(() => expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('contact')))
    expect(within(navigation).getByRole('link', { name: 'Contact' }).getAttribute('aria-current')).toBe('location')
    expect(screen.getByRole('link', { name: 'Theerada Siri, home' }).getAttribute('aria-current')).toBeNull()
  } finally { app.close() }
})

it('does not scroll to an old fragment after navigating away during loading', async () => {
  const app = setup('/competitive-programming#tutoring-activity')
  try {
    await act(() => app.router.navigate('/'))
    await app.reveal()
    expect(document.getElementById('tutoring-activity')).toBeNull()
    expect(scrollIntoView).not.toHaveBeenCalled()
  } finally { app.close() }
})
