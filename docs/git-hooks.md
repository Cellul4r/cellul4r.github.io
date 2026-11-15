# Git push guard

This repository uses a Git `pre-push` hook to reject pushes from detected agent or CI sessions. Normal pushes from your own terminal remain available. Local edits, tests, and requested commits are unaffected.

## Installation

After cloning, run from the repository root:

```sh
npm run hooks:install
```

This sets **only this clone's** `core.hooksPath` to `.githooks`. It does not change global Git configuration, remotes, credentials, or GitHub settings. Repeat the command for each new clone; Git does not activate tracked hooks automatically. Node.js must be available on PATH, as it already is for the portfolio's development commands. On macOS/Linux, the installer also makes the hook executable.

The installer refuses to replace a different hooks path or existing default hook files. If another hook system is already installed, have its maintainer integrate the command from `.githooks/pre-push` with that system and preserve the existing hooks.

## Detection and manual pushes

The guard blocks when any of these environment variables has a nonempty value:

- `CODEX_THREAD_ID`, `CODEX_SESSION_ID`, `CODEX_CI`
- `CLAUDECODE`, `CURSOR_AGENT`
- `CI`, `GITHUB_ACTIONS`
- `PORTFOLIO_AGENT_SESSION` (set to `1` when launching another agent harness)

Codex's session markers were confirmed in this workspace. Other harnesses must propagate one of the listed markers to their child processes; an unmarked agent cannot be distinguished from a normal terminal. Empty values are ignored; any nonempty value, including `0` or `false`, blocks conservatively. The guard reports marker names without exposing their values.

When an agent finishes work, review it and run your normal `git push` from a terminal you opened yourself outside the agent session. Even if you ask an agent to push, it should hand that step back to you. There is no agent override flag; agents must not remove session markers, disable hooks, or use `--no-verify` to publish.

## Verification

```sh
npm run test:hooks
git config --local --get core.hooksPath
```

The tests simulate agent and manual environments and invoke the actual hook through `git hook run pre-push`. They never run `git push` or contact a remote. The configuration command should print `.githooks`.

## Limits

This is a local guard against accidental pushes, not a tamper-proof security boundary. Git can bypass client hooks, session markers can be removed, and GitHub connector/API writes do not invoke Git hooks. The authorization rules in `AGENTS.md` still apply to those operations. To enforce a stronger boundary against an untrusted agent, keep remote write credentials outside its execution environment or use administrator-managed access controls.

The GitHub Pages workflow uploads build artifacts rather than pushing commits, so this guard does not interfere with the existing deployment workflow.

Reference: [Git's hook documentation](https://git-scm.com/docs/githooks#_pre_push).
