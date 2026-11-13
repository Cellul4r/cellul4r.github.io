import { useMemo, useState } from 'react'
import { FIXED_QUEENS, QUEEN_SOLUTION, queenVerification } from './algorithms'
import type { Position, QueenCheck } from './algorithms'
import { DemoFrame, local, StepControls } from './DemoFrame'
import type { Language, LanguageProps } from './DemoFrame'
import { QueenBoard } from './QueenBoard'

const scenarios: { id: string; en: string; th: string; positions: readonly Position[] }[] = [
  { id: 'valid', en: 'Valid', th: 'ถูกต้อง', positions: QUEEN_SOLUTION },
  { id: 'diagonal', en: 'Diagonal conflict', th: 'แนวทแยงขัดกัน', positions: [[1, 1], [2, 2], [3, 5], [4, 3], [5, 4]] },
  { id: 'fixed', en: 'Moved fixed queen', th: 'ย้ายควีนเริ่มต้น', positions: [[1, 2], [2, 3], [3, 5], [4, 2], [5, 4]] },
  { id: 'bounds', en: 'Outside board', th: 'อยู่นอกกระดาน', positions: [[1, 1], [2, 6], [3, 5], [4, 2], [5, 4]] },
  { id: 'count', en: 'Missing queen', th: 'จำนวนไม่ครบ', positions: QUEEN_SOLUTION.slice(0, 4) },
]

const code = [
  'VerifyQueenSolution(N, Fixed, Solution):',
  '    if length(Solution) != N: return false',
  '    for each (row, col) in Solution:',
  '        if not integers or outside 1..N: return false',
  '    for each position in Fixed:',
  '        if position not in Solution: return false',
  '    for each distinct pair (r1,c1), (r2,c2):',
  '        if r1 == r2 or c1 == c2: return false',
  '        if abs(r1-r2) == abs(c1-c2): return false',
  '    return true',
]
const highlightedLines: Record<QueenCheck['kind'], number[]> = {
  count: [1], bounds: [2, 3], fixed: [4, 5], pair: [6, 7, 8], accepted: [9],
}

function describe(check: QueenCheck, positions: readonly Position[], language: Language) {
  if (check.kind === 'count') return local(language, `Check queen count: ${positions.length} of 5.`, `ตรวจจำนวนควีน: ${positions.length} จาก 5 ตัว`)
  if (check.kind === 'bounds') return local(language, `Check integer coordinates and bounds: (${positions[check.indices[0]]}).`, `ตรวจพิกัดจำนวนเต็มและขอบเขต: (${positions[check.indices[0]]})`)
  if (check.kind === 'fixed') return local(language, `Keep fixed queen (${check.fixed}) in the certificate.`, `ตำแหน่งเริ่มต้น (${check.fixed}) ต้องอยู่ใน certificate`)
  if (check.kind === 'accepted') return local(language, 'All checks passed. This certificate proves a Yes.', 'ผ่านทุกเงื่อนไข certificate นี้ยืนยันคำตอบ Yes')
  const [a, b] = check.indices.map(index => positions[index])
  const reason = check.conflict === 'row' ? local(language, 'same row', 'แถวเดียวกัน') : check.conflict === 'column' ? local(language, 'same column', 'คอลัมน์เดียวกัน') : local(language, 'same diagonal', 'แนวทแยงเดียวกัน')
  return `(${a}) + (${b}): ${check.passed ? local(language, 'no conflict', 'ไม่ขัดกัน') : reason} · |Δrow| = ${Math.abs(a[0] - b[0])}, |Δcol| = ${Math.abs(a[1] - b[1])}`
}

export function QueensVerifier({ language }: LanguageProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [step, setStep] = useState(0)
  const scenario = scenarios[scenarioIndex]
  const checks = useMemo(() => queenVerification(5, FIXED_QUEENS, scenario.positions), [scenario])
  const active = step > 0 ? checks[step - 1] : undefined
  const highlighted = active?.indices.map(index => scenario.positions[index]) || []
  return <DemoFrame title={local(language, 'Run the verifier', 'ลองตรวจ certificate')} caption={local(language, 'Only the proposed certificate is being checked. A rejected certificate does not prove that the instance is a No. Input is an explicitly represented board.', 'เรากำลังตรวจเฉพาะ certificate ที่ส่งมา การตรวจไม่ผ่านไม่ได้พิสูจน์ว่าโจทย์ตอบ No ตัวอย่างนี้ใช้อินพุตที่ระบุทุกช่องของกระดาน')}>
    <div className="pnp-choice-row" role="group" aria-label={local(language, 'Certificate examples', 'ตัวอย่าง certificate')}>{scenarios.map((entry, index) => <button type="button" key={entry.id} aria-pressed={index === scenarioIndex} onClick={() => { setScenarioIndex(index); setStep(0) }}>{entry[language]}</button>)}</div>
    <div className="pnp-two-column">
      <QueenBoard language={language} positions={scenario.positions} highlighted={highlighted} bad={active && !active.passed ? highlighted : []} />
      <div>
        <p className="pnp-small-label">Certificate</p>
        <div className="pnp-coordinates">{scenario.positions.map((position, index) => <span key={index} className={active?.indices.includes(index) ? 'is-highlighted' : ''}>({position.join(',')})</span>)}</div>
        <div className={`pnp-feedback${active?.kind === 'accepted' ? ' is-success' : active && !active.passed ? ' is-error' : ''}`} role="status">
          {active ? describe(active, scenario.positions, language) : local(language, 'Choose an example, then advance through the checks.', 'เลือกตัวอย่าง แล้วกดตรวจทีละขั้น')}
          {active && !active.passed && <strong>{local(language, ' Certificate rejected. Try a different placement.', ' certificate นี้ไม่ผ่าน ลองวิธีวางอื่นได้')}</strong>}
        </div>
        <p className="pnp-small-label">{local(language, 'Pairs checked', 'จำนวนคู่ที่ตรวจ')}: {active?.pairChecks || 0} / 10</p>
      </div>
    </div>
    <StepControls language={language} step={step} total={checks.length} onStep={setStep} />
    <div className="pnp-code" aria-label={local(language, 'Verifier pseudocode', 'Pseudocode ของ verifier')}><pre><code>{code.map((line, index) => <span className={active && highlightedLines[active.kind].includes(index) ? 'is-highlighted' : ''} key={index}><span className="pnp-line-number" aria-hidden="true">{index + 1}</span>{line}{'\n'}</span>)}</code></pre></div>
    <details className="pnp-static-answer"><summary>{local(language, 'Read the complete result', 'อ่านผลลัพธ์โดยไม่กดทีละขั้น')}</summary><p>{describe(checks[checks.length - 1], scenario.positions, language)} {checks.at(-1)?.passed ? local(language, 'The valid example checks all 10 distinct pairs.', 'ตัวอย่างที่ถูกต้องตรวจควีนครบ 10 คู่') : local(language, 'This rejects this certificate only, not every possible completion.', 'ผลนี้ปฏิเสธเฉพาะ certificate ชุดนี้ ไม่ใช่ทุกวิธีวางที่เป็นไปได้')}</p></details>
  </DemoFrame>
}
