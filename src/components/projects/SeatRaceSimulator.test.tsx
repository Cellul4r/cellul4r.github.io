import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RACE_CAPACITY, SeatRaceSimulator, seatRaceScript } from './SeatRaceSimulator'
import { SummerMotionProvider } from '../summer/SummerMotion'

describe('seatRaceScript', () => {
  it('overbooks without the lock: both requests confirm and seat_taken passes capacity', () => {
    const end = seatRaceScript('naive').at(-1)!
    expect(end.outcome).toBe('overbooked')
    expect(end.seatTaken).toBe(RACE_CAPACITY + 1)
    expect(end.status).toEqual({ A: 'CONFIRMED', B: 'CONFIRMED' })
  })

  it('has exactly one winner with SELECT … FOR UPDATE, and B waits while A holds the lock', () => {
    const steps = seatRaceScript('lock')
    const end = steps.at(-1)!
    expect(end.outcome).toBe('one-winner')
    expect(end.seatTaken).toBe(RACE_CAPACITY)
    expect(end.status).toEqual({ A: 'CONFIRMED', B: 'WAITLIST' })
    expect(steps.some(step => step.waiting === 'B' && step.lockHolder === 'A')).toBe(true)
    expect(steps.every(step => step.seatTaken <= RACE_CAPACITY)).toBe(true)
  })
})

function renderSimulator(motion: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(() => ({ matches: !motion, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList)
  return render(<SummerMotionProvider><SeatRaceSimulator /></SummerMotionProvider>)
}

describe('SeatRaceSimulator', () => {
  it('defaults to the locking version and steps through to one winner, announcing each step', () => {
    renderSimulator(true)
    expect(screen.getByRole('radio', { name: /What Noona does/ })).toHaveProperty('checked', true)
    const status = document.querySelector('[aria-live="polite"]')!
    const step = screen.getByRole('button', { name: 'Step' })
    step.focus()
    expect(document.activeElement).toBe(step)
    fireEvent.click(step)
    expect(status.textContent).toMatch(/A locks the session row/)
    for (let i = 0; i < 5; i += 1) fireEvent.click(step)
    expect(status.textContent).toMatch(/10 \/ 10\. One winner ✅/)
    expect(step).toHaveProperty('disabled', true)
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(status.textContent).toMatch(/press Accept at the same moment/)
  })

  it('labels the unlocked version as hypothetical and ends overbooked', () => {
    renderSimulator(true)
    fireEvent.click(screen.getByRole('radio', { name: /What could go wrong/ }))
    expect(screen.getByText(/not a bug we shipped/)).toBeTruthy()
    const step = screen.getByRole('button', { name: 'Step' })
    for (let i = 0; i < 7; i += 1) fireEvent.click(step)
    expect(document.querySelector('[aria-live="polite"]')!.textContent).toMatch(/11 \/ 10\. Overbooked ❌/)
    expect(within(screen.getByRole('region', { name: 'Database row' })).getByText('over capacity')).toBeTruthy()
  })

  it('offers step mode only when motion is reduced', () => {
    renderSimulator(false)
    expect(screen.queryByRole('button', { name: /Play/ })).toBeNull()
    expect(screen.getByRole('button', { name: 'Step' })).toBeTruthy()
  })
})
