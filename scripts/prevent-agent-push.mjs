import { pathToFileURL } from 'node:url'

export const agentEnvironmentMarkers = [
  'CODEX_THREAD_ID',
  'CODEX_SESSION_ID',
  'CODEX_CI',
  'CLAUDECODE',
  'CURSOR_AGENT',
  'CI',
  'GITHUB_ACTIONS',
  'PORTFOLIO_AGENT_SESSION',
]

export function detectedAgentMarkers(environment) {
  return agentEnvironmentMarkers.filter(name => Boolean(environment[name]?.trim()))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const detected = detectedAgentMarkers(process.env)
  if (detected.length > 0) {
    console.error('Push blocked: Git pushes from agent or CI sessions are disabled for this repository.')
    console.error(`Detected session markers: ${detected.join(', ')}`)
    console.error('Ask the repository owner to push from their own terminal outside the agent session.')
    process.exitCode = 1
  }
}
