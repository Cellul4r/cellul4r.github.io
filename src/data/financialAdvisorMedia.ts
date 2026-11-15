import startScreen from '../assets/projects/llm-financial-advisor/start-screen.png'
import taxConversation from '../assets/projects/llm-financial-advisor/tax-conversation.png'
import taxBreakdown from '../assets/projects/llm-financial-advisor/tax-breakdown.png'
import netWorthConversation from '../assets/projects/llm-financial-advisor/net-worth-conversation.png'
import type { ProjectMedia } from '../types/portfolio'

export const financialAdvisorMedia: (ProjectMedia & { id: string; title: string })[] = [
  {
    id: 'start', title: 'Start screen', src: startScreen, width: 1919, height: 778,
    alt: 'Financial Advisor start screen with five category shortcuts, suggested questions, and a chat input.',
    caption: 'The Streamlit interface brings category shortcuts and suggested questions into one conversation.',
  },
  {
    id: 'tax', title: 'Tax conversation', src: taxConversation, width: 1329, height: 694,
    alt: 'A Thai personal-income tax question and an app response explaining net taxable income.',
    caption: 'A tax question followed by an explanatory response. The screenshot does not establish whether the Python tax tool ran.',
  },
  {
    id: 'breakdown', title: 'Tax breakdown', src: taxBreakdown, width: 861, height: 642,
    alt: 'A generated response showing a progressive-tax table with income brackets, rates, and amounts.',
    caption: 'A generated tax breakdown as displayed by the app; the numerical output shown here has not been independently verified.',
  },
  {
    id: 'net-worth', title: 'Net-worth conversation', src: netWorthConversation, width: 1309, height: 485,
    alt: 'A net-worth question with assets and liabilities, followed by the beginning of the app’s explanation.',
    caption: 'A financial-health conversation using assets and liabilities. A visible response alone does not prove tool execution.',
  },
]
