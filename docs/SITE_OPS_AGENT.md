# Site Ops Agent

## Overview
- `Commander` role: `scripts/agents/site-ops-commander.mjs`
- Sub-agents:
- `SEO sitemap agent` (`pnpm seo:sitemaps:generate`)
- `Image quality agent` (`pnpm seo:images:check`)
- `SEO audit agent` (`pnpm seo:audit:continuous`)
- `UX lighthouse agent` (`pnpm ops:ux:lighthouse`)

The commander runs sub-agents in sequence, aggregates results, and writes reports to `docs/seo-reports`.

## Commands
- Local run:
```bash
pnpm ops:agent -- --site=https://kn-wallpaperglue.com --no-fail
```
- UX-only run:
```bash
pnpm ops:ux:lighthouse -- --site=https://kn-wallpaperglue.com --no-fail
```

## Reports
- `docs/seo-reports/site-ops-commander-latest.json`
- `docs/seo-reports/site-ops-commander-latest.md`
- `docs/seo-reports/ux-lighthouse-latest.json`
- `docs/seo-reports/ux-lighthouse-latest.md`

## Automation
- Workflow: `.github/workflows/site-ops-agent.yml`
- Schedule: daily (`cron: 45 1 * * *`)
- Manual trigger supported (`workflow_dispatch`)

## Failure Policy
- Default: commander exits non-zero when any sub-agent fails.
- Safe mode: add `--no-fail` for monitoring-only runs where alerts should not block the pipeline.
