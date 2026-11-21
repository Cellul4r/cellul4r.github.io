import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { usePaperTilt, useSummerMotion } from '../summer/SummerMotion'
import type { NoonaMedia } from '../../data/noonaAppointmentMedia'

const PhotoViewer = lazy(() => import('../PhotoViewer').then(module => ({ default: module.PhotoViewer })))

export interface ScreenCard {
  media: NoonaMedia
  path?: string
  detail?: string
}

export function useScreenViewer(title: string, media: NoonaMedia[]) {
  const [active, setActive] = useState<number | null>(null)
  const viewer = active !== null && (
    <Suspense fallback={<p className="noona-viewer-loading" role="status">Opening screenshot…</p>}>
      <PhotoViewer
        title={title}
        eyebrow="Noona Appointment"
        itemLabel="screenshot"
        groupLabel="Select a screenshot"
        photos={media.map(item => ({ ...item, thumbnailSrc: item.src }))}
        activeIndex={active}
        onIndexChange={setActive}
        onClose={() => setActive(null)}
      />
    </Suspense>
  )
  return { open: (id: string) => setActive(media.findIndex(item => item.id === id)), viewer }
}

export function ScreenFrame({ card, onOpen, priority = false, index = 0 }: { card: ScreenCard; onOpen: (id: string) => void; priority?: boolean; index?: number }) {
  const { media } = card
  const { enabled } = useSummerMotion()
  const tilt = usePaperTilt()
  const [engaged, setEngaged] = useState(false)
  const restAngle = enabled ? (index % 2 ? .5 : -.5) : 0
  return (
    <figure className="noona-screen">
      <motion.div
        className="noona-screen-paper"
        data-engaged={engaged ? 'true' : undefined}
        style={tilt.style}
        initial={false}
        animate={{ rotate: engaged ? 0 : restAngle }}
        transition={{ duration: enabled ? .3 : 0, ease: 'easeOut' }}
        onPointerMove={tilt.onPointerMove}
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => { tilt.onPointerLeave(); setEngaged(false) }}
        onFocusCapture={() => setEngaged(true)}
        onBlurCapture={() => setEngaged(false)}
      >
        <button type="button" className="noona-screen-frame" onClick={() => onOpen(media.id)} aria-label={`Enlarge screenshot: ${media.alt}`}>
          <img src={media.src} width={media.width} height={media.height} alt={media.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
          <span className="noona-screen-zoom" aria-hidden="true"><Maximize2 size={14} />Enlarge</span>
        </button>
      </motion.div>
      <figcaption>
        {card.path && <code>{card.path}</code>}
        <span>{card.detail ?? media.caption}</span>
      </figcaption>
    </figure>
  )
}
