import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import ArticlesPage from './ArticlesPage'
import { articles } from '../data/articles'
vi.mock('../data/articles', async importOriginal => ({ ...await importOriginal<typeof import('../data/articles')>(), articles: [] }))
it('renders the truthful empty catalog', () => {
 const view = render(<MemoryRouter><ArticlesPage /></MemoryRouter>)
 expect(screen.getByRole('heading', { name: 'No articles published yet' })).toBeTruthy()
 view.unmount()
})
it('opens external originals safely and filters the list', () => {
 articles.push({ kind:'external', title:'Example note', summary:'Test fixture', topics:['Testing'], language:'en', publishedAt:'2026-01-01', source:'Medium', url:'https://example.com/note' })
 const view = render(<MemoryRouter><ArticlesPage /></MemoryRouter>)
 try {
 const link = screen.getByRole('link', { name:'Example note (opens in a new tab)' })
 expect(link.getAttribute('target')).toBe('_blank')
 expect(link.getAttribute('rel')).toContain('noopener')
 fireEvent.change(screen.getByLabelText('Search articles'), {target:{value:'missing'}})
 expect(screen.getByRole('heading',{name:'No matching articles'})).toBeTruthy()
 fireEvent.click(screen.getByRole('button',{name:'Reset filters'}))
 expect(screen.getByRole('link',{name:'Example note (opens in a new tab)'})).toBeTruthy()
 } finally {view.unmount(); articles.length=0}
})
