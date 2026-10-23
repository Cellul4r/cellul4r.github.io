import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ContestPhoto } from '../../../types/portfolio'

interface PhotoViewerProps {
  title: string
  photos: ContestPhoto[]
  activeIndex: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function PhotoViewer({ title, photos, activeIndex, onIndexChange, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const captionId = useId()
  const photo = photos[activeIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousOverflow = document.body.style.overflow
    if (!openerRef.current && document.activeElement instanceof HTMLElement) openerRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
      openerRef.current?.focus({ preventScroll: true })
    }
  }, [])

  if (!photo) return null

  return createPortal(
    <dialog ref={dialogRef} className="photo-viewer" aria-labelledby={titleId} aria-describedby={captionId} onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          const direction = event.key === 'ArrowLeft' ? -1 : 1
          onIndexChange(Math.max(0, Math.min(photos.length - 1, activeIndex + direction)))
        }
      }}>
      <div className="photo-viewer-shell">
        <header className="photo-viewer-header">
          <div><p className="photo-viewer-eyebrow">Contest memories</p><h2 id={titleId}>{title}</h2></div>
          <button className="photo-viewer-icon" type="button" aria-label="Close photo viewer" autoFocus onClick={() => dialogRef.current?.close()}><X size={22} aria-hidden="true" /></button>
        </header>

        <figure className="photo-viewer-figure">
          <div className="photo-viewer-stage"><img key={photo.src} className="photo-viewer-image" src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} decoding="async" /></div>
          <figcaption id={captionId} aria-live="polite"><span>{photo.caption}</span><span className="photo-viewer-counter">{activeIndex + 1} / {photos.length}</span></figcaption>
        </figure>

        <div className="photo-viewer-controls">
          <button className="photo-viewer-icon" type="button" disabled={activeIndex === 0} aria-label="Previous photo" onClick={() => onIndexChange(activeIndex - 1)}><ChevronLeft size={24} aria-hidden="true" /></button>
          <div className="photo-viewer-thumbnails" role="group" aria-label="Select a contest photo" style={{ gridTemplateColumns: `repeat(${Math.min(4, photos.length)}, minmax(0, 1fr))` }}>
            {photos.map((item, index) => <button key={item.src} type="button" aria-label={`Photo ${index + 1}: ${item.caption}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => onIndexChange(index)}><img src={item.thumbnailSrc} width={item.width} height={item.height} alt="" /></button>)}
          </div>
          <button className="photo-viewer-icon" type="button" disabled={activeIndex === photos.length - 1} aria-label="Next photo" onClick={() => onIndexChange(activeIndex + 1)}><ChevronRight size={24} aria-hidden="true" /></button>
        </div>
      </div>
    </dialog>, document.body,
  )
}
