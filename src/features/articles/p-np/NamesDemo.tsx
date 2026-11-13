import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { namePairs } from './algorithms'
import { DemoFrame, local, StepControls } from './DemoFrame'
import type { LanguageProps } from './DemoFrame'

const sampleNames = ['Ari', 'Bo', 'Cleo', 'Dara', 'Eli', 'Finn', 'Gia', 'Hana', 'Ira', 'Jae']

export function NamesDemo({ language, mode = 'count' }: LanguageProps & { mode?: 'count' | 'pairs' | 'decision' }) {
  const [size, setSize] = useState(5)
  const [step, setStep] = useState(0)
  const [duplicate, setDuplicate] = useState(false)
  const id = useId()
  const reduced = useReducedMotion()
  const names = sampleNames.slice(0, size)
  if (duplicate && mode === 'pairs') names[names.length - 1] = names[0]
  const pairs = namePairs(size)
  const total = mode === 'pairs' ? pairs.length : size
  const current = mode === 'pairs' && step > 0 ? pairs[step - 1] : undefined
  const found = mode === 'pairs' && pairs.slice(0, step).some(([a, b]) => names[a] === names[b])
  const complete = step === total
  function changeSize(value: number) { setSize(value); setStep(0) }
  const title = mode === 'pairs' ? local(language, 'Compare every pair', 'ลองเปรียบเทียบทุกคู่') : mode === 'decision' ? local(language, 'Exactly five names?', 'มีรายชื่อทั้งหมด 5 คนหรือไม่?') : local(language, 'Count the names', 'ลองนับรายชื่อ')
  return <DemoFrame title={title} caption={local(language, 'These are illustrative names. We count a full scan, or compare every distinct pair once, assuming constant-time name comparison.', 'รายชื่อสมมติสำหรับสาธิต วิธีนี้ไล่ตรวจจนครบรายการ หรือเปรียบเทียบทุกคู่หนึ่งครั้ง โดยสมมติให้การเทียบชื่อแต่ละครั้งใช้เวลาคงที่')}>
    <div className="pnp-choice-row" role="group" aria-label={local(language, 'Number of names', 'จำนวนรายชื่อ')}>{(mode === 'decision' ? [4, 5, 6] : [5, 10]).map(value => <button key={value} type="button" aria-pressed={size === value} onClick={() => changeSize(value)}>n = {value}</button>)}</div>
    {mode === 'pairs' && <label className="pnp-checkbox" htmlFor={id}><input id={id} type="checkbox" checked={duplicate} onChange={event => { setDuplicate(event.target.checked); setStep(0) }} />{local(language, 'Make the last name a duplicate', 'ให้ชื่อสุดท้ายซ้ำกับชื่อแรก')}</label>}
    <div className="pnp-name-list" role="list" aria-label={local(language, 'Example names', 'รายชื่อตัวอย่าง')}>{names.map((name, index) => {
      const active = mode === 'pairs' ? current?.includes(index) : index === step - 1
      return <motion.div role="listitem" key={`${size}-${index}`} className={`pnp-name${active ? ' is-highlighted' : ''}${mode !== 'pairs' && index < step ? ' is-visited' : ''}`} animate={{ scale: active && !reduced ? 1.035 : 1 }} transition={{ duration: .16 }}><span>{index + 1}</span>{name}{active && <span className="pnp-name-current" aria-hidden="true">•</span>}</motion.div>
    })}</div>
    {current && <div className="pnp-pair-illustration" aria-hidden="true"><span>{names[current[0]]}</span><svg viewBox="0 0 100 24"><motion.path key={`${step}-${size}`} d="M4 12 H96" fill="none" stroke="#873747" strokeWidth="2" strokeDasharray="5 3" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .25 }} /><circle cx="4" cy="12" r="3" fill="#873747" /><circle cx="96" cy="12" r="3" fill="#873747" /></svg><span>{names[current[1]]}</span></div>}
    <div className="pnp-feedback" role="status">
      {mode === 'pairs' ? <>{current ? `${names[current[0]]} ↔ ${names[current[1]]}: ${names[current[0]] === names[current[1]] ? local(language, 'same name', 'ชื่อซ้ำกัน') : local(language, 'different names', 'ชื่อต่างกัน')}` : local(language, 'Choose Next step to compare the first pair.', 'กดขั้นถัดไปเพื่อเปรียบเทียบคู่แรก')}<br />{local(language, 'Pair comparisons', 'จำนวนคู่ที่เปรียบเทียบ')}: {step} / {total} {found && local(language, '(a duplicate has been found)', '(พบชื่อซ้ำแล้ว)')}</> : <>{local(language, 'Entries checked', 'จำนวนรายการที่ตรวจ')}: {step} / {size}{mode === 'decision' && complete && <strong> · {size === 5 ? 'Yes' : 'No'}</strong>}</>}
    </div>
    <StepControls language={language} step={step} total={total} onStep={setStep} />
    <button type="button" className="pnp-text-button" onClick={() => setStep(total)}>{local(language, 'Show complete result', 'แสดงผลลัพธ์ทั้งหมด')}</button>
    <p className="pnp-formula">{mode === 'pairs' ? `n(n − 1) / 2 = ${total} · O(n²)` : `n = ${size} · O(n)`}</p>
  </DemoFrame>
}
