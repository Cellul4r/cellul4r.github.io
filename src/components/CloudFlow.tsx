import { motion } from 'framer-motion'

export function CloudFlow({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.svg className="cloud-flow" viewBox="0 0 220 28" aria-hidden="true" focusable="false">
      <motion.path
        d="M14 14H206"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        variants={{ hidden: { pathLength: reducedMotion ? 1 : 0 }, visible: { pathLength: 1, transition: { duration: reducedMotion ? 0 : .6 } } }}
      />
      <motion.g variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : .12 } } }}>
        {[14, 78, 142, 206].map(x => (
          <motion.circle key={x} cx={x} cy="14" r="4" fill="#f7faf2" stroke="currentColor" strokeWidth="1.5"
            variants={{ hidden: { opacity: reducedMotion ? 1 : 0 }, visible: { opacity: 1, transition: { duration: reducedMotion ? 0 : .3 } } }}
          />
        ))}
      </motion.g>
      {!reducedMotion && (
        <motion.circle cx="14" cy="14" r="3" fill="var(--accent-amber)"
          variants={{ hidden: { opacity: 0, x: 0 }, visible: { x: [0, 64, 128, 192], opacity: [0, 1, 1, 0], transition: { delay: .6, duration: 1.6, ease: 'linear' } } }}
        />
      )}
    </motion.svg>
  )
}
