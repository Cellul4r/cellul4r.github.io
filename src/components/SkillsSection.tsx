import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cloudSkillGroups, technicalSkillGroups, workingSkills } from '../data/skills'
import { revealVariants, ScrollReveal } from './ScrollReveal'
import { CloudFlow } from './CloudFlow'
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
          <p className="eyebrow">Skills & current learning</p>
          <h2 id="skills-title"><motion.span className="skills-heading-line" variants={headingLine}>What I bring.</motion.span>{' '}<motion.em className="skills-heading-line" variants={headingLine}>Where I’m growing.</motion.em></h2>
        </ScrollReveal>

        <div className="skills-rows">
          <ScrollReveal as="section" className="skills-panel skills-technical" aria-labelledby="technical-skills-title" distance={20} duration={.5} stagger={.06} amount={.08}>
            <motion.p className="skills-status" variants={item}>Practiced & Studied</motion.p>
            <motion.h3 id="technical-skills-title" variants={item}>Technical skills</motion.h3>
            <motion.dl className="skills-groups" variants={categories}>
              {technicalSkillGroups.map(group => (
                <motion.div className="skills-category" key={group.title} variants={item}>
                  <dt>{group.title}</dt>
                  <dd>{group.items.join(' · ')}</dd>
                </motion.div>
              ))}
            </motion.dl>
            <Link className="skills-link" to="/projects">Explore the projects <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <motion.span className="skills-border-accent" aria-hidden="true" variants={{ hidden: { scaleX: reducedMotion ? 1 : 0, opacity: 0 }, visible: { scaleX: 1, opacity: .55, transition: { duration: reducedMotion ? 0 : .5, delay: reducedMotion ? 0 : .9 } } }} />
          </ScrollReveal>

          <ScrollReveal as="section" className="skills-panel skills-learning" aria-labelledby="learning-skills-title" distance={18} duration={.5} stagger={.08}>
            <motion.div className="skills-learning-heading" variants={item}>
              <p className="skills-status">Currently developing</p>
              <h3 id="learning-skills-title">Cloud engineering</h3>
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
            <CloudFlow reducedMotion={reducedMotion} />
          </ScrollReveal>
        </div>

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
