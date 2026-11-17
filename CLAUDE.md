# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

All project instructions — commands, repository map, verification workflow, Git/push boundaries, product identity, design direction, and content-integrity rules — live in `AGENTS.md` and are shared across agents. Treat it as authoritative:

@AGENTS.md

## Claude Code specifics

- **Skills:** Repository skills are maintained once in `.agents/skills/`. `.claude/skills` is a local, Git-ignored link to that directory so Claude Code discovers the same skills without a duplicate copy. Edit skills in `.agents/skills/`, never through a copy. If `.claude/skills` is missing in a fresh clone, recreate it from the repository root:
  - Windows (no admin needed): `cmd /c "mklink /J .claude\skills .agents\skills"`
  - macOS/Linux: `ln -s ../.agents/skills .claude/skills`
- **Pushing:** The `pre-push` hook blocks Claude Code sessions. Hand pushes back to the user (they can run `! git push` themselves).

## Architecture notes not covered in AGENTS.md

- **Routing and base path:** `vite.config.ts` derives `base` from `GITHUB_REPOSITORY` (root for `*.github.io`, `/<repo>/` otherwise); `src/app/router.tsx` turns `BASE_URL` into the router `basename`. `npm run build` copies `dist/index.html` to `dist/404.html` as the Pages SPA fallback.
- **Dedicated case-study routes:** `projects/typing-vs-demon` and `projects/llm-financial-advisor` are explicit lazy routes declared before the generic `projects/:slug` (`ProjectDetailPage`). New dedicated case studies need the same ordering; their content lives in matching `src/data/*.ts` files.
- **Lazy routes and Suspense keys:** Heavier pages are `lazy()` imports with route-specific fallbacks and distinct Suspense `key`s so the loading boundary resets on navigation.
- **Codeforces feature:** Data flows `config.ts → queries.ts → api.ts → requestQueue.ts` with TanStack Query and a rate-limited shared request queue. Read `src/features/competitive-programming/README.md` before changing it.
- **Tests:** Vitest (jsdom, setup in `src/test/setup.ts`) only picks up `src/**/*.test.{ts,tsx}`. The `tests/*.mjs` files run under `node --test` via `npm run test:matching` and `npm run test:hooks`.
