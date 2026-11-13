import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Languages, List } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams, Navigate } from 'react-router-dom'
import { ArticleSkeleton } from '../components/ArticleSkeleton'
import { articleFocusMode } from '../data/articlePresentation'
import { articles } from '../data/articles'
import { useArticleMetadata } from '../hooks/useArticleMetadata'
import { NotFoundPage } from './NotFoundPage'
import './Articles.css'

export default function ArticlePage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const article = articles.find(entry => entry.kind === 'local' && (entry.slug === slug || Boolean(entry.legacySlugs?.[slug || ''])))
  const requestedLanguage = params.get('lang') || (article?.legacySlugs?.[slug || ''])
  const translation = article?.translations?.[requestedLanguage || '']
  const language = translation ? requestedLanguage! : article?.language || 'en'
  const title = translation?.title || article?.title
  const summary = translation?.summary || article?.summary
  const Content = useMemo(() => article?.kind === 'local' ? lazy(translation?.load || article.load) : null, [article, translation])
  const body = useRef<HTMLDivElement>(null)
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  useArticleMetadata(title || 'Article not found', summary || 'The requested article could not be found.')

  useEffect(() => {
    const element = body.current
    if (!element) return
    const scan = () => {
      const used = new Set<string>()
      const list = Array.from(element.querySelectorAll('h2,h3')).map((heading, index) => {
        let id = heading.id || `section-${index + 1}`
        while (used.has(id)) id += '-section'
        used.add(id)
        heading.id = id
        return { id, text: heading.textContent || '', level: heading.tagName === 'H3' ? 3 : 2 }
      })
      setHeadings(list)
    }
    scan()
    const observer = new MutationObserver(scan)
    observer.observe(element, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [article, language])

  if (!article || !Content) return <NotFoundPage />
  if (article.kind === 'local' && slug !== article.slug) {
    const next = new URLSearchParams(params)
    next.set('lang', article.legacySlugs![slug!])
    return <Navigate replace to={`/articles/${article.slug}?${next}`} />
  }
  const languages = [article.language, ...Object.keys(article.translations || {})]
  const series = article.series ? articles.filter(entry => entry.kind === 'local' && entry.language === article.language && entry.series?.name === article.series?.name).sort((a, b) => a.series!.order - b.series!.order) : []
  const index = series.indexOf(article)
  const adjacent = [series[index - 1], series[index + 1]].filter(Boolean)

  return (
    <div className={`article-reader-page${articleFocusMode ? ' is-focused' : ''}`}>
      <article className="container article-reader" lang={language}>
        {!articleFocusMode && <nav className="article-breadcrumbs" aria-label="Breadcrumb" lang="en">
          <Link to="/">Home</Link><ChevronRight size={14} aria-hidden="true" /><Link to="/articles">Articles</Link>
        </nav>}
        <header className="article-reader-header">
          <div className="article-reader-meta" lang="en"><span><BookOpen size={16} aria-hidden="true" />{language === 'th' ? 'Thai' : language === 'en' ? 'English' : language}</span>{article.draft && <span className="article-draft"><span aria-hidden="true" />Draft</span>}{article.publishedAt && <time dateTime={article.publishedAt}>{article.publishedAt}</time>}</div>
          <h1>{title}</h1>
          <p className="article-reader-summary">{summary}</p>
          <div className="article-reader-tools">
            <div className="article-topics">{article.topics.map(topic => <span key={topic}>{topic}</span>)}</div>
            {languages.length > 1 && <nav className="article-languages" aria-label="Article language" lang="en">
              <Languages size={17} aria-hidden="true" />
              {languages.map(code => {
                const next = new URLSearchParams(params)
                next.set('lang', code)
                return <Link key={code} className="article-language-link" to={{ search: `?${next}` }} preventScrollReset lang={code} aria-current={language === code ? 'true' : undefined}>{code === 'th' ? '\u0e44\u0e17\u0e22' : code === 'en' ? 'English' : code}</Link>
              })}
            </nav>}
          </div>
        </header>
        <div className="article-reading-layout">
          <aside className="article-contents">
            {headings.length > 0 && <nav aria-label="Table of contents" lang="en">
              <p className="article-contents-title" lang={language}><List size={16} aria-hidden="true" />{language === 'th' ? 'สารบัญ' : 'On this page'}</p>
              <ul>{headings.map(heading => <li key={heading.id} className={heading.level === 3 ? 'article-contents-subheading' : undefined}><a href={`#${heading.id}`} lang={language}>{heading.text}</a></li>)}</ul>
            </nav>}
          </aside>
          <div className="article-reading-content">
            {article.draft && <p className="article-draft-note" lang="en"><span className="article-draft-marker" aria-hidden="true" />This article is a work in progress.</p>}
            <div ref={body} className="article-prose" key={`${slug}-${language}`}>
              <Suspense fallback={<ArticleSkeleton variant="body" />}><Content /></Suspense>
            </div>
            {adjacent.length > 0 && <nav className="article-series" aria-label="Series navigation" lang="en">{adjacent.map(entry => entry.kind === 'local' ? <Link key={entry.slug} to={`/articles/${entry.slug}`}><span>{entry.series!.order < article.series!.order ? 'Previous part' : 'Next part'}</span>{entry.title}<ArrowRight size={17} aria-hidden="true" /></Link> : null)}</nav>}
            {!articleFocusMode && <Link className="article-back" to="/articles" lang="en"><ArrowLeft size={17} aria-hidden="true" />Back to articles</Link>}
          </div>
        </div>
      </article>
    </div>
  )
}
