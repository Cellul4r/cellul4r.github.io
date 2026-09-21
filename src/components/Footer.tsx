import { ArrowUpRight, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../data/portfolio'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-mark">TS<span>.</span></p>
          <p>Built with curiosity for the whole stack.</p>
        </div>
        <div className="footer-links">
          <Link to="/projects">Projects</Link>
          <Link to="/competitive-programming">Competitive Programming</Link>
          <Link to="/resume">Resume</Link>
          <a href={profile.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Theerada Siri</span>
        <span>Software · Systems · Networks</span>
      </div>
    </footer>
  )
}
