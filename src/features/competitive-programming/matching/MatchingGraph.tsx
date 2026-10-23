import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { MatchingEdge, MatchingFrame } from './matching'

const positions = [
  [27, 140], [105, 52], [105, 140], [105, 228],
  [275, 52], [275, 140], [275, 228], [353, 140],
]
const labels = ['s', 'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 't']

function segment(u: number, v: number) {
  const [x, y] = positions[u]
  const [endX, endY] = positions[v]
  const length = Math.hypot(endX - x, endY - y)
  const dx = (endX - x) / length * 23
  const dy = (endY - y) / length * 23
  return { x1: x + dx, y1: y + dy, x2: endX - dx, y2: endY - dy }
}

export function MatchingGraph({ edges, frame, progress }: { edges: MatchingEdge[]; frame: MatchingFrame; progress: number }) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const network = frame.nodes === 8
  const showEdges = !['intro', 'press', 'nodes'].includes(frame.phase)
  const paths = frame.path.slice(1).map((v, i) => [frame.path[i], v] as const)
  const flowEdges: MatchingEdge[] = [...frame.matching, ...frame.matching.flatMap(([u, v]): MatchingEdge[] => [[0, u], [v, 7]])]
  const allEdges: MatchingEdge[] = [...edges, ...(network ? [[0, 1], [0, 2], [0, 3], [4, 7], [5, 7], [6, 7]] as MatchingEdge[] : [])]
  const pathProgress = Math.min(.9999, progress) * paths.length
  const activeSegment = paths[Math.floor(pathProgress)]
  const point = activeSegment ? segment(...activeSegment) : null
  const fraction = pathProgress % 1
  return (
    <svg className="matching-graph" viewBox="0 0 380 280" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>Bipartite maximum matching using max flow</title>
      <desc id={`${id}-desc`}>Connections: {edges.map(([u, v]) => `${labels[u]} to ${labels[v]}`).join(', ')}. Current matching: {frame.matching.length ? frame.matching.map(([u, v]) => `${labels[u]} with ${labels[v]}`).join(', ') : 'none'}. {frame.message}</desc>
      <defs>
        {['base', 'path', 'reverse'].map(kind => <marker key={kind} id={`${id}-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" className={`matching-arrow-${kind}`} /></marker>)}
      </defs>
      {showEdges && allEdges.map(([u, v]) => {
        const matched = flowEdges.some(([a, b]) => a === u && b === v)
        return <line key={`${u}-${v}`} {...segment(u, v)} className={`matching-edge${matched ? ' is-matched' : ''}${u === 0 || v === 7 ? ' is-terminal' : ''}`} markerEnd={network ? `url(#${id}-base)` : undefined} />
      })}
      {paths.map(([u, v], index) => <line key={`${u}-${v}`} {...segment(u, v)} className={`matching-path${u >= 4 && v <= 3 ? ' is-reverse' : ''}`} opacity={index <= Math.floor(pathProgress) ? 1 : .22} markerEnd={`url(#${id}-${u >= 4 && v <= 3 ? 'reverse' : 'path'})`} />)}
      {point && <circle cx={point.x1 + (point.x2 - point.x1) * fraction} cy={point.y1 + (point.y2 - point.y1) * fraction} r="5" className="matching-flow-dot" />}
      {positions.map(([x, y], node) => {
        if (node === 0 || node === 7 ? !network : node > Math.min(6, frame.nodes)) return null
        const matched = flowEdges.some(edge => edge.includes(node))
        const onPath = frame.path.includes(node)
        return <motion.g key={node} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .18 }} className={`matching-node${node === 0 || node === 7 ? ' is-source-sink' : ''}${matched ? ' is-matched' : ''}${onPath ? ' is-on-path' : ''}`}>
          <circle cx={x} cy={y} r="21" />
          <text x={x} y={y} textAnchor="middle" dominantBaseline="central">{labels[node]}</text>
        </motion.g>
      })}
    </svg>
  )
}
