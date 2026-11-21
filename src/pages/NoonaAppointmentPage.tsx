import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, CalendarDays, CodeXml, ExternalLink, Layers, Mail, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TechBadge } from '../components/TechBadge'
import { PaperReveal, usePaperTilt, useSummerMotion } from '../components/summer/SummerMotion'
import { NoonaIllustration } from '../components/summer/NoonaIllustration'
import { LiftCard } from '../components/projects/LiftCard'
import { CaseStudyNavigation } from '../components/projects/CaseStudyNavigation'
import { EmailPipelineDiagram, NoonaArchitectureDiagram, RegistrationStateDiagram } from '../components/projects/NoonaDiagrams'
import { SeatRaceSimulator } from '../components/projects/SeatRaceSimulator'
import { ScreenFrame, useScreenViewer } from '../components/projects/NoonaScreens'
import { noonaAppointment as study } from '../data/noonaAppointment'
import { appScreens, lastSeatStrip, schemaFigure } from '../data/noonaAppointmentMedia'
import { projects } from '../data/portfolio'
import { usePageMetadata } from '../hooks/usePageMetadata'
import './NoonaAppointmentPage.css'

const capabilityIcons = [Layers, Users, CalendarDays, Mail]

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="noona-source" href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /></a>
}

function SectionHeading({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  const index = study.navigation.findIndex(section => `${section.id}-title` === id)
  return (
    <PaperReveal className="noona-section-heading">
      <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {study.navigation[index].label}</p>
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </PaperReveal>
  )
}

function HeroArt() {
  const { enabled } = useSummerMotion()
  const tilt = usePaperTilt()
  return (
    <motion.div className="noona-hero-art" style={tilt.style} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}
      initial={enabled ? { y: 14, rotate: -2, opacity: 0 } : false} animate={{ y: 0, rotate: -1, opacity: 1 }} transition={{ duration: enabled ? .7 : 0, delay: enabled ? .15 : 0, ease: [.22, 1, .36, 1] }}>
      <NoonaIllustration />
    </motion.div>
  )
}

