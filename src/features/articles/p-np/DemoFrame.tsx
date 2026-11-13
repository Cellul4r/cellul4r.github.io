import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import './demos.css'

export type Language = 'th' | 'en'
export type LanguageProps = { language: Language }
export const local = (language: Language, english: string, thai: string) => language === 'th' ? thai : english

export function DemoFrame({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return <figure className="pnp-demo" aria-label={title}>
    <div className="pnp-demo-title">{title}</div>
    <div className="pnp-demo-body">{children}</div>
    <figcaption>{caption}</figcaption>
  </figure>
}

export function StepControls({ language, step, total, onStep }: LanguageProps & { step: number; total: number; onStep: (step: number) => void }) {
  return <div className="pnp-controls">
    <button type="button" onClick={() => onStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft size={16} aria-hidden="true" />{local(language, 'Previous step', 'ขั้นก่อนหน้า')}</button>
    <button type="button" onClick={() => onStep(Math.min(total, step + 1))} disabled={step === total}>{local(language, 'Next step', 'ขั้นถัดไป')}<ArrowRight size={16} aria-hidden="true" /></button>
    <button type="button" onClick={() => onStep(0)} disabled={step === 0}><RotateCcw size={15} aria-hidden="true" />{local(language, 'Reset', 'เริ่มใหม่')}</button>
    <span className="pnp-step-count">{step} / {total}</span>
  </div>
}
