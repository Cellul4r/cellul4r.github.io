import { motion, useReducedMotion } from 'framer-motion'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { useHashScroll } from '../hooks/useHashScroll'

export function SiteLayout() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const immediate = location.pathname === '/competitive-programming/codeforces' || reduceMotion
  const scrollToHash = useHashScroll()
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <motion.main id="main-content" key={location.pathname} initial={immediate ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: immediate ? 0 : .32 }} onAnimationComplete={scrollToHash}>
        <Outlet />
      </motion.main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
