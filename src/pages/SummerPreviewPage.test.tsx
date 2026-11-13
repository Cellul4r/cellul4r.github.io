import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { expect, it } from 'vitest'
import SummerPreviewPage from './SummerPreviewPage'

it.each(['', '?edition=summer#contact'])('redirects the old preview link to the homepage and preserves %s', async suffix => {
  const router = createMemoryRouter([
    { path: '/preview/summer', element: <SummerPreviewPage /> },
    { path: '/', element: <h1>The summer edition</h1> },
  ], { initialEntries: [`/preview/summer${suffix}`] })
  const view = render(<RouterProvider router={router} />)
  try {
    await screen.findByRole('heading', { name: 'The summer edition' })
    await waitFor(() => expect(router.state.location.pathname + router.state.location.search + router.state.location.hash).toBe(`/${suffix}`))
    expect(router.state.historyAction).toBe('REPLACE')
  } finally { view.unmount(); router.dispose() }
})
