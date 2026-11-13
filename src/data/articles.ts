import type { ComponentType } from 'react'
export type ArticleTranslation = {
  title: string
  summary: string
  load: () => Promise<{ default: ComponentType }>
}

export type Article = {
  title: string; summary: string; topics: string[]; language: string; publishedAt?: string; draft?: boolean; translations?: Record<string, ArticleTranslation>; legacySlugs?: Record<string, string>
  series?: { name: string; order: number }
} & ({ kind: 'local'; slug: string; load: () => Promise<{ default: ComponentType }> } | { kind: 'external'; source: string; url: string })
export const articles: Article[] = [
  { kind: 'local', slug: 'what-is-p-and-np', title: 'P และ NP คืออะไร? (ตอนที่ 1)', summary: 'ตอนเรียน Algorithms ผมงงว่า P กับ NP ต่างกันยังไง เลยลองเรียบเรียงสิ่งที่เข้าใจผ่านโจทย์วางควีน ว่าการหาคำตอบกับการตรวจคำตอบต่างกันตรงไหนครับ', topics: ['Algorithms', 'Complexity theory'], language: 'th', draft: false, series: { name: 'P and NP', order: 1 }, load: () => import('../content/articles/what-is-p-and-np-th.mdx'),
    translations: {
      en: { title: 'What are P and NP? (Part 1)', summary: 'P and NP confused me in Algorithms class, so I wanted to write down how I understand them. It starts with a queen puzzle and the difference between finding an answer and checking one.', load: () => import('../content/articles/what-is-p-and-np-en.mdx') },
    },
    legacySlugs: { 'what-is-p-and-np-th': 'th', 'what-is-p-and-np-en': 'en' },
  },
]

export function filterArticles(items: Article[], query: string, topic: string, source: string) {
  return items.filter(a => (!query || [a.title, a.summary, ...Object.values(a.translations || {}).flatMap(translation => [translation.title, translation.summary])].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase())) && (!topic || a.topics.includes(topic)) && (!source || a.kind === source)).sort((a,b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
}
