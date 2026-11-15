import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { projects } from '../data/portfolio'

let routes: RouteObject[]
const scroll = vi.fn()

beforeAll(async () => {
  const description = document.createElement('meta')
  description.name = 'description'
  document.head.append(description)
  const app = await import('../app/router')
  app.router.dispose()
  routes = app.routes
})

beforeEach(() => {
  scroll.mockClear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scroll })
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

async function openStudy(path = '/projects/llm-financial-advisor') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const view = render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: 'LLM Financial Advisor' }, { timeout: 5000 })
  return { router, close: () => { view.unmount(); router.dispose() } }
}

it('opens the dedicated route with seven usable section targets and retained metadata', async () => {
  const app = await openStudy()
  try {
    await waitFor(() => {
      expect(document.title).toBe('LLM Financial Advisor | Theerada Siri')
      expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(/Streamlit application/)
    })
    const outline = screen.getByRole('navigation', { name: 'In this case study' })
    expect(outline.classList.contains('case-study-outline')).toBe(true)
    const links = within(outline).getAllByRole('link')
    expect(links.map(link => link.getAttribute('aria-label'))).toEqual([
      'Overview', 'Five main features', 'How it works', 'My contribution',
      'Challenges & approach', 'Validation & limitations', 'Lessons & future improvements',
    ])
    for (const link of links) {
      const id = link.getAttribute('href')!.split('#')[1]
      expect(document.getElementById(id)).not.toBeNull()
      link.focus()
      expect(document.activeElement).toBe(link)
      fireEvent.click(link)
      expect(app.router.state.location.hash).toBe(`#${id}`)
      expect(link.getAttribute('aria-current')).toBe('location')
      expect(scroll.mock.contexts.at(-1)).toBe(document.getElementById(id))
    }
    expect(document.querySelector('.summer-theme')?.getAttribute('data-motion')).toBe('off')
    expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'instant' })
  } finally { app.close() }
})

it('shows five source-linked features, real application captures, and the demo availability status', async () => {
  const app = await openStudy()
  try {
    const features = screen.getByRole('list', { name: 'Five main features' })
    expect(within(features).getAllByRole('listitem')).toHaveLength(5)
    expect(within(features).getAllByRole('heading').map(heading => heading.textContent)).toEqual([
      'Financial Health Checker', 'Financial Institution', 'Financial Loan', 'Investment Saving', 'Tax Calculator',
    ])
    expect(within(features).getAllByRole('link').map(link => link.getAttribute('href')?.split('/').at(-1))).toEqual([
      'financial_health_checker_tool.py', 'financial_institution_tool.py', 'financial_loan_tool.py', 'investment_saving_tool.py', 'tax_calculator_tool.py',
    ])
    const hero = screen.getByRole('heading', { level: 1 }).closest('header')!
    expect(within(hero).getByText('Developer')).toBeTruthy()
    expect(within(hero).getByText('4 people')).toBeTruthy()
    for (const tech of ['Python', 'Streamlit', 'LiteLLM']) expect(within(hero).getByText(tech)).toBeTruthy()
    expect(within(hero).getByText('Currently unavailable')).toBeTruthy()
    expect(within(hero).getByRole('link', { name: 'View source' }).getAttribute('href')).toBe('https://github.com/Cellul4r/llm-financial-advisor')
    expect(within(hero).getByRole('link', { name: 'View presentation' }).getAttribute('href')).toContain('/slide_presentation.pdf')
    expect(within(hero).queryByRole('link', { name: /live demo/i })).toBeNull()
    expect(screen.getByRole('img', { name: /Financial Advisor start screen/ }).getAttribute('loading')).toBe('lazy')
    expect(screen.queryByText(/currency conversion/i)).toBeNull()
  } finally { app.close() }
})

it('provides numbered section links and selectable full-size application screenshots', async () => {
  const app = await openStudy()
  try {
    const navigation = screen.getByRole('navigation', { name: 'In this case study' })
    expect(within(navigation).queryByRole('combobox')).toBeNull()
    expect(within(navigation).getAllByRole('link').map(link => link.querySelector('span')?.textContent)).toEqual(['01', '02', '03', '04', '05', '06', '07'])
    fireEvent.click(within(navigation).getByRole('link', { name: 'My contribution' }))
    expect(app.router.state.location.hash).toBe('#finance-contribution')
    expect(scroll.mock.contexts.at(-1)).toBe(document.getElementById('finance-contribution'))
    const gallery = screen.getByRole('group', { name: 'Application screenshots' })
    const tax = within(gallery).getByRole('button', { name: 'Tax conversation' })
    tax.focus()
    expect(document.activeElement).toBe(tax)
    fireEvent.click(tax)
    expect(tax.getAttribute('aria-pressed')).toBe('true')
    const image = screen.getByRole('img', { name: /A Thai personal-income tax question/ })
    expect(image.getAttribute('width')).toBe('1329')
    expect(screen.getByRole('link', { name: 'Open full-size screenshot: Tax conversation (new tab)' }).getAttribute('href')).toBe(image.getAttribute('src'))
    expect(screen.getByText(/screenshot does not establish whether the Python tax tool ran/)).toBeTruthy()
    fireEvent.click(within(gallery).getByRole('button', { name: 'Tax breakdown' }))
    expect(screen.getByRole('img', { name: /generated response showing a progressive-tax table/ })).toBeTruthy()
    expect(screen.getByText(/numerical output shown here has not been independently verified/)).toBeTruthy()
    fireEvent.click(within(gallery).getByRole('button', { name: 'Net-worth conversation' }))
    expect(screen.getByRole('img', { name: /A net-worth question with assets/ })).toBeTruthy()
  } finally { app.close() }
})

