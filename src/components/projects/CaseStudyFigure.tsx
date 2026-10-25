import { ArrowUpRight } from 'lucide-react'
import type { ProjectMedia } from '../../types/portfolio'

export function CaseStudyFigure({ media, priority = false, className = '' }: { media: ProjectMedia; priority?: boolean; className?: string }) {
  return (
    <figure className={`tvd-figure ${className}`}>
      <a className="tvd-image-link" data-feedback="action" href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${media.alt} (new tab)`}>
        <img src={media.src} width={media.width} height={media.height} alt={media.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
        <span className="tvd-image-action" aria-hidden="true">Full size <ArrowUpRight size={14} /></span>
      </a>
      <figcaption>{media.caption}</figcaption>
    </figure>
  )
}
