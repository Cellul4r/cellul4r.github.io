import { useId, useState } from 'react'
import { DemoFrame, local } from './DemoFrame'
import type { LanguageProps } from './DemoFrame'

const series = [
  { label: 'n', color: '#31684a', dash: undefined, value: (n: number) => n },
  { label: 'n²', color: '#873747', dash: '7 3', value: (n: number) => n ** 2 },
  { label: 'n³', color: '#805713', dash: '2 4', value: (n: number) => n ** 3 },
  { label: '2ⁿ', color: '#416384', dash: '10 3 2 3', value: (n: number) => 2 ** n },
]

export function GrowthChart({ language, variant = 'comparison' }: LanguageProps & { variant?: 'polynomial' | 'comparison' }) {
  const [n, setN] = useState(10)
  const [log, setLog] = useState(false)
  const id = useId()
  const visible = variant === 'polynomial' ? series.slice(0, 3) : [series[1], series[3]]
  const max = Math.max(...visible.map(item => item.value(20)))
  const x = (value: number) => 58 + value / 20 * 414
  const y = (value: number) => 240 - (log ? Math.log10(value) / Math.log10(max) : value / max) * 205
  const formatTick = (value: number) => new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
  const format = (value: number) => new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits: 0 }).format(value)
  return <DemoFrame title={local(language, 'How fast do these functions grow?', 'ฟังก์ชันเหล่านี้โตเร็วแค่ไหน?')} caption={local(language, 'Function values, not measured seconds or queen-solver timings. The horizontal axis is n; the vertical axis is the function value. Dashed lines and labels distinguish the curves without color alone.', 'เป็นค่าฟังก์ชันตัวอย่าง ไม่ใช่วินาทีหรือผลการรันตัวแก้ควีน แกนนอนคือ n แกนตั้งคือค่าฟังก์ชัน รูปแบบเส้นและชื่อช่วยแยกกราฟโดยไม่อาศัยสีอย่างเดียว')}>
    <label className="pnp-slider-label" htmlFor={id}>n = <strong>{n}</strong><input id={id} aria-label={local(language, 'Input size n', 'ขนาดข้อมูล n')} type="range" min="1" max="20" value={n} onChange={event => setN(Number(event.target.value))} /></label>
    <label className="pnp-checkbox"><input type="checkbox" checked={log} onChange={event => setLog(event.target.checked)} />{local(language, 'Use log scale on the vertical axis', 'ใช้สเกล log บนแกนตั้ง')}</label>
    <svg className="pnp-growth-chart" viewBox="0 0 500 290" role="img" aria-label={local(language, `Growth comparison at n=${n}, ${log ? 'logarithmic' : 'linear'} vertical scale`, `เปรียบเทียบการเติบโตที่ n=${n} แกนตั้งสเกล${log ? ' log' : 'เชิงเส้น'}`)}>
      {[0, .5, 1].map(fraction => {
        const value = log ? 10 ** (Math.log10(max) * fraction) : max * fraction
        return <g key={fraction}><line x1="58" x2="472" y1={240 - fraction * 205} y2={240 - fraction * 205} className="pnp-chart-grid" /><text x="51" y={245 - fraction * 205} textAnchor="end">{formatTick(value)}</text></g>
      })}
      <line x1="58" x2="58" y1="35" y2="240" className="pnp-chart-axis" />
      <line x1="58" x2="472" y1="240" y2="240" className="pnp-chart-axis" />
      {[0, 5, 10, 15, 20].map(value => <text key={value} x={x(value)} y="260" textAnchor="middle">{value}</text>)}
      <text x="475" y="281" textAnchor="end">n</text>
      <text x="58" y="19">{local(language, 'Function value', 'ค่าฟังก์ชัน')}{log ? ' (log)' : ''}</text>
      {visible.map(item => <g key={item.label}><polyline points={Array.from({ length: log ? 77 : 81 }, (_, i) => { const value = (log ? 1 : 0) + i / 4; return `${x(value)},${y(item.value(value))}` }).join(' ')} fill="none" stroke={item.color} strokeWidth="2.5" strokeDasharray={item.dash} /><circle cx={x(n)} cy={y(item.value(n))} r="5" fill={item.color} stroke="#fffdf6" strokeWidth="2" /></g>)}
      <line x1={x(n)} x2={x(n)} y1="35" y2="240" stroke="#647769" strokeDasharray="2 5" />
    </svg>
    <div className="pnp-growth-values" aria-live="polite">{visible.map(item => <div key={item.label}><span style={{ borderColor: item.color }}>{item.label}</span><strong>{format(item.value(n))}</strong></div>)}</div>
    <p className="pnp-small-note">{local(language, 'All curves remain readable as exact values above. A log scale changes the spacing, not the underlying numbers.', 'อ่านค่าตัวเลขของทุกเส้นได้ด้านบน สเกล log เปลี่ยนระยะห่างบนกราฟ ไม่ได้เปลี่ยนค่าของฟังก์ชัน')}</p>
  </DemoFrame>
}
