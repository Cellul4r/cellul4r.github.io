import { ArrowUpRight, CodeXml } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cloudSkillGroups, foundationSkillGroups, toolkitSkillGroups, workingSkills } from '../data/skills'
import { revealVariants, ScrollReveal } from './ScrollReveal'
import { TechBadge } from './TechBadge'
import './SkillsSection.css'

export function SkillsSection() {
  const reducedMotion = !!useReducedMotion() || typeof IntersectionObserver === 'undefined'
  const item = revealVariants({ distance: 10, duration: .4, reducedMotion })
  const headingLine = revealVariants({ distance: 14, duration: .6, reducedMotion })
  const categories = revealVariants({ distance: 0, fade: false, stagger: .07, reducedMotion })

  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <ScrollReveal as="header" className="skills-heading" distance={0} fade={false} stagger={.1}>
          <p className="eyebrow">Skills & learning</p>
          <motion.h2 id="skills-title" variants={headingLine}>What I bring.</motion.h2>
          <p className="skills-intro">A practical toolkit, with room to keep growing.</p>
        </ScrollReveal>

        <div className="skills-main-grid">
          <ScrollReveal as="section" className="skills-panel skills-technical" data-feedback="surface" aria-labelledby="technical-skills-title" distance={20} duration={.5} stagger={.06} amount={.08}>
            <motion.h3 id="technical-skills-title" className="skills-toolkit-title" variants={item}><CodeXml size={22} aria-hidden="true" />My Skills</motion.h3>
            <motion.dl className="skills-groups" variants={categories}>
              {toolkitSkillGroups.map(group => (
                <motion.div className="skills-category" key={group.title} variants={item}>
                  <dt>{group.title}</dt>
                  <dd><ul className="skills-tags">{group.items.map(skill => <li key={skill}><TechBadge>{skill}</TechBadge></li>)}</ul></dd>
                </motion.div>
              ))}
            </motion.dl>
          </ScrollReveal>

          <ScrollReveal as="section" className="skills-panel skills-learning" data-feedback="surface" aria-labelledby="learning-skills-title" distance={18} duration={.5} stagger={.08}>
            <motion.div className="skills-learning-heading" variants={item}>
              <p className="skills-status"><span aria-hidden="true" />Currently developing</p>
              <h3 id="learning-skills-title">Where I’m growing.</h3>
              <p className="skills-learning-intro">Building deeper hands-on experience with cloud infrastructure, deployment, and automation.</p>
            </motion.div>
            <motion.dl className="skills-groups" variants={categories}>
              {cloudSkillGroups.map(group => (
                <motion.div className="skills-category" key={group.title} variants={item}>
                  <dt>{group.title}</dt>
                  <dd>{group.items.join(' · ')}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </ScrollReveal>
        </div>

        <ScrollReveal as="section" className="skills-foundations" aria-labelledby="skills-foundations-title" distance={12}>
          <header className="skills-foundations-heading"><h3 id="skills-foundations-title">Engineering foundations</h3><p>Explore an area</p></header>
          <div className="skills-foundations-grid">
            {foundationSkillGroups.map((group, index) => (
              <details className="skills-foundation" key={group.title} open={index === 0}>
                <summary>{group.title}<span className="skills-disclosure-icon" aria-hidden="true" /></summary>
                <p>{group.items.join(' · ')}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>

        <div className="skills-explore"><p>See how these skills come together.</p><Link className="skills-link" to="/projects">Explore the projects <ArrowUpRight size={16} aria-hidden="true" /></Link></div>

        <section className="working-skills" aria-labelledby="working-skills-title">
          <ScrollReveal distance={0} fade={false}>
            <motion.h3 id="working-skills-title" variants={headingLine}>How I work with others</motion.h3>
          </ScrollReveal>
          <ScrollReveal className="working-skills-grid" distance={0} fade={false} stagger={.1}>
            {workingSkills.map(skill => (
              <motion.article key={skill.title} variants={item}>
                <h4>{skill.title}</h4>
                <p>{skill.evidence}</p>
                <Link className="skills-link" to={skill.to}>{skill.linkLabel} <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </motion.article>
            ))}
          </ScrollReveal>
        </section>
      </div>
    </section>
  )
}
