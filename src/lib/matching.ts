export type MatchingEdge = readonly [number, number]
export interface FlowStep {
  path: number[]
  before: MatchingEdge[]
  after: MatchingEdge[]
  reverse: boolean
}
export interface MatchingResult { steps: FlowStep[]; matching: MatchingEdge[] }

// 0 = source, 1–3 = left partition, 4–6 = right partition, 7 = sink.
export function solveMatching(edges: readonly MatchingEdge[]): MatchingResult {
  const residual = Array.from({ length: 8 }, () => Array<number>(8).fill(0))
  for (let i = 1; i <= 3; i++) { residual[0][i] = 1; residual[i + 3][7] = 1 }
  for (const [u, v] of edges) residual[u][v] = 1
  const matching = () => edges.filter(([u, v]) => residual[u][v] === 0)
  const steps: FlowStep[] = []
  while (true) {
    const parent = Array<number>(8).fill(-1)
    parent[0] = 0
    const queue = [0]
    for (let head = 0; head < queue.length && parent[7] === -1; head++) {
      const u = queue[head]
      for (let v = 0; v < 8; v++) {
        if (parent[v] !== -1 || residual[u][v] <= 0) continue
        parent[v] = u
        queue.push(v)
      }
    }
    if (parent[7] === -1) break
    const path = [7]
    while (path[0] !== 0) path.unshift(parent[path[0]])
    const before = matching()
    for (let i = 1; i < path.length; i++) {
      residual[path[i - 1]][path[i]]--
      residual[path[i]][path[i - 1]]++
    }
    steps.push({ path, before, after: matching(), reverse: path.some((u, i) => i > 0 && u >= 1 && u <= 3 && path[i - 1] >= 4 && path[i - 1] <= 6) })
  }
  return { steps, matching: matching() }
}

export function graphKey(edges: readonly MatchingEdge[]) {
  return edges.map(([u, v]) => `${u}-${v}`).sort().join(',')
}

export function generateGraph(previous?: readonly MatchingEdge[], random = Math.random): MatchingEdge[] {
  const previousKey = previous ? graphKey(previous) : ''
  let fallback: MatchingEdge[] = [[1, 4], [1, 5], [2, 4], [3, 6]]
  if (graphKey(fallback) === previousKey) fallback = [[1, 4], [2, 5], [3, 5], [3, 6]]
  for (let attempt = 0; attempt < 40; attempt++) {
    const candidates: MatchingEdge[] = Array.from({ length: 9 }, (_, i) => [1 + Math.floor(i / 3), 4 + i % 3])
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
    const edges = candidates.slice(0, 4 + Math.floor(random() * 3)).sort(([a, b], [c, d]) => a - c || b - d)
    if (graphKey(edges) === previousKey || Array.from({ length: 6 }, (_, i) => i + 1).some(node => !edges.some(edge => edge.includes(node)))) continue
    const result = solveMatching(edges)
    if (result.matching.length < 2) continue
    fallback = edges
    if (result.steps.some(step => step.reverse)) return edges
  }
  return fallback
}

export type ScenePhase = 'intro' | 'press' | 'nodes' | 'edges' | 'network' | 'path' | 'commit' | 'done'
export interface MatchingFrame {
  phase: ScenePhase
  duration: number
  nodes: number
  matching: MatchingEdge[]
  path: number[]
  reverse: boolean
  message: string
}

export function buildMatchingFrames(result: MatchingResult): MatchingFrame[] {
  const base = { nodes: 0, matching: [], path: [], reverse: false }
  const frames: MatchingFrame[] = [
    { ...base, phase: 'intro', duration: 1200, message: 'A little teamwork. A perfect pairing?' },
    { ...base, phase: 'press', duration: 900, message: 'Let’s find a maximum matching.' },
    ...Array.from({ length: 6 }, (_, i): MatchingFrame => ({ ...base, phase: 'nodes', nodes: i + 1, duration: 400, message: i < 3 ? 'Meet the left partition.' : 'Now, the right partition.' })),
    { ...base, nodes: 6, phase: 'edges', duration: 800, message: 'Each connection is a possible pair.' },
    { ...base, nodes: 8, phase: 'network', duration: 1800, message: 'Add source s and sink t. Every edge has capacity 1.' },
  ]
  for (const step of result.steps) {
    frames.push({ nodes: 8, phase: 'path', duration: 3000, matching: step.before, path: step.path, reverse: step.reverse, message: step.reverse ? 'Reroute an earlier match to make room.' : 'Find an augmenting path from s to t.' })
    frames.push({ nodes: 8, phase: 'commit', duration: 1000, matching: step.after, path: [], reverse: false, message: 'Send 1 unit of flow. Update the matching.' })
  }
  frames.push({ nodes: 8, phase: 'done', duration: 1400, matching: result.matching, path: [], reverse: false, message: `No augmenting path remains. Maximum matching = ${result.matching.length}.` })
  return frames
}

export function frameAt(frames: MatchingFrame[], elapsed: number) {
  let start = 0
  for (let index = 0; index < frames.length; index++) {
    const frame = frames[index]
    if (elapsed < start + frame.duration || index === frames.length - 1) return { frame, index, progress: Math.min(1, (elapsed - start) / frame.duration) }
    start += frame.duration
  }
  throw new Error('A matching scene requires at least one frame')
}
