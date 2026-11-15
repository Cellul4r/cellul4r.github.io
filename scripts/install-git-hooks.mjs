import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const gitOptions = { cwd: root, encoding: 'utf8' }

try {
  const configured = spawnSync('git', ['config', '--get', 'core.hooksPath'], gitOptions)
  if (configured.error) throw configured.error
  if (configured.status !== 0 && configured.status !== 1) {
    throw new Error(configured.stderr.trim() || 'Unable to read Git hook configuration.')
  }

  const hooksPath = configured.stdout.trim()
  if (hooksPath && resolve(root, hooksPath) !== resolve(root, '.githooks')) {
    throw new Error(`An existing hooksPath (${hooksPath}) is configured. Integrate the push guard with those hooks before installing; see docs/git-hooks.md.`)
  }

  if (!hooksPath) {
    const defaultHooks = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], gitOptions).trim()
    const defaultDirectory = resolve(root, defaultHooks)
    const activeFiles = existsSync(defaultDirectory)
      ? readdirSync(defaultDirectory, { withFileTypes: true }).filter(entry => entry.isFile() && !entry.name.endsWith('.sample'))
      : []
    if (activeFiles.length > 0) {
      throw new Error('Existing Git hook files were found. Integrate them before changing hooksPath; see docs/git-hooks.md.')
    }
  }

  if (process.platform !== 'win32') chmodSync(join(root, '.githooks/pre-push'), 0o755)
  execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], gitOptions)
  console.log('Installed repository Git hooks. Agent/CI pushes are blocked; manual terminal pushes remain available.')
} catch (error) {
  console.error(`Hook installation failed: ${error.message}`)
  process.exitCode = 1
}
