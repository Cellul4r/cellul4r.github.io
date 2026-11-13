import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import ArticlePage from './ArticlePage'
import { articles } from '../data/articles'
vi.mock('../data/articles', async importOriginal => ({ ...await importOriginal<typeof import('../data/articles')>(), articles: [] }))

it('keeps the real article contents stable during media interaction and replaces them on language change', async () => {
 const original = await vi.importActual<typeof import('../data/articles')>('../data/articles')
 const entry = original.articles.find(article => article.kind === 'local' && article.slug === 'what-is-p-and-np')!
 articles.push(entry)
 const view = render(<MemoryRouter initialEntries={['/articles/what-is-p-and-np']}><Routes><Route path="/articles/:slug" element={<ArticlePage />} /></Routes></MemoryRouter>)
 try {
   await screen.findByRole('heading', { name: 'NP คืออะไร?' }, { timeout: 5000 })
   const contents = await screen.findByRole('navigation', { name: 'Table of contents' })
   const links = within(contents).getAllByRole('link').map(link => link.textContent)
   const firstDemo = screen.getAllByRole('figure')[0]
   fireEvent.click(within(firstDemo).getByRole('button', { name: 'ขั้นถัดไป' }))
   expect(within(firstDemo).getByRole('status').textContent).toContain('แนวทแยง')
   await act(async () => {})
   expect(within(contents).getAllByRole('link').map(link => link.textContent)).toEqual(links)
   fireEvent.click(screen.getByRole('link', { name: 'English' }))
   await screen.findByRole('heading', { name: 'What is NP?' }, { timeout: 5000 })
   expect(screen.queryByRole('heading', { name: 'NP คืออะไร?' })).toBeNull()
   expect(screen.getAllByRole('figure')).toHaveLength(13)
   expect(within(screen.getByRole('navigation', { name: 'Table of contents' })).getByRole('link', { name: 'What is NP?' })).toBeTruthy()
   expect(screen.getByRole('link', { name: 'Back to articles' }).getAttribute('href')).toBe('/articles')
   const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
   expect(within(breadcrumbs).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/')
   expect(within(breadcrumbs).getByRole('link', { name: 'Articles' }).getAttribute('href')).toBe('/articles')
 } finally { view.unmount(); articles.length = 0 }
})
it('loads MDX and builds navigable contents', async () => {
 articles.push({kind:'local',slug:'fixture',title:'Fixture article',summary:'Unpublished test',topics:[],language:'en',publishedAt:'2026-01-01',load:()=>import('../test/fixtures/article.mdx')})
 const view=render(<MemoryRouter initialEntries={['/articles/fixture']}><Routes><Route path="/articles/:slug" element={<ArticlePage />} /></Routes></MemoryRouter>)
 try {
 const heading=await screen.findByRole('heading',{name:'Fixture heading'})
 const anchor=await screen.findByRole('link',{name:'Fixture heading'})
 expect(anchor.getAttribute('href')).toBe(`#${heading.id}`)
 expect(document.title).toBe('Fixture article | Theerada Siri')
 } finally { view.unmount(); articles.length=0 }
})
it('handles an unknown slug',()=>{
 const view=render(<MemoryRouter><ArticlePage /></MemoryRouter>)
 expect(screen.getByRole('heading',{name:'That route went off the map.'})).toBeTruthy()
 view.unmount()
})

it('shows a skeleton while the MDX content is delayed, then replaces it with the article', async () => {
 let release!: () => void
 const gate = new Promise<void>(resolve => { release = resolve })
 articles.push({ kind: 'local', slug: 'delayed', title: 'Delayed article', summary: 'Test fixture', topics: [], language: 'en', load: async () => { await gate; return import('../test/fixtures/article.mdx') } })
 const view = render(<MemoryRouter initialEntries={['/articles/delayed']}><Routes><Route path="/articles/:slug" element={<ArticlePage />} /></Routes></MemoryRouter>)
 try {
   const skeleton = screen.getByRole('status', { name: 'Loading article' })
   expect(skeleton.getAttribute('aria-busy')).toBe('true')
   expect(skeleton.textContent).toBe('')
   expect(screen.queryByRole('heading', { name: 'Fixture heading' })).toBeNull()
   await act(async () => release())
   await screen.findByRole('heading', { name: 'Fixture heading' })
   expect(screen.queryByRole('status', { name: 'Loading article' })).toBeNull()
 } finally { view.unmount(); articles.length = 0 }
})

it.each(['/articles/bilingual?lang=en', '/articles/bilingual-en'])('loads and switches languages from %s in one article', async path => {
 articles.push({ kind: 'local', slug: 'bilingual', title: 'Thai title', summary: 'Thai summary', language: 'th', topics: [], load: async () => ({ default: () => <h2>Thai content</h2> }), translations: { en: { title: 'English title', summary: 'English summary', load: async () => ({ default: () => <h2>English content</h2> }) } }, legacySlugs: { 'bilingual-en': 'en' } })
 const view = render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/articles/:slug" element={<ArticlePage />} /></Routes></MemoryRouter>)
 try {
   await screen.findByRole('heading', { name: 'English content' })
   expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('English title')
   expect(document.querySelector('.article-reader')?.getAttribute('lang')).toBe('en')
   const thaiLink = screen.getByRole('link', { name: '\u0e44\u0e17\u0e22' })
   expect(thaiLink.getAttribute('href')).toBe('/articles/bilingual?lang=th')
   fireEvent.click(thaiLink)
   await screen.findByRole('heading', { name: 'Thai content' })
   expect(screen.queryByRole('heading', { name: 'English content' })).toBeNull()
   expect(screen.getByRole('link', { name: 'Thai content' })).toBeTruthy()
   expect(screen.queryByRole('link', { name: 'English content' })).toBeNull()
   expect(document.querySelector('.article-reader')?.getAttribute('lang')).toBe('th')
   expect(document.title).toBe('Thai title | Theerada Siri')
 } finally { view.unmount(); articles.length = 0 }
})
