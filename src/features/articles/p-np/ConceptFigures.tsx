import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { DemoFrame, local } from './DemoFrame'
import type { LanguageProps } from './DemoFrame'

export function BoardSizes({ language }: LanguageProps) {
  return <DemoFrame title={local(language, 'The board can grow', 'เมื่อกระดานใหญ่ขึ้น')} caption={local(language, 'Board dimensions and cell counts only, not algorithm runtimes. In this article the input explicitly represents all cells.', 'แสดงขนาดกระดานและจำนวนช่อง ไม่ใช่เวลาในการทำงานของอัลกอริทึม บทความนี้ถือว่าอินพุตระบุทุกช่องของกระดาน')}>
    <div className="pnp-board-sizes">{[5, 8, 12].map(size => <div key={size}><div className="pnp-mini-grid" aria-hidden="true" style={{ backgroundSize: `${100 / size}% ${100 / size}%` }} /><strong>{size} × {size}</strong><span>{size * size} {local(language, 'cells', 'ช่อง')}</span></div>)}</div>
  </DemoFrame>
}

export function DecisionFigure({ language }: LanguageProps) {
  return <DemoFrame title={local(language, 'The question and its evidence', 'คำถามกับหลักฐานของคำตอบ')} caption={local(language, 'For the opening board, one valid completion proves that the answer to the decision question is Yes.', 'สำหรับกระดานตอนต้น การมีวิธีวางที่ถูกต้องหนึ่งวิธีก็ยืนยันคำตอบ Yes ได้')}>
    <div className="pnp-concept-grid">
      <div className="pnp-concept-panel"><span className="pnp-small-label">Decision</span><p>{local(language, 'Can we complete this board?', 'เติมควีนให้ครบตามเงื่อนไขได้หรือไม่?')}</p><strong className="pnp-result"><Check size={18} aria-hidden="true" />Yes</strong></div>
      <div className="pnp-concept-panel"><span className="pnp-small-label">Certificate</span><p>{local(language, 'Here is one valid placement:', 'วิธีวางที่ใช้ยืนยันคำตอบ:')}</p><p className="pnp-coordinate-text">(1,1), (2,3), (3,5), (4,2), (5,4)</p></div>
    </div>
  </DemoFrame>
}

export function CertificateFigure({ language }: LanguageProps) {
  return <DemoFrame title={local(language, 'Give the verifier both inputs', 'Verifier ได้ข้อมูลสองส่วน')} caption={local(language, 'A certificate supplies a proposed completion. The verifier also needs the original board so it can check the fixed queens.', 'Certificate เสนอวิธีวาง แต่ verifier ต้องได้รับโจทย์เดิมด้วย เพื่อตรวจว่าควีนเริ่มต้นไม่ได้ถูกย้าย')}>
    <div className="pnp-concept-grid"><div className="pnp-concept-panel"><strong>{local(language, 'Original input', 'โจทย์เดิม')}</strong><p>N = 5</p><p>Fixed: (1,1), (3,5)</p></div><div className="pnp-concept-panel"><strong>Certificate</strong><p className="pnp-coordinate-text">(1,1), (2,3), (3,5), (4,2), (5,4)</p></div></div>
    <div className="pnp-verifier-flow"><ArrowDown size={22} aria-hidden="true" /><strong>Verifier</strong><span>{local(language, 'Check every condition', 'ตรวจทุกเงื่อนไข')}</span></div>
  </DemoFrame>
}

export function ClassRelationship({ language }: LanguageProps) {
  return <DemoFrame title={local(language, 'Known: P ⊆ NP. Unknown: equality.', 'สิ่งที่รู้แล้ว: P ⊆ NP สิ่งที่ยังไม่รู้: เท่ากันหรือไม่')} caption={local(language, 'These are two hypothetical possibilities, not two established facts. In either case, every problem in P is in NP.', 'เป็นภาพสองกรณีสมมติ ยังไม่ทราบว่ากรณีใดจริง แต่ทั้งสองกรณีมีทุกปัญหาใน P อยู่ใน NP')}>
    <div className="pnp-concept-grid">
      <div className="pnp-class-case"><strong>{local(language, 'If P = NP', 'กรณีที่ P = NP')}</strong><svg viewBox="0 0 270 180" role="img" aria-label={local(language, 'Hypothesis: P and NP are the same set', 'สมมติฐานว่า P และ NP เป็นเซตเดียวกัน')}><ellipse cx="135" cy="90" rx="112" ry="65" fill="#edf2e7" stroke="#31684a" strokeWidth="2" /><text x="135" y="98" textAnchor="middle" fill="#254c3b" fontSize="25">P = NP</text></svg></div>
      <div className="pnp-class-case"><strong>{local(language, 'If P ≠ NP', 'กรณีที่ P ≠ NP')}</strong><svg viewBox="0 0 270 180" role="img" aria-label={local(language, 'Hypothesis: P is a proper subset of NP', 'สมมติฐานว่า P เป็นส่วนย่อยแท้ของ NP')}><ellipse cx="135" cy="90" rx="112" ry="65" fill="#edf2e7" stroke="#31684a" strokeWidth="2" /><text x="186" y="78" textAnchor="middle" fill="#254c3b" fontSize="24">NP</text><ellipse cx="100" cy="100" rx="52" ry="36" fill="#f4e9e4" stroke="#873747" strokeWidth="2" /><text x="100" y="109" textAnchor="middle" fill="#873747" fontSize="25">P</text></svg></div>
    </div>
    <p className="pnp-feedback">{local(language, 'Neither possibility has been proved.', 'ยังไม่มีข้อพิสูจน์ว่ากรณีใดเป็นจริง')}</p>
  </DemoFrame>
}

export function ReductionFigure({ language }: LanguageProps) {
  const steps = [
    { label: local(language, 'Input of A', 'อินพุตของ A'), value: 'x' },
    { label: local(language, 'Polynomial-time transform', 'แปลงใน Polynomial time'), value: 'f' },
    { label: local(language, 'Input of B', 'อินพุตของ B'), value: 'f(x)' },
    { label: local(language, 'Algorithm for B', 'อัลกอริทึมแก้ B'), value: 'Yes / No' },
  ]
  return <DemoFrame title="A ≤p B" caption={local(language, 'For every input x of A, x is a Yes-instance of A if and only if f(x) is a Yes-instance of B. The transformation runs in polynomial time.', 'สำหรับทุกอินพุต x ของ A นั้น x ตอบ Yes ก็ต่อเมื่อ f(x) ของ B ตอบ Yes และการแปลงต้องใช้ Polynomial time')}>
    <ol className="pnp-reduction-flow">{steps.map((step, index) => <li key={step.value}><div><strong>{step.value}</strong><span>{step.label}</span></div>{index < steps.length - 1 && <ArrowRight className="pnp-reduction-arrow" size={20} aria-hidden="true" />}</li>)}</ol>
    <p className="pnp-feedback">{local(language, 'Use B’s answer as A’s answer. If B can be solved in polynomial time, this procedure also solves A in polynomial time.', 'นำคำตอบของ B มาเป็นคำตอบของ A ถ้าแก้ B ได้ใน Polynomial time ขั้นตอนรวมก็แก้ A ได้ใน Polynomial time')}</p>
  </DemoFrame>
}
