import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { beforeAll, beforeEach, expect, it, vi } from 'vitest'

let routes: RouteObject[]
const scroll = vi.fn()

beforeAll(async () => {
  const description = document.createElement('meta')
  description.name = 'description'
  document.head.append(description)
  const app = await import('../app/router')
  app.router.dispose()
  routes = app.routes
})

beforeEach(() => {
  scroll.mockClear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scroll })
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true }
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; this.dispatchEvent(new Event('close')) }
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

async function openStudy(path = '/projects/noona-appointment') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const view = render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: 'Noona Appointment' }, { timeout: 5000 })
  return { router, close: () => { view.unmount(); router.dispose() } }
}

it('opens the dedicated route with metadata and nine working section links', async () => {
  const app = await openStudy()
  try {
    await waitFor(() => {
      expect(document.title).toBe('Noona Appointment | Theerada Siri')
      expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(/last seat can only go to one person/)
    })
    const outline = screen.getByRole('navigation', { name: 'In this case study' })
    const links = within(outline).getAllByRole('link')
    expect(links.map(link => link.getAttribute('aria-label'))).toEqual([
      'Overview', 'What it does', 'The last seat', 'Architecture & schema', 'Inside the app',
      'My role', 'Limitations & next steps', 'Stack', 'Links',
    ])
    for (const link of links) {
      const id = link.getAttribute('href')!.split('#')[1]
      expect(document.getElementById(id)).not.toBeNull()
      fireEvent.click(link)
      expect(app.router.state.location.hash).toBe(`#${id}`)
    }
  } finally { app.close() }
})

it('shows the verified facts and outward links in the hero', async () => {
  const app = await openStudy()
  try {
    const hero = screen.getByRole('heading', { level: 1 }).closest('header')!
    for (const fact of ['Team Lead & Full-Stack Developer', '4 students', 'Feb–Mar 2026', 'Live on Vercel']) expect(within(hero).getByText(fact)).toBeTruthy()
    expect(within(hero).getByRole('link', { name: /Live site/ }).getAttribute('href')).toBe('https://noona-appointment.vercel.app/')
    expect(within(hero).getByRole('link', { name: /Source/ }).getAttribute('href')).toBe('https://github.com/Cellul4r/noona-appointment-web-app')
    for (const link of document.querySelectorAll('.noona-study a[target="_blank"]')) expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  } finally { app.close() }
})

it('describes the waitlist as notify-and-accept, never auto-promotion, and keeps claims within the brief', async () => {
  const app = await openStudy()
  try {
    const page = document.querySelector('.noona-study')!.textContent!
    expect(page).toMatch(/the first to accept gets the seat/)
    expect(page).not.toMatch(/auto-promot|automatically promot/i)
    expect(page).not.toMatch(/repository layer/i)
    for (const name of ['Punchita', 'Krit', 'Pitchayanat', 'Not-Tan', 'q28jes', 'Fres26']) expect(page).not.toContain(name)
    expect(page).not.toMatch(/\bgrades?\b|\d+ commits|tests? pass/i)
    expect(screen.getByText(/Proposed · not yet implemented/)).toBeTruthy()
    expect(screen.getByText('Tailwind CSS')).toBeTruthy()
  } finally { app.close() }
})

it('opens screenshots in an accessible viewer and returns focus when closed', async () => {
  const app = await openStudy('/projects/noona-appointment#noona-app')
  try {
    const opener = screen.getByRole('button', { name: /Enlarge screenshot: Noona login form/ })
    opener.focus()
    fireEvent.click(opener)
    const dialog = await screen.findByRole('dialog', { name: 'Inside the app' }, { timeout: 5000 })
    expect(within(dialog).getByRole('img', { name: /Noona login form/ })).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close screenshot viewer' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(opener)
  } finally { app.close() }
})

it('shows everything in its final state under reduced motion, including the hero illustration', async () => {
  const app = await openStudy()
  try {
    expect(screen.getByRole('img', { name: /Concept illustration of Noona/ })).toBeTruthy()
    const lines = document.querySelectorAll('.noona-edge-line')
    expect(lines).toHaveLength(5)
    for (const line of lines) expect(line.getAttribute('stroke-dasharray') ?? '').not.toMatch(/^0(px)? /)
    const pipeline = screen.getByRole('list', { name: 'Email pipeline' })
    expect(pipeline.querySelector('[data-active]')).toBeNull()
  } finally { app.close() }
})

it('highlights the matching arrow when a transition is hovered in the list', async () => {
  const app = await openStudy()
  try {
    const list = screen.getByRole('list', { name: 'All transitions' })
    const item = within(list).getByText('a confirmed user cancels or is removed').closest('li')!
    const edge = document.querySelector('[data-edge="WAITLIST-AVAILABLE"]')!
    fireEvent.mouseEnter(item)
    expect(edge.getAttribute('data-active')).toBe('true')
    expect(edge.closest('svg')!.getAttribute('data-highlighting')).toBe('true')
    expect(document.querySelector('[data-edge="start-CONFIRMED"]')!.getAttribute('data-active')).toBeNull()
    fireEvent.mouseLeave(item)
    expect(edge.getAttribute('data-active')).toBeNull()
    fireEvent.mouseEnter(within(list).getByText('cancel / host removes (row deleted)').closest('li')!)
    expect(edge.closest('svg')!.getAttribute('data-highlighting')).toBeNull()
  } finally { app.close() }
})
