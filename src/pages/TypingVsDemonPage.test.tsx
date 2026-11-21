import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeAll, beforeEach, expect, it, vi } from 'vitest'
import type { RouteObject } from 'react-router-dom'

let routes: RouteObject[]

beforeAll(async () => {
  const app = await import('../app/router')
  app.router.dispose()
  routes = app.routes
})

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

function openProject(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const view = render(<RouterProvider router={router} />)
  return () => { view.unmount(); router.dispose() }
}

it('opens the dedicated case study directly and provides working section targets and media links', async () => {
  const close = openProject('/projects/typing-vs-demon')
  try {
    await screen.findByRole('heading', { level: 1, name: /Typing.*VS Demon/ }, { timeout: 5000 })
    const playLink = screen.getByRole('link', { name: 'Play game' })
    expect(playLink.getAttribute('href')).toBe('https://cellul4r.github.io/typing_vs_demon_game/')
    expect(playLink.getAttribute('target')).toBe('_blank')
    const playNote = document.getElementById(playLink.getAttribute('aria-describedby')!)
    expect(playNote?.textContent).toMatch(/desktop with a keyboard/)
    expect(playNote?.textContent).toMatch(/first load may take a moment/i)
    const navigation = screen.getByRole('navigation', { name: 'In this case study' })
    expect(navigation.classList.contains('case-study-outline')).toBe(true)
    for (const link of within(navigation).getAllByRole('link')) {
      expect(document.getElementById(link.getAttribute('href')!.split('#')[1])).not.toBeNull()
    }
    const gameplay = screen.getByAltText(/Typing VS Demon gameplay/)
    expect(gameplay.getAttribute('loading')).toBe('eager')
    expect(gameplay.getAttribute('fetchpriority')).toBe('high')
    const showcase = screen.getByAltText(/Students in a computer lab/)
    expect(showcase.getAttribute('loading')).toBe('lazy')
    expect(showcase.closest('a')?.getAttribute('href')).toBe(showcase.getAttribute('src'))
    expect(screen.getByRole('link', { name: /TommyQ: Zombie Defender/ }).getAttribute('href')).toBe('https://www.typing.com/student/game/tommyq')
  } finally { close() }
})

it('distinguishes the state redesign from its implementation and exposes diagram text alternatives', async () => {
  const close = openProject('/projects/typing-vs-demon')
  try {
    await screen.findByRole('heading', { level: 1, name: /Typing.*VS Demon/ }, { timeout: 5000 })
    expect(screen.getByText('I planned the redesigned structure and delegated its implementation to a teammate.')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Inside the Wave subsystem.' })).toBeTruthy()
    const waveList = screen.getByRole('list', { name: 'Wave implementation details' })
    const wavePoints = within(waveList).getAllByRole('listitem')
    expect(wavePoints).toHaveLength(3)
    for (const point of wavePoints) {
      const source = within(point).getByRole('link')
      expect(source.getAttribute('href')).toMatch(/\/(Wave|Enemy)\.java#L\d+-L\d+$/)
      source.focus()
      expect(document.activeElement).toBe(source)
    }
    expect(screen.getByRole('link', { name: 'Explore Wave.java' }).getAttribute('href')).toContain('/event/Wave.java#L22-L66')
    expect(screen.getByRole('link', { name: 'See the enemy speed limit' }).getAttribute('href')).toContain('/entity/Enemy.java#L94-L97')
    expect(screen.getByRole('img', { name: /Simplified inheritance hierarchy/ })).toBeTruthy()
    expect(screen.getByRole('img', { name: /GameStateManager holds a current GameState/ })).toBeTruthy()
    for (const source of screen.getAllByRole('link', { name: 'View source' })) {
      expect(source.getAttribute('href')).toBe('https://github.com/Cellul4r/typing_vs_demon_game')
    }
  } finally { close() }
})

it('routes Noona to its own dedicated case study rather than the generic detail page', async () => {
  const close = openProject('/projects/noona-appointment')
  try {
    await screen.findByRole('heading', { level: 1, name: 'Noona Appointment' }, { timeout: 5000 })
    expect(screen.queryByRole('heading', { name: 'Architecture at a glance.' })).toBeNull()
    expect(screen.getByRole('navigation', { name: 'In this case study' })).toBeTruthy()
  } finally { close() }
})
