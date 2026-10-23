import { ArrowUpRight, MapPin, Medal, Users } from 'lucide-react'
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
      </header>

      {photos && photos.length > 0 && <ContestGallery title={contest.title} photos={photos} />}

      <div className="icpc-result-details">
        <dl className="icpc-facts">
          <div>
            <dt><MapPin size={16} aria-hidden="true" />Host venue</dt>
            <dd>{contest.venue}</dd>
          </div>
          {contest.teamName && <div>
            <dt><Users size={16} aria-hidden="true" />Our team</dt>
            <dd>{contest.teamName}</dd>
          </div>}
        </dl>
        {contest.organizerAnnouncementUrl && (
          <div className="icpc-source-links" role="group" aria-label="Award announcements">
            {contest.organizerAnnouncementUrl && <a href={contest.organizerAnnouncementUrl} target="_blank" rel="noopener noreferrer">Organizer’s award announcement <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
          </div>
        )}
      </div>
    </article>
  )
}
