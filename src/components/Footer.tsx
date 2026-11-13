import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { summerSections } from '../data/summer'

export function Footer() {
  return <footer className="summer-footer">
    <div><Link to="/" className="summer-footer-brand">Theerada Siri</Link><p>Built on curiosity. Best enjoyed warm.</p></div>
    <nav aria-label="Footer navigation">{summerSections.map(section => <Link key={section.to} to={section.to}>{section.title}</Link>)}<Link to="/#contact" preventScrollReset>Contact</Link></nav>
    <Link to="/" className="summer-footer-home">Back to the front page<ArrowUp size={15} aria-hidden="true" /></Link>
  </footer>
}