it('attributes the shared architecture, tax ownership, and assisted manual scenarios accurately', async () => {
  const app = await openStudy()
  try {
    const flow = screen.getByRole('region', { name: 'How a question becomes a calculation.' })
    expect(within(flow).getByText(/architecture and shared ToolExecutor were team work/)).toBeTruthy()
    const contribution = screen.getByRole('region', { name: 'My contribution: the tax tool.' })
    expect(within(contribution).getByText(/I primarily owned.*calculator and its function schema/)).toBeTruthy()
    expect(within(contribution).getByText(/13 Thai and English scenarios with AI-agent assistance.*manually inspected/)).toBeTruthy()
    expect(within(contribution).getByRole('link', { name: 'Repository credits' }).getAttribute('href')).toMatch(/README.md#contributors$/)
    expect(screen.queryByText(/I designed.*executor/)).toBeNull()

    const validation = screen.getByRole('region', { name: 'Manual checks, with clear limits.' })
    expect(within(validation).getByText(/manually inspected function selection and arguments.*compared numerical results with Kasikornbank/)).toBeTruthy()
    expect(within(validation).getByText(/Some questions bypassed tools/)).toBeTruthy()
    expect(within(validation).getByText(/do not assert expected numerical results.*neither a pass rate/)).toBeTruthy()
    expect(within(validation).getByRole('link', { name: 'Manual-check harness' }).getAttribute('href')).toMatch(/tests\/test.py$/)
    expect(within(validation).getByRole('link', { name: 'Scenario prompts' }).getAttribute('href')).toMatch(/tests\/tax_calculator_test.py$/)

    const challenges = screen.getByRole('region', { name: 'Turning tax rules into tool inputs.' })
    expect(within(challenges).getByRole('link', { name: 'Kasikornbank reference calculator' }).getAttribute('href')).toBe('https://www.kasikornbank.com/th/tax/pages/calculate_tax.aspx')
    expect(challenges.querySelectorAll('pre code')).toHaveLength(2)
    for (const link of within(challenges).getAllByRole('link', { name: /selected source/ })) expect(link.getAttribute('href')).toMatch(/tax_calculator_tool.py#L\d+-L\d+$/)
  } finally { app.close() }
})

it('exposes complete diagram alternatives and separates proposed improvements from implemented work', async () => {
  const app = await openStudy('/projects/llm-financial-advisor#finance-future')
  try {
    expect(scroll.mock.contexts.at(-1)).toBe(document.getElementById('finance-future'))
    const flow = screen.getByRole('img', { name: /^Schematic tool-calling flow:/ })
    expect(flow.getAttribute('aria-label')).toMatch(/shared ToolExecutor.*direct text without executing a tool/)
    expect(screen.getByRole('img', { name: /^Schematic tax implementation:/ }).getAttribute('aria-label')).toMatch(/categorized deductions.*flat-tax and progressive-tax/)
    expect(screen.getByRole('img', { name: /^Two schematic validation paths/ }).getAttribute('aria-label')).toMatch(/not captured execution logs.*Direct text generation/)
    expect(screen.getByRole('img', { name: /^Proposed future flow, not implemented:/ })).toBeTruthy()
    const future = screen.getByRole('region', { name: 'What I learned. What comes next.' })
    expect(within(future).getByText('Proposed improvements · not yet implemented')).toBeTruthy()
    for (const title of ['Make execution reliable', 'Automate correctness checks', 'Refresh financial data', 'Retrieve supporting documents', 'Restore a working demo']) expect(within(future).getByRole('heading', { name: title })).toBeTruthy()
    for (const link of document.querySelectorAll('.finance-study a[target="_blank"]')) expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  } finally { app.close() }
})

it('presents the corrected ownership and manual checks in the project library', async () => {
  const app = await openStudy()
  try {
    fireEvent.click(screen.getByRole('link', { name: 'All projects' }))
    const title = await screen.findByRole('heading', { name: 'LLM Financial Advisor' })
    const card = title.closest('article')!
    expect(within(card).getByText(/Ask financial questions in Thai or English/)).toBeTruthy()
    const project = projects.find(item => item.slug === 'llm-financial-advisor')!
    expect(project.highlights.join(' ')).toMatch(/team’s shared function-calling architecture/)
    expect(project.contribution).toMatch(/13 Thai and English scenarios with AI-agent assistance.*manually inspected/)
    expect(project.contribution).not.toMatch(/I designed.*executor/)
    fireEvent.click(within(card).getByRole('link', { name: /Read case study/ }))
    await screen.findByRole('heading', { level: 1, name: 'LLM Financial Advisor' })
    expect(screen.getByRole('navigation', { name: 'In this case study' })).toBeTruthy()
  } finally { app.close() }
})
