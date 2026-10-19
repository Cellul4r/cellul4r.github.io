import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MousePointerClick } from 'lucide-react'
import { useAnyaInteraction } from '../hooks/useAnyaInteraction'
import anyaChristmas from '../assets/anya-christmas-hero.webp'
import anyaDizzy from '../assets/anya-hero-dizzy.png'
import anyaRun from '../assets/anya-journey-run-transparent.png'
import anyaSled from '../assets/anya-journey-sled-transparent.png'
import anyaFinish from '../assets/anya-journey-finish-transparent.png'

const pictures = [
  { src: anyaChristmas, alt: 'Anya holding a laptop' },
  { src: anyaRun, alt: 'Anya running with a gift' },
  { src: anyaSled, alt: 'Anya riding a sled' },
  { src: anyaFinish, alt: 'Anya sitting on a gift box' },
]

export function HeroIllustration() {
  const { picture, dizzy, dragging, rotation, reduceMotion, changePicture, handlers } = useAnyaInteraction(pictures.length)

  useEffect(() => {
    for (const src of [anyaDizzy, ...pictures.map((item) => item.src)]) {
      const image = new Image()
      image.src = src
    }
  }, [])

  return (
    <motion.div
      className="hero-illustration"
      initial={reduceMotion ? false : { opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: .5 }}
    >
      <div className="hero-spark hero-spark-one" aria-hidden="true">✦</div>
      <div className="hero-spark hero-spark-two" aria-hidden="true">✧</div>
      <div className="hero-ornament hero-ornament-red" aria-hidden="true" />
      <div className="hero-ornament hero-ornament-gold" aria-hidden="true" />
      <button
        className={`anya-spin-button${dragging ? ' is-dragging' : ''}`}
        type="button"
        aria-label="Change Anya picture"
        aria-describedby="anya-instructions"
        onClick={changePicture}
        {...handlers}
      >
        <motion.img
          src={dizzy ? anyaDizzy : pictures[picture].src}
          alt={dizzy ? 'Anya with dizzy spiral eyes' : pictures[picture].alt}
          draggable={false}
          width={1024}
          height={1536}
          style={{ rotate: rotation }}
        />
      </button>
      <button className="anya-mouse-hint" type="button" onClick={changePicture} aria-label="Show next Anya picture" aria-describedby="anya-instructions">
        <MousePointerClick size={25} aria-hidden="true" />
      </button>
      <span className="sr-only" id="anya-instructions">Click to change picture. Drag around Anya to rotate her. Keep rotating for one second to make her dizzy. Use the left and right arrow keys to rotate with a keyboard.</span>
      <span className="sr-only" role="status">{dizzy ? 'Anya is dizzy!' : pictures[picture].alt}</span>
    </motion.div>
  )
}
