import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

export function SiteLayout() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const immediate = location.pathname === '/competitive-programming/codeforces' || reduceMotion
  const scrollToContact = () => {
    if (location.hash === '#contact') document.getElementById('contact')?.scrollIntoView()
  }
  useEffect(() => {
    if (location.hash === '#contact') document.getElementById('contact')?.scrollIntoView()
  }, [location.key, location.hash])
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <motion.main id="main-content" key={location.pathname} initial={immediate ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: immediate ? 0 : .32 }} onAnimationComplete={scrollToContact}>
        <Outlet />
      </motion.main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
