import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { lazy, Suspense } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'
import { SkillsSection } from '../components/SkillsSection'
import { SiteLayout } from '../layouts/SiteLayout'

const scrollIntoView = vi.fn()

beforeEach(() => {
  scrollIntoView.mockClear()
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
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' })
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

it('does not scroll to an old fragment after navigating away during loading', async () => {
  const app = setup('/competitive-programming#tutoring-activity')
  try {
    await act(() => app.router.navigate('/'))
    await app.reveal()
    expect(document.getElementById('tutoring-activity')).toBeNull()
    expect(scrollIntoView).not.toHaveBeenCalled()
  } finally { app.close() }
})
