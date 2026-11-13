import { expect, it } from 'vitest'
import { filterArticles, type Article } from './articles'
const entries: Article[] = [
 { kind:'external', title:'Networks', summary:'Routing notes', topics:['Networks'], language:'en', publishedAt:'2026-01-01', source:'Medium', url:'https://example.com/post' },
 { kind:'local', title:'Algorithms', summary:'Finding paths', topics:['Algorithms'], language:'en', publishedAt:'2026-02-01', slug:'algorithms', load:async()=>({default:()=>null}) },
]
it('sorts newest first without mutating the catalog',()=>{expect(filterArticles(entries,'','','')[0].title).toBe('Algorithms');expect(entries[0].title).toBe('Networks')})
it('combines case-insensitive search, source and topic filters',()=>{expect(filterArticles(entries,'ROUTING','Networks','external')).toHaveLength(1);expect(filterArticles(entries,'ROUTING','Networks','local')).toHaveLength(0)})
it('supports an empty catalog',()=>expect(filterArticles([],'','','')).toEqual([]))

it('finds a bilingual article by its translated title without duplicate entries', () => {
 const bilingual: Article = { ...entries[1], translations: { th: { title: 'Translated title', summary: 'Translated summary', load: async () => ({ default: () => null }) } } }
 expect(filterArticles([bilingual], 'translated title', '', '')).toEqual([bilingual])
})
