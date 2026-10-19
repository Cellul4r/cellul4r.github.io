import { Link } from 'react-router-dom'

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
          <Link to="/#contact" preventScrollReset>Contact</Link>
        </div>
      </div>
    </footer>
  )
}
