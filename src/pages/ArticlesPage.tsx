import { ArrowRight, ArrowUpRight, BookOpen, NotebookPen, Search, SlidersHorizontal } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArticleFilterSelect } from '../components/ArticleFilterSelect'
import { articles, filterArticles } from '../data/articles'
import { useArticleMetadata } from '../hooks/useArticleMetadata'
import './Articles.css'

export default function ArticlesPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const topic = params.get('topic') || ''
  const source = params.get('source') || ''
  const topics = [...new Set(articles.flatMap(article => article.topics))].sort()
  const results = filterArticles(articles, query.trim(), topic, source)
  const hasFilters = Boolean(query || topic || source)
  useArticleMetadata('Articles', 'Writing by Theerada Siri on software, systems, networks, and problem solving.')

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <div className="articles-page">
      <header className="container articles-hero">
        <div className="articles-hero-copy">
          <p className="articles-kicker"><NotebookPen size={18} aria-hidden="true" /> My learning notebook</p>
          <h1>Articles &amp;<br />field notes.</h1>
          <p>Making sense of software, systems, and algorithms.<br className="articles-desktop-break" /> A place for explanations, questions, and things I learn along the way.</p>
        </div>
        <div className="articles-notebook" aria-hidden="true">
          <div className="notebook-page"><BookOpen strokeWidth={1.25} /><span>Ideas worth<br />exploring.</span><i /><i /><i /></div>
        </div>
      </header>

      <section className="container articles-library" aria-label="Article library">
        <div className="articles-library-heading">
          <h2>Browse the notebook</h2>
          <span>{articles.length} {articles.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        <form className="article-filters" role="search" onSubmit={event => event.preventDefault()}>
          <label className="article-search">
            <span className="sr-only">Search articles</span>
            <Search size={18} aria-hidden="true" />
            <input type="search" value={query} placeholder="Find something to read..." onChange={event => update('q', event.target.value)} />
          </label>
          <ArticleFilterSelect label="Topic" value={topic} options={[{ value: '', label: 'All topics' }, ...topics.map(value => ({ value, label: value }))]} onChange={value => update('topic', value)} icon={<SlidersHorizontal size={16} aria-hidden="true" />} />
          <ArticleFilterSelect label="Source" value={source} options={[{ value: '', label: 'All sources' }, { value: 'local', label: 'On this site' }, { value: 'external', label: 'External' }]} onChange={value => update('source', value)} />
        </form>
        <div className="articles-results-bar">
          <p role="status">{results.length} {results.length === 1 ? 'article' : 'articles'}{hasFilters ? ' found' : ' to explore'}</p>
          {hasFilters && <button type="button" className="articles-reset" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>Reset filters</button>}
        </div>

        {articles.length === 0 ? (
          <div className="article-empty">
            <NotebookPen size={36} strokeWidth={1.4} aria-hidden="true" />
            <h3>No articles published yet</h3>
            <p>Future articles will appear here, including writing published elsewhere.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="article-empty">
            <Search size={32} aria-hidden="true" />
            <h3>No matching articles</h3>
            <p>Try a different search or reset the filters to see every entry.</p>
          </div>
        ) : (
          <ul className="article-list">
            {results.map(article => (
              <li key={article.kind === 'local' ? article.slug : article.url}>
                <article className={`article-card${article.language === 'th' ? ' article-card-thai' : ''}`}>
                  <div className="article-card-top">
                    <span className="article-source"><BookOpen size={15} aria-hidden="true" />{article.kind === 'local' ? 'On this site' : article.source}</span>
                    {article.draft && <span className="article-draft"><span aria-hidden="true" />Draft</span>}
                  </div>
                  <div className="article-topics">{article.topics.map(value => <span key={value}>{value}</span>)}</div>
                  <h3 lang={article.language}>
                    {article.kind === 'local' ? (
                      <Link className="article-title-link" to={`/articles/${article.slug}`}>{article.title}</Link>
                    ) : (
                      <a className="article-title-link" href={article.url} aria-label={`${article.title} (opens in a new tab)`} target="_blank" rel="noopener noreferrer">{article.title}</a>
                    )}
                  </h3>
                  <p className="article-card-summary" lang={article.language}>{article.summary}</p>
                  <div className="article-card-bottom">
                    <span>{[article.language, ...Object.keys(article.translations || {})].map(code => code === 'th' ? 'Thai' : code === 'en' ? 'English' : code).join(' / ')}{article.publishedAt && <> / <time dateTime={article.publishedAt}>{article.publishedAt}</time></>}</span>
                    <span className="article-read-label" aria-hidden="true">{article.kind === 'external' ? <>Read on {article.source}<ArrowUpRight size={18} /></> : <>Read {article.draft ? 'draft' : 'article'}<ArrowRight size={18} /></>}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
