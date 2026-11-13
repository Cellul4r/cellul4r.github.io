import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { ArticleFilterSelect } from './ArticleFilterSelect'

const options = [{ value: '', label: 'All topics' }, { value: 'algorithms', label: 'Algorithms' }, { value: 'complexity', label: 'Complexity theory' }]

it('opens aligned options, selects by keyboard, and retains focus without scrolling', () => {
  const onChange = vi.fn()
  render(<ArticleFilterSelect label="Topic" value="" options={options} onChange={onChange} />)
  const trigger = screen.getByRole('combobox', { name: 'Topic All topics' })
  trigger.focus()
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  expect(screen.getByRole('listbox', { name: 'Topic' })).toBeTruthy()
  expect(screen.getByRole('option', { name: 'All topics' }).getAttribute('aria-selected')).toBe('true')
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  expect(trigger.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Algorithms' }).id)
  fireEvent.keyDown(trigger, { key: 'Enter' })
  expect(onChange).toHaveBeenCalledWith('algorithms')
  expect(screen.queryByRole('listbox')).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

it('supports typeahead, Escape, pointer selection, and outside dismissal', () => {
  const onChange = vi.fn()
  render(<ArticleFilterSelect label="Topic" value="algorithms" options={options} onChange={onChange} />)
  const trigger = screen.getByRole('combobox')
  fireEvent.keyDown(trigger, { key: 'c' })
  expect(trigger.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Complexity theory' }).id)
  fireEvent.keyDown(trigger, { key: 'Escape' })
  expect(screen.queryByRole('listbox')).toBeNull()
  expect(onChange).not.toHaveBeenCalled()
  fireEvent.click(trigger)
  fireEvent.click(screen.getByRole('option', { name: 'Complexity theory' }))
  expect(onChange).toHaveBeenCalledWith('complexity')
  fireEvent.click(trigger)
  fireEvent.pointerDown(document.body)
  expect(screen.queryByRole('listbox')).toBeNull()
})
