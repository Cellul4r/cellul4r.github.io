import { useEffect, useId, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, Mail } from 'lucide-react'
import { noonaAppointment as study } from '../../data/noonaAppointment'
import { useSummerMotion } from '../summer/SummerMotion'

const ease = [.22, 1, .36, 1] as const

function EdgeLabel({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  const width = Math.max(...lines.map(line => line.length)) * 6.6 + 14
  const height = lines.length * 15 + 8
  return (
    <g className="noona-state-label">
      <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={3} />
      {lines.map((line, index) => <text key={line} x={x} y={y - height / 2 + 16 + index * 15} textAnchor="middle">{line}</text>)}
    </g>
  )
}

const nodeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: .45, delay, ease } }),
}

function StateNode({ x, y, label, hint, delay }: { x: number; y: number; label: string; hint: string; delay: number }) {
  return (
    <motion.g className="noona-state-node" variants={nodeVariants} custom={delay}>
      <rect x={x - 75} y={y - 25} width={150} height={50} rx={4} />
      <text x={x} y={y - 3} textAnchor="middle" className="noona-state-name">{label}</text>
      <text x={x} y={y + 14} textAnchor="middle" className="noona-state-hint">{hint}</text>
    </motion.g>
  )
}

/** Keys match `${from}-${to}` in study.transitions so the list can highlight its arrow. */
const edges = [
  { key: 'start-CONFIRMED', d: 'M60 162 L253 68', label: { x: 150, y: 106, lines: ['register,', 'seat free'] } },
  { key: 'start-WAITLIST', d: 'M60 172 L253 262', label: { x: 150, y: 226, lines: ['register,', 'session full'] } },
  { key: 'WAITLIST-AVAILABLE', d: 'M405 278 C510 300 610 260 620 192', label: { x: 560, y: 300, lines: ['a confirmed user', 'cancels or is removed'] } },
  { key: 'AVAILABLE-WAITLIST', d: 'M575 191 C555 238 480 256 408 256', label: { x: 492, y: 226, lines: ['session fills again'] } },
  { key: 'AVAILABLE-CONFIRMED', d: 'M620 139 C620 86 520 58 408 58', label: { x: 560, y: 76, lines: ['accepts first'] } },
]

const DRAW = .6
const edgeDelay = (index: number) => .35 + index * .18
const drawVariants: Variants = {
  hidden: { pathLength: 0 },
  shown: (delay: number) => ({ pathLength: 1, transition: { duration: DRAW, delay, ease: 'easeInOut' } }),
}
const afterDrawVariants: Variants = {
  hidden: { opacity: 0 },
  shown: (delay: number) => ({ opacity: 1, transition: { duration: .25, delay: delay + DRAW * .85 } }),
}

export function RegistrationStateDiagram() {
  const id = useId()
  const marker = `${id}-arrow`
  const { enabled } = useSummerMotion()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const play = enabled
    ? { initial: 'hidden', whileInView: 'shown', viewport: { once: true, amount: .35 } }
    : { initial: false as const, animate: 'shown' }
  const highlighting = edges.some(edge => edge.key === activeKey)
  return (
    <figure className="noona-diagram noona-states">
      <motion.svg viewBox="0 0 720 340" role="img" aria-labelledby={`${id}-title`} data-highlighting={highlighting ? 'true' : undefined} {...play}>
        <title id={`${id}-title`}>Registration state diagram: CONFIRMED, WAITLIST and AVAILABLE, with the transitions listed below.</title>
        <defs>
          <marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" /></marker>
        </defs>
        <motion.g variants={nodeVariants} custom={0}>
          <circle className="noona-state-start" cx="50" cy="167" r="10" />
          <text className="noona-state-hint" x="50" y="196" textAnchor="middle">start</text>
        </motion.g>
        <StateNode x={330} y={58} label="CONFIRMED" hint="holds a seat" delay={.1} />
        <StateNode x={330} y={266} label="WAITLIST" hint="session was full" delay={.15} />
        <StateNode x={620} y={165} label="AVAILABLE" hint="can claim a seat" delay={.2} />
        {edges.map((edge, index) => (
          <g key={edge.key} className="noona-edge" data-edge={edge.key} data-active={activeKey === edge.key ? 'true' : undefined}>
            <motion.path className="noona-edge-line" d={edge.d} variants={drawVariants} custom={edgeDelay(index)} />
            <motion.path className="noona-edge-head" d={edge.d} markerEnd={`url(#${marker})`} variants={afterDrawVariants} custom={edgeDelay(index)} />
            <motion.g variants={afterDrawVariants} custom={edgeDelay(index)}><EdgeLabel {...edge.label} /></motion.g>
          </g>
        ))}
      </motion.svg>
      <figcaption>
        <ul className="noona-transitions" aria-label="All transitions">{study.transitions.map(item => {
          const key = `${item.from}-${item.to}`
          return (
            <li key={key} data-active={activeKey === key ? 'true' : undefined} onMouseEnter={() => setActiveKey(key)} onMouseLeave={() => setActiveKey(null)}>
              <code>{item.from === 'any' ? 'any state' : item.from}</code><ArrowRight size={14} aria-label="to" /><code>{item.to}</code><span>{item.label}</span>
            </li>
          )
        })}</ul>
      </figcaption>
    </figure>
  )
}

