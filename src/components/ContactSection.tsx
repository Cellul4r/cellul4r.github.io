import { ArrowUpRight, Mail } from 'lucide-react'
import githubLogo from '../assets/brands/github.svg'
import linkedinLogo from '../assets/brands/linkedin.png'
import { profile } from '../data/portfolio'
import { ScrollReveal } from './ScrollReveal'
import { EvergreenSprig } from './decorations/EvergreenSprig'
import './ContactSection.css'

export function ContactSection() {
  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <ScrollReveal className="contact-board contact-grid">
          <span className="contact-fasteners" aria-hidden="true" />
          <EvergreenSprig className="contact-sprig" />
          <div className="contact-copy">
            <p className="eyebrow">Get in touch</p>
            <h2 id="contact-title">Let’s build<br /><em>something.</em></h2>
            <p>Have a project in mind, an interesting opportunity, or a technical idea to share? I’d love to hear from you.</p>
          </div>
          <address className="contact-links">
            <a className="contact-email" href={`mailto:${profile.email}`}>
              <Mail size={23} aria-hidden="true" />
              <span><small>Say hello</small><strong>{profile.email}</strong></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <img src={githubLogo} width={22} height={22} alt="" aria-hidden="true" />
              <span><small>Explore my code</small><strong>GitHub / Cellul4r</strong></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <img src={linkedinLogo} width={22} height={22} alt="" aria-hidden="true" />
              <span><small>Let’s connect</small><strong>LinkedIn / Theerada Siri</strong></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </address>
        </ScrollReveal>
      </div>
    </section>
  )
}
