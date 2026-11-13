import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { QueensDemo } from './QueensDemo'
import { QueensVerifier } from './QueensVerifier'
import { GrowthChart } from './GrowthChart'
import { MstDemo } from './MstDemo'
import { NamesDemo } from './NamesDemo'

it('keeps fixed queens, detects a guided conflict, and reaches the valid completion', () => {
  render(<QueensDemo language="en" />)
  const fixed = screen.getByRole('button', { name: 'Row 1, column 1, queen, fixed position' })
  fireEvent.click(fixed)
  expect(fixed.getAttribute('aria-pressed')).toBe('true')
  const next = screen.getByRole('button', { name: 'Next step' })
  fireEvent.click(next)
  expect(screen.getByRole('status').textContent).toContain('same diagonal')
  fireEvent.click(next)
  expect(screen.getByRole('status').textContent).not.toContain('Conflicting queens')
  fireEvent.click(next)
  fireEvent.click(next)
  expect(screen.getByRole('status').textContent).toContain('Valid completion')
  expect((next as HTMLButtonElement).disabled).toBe(true)
})

it('shows real name counts, pair totals, and decision results', () => {
  const count = render(<NamesDemo language="en" mode="decision" />)
  fireEvent.click(screen.getByRole('button', { name: 'n = 4' }))
  fireEvent.click(screen.getByRole('button', { name: 'Show complete result' }))
  expect(screen.getByRole('status').textContent).toContain('No')
  fireEvent.click(screen.getByRole('button', { name: 'n = 5' }))
  fireEvent.click(screen.getByRole('button', { name: 'Show complete result' }))
  expect(screen.getByRole('status').textContent).toContain('Yes')
  count.unmount()
  render(<NamesDemo language="en" mode="pairs" />)
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Show complete result' }))
  expect(screen.getByRole('status').textContent).toContain('10 / 10')
  expect(screen.getByRole('status').textContent).toContain('duplicate has been found')
})

it('updates growth values and explicitly labels logarithmic scale', () => {
  render(<GrowthChart language="en" />)
  fireEvent.change(screen.getByRole('slider'), { target: { value: '20' } })
  expect(screen.getByText('1,048,576', { selector: 'strong' })).toBeTruthy()
  fireEvent.click(screen.getByRole('checkbox'))
  expect(screen.getByRole('img', { name: /logarithmic vertical scale/ })).toBeTruthy()
  expect(screen.getByText('1,048,576', { selector: 'strong' })).toBeTruthy()
})

it('answers the MST threshold only after completion and resets cleanly', () => {
  render(<MstDemo language="en" />)
  const next = screen.getByRole('button', { name: 'Next step' })
  for (let i = 0; i < 3; i++) fireEvent.click(next)
  expect(screen.getByRole('status').textContent).toContain('creates a cycle')
  expect(screen.getByRole('status').textContent).not.toContain('Yes')
  fireEvent.click(next)
  expect(screen.getByRole('status').textContent).toContain('7 ≤ 7? Yes')
  fireEvent.click(screen.getByRole('button', { name: 'K = 6' }))
  expect(screen.getByRole('status').textContent).toContain('7 ≤ 6? No')
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
  expect(screen.getByRole('status').textContent).toContain('Start with the smallest edge')
})

it('distinguishes a rejected certificate from a No-instance and accepts a valid certificate', () => {
  render(<QueensVerifier language="en" />)
  fireEvent.click(screen.getByRole('button', { name: 'Missing queen' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next step' }))
  expect(screen.getByRole('status').textContent).toContain('Certificate rejected')
  expect(screen.getByRole('status').textContent).not.toContain('instance is a No')
  fireEvent.click(screen.getByRole('button', { name: 'Valid' }))
  const next = screen.getByRole('button', { name: 'Next step' }) as HTMLButtonElement
  let guard = 0
  while (!next.disabled && guard++ < 30) fireEvent.click(next)
  expect(screen.getByRole('status').textContent).toContain('This certificate proves a Yes')
  expect(screen.getByText('Pairs checked: 10 / 10')).toBeTruthy()
})

it('localizes interactive controls in Thai', () => {
  render(<QueensDemo language="th" />)
  expect(screen.getByRole('button', { name: 'ขั้นถัดไป' })).toBeTruthy()
  expect(screen.getByRole('group', { name: 'กระดานควีน 5 คูณ 5' })).toBeTruthy()
})
