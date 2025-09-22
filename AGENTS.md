# Repository Guidelines

## Project Structure & Module Organization
Application code lives in `src/`: feature pages in `pages/`, reusable React in `components/` (UI atoms in `components/ui`), hooks in `hooks/`, services in `lib/`, and locale JSON in `locales/<lang>`. Cloudflare Worker logic sits under `worker/api` with D1 migrations in `worker/migrations`. Cloudflare Pages Functions remain under `functions/api`. Static assets use `public/`, automation scripts live in `scripts/agents`, and planning docs reside in `docs/` and `specs/`.

## Build, Test & Development Commands
Run `pnpm install` (or `npm install`) before first use. `pnpm dev` launches the Vite dev server. `pnpm build` runs `tsc -b` and produces the production bundle; prefer `pnpm build:cloudflare` for worker deployments. `pnpm lint` executes ESLint, and `pnpm preview` serves the compiled site. API checks run through `pnpm test:apis`, contact-form smoke tests through `pnpm test:api`, and `pnpm test:cloudflare` validates the worker build.

## Coding Style & Naming Conventions
Use React + TypeScript with two-space indentation. Name components in PascalCase (`ImageUploader.tsx`), hooks in camelCase (`useAuth.ts`), and utilities in kebab-case (`api-client.ts`). Favor Tailwind utilities with Radix primitives; reserve custom CSS for shared styles such as `App.css`. Run `pnpm lint -- --fix` before committing, and keep user-facing strings inside `src/locales/<lang>`.

## Testing Guidelines
Extend `test-apis.ts` for worker/API coverage and place new `.test.ts` or `.test.tsx` files near the code they target. Mirror new endpoints in `src/lib/api` and cover them with focused smoke tests. When adjusting authentication or admin flows, update `src/lib/auth/test-auth.ts` or attach manual verification notes in the PR, including screenshots or console output when automation is not possible.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat: add admin audit log`). PRs should describe scope, call out affected routes or workers, link issues, and include UI screenshots where relevant. Document new migrations or environment variables. Confirm `pnpm lint`, `pnpm build`, and required tests pass before requesting review.

## Security & Configuration Tips
Keep secrets in `.env` for Vite and `.dev.vars` for Wrangler. Add D1 SQL files to `worker/migrations` and run `wrangler d1 migrations apply <DB_NAME>` during rollout. Update `_routes.json` or Wrangler config when exposing new worker endpoints, and review helper scripts in `scripts/agents` before executing them against production.
