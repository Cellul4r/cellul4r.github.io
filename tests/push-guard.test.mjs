import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { agentEnvironmentMarkers, detectedAgentMarkers } from '../scripts/prevent-agent-push.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const guard = fileURLToPath(new URL('../scripts/prevent-agent-push.mjs', import.meta.url))

// Simulate terminal contexts only for guard checks. These tests never push.
function terminalEnvironment(markers = {}) {
  const environment = { ...process.env }
  for (const name of Object.keys(environment)) {
    if (agentEnvironmentMarkers.some(marker => marker.toLowerCase() === name.toLowerCase())) delete environment[name]
  }
  return { ...environment, ...markers }
}

test('ordinary terminal is allowed and produces no output', () => {
  const result = spawnSync(process.execPath, [guard], { env: terminalEnvironment(), encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, '')
  assert.equal(result.stderr, '')
})

for (const marker of agentEnvironmentMarkers) {
  test(`blocks ${marker} without exposing its value`, () => {
    const result = spawnSync(process.execPath, [guard], {
      env: terminalEnvironment({ [marker]: 'private-session-identifier' }),
      encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Push blocked/)
    assert.match(result.stderr, new RegExp(marker))
    assert.ok(!result.stderr.includes('private-session-identifier'))
  })
}

test('empty markers do not identify an agent', () => {
  assert.deepEqual(detectedAgentMarkers({ CODEX_THREAD_ID: '', CI: '  ' }), [])
})

test('Git invokes the actual pre-push hook and blocks an agent', () => {
  const result = spawnSync('git', [
    '-c', `safe.directory=${root.replaceAll('\\', '/').replace(/\/$/, '')}`,
    '-c', `core.hooksPath=${resolve(root, '.githooks')}`,
    'hook', 'run', 'pre-push', '--', 'origin', 'https://example.invalid/unused.git',
  ], { cwd: root, env: terminalEnvironment({ CODEX_THREAD_ID: 'test-session' }), encoding: 'utf8' })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /Push blocked/)
})

test('Git hook allows a simulated manual terminal without contacting a remote', () => {
  const result = spawnSync('git', [
    '-c', `safe.directory=${root.replaceAll('\\', '/').replace(/\/$/, '')}`,
    '-c', `core.hooksPath=${resolve(root, '.githooks')}`,
    'hook', 'run', 'pre-push',
  ], { cwd: root, env: terminalEnvironment(), encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
})

test('shell hook uses LF line endings', () => {
  assert.ok(!readFileSync(resolve(root, '.githooks/pre-push'), 'utf8').includes('\r'))
})
