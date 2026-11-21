import registerWaitlisted from '../assets/projects/noona-appointment/register-waitlisted.png'
import emailSeatAvailable from '../assets/projects/noona-appointment/email-seat-available.png'
import dashboardAccept from '../assets/projects/noona-appointment/dashboard-2.png'
import createEventDetails from '../assets/projects/noona-appointment/create-event-1.png'
import createEventSessions from '../assets/projects/noona-appointment/create-event-2.png'
import hostRegisteredUsers from '../assets/projects/noona-appointment/host-registered-users.png'
import dashboardOverview from '../assets/projects/noona-appointment/dashboard-1.png'
import calendar from '../assets/projects/noona-appointment/calendar.png'
import login from '../assets/projects/noona-appointment/login.png'
import settingsPreferences from '../assets/projects/noona-appointment/settings-2.png'
import settingsLinkedAccounts from '../assets/projects/noona-appointment/settings-3.png'
import schema from '../assets/projects/noona-appointment/schema.png'
import type { ProjectMedia } from '../types/portfolio'

export type NoonaMedia = ProjectMedia & { id: string }

const media = (id: string, src: string, width: number, height: number, alt: string, caption: string): NoonaMedia => ({ id, src, width, height, alt, caption })

export const lastSeatStrip: NoonaMedia[] = [
  media('register-waitlisted', registerWaitlisted, 1219, 532,
    'Available Sessions page: the Jul 16 session shows 0 seats left with a Waitlisted badge and a Leave Waitlist button; other sessions have seats and Select buttons.',
    'The first session is full, so this participant is on its waitlist.'),
  media('email-seat-available', emailSeatAvailable, 1492, 590,
    'An “Available seat alert” email from Noona saying a seat opened up in Speaking Test Session, with the session start and end times.',
    'Someone cancelled. Everyone on the waitlist gets this email.'),
  media('dashboard-2', dashboardAccept, 1298, 773,
    'Noona dashboard: a waitlisted session now shows the status “Available (0/1)” next to a green Accept button.',
    'The seat is now “Available (0/1)”. The first to press Accept gets it.'),
]

export const appScreens: NoonaMedia[] = [
  media('create-event-1', createEventDetails, 1008, 777,
    'Create-event form with title, location and description, a “Max sessions per participant” toggle set to 1, and a note that all times are in Asia/Bangkok.',
    'Event details, then sessions. The per-participant limit and timezone are set here.'),
  media('create-event-2', createEventSessions, 977, 777,
    'Session Management list with five newly added weekly sessions, each showing its date range, room RB3201 and 10 seats.',
    'Add many sessions at once, each with its own time, room and seat limit.'),
  media('host-registered-users', hostRegisteredUsers, 1395, 660,
    'Registered Users dialog for a session, with a filter menu offering Confirmed, Waitlist and Available.',
    'Hosts can see who’s registered, filter by Confirmed / Waitlist / Available, and remove someone.'),
  media('dashboard-1', dashboardOverview, 1890, 892,
    'Dashboard with a Create New Event button and three Recent Events cards, with the Waitlist Sessions list starting below.',
    'Recent events, plus waitlisted, upcoming and past sessions.'),
  media('calendar', calendar, 1534, 590,
    'July 2026 month view with sessions on several days and a side panel showing a waitlisted Computer Science Seminar session.',
    'The same sessions by month or week, in the user’s timezone.'),
  media('login', login, 686, 836,
    'Noona login form with email and password fields and buttons to continue with GitHub or Google.',
    'Email and password, or GitHub or Google.'),
  media('settings-3', settingsLinkedAccounts, 1387, 492,
    'Linked Accounts settings: Google is connected with a Disconnect button; GitHub is not connected and shows a Connect button.',
    'Link or unlink Google and GitHub accounts.'),
  media('settings-2', settingsPreferences, 1162, 473,
    'Preferences settings with a timezone of Asia/Bangkok, a theme field and an Email Notifications toggle.',
    'Set timezone and email preferences.'),
]

export const schemaFigure = media('schema', schema, 1427, 1296,
  'Database diagram of seven tables: users, user_oauth_accounts, auth_tokens, events, sessions, session_registrations and notification_jobs, with their relationships.',
  'Seven tables. The booking core is events → sessions → session_registrations; seat_taken on sessions is the counter the row lock protects.')
