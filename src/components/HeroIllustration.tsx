import { motion, useReducedMotion } from 'framer-motion'
import anyaChristmas from '../assets/anya-christmas-hero.webp'

export function HeroIllustration() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="hero-illustration"
      initial={reduceMotion ? false : { opacity: 0, x: 45, rotate: 2 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0, y: [0, -10, 0], rotate: [1, -1, 1] }}
      transition={{ opacity: { duration: 0.6 }, x: { duration: 0.7 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <div className="hero-spark hero-spark-one">✦</div>
      <div className="hero-spark hero-spark-two">✧</div>
      <div className="hero-ornament hero-ornament-red" />
      <div className="hero-ornament hero-ornament-gold" />
      <img src={anyaChristmas} alt="Anya Forger in a festive outfit presenting a glowing laptop" />
      <motion.div className="hero-sticker" animate={reduceMotion ? undefined : { rotate: [-5, 3, -5], scale: [1, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity }}>
        <span>Festive build</span>
        <strong>HELLO, WORLD! ✦</strong>
      </motion.div>
    </motion.div>
  )
}
