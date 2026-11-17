import { motion } from 'framer-motion'
import { useSummerMotion } from '../summer/SummerMotion'
import './ProjectArtwork.css'
import gameplay from '../../assets/projects/typing-vs-demon/play_menu.png'
import player from '../../assets/projects/typing-vs-demon/player-queen.png'
import financeStart from '../../assets/projects/llm-financial-advisor/start-screen.png'
import calculator from '../../assets/projects/llm-financial-advisor/calculator.svg'

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

export function ProjectArtwork({ slug }: { slug: string }) {
  const { active: enabled } = useSummerMotion()
  if (slug === 'noona-appointment') return <div className="work-art work-art-noona"><RegistrationArtwork /><span className="work-art-caption">Event registration · Concept illustration</span></div>
  if (slug === 'llm-financial-advisor') return <div className="work-art work-art-finance">
    <div className="game-window"><div className="game-window-bar" aria-hidden="true"><i /><i /><i /><span>Financial Advisor</span></div><img src={financeStart} alt="Financial Advisor start screen with category shortcuts, suggested questions, and a chat input" loading="lazy" /></div>
    <motion.img className="finance-calculator-sticker" src={calculator} width={164} height={168} alt="" aria-hidden="true" animate={enabled ? { y: [0, -10, 0], rotate: [6, -2, 6] } : { y: 0, rotate: 0 }} transition={{ duration: enabled ? 4 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }} />
    <span className="work-art-caption">Python · Streamlit · Actual interface</span>
  </div>
  return <div className="work-art work-art-game">
    <div className="game-window"><div className="game-window-bar" aria-hidden="true"><i /><i /><i /><span>Typing VS Demon</span></div><img src={gameplay} alt="Typing VS Demon gameplay with five lanes and word-labelled enemies" loading="lazy" /></div>
    <motion.img className="game-player-sticker" src={player} width={32} height={32} alt="" aria-hidden="true" animate={enabled ? { y: [0, -14, 0], rotate: [-5, 5, -5] } : { y: 0, rotate: 0 }} transition={{ duration: enabled ? 3.5 : 0, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }} />
    <span className="work-art-caption">Java · Actual gameplay</span>
  </div>
}
