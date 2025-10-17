# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual corporate website for 杭州卡恩新型建材有限公司 (Hangzhou Karn New Building Materials Co., Ltd) - a Chinese building materials company specializing in carboxymethyl starch (CMS) products.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Radix UI + Shadcn/ui
- **Routing**: React Router DOM with lazy loading
- **Internationalization**: React i18next (zh, en, ru)
- **Forms**: React Hook Form + Zod validation
- **Backend**: Cloudflare Functions (D1 database + R2 storage)
- **Deployment**: Cloudflare Pages
- **Package Manager**: pnpm

## Development Commands

### Core Development
```bash
# Install dependencies and start development server
pnpm dev

# Build for production
pnpm build

# Build for specific environments
pnpm build:prod          # Production build
pnpm build:cloudflare    # Cloudflare Pages build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

### Testing & Quality
```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Test specific functionality
pnpm test:cloudflare     # Test Cloudflare build
pnpm test:admin         # Test admin functionality
pnpm test:apis          # Test API endpoints
```

### Domain & Deployment (Scripts)
```bash
# Domain verification and setup
pnpm domain:verify
pnpm domain:check
pnpm domain:status
pnpm domain:auto-setup
pnpm domain:monitor

# Cloudflare agent operations
pnpm agent:check-live
pnpm agent:routes:list
pnpm agent:d1:create-admin
```

## Architecture Overview

### Frontend Structure
- **Lazy Loading**: All pages use React.lazy() for code splitting
- **Multi-language Routing**: URLs follow pattern `/:lang/page` (zh, en, ru)
- **Admin Routes**: Separate admin section at `/admin/*` with distinct layout
- **Component Architecture**: Modular components with TypeScript interfaces

### Backend (Cloudflare Functions)
- **API Routes**: All API endpoints in `functions/api/` directory
- **Database**: Cloudflare D1 (SQLite) for product data, messages, etc.
- **Storage**: Cloudflare R2 for image uploads
- **Authentication**: JWT-based admin authentication

### Key Directories
- `src/pages/`: Frontend pages (home, products, about, contact, oem)
- `src/pages/admin/`: Admin dashboard and management pages
- `src/components/`: Reusable React components
- `src/components/ui/`: Shadcn/ui components
- `src/locales/`: i18n translation files (zh, en, ru)
- `functions/api/`: Cloudflare Functions API endpoints
- `public/`: Static assets

## Environment Configuration

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Cloudflare Configuration
- **wrangler.toml**: D1 database and R2 bucket bindings
- **Database ID**: `1017f91b-e6f1-42d9-b9c3-5f32904be73a`
- **R2 Bucket**: `kaen` for image storage

## Key Features & Implementation

### Multi-language Support
- **Detection**: Path-based language detection (`/zh/`, `/en/`, `/ru/`)
- **Fallback**: Default to Chinese (zh) if language not specified
- **Storage**: User language preference stored in localStorage

### Admin System
- **Authentication**: JWT tokens stored in localStorage
- **CRUD Operations**: Product management, message handling, content editing
- **Image Upload**: Direct to Cloudflare R2 via worker API
- **Refine Integration**: Uses Refine.dev framework for admin UI

### Product Management
- **Database Schema**: Products with multilingual fields (name_zh, name_en, name_ru)
- **Categories**: Product categorization with filtering
- **Image Handling**: R2 storage with optimized serving
- **Features**: JSON arrays for product features per language

## Development Guidelines

### Code Organization
- Use TypeScript interfaces for all data structures
- Follow the existing component naming conventions
- Maintain the lazy loading pattern for new pages
- Keep admin and frontend routes separate

### API Development
- All API functions must handle CORS headers
- Use consistent error handling with proper status codes
- Implement authentication checks for admin endpoints
- Follow the existing response format pattern

### Styling Guidelines
- Use Tailwind CSS classes following the existing color scheme
- Maintain the green color palette (primary: #047857)
- Use Shadcn/ui components for consistency
- Implement responsive design (mobile-first)

### Database Operations
- Use prepared statements with parameter binding
- Handle multilingual data appropriately
- Implement proper error handling for database operations
- Use transactions for multi-table operations

## Common Tasks

### Adding New Pages
1. Create page component in `src/pages/`
2. Add lazy loading import in `src/lib/router.tsx`
3. Add route configuration in router
4. Add translation files in `src/locales/`

### Creating New API Endpoints
1. Create function file in `functions/api/`
2. Implement proper CORS and error handling
3. Add authentication if needed
4. Update `functions/_routes.json` if required

### Adding New Languages
1. Create translation files in `src/locales/[lang]/`
2. Update supported languages in `src/lib/i18n.ts`
3. Add language detection rules if needed
4. Update router configuration

## Testing

### Local Development
- Use `pnpm dev` for local development with hot reload
- API proxy configured to localhost:8788 for Cloudflare Functions
- Test both frontend and admin functionality

### Production Testing
- Use `pnpm build:cloudflare` before deployment
- Test image uploads to R2 storage
- Verify all API endpoints work in deployed environment
- Test multi-language functionality

## Deployment

### Cloudflare Pages
- Build command: `pnpm build`
- Output directory: `dist`
- Functions are automatically copied to `dist/functions`
- Configure environment variables in Cloudflare dashboard

### Database Management
- Use Cloudflare D1 for database operations
- Schema migrations handled via Cloudflare dashboard
- Backup strategy: Use Cloudflare's automatic backups

## Important Notes

- This is a production application serving a real company
- Always test multilingual functionality thoroughly
- Image uploads go directly to Cloudflare R2 - handle errors gracefully
- Admin authentication relies on JWT tokens - implement proper security
- Database operations should use proper error handling and logging
- The codebase uses both Supabase and Cloudflare D1 - be aware of which is used where