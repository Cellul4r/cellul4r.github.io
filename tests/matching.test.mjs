import { test } from 'node:test'
import assert from 'node:assert/strict'
import { solveMatching, generateGraph, graphKey, buildMatchingFrames, frameAt } from '../src/features/competitive-programming/matching/matching.ts'

function exhaustive(edges, left = 1, used = new Set()) {
  if (left > 3) return 0
  let best = exhaustive(edges, left + 1, used)
  for (const [u, v] of edges) {
    if (u !== left || used.has(v)) continue
    best = Math.max(best, 1 + exhaustive(edges, left + 1, new Set([...used, v])))
  }
  return best
}

test('Edmonds–Karp agrees with exhaustive matching on all 512 bipartite graphs', () => {
  for (let mask = 0; mask < 512; mask++) {
    const edges = Array.from({ length: 9 }, (_, i) => [1 + Math.floor(i / 3), 4 + i % 3]).filter((_, i) => mask & (1 << i))
    const result = solveMatching(edges)
    assert.equal(result.matching.length, exhaustive(edges), `Graph ${mask}`)
    assert.equal(new Set(result.matching.map(([u]) => u)).size, result.matching.length)
    assert.equal(new Set(result.matching.map(([, v]) => v)).size, result.matching.length)
    const flow = Array.from({ length: 8 }, () => Array(8).fill(0))
    const capacity = Array.from({ length: 8 }, () => Array(8).fill(0))
    for (const [u, v] of [...edges, [0, 1], [0, 2], [0, 3], [4, 7], [5, 7], [6, 7]]) capacity[u][v] = 1
    for (const [index, step] of result.steps.entries()) {
      assert.equal(step.path[0], 0)
      assert.equal(step.path.at(-1), 7)
      assert.equal(new Set(step.path).size, step.path.length)
      assert.equal(step.before.length, index)
      for (let i = 1; i < step.path.length; i++) {
        const u = step.path[i - 1], v = step.path[i]
        assert.ok(capacity[u][v] - flow[u][v] > 0, 'Path uses positive residual capacity')
        flow[u][v]++
        flow[v][u]--
      }
      for (let u = 0; u < 8; u++) for (let v = 0; v < 8; v++) assert.ok(flow[u][v] <= capacity[u][v])
      for (let u = 1; u <= 6; u++) assert.equal(flow[u].reduce((a, b) => a + b, 0), 0, 'Flow is conserved')
      assert.deepEqual(step.after, edges.filter(([u, v]) => flow[u][v] === 1))
      assert.equal(step.after.length, index + 1)
    }
  }
})

test('Rerouting is a real reverse residual traversal and changes earlier pairs', () => {
  const result = solveMatching([[1, 4], [1, 5], [2, 4], [3, 6]])
  assert.deepEqual(result.steps[2].path, [0, 2, 4, 1, 5, 7])
  assert.equal(result.steps[2].reverse, true)
  assert.deepEqual(result.matching, [[1, 5], [2, 4], [3, 6]])
})

test('Generated graphs are valid, bounded, and differ from the previous graph', () => {
  let seed = 42
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32 }
  let previous
  for (let i = 0; i < 1000; i++) {
    const edges = generateGraph(previous, random)
    assert.ok(edges.length >= 4 && edges.length <= 6)
    assert.equal(new Set(edges.map(([u, v]) => `${u}-${v}`)).size, edges.length)
    for (let node = 1; node <= 6; node++) assert.ok(edges.some(edge => edge.includes(node)))
    for (const [u, v] of edges) assert.ok(u >= 1 && u <= 3 && v >= 4 && v <= 6)
    assert.ok(solveMatching(edges).matching.length >= 2)
    if (previous) assert.notEqual(graphKey(edges), graphKey(previous))
    previous = edges
  }
  const fallback = generateGraph(undefined, () => 0)
  assert.notEqual(graphKey(generateGraph(fallback, () => 0)), graphKey(fallback))
})

test('Timeline reveals nodes before terminals and ends with the computed result', () => {
  for (const edges of [[], [[1, 4]], [[1, 4], [1, 5], [2, 4], [3, 6]]]) {
    const result = solveMatching(edges)
    const frames = buildMatchingFrames(result)
    assert.deepEqual(frames.filter(frame => frame.phase === 'nodes').map(frame => frame.nodes), [1, 2, 3, 4, 5, 6])
    const total = frames.reduce((sum, frame) => sum + frame.duration, 0)
    assert.equal(frameAt(frames, 0).frame.phase, 'intro')
    assert.equal(frameAt(frames, 1200).frame.phase, 'press')
    assert.deepEqual(frameAt(frames, total).frame.matching, result.matching)
    assert.equal(frameAt(frames, total).progress, 1)
    const pathFrames = frames.filter(frame => frame.phase === 'path')
    assert.deepEqual(pathFrames.map(frame => frame.path), result.steps.map(step => step.path))
  }
})
