const repository = 'https://github.com/Cellul4r/llm-financial-advisor'
const source = (path: string) => `${repository}/blob/main/${path}`

interface StudyLink {
  label: string
  url: string
}

export interface FinanceStep {
  title: string
  detail: string
}

interface FinanceFeature extends FinanceStep {
  icon: 'health' | 'bank' | 'loan' | 'saving' | 'tax'
  url: string
}

interface SourceExcerpt extends FinanceStep {
  code: string
  source: StudyLink
  annotation: string
}

interface FinancialAdvisorCaseStudy {
  repository: string
  presentation: string
  navigation: { id: string; label: string; shortLabel: string }[]
  tools: FinanceFeature[]
  flowSources: StudyLink[]
  contributions: (FinanceStep & { source: StudyLink })[]
  taxSteps: FinanceStep[]
  challenges: SourceExcerpt[]
  improvements: FinanceStep[]
  taxSource: string
  schemaSource: string
  scenarioSource: string
  testHarness: string
  llmSource: string
  creditsSource: string
  referenceCalculator: string
}

export const financialAdvisor: FinancialAdvisorCaseStudy = {
  repository,
  presentation: source('slide_presentation.pdf'),
  navigation: [
    { id: 'finance-overview', label: 'Overview', shortLabel: 'Overview' },
    { id: 'finance-features', label: 'Five main features', shortLabel: 'Features' },
    { id: 'finance-flow', label: 'How it works', shortLabel: 'How it works' },
    { id: 'finance-contribution', label: 'My contribution', shortLabel: 'My contribution' },
    { id: 'finance-challenges', label: 'Challenges & approach', shortLabel: 'Challenges' },
    { id: 'finance-validation', label: 'Validation & limitations', shortLabel: 'Validation' },
    { id: 'finance-future', label: 'Lessons & future improvements', shortLabel: 'Next steps' },
  ],
  tools: [
    { icon: 'health', title: 'Financial Health Checker', detail: 'Calculate emergency-fund, liquidity, savings, and financial-freedom ratios alongside net worth.', url: source('tools/financial_health_checker_tool.py') },
    { icon: 'bank', title: 'Financial Institution', detail: 'Compare savings and fixed-deposit options using the bank-rate data stored in the project.', url: source('tools/financial_institution_tool.py') },
    { icon: 'loan', title: 'Financial Loan', detail: 'Estimate monthly payments and total interest, or compare two loan plans.', url: source('tools/financial_loan_tool.py') },
    { icon: 'saving', title: 'Investment Saving', detail: 'Explore compound interest, recurring savings, and the contributions needed for a savings target.', url: source('tools/investment_saving_tool.py') },
    { icon: 'tax', title: 'Tax Calculator', detail: 'Calculate Thai personal-income tax with coded deduction constraints and progressive and flat-tax methods.', url: source('tools/tax_calculator_tool.py') },
  ],
  flowSources: [
    { label: 'Streamlit interface', url: source('main.py') },
    { label: 'Model and function-call loop', url: source('utils/llm_client.py') },
    { label: 'Shared ToolExecutor', url: source('utils/tool_executor.py') },
  ],
  contributions: [
    {
      title: 'Tax calculator & schema',
      detail: 'I primarily owned the Thai personal-income tax calculator and its function schema: income fields, categorized deductions, coded constraints, and the two calculation methods.',
      source: { label: 'Read my tax implementation', url: source('tools/tax_calculator_tool.py') },
    },
    {
      title: '13 bilingual scenarios',
      detail: 'I created 13 Thai and English scenarios with AI-agent assistance, then manually inspected function selection, extracted arguments, and responses.',
      source: { label: 'Read the 13 tax scenarios', url: source('tests/tax_calculator_test.py') },
    },
  ],
  taxSteps: [
    { title: 'Income fields', detail: 'Total income, income sources, and monthly salary enter through calculate_tax.' },
    { title: 'Categorized deductions', detail: 'Family allowances, insurance, retirement funds, and donations use named deduction keys.' },
    { title: 'Python calculation rules', detail: 'Expense deductions, individual and grouped caps, and donation handling live in Python.' },
    { title: 'Two calculation methods', detail: 'The tool returns flat-tax and progressive-tax outputs, deduction details, and a progressive-tax formula.' },
  ],
  challenges: [
    {
      title: 'Give language a precise input contract.',
      detail: 'Schema descriptions guide the model from a question to named arguments. The deduction_list description supplies categories and asks for amounts; Python applies the coded limits.',
      code: '"income": {\n    "type": "number",\n    "description": "Total income from all sources eg. Sum of salry, bonus, freelance, etc.",\n},',
      annotation: 'The schema describes total income explicitly. These descriptions guide extraction; they do not enforce correct arguments.',
      source: { label: 'Schema descriptions · selected source', url: source('tools/tax_calculator_tool.py#L193-L212') },
    },
    {
      title: 'Keep deduction constraints in code.',
      detail: 'After using Kasikornbank’s calculator to understand the inputs and deduction rules, I encoded constraints in Python rather than asking the model to calculate the caps.',
      code: 'if k == "provident_fund":\n    valid_deductions[k] = min(v, salary_per_month * 12 * 0.15, 500_000)\nelif k == "social_security_fund":\n    valid_deductions[k] = min(v, 9_000)',
      annotation: 'Selected implementation rules, not current tax guidance. Individual caps and grouped limits still need automated correctness tests and rule review.',
      source: { label: 'Deduction constraints · selected source', url: source('tools/tax_calculator_tool.py#L74-L89') },
    },
  ],
  improvements: [
    { title: 'Make execution reliable', detail: 'Validate arguments, expose failures, and distinguish calculated results from direct model text.' },
    { title: 'Automate correctness checks', detail: 'Add expected numeric outputs, deduction boundaries, and invalid-input tests alongside the manual scenarios.' },
    { title: 'Refresh financial data', detail: 'Replace stored rates with refreshable sources and record the source, tax year, version, and retrieval date.' },
    { title: 'Retrieve supporting documents', detail: 'Explore document retrieval (RAG) for relevant rules, with source validation and citations alongside calculator results.' },
    { title: 'Restore a working demo', detail: 'Evaluate model migration, verify function calling with the selected model, and restore the deployment after validation.' },
  ],
  taxSource: source('tools/tax_calculator_tool.py'),
  schemaSource: source('tools/tax_calculator_tool.py#L184-L215'),
  scenarioSource: source('tests/tax_calculator_test.py'),
  testHarness: source('tests/test.py'),
  llmSource: source('utils/llm_client.py'),
  creditsSource: source('README.md#contributors'),
  referenceCalculator: 'https://www.kasikornbank.com/th/tax/pages/calculate_tax.aspx',
}
