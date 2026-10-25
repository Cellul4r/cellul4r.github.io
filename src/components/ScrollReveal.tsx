import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useState } from 'react'
import type { ReactNode } from 'react'

const ease = [0.22, 0.61, 0.36, 1] as const

interface RevealOptions {
  distance?: number
  duration?: number
  delay?: number
  stagger?: number
  fade?: boolean
  reducedMotion?: boolean
}

export function revealVariants({ distance = 16, duration = .45, delay = 0, stagger = 0, fade = true, reducedMotion = false }: RevealOptions = {}): Variants {
  return {
    hidden: { opacity: reducedMotion || !fade ? 1 : 0, y: reducedMotion ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        staggerChildren: reducedMotion ? 0 : stagger,
        ease,
      },
    },
  }
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header'
  id?: string
  'aria-labelledby'?: string
  'data-feedback'?: 'surface' | 'action'
  delay?: number
  duration?: number
  distance?: number
  stagger?: number
  fade?: boolean
  amount?: 'some' | 'all' | number
}

const elements = { div: motion.div, section: motion.section, header: motion.header }

export function ScrollReveal({ children, className, as = 'div', id, 'aria-labelledby': labelledBy, 'data-feedback': feedback, delay = 0, duration = .45, distance = 16, stagger = 0, fade = true, amount = .12 }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion()
  const [focused, setFocused] = useState(false)
  const immediate = !!reduceMotion || typeof IntersectionObserver === 'undefined'
  const Element = elements[as]

  return (
    <Element
      id={id}
      aria-labelledby={labelledBy}
      data-scroll-reveal=""
      data-feedback={feedback}
      className={className}
      initial={immediate ? false : 'hidden'}
      animate={immediate || focused ? 'visible' : undefined}
      whileInView={immediate ? undefined : 'visible'}
      viewport={{ once: true, amount }}
      variants={revealVariants({ distance, duration, delay, stagger, fade, reducedMotion: immediate })}
      onFocusCapture={() => setFocused(true)}
    >
      {children}
    </Element>
  )
}
