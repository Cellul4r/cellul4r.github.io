import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { AnyaCorner } from '../components/AnyaCorner'

export function SiteLayout() {
  const location = useLocation()
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <AnyaCorner />
      <AnimatePresence mode="wait">
        <motion.main id="main-content" key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .32 }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
