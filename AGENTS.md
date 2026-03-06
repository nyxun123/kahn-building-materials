<!-- OPENSPEC:START -->
# OpenSpec Instructions

Always open `@/openspec/AGENTS.md` when request involves planning, proposals, architecture shifts, or ambiguous requirements. Use it to learn change proposal processes, spec formats, and project guidelines. Keep this block so 'openspec update' can refresh instructions.
<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
React + TypeScript code lives in `src/`: route screens under `pages/`, shared UI inside `components/`, hooks in `hooks/`, typed helpers in `lib/`, and language packs inside `locales/`. Edge handlers, schedulers, and Cloudflare bindings stay in `functions/`. Static files ship from `public/`, operational docs sit in `docs/`, automation scripts in `scripts/`, and regression fixtures in `tests/`. Build output goes to `dist/` and should never be edited by hand.

**Cloudflare Infrastructure:** D1 database (`kaneshuju`), R2 storage (`kaen` for images/videos), deployed via `wrangler pages deploy dist`.

## Build, Test, and Development Commands
- `pnpm dev` — Vite dev server with hot reload; auto-installs missing deps
- `pnpm build` — TypeScript compile + Vite build + copy functions/ to dist
- `pnpm build:prod` — production build with `BUILD_MODE=prod` assets for deployment
- `pnpm preview` — serve production bundle locally before deployment
- `pnpm lint` — ESLint with auto-format (add `--fix` to format files)
- `pnpm test` — Vitest watch mode for development
- `pnpm test:run` — Vitest run once (CI mode)
- `pnpm test:ui` — Vitest UI for debugging tests
- `vitest run <test-file>` — run a single test file (e.g., `vitest run src/App.test.tsx`)
- `vitest run -t <test-name>` — run tests matching a pattern
- `wrangler pages deploy dist` — deploy to Cloudflare Pages once tests pass

## Coding Style & Naming Conventions
Use TypeScript strict mode with 2-space indentation. Components and providers use `PascalCase` (`ProductHero.tsx`); hooks/utilities use `camelCase` (`useTokenRefresh`). Keep Tailwind utility strings inside JSX, extract repeated clusters into `components/ui/`, and store env keys in `functions/env.ts` using `SCREAMING_SNAKE_CASE`. Run `pnpm lint` before commits to keep formatting consistent.

## Import Organization
Order: 1) React imports, 2) Third-party libraries, 3) Local imports via `@/` alias. Use absolute imports over relative imports. Type-only imports use `import { type X } from 'module'`. Group imports with blank lines.

Example:
```typescript
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/OptimizedImage';
```

## Component Patterns
Functional components with hooks only (no classes). Extract complex logic to custom hooks in `hooks/`. Define props interfaces before component. Use `cn()` utility from `@/lib/utils` for className merging. Keep components <200 lines. Destructure props at function signature level.

Example:
```typescript
interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  onAddToCart?: () => void;
}

export function ProductCard({ id, title, price, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation();
  if (!id) return null;
  return <div className={cn('card', 'card-compact')}>...</div>;
}
```

## TypeScript Usage
Always define explicit types for function parameters and return values. Use interfaces for object shapes that may be extended, types for unions/intersections. Avoid `any` - use `unknown` with type guards. Use generic types for reusable utilities. Leverage utility types (`Pick`, `Omit`, `Partial`).

## Error Handling
Wrap async operations in try-catch blocks. Use `react-hot-toast` for user errors (`toast.error('msg')`). Log errors to console with context in development, use structured logging in production. Validate inputs with Zod/Yup before API calls. Use Error Boundaries for component-level recovery.

## Testing Guidelines
Vitest covers units and hooks; write co-located `*.test.tsx` files or use `tests/` for integration flows. Aim for 80% line coverage on new modules. Use `pnpm test:ui` for debugging flaky specs and keep Worker mocks deterministic.

## Internationalization
Use `react-i18next` hook `useTranslation()`. Store translations in `locales/`, default to Chinese (`zh`). Languages: `zh`, `en`, `ru`. Use `t('key')` for translations. Browser language detection with localStorage preference.

## Styling (Tailwind)
Keep utility classes in JSX. Extract repeated clusters to `components/ui/`. Use `cn()` for conditional merging. Theme: Primary Indigo `#6366F1`, Accent Purple `#8B5CF6`, Success Emerald `#10B981`, Warning Amber `#F59E0B`, Danger Red `#EF4444`. Use responsive prefixes (`md:`, `lg:`).

## API & Data
Use React Query (`@tanstack/react-query`). Create services in `lib/api/` or `lib/services/`. Standard response: `{ success, code, message, data, pagination?, timestamp }`. Error: `{ success, code, message, error?, timestamp }`. Use environment variables for API base URLs.

## Authentication & Security
JWT via `src/lib/auth/`. Access tokens 15min, refresh tokens 7 days. Header: `Authorization: Bearer <token>`. Refine framework (`@refinedev/core`) for admin auth. Password: 8+ chars, uppercase+lowercase+numbers+special. Max 5 failed attempts → 15min lockout. Never commit secrets.

## Admin Panel (Refine)
Refine framework in `src/pages/admin/` with providers in `src/pages/admin/refine/`. Custom components in `src/components/admin/` (ui/, forms/, upload/, lang/, layout/). Use unified upload components: `StandardUploadButton`, `MediaUpload`, `MultiLangMediaUpload`.

## Storage
D1 database via `DB` binding. R2 storage via `IMAGE_BUCKET` binding. R2 public domain in `R2_PUBLIC_DOMAIN`. All uploads through R2 helpers in `functions/`. Use environment variable `R2_PUBLIC_DOMAIN` for configuration.

## Commit & Pull Request Guidelines
Follow conventional prefix style (`feat`, `fix`, `docs`, `perf`, `refactor`). Subjects stay imperative and under 72 characters. Every PR should provide: goal summary, linked issue, validation commands (build, lint, tests), and screenshots or HAR files for UX/API impact. Rebase on `main`, ensure CI is green, and request reviewers covering both frontend (`src/`) and Workers (`functions/`) changes.

## Performance
Lazy load routes (`React.lazy()` + `Suspense`). Code split via Vite manual chunks. `loading="lazy"` for below-fold images. Use `OptimizedImage` with WebP/AVIF. Tree-shake and chunk optimization. `IntersectionObserver` for viewport optimization.

## Configuration Files
- `wrangler.toml`: Cloudflare Workers configuration (D1, R2 bindings)
- `vite.config.ts`: Vite build config with manual chunks and dev proxy
- `tsconfig.json`: TypeScript project references and path aliases
- `eslint.config.js`: ESLint with React plugins and TypeScript support
- Environment variables in `functions/env.ts` (SCREAMING_SNAKE_CASE)

Never commit secrets. Reference `ENVIRONMENT_SETUP.md`. Use scoped Cloudflare tokens: `pnpm agent:routes:list`, `pnpm agent:d1:create-admin`.
