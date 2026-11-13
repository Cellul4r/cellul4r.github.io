import { motion } from 'framer-motion'
import { useSummerMotion } from '../summer/SummerMotion'
import './ProjectArtwork.css'
import gameplay from '../../assets/projects/typing-vs-demon/play_menu.png'
import player from '../../assets/projects/typing-vs-demon/player-queen.png'

function RegistrationArtwork() {
  const { active: enabled } = useSummerMotion()
  return <svg viewBox="0 0 600 380" role="img" aria-label="Illustrated event registration: a calendar connected to confirmed and waitlist tickets">
    <circle cx="300" cy="190" r="150" fill="#edda9f" />
    <path d="M80 280Q48 170 150 96M464 108Q561 180 498 295" fill="none" stroke="#82926e" strokeWidth="1.5" strokeDasharray="5 8" />
    <g transform="rotate(-9 255 190)">
      <rect x="108" y="69" width="282" height="259" rx="12" fill="#b8c6ae" />
      <rect x="100" y="60" width="282" height="259" rx="12" fill="#fbf1d8" stroke="#566145" strokeWidth="2" />
      <path d="M112 60h258a12 12 0 0112 12v55H100V72a12 12 0 0112-12" fill="#e65b35" />
      {[151, 329].map(x => <path key={x} d={`M${x} 47v30`} stroke="#d7b56b" strokeWidth="9" strokeLinecap="round" />)}
      <text x="124" y="106" fill="#fbf1d8" fontSize="22" fontFamily="'DM Sans', sans-serif" fontWeight="600">noona</text>
      {Array.from({ length: 15 }, (_, i) => <rect key={i} x={125 + i % 5 * 47} y={153 + Math.floor(i / 5) * 47} width="30" height="30" rx="5" fill={[2, 7, 11].includes(i) ? '#66816a' : '#ecebdf'} />)}
      <path d="m223 210 7 7 14-16" stroke="#fbf1d8" strokeWidth="3" fill="none" />
    </g>
    <motion.g animate={enabled ? { y: [0, -9, 0], rotate: [2, -1, 2] } : { y: 0, rotate: 0 }} transition={{ duration: enabled ? 5 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }} style={{ transformOrigin: '440px 170px' }}>
      <rect x="355" y="143" width="186" height="71" rx="7" fill="#d5decb" />
      <rect x="348" y="136" width="186" height="71" rx="7" fill="#fffdf7" stroke="#64795b" strokeWidth="1.5" />
      <circle cx="375" cy="171" r="12" fill="#42694a" /><path d="m369 171 4 4 8-9" fill="none" stroke="#fbf1d8" strokeWidth="2" />
      <text x="397" y="177" fill="#2d2a22" fontSize="16" fontFamily="'DM Sans', sans-serif">CONFIRMED</text>
    </motion.g>
    <g transform="rotate(7 449 259)"><rect x="370" y="231" width="159" height="58" rx="6" fill="#f4e4cb" stroke="#b5985c" strokeWidth="1.5" /><text x="400" y="266" fill="#795e29" fontSize="15" fontFamily="'DM Sans', sans-serif">WAITLIST</text></g>
  </svg>
}

function FinancialArtwork() {
  const { active: enabled } = useSummerMotion()
  return <svg viewBox="0 0 600 380" role="img" aria-label="Illustrated financial tool calling: a question flows to a calculator through ToolExecutor">
    <circle cx="310" cy="186" r="146" fill="#e7c8a0" />
    <g transform="rotate(8 384 196)">
      <rect x="302" y="72" width="181" height="255" rx="18" fill="#bda789" />
      <rect x="294" y="64" width="181" height="255" rx="18" fill="#566145" stroke="#404c33" strokeWidth="2" />
      <rect x="316" y="87" width="137" height="56" rx="6" fill="#d6dfbe" />
      <text x="432" y="124" textAnchor="end" fill="#566145" fontFamily="'IBM Plex Mono', monospace" fontSize="22">f(x)</text>
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={317 + i % 3 * 47} y={163 + Math.floor(i / 3) * 34} width="35" height="23" rx="5" fill={i === 11 ? '#d2ad65' : '#f3eddf'} />)}
    </g>
    <motion.g animate={enabled ? { y: [0, -8, 0], rotate: [-4, -1, -4] } : { y: 0, rotate: 0 }} transition={{ duration: enabled ? 5.5 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }}>
      <path d="M94 101h194a12 12 0 0112 12v57a12 12 0 01-12 12H137l-27 23v-23H94a12 12 0 01-12-12v-57a12 12 0 0112-12Z" fill="#fbf1d8" stroke="#a38170" strokeWidth="1.5" />
      <text x="106" y="135" fill="#e65b35" fontSize="17" fontFamily="'DM Sans', sans-serif">A financial question</text><path d="M106 154h145" stroke="#d9c8b5" strokeWidth="5" strokeLinecap="round" />
    </motion.g>
    <path d="M155 227q-22 55 57 55h56" stroke="#a38170" strokeWidth="2" fill="none" strokeDasharray="5 6" /><path d="m258 275 12 7-12 7" stroke="#a38170" strokeWidth="2" fill="none" />
    <g transform="rotate(-5 203 276)"><rect x="87" y="250" width="208" height="53" rx="7" fill="#e65b35" /><text x="191" y="283" textAnchor="middle" fill="#fbf1d8" fontSize="18" fontFamily="'IBM Plex Mono', monospace">ToolExecutor</text></g>
  </svg>
}

export function ProjectArtwork({ slug }: { slug: string }) {
  const { active: enabled } = useSummerMotion()
  if (slug === 'noona-appointment') return <div className="work-art work-art-noona"><RegistrationArtwork /><span className="work-art-caption">Event registration · Concept illustration</span></div>
  if (slug === 'llm-financial-advisor') return <div className="work-art work-art-finance"><FinancialArtwork /><span className="work-art-caption">Function calling · Concept illustration</span></div>
  return <div className="work-art work-art-game">
    <div className="game-window"><div className="game-window-bar" aria-hidden="true"><i /><i /><i /><span>Typing VS Demon</span></div><img src={gameplay} alt="Typing VS Demon gameplay with five lanes and word-labelled enemies" loading="lazy" /></div>
    <motion.img className="game-player-sticker" src={player} width={32} height={32} alt="" aria-hidden="true" animate={enabled ? { y: [0, -14, 0], rotate: [-5, 5, -5] } : { y: 0, rotate: 0 }} transition={{ duration: enabled ? 3.5 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }} />
    <span className="work-art-caption">Java · Actual gameplay</span>
  </div>
}
