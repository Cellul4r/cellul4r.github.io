import { motion } from 'framer-motion'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { SummerMotionProvider, useSummerMotion, useSummerScene } from '../components/summer/SummerMotion'
import { useHashScroll } from '../hooks/useHashScroll'

function SummerSite() {
  const { pathname } = useLocation()
  const { enabled } = useSummerMotion()
  const { ref, moving } = useSummerScene()
  useHashScroll()
  const home = pathname === '/'
  return <div className="summer-theme" data-motion={enabled ? 'on' : 'off'}>
    <a className="summer-skip" href="#main-content">Skip to content</a>
    <Navbar />
    <div className="summer-desk" ref={ref}>
      <motion.div className="summer-sunlight" aria-hidden="true" animate={moving ? { x: [-30, 30, -30], rotate: [-18, -14, -18] } : { x: 0, rotate: -16 }} transition={{ duration: moving ? 24 : 0, repeat: moving ? Infinity : 0, ease: 'easeInOut' }} />
      <div className={`summer-paper${home ? ' summer-front-page' : ' summer-content-page'}`}>
        <main id="main-content"><Outlet /></main>
        {!home && <Footer />}
      </div>
    </div>
    <ScrollRestoration />
  </div>
}

export function SiteLayout() {
  return <SummerMotionProvider><SummerSite /></SummerMotionProvider>
}
