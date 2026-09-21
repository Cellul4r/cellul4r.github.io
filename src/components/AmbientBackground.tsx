import { motion, useReducedMotion } from 'framer-motion'

export function AmbientBackground() {
  const reduceMotion = useReducedMotion()
  const snow = Array.from({ length: 18 }, (_, index) => index)
  return (
    <div className="ambient" aria-hidden="true">
      <motion.div className="ambient-orb ambient-green" animate={reduceMotion ? undefined : { x: [0, 40, -10, 0], y: [0, -25, 15, 0] }} transition={{ duration: 18, repeat: Infinity }} />
      <motion.div className="ambient-orb ambient-red" animate={reduceMotion ? undefined : { x: [0, -30, 20, 0], y: [0, 20, -15, 0] }} transition={{ duration: 22, repeat: Infinity }} />
      <div className="ambient-grid" />
      <div className="snow-field">
        {snow.map((flake) => (
          <motion.i
            key={flake}
            style={{ left: `${(flake * 37) % 100}%`, top: `${(flake * 23) % 90}%` }}
            animate={reduceMotion ? undefined : { y: [0, 34, 0], x: [0, flake % 2 ? 8 : -8, 0], opacity: [.15, .8, .15] }}
            transition={{ duration: 5 + (flake % 5), delay: flake * .25, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
