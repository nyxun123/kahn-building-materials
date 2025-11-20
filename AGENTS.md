<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
React + TypeScript code lives in `src/`: route screens under `pages/`, shared UI inside `components/`, hooks in `hooks/`, typed helpers in `lib/`, and language packs inside `locales/`. Edge handlers, schedulers, and Cloudflare bindings stay in `functions/`. Static files ship from `public/`, operational docs sit in `docs/`, automation scripts in `scripts/`, and regression fixtures in `tests/`. Build output goes to `dist/` and should never be edited by hand.

## Build, Test, and Development Commands
- `pnpm dev` — hot Vite dev server; auto-installs missing deps.
- `pnpm build` — TypeScript project references + Vite build + copies `functions/`.
- `pnpm build:prod` — production flags plus `BUILD_MODE=prod` assets for deployment.
- `pnpm preview` — serve the production bundle locally before pushing.
- `pnpm lint` — ESLint (see `eslint.config.js`); add `--fix` to auto-format.
- `pnpm test` / `pnpm test:run` — Vitest watch vs CI run.
- `wrangler pages deploy dist` — publish to Cloudflare Pages once tests pass.

## Coding Style & Naming Conventions
Use TypeScript strict mode with 2-space indentation. Components and providers use `PascalCase` (`ProductHero.tsx`); hooks/utilities use `camelCase` (`useTokenRefresh`). Keep Tailwind utility strings inside JSX, extract repeated clusters into `components/ui/`, and store env keys in `functions/env.ts` using `SCREAMING_SNAKE_CASE`. Run `pnpm lint` before commits to keep formatting consistent.

## Testing Guidelines
Vitest covers units and hooks; write co-located `*.test.tsx` files or use `tests/` for integration flows (`tests/test-home-content.js`, etc.). Aim for 80% line coverage on new modules and document tricky setups inside `docs/TESTING_RESOURCES_MANIFEST.md`. Use `pnpm test:ui` for debugging flaky specs and keep Worker mocks deterministic.

## Commit & Pull Request Guidelines
Follow the repo’s conventional prefix style visible in `git log` (`feat`, `fix`, `docs`, `perf`, `refactor`). Subjects stay imperative and under 72 characters. Every PR should provide: goal summary, linked issue, validation commands (build, lint, tests), and screenshots or HAR files for any UX/API impact. Rebase on `main`, ensure CI is green, and request reviewers covering both frontend (`src/`) and Workers (`functions/`) changes when relevant.

## Security & Configuration Tips
Never commit secrets or `.env.local`. Reference required keys in `ENVIRONMENT_SETUP.md`, and use `pnpm agent:routes:list` or `pnpm agent:d1:create-admin` with scoped Cloudflare tokens to verify permissions. Image uploads must flow through the R2 helpers in `functions/`; update `public/_headers` if CSP rules change before deployment.
