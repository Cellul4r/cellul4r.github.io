import { lazy, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { CodeforcesProfile } from '../features/competitive-programming/codeforces/CodeforcesProfile'
import { codeforcesQueryClient } from '../features/competitive-programming/codeforces/queryClient'

const Devtools = import.meta.env.DEV ? lazy(() => import('@tanstack/react-query-devtools').then(module => ({ default: module.ReactQueryDevtools }))) : null

export function CodeforcesPage() {
  return <QueryClientProvider client={codeforcesQueryClient}>
    <CodeforcesProfile />
    {Devtools && <Suspense fallback={null}><Devtools initialIsOpen={false} /></Suspense>}
  </QueryClientProvider>
}
