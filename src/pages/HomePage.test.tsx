import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import { profile } from '../data/portfolio'
import { SiteLayout } from '../layouts/SiteLayout'
import { HomePage } from './HomePage'

function setup(path = '/') {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  const scroll = vi.fn()
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scroll })
  const router = createMemoryRouter([
    { path: '/', element: <SiteLayout />, children: [
      { index: true, element: <HomePage /> },
      { path: 'projects/noona-appointment', element: <h1>Noona case study</h1> },
      { path: 'projects', element: <h1>Project library</h1> },
      { path: 'articles', element: <h1>Article overview</h1> },
      { path: 'competitive-programming', element: <h1>Contest results</h1> },
    ] },
  ], { initialEntries: [path] })
  const view = render(<RouterProvider router={router} />)
  return { router, scroll, close: () => { view.unmount(); router.dispose() } }
}

it('presents real portfolio evidence with complete navigation and a section index before contact', () => {
  const app = setup()
  try {
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(profile.name)
    expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual([
      'Curious about how everything works.', 'A place for every session.', 'More in this edition.', 'Your next teammate?',
    ])
    expect(screen.getByText(profile.headline)).toBeTruthy()
    expect(screen.getByText('4 people')).toBeTruthy()
    expect(screen.getByText('2nd')).toBeTruthy()
    expect(screen.getByText('First Runner-Up')).toBeTruthy()
    expect(screen.queryByText('Currently exploring Azure & computer networking.')).toBeNull()
    expect(screen.getByText('Concept illustration')).toBeTruthy()
    expect(screen.getByText(/interested in building scalable software/)).toBeTruthy()
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    for (const [label, path] of [['Projects', '/projects'], ['Articles', '/articles'], ['Competitive Programming', '/competitive-programming'], ['Contact', '/#contact']]) {
      expect(within(navigation).getByRole('link', { name: label }).getAttribute('href')).toBe(path)
    }
    const index = screen.getByRole('region', { name: 'More in this edition.' })
    expect(within(index).getAllByRole('link')).toHaveLength(3)
    expect(index.compareDocumentPosition(screen.getByRole('region', { name: 'Your next teammate?' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Theerada Siri' })).toBeTruthy()
  } finally { app.close() }
})

it('scrolls to the feature and navigates to the current case study', async () => {
  const app = setup()
  try {
    fireEvent.click(screen.getByRole('link', { name: 'Read the feature' }))
    expect(app.router.state.location.hash).toBe('#feature')
    expect(app.scroll.mock.contexts.at(-1)).toBe(document.getElementById('feature'))
    fireEvent.click(screen.getByRole('link', { name: 'Read case study' }))
    await screen.findByRole('heading', { name: 'Noona case study' })
    expect(app.router.state.location.pathname).toBe('/projects/noona-appointment')
  } finally { app.close() }
})

it.each(['about', 'skills', 'work', 'feature', 'contact'])('handles direct homepage fragment #%s', id => {
  const app = setup(`/#${id}`)
  try {
    expect(app.scroll.mock.contexts.at(-1)).toBe(document.getElementById(id))
    expect(app.scroll).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' })
  } finally { app.close() }
})

it('respects reduced motion automatically without a motion toggle', () => {
  const app = setup()
  try {
    expect(document.querySelector('.summer-theme')?.getAttribute('data-motion')).toBe('off')
    expect(screen.queryByRole('button', { name: /animations/ })).toBeNull()
  } finally { app.close() }
})

it('adds a contrasting header surface after scrolling', () => {
  const app = setup()
  try {
    const header = screen.getByRole('navigation', { name: 'Primary navigation' }).closest('header')!
    expect(header.classList.contains('is-scrolled')).toBe(false)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })
    fireEvent.scroll(window)
    expect(header.classList.contains('is-scrolled')).toBe(true)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    fireEvent.scroll(window)
    expect(header.classList.contains('is-scrolled')).toBe(false)
  } finally {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    app.close()
  }
})

it('updates motion automatically when the system preference changes', () => {
  let update: (() => void) | undefined
  const preference = {
    matches: true,
    addListener() {}, removeListener() {},
    addEventListener: (_: string, listener: () => void) => { update = listener },
    removeEventListener() {},
  }
  const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue(preference as unknown as MediaQueryList)
  const app = setup()
  try {
    expect(document.querySelector('.summer-theme')?.getAttribute('data-motion')).toBe('off')
    act(() => { preference.matches = false; update?.() })
    expect(document.querySelector('.summer-theme')?.getAttribute('data-motion')).toBe('on')
    act(() => { preference.matches = true; update?.() })
    expect(document.querySelector('.summer-theme')?.getAttribute('data-motion')).toBe('off')
  } finally { app.close(); matchMedia.mockRestore() }
})

it.each([
  ['View all projects', '/projects', 'Project library'],
  ['View my articles', '/articles', 'Article overview'],
  ['View competitive programming', '/competitive-programming', 'Contest results'],
])('opens the newspaper destination for %s', async (label, path, heading) => {
  const app = setup()
  try {
    const index = screen.getByRole('navigation', { name: 'Newspaper sections' })
    fireEvent.click(within(index).getByRole('link', { name: label }))
    await screen.findByRole('heading', { name: heading })
    expect(app.router.state.location.pathname).toBe(path)
  } finally { app.close() }
})

it.each([true, false])('keeps contact usable when copying email succeeds: %s', async succeeds => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  const writeText = succeeds ? vi.fn().mockResolvedValue(undefined) : vi.fn().mockRejectedValue(new Error('Unavailable'))
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
  const app = setup()
  try {
    const contact = screen.getByRole('region', { name: 'Your next teammate?' })
    expect(within(contact).getByRole('link', { name: 'Send a hello' }).getAttribute('href')).toBe(`mailto:${profile.email}`)
    fireEvent.click(within(contact).getByRole('button', { name: 'Copy email address' }))
    await within(contact).findByText(succeeds ? 'Email copied. Say hello!' : 'Copy unavailable. Use “Send a hello” to email me.')
    expect(writeText).toHaveBeenCalledWith(profile.email)
  } finally {
    app.close()
    if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor)
    else Reflect.deleteProperty(navigator, 'clipboard')
  }
})

