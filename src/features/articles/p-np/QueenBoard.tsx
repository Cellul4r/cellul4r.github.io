import { Crown, LockKeyhole } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { FIXED_QUEENS, samePosition } from './algorithms'
import type { Position } from './algorithms'
import { local } from './DemoFrame'
import type { LanguageProps } from './DemoFrame'

export function QueenBoard({ language, positions, highlighted = [], bad = [], onToggle }: LanguageProps & { positions: readonly Position[]; highlighted?: readonly Position[]; bad?: readonly Position[]; onToggle?: (position: Position) => void }) {
  const reduced = useReducedMotion()
  const cells = Array.from({ length: 25 }, (_, index) => {
    const row = Math.floor(index / 5) + 1, col = index % 5 + 1
    const position: Position = [row, col]
    const queen = positions.some(other => samePosition(position, other))
    const fixed = FIXED_QUEENS.some(other => samePosition(position, other))
    const invalid = bad.some(other => samePosition(position, other))
    const active = highlighted.some(other => samePosition(position, other))
    const label = `${local(language, 'Row', 'แถว')} ${row}, ${local(language, 'column', 'คอลัมน์')} ${col}${queen ? local(language, ', queen', ', มีควีน') : ''}${fixed ? local(language, ', fixed position', ', ตำแหน่งเริ่มต้น') : ''}${invalid ? local(language, ', conflict', ', ตำแหน่งขัดกัน') : ''}`
    const contents = <>
      <span className="pnp-cell-coordinate" aria-hidden="true">{row},{col}</span>
      {queen && <motion.span className="pnp-queen" initial={reduced ? false : { opacity: 0, scale: .75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .18 }}><Crown size={25} aria-hidden="true" />{fixed && <LockKeyhole className="pnp-fixed-icon" size={11} aria-hidden="true" />}</motion.span>}
      {invalid && <span className="pnp-conflict-mark" aria-hidden="true">!</span>}
    </>
    const className = `pnp-cell${(row + col) % 2 ? ' is-dark' : ''}${active ? ' is-highlighted' : ''}${invalid ? ' is-conflict' : ''}`
    return onToggle ? <button key={index} type="button" className={className} aria-label={label} aria-pressed={queen} aria-disabled={fixed} onClick={() => { if (!fixed) onToggle(position) }}>{contents}</button> : <div key={index} className={className} aria-hidden="true">{contents}</div>
  })
  const boardLabel = local(language, 'Five by five queen board', 'กระดานควีน 5 คูณ 5')
  return <div className="pnp-board" role={onToggle ? 'group' : 'img'} aria-label={onToggle ? boardLabel : `${boardLabel}: ${positions.map(position => `(${position})`).join(', ')}`}>{cells}</div>
}
