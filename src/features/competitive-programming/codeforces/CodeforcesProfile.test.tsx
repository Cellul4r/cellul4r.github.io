import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CodeforcesProfile } from './CodeforcesProfile'
import { CodeforcesError, fetchPractice, fetchRatings, fetchUser } from './api'
import { codeforcesKeys, codeforcesQueryDefaults } from './queries'
import { DataStatus } from './components/DataStatus'
import { formatNumber } from './config'

vi.mock('./api', async importOriginal => ({
  ...await importOriginal<typeof import('./api')>(),
  fetchUser: vi.fn(), fetchRatings: vi.fn(), fetchPractice: vi.fn(),
}))

const user = { handle: 'Cellul4r', organization: 'Chiang Mai University', rank: 'specialist', rating: 1588, maxRating: 1613, maxRank: 'expert' }
const history = Array.from({ length: 7 }, (_, i) => ({ contestId: i + 1, contestName: `Fixture Round ${i + 1}`, rank: 100 + i, ratingUpdateTimeSeconds: 1700000000 + i * 86400, oldRating: 1500, newRating: 1510 + i }))
const practice = { solved: 3, difficulty: [{ label: '800', count: 2 }, { label: 'Unrated', count: 1 }], topics: [{ label: 'dp', count: 2 }], unidentified: 0 }
const clients: QueryClient[] = []

beforeEach(() => {
  onlineManager.setOnline(true)
  vi.mocked(fetchUser).mockReset().mockResolvedValue(user)
  vi.mocked(fetchRatings).mockReset().mockResolvedValue(history)
  vi.mocked(fetchPractice).mockReset().mockResolvedValue(practice)
})
afterEach(() => { clients.forEach(client => client.clear()); clients.length = 0 })

function client() {
  const value = new QueryClient({ defaultOptions: { queries: { ...codeforcesQueryDefaults, retry: false, gcTime: Infinity } } })
  clients.push(value)
  return value
}
function show(queryClient: QueryClient) {
  return render(<StrictMode><MemoryRouter><QueryClientProvider client={queryClient}><CodeforcesProfile /></QueryClientProvider></MemoryRouter></StrictMode>)
}

it('renders real zeroes only after loading, and gates dependent queries on the profile', async () => {
  let resolve!: (value: typeof user) => void
  vi.mocked(fetchUser).mockImplementation(() => new Promise(complete => { resolve = complete }))
  vi.mocked(fetchRatings).mockResolvedValue([])
  vi.mocked(fetchPractice).mockResolvedValue({ solved: 0, difficulty: [], topics: [], unidentified: 0 })
  show(client())
  expect(screen.getByText('Loading Codeforces profile…')).toBeTruthy()
  expect(screen.getAllByLabelText(/: loading$/)).toHaveLength(4)
  expect(screen.queryByText('0')).toBeNull()
  expect(fetchRatings).not.toHaveBeenCalled()
  expect(fetchPractice).not.toHaveBeenCalled()
  await act(async () => resolve(user))
  await screen.findByText('No rated contests yet. Rating history will appear after the first rated contest.')
  expect(screen.getAllByText('0').length).toBe(2)
  expect(screen.getByText('No accepted problems in the public history yet.')).toBeTruthy()
})

it('renders the profile, only five recent rounds, accessible chart data, and working links', async () => {
  show(client())
  await screen.findByText('Chiang Mai University')
  await screen.findByText('View topic counts')
  expect(screen.getByText(formatNumber(1588))).toBeTruthy()
  expect(screen.getByText(formatNumber(1613))).toBeTruthy()
  const recent = screen.getByRole('region', { name: 'Recent rated contests' })
  const links = within(recent).getAllByRole('link')
  expect(links).toHaveLength(5)
  expect(links[0].getAttribute('href')).toBe('https://codeforces.com/contest/7')
  expect(within(recent).queryByText('Fixture Round 1')).toBeNull()
  expect(screen.getByRole('link', { name: /View on Codeforces/ }).getAttribute('href')).toBe('https://codeforces.com/profile/Cellul4r')
  expect(screen.getByRole('link', { name: 'Competitive Programming' }).getAttribute('href')).toBe('/competitive-programming')
  expect(screen.getByText('View rating history as a table')).toBeTruthy()
  expect(screen.getByText('View difficulty counts')).toBeTruthy()
})

