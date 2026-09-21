import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import anyaFinish from '../assets/anya-journey-finish.webp'

export function AnyaCorner() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const homeOpacity = useTransform(scrollY, [0, 650, 780], [0, 0, 1])
  const isHome = location.pathname === '/'

  if (reduceMotion) return null

  return (
    <motion.div
      key={location.pathname}
      className="anya-corner"
      aria-hidden="true"
      initial={isHome ? false : { opacity: 0, scale: .65, rotate: -10 }}
      animate={isHome ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: .28, ease: 'easeOut' }}
      style={isHome ? { opacity: homeOpacity } : undefined}
    >
      <img src={anyaFinish} alt="" />
    </motion.div>
  )
}
