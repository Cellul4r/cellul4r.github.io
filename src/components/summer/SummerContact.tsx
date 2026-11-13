import { ArrowUpRight, Check, Copy, Mail, Scissors } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/portfolio'
import { useSummerMotion } from './SummerMotion'

export function SummerContact() {
  const { enabled } = useSummerMotion()
  const [lifted, setLifted] = useState(false)
  const [message, setMessage] = useState('')
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(reset.current), [])
  async function copyEmail() {
    clearTimeout(reset.current)
    try {
      await navigator.clipboard.writeText(profile.email)
      setMessage('Email copied. Say hello!')
    } catch {
      setMessage('Copy unavailable. Use “Send a hello” to email me.')
    }
    reset.current = setTimeout(() => setMessage(''), 4500)
  }
  return <section className="summer-contact" id="contact" aria-labelledby="summer-contact-title">
    <div className="summer-perforation" aria-hidden="true"><Scissors size={19} /><span>Keep in touch</span></div>
    <div className="summer-reply-underlay">
      <div className="summer-reply-slip" onMouseEnter={() => setLifted(true)} onMouseLeave={() => setLifted(false)} onFocusCapture={() => setLifted(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setLifted(false) }}>
        <motion.div className="summer-reply-paper" aria-hidden="true" animate={{ y: enabled && lifted ? -7 : 0, rotate: enabled && lifted ? -.35 : 0 }} transition={{ duration: enabled ? .25 : 0 }} />
        <div className="summer-reply-copy"><p className="summer-kicker">The next chapter could be ours</p><h2 id="summer-contact-title">Your next{' '}<br />teammate?</h2><p>I’m looking for an internship where I can contribute, ask good questions, and keep growing.</p><span className="summer-available-stamp">Open to internships</span></div>
        <address className="summer-reply-address">
          <div className="summer-reply-to"><span>To</span><strong>{profile.name}</strong><span className="summer-postmark" aria-hidden="true">Let’s<br />connect<svg viewBox="0 0 100 30" fill="none"><path d="M1 6q12-8 24 0t24 0t24 0t24 0M1 16q12-8 24 0t24 0t24 0t24 0M1 26q12-8 24 0t24 0t24 0t24 0" /></svg></span></div>
          <a className="summer-email" href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="summer-reply-actions"><a className="summer-button" href={`mailto:${profile.email}`}>Send a hello<Mail size={17} aria-hidden="true" /></a><button type="button" className="summer-copy" onClick={copyEmail} aria-label="Copy email address">{message.startsWith('Email copied') ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}Copy email</button></div>
          <p className="summer-copy-status" role="status">{message}</p>
          <div className="summer-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={15} aria-hidden="true" /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </address>
      </div>
    </div>
    <div className="summer-contact-end"><span>Thanks for spending a little time here.</span><span>End of this edition<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="3" /><path d="M9 0v3m0 12v3M0 9h3m12 0h3M2.6 2.6l2 2m8.8 8.8 2 2M2.6 15.4l2-2m8.8-8.8 2-2" /></svg></span></div>
  </section>
}
