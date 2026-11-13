import { ArrowUpRight, Check, Copy, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/portfolio'
import { SeasonalFoliage } from '../decorations/SeasonalFoliage'
import { HomeReveal, useHomeMotion } from './HomeMotion'
import githubLogo from '../../assets/brands/github.svg'
import linkedinLogo from '../../assets/brands/linkedin.png'

export function HomeContact() {
  const { enabled } = useHomeMotion()
  const [opened, setOpened] = useState(false)
  const [copyState, setCopyState] = useState('')
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(reset.current), [])

  async function copyEmail() {
    clearTimeout(reset.current)
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState('Email copied')
    } catch {
      setCopyState('Please use the email link to get in touch.')
    }
    reset.current = setTimeout(() => setCopyState(''), 3500)
  }

  return <section className="home-contact home-section" id="contact" aria-labelledby="home-contact-title">
    <HomeReveal className="container home-contact-scene">
      <SeasonalFoliage variant="full" className="home-contact-foliage" />
      <div className="home-contact-copy"><p className="home-handwritten">Good things start with a hello.</p><h2 id="home-contact-title">Let’s make{' '}<br />something happen.</h2><p>An internship, a project, or a good conversation.<br />There’s room for the next chapter.</p><p className="home-contact-availability"><span aria-hidden="true" />Currently open to internships</p></div>
      <div className="home-postcard">
        <div className="home-postcard-top"><span>A note to Theerada</span><span className="home-postage" aria-hidden="true">TS<span>✦</span></span></div>
        <a className="home-envelope" href={`mailto:${profile.email}`} aria-label={`Email Theerada Siri at ${profile.email}`} onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)} onFocus={() => setOpened(true)} onBlur={() => setOpened(false)}>
          <svg viewBox="0 0 360 245" fill="none" aria-hidden="true" focusable="false">
            <ellipse cx="180" cy="224" rx="132" ry="12" fill="#5e4839" opacity=".08" />
            <path d="M49 86 180 13 311 86v125H49Z" fill="#c8b18a" stroke="#a68a61" strokeWidth="1.5" />
            <motion.g animate={{ y: opened ? -31 : 0, rotate: opened ? -2 : 0 }} transition={{ duration: enabled ? .35 : 0, ease: 'easeOut' }} style={{ transformOrigin: '180px 150px' }}>
              <rect x="70" y="50" width="220" height="147" rx="3" fill="#fffdf6" stroke="#ded3bb" />
              <text x="94" y="90" fontSize="25" fill="#873747" fontFamily="Caveat, cursive">Hello, Theerada!</text>
              <path d="M95 111h165M95 127h150M95 143h100" stroke="#ded9c9" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            <path d="M49 86 180 167 311 86v125H49Z" fill="#e5d3b2" stroke="#b69a6c" strokeWidth="1.5" />
            <path d="m49 211 111-81q20-14 40 0l111 81" fill="#efdfc2" stroke="#c5aa7f" strokeWidth="1.5" />
            <circle cx="180" cy="166" r="21" fill="#873747" /><path d="m172 166 6 6 11-13" stroke="#e9c989" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="home-envelope-action">Send a hello<Send size={17} aria-hidden="true" /></span>
        </a>
        <address><span className="home-contact-email">{profile.email}</span><button className="home-copy-email" type="button" onClick={copyEmail} aria-label="Copy email address">{copyState === 'Email copied' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}</button></address>
        <p className="home-copy-status" role="status">{copyState}</p>
        <div className="home-postcard-socials"><a href={profile.github} target="_blank" rel="noreferrer"><img src={githubLogo} width={18} height={18} alt="" />GitHub<ArrowUpRight size={14} aria-hidden="true" /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><img src={linkedinLogo} width={18} height={18} alt="" />LinkedIn<ArrowUpRight size={14} aria-hidden="true" /></a></div>
      </div>
    </HomeReveal>
  </section>
}
