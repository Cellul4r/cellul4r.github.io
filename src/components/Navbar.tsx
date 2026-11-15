import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { summerSections } from '../data/summer'

export function Navbar() {
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  useLayoutEffect(() => {
    const header = headerRef.current
    const theme = header?.closest<HTMLElement>('.summer-theme')
    if (!header || !theme) return
    const updateHeight = () => theme.style.setProperty('--summer-header-height', `${header.getBoundingClientRect().height}px`)
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => {
      observer.disconnect()
      theme.style.removeProperty('--summer-header-height')
    }
  }, [])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  const contact = location.pathname === '/' && location.hash === '#contact'
  return <header ref={headerRef} className={`summer-theme-header${scrolled ? ' is-scrolled' : ''}`}>
    <div className="summer-theme-header-inner">
      <Link to="/" className="summer-brand" aria-label="Theerada Siri, home" aria-current={location.pathname === '/' && !location.hash ? 'page' : undefined}><span aria-hidden="true">TS.</span>Theerada Siri</Link>
      <span className="summer-theme-label">The summer edition</span>
      <nav aria-label="Primary navigation">
        {summerSections.map(section => <Link key={section.to} to={section.to} aria-current={location.pathname === section.to || location.pathname.startsWith(`${section.to}/`) ? 'page' : undefined}>{section.title}</Link>)}
        <Link to="/#contact" preventScrollReset aria-current={contact ? 'location' : undefined}>Contact</Link>
      </nav>
    </div>
  </header>
}
