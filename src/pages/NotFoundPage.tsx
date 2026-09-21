import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return <div className="container empty-state"><p className="eyebrow">Error 404</p><h1>That route went off the map.</h1><p>The page may have moved, or the address may be incorrect.</p><Link className="button button-primary" to="/">Return home</Link></div>
}
