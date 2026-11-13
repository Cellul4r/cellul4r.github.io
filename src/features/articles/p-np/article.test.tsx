import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

it.each(['th', 'en'] as const)('renders the full %s MDX article and all shared media', async language => {
  const { default: Article } = language === 'th'
    ? await import('../../../content/articles/what-is-p-and-np-th.mdx')
    : await import('../../../content/articles/what-is-p-and-np-en.mdx')
  const view = render(<Article />)
  try {
    expect(screen.getAllByRole('figure')).toHaveLength(13)
    expect(screen.getByRole('heading', { name: language === 'th' ? 'NP คืออะไร?' : 'What is NP?' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: language === 'th' ? 'แหล่งอ้างอิง' : 'References' })).toBeTruthy()
    expect(screen.getAllByText('A ≤p B').length).toBeGreaterThan(0)
    expect(view.container.querySelectorAll('h1')).toHaveLength(0)
    expect(view.container.textContent).not.toContain('หมายเหตุสื่อประกอบ')
    expect(view.container.textContent).not.toContain('\u2014')
  } finally { view.unmount() }
})
