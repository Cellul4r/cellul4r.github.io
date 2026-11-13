export type Position = readonly [number, number]
export const FIXED_QUEENS: readonly Position[] = [[1, 1], [3, 5]]
export const QUEEN_SOLUTION: readonly Position[] = [[1, 1], [2, 3], [3, 5], [4, 2], [5, 4]]
export const samePosition = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1]
export function conflict(a: Position, b: Position): 'row' | 'column' | 'diagonal' | null {
  if (a[0] === b[0]) return 'row'
  if (a[1] === b[1]) return 'column'
  if (Math.abs(a[0] - b[0]) === Math.abs(a[1] - b[1])) return 'diagonal'
  return null
}

export type CheckKind = 'count' | 'bounds' | 'fixed' | 'pair' | 'accepted'
export interface QueenCheck {
  kind: CheckKind
  indices: number[]
  passed: boolean
  conflict?: ReturnType<typeof conflict>
  fixed?: Position
  pairChecks: number
}

export function queenVerification(size: number, fixed: readonly Position[], solution: readonly Position[]): QueenCheck[] {
  const steps: QueenCheck[] = [{ kind: 'count', indices: [], passed: solution.length === size, pairChecks: 0 }]
  if (!steps[0].passed) return steps
  for (let i = 0; i < solution.length; i++) {
    const passed = solution[i].every(value => Number.isInteger(value) && value >= 1 && value <= size)
    steps.push({ kind: 'bounds', indices: [i], passed, pairChecks: 0 })
    if (!passed) return steps
  }
  for (const position of fixed) {
    const index = solution.findIndex(candidate => samePosition(position, candidate))
    steps.push({ kind: 'fixed', indices: index < 0 ? [] : [index], passed: index >= 0, fixed: position, pairChecks: 0 })
    if (index < 0) return steps
  }
  let pairChecks = 0
  for (let i = 0; i < solution.length; i++) {
    for (let j = i + 1; j < solution.length; j++) {
      const reason = conflict(solution[i], solution[j])
      steps.push({ kind: 'pair', indices: [i, j], passed: reason === null, conflict: reason, pairChecks: ++pairChecks })
      if (reason) return steps
    }
  }
  steps.push({ kind: 'accepted', indices: [], passed: true, pairChecks })
  return steps
}

export function namePairs(length: number): [number, number][] {
  return Array.from({ length }, (_, i) => Array.from({ length: length - i - 1 }, (_, j): [number, number] => [i, i + j + 1])).flat()
}

export const MST_NODES = [
  { id: 'A', x: 65, y: 55 }, { id: 'B', x: 285, y: 55 },
  { id: 'C', x: 285, y: 215 }, { id: 'D', x: 65, y: 215 },
]
export const MST_EDGES = [
  { a: 'A', b: 'B', weight: 1 }, { a: 'B', b: 'C', weight: 2 },
  { a: 'A', b: 'C', weight: 3 }, { a: 'C', b: 'D', weight: 4 }, { a: 'A', b: 'D', weight: 7 },
]

export function kruskalTrace() {
  const parent = new Map(MST_NODES.map(node => [node.id, node.id]))
  const root = (id: string): string => parent.get(id) === id ? id : root(parent.get(id)!)
  let total = 0
  let count = 0
  const steps = []
  for (const edge of MST_EDGES) {
    const a = root(edge.a), b = root(edge.b)
    const selected = a !== b
    if (selected) { parent.set(a, b); total += edge.weight; count++ }
    const complete = count === MST_NODES.length - 1
    steps.push({ ...edge, selected, total, complete })
    if (complete) break
  }
  return steps
}
