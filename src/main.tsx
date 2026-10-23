import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './styles.css'

const CompetitiveProgrammingPage = lazy(() => import('./pages/CompetitiveProgrammingPage').then((module) => ({ default: module.CompetitiveProgrammingPage })))

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')
const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'competitive-programming', element: <Suspense fallback={<p className="container page" role="status">Loading contest results…</p>}><CompetitiveProgrammingPage /></Suspense> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], { basename })

createRoot(document.getElementById('root')!).render(
  <StrictMode><RouterProvider router={router} /></StrictMode>,
)
