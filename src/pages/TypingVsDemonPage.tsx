import { ArrowDown, ArrowLeft, ArrowUpRight, CodeXml, Keyboard, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '../components/ScrollReveal'
import { CaseStudyFigure } from '../components/projects/CaseStudyFigure'
import { GameStateDiagram, WordObjectDiagram } from '../components/projects/TypingVsDemonDiagrams'
import { typingVsDemon as project, typingVsDemonMedia as media } from '../data/typingVsDemon'
import './TypingVsDemonPage.css'

export function TypingVsDemonPage() {
  return (
    <article className="tvd-case-study">
      <header className="tvd-hero">
        <div className="container">
          <Link className="tvd-back" to="/projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>
          <div className="tvd-hero-copy">
            <div>
              <p className="eyebrow"><Keyboard size={16} aria-hidden="true" /> {project.eyebrow}</p>
              <h1>Typing<br /><span>VS Demon.</span></h1>
            </div>
            <div className="tvd-hero-summary">
              <p>{project.description}</p>
              <div className="tvd-actions">
                <a className="button button-primary" href={project.playUrl} target="_blank" rel="noopener noreferrer" aria-describedby="tvd-play-note"><Play size={18} aria-hidden="true" /> Play game <ArrowUpRight size={16} aria-hidden="true" /></a>
                <a className="button button-quiet" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><CodeXml size={18} aria-hidden="true" /> View source <ArrowUpRight size={16} aria-hidden="true" /></a>
                <a className="tvd-text-link" href="#tvd-engineering">The design decisions <ArrowDown size={16} aria-hidden="true" /></a>
              </div>
              <p className="tvd-play-note" id="tvd-play-note">{project.playNote}</p>
            </div>
          </div>
          <dl className="tvd-facts">{project.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          <CaseStudyFigure media={media.gameplay} priority className="tvd-gameplay" />
        </div>
      </header>

      <nav className="tvd-outline" aria-label="In this case study">
        <div className="container">{project.navigation.map((item, index) => <a key={item.id} href={`#${item.id}`}><span aria-hidden="true">0{index + 1}</span>{item.label}</a>)}</div>
      </nav>

      <div className="container tvd-content">
        <ScrollReveal as="section" id="tvd-story" className="tvd-section tvd-story" aria-labelledby="tvd-story-title">
          <div className="tvd-prose">
            <p className="eyebrow">01 / The idea</p>
            <h2 id="tvd-story-title">Why a typing game?</h2>
            {project.story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="tvd-story-media">
            <CaseStudyFigure media={media.mainMenu} />
            <CaseStudyFigure media={media.tutorial} />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" id="tvd-contributions" className="tvd-section" aria-labelledby="tvd-contributions-title">
          <div className="tvd-section-heading"><p className="eyebrow">02 / My contribution</p><h2 id="tvd-contributions-title">What I worked on.</h2></div>
          <div className="tvd-contribution-grid">
            {project.contributions.map((contribution, index) => (
              <div className="tvd-contribution" key={contribution.title}>
                <span className="tvd-small-index" aria-hidden="true">0{index + 1}</span>
                <h3>{contribution.title}</h3>
                <p>{contribution.description}</p>
                <ul>{contribution.items.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <p className="tvd-team-credit"><strong>Team credits.</strong> {project.teamCredit}</p>
        </ScrollReveal>

        <section id="tvd-engineering" className="tvd-section tvd-engineering" aria-labelledby="tvd-engineering-title">
          <ScrollReveal className="tvd-section-heading"><p className="eyebrow">03 / Engineering</p><h2 id="tvd-engineering-title">Gameplay &<br /><em>software design.</em></h2></ScrollReveal>
          <ScrollReveal as="section" className="tvd-wave" aria-labelledby="tvd-wave-title">
            <div className="tvd-wave-intro"><p className="tvd-decision-label">Implementation spotlight / Wave</p><h3 id="tvd-wave-title">{project.wave.title}</h3><p>{project.wave.intro}</p></div>
            <ul className="tvd-wave-points" aria-label="Wave implementation details">
              {project.wave.points.map(point => (
                <li className="tvd-wave-point" key={point.title}>
                  <div className="tvd-wave-point-heading">
                    <h4>{point.title}</h4>
                    <a className="tvd-wave-code" href={point.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View source for ${point.title} (new tab)`}><code>{point.code}</code><ArrowUpRight size={13} aria-hidden="true" /></a>
                  </div>
                  <p>{point.detail}</p>
                </li>
              ))}
            </ul>
            <div className="tvd-wave-sources">{project.wave.sources.map(source => <a className="tvd-text-link" key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}</div>
          </ScrollReveal>
          <ScrollReveal as="section" className="tvd-decision" aria-labelledby="tvd-words-title">
            <div className="tvd-prose">
              <p className="tvd-decision-label">Sharing behavior / WordObject</p>
              <h3 id="tvd-words-title">{project.wordDesign.title}</h3>
              {project.wordDesign.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <a className="tvd-text-link" href={project.wordDesign.sourceUrl} target="_blank" rel="noopener noreferrer">{project.wordDesign.sourceLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <WordObjectDiagram />
          </ScrollReveal>
          <ScrollReveal as="section" className="tvd-decision tvd-decision-states" aria-labelledby="tvd-states-title">
            <div className="tvd-prose">
              <p className="tvd-decision-label">Organizing screens / GameState</p>
              <h3 id="tvd-states-title">{project.stateDesign.title}</h3>
              {project.stateDesign.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <p className="tvd-attribution">{project.stateDesign.attribution}</p>
              <a className="tvd-text-link" href={project.stateDesign.sourceUrl} target="_blank" rel="noopener noreferrer">{project.stateDesign.sourceLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <GameStateDiagram />
          </ScrollReveal>
        </section>

        <ScrollReveal as="section" id="tvd-players" className="tvd-section" aria-labelledby="tvd-players-title">
          <div className="tvd-section-heading"><p className="eyebrow">04 / Beyond the classroom</p><h2 id="tvd-players-title">Letting other people play.</h2></div>
          <div className="tvd-player-grid">
            <CaseStudyFigure media={media.showcase} className="tvd-showcase" />
            <div className="tvd-feedback">
              {project.feedback.map(item => <div key={item.label}><h3>{item.label}</h3><p>{item.text}</p></div>)}
            </div>
          </div>
          <p className="tvd-takeaway">{project.takeaway}</p>
        </ScrollReveal>

        <ScrollReveal as="section" id="tvd-next" className="tvd-section" aria-labelledby="tvd-next-title">
          <div className="tvd-section-heading"><p className="eyebrow">05 / Looking ahead</p><h2 id="tvd-next-title">What I’d improve next.</h2><p className="tvd-section-intro">The next changes I’d make to the codebase.</p></div>
          <div className="tvd-improvements">{project.improvements.map((item, index) => <div key={item.title} data-feedback="surface"><span className="tvd-small-index" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></div>)}</div>
        </ScrollReveal>

        <footer className="tvd-closing">
          <div className="tvd-closing-top"><div><p className="eyebrow">Explore the implementation</p><h2>The code behind the kingdom.</h2></div><a className="button button-primary" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><CodeXml size={18} aria-hidden="true" /> View source <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          <div className="tvd-resources"><h3>Learning resources & inspiration</h3>{project.resources.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer"><span>{resource.detail}</span>{resource.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}</div>
          <Link className="tvd-back" to="/projects"><ArrowLeft size={16} aria-hidden="true" /> Back to projects</Link>
        </footer>
      </div>
    </article>
  )
}
