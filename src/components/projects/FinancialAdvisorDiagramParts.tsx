import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import type { FinanceStep } from '../../data/financialAdvisor'
import { useSummerMotion } from '../summer/SummerMotion'

export function FinanceDiagram({ label, caption, controls, children }: { label: string; caption: string; controls?: ReactNode; children: ReactNode }) {
  return <figure className="finance-diagram">{controls}<div role="img" aria-label={label}>{children}</div><figcaption>{caption}</figcaption></figure>
}

export function FinanceNode({ step, current = false, visited }: { step: FinanceStep; current?: boolean; visited?: boolean }) {
  const { enabled } = useSummerMotion()
  return (
    <motion.div className="finance-node" data-current={current || undefined} initial={false} animate={{ y: enabled && current ? -3 : 0 }} transition={{ duration: enabled ? .25 : 0 }}>
      {visited !== undefined && <motion.span className="finance-node-progress" aria-hidden="true" initial={false} animate={{ scaleX: visited ? 1 : 0 }} transition={{ duration: enabled ? .5 : 0, ease: 'easeOut' }} />}
      <strong>{step.title}</strong><span>{step.detail}</span>
    </motion.div>
  )
}

export function FlowSequence({ steps, horizontal = false }: { steps: FinanceStep[]; horizontal?: boolean }) {
  return (
    <ol className={`finance-sequence${horizontal ? ' finance-sequence-horizontal' : ''}`}>
      {steps.map((step, index) => <li key={step.title}>
        {index > 0 && <span className="finance-connector" aria-hidden="true"><ArrowDown className="finance-arrow-down" size={18} /><ArrowRight className="finance-arrow-right" size={18} /></span>}
        <FinanceNode step={step} />
      </li>)}
    </ol>
  )
}
