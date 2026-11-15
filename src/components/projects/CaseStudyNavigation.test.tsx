import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import { financialAdvisor } from '../../data/financialAdvisor'
import { typingVsDemon } from '../../data/typingVsDemon'
import { CaseStudyNavigation } from './CaseStudyNavigation'

it.each([
  ['Financial Advisor', financialAdvisor.navigation],
  ['Typing VS Demon', typingVsDemon.navigation],
] as const)('uses the shared numbered navigation and tracks scrolling in %s', (_, sections) => {
  const previousPadding = document.documentElement.style.scrollPaddingTop
  document.documentElement.style.scrollPaddingTop = '20px'
  const sectionTops: Record<string, number> = Object.fromEntries(sections.map((section, index) => [section.id, index === 0 ? -300 : index * 600]))
  sectionTops[sections[1].id] = 100
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const top = this.classList.contains('case-study-outline') ? 76 : sectionTops[this.id] ?? 0
    const height = this.classList.contains('case-study-outline') ? 60 : this.classList.contains('summer-theme-header') ? 76 : 400
    return { top, bottom: top + height, left: 0, right: 1000, width: 1000, height, x: 0, y: top, toJSON() {} }
  })
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
  const app = render(<MemoryRouter><header className="summer-theme-header" /><article className="project-case-study"><CaseStudyNavigation sections={sections} />{sections.map(section => <section key={section.id} id={section.id} />)}</article></MemoryRouter>)
  try {
    expect(document.documentElement.style.scrollPaddingTop).toBe('136px')
    const navigation = screen.getByRole('navigation', { name: 'In this case study' })
    const links = within(navigation).getAllByRole('link')
    expect(links.map(link => link.querySelector('span')?.textContent)).toEqual(sections.map((_, index) => String(index + 1).padStart(2, '0')))
    expect(within(navigation).queryByRole('combobox')).toBeNull()
    fireEvent.scroll(window)
    act(() => vi.advanceTimersByTime(20))
    expect(links[1].getAttribute('aria-current')).toBe('location')
    sectionTops[sections[1].id] = -300
    sectionTops[sections[2].id] = 100
    fireEvent.scroll(window)
    act(() => vi.advanceTimersByTime(20))
    expect(links[2].getAttribute('aria-current')).toBe('location')
    expect(links[1].getAttribute('aria-current')).toBeNull()
    app.unmount()
    expect(document.documentElement.style.scrollPaddingTop).toBe('20px')
  } finally { app.unmount(); document.documentElement.style.scrollPaddingTop = previousPadding }
})

it('keeps all section links available on mobile and reserves only the site header', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ height: 76 } as DOMRect)
  const app = render(<MemoryRouter><header className="summer-theme-header" /><CaseStudyNavigation sections={financialAdvisor.navigation} /></MemoryRouter>)
  try {
    expect(document.documentElement.style.scrollPaddingTop).toBe('76px')
    const navigation = screen.getByRole('navigation', { name: 'In this case study' })
    expect(within(navigation).getAllByRole('link')).toHaveLength(7)
    expect(within(navigation).queryByRole('combobox')).toBeNull()
    const last = within(navigation).getByRole('link', { name: 'Lessons & future improvements' })
    last.focus()
    expect(document.activeElement).toBe(last)
    fireEvent.click(last)
    expect(last.getAttribute('aria-current')).toBe('location')
  } finally { app.unmount() }
})
