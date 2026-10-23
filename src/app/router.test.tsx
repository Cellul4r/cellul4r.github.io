import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import type { ReactElement } from 'react'
import { expect, it, vi } from 'vitest'

const deferred = vi.hoisted(() => {
  let resolve!: (module: { CodeforcesPage: () => ReactElement }) => void
  const promise = new Promise<{ CodeforcesPage: () => ReactElement }>(complete => { resolve = complete })
  return { promise, resolve }
})

vi.mock('../pages/CodeforcesPage', () => deferred.promise)
vi.mock('../features/competitive-programming/matching/MatchingDemo', () => ({ MatchingDemo: () => <div aria-label="Matching animation" /> }))

it('immediately replaces the overview with a skeleton while the Codeforces bundle is delayed', async () => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  const { routes, router: browserRouter } = await import('./router')
  browserRouter.dispose()
  const router = createMemoryRouter(routes, { initialEntries: ['/competitive-programming'] })
  const view = render(<RouterProvider router={router} />)
  try {
    await screen.findByRole('heading', { name: /Think clearly/ })
    fireEvent.click(screen.getByRole('link', { name: 'Codeforces profile' }))
    // The module promise remains unresolved: navigation must not wait for it.
    expect(router.state.location.pathname).toBe('/competitive-programming/codeforces')
    expect(screen.queryByRole('heading', { name: /Think clearly/ })).toBeNull()
    expect(screen.getByText('Loading Codeforces profile…')).toBeTruthy()
    expect(screen.getAllByLabelText(/: loading$/)).toHaveLength(4)
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Competitive Programming' })).toBeTruthy()
    await act(async () => deferred.resolve({ CodeforcesPage: () => <h1>Loaded Codeforces profile</h1> }))
    await screen.findByRole('heading', { name: 'Loaded Codeforces profile' })
    expect(screen.queryByText('Loading Codeforces profile…')).toBeNull()
  } finally { view.unmount(); router.dispose() }
})
