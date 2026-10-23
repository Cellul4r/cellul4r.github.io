import { useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, Shuffle } from 'lucide-react'
import { MatchingGraph } from './MatchingGraph'
import { useMatchingPlayback } from '../hooks/useMatchingPlayback'
import { buildMatchingFrames, frameAt, generateGraph, solveMatching } from '../lib/matching'
import ready from '../assets/anya-matching/ready.webp'
import press from '../assets/anya-matching/press.webp'
import celebrate from '../assets/anya-matching/celebrate.webp'
import './MatchingDemo.css'

const poses = [ready, press, celebrate]

export function MatchingDemo() {
  const [edges, setEdges] = useState(() => generateGraph())
  const frames = useMemo(() => buildMatchingFrames(solveMatching(edges)), [edges])
  const duration = frames.reduce((sum, frame) => sum + frame.duration, 0)
  const playback = useMatchingPlayback(duration, poses)
  const { frame, progress } = frameAt(frames, playback.elapsed)
  const done = frame.phase === 'done'
  const pressing = frame.phase === 'press'
  const intro = frame.phase === 'intro' || pressing
  const pose = done ? celebrate : pressing ? press : ready

  function newGraph() {
    setEdges(previous => generateGraph(previous))
    playback.restart()
  }

  return (
    <section ref={playback.sceneRef} className={`matching-demo${done ? ' is-done' : ''}${playback.reduced ? ' is-reduced' : ''}`} aria-label="Animated maximum matching demonstration" style={{ animationPlayState: playback.playing ? 'running' : 'paused' }}>
      <MatchingGraph edges={edges} frame={frame} progress={progress} />
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{frame.message}</div>
      <div className="matching-footer">
        <div className="matching-controls">
          {!playback.complete && <button type="button" onClick={playback.togglePause} title={playback.paused ? 'Resume' : 'Pause'} aria-label={playback.paused ? 'Resume matching animation' : 'Pause matching animation'}>{playback.paused ? <Play size={18} /> : <Pause size={18} />}</button>}
          {playback.complete && !playback.reduced && <button type="button" onClick={playback.restart} title="Replay" aria-label="Replay matching animation"><RotateCcw size={18} /></button>}
          <button type="button" onClick={newGraph} title="New graph" aria-label="Generate a new graph"><Shuffle size={18} /></button>
        </div>
        <div className="matching-mascot-stage" aria-hidden="true" key={playback.run}>
          <img key={pose} src={pose} width="320" height="480" alt="" draggable="false" onError={event => { event.currentTarget.style.visibility = 'hidden' }} className={`matching-anya${done ? ' is-celebrating' : ''}${intro ? ' is-intro' : ''}${pressing ? ' is-pressing' : ''}`} />
          {done && <span className="matching-sparkles">✦<span>✧</span>✦</span>}
          <span className={`matching-play-prop${pressing ? ' is-pressed' : ''}`}><Play size={15} fill="currentColor" /></span>
        </div>
      </div>
      {playback.reduced && <span className="sr-only">Reduced motion is enabled. The completed matching is shown. Use New graph for another example.</span>}
    </section>
  )
}
