import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { profile } from '../data/portfolio'
import { FestiveLights } from './FestiveLights'

const links = [
  { to: '/projects', label: 'Work' },
  { to: '/competitive-programming', label: 'Competitive Programming' },
  { to: '/resume', label: 'Resume' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <FestiveLights />
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Theerada Siri, home">
          <span>TS</span>
          <i />
        </Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">Toggle navigation</span>
          {open ? <X /> : <Menu />}
        </button>
        <div id="mobile-navigation" className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.label}
            </NavLink>
          ))}
          <a href={profile.github} target="_blank" rel="noreferrer" className="github-link">
            <Code2 size={17} aria-hidden="true" /> GitHub
          </a>
        </div>
      </nav>
    </header>
  )
}
