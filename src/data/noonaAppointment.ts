const repository = 'https://github.com/Cellul4r/noona-appointment-web-app'
const source = (path: string) => `${repository}/blob/main/${path}`

export interface StudyLink {
  label: string
  url: string
}

export interface StudyItem {
  title: string
  detail: string
}

export type RegistrationState = 'CONFIRMED' | 'WAITLIST' | 'AVAILABLE'

export interface StateTransition {
  from: 'start' | RegistrationState | 'any'
  to: RegistrationState | 'removed'
  label: string
}

export interface RouteGroup {
  group: 'Host' | 'Participant' | 'Account'
  routes: { path: string; detail: string; media: string }[]
}

export const noonaAppointment = {
  repository,
  liveSite: 'https://noona-appointment.vercel.app/',
  kicker: 'Case study · Full-stack · 204212 Modern Application Development, Semester 2/2025',
  subtitle: 'A registration platform for multi-session events, built so the last seat can only go to one person.',
  facts: [
    { label: 'Role', value: 'Team Lead & Full-Stack Developer' },
    { label: 'Team', value: '4 students' },
    { label: 'Timeline', value: 'Feb–Mar 2026' },
    { label: 'Status', value: 'Live on Vercel' },
  ],
  opening: 'Noona lets a host publish an event with many sessions, each with its own time, room and seat limit, and lets participants build their own schedule from it. When a session fills up, people can join a waitlist. When a seat opens, they’re emailed and can claim it. I led the team and built most of the backend, including the registration rules and the database locking that keeps two people from getting the same last seat.',
  navigation: [
    { id: 'noona-overview', label: 'Overview', shortLabel: 'Overview' },
    { id: 'noona-features', label: 'What it does', shortLabel: 'Features' },
    { id: 'noona-last-seat', label: 'The last seat', shortLabel: 'Last seat' },
    { id: 'noona-architecture', label: 'Architecture & schema', shortLabel: 'Architecture' },
    { id: 'noona-app', label: 'Inside the app', shortLabel: 'Inside' },
    { id: 'noona-role', label: 'My role', shortLabel: 'My role' },
    { id: 'noona-limits', label: 'Limitations & next steps', shortLabel: 'Limits' },
    { id: 'noona-stack', label: 'Stack', shortLabel: 'Stack' },
    { id: 'noona-links', label: 'Links', shortLabel: 'Links' },
  ],
  capabilities: [
    { title: 'Multi-session events', detail: 'Hosts create an event with many sessions, each with its own time, location and seat limit (or unlimited). An optional limit caps how many sessions one participant can join. Each event has a shareable overview page.' },
    { title: 'Register or join the waitlist', detail: 'Participants are registered if a seat is free, or waitlisted if not. When someone cancels, everyone on the waitlist is emailed and the first to accept gets the seat.' },
    { title: 'A personal schedule', detail: 'A dashboard shows waitlisted, upcoming and past sessions, and a calendar shows them by month or week. Times follow each user’s chosen timezone.' },
    { title: 'Email notifications', detail: 'Participants can set up to two reminders per session. They’re also emailed when a seat opens, when an event changes or is cancelled, or when a host removes them. Emails can be turned off in settings.' },
  ] satisfies StudyItem[],
  transitions: [
    { from: 'start', to: 'CONFIRMED', label: 'register, seat free' },
    { from: 'start', to: 'WAITLIST', label: 'register, session full' },
    { from: 'WAITLIST', to: 'AVAILABLE', label: 'a confirmed user cancels or is removed' },
    { from: 'AVAILABLE', to: 'CONFIRMED', label: 'accepts first' },
    { from: 'AVAILABLE', to: 'WAITLIST', label: 'session fills again' },
    { from: 'any', to: 'removed', label: 'cancel / host removes (row deleted)' },
  ] satisfies StateTransition[],
  confirmExcerpt: `session = db.execute(
    select(SessionModel)
    .where(SessionModel.id == session_id)
    .with_for_update()                  # a second request waits here
).scalar_one()

if registration.status == RegistrationStatus.WAITLIST:
    raise HTTPException(400, "Waitlisted users can't confirm")
if session.seat_capacity is not None and session.seat_taken >= session.seat_capacity:
    raise HTTPException(409, "Session is full")

registration.status = RegistrationStatus.CONFIRMED
session.seat_taken += 1
if session.seat_taken == session.seat_capacity:
    set_waitlist_registrations(...)     # everyone else: AVAILABLE -> WAITLIST
db.commit()                             # lock released`,
  routeGroups: [
    {
      group: 'Host',
      routes: [
        { path: '/event/create', detail: 'Event details, then sessions. The per-participant limit and timezone are set here.', media: 'create-event-1' },
        { path: '/event/create', detail: 'Add many sessions at once, each with its own time, room and seat limit.', media: 'create-event-2' },
        { path: '/event/overview/:uuid', detail: 'The shareable event page. Hosts can see who’s registered, filter by Confirmed / Waitlist / Available, and remove someone.', media: 'host-registered-users' },
      ],
    },
    {
      group: 'Participant',
      routes: [
        { path: '/dashboard', detail: 'Recent events, plus waitlisted, upcoming and past sessions.', media: 'dashboard-1' },
        { path: '/calendar', detail: 'The same sessions by month or week, in the user’s timezone.', media: 'calendar' },
      ],
    },
    {
      group: 'Account',
      routes: [
        { path: '/login', detail: 'Email and password, or GitHub or Google.', media: 'login' },
        { path: '/setting', detail: 'Link or unlink Google and GitHub accounts.', media: 'settings-3' },
        { path: '/setting', detail: 'Set timezone and email preferences.', media: 'settings-2' },
      ],
    },
  ] satisfies RouteGroup[],
  otherRoutes: ['/events', '/event/register/:uuid', '/events/edit/:uuid', '/create-account', '/verify-email', '/forgot-password'],
  role: [
    { title: 'Leading the team', detail: 'ran our meetings, split the work, kept everyone updated on progress, and reviewed code in person and over screen share.' },
    { title: 'Designing the data', detail: 'the relational schema and the Confirmed / Waitlist / Available registration model.' },
    { title: 'Booking logic', detail: 'registration, waitlist and cancellation rules with row locking; the host’s remove-participant endpoint; and editing all of an event’s sessions in one transaction.' },
    { title: 'Notifications', detail: 'the Postgres job queue, the Vercel Cron dispatcher with retries, and the email templates.' },
    { title: 'Also built', detail: 'the calendar (API and Vue view), the JWT/CSRF middleware, Alembic migrations, and the Vercel Cron setup.' },
  ] satisfies StudyItem[],
  limitations: [
    { title: 'First to accept, not first in line.', detail: 'When a seat opens, every waitlisted user is notified at once, so the seat goes to whoever accepts first, not whoever joined the waitlist first. This was a deliberate trade-off for simplicity.' },
    { title: 'Up to five minutes’ delay.', detail: 'Because the cron job runs every five minutes, a seat-available email can arrive a few minutes after the seat opens.' },
    { title: 'One limit can be bypassed in a race.', detail: 'The per-participant session limit is checked under the session’s lock, not the user’s. If the same person registers for two sessions of one event at the same instant, both requests could pass.' },
  ] satisfies StudyItem[],
  nextSteps: [
    { title: 'Fairer waitlist', detail: 'offer a freed seat to one person at a time, in join order, each with a deadline to accept. This needs a joined_at column.' },
    { title: 'Close the per-participant race', detail: 'lock per user and event, or enforce the limit in the database.' },
    { title: 'Safer job claiming', detail: 'use FOR UPDATE SKIP LOCKED in the dispatcher, so two overlapping cron runs can’t send the same email twice.' },
    { title: 'A real worker', detail: 'move email sending to a queue with its own worker (outside Vercel, which can’t host one), and take the sign-up and password-reset emails out of the request path.' },
    { title: 'Concurrency tests', detail: 'fire parallel Accept requests in a test and assert that seat_taken never passes capacity.' },
  ] satisfies StudyItem[],
  stack: [
    { group: 'Frontend', items: ['Vue 3', 'Vite', 'Tailwind CSS', 'DaisyUI'] },
    { group: 'Backend', items: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy 2.0', 'Alembic', 'fastapi-mail', 'fastapi-sso'] },
    { group: 'Data', items: ['PostgreSQL (Supabase)', 'Supabase Storage'] },
    { group: 'Platform', items: ['Vercel (static hosting, Python functions, Cron)', 'Gmail SMTP', 'Docker Compose (local dev)'] },
  ],
  sessionService: source('fastapi/app/services/session_service.py'),
  schemaSource: source('docs/noona-schema.dbml'),
  keyFiles: [
    { label: 'Registration logic and row locking', url: source('fastapi/app/services/session_service.py') },
    { label: 'Notification queue and dispatcher', url: source('fastapi/app/services/notification_service.py') },
    { label: 'Registration model and states', url: source('fastapi/app/models/session_registration.py') },
    { label: 'Cron config', url: source('vercel.json') },
    { label: 'Schema', url: source('docs/noona-schema.dbml') },
  ] satisfies StudyLink[],
}
