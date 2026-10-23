import { ArrowUpRight, Images, Maximize2 } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import type { ContestPhoto } from '../types/portfolio'

const PhotoViewer = lazy(() => import('./PhotoViewer').then((module) => ({ default: module.PhotoViewer })))

interface ContestGalleryProps {
  title: string
  photos: ContestPhoto[]
}

export function ContestGallery({ title, photos }: ContestGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const mainPhoto = photos[0]
  if (!mainPhoto) return null

  return (
    <div className="contest-gallery">
      <figure className="contest-gallery-main">
        <button className="contest-photo-button" type="button" onClick={() => setActiveIndex(0)} aria-label={`Enlarge photo: ${mainPhoto.caption}`} aria-haspopup="dialog">
          <img src={mainPhoto.previewSrc} srcSet={`${mainPhoto.previewSrc} 960w, ${mainPhoto.src} ${mainPhoto.width}w`} sizes="(min-width: 1024px) 640px, (min-width: 768px) 90vw, 100vw" width={mainPhoto.width} height={mainPhoto.height} alt={mainPhoto.alt} loading="lazy" decoding="async" />
          <span className="contest-photo-expand" aria-hidden="true"><Maximize2 size={17} /></span>
        </button>
        <figcaption>{mainPhoto.caption}</figcaption>
      </figure>

      <div className="contest-gallery-thumbnails">
        {photos.slice(1).map((photo, index) => (
          <figure key={photo.src}>
            <button className="contest-photo-button" type="button" onClick={() => setActiveIndex(index + 1)} aria-label={`Enlarge photo: ${photo.caption}`} aria-haspopup="dialog">
              <img src={photo.thumbnailSrc} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" />
            </button>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>

      <button className="contest-gallery-all" type="button" onClick={() => setActiveIndex(0)} aria-haspopup="dialog"><Images size={17} aria-hidden="true" />View all {photos.length} photos<ArrowUpRight size={17} aria-hidden="true" /></button>

      {activeIndex !== null && <Suspense fallback={<p className="contest-gallery-loading" role="status">Opening photo viewer…</p>}><PhotoViewer title={title} photos={photos} activeIndex={activeIndex} onIndexChange={setActiveIndex} onClose={() => setActiveIndex(null)} /></Suspense>}
    </div>
  )
}