it('reuses fresh cached data across route visits without a second fetch', async () => {
  const cache = client()
  const mounted = show(cache)
  await screen.findByText('View topic counts')
  const calls = [vi.mocked(fetchUser).mock.calls.length, vi.mocked(fetchRatings).mock.calls.length, vi.mocked(fetchPractice).mock.calls.length]
  mounted.unmount()
  show(cache)
  await screen.findByText('View topic counts')
  expect(fetchUser).toHaveBeenCalledTimes(calls[0])
  expect(fetchRatings).toHaveBeenCalledTimes(calls[1])
  expect(fetchPractice).toHaveBeenCalledTimes(calls[2])
})

it('keeps successful sections when practice fails instead of blocking the page', async () => {
  vi.mocked(fetchPractice).mockRejectedValue(new CodeforcesError('Practice history unavailable'))
  show(client())
  await screen.findByText(/Practice history unavailable/)
  expect(screen.getByText(formatNumber(1588))).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Rating history' })).toBeTruthy()
  expect(screen.getByText('Currently unavailable')).toBeTruthy()
})

it('refreshes through the cache and preserves the last complete data if refresh fails', async () => {
  const cache = client()
  show(cache)
  await screen.findByText('View topic counts')
  vi.mocked(fetchUser).mockRejectedValue(new CodeforcesError('Profile temporarily unavailable'))
  vi.mocked(fetchRatings).mockRejectedValue(new CodeforcesError('History temporarily unavailable'))
  vi.mocked(fetchPractice).mockRejectedValue(new CodeforcesError('Practice temporarily unavailable'))
  fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  await screen.findByText(/Some data could not be updated/)
  expect(screen.getByText(formatNumber(1588))).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Most-practiced topics' })).toBeTruthy()
  expect(cache.getQueryData(codeforcesKeys.practice('Cellul4r'))).toEqual(practice)
})

it('shows a profile error without requesting dependent endpoints', async () => {
  vi.mocked(fetchUser).mockRejectedValue(new CodeforcesError('Handle not found'))
  show(client())
  await screen.findByText('Handle not found')
  expect(fetchRatings).not.toHaveBeenCalled()
  expect(fetchPractice).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Refresh' })).toBeTruthy()
})

it('disables refresh while a request is active', async () => {
  vi.mocked(fetchPractice).mockImplementation(() => new Promise(() => {}))
  show(client())
  await screen.findByText('Chiang Mai University')
  await waitFor(() => expect((screen.getByRole('button', { name: 'Refreshing' }) as HTMLButtonElement).disabled).toBe(true))
})

it('falls back to an initial when the profile avatar fails to load', async () => {
  vi.mocked(fetchUser).mockResolvedValue({ ...user, avatar: 'https://userpic.codeforces.org/missing.jpg' })
  show(client())
  const avatar = await screen.findByRole('img', { name: "Cellul4r's Codeforces avatar" })
  fireEvent.error(avatar)
  expect(screen.queryByRole('img', { name: "Cellul4r's Codeforces avatar" })).toBeNull()
  expect(screen.getByText('C')).toBeTruthy()
})

it('pauses requests offline and resumes when connectivity returns', async () => {
  onlineManager.setOnline(false)
  show(client())
  await screen.findByText(/You’re offline/)
  expect((screen.getByRole('button', { name: 'Refresh' }) as HTMLButtonElement).disabled).toBe(true)
  expect(fetchUser).not.toHaveBeenCalled()
  await act(async () => onlineManager.setOnline(true))
  await screen.findByText('View topic counts')
})

it('formats the footer timestamp using the visitor locale and time zone', () => {
  const timestamp = Date.parse('2026-09-05T00:30:00Z')
  render(<DataStatus updatedAt={timestamp} refreshing={false} failed={false} paused={false} onRefresh={() => {}} />)
  const expected = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp))
  expect(screen.getByText(expected)).toBeTruthy()
})
