import { act, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { expect, it } from 'vitest'
import { Navbar } from './Navbar'

function renderNavbar(path = '/') {
  const router = createMemoryRouter([{ path: '*', element: <Navbar /> }], { initialEntries: [path] })
  const view = render(<RouterProvider router={router} />)
  return { router, ...view }
}

it('keeps four destinations, uses the brand for home, and highlights nested routes', async () => {
  const { router } = renderNavbar('/projects/example')
  for (const label of ['Projects', 'Competitive Programming', 'Articles', 'Contact']) {
    expect(screen.getByRole('link', { name: label })).toBeTruthy()
  }
  expect(screen.queryByRole('link', { name: 'Home' })).toBeNull()
  expect(screen.queryByRole('link', { name: 'Skills' })).toBeNull()
  expect(screen.getAllByRole('link')).toHaveLength(5)
  expect(screen.getByRole('link', { name: 'Projects' }).getAttribute('aria-current')).toBe('page')
  await act(() => router.navigate('/articles/example'))
  expect(screen.getByRole('link', { name: 'Articles' }).getAttribute('aria-current')).toBe('page')
  await act(() => router.navigate('/#skills'))
  expect(screen.getByRole('link', { name: 'Theerada Siri, home' }).hasAttribute('aria-current')).toBe(false)
  await act(() => router.navigate('/#contact'))
  expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('aria-current')).toBe('location')
  router.dispose()
})

it('exposes all section links directly without a menu toggle', () => {
  const { router } = renderNavbar()
  expect(screen.queryByRole('button')).toBeNull()
  const projects = screen.getByRole('link', { name: 'Projects' })
  projects.focus()
  expect(document.activeElement).toBe(projects)
  expect(projects.getAttribute('href')).toBe('/projects')
  router.dispose()
})

it('navigates to articles and provides a clear route home', async () => {
  const { router } = renderNavbar()
  fireEvent.click(screen.getByRole('link', { name: 'Articles' }))
  expect(router.state.location.pathname).toBe('/articles')
  fireEvent.click(screen.getByRole('link', { name: 'Theerada Siri, home' }))
  expect(router.state.location.pathname).toBe('/')
  router.dispose()
})

it('changes scroll styling without changing navigation state', () => {
  const { router, container } = renderNavbar()
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 80 })
  fireEvent.scroll(window)
  expect(container.querySelector('.summer-theme-header.is-scrolled')).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Theerada Siri, home' }).getAttribute('aria-current')).toBe('page')
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  fireEvent.scroll(window)
  expect(container.querySelector('.summer-theme-header.is-scrolled')).toBeNull()
  router.dispose()
})
