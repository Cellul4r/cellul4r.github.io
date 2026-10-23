import { ArrowUpRight, CalendarDays, MapPin, Medal, Users } from 'lucide-react'
import type { Contest } from '../types/portfolio'
import { ContestGallery } from './ContestGallery'

export function ContestCard({ contest }: { contest: Contest }) {
  const photos = contest.photos
  const hasPhotos = Boolean(photos?.length)

  return (
    <article className={`icpc-result ${hasPhotos ? 'icpc-result-featured' : 'icpc-result-compact'}`} aria-labelledby={`contest-${contest.year}`}>
      <header className="icpc-result-heading">
        <div className="icpc-result-topline">
          <span className="icpc-year">{contest.year}</span>
          <span className="icpc-award"><Medal size={17} aria-hidden="true" />{contest.placement}</span>
        </div>
        <h3 id={`contest-${contest.year}`}>{contest.title}</h3>
        <p className="icpc-standing"><strong>{contest.rank}</strong><span>{contest.field}</span></p>
        {contest.highlights && contest.highlights.length > 0 && (
          <dl className="icpc-highlights">
            {contest.highlights.map((highlight) => <div key={highlight.label}><dt>{highlight.label}</dt><dd>{highlight.value}</dd></div>)}
          </dl>
        )}
      </header>

      {photos && photos.length > 0 && <ContestGallery title={contest.title} photos={photos} />}

      <div className="icpc-result-details">
        <dl className="icpc-facts">
          {contest.date && <div>
            <dt><CalendarDays size={16} aria-hidden="true" />Contest dates</dt>
            <dd>{contest.date}</dd>
          </div>}
          <div>
            <dt><MapPin size={16} aria-hidden="true" />Host venue</dt>
            <dd>{contest.venue}</dd>
          </div>
          {contest.teamName && <div>
            <dt><Users size={16} aria-hidden="true" />Our team</dt>
            <dd>{contest.teamName}</dd>
          </div>}
        </dl>
        {contest.organizerLink && (
          <div className="icpc-source-links" role="group" aria-label="Contest organizer">
            <a href={contest.organizerLink.url} target="_blank" rel="noopener noreferrer">{contest.organizerLink.label} <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        )}
      </div>
    </article>
  )
}
