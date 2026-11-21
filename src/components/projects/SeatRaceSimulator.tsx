import { useEffect, useId, useState } from 'react'
import { Hourglass, Lock, Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { useSummerMotion } from '../summer/SummerMotion'

export type RaceMode = 'lock' | 'naive'
type Participant = 'A' | 'B'
type RaceStatus = 'AVAILABLE' | 'CONFIRMED' | 'WAITLIST'

export interface RaceStep {
  actor: Participant | null
  text: string
  sql?: string
  seatTaken: number
  status: Record<Participant, RaceStatus>
  lockHolder: Participant | null
  waiting: Participant | null
  outcome?: 'overbooked' | 'one-winner'
}

export const RACE_CAPACITY = 10

const start: RaceStep = {
  actor: null,
  text: 'A and B are both Available. They press Accept at the same moment.',
  seatTaken: 9,
  status: { A: 'AVAILABLE', B: 'AVAILABLE' },
  lockHolder: null,
  waiting: null,
}

export function seatRaceScript(mode: RaceMode): RaceStep[] {
  if (mode === 'naive') {
    return [
      start,
      { ...start, actor: 'A', text: 'A reads seat_taken = 9.', sql: 'SELECT seat_taken FROM sessions' },
      { ...start, actor: 'B', text: 'B reads seat_taken = 9.', sql: 'SELECT seat_taken FROM sessions' },
      { ...start, actor: 'A', text: 'A checks 9 < 10. ✓ Seat looks free.' },
      { ...start, actor: 'B', text: 'B checks 9 < 10. ✓ Seat looks free.' },
      { ...start, actor: 'A', text: 'A writes seat_taken = 10 and commits.', sql: 'UPDATE sessions SET seat_taken = seat_taken + 1; COMMIT', seatTaken: 10, status: { A: 'CONFIRMED', B: 'AVAILABLE' } },
      { ...start, actor: 'B', text: 'B writes seat_taken = 11 and commits.', sql: 'UPDATE sessions SET seat_taken = seat_taken + 1; COMMIT', seatTaken: 11, status: { A: 'CONFIRMED', B: 'CONFIRMED' } },
      { ...start, actor: null, text: 'Result: 11 / 10. Overbooked ❌ Both A and B are confirmed.', seatTaken: 11, status: { A: 'CONFIRMED', B: 'CONFIRMED' }, outcome: 'overbooked' },
    ]
  }
  return [
    start,
    { ...start, actor: 'A', text: 'A locks the session row and reads seat_taken = 9.', sql: 'SELECT … FROM sessions WHERE id = :id FOR UPDATE', lockHolder: 'A' },
    { ...start, actor: 'B', text: 'B tries to lock the same row and waits.', sql: 'SELECT … FROM sessions WHERE id = :id FOR UPDATE', lockHolder: 'A', waiting: 'B' },
    { ...start, actor: 'A', text: 'A checks 9 < 10 ✓, confirms, sets seat_taken = 10, moves the other Available users back to the waitlist, and commits. The lock is released.', sql: 'UPDATE …; COMMIT', seatTaken: 10, status: { A: 'CONFIRMED', B: 'WAITLIST' } },
    { ...start, actor: 'B', text: 'B gets the lock and reads the new row: seat_taken = 10, and B is now on the waitlist.', sql: 'SELECT … FOR UPDATE  -- returns', seatTaken: 10, status: { A: 'CONFIRMED', B: 'WAITLIST' }, lockHolder: 'B' },
    { ...start, actor: 'B', text: 'B is rejected ❌ “Seat already taken.” B stays on the waitlist.', sql: 'ROLLBACK', seatTaken: 10, status: { A: 'CONFIRMED', B: 'WAITLIST' } },
    { ...start, actor: null, text: 'Result: 10 / 10. One winner ✅ A is confirmed; B is back on the waitlist.', seatTaken: 10, status: { A: 'CONFIRMED', B: 'WAITLIST' }, outcome: 'one-winner' },
  ]
}

const modes: { id: RaceMode; label: string; tag: string }[] = [
  { id: 'lock', label: 'With SELECT … FOR UPDATE', tag: 'What Noona does' },
  { id: 'naive', label: 'Without lock (check, then write)', tag: 'What could go wrong' },
]

function Lane({ who, steps, index, current }: { who: Participant; steps: RaceStep[]; index: number; current: RaceStep }) {
  const visible = steps.slice(0, index + 1).map((step, position) => ({ step, position })).filter(({ step }) => step.actor === who)
  const waiting = current.waiting === who
  const holding = current.lockHolder === who
  return (
    <section className="race-lane" aria-label={`Request ${who}`}>
      <h4>Request {who}{holding && <span className="race-flag"><Lock size={14} aria-hidden="true" />holds lock</span>}{waiting && <span className="race-flag race-flag-wait"><Hourglass size={14} aria-hidden="true" />waiting</span>}</h4>
      <ol>{visible.length === 0 ? <li className="race-empty">Not started</li> : visible.map(({ step, position }) => (
        <li key={position} data-current={position === index ? 'true' : undefined}>
          {step.sql && <code>{step.sql}</code>}
          <span>{step.text}</span>
        </li>
      ))}</ol>
    </section>
  )
}

export function SeatRaceSimulator() {
  const { enabled } = useSummerMotion()
  const [mode, setMode] = useState<RaceMode>('lock')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const groupName = useId()
  const steps = seatRaceScript(mode)
  const current = steps[index]
  const atEnd = index === steps.length - 1

  useEffect(() => {
    if (!playing || !enabled) return
    if (atEnd) { setPlaying(false); return }
    const timer = window.setTimeout(() => setIndex(value => value + 1), 1400)
    return () => window.clearTimeout(timer)
  }, [playing, enabled, atEnd, index])

  const reset = () => { setPlaying(false); setIndex(0) }
  const over = current.seatTaken > RACE_CAPACITY

  return (
    <figure className="race" aria-labelledby={`${groupName}-title`}>
      <div className="race-head">
        <p className="race-label">Simulation</p>
        <h3 id={`${groupName}-title`}>Two Accepts, one seat</h3>
        <p className="race-intro">Capacity 10, seat_taken 9. Participants A and B are both Available. Nothing here calls a server; it replays the two orderings step by step.</p>
      </div>

      <fieldset className="race-modes">
        <legend>Version</legend>
        {modes.map(option => (
          <label key={option.id} data-selected={mode === option.id ? 'true' : undefined}>
            <input type="radio" name={groupName} value={option.id} checked={mode === option.id} onChange={() => { setMode(option.id); reset() }} />
            <span><strong>{option.tag}</strong>{option.label}</span>
          </label>
        ))}
      </fieldset>
      {mode === 'naive' && <p className="race-hypothetical">Hypothetical: this is the version Noona avoids, not a bug we shipped.</p>}

      <div className="race-controls">
        {enabled && <button type="button" onClick={() => { if (atEnd) setIndex(0); setPlaying(value => !value) }}>{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{playing ? 'Pause' : 'Play'}</button>}
        <button type="button" onClick={() => { setPlaying(false); setIndex(value => Math.min(value + 1, steps.length - 1)) }} disabled={atEnd}><StepForward size={16} aria-hidden="true" />Step</button>
        <button type="button" onClick={reset} disabled={index === 0 && !playing}><RotateCcw size={16} aria-hidden="true" />Reset</button>
        <span className="race-counter">Step {index} of {steps.length - 1}</span>
      </div>

      <div className="race-board">
        <Lane who="A" steps={steps} index={index} current={current} />
        <section className="race-row" aria-label="Database row">
          <h4>sessions row</h4>
          <p className="race-seats" data-over={over ? 'true' : undefined}><span>seat_taken / capacity</span><strong>{current.seatTaken} / {RACE_CAPACITY}</strong>{over && <em>over capacity</em>}</p>
          <dl>
            <div><dt>A</dt><dd>{current.status.A}</dd></div>
            <div><dt>B</dt><dd>{current.status.B}</dd></div>
            <div><dt>Lock</dt><dd>{current.lockHolder ? `held by ${current.lockHolder}` : 'free'}</dd></div>
          </dl>
        </section>
        <Lane who="B" steps={steps} index={index} current={current} />
      </div>

      <figcaption className="race-status" aria-live="polite" data-outcome={current.outcome}>{current.text}</figcaption>
      <p className="race-footnote">Simplified. The real API answers the rejected request with a 400 because B is no longer Available.</p>
    </figure>
  )
}
