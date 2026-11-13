import { motion } from 'framer-motion'
import { useSummerScene } from './SummerMotion'

export function NoonaIllustration() {
  const { ref, moving } = useSummerScene()
  return <div className="summer-noona-art" ref={ref}>
    <svg viewBox="0 0 640 440" role="img" aria-label="Concept illustration of Noona: a session calendar with confirmed and waitlist registration tickets">
      <ellipse cx="320" cy="382" rx="230" ry="22" fill="#2d2a22" opacity=".07" />
      <circle cx="320" cy="210" r="176" fill="#f3c54d" opacity=".45" />
      <path d="M95 137q-53 97 17 173M533 126q67 116-9 185" fill="none" stroke="#aa8a53" strokeWidth="1.5" strokeDasharray="4 8" />
      <g transform="rotate(-9 263 217)">
        <rect x="106" y="77" width="290" height="287" rx="5" fill="#b99963" />
        <rect x="98" y="68" width="290" height="287" rx="5" fill="#fbf1d8" stroke="#2d2a22" strokeWidth="2" />
        <path d="M103 68h280a5 5 0 015 5v70H98V73a5 5 0 015-5Z" fill="#e65b35" />
        <text x="122" y="122" fill="#2d2a22" fontSize="36" fontWeight="600" fontFamily="Fraunces, Georgia, serif">noona.</text>
        <path d="M153 53v29m181-29v29" stroke="#2d2a22" strokeWidth="8" strokeLinecap="round" />
        {Array.from({ length: 15 }, (_, index) => <rect key={index} x={122 + index % 5 * 49} y={171 + Math.floor(index / 5) * 49} width="32" height="32" rx="3" fill={[2, 7, 11].includes(index) ? '#566145' : '#e6d7b5'} />)}
        <path d="m225 235 7 7 15-18" fill="none" stroke="#fbf1d8" strokeWidth="3" />
        <path d="M122 331h110" stroke="#baab88" strokeWidth="2" />
      </g>
      <motion.g initial={false} animate={moving ? { x: [24, 0, 0, 24], y: [-20, 0, 0, -20], rotate: [3, -2, -2, 3] } : { x: 0, y: 0, rotate: -2 }} transition={{ duration: moving ? 8 : 0, times: [0, .22, .8, 1], repeat: moving ? Infinity : 0, ease: 'easeInOut' }} style={{ transformOrigin: '470px 195px' }}>
        <path d="M350 151h228v26a11 11 0 000 22v26H350v-26a11 11 0 000-22Z" fill="#ad9b6e" />
        <path d="M343 143h228v26a11 11 0 000 22v26H343v-26a11 11 0 000-22Z" fill="#566145" stroke="#2d2a22" strokeWidth="1.5" />
        <path d="M387 148v64" stroke="#d6d5ae" strokeDasharray="3 4" />
        <path d="m357 179 6 6 12-13" fill="none" stroke="#fbf1d8" strokeWidth="2.5" />
        <text x="402" y="187" fill="#fbf1d8" fontSize="17" fontWeight="600" fontFamily="'DM Sans', sans-serif">CONFIRMED</text>
      </motion.g>
      <g transform="rotate(8 465 299)"><path d="M371 266h187v25a9 9 0 000 18v25H371v-25a9 9 0 000-18Z" fill="#fbf1d8" stroke="#a98b57" strokeWidth="1.5" /><path d="M406 271v58" stroke="#c6af7e" strokeDasharray="3 4" /><text x="422" y="307" fill="#6e542c" fontSize="16" fontFamily="'DM Sans', sans-serif">WAITLIST</text></g>
      <g fill="none" stroke="#9e5d2c" strokeWidth="2"><path d="M511 73v26m-13-13h26M79 325v18m-9-9h18" /><circle cx="537" cy="351" r="5" /></g>
    </svg>
    <p className="summer-art-caption">A session, a seat, a little order.<span>Concept illustration</span></p>
  </div>
}
