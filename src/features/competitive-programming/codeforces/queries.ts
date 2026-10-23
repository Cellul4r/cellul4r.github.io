import { queryOptions, useQuery } from '@tanstack/react-query'
import { CodeforcesError, fetchPractice, fetchRatings, fetchUser } from './api'

export const codeforcesKeys = {
  all: (handle: string) => ['codeforces', handle.toLowerCase()] as const,
  profile: (handle: string) => [...codeforcesKeys.all(handle), 'profile'] as const,
  ratings: (handle: string) => [...codeforcesKeys.all(handle), 'ratings'] as const,
  practice: (handle: string) => [...codeforcesKeys.all(handle), 'practice', 'all-public'] as const,
}

export const codeforcesQueryDefaults = {
  staleTime: 15 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: (count: number, error: Error) => count < 1 && error instanceof CodeforcesError && error.retryable,
  retryDelay: 3000,
}

export const profileOptions = (handle: string) => queryOptions({
  queryKey: codeforcesKeys.profile(handle), queryFn: ({ signal }) => fetchUser(handle, signal),
})
export const ratingsOptions = (handle: string) => queryOptions({
  queryKey: codeforcesKeys.ratings(handle), queryFn: ({ signal }) => fetchRatings(handle, signal),
})
export const practiceOptions = (handle: string) => queryOptions({
  queryKey: codeforcesKeys.practice(handle), queryFn: ({ signal }) => fetchPractice(handle, signal),
})

export const useCodeforcesProfile = (handle: string) => useQuery(profileOptions(handle))
export const useCodeforcesRatings = (handle: string, enabled: boolean) => useQuery({ ...ratingsOptions(handle), enabled })
export const useCodeforcesPractice = (handle: string, enabled: boolean) => useQuery({ ...practiceOptions(handle), enabled })
