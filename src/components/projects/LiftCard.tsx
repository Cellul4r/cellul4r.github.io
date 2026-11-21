import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useSummerMotion } from '../summer/SummerMotion'

const elements = { div: motion.div, li: motion.li }

/** Paper card that settles in on scroll and lifts on hover or keyboard focus. Children may use `rest` / `engaged` variants. */
export function LiftCard({ as = 'div', className = '', index = 0, children }: { as?: keyof typeof elements; className?: string; index?: number; children: ReactNode }) {
  const { enabled } = useSummerMotion()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const Element = elements[as]
  const engaged = focused || hovered
  return (
    <Element
      className={className}
      data-engaged={engaged ? 'true' : undefined}
      initial={enabled ? { y: 14, rotate: index % 2 ? .5 : -.5 } : false}
      whileInView={enabled ? { y: 0, rotate: 0 } : undefined}
      viewport={{ once: true, amount: .2 }}
      transition={{ duration: enabled ? .55 : 0, delay: enabled ? index * .08 : 0, ease: [.22, 1, .36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false) }}
    >
      <motion.div className="lift-card-body" initial={false} animate={engaged ? 'engaged' : 'rest'} variants={{ rest: { y: 0 }, engaged: { y: enabled ? -3 : 0 } }} transition={{ duration: enabled ? .22 : 0, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </Element>
  )
}
