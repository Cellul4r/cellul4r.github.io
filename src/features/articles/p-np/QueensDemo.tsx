import { useState } from 'react'
import { conflict, FIXED_QUEENS, QUEEN_SOLUTION, queenVerification, samePosition } from './algorithms'
import type { Position } from './algorithms'
import { DemoFrame, local, StepControls } from './DemoFrame'
import type { LanguageProps } from './DemoFrame'
import { QueenBoard } from './QueenBoard'

const guided: readonly (readonly Position[])[] = [
  FIXED_QUEENS, [...FIXED_QUEENS, [2, 2]], [...FIXED_QUEENS, [2, 3]],
  [...FIXED_QUEENS, [2, 3], [4, 2]], QUEEN_SOLUTION,
]

export function QueensDemo({ language }: LanguageProps) {
  const [queens, setQueens] = useState<readonly Position[]>(FIXED_QUEENS)
  const [step, setStep] = useState(0)
  const [full, setFull] = useState(false)
  const bad: Position[] = []
  const conflicts: string[] = []
  for (let i = 0; i < queens.length; i++) {
    for (let j = i + 1; j < queens.length; j++) {
      const reason = conflict(queens[i], queens[j])
      if (reason) {
        bad.push(queens[i], queens[j])
        const name = reason === 'row' ? local(language, 'same row', 'แถวเดียวกัน') : reason === 'column' ? local(language, 'same column', 'คอลัมน์เดียวกัน') : local(language, 'same diagonal', 'แนวทแยงเดียวกัน')
        conflicts.push(`(${queens[i]}) + (${queens[j]}): ${name}`)
      }
    }
  }
  const complete = queenVerification(5, FIXED_QUEENS, queens).at(-1)?.kind === 'accepted'
  function toggle(position: Position) {
    setFull(false)
    if (queens.some(queen => samePosition(queen, position))) setQueens(queens.filter(queen => !samePosition(queen, position)))
    else if (queens.length < 5) setQueens([...queens, position])
    else setFull(true)
  }
  function changeStep(next: number) { setStep(next); setQueens(guided[next]); setFull(false) }
  return <DemoFrame title={local(language, 'Try completing the board', 'ลองเติมควีนให้ครบ')} caption={local(language, 'The two locked queens stay in place. Choose a square to add or remove another queen. This example demonstrates searching and checking, not a runtime lower bound.', 'ควีนที่มีรูปล็อคย้ายไม่ได้ เลือกช่องเพื่อวางหรือนำควีนอื่นออก ตัวอย่างนี้สาธิตการหาและตรวจคำตอบ ไม่ใช่ข้อพิสูจน์เรื่องเวลาที่จำเป็นในการแก้ปัญหา')}>
    <div className="pnp-two-column">
      <QueenBoard language={language} positions={queens} bad={bad} onToggle={toggle} />
      <div className="pnp-explanation">
        <p className="pnp-metric">{queens.length} / 5 <span>{local(language, 'queens', 'ตัว')}</span></p>
        <div className={`pnp-feedback${complete ? ' is-success' : bad.length ? ' is-error' : ''}`} role="status" aria-live="polite">
          {full ? local(language, 'Remove a queen before choosing another square.', 'นำควีนออกหนึ่งตัวก่อนเลือกช่องใหม่') : complete ? local(language, 'Valid completion. This instance is a Yes.', 'วางครบตามเงื่อนไขแล้ว โจทย์ตัวอย่างนี้ตอบ Yes') : bad.length ? <><strong>{local(language, 'Conflicting queens', 'มีตำแหน่งที่ขัดกัน')}</strong><ul>{conflicts.map(message => <li key={message}>{message}</li>)}</ul></> : local(language, 'No conflicts so far. Can you complete all five?', 'ยังไม่มีตำแหน่งขัดกัน ลองเติมให้ครบ 5 ตัวครับ')}
        </div>
        <p>{local(language, 'Or walk through an example: try (2,2), spot the diagonal conflict, and choose (2,3) instead.', 'หรือกดดูตัวอย่างทีละขั้น ลอง (2,2) สังเกตแนวทแยง แล้วเปลี่ยนเป็น (2,3)')}</p>
      </div>
    </div>
    <StepControls language={language} step={step} total={4} onStep={changeStep} />
    <button className="pnp-text-button" type="button" onClick={() => changeStep(0)}>{local(language, 'Clear my board', 'ล้างกระดานที่ลองวาง')}</button>
    <details className="pnp-static-answer"><summary>{local(language, 'See a valid completion without stepping', 'ดูคำตอบที่ถูกต้องโดยไม่ต้องกดทีละขั้น')}</summary><p>(1,1), (2,3), (3,5), (4,2), (5,4)</p><QueenBoard language={language} positions={QUEEN_SOLUTION} /></details>
  </DemoFrame>
}
