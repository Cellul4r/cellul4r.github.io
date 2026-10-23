# Competitive programming

This feature contains the contest overview, photo galleries, max-flow animation, and Codeforces profile. Route components remain in `src/pages`; routing is configured in `src/app/router.tsx`.

## Existing portfolio sections

- `overview/`: page composition, introduction, Codeforces navigation link, and tutoring section.
- `contests/`: reusable contest cards and photo viewer; styles are imported by `ContestCard`.
- `matching/`: graph generator, solver, playback hook, and compact Anya animation.
- Contest content and image references remain in `src/data/portfolio.ts`. Generic components and design tokens remain shared.

## Codeforces data flow

`config.ts` → `queries.ts` → `api.ts` → `requestQueue.ts` → Codeforces API

The page uses three independent queries: profile, rating history, and complete practice statistics. The latter two start once a valid profile is available. `statistics.ts` derives unique solves and distributions; chart components only receive prepared data through props. API data stays in TanStack Query, rather than being copied into React state.

`CodeforcesPage` mounts one module-scoped QueryClient. The feature and Recharts are lazy-loaded, so other routes do not request profile data or load chart code. The in-memory cache survives route navigation, is fresh for 15 minutes, and is removed after 30 minutes of inactivity. It does not survive a browser reload. Devtools are development-only.

The lightweight `components/CodeforcesPageSkeleton` loads with the router and covers both the page-module download and the initial profile request. Distinct Suspense keys reset the loading boundary on navigation. The shared layout replaces the outgoing page immediately, and the Codeforces route skips the entrance fade so the skeleton is visible straight away.

All requests, pagination, and retries share one cancellable queue with at least 2.1 seconds between request starts and a 15-second per-request timeout. Public methods need no API keys. Failed or incomplete submission history never becomes a partial lifetime total. Background failures retain the previous complete cached data.

Statistics include accepted public problems across regular, practice, virtual, and Gym submissions. Repeated accepted submissions count once per problem. Problems with no difficulty are shown as unrated; multi-tag problems count once for each distinct tag. Problems lacking both contest and problemset identifiers cannot be counted uniquely and are disclosed in the UI.

`user.rating` supplies rating-update dates and ranks at rating update, not contest start dates or revised final ranks. UI labels reflect that distinction. All displayed dates and times follow the visitor's browser locale and time zone through `Intl.DateTimeFormat`, without a forced time zone.

## Codeforces presentation

The profile shares the home page's cream background and Fredoka headings. Open statistics use evergreen, burgundy, gold, and blue accents; practice charts sit on sage and blush backgrounds. These chart colors are portfolio accents, not Codeforces rank bands.

`ratingTimeline.ts` prepares calendar-aligned month/year ticks from the rating timestamps and the measured chart width. Narrow charts show fewer ticks, while a date-range caption preserves the complete history span. A gold diamond marks the peak in the displayed history and a green circle marks the latest rating. Every chart also has an accessible data view.

`RatingHistoryTable` paginates the already-fetched history locally into ten-contest pages, newest first. Closing the disclosure or refreshing data preserves the page; a shorter history clamps it to the last available page. Pagination does not affect the chart or make API requests.

## Validation

- `npm test`: colocated API, statistics, queue, timeline, and query/UI tests.
- `npm run test:matching`: exhaustive max-flow and matching checks.
- `npm run build`: strict TypeScript and production build, including the GitHub Pages fallback.

Tests use explicit fixture data and mocked requests. Production statistics are fetched from Codeforces; no snapshot values are hard-coded in the profile.

Query conventions follow [Practical React Query](https://tkdodo.eu/blog/practical-react-query) and the current [TanStack Query options guide](https://tanstack.com/query/latest/docs/framework/react/guides/query-options): keep query keys and fetching together, tune freshness explicitly, separate server and UI state, and retain cached data during background updates.