export function NoonaArchitectureDiagram() {
  return (
    <figure className="noona-diagram noona-architecture">
      <div className="noona-arch-node"><strong>Vue 3 SPA</strong><span>Vite · Tailwind · DaisyUI</span></div>
      <p className="noona-arch-wire"><ArrowDown size={16} aria-hidden="true" />HTTPS · JWT cookie + CSRF token</p>
      <div className="noona-arch-api">
        <div className="noona-arch-node noona-arch-primary">
          <strong>FastAPI on Vercel</strong><span>Python serverless function, Singapore region</span>
          <ol className="noona-arch-layers" aria-label="Request path inside the API">
            {['middleware', 'routers', 'services', 'SQLAlchemy models'].map(layer => <li key={layer}>{layer}</li>)}
          </ol>
        </div>
        <div className="noona-arch-node noona-arch-cron"><strong>Vercel Cron</strong><span>every 5 min → /api/notifications/dispatch</span></div>
      </div>
      <p className="noona-arch-wire"><ArrowDown size={16} aria-hidden="true" />reads, writes and sends</p>
      <ul className="noona-arch-services" aria-label="Services the API uses">
        <li className="noona-arch-node"><strong>Supabase Postgres</strong><span>via the connection pooler</span></li>
        <li className="noona-arch-node"><strong>Supabase Storage</strong><span>profile images</span></li>
        <li className="noona-arch-node"><strong>Gmail SMTP</strong><span>through fastapi-mail</span></li>
      </ul>
      <figcaption>The frontend ships as static files and the API as one Python function; every /api/* request is routed to it.</figcaption>
    </figure>
  )
}

const pipeline = ['An action needs an email', 'notification_jobs row', 'Vercel Cron, every 5 min', 'Dispatch endpoint', 'Gmail SMTP', 'Inbox']
export const PIPELINE_STEP_MS = 450

export function EmailPipelineDiagram() {
  const { enabled } = useSummerMotion()
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: .6 })
  const [step, setStep] = useState(-1)
  const [run, setRun] = useState(0)
  const done = step >= pipeline.length

  useEffect(() => {
    if (!enabled || !inView) return
    let current = 0
    setStep(0)
    const timer = window.setInterval(() => {
      current += 1
      setStep(current)
      if (current >= pipeline.length) window.clearInterval(timer)
    }, PIPELINE_STEP_MS)
    return () => window.clearInterval(timer)
  }, [enabled, inView, run])

  return (
    <figure className="noona-diagram noona-pipeline" onPointerEnter={() => { if (enabled && done) setRun(value => value + 1) }}>
      <ol ref={ref} aria-label="Email pipeline">{pipeline.map((label, index) => {
        const active = index === step
        const delivered = done && index === pipeline.length - 1
        return (
          <li key={label} data-active={active ? 'true' : undefined} data-visited={index < step ? 'true' : undefined}>
            {index > 0 && <ArrowRight className="noona-pipeline-arrow" size={16} aria-hidden="true" />}
            <span>
              {active && <motion.span className="noona-pipeline-mark" aria-hidden="true" initial={{ x: -10, opacity: 0, rotate: -12 }} animate={{ x: 0, opacity: 1, rotate: 0 }} transition={{ duration: .3, ease }}><Mail size={14} /></motion.span>}
              {delivered && <motion.span className="noona-pipeline-mark" aria-hidden="true" initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }}><Check size={14} /></motion.span>}
              {label}
            </span>
          </li>
        )
      })}</ol>
      <figcaption>Due jobs are sent in batches. A failed send is retried with exponential backoff, capped at an hour, up to five attempts.</figcaption>
    </figure>
  )
}
