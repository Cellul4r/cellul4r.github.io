import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { financialAdvisorMedia } from '../../data/financialAdvisorMedia'
import { useSummerMotion } from '../summer/SummerMotion'

export function FinancialAdvisorGallery() {
  const [selected, setSelected] = useState(financialAdvisorMedia[0])
  const { enabled } = useSummerMotion()
  const id = useId()
  return (
    <div className="finance-gallery">
      <div className="finance-gallery-heading"><h3>See the application</h3><p>Actual app captures supplied for this case study.</p></div>
      <figure id={id} className="finance-capture">
        <a className="finance-gallery-stage" href={selected.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size screenshot: ${selected.title} (new tab)`}>
          <motion.img key={selected.id} src={selected.src} width={selected.width} height={selected.height} alt={selected.alt} loading="lazy" decoding="async" initial={enabled ? { opacity: .45 } : false} animate={{ opacity: 1 }} transition={{ duration: enabled ? .25 : 0 }} />
          <span className="finance-gallery-zoom" aria-hidden="true">Full size <ArrowUpRight size={14} /></span>
        </a>
        <figcaption aria-live="polite">{selected.caption}</figcaption>
      </figure>
      <div className="finance-gallery-picker" role="group" aria-label="Application screenshots">{financialAdvisorMedia.map(capture => (
        <button key={capture.id} type="button" aria-pressed={selected.id === capture.id} aria-controls={id} onClick={() => setSelected(capture)}>
          <img src={capture.src} width={80} height={48} alt="" loading="lazy" decoding="async" />
          <span>{capture.title}</span>
          {selected.id === capture.id && <Check size={16} aria-hidden="true" />}
        </button>
      ))}</div>
    </div>
  )
}
