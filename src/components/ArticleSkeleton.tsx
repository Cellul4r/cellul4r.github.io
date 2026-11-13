import { articleFocusMode } from '../data/articlePresentation'
import './ArticleSkeleton.css'

function SkeletonLines() {
  return <div className="article-skeleton-lines" aria-hidden="true">
    <span className="article-skeleton-block article-skeleton-section" />
    {Array.from({ length: 5 }, (_, index) => <span key={index} className="article-skeleton-block" />)}
    <span className="article-skeleton-block article-skeleton-section" />
    {Array.from({ length: 4 }, (_, index) => <span key={index} className="article-skeleton-block" />)}
  </div>
}

export function ArticleSkeleton({ variant = 'reader' }: { variant?: 'reader' | 'body' | 'library' }) {
  if (variant === 'body') {
    return <div className="article-skeleton" role="status" aria-label="Loading article" aria-busy="true"><SkeletonLines /></div>
  }

  const library = variant === 'library'
  return <div className={`article-skeleton article-skeleton-page${!library && articleFocusMode ? ' is-focused' : ''}`} role="status" aria-label={library ? 'Loading articles' : 'Loading article'} aria-busy="true">
    <div className={`container article-skeleton-shell${library ? ' is-library' : ''}`} aria-hidden="true">
      <div className="article-skeleton-header">
        <span className="article-skeleton-block article-skeleton-meta" />
        <span className="article-skeleton-block article-skeleton-title" />
        <span className="article-skeleton-block article-skeleton-summary" />
        <span className="article-skeleton-block article-skeleton-summary" />
        <div className="article-skeleton-tags"><span className="article-skeleton-block" /><span className="article-skeleton-block" /></div>
      </div>
      {library ? <>
        <div className="article-skeleton-block article-skeleton-toolbar" />
        <div className="article-skeleton-cards">{[0, 1].map(index => <div className="article-skeleton-card" key={index}><SkeletonLines /></div>)}</div>
      </> : <div className="article-skeleton-reading">
        <div className="article-skeleton-sidebar">{Array.from({ length: 5 }, (_, index) => <span className="article-skeleton-block" key={index} />)}</div>
        <SkeletonLines />
      </div>}
    </div>
  </div>
}
