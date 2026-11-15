import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useSummerMotion } from '../summer/SummerMotion'

const surfaces = { div: motion.div, li: motion.li }

export function FinanceSurface({ as = 'div', className = '', children }: { as?: keyof typeof surfaces; className?: string; children: ReactNode }) {
  const { enabled } = useSummerMotion()
  const [focused, setFocused] = useState(false)
  const Surface = surfaces[as]
  return (
    <Surface
      className={`finance-surface ${className}`}
      initial={false}
      animate={focused ? 'engaged' : 'rest'}
      whileHover="engaged"
      variants={{ rest: { y: 0 }, engaged: { y: enabled ? -3 : 0 } }}
      transition={{ duration: enabled ? .22 : 0, ease: 'easeOut' }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false) }}
    >{children}</Surface>
  )
}
