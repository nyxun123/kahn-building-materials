# DevOps Agent Playbook — Cloudflare Routes Fix

Goal: Make `/api/*` serve Pages Functions (functions/api/_worker.js) and keep the legacy contact worker only on `/api/contact-api`.

Prereqs
- Cloudflare API Token with Workers Routes and Pages edit permissions.
- Zone ID of `kn-wallpaperglue.com`.
- Optional: contact worker script name (e.g. `contact-worker`).

Steps
1) Verify live endpoints
   - `AGENT_DOMAIN=kn-wallpaperglue.com node scripts/agents/check-live.mjs`
   - Expected after fix: `/api/products` and `/api/content/home` return 200 JSON.

2) Narrow workers route from `/api/*` to `/api/contact-api`
   - Dry‑run: `CF_API_TOKEN=*** CF_ZONE_ID=*** node scripts/agents/worker-routes.mjs`
   - Apply: `DRY_RUN=false CF_API_TOKEN=*** CF_ZONE_ID=*** CONTACT_SCRIPT=contact-worker node scripts/agents/worker-routes.mjs`
   - Alternative (Dashboard): Workers → Routes → delete `/api/*`, add `/api/contact-api` → script `contact-worker`.

3) Ensure Pages Functions are enabled
   - Pages → your project → Settings → Functions: Enabled, compatibility date `2024-01-01`.
   - Bindings: add `DB` (D1) and optional `BUCKET` to match `pages-functions.toml`.

4) Deploy Pages build
   - `npm run build:cloudflare`
   - `npx wrangler pages deploy dist` (or trigger CI build).

5) Re‑verify
   - `npm run agent:check-live`
   - Manual: `curl https://kn-wallpaperglue.com/api/products` → 200

Rollback
- Recreate the old route `/api/*` to the previous worker if needed.

