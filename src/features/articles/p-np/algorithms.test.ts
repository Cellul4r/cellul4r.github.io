import { describe, expect, it } from 'vitest'
import { conflict, FIXED_QUEENS, kruskalTrace, namePairs, QUEEN_SOLUTION, queenVerification } from './algorithms'
import type { Position } from './algorithms'

describe('queen certificates', () => {
  it('accepts the approved completion after all ten pair checks', () => {
    const steps = queenVerification(5, FIXED_QUEENS, QUEEN_SOLUTION)
    expect(steps.at(-1)).toMatchObject({ kind: 'accepted', passed: true, pairChecks: 10 })
    expect(steps.filter(step => step.kind === 'pair')).toHaveLength(10)
  })

  it.each([
    { positions: QUEEN_SOLUTION.slice(0, 4), kind: 'count' },
    { positions: [[1, 1], [2, 6], [3, 5], [4, 2], [5, 4]] as Position[], kind: 'bounds' },
    { positions: [[1, 1], [2, 2.5], [3, 5], [4, 2], [5, 4]] as Position[], kind: 'bounds' },
    { positions: [[1, 2], [2, 3], [3, 5], [4, 2], [5, 4]] as Position[], kind: 'fixed' },
    { positions: [[1, 1], [2, 2], [3, 5], [4, 3], [5, 4]] as Position[], kind: 'pair' },
    { positions: [[1, 1], [1, 1], [3, 5], [4, 2], [5, 4]] as Position[], kind: 'pair' },
  ])('rejects invalid certificates at the $kind check', ({ positions, kind }) => {
    expect(queenVerification(5, FIXED_QUEENS, positions).at(-1)).toMatchObject({ kind, passed: false })
  })

  it('matches independent column and diagonal set checks for every 5-row placement', () => {
    for (let code = 0; code < 5 ** 5; code++) {
      const positions: Position[] = Array.from({ length: 5 }, (_, row) => [row + 1, Math.floor(code / 5 ** row) % 5 + 1])
      const valid = new Set(positions.map(([, col]) => col)).size === 5
        && new Set(positions.map(([row, col]) => row - col)).size === 5
        && new Set(positions.map(([row, col]) => row + col)).size === 5
      expect(queenVerification(5, [], positions).at(-1)?.kind === 'accepted').toBe(valid)
    }
  })

  it('distinguishes row, column, and diagonal attacks', () => {
    expect(conflict([1, 1], [1, 3])).toBe('row')
    expect(conflict([1, 1], [3, 1])).toBe('column')
    expect(conflict([1, 1], [3, 3])).toBe('diagonal')
    expect(conflict([1, 1], [2, 3])).toBeNull()
  })
})

it('enumerates each distinct name pair once', () => {
  const pairs = namePairs(10)
  expect(pairs).toHaveLength(45)
  expect(new Set(pairs.map(pair => pair.join(','))).size).toBe(45)
  expect(pairs.every(([a, b]) => a < b)).toBe(true)
  expect(namePairs(0)).toEqual([])
})

it('skips the MST cycle and completes a tree of weight seven', () => {
  const steps = kruskalTrace()
  expect(steps.map(step => [step.a + step.b, step.selected, step.total])).toEqual([
    ['AB', true, 1], ['BC', true, 3], ['AC', false, 3], ['CD', true, 7],
  ])
  expect(steps.at(-1)?.complete).toBe(true)
})
