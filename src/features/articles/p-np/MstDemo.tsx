import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { kruskalTrace, MST_EDGES, MST_NODES } from './algorithms'
import { DemoFrame, local, StepControls } from './DemoFrame'
import type { LanguageProps } from './DemoFrame'

const trace = kruskalTrace()
export function MstDemo({ language }: LanguageProps) {
  const [step, setStep] = useState(0)
  const [threshold, setThreshold] = useState(7)
  const reduced = useReducedMotion()
  const current = step > 0 ? trace[step - 1] : undefined
  const total = current?.total || 0
  return <DemoFrame title={local(language, 'Build a minimum spanning tree', 'ลองหา Minimum Spanning Tree')} caption={local(language, 'Kruskal processes edges by increasing weight, skipping any edge that forms a cycle. The completed tree has weight 7; only then is the threshold question answered.', 'Kruskal พิจารณาเส้นตามน้ำหนักจากน้อยไปมาก และข้ามเส้นที่ทำให้เกิด cycle ต้นไม้ที่เสร็จแล้วมีน้ำหนักรวม 7 จึงนำมาตอบคำถามเทียบกับ K ได้')}>
    <div className="pnp-two-column">
      <svg viewBox="0 0 350 270" className="pnp-mst-graph" role="img" aria-label={local(language, 'Graph with A-B 1, B-C 2, A-C 3, C-D 4, A-D 7', 'กราฟ A-B น้ำหนัก 1, B-C 2, A-C 3, C-D 4, A-D 7')}>
        {MST_EDGES.map(edge => {
          const a = MST_NODES.find(node => node.id === edge.a)!, b = MST_NODES.find(node => node.id === edge.b)!
          const visited = trace.slice(0, step).find(entry => entry.a === edge.a && entry.b === edge.b)
          const chosen = visited?.selected
          const skipped = visited && !visited.selected
          const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2
          return <g key={`${edge.a}${edge.b}`}><motion.line x1={a.x} y1={a.y} x2={b.x} y2={b.y} animate={{ stroke: chosen ? '#31684a' : skipped ? '#873747' : '#b7c5aa', strokeWidth: chosen ? 5 : 2 }} transition={{ duration: reduced ? 0 : .22 }} strokeDasharray={skipped ? '6 5' : undefined} /><rect x={cx - 13} y={cy - 12} width="26" height="24" rx="5" fill="#fffdf6" /><text x={cx} y={cy + 5} textAnchor="middle" fill="#254c3b">{edge.weight}</text>{skipped && <text x={cx + 20} y={cy + 5} fill="#873747">×</text>}</g>
        })}
        {MST_NODES.map(node => <g key={node.id}><circle cx={node.x} cy={node.y} r="21" fill="#fffdf6" stroke="#31684a" strokeWidth="2" /><text x={node.x} y={node.y + 6} textAnchor="middle" fill="#254c3b" fontWeight="600">{node.id}</text></g>)}
      </svg>
      <div className="pnp-explanation">
        <p className="pnp-metric">{total}<span>{local(language, 'current total weight', 'ผลรวมน้ำหนักตอนนี้')}</span></p>
        <div className="pnp-choice-row" role="group" aria-label={local(language, 'Threshold K', 'ค่า K')}>{[7, 6].map(value => <button type="button" key={value} aria-pressed={threshold === value} onClick={() => setThreshold(value)}>K = {value}</button>)}</div>
        <div className={`pnp-feedback${current?.complete ? ' is-success' : ''}`} role="status">
          {current ? <>{current.a}-{current.b}: {current.selected ? local(language, 'keep this edge', 'เลือกเส้นนี้') : local(language, 'skip: it creates a cycle', 'ข้าม เพราะทำให้เกิด cycle')}{current.complete && <strong><br />{total} ≤ {threshold}? {total <= threshold ? 'Yes' : 'No'}</strong>}</> : local(language, 'Start with the smallest edge: A-B, weight 1.', 'เริ่มจากเส้นที่น้ำหนักน้อยที่สุด A-B น้ำหนัก 1')}
        </div>
      </div>
    </div>
    <StepControls language={language} step={step} total={trace.length} onStep={setStep} />
    <details className="pnp-static-answer"><summary>{local(language, 'Read the completed result', 'อ่านผลลัพธ์ที่เสร็จแล้ว')}</summary><p>A-B (1) + B-C (2) + C-D (4) = 7. K = 7: Yes. K = 6: No.</p><p>{local(language, 'A-C is skipped because A, B, C would form a cycle. Since even the minimum total is 7, no spanning tree has weight at most 6.', 'ข้าม A-C เพราะ A, B, C จะเกิด cycle เมื่อน้ำหนักรวมน้อยที่สุดยังเท่ากับ 7 จึงไม่มี Spanning Tree ที่น้ำหนักไม่เกิน 6')}</p></details>
  </DemoFrame>
}
