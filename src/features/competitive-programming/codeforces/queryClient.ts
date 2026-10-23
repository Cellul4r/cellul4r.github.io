import { QueryClient } from '@tanstack/react-query'
import { codeforcesQueryDefaults } from './queries'

// Module scope keeps a single cache across visits to this lazy-loaded route.
export const codeforcesQueryClient = new QueryClient({ defaultOptions: { queries: codeforcesQueryDefaults } })
