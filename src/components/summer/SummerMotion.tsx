import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { motion, MotionConfig, useMotionValue, useSpring, useTransform } from 'framer-motion'

const SummerMotionContext = createContext({ enabled: false, active: false })

export function SummerMotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return <SummerMotionContext.Provider value={{ enabled, active: enabled && visible }}>
    <MotionConfig reducedMotion={enabled ? 'never' : 'always'}>{children}</MotionConfig>
  </SummerMotionContext.Provider>
}

export function useSummerMotion() {
  return useContext(SummerMotionContext)
}

export function useSummerScene() {
  const { active } = useSummerMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .05 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, moving: active && inView }
}

export function usePaperTilt() {
  const { active } = useSummerMotion()
  const horizontal = useMotionValue(0)
  const vertical = useMotionValue(0)
  const rotateX = useSpring(useTransform(vertical, [-1, 1], [3, -3]), { stiffness: 90, damping: 25 })
  const rotateY = useSpring(useTransform(horizontal, [-1, 1], [-3, 3]), { stiffness: 90, damping: 25 })
  const x = useSpring(useTransform(horizontal, [-1, 1], [-6, 6]), { stiffness: 90, damping: 25 })
  const reset = () => { horizontal.set(0); vertical.set(0) }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!active || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    horizontal.set(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)))
    vertical.set(Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)))
  }
  return { onPointerMove, onPointerLeave: reset, style: { rotateX: active ? rotateX : 0, rotateY: active ? rotateY : 0, x: active ? x : 0 } }
}

export function PaperReveal({ children, className }: { children: ReactNode; className?: string }) {
  const { enabled } = useSummerMotion()
  const reveal = enabled && typeof IntersectionObserver !== 'undefined'
  return <motion.div className={className} initial={reveal ? { y: 20, rotate: .4 } : false} whileInView={reveal ? { y: 0, rotate: 0 } : undefined} viewport={{ once: true, amount: .1 }} transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