export function NoonaAppointmentPage() {
  const { enabled } = useSummerMotion()
  const project = projects.find(item => item.slug === 'noona-appointment')!
  usePageMetadata(`${project.title} | Theerada Siri`, project.description)
  const seatViewer = useScreenViewer('The last seat', lastSeatStrip)
  const appViewer = useScreenViewer('Inside the app', appScreens)
  const schemaViewer = useScreenViewer('Database schema', [schemaFigure])

  return (
    <article className="noona-study project-case-study">
      <motion.header className="noona-hero" id="noona-overview" initial={enabled ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: enabled ? .55 : 0, ease: [.22, 1, .36, 1] }}>
        <Link className="back-link" to="/projects"><ArrowLeft size={16} aria-hidden="true" />All projects</Link>
        <div className="noona-heading">
          <div className="noona-summary">
            <p className="eyebrow">{study.kicker}</p>
            <h1>{project.title}</h1>
            <p className="noona-subtitle">{study.subtitle}</p>
            <div className="noona-actions">
              <a className="button button-primary" href={study.liveSite} target="_blank" rel="noopener noreferrer"><ExternalLink size={18} aria-hidden="true" />Live site<span className="sr-only"> (opens in a new tab)</span></a>
              <a className="button button-quiet" href={study.repository} target="_blank" rel="noopener noreferrer"><CodeXml size={18} aria-hidden="true" />Source<span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
          <HeroArt />
        </div>
        <dl className="noona-facts">{study.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <p className="noona-opening">{study.opening}</p>
      </motion.header>

      <CaseStudyNavigation sections={study.navigation} />

      <section className="noona-section" id="noona-features" aria-labelledby="noona-features-title">
        <SectionHeading id="noona-features-title" title="What it does">Two kinds of users share one app: hosts who run events, and participants who sign up for them. Any user can be either.</SectionHeading>
        <ul className="noona-capabilities">{study.capabilities.map((item, index) => {
          const Icon = capabilityIcons[index]
          return <LiftCard as="li" key={item.title} index={index}><motion.span className="noona-capability-icon" aria-hidden="true" variants={{ rest: { rotate: 0, scale: 1 }, engaged: { rotate: enabled ? -8 : 0, scale: enabled ? 1.08 : 1 } }}><Icon size={26} strokeWidth={1.5} /></motion.span><h3>{item.title}</h3><p>{item.detail}</p></LiftCard>
        })}</ul>
      </section>

      <section className="noona-section" id="noona-last-seat" aria-labelledby="noona-last-seat-title">
        <SectionHeading id="noona-last-seat-title" title="The last seat">One seat left, two people clicking at once. This was the part of Noona I cared most about getting right.</SectionHeading>

        <PaperReveal className="noona-story">
          <h3>Three states, not two.</h3>
          <p>Most waitlists move the next person up automatically. We decided not to: someone who joined a waitlist days ago may no longer want the seat, and auto-confirming would put them into a session they might not attend. So Noona has three registration states. <strong>Confirmed</strong> holds a seat. <strong>Waitlist</strong> means the session was full. <strong>Available</strong> means a seat has opened up and you can claim it. When a confirmed participant cancels, or a host removes them, everyone on the waitlist becomes Available and gets an email. The first to accept gets the seat. Once the session is full again, everyone else goes back to the waitlist.</p>
        </PaperReveal>
        <RegistrationStateDiagram />

        <PaperReveal className="noona-story">
          <h3>Where the race is.</h3>
          <p>That design creates a race on purpose: one email goes to several people, and they can all click Accept at the same moment. The naive version of Accept reads <code>seat_taken</code>, checks it against capacity, then writes. Between the read and the write, a second request can make the same read, and both see one seat left.</p>
          <h3>The fix.</h3>
          <p>Register, accept and cancel each run in one database transaction that starts by locking the session row with <code>SELECT … FOR UPDATE</code>. A second request for the same session waits at that line until the first one commits. By then, the first request has filled the seat and moved everyone else back to the waitlist, so the second request sees the new state and is rejected. Postgres’s default <code>READ COMMITTED</code> isolation is enough here, because the lock, not the isolation level, puts the requests in order. A capacity check after the lock is the second guard, and a unique constraint on <code>(session_id, user_id)</code> blocks the other kind of duplicate: a double-click.</p>
        </PaperReveal>

        <figure className="noona-code">
          <pre tabIndex={0} aria-label="Simplified confirm_session code"><code>{study.confirmExcerpt}</code></pre>
          <figcaption>Simplified from <code>confirm_session</code> in <code>fastapi/app/services/session_service.py</code>. <SourceLink href={study.sessionService}>Read the full service</SourceLink></figcaption>
        </figure>

        <PaperReveal><SeatRaceSimulator /></PaperReveal>

        <div className="noona-strip" role="group" aria-label="The last seat in the app">
          {lastSeatStrip.map((media, index) => <ScreenFrame key={media.id} index={index} card={{ media, detail: `${index + 1}. ${media.caption}` }} onOpen={seatViewer.open} />)}
        </div>
        <p className="noona-small">The green “Available” badge also marks ordinary open sessions, which show a Select button. Only a seat you can claim shows <strong>Accept</strong>.</p>
        {seatViewer.viewer}
      </section>

      <section className="noona-section" id="noona-architecture" aria-labelledby="noona-architecture-title">
        <SectionHeading id="noona-architecture-title" title="Architecture & schema" />
        <p className="noona-lede">The Vue 3 single-page app and the FastAPI backend deploy together on Vercel: the frontend as static files, the API as a Python serverless function, with every <code>/api/*</code> request routed to it. Data lives in Supabase Postgres (through its connection pooler), and profile images in Supabase Storage. Inside the API, requests pass through JWT and CSRF middleware, then routers, then services that hold the business rules and use SQLAlchemy 2.0 models. Schema changes go through Alembic migrations.</p>
        <PaperReveal><NoonaArchitectureDiagram /></PaperReveal>

        <PaperReveal className="noona-story">
          <h3>Email without a background worker</h3>
          <p>Serverless functions can’t keep a worker running, so email is a job queue in Postgres. An action that should send an email, such as a reminder or a seat-available alert, inserts a row into <code>notification_jobs</code>, with a due time and a unique key that stops duplicates. Every five minutes, Vercel Cron calls a secret-protected dispatch endpoint that sends the due jobs through Gmail SMTP. Failed sends are retried with exponential backoff (capped at an hour), up to five attempts.</p>
        </PaperReveal>
        <EmailPipelineDiagram />

        <div className="noona-schema">
          <ScreenFrame card={{ media: schemaFigure }} onOpen={schemaViewer.open} />
          <SourceLink href={study.schemaSource}>View DBML source</SourceLink>
        </div>
        {schemaViewer.viewer}
        <aside className="noona-note" aria-label="Development environment">
          <p>Docker Compose gave the team the same local setup on every machine: FastAPI and Vue containers, plus an optional local Postgres. One flag switches between local Postgres and Supabase. It was for development only; production runs on Vercel and Supabase.</p>
        </aside>
      </section>

      <section className="noona-section" id="noona-app" aria-labelledby="noona-app-title">
        <SectionHeading id="noona-app-title" title="Inside the app">These are the routes that matter most, grouped by who uses them.</SectionHeading>
        <div className="noona-routes">{study.routeGroups.map((group, groupIndex) => (
          <section key={group.group} aria-labelledby={`noona-route-${group.group}`}>
            <h3 id={`noona-route-${group.group}`}>{group.group}</h3>
            {group.routes.map((route, index) => {
              const media = appScreens.find(item => item.id === route.media)!
              return <ScreenFrame key={route.media} index={groupIndex + index} card={{ media, path: route.path, detail: route.detail }} onOpen={appViewer.open} />
            })}
          </section>
        ))}</div>
        <p className="noona-small">Other routes include {study.otherRoutes.map((route, index) => <span key={route}><code>{route}</code>{index < study.otherRoutes.length - 1 ? ', ' : ''}</span>)} and a few more.</p>
        {appViewer.viewer}
      </section>

      <section className="noona-section" id="noona-role" aria-labelledby="noona-role-title">
        <SectionHeading id="noona-role-title" title="My role">I was the team lead and the main backend developer on a team of four.</SectionHeading>
        <ul className="noona-role">{study.role.map(item => <li key={item.title}><strong>{item.title}:</strong> {item.detail}</li>)}</ul>
        <p className="noona-note">Teammates built most of the sign-up screens and the main participant screens.</p>
      </section>

      <section className="noona-section" id="noona-limits" aria-labelledby="noona-limits-title">
        <SectionHeading id="noona-limits-title" title="Limitations & next steps" />
        <div className="noona-limits">
          <div>
            <h3>Limitations</h3>
            <ul>{study.limitations.map((item, index) => <LiftCard as="li" key={item.title} index={index}><strong>{item.title}</strong> {item.detail}</LiftCard>)}</ul>
          </div>
          <div>
            <h3>What I’d do next</h3>
            <p className="noona-future-label">Proposed · not yet implemented</p>
            <ol>{study.nextSteps.map((item, index) => <LiftCard as="li" key={item.title} index={index}><strong>{item.title}:</strong> {item.detail}</LiftCard>)}</ol>
          </div>
        </div>
      </section>

      <section className="noona-section" id="noona-stack" aria-labelledby="noona-stack-title">
        <SectionHeading id="noona-stack-title" title="Stack" />
        <dl className="noona-stack">{study.stack.map(group => (
          <div key={group.group}><dt>{group.group}</dt><dd><div className="tech-list">{group.items.map(item => <TechBadge key={item}>{item}</TechBadge>)}</div></dd></div>
        ))}</dl>
      </section>

      <section className="noona-section" id="noona-links" aria-labelledby="noona-links-title">
        <SectionHeading id="noona-links-title" title="Links" />
        <div className="noona-links">
          <div>
            <SourceLink href={study.liveSite}>Live site</SourceLink>
            <SourceLink href={study.repository}>Source code</SourceLink>
            <p className="noona-small">Public copy of our private course repository.</p>
          </div>
          <div>
            <h3>Key files</h3>
            <ul>{study.keyFiles.map(file => <li key={file.url}><SourceLink href={file.url}>{file.label}</SourceLink></li>)}</ul>
          </div>
        </div>
      </section>
      <div className="noona-end"><Link className="noona-source" to="/projects"><ArrowLeft size={16} aria-hidden="true" />Browse all projects</Link></div>
    </article>
  )
}
