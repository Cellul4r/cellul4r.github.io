import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { SiteLayout } from '../layouts/SiteLayout'
import { HomePage } from '../pages/HomePage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { CodeforcesPageSkeleton } from '../features/competitive-programming/codeforces/components/CodeforcesPageSkeleton'
import type { RouteObject } from 'react-router-dom'

const CompetitiveProgrammingPage = lazy(() => import('../pages/CompetitiveProgrammingPage').then((module) => ({ default: module.CompetitiveProgrammingPage })))
const CodeforcesPage = lazy(() => import('../pages/CodeforcesPage').then(module => ({ default: module.CodeforcesPage })))

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'competitive-programming', element: <Suspense key="competitive-programming" fallback={<p className="container page" role="status">Loading contest results…</p>}><CompetitiveProgrammingPage /></Suspense> },
      { path: 'competitive-programming/codeforces', element: <Suspense key="codeforces" fallback={<CodeforcesPageSkeleton />}><CodeforcesPage /></Suspense> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes, { basename })
