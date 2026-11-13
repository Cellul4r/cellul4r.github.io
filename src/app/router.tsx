import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ArticleSkeleton } from '../components/ArticleSkeleton'
import { SiteLayout } from '../layouts/SiteLayout'
import { HomePage } from '../pages/HomePage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { CodeforcesPageSkeleton } from '../features/competitive-programming/codeforces/components/CodeforcesPageSkeleton'
import type { RouteObject } from 'react-router-dom'

const ArticlesPage = lazy(() => import('../pages/ArticlesPage'))
const ArticlePage = lazy(() => import('../pages/ArticlePage'))
const SummerPreviewPage = lazy(() => import('../pages/SummerPreviewPage'))

const CompetitiveProgrammingPage = lazy(() => import('../pages/CompetitiveProgrammingPage').then((module) => ({ default: module.CompetitiveProgrammingPage })))
const CodeforcesPage = lazy(() => import('../pages/CodeforcesPage').then(module => ({ default: module.CodeforcesPage })))
const TypingVsDemonPage = lazy(() => import('../pages/TypingVsDemonPage').then(module => ({ default: module.TypingVsDemonPage })))

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')
export const routes: RouteObject[] = [
  { path: '/preview/summer', element: <Suspense fallback={<p className="container page" role="status">Opening the summer edition…</p>}><SummerPreviewPage /></Suspense> },
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'articles', element: <Suspense fallback={<ArticleSkeleton variant="library" />}><ArticlesPage /></Suspense> },
      { path: 'articles/:slug', element: <Suspense fallback={<ArticleSkeleton />}><ArticlePage /></Suspense> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/typing-vs-demon', element: <Suspense key="typing-vs-demon" fallback={<p className="container page" role="status">Loading Typing VS Demon case study…</p>}><TypingVsDemonPage /></Suspense> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'competitive-programming', element: <Suspense key="competitive-programming" fallback={<p className="container page" role="status">Loading contest results…</p>}><CompetitiveProgrammingPage /></Suspense> },
      { path: 'competitive-programming/codeforces', element: <Suspense key="codeforces" fallback={<CodeforcesPageSkeleton />}><CodeforcesPage /></Suspense> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes, { basename })
