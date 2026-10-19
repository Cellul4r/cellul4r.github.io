import { FolderCode, Mail, Menu, Trophy, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnyaHomeIcon } from './AnyaHomeIcon'
import { FestiveLights } from './FestiveLights'

const links = [
  { to: '/projects', label: 'Projects', icon: FolderCode, className: 'nav-projects' },
  { to: '/competitive-programming', label: 'Competitive Programming', icon: Trophy, className: 'nav-competitive' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const contactActive = location.pathname === '/' && location.hash === '#contact'
  const homeActive = location.pathname === '/' && !contactActive
  return (
    <header className="site-header">
      <FestiveLights />
      <nav className="nav-shell" aria-label="Primary navigation" onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          menuButton.current?.focus()
        }
      }}>
        <Link to="/" className={`brand${homeActive ? ' is-current' : ''}`} onClick={() => setOpen(false)} aria-label="Theerada Siri, home" aria-current={homeActive ? 'page' : undefined}>
          <AnyaHomeIcon />
          <span className="brand-label">Home</span>
        </Link>
        <button ref={menuButton} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">Toggle navigation</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <div id="mobile-navigation" className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => `${link.className}${isActive ? ' active' : ''}`}>
                <span className="nav-link-icon" aria-hidden="true"><Icon size={18} /></span>
                <span>{link.label}</span>
              </NavLink>
            )
          })}
          <Link to="/#contact" preventScrollReset onClick={() => setOpen(false)} className={`nav-contact${contactActive ? ' active' : ''}`} aria-current={contactActive ? 'location' : undefined}>
            <span className="nav-link-icon" aria-hidden="true"><Mail size={18} /></span>
            <span>Contact</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
