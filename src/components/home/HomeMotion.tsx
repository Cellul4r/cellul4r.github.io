import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'

const HomeMotionContext = createContext({ enabled: false, toggle: () => {} })

export function HomeMotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const [preference, setPreference] = useState<boolean | null>(null)
  const enabled = preference ?? !reducedMotion
  return <HomeMotionContext.Provider value={{ enabled, toggle: () => setPreference(!enabled) }}>
    <MotionConfig reducedMotion={enabled ? 'never' : 'always'}>
      <div className="portfolio-home" data-motion={enabled ? 'on' : 'off'}>{children}</div>
    </MotionConfig>
  </HomeMotionContext.Provider>
}

export function useHomeMotion() {
  return useContext(HomeMotionContext)
}

export function HomeReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { enabled } = useHomeMotion()
  const reveal = enabled && typeof IntersectionObserver !== 'undefined'
  return <motion.div className={className} initial={reveal ? { y: 26 } : false} animate={reveal ? undefined : { y: 0 }} whileInView={reveal ? { y: 0 } : undefined} viewport={{ once: true, amount: .12 }} transition={{ duration: reveal ? .65 : 0, delay: reveal ? delay : 0, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
