import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Calculator, ChartNoAxesCombined, CodeXml, FileText, HeartPulse, Landmark, PiggyBank } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TechBadge } from '../components/TechBadge'
import { useSummerMotion } from '../components/summer/SummerMotion'
import { FutureFinanceDiagram, TaxImplementationDiagram, ToolCallingDiagram, ValidationPathsDiagram } from '../components/projects/FinancialAdvisorDiagrams'
import { FinanceSurface } from '../components/projects/FinanceSurface'
import { CaseStudyNavigation } from '../components/projects/CaseStudyNavigation'
import { FinancialAdvisorGallery } from '../components/projects/FinancialAdvisorGallery'
import { financialAdvisor as study } from '../data/financialAdvisor'
import { projects } from '../data/portfolio'
import { usePageMetadata } from '../hooks/usePageMetadata'
import './FinancialAdvisorPage.css'

const featureIcons = { health: HeartPulse, bank: Landmark, loan: ChartNoAxesCombined, saving: PiggyBank, tax: Calculator }

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="finance-source" href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /></a>
}

function SectionHeading({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const index = study.navigation.findIndex(section => `${section.id}-title` === id)
  return <div className="finance-section-heading"><p className="eyebrow">{String(index + 1).padStart(2, '0')} / {study.navigation[index].label}</p><h2 id={id}>{title}</h2><p>{children}</p></div>
}

export function FinancialAdvisorPage() {
  const { enabled } = useSummerMotion()
  const project = projects.find(item => item.slug === 'llm-financial-advisor')!
  usePageMetadata(`${project.title} | Theerada Siri`, project.description)

  return (
    <article className="finance-study project-case-study">
      <motion.header className="finance-hero" id="finance-overview" initial={enabled ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: enabled ? .55 : 0, ease: [.22, 1, .36, 1] }}>
        <Link className="back-link" to="/projects"><ArrowLeft size={16} aria-hidden="true" />All projects</Link>
        <div className="finance-heading">
          <div><p className="eyebrow">{project.eyebrow}</p><h1>{project.title}</h1></div>
          <div className="finance-summary">
            <p>{project.description}</p>
            <div className="finance-actions">
              <a className="button button-primary" href={study.repository} target="_blank" rel="noopener noreferrer"><CodeXml size={18} aria-hidden="true" />View source</a>
              <a className="button button-quiet" href={study.presentation} target="_blank" rel="noopener noreferrer"><FileText size={18} aria-hidden="true" />View presentation</a>
            </div>
          </div>
        </div>
        <dl className="finance-facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Team</dt><dd>{project.teamSize} people</dd></div>
          <div><dt>Context</dt><dd>Computer Science Technology course</dd></div>
          <div><dt>Live demo</dt><dd>Currently unavailable</dd></div>
        </dl>
        <div className="tech-list" aria-label="Technologies used">{project.stack.map(tech => <TechBadge key={tech}>{tech}</TechBadge>)}</div>
        <p className="finance-availability">Explore the source code and presentation below. Restoring the live deployment is future work.</p>
      </motion.header>

      <CaseStudyNavigation sections={study.navigation} />

      <section className="finance-section" id="finance-features" aria-labelledby="finance-features-title">
        <SectionHeading id="finance-features-title" title="Five tools, one conversation.">The team connected a Streamlit chat interface to five main financial tool families. Each keeps its calculation logic in Python.</SectionHeading>
        <ul className="finance-tools" aria-label="Five main features">{study.tools.map(tool => {
          const Icon = featureIcons[tool.icon]
          return <FinanceSurface as="li" key={tool.title}><motion.span className="finance-feature-icon" aria-hidden="true" variants={{ rest: { rotate: 0, scale: 1 }, engaged: { rotate: enabled ? -8 : 0, scale: enabled ? 1.08 : 1 } }}><Icon size={28} strokeWidth={1.5} /></motion.span><h3>{tool.title}</h3><p>{tool.detail}</p><SourceLink href={tool.url}>View {tool.title} source</SourceLink></FinanceSurface>
        })}</ul>
        <FinancialAdvisorGallery />
      </section>

      <section className="finance-section" id="finance-flow" aria-labelledby="finance-flow-title">
        <SectionHeading id="finance-flow-title" title="How a question becomes a calculation.">The function-calling architecture and shared ToolExecutor were team work. The model interprets language and can request a function; the selected Python tool performs the calculation.</SectionHeading>
        <ToolCallingDiagram />
        <div className="finance-source-row">{study.flowSources.map(source => <SourceLink key={source.url} href={source.url}>{source.label}</SourceLink>)}</div>
      </section>

      <section className="finance-section" id="finance-contribution" aria-labelledby="finance-contribution-title">
        <SectionHeading id="finance-contribution-title" title="My contribution: the tax tool.">My primary ownership was the tax calculator and its schema. I also prepared bilingual scenarios to inspect the workflow manually.</SectionHeading>
        <div className="finance-contributions">{study.contributions.map(item => <FinanceSurface key={item.title}><h3>{item.title}</h3><p>{item.detail}</p><SourceLink href={item.source.url}>{item.source.label}</SourceLink></FinanceSurface>)}</div>
        <div className="finance-spotlight-heading"><h3>Inside the tax implementation</h3><SourceLink href={study.taxSource}>Explore TaxCalculatorTool</SourceLink></div>
        <TaxImplementationDiagram />
        <p className="finance-credit"><strong>Team credits.</strong> Krit Thongjib worked on financial health; Pitchayanat Patthamasewee on the frontend and investment/savings tool; Punchita Sittisarit on financial institutions and loans. <SourceLink href={study.creditsSource}>Repository credits</SourceLink></p>
      </section>

      <section className="finance-section" id="finance-challenges" aria-labelledby="finance-challenges-title">
        <SectionHeading id="finance-challenges-title" title="Turning tax rules into tool inputs.">The challenge crossed two boundaries: understanding income and deduction rules, then helping the model extract the fields that the calculator expects.</SectionHeading>
        <div className="finance-excerpts">{study.challenges.map(item => (
          <FinanceSurface className="finance-excerpt" key={item.title}>
            <div className="finance-excerpt-copy"><h3>{item.title}</h3><p>{item.detail}</p><SourceLink href={item.source.url}>{item.source.label}</SourceLink></div>
            <figure className="finance-code"><pre><code>{item.code}</code></pre><figcaption>{item.annotation}</figcaption></figure>
          </FinanceSurface>
        ))}</div>
        <div className="finance-source-row"><SourceLink href={study.schemaSource}>Full tax function schema</SourceLink><SourceLink href={study.referenceCalculator}>Kasikornbank reference calculator</SourceLink></div>
      </section>

      <section className="finance-section" id="finance-validation" aria-labelledby="finance-validation-title">
        <SectionHeading id="finance-validation-title" title="Manual checks, with clear limits.">I manually inspected function selection and arguments, and compared numerical results with Kasikornbank’s calculator. Some questions bypassed tools and received direct model text.</SectionHeading>
        <ValidationPathsDiagram />
        <div className="finance-validation">
          <FinanceSurface><h3>What I checked</h3><p>The 13 Thai and English scenarios cover salary, freelance income, insurance, retirement funds, family deductions, and donations. The harness prints responses; the client prints intermediate function names and arguments when a function is requested.</p><div className="finance-source-row"><SourceLink href={study.scenarioSource}>Scenario prompts</SourceLink><SourceLink href={study.testHarness}>Manual-check harness</SourceLink><SourceLink href={study.llmSource}>Function-call diagnostics</SourceLink></div></FinanceSurface>
          <FinanceSurface><h3>What remains unverified</h3><p>The scripts do not assert expected numerical results. These manual checks establish neither a pass rate nor comprehensive financial correctness. Direct text does not prove that a calculator ran.</p><p>Stored rates and coded tax rules need source and tax-year review before real financial use.</p></FinanceSurface>
        </div>
        <p className="finance-note">Educational team project; not a certified or production-ready financial service. The reference calculator supports manual comparison, not certification of this implementation.</p>
      </section>

      <section className="finance-section" id="finance-future" aria-labelledby="finance-future-title">
        <SectionHeading id="finance-future-title" title="What I learned. What comes next.">Separating language from calculation makes the rules inspectable. Reliability still depends on correct tool selection, valid inputs, tested calculations, and traceable financial sources.</SectionHeading>
        <p className="finance-future-label">Proposed improvements · not yet implemented</p>
        <ul className="finance-improvements">{study.improvements.map(item => <FinanceSurface as="li" key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></FinanceSurface>)}</ul>
        <FutureFinanceDiagram />
      </section>
      <div className="finance-end"><Link className="finance-source" to="/projects"><ArrowLeft size={16} aria-hidden="true" />Browse all projects</Link><SourceLink href={study.repository}>Explore the repository</SourceLink></div>
    </article>
  )
}
