# SEO Continuous Playbook (90 Days)

## Reality Check
- No one can guarantee "homepage ranking" by a fixed date.
- What we can guarantee: a high-frequency execution loop that continuously improves crawlability, relevance, and authority.

## Goal Stack
- P0 (Technical): Keep indexable pages crawlable and schema-complete every day.
- P1 (Content): Publish high-intent zh/en/ru articles every week with product/solution internal links.
- P2 (Authority): Add external citations/backlinks every week and track indexed growth.

## Commands
- Generate fresh sitemaps:
```bash
pnpm seo:sitemaps:generate
```
- Run continuous SEO audit:
```bash
pnpm seo:audit:continuous --site=https://kn-wallpaperglue.com
```
- One-shot local continuous flow:
```bash
pnpm seo:continuous
```
- Run commander agent (SEO + image quality + UX lighthouse):
```bash
pnpm ops:agent -- --site=https://kn-wallpaperglue.com --no-fail
```

## Automation
- Workflow: `.github/workflows/seo-continuous.yml`
- Schedule: daily (`cron: 20 1 * * *`)
- Output: `docs/seo-reports/continuous-seo-latest.{json,md}`
- Workflow: `.github/workflows/site-ops-agent.yml`
- Schedule: daily (`cron: 45 1 * * *`)
- Output: `docs/seo-reports/site-ops-commander-latest.{json,md}`

## Weekly Cadence
1. Publish 2-3 new long-tail articles from `docs/SEO_CONTENT_SPRINT_WEEK1.json`.
2. Add 3+ internal links from each new article to `/products`, `/applications`, `/solutions`.
3. Run `pnpm seo:images:check` before publish and fix all image errors.
4. Refresh sitemap and redeploy.
5. Review `continuous-seo-latest.md`, fix all critical items within 24h.

## Image Quality Standard (Strict)
- Preferred source: real factory/lab/product photos first.
- Allowed external sources: copyright-clear photo libraries (for example Unsplash/Pexels) with credits added in `docs/blog-image-credits.md`.
- AI-generated images are only allowed when they are photorealistic and pass manual review for realism.
- Do not use images with obvious AI traces (plastic skin, distorted hands/text, unreal reflections, repeated artifacts).
- Do not use image assets with suspicious names like `generated`, `ai`, `midjourney`, `dalle`, `stable-diffusion`.
- Every blog post must have:
- cover image + at least 2 inline images
- meaningful alt text (not generic "image")
- source traceability (local file path or credited external URL)

## KPI Targets (Track weekly)
- Critical SEO issues: `0`
- Indexed URL trend: week-over-week increase
- Non-brand organic clicks: +10% WoW target
- Avg position for top 20 money keywords: trending upward
- CTR for money pages: improve titles/meta if below baseline

## What to Avoid
- Do not use link farms, cloaking, doorway pages, or hidden text.
- Do not mass-generate low-value articles without search intent.
- Do not ship pages with duplicate canonical/noindex conflicts.
