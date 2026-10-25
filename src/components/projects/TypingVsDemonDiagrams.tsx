import { typingVsDemon } from '../../data/typingVsDemon'

export function WordObjectDiagram() {
  return (
    <figure className="tvd-diagram" data-feedback="surface" role="img" aria-label="Simplified inheritance hierarchy: Entity is the parent of Player and WordObject. WordObject is the parent of Enemy and Item. Word generation and label rendering are shared by enemies and items.">
      <figcaption><span className="tvd-diagram-dot" /> Shared word behavior <span>01 / OOP</span></figcaption>
      <div className="tvd-tree" aria-hidden="true">
        <div className="tvd-diagram-node tvd-tree-root"><code>Entity</code></div>
        <div className="tvd-tree-level">
          <div className="tvd-tree-branch"><div className="tvd-diagram-node"><code>Player</code></div></div>
          <div className="tvd-tree-branch">
            <div className="tvd-diagram-node tvd-node-highlight"><code>WordObject</code><small>Words & labels</small></div>
            <div className="tvd-tree-level tvd-tree-children">
              <div className="tvd-tree-branch"><div className="tvd-diagram-node"><code>Enemy</code></div></div>
              <div className="tvd-tree-branch"><div className="tvd-diagram-node"><code>Item</code></div></div>
            </div>
          </div>
        </div>
      </div>
      <p className="tvd-diagram-note">A shared abstraction for words. Individual classes keep their own behavior.</p>
    </figure>
  )
}

export function GameStateDiagram() {
  return (
    <figure className="tvd-diagram tvd-state-diagram" data-feedback="surface" role="img" aria-label="GameStateManager holds a current GameState. Named classes implement GameState for the main menu, tutorial, difficulty selection, playing, pausing, and game over. This diagram shows responsibilities, not a sequence of transitions.">
      <figcaption><span className="tvd-diagram-dot" /> Named game states <span>02 / DESIGN</span></figcaption>
      <div className="tvd-state-structure" aria-hidden="true">
        <div className="tvd-diagram-node"><code>GameStateManager</code></div>
        <span className="tvd-state-connector">holds the current state</span>
        <div className="tvd-diagram-node tvd-node-highlight"><code>GameState</code><small>Interface</small></div>
        <span className="tvd-state-connector">implemented by</span>
        <div className="tvd-state-grid">
          {typingVsDemon.stateDesign.states.map(state => <div className="tvd-state-node" key={state.className}><strong>{state.label}</strong><code>{state.className}</code></div>)}
        </div>
      </div>
      <p className="tvd-diagram-note">Each screen has a name and a defined place in the design.</p>
    </figure>
  )
}