it.each([null, 'index, follow'])('keeps production indexing unchanged when previous robots was %s', async previous => {
  const originalTitle = document.title
  const prior = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  prior?.remove()
  const robots = previous === null ? null : document.createElement('meta')
  if (robots) { robots.name = 'robots'; robots.content = previous!; document.head.append(robots) }
  document.title = 'Original title'
  const app = setup()
  try {
    expect(document.title).toBe('Theerada Siri — Summer Edition')
    expect(document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content ?? null).toBe(previous)
    await act(() => app.router.navigate('/projects'))
    expect(document.title).toBe('Original title')
    expect(document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content ?? null).toBe(previous)
  } finally {
    app.close()
    robots?.remove()
    document.querySelector('meta[name="robots"]')?.remove()
    if (prior) document.head.append(prior)
    document.title = originalTitle
  }
})

it('offers immediate contact and shows a resume only when a real URL is configured', () => {
  const originalResume = profile.resumeUrl
  const app = setup()
  try {
    const cover = screen.getByRole('region', { name: profile.name })
    expect(within(cover).getByRole('link', { name: 'Email me' }).getAttribute('href')).toBe(`mailto:${profile.email}`)
    expect(within(cover).getByRole('link', { name: 'GitHub' }).getAttribute('href')).toBe(profile.github)
    expect(screen.queryByRole('link', { name: 'Resume' })).toBeNull()
  } finally { app.close() }
  profile.resumeUrl = '/resume.pdf'
  const withResume = setup()
  try {
    expect(screen.getByRole('link', { name: 'Resume' }).getAttribute('href')).toBe('/resume.pdf')
  } finally { profile.resumeUrl = originalResume; withResume.close() }
})
