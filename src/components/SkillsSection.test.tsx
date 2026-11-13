import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it } from 'vitest'
import { SkillsSection } from './SkillsSection'

function renderSkills() {
  return render(<MemoryRouter><SkillsSection /></MemoryRouter>)
}

it('keeps the established technologies separate from current cloud development', () => {
  renderSkills()
  const toolkit = screen.getByRole('region', { name: 'My Skills' })
  const technologies = within(toolkit).getAllByRole('listitem').map(item => item.textContent)
  expect(technologies).toEqual([
    'Python', 'Go', 'Java', 'C++', 'JavaScript',
    'FastAPI', 'Fiber', 'React', 'Vue 3', 'Streamlit', 'Node.js',
    'PostgreSQL', 'MongoDB', 'SQLAlchemy',
    'Git', 'GitHub', 'Docker', 'Vercel', 'Supabase',
  ])
  const learning = screen.getByRole('region', { name: 'Where I’m growing.' })
  expect(learning.textContent).toContain('Currently developing')
  expect(learning.textContent).toContain('Compute & storage · Identity & access management · Cloud networking · Monitoring')
  expect(learning.textContent).toContain('CI/CD pipelines · Cloud deployment · Automation')
  expect(learning.textContent).not.toContain('TCP/IP')
})

it('provides native, focusable disclosures with all foundation skills preserved', () => {
  renderSkills()
  const foundations = screen.getByRole('region', { name: 'Engineering foundations' })
  const expected = [
    ['Software Engineering practices', 'Object-oriented programming · REST APIs · Relational database modeling · Database transactions · Concurrency control'],
    ['Algorithms & data structures', 'Competitive programming · Algorithm Design and Analysis · Dynamic programming · Binary Search · Prefix Sum'],
    ['Development workflows', 'Agile · Sprint planning · User stories · Jira'],
    ['Computer networking', 'TCP/IP · IPv4/IPv6 · Subnetting · VLANs · Routing · Network troubleshooting'],
  ]
  expected.forEach(([title, content], index) => {
    const summary = within(foundations).getByText(title, { selector: 'summary' })
    const panel = summary.closest('details')!
    expect(panel.open).toBe(index === 0)
    expect(panel.querySelector('p')?.textContent).toBe(content)
    summary.focus()
    expect(document.activeElement).toBe(summary)
    fireEvent.click(summary)
    expect(panel.open).toBe(index !== 0)
    fireEvent.click(summary)
    expect(panel.open).toBe(index === 0)
  })
})

it('retains the project CTA and the existing evidence-based soft-skill links', () => {
  renderSkills()
  expect(screen.getByRole('heading', { level: 2, name: 'What I bring.' })).toBeTruthy()
  expect(screen.getByText('A practical toolkit, with room to keep growing.')).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Explore the projects' }).getAttribute('href')).toBe('/projects')
  expect(screen.getByRole('link', { name: 'View ICPC results' }).getAttribute('href')).toBe('/competitive-programming#icpc')
  expect(screen.getByRole('link', { name: 'View tutoring activity' }).getAttribute('href')).toBe('/competitive-programming#tutoring-activity')
  expect(screen.getByRole('link', { name: 'Explore Noona case study' }).getAttribute('href')).toBe('/projects/noona-appointment')
})
