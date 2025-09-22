# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based multilingual corporate website for Hangzhou Kahn New Building Materials Co., Ltd. The project uses modern web technologies and is deployed on Cloudflare Pages with Cloudflare D1 database.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages + Cloudflare Workers
- **Internationalization**: React i18next (Chinese, English, Russian)
- **State Management**: React Hooks + React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **API**: Custom Cloudflare Worker with embedded endpoints

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev                    # Auto-installs deps and starts dev server on port 5173

# Build commands
pnpm build                  # Standard build with TypeScript compilation
pnpm build:prod            # Production build with optimizations
pnpm build:cloudflare      # Cloudflare-optimized build

# Testing and validation
pnpm lint                   # ESLint code quality check
pnpm test:cloudflare       # Test Cloudflare Pages build compatibility
pnpm preview               # Preview production build locally

# API testing
pnpm test:api              # Run API tests via bash script
pnpm test:apis             # Node-based API testing

# Agent scripts (for Cloudflare management)
pnpm agent:check-live      # Check live domain status
pnpm agent:routes:list     # List Cloudflare worker routes
pnpm agent:d1:create-admin # Create admin user in D1 database
```

## Architecture Overview

### Frontend Structure
- **Multilingual routing**: `/:lang/path` structure with Chinese (zh) as default
- **Lazy loading**: All pages use React.lazy() for code splitting
- **Two layout systems**:
  - Public website layout (`/src/components/layout.tsx`)
  - Admin dashboard layout (`/src/pages/admin/layout.tsx`)

### Key Components
- `/src/pages/`: Page components organized by feature
- `/src/components/ui/`: Reusable UI components (shadcn/ui based)
- `/src/lib/`: Core utilities and services
- `/src/locales/`: Translation files for zh/en/ru

### Database Integration
- **Primary**: Cloudflare D1 via `/src/lib/d1-api.ts` client
- **Legacy**: Supabase client preserved for compatibility but inactive
- **API Layer**: Custom Cloudflare Worker in `/public/_worker.js` with embedded endpoints

### State Management
- **Authentication**: localStorage-based with token management
- **Data Fetching**: Custom hooks in `/src/hooks/`
- **Realtime**: useRealtimeData hook for live updates

## Configuration Files

### Build Configuration
- `vite.config.ts`: Build optimization with manual chunk splitting
- `tsconfig.json`: TypeScript project references setup
- `wrangler.toml`: Cloudflare Pages and D1 database configuration

### Environment Variables
Required in `.env`:
```
VITE_SUPABASE_URL=           # Legacy, preserved for compatibility
VITE_SUPABASE_ANON_KEY=      # Legacy, preserved for compatibility
VITE_API_BASE_URL=           # API base URL (defaults to localhost:5173)
```

## Database Schema

### Core Tables
- `products`: Multilingual product catalog with SEO metadata, image galleries, and category/tag support
- `contacts`: Customer inquiries and contact form submissions with status tracking
- `page_contents`: Dynamic page content management system with multilingual support
- `admins`: Administrative user accounts with role-based access
- `company_info`: Company information sections for different pages
- `company_content`: Additional company content with type categorization

### Key Features
- Full multilingual support (zh/en/ru) for all content
- SEO-optimized with meta titles and descriptions
- Image gallery support with JSON arrays
- Product categorization and feature tagging

## Development Patterns

### Multilingual Content
- All user-facing content requires zh/en/ru variants
- Use i18next keys for UI text
- Database fields follow `field_name_zh/en/ru` pattern

### Component Organization
- UI components use shadcn/ui design system
- Form validation with React Hook Form + Zod
- Error boundaries for graceful error handling
- Performance monitoring with custom hooks

### API Integration
- D1 API client with automatic token management via `d1Api` singleton
- Custom Cloudflare Worker at `/public/_worker.js` handles all API endpoints
- Standardized response format with error handling and pagination
- Admin authentication with Bearer token and localStorage persistence
- Routes configuration via `_routes.json` for API endpoint handling

## Testing Strategy

### API Testing
- `test-api.sh`: Bash-based endpoint testing
- `test-apis.ts`: Node-based comprehensive API testing
- Live environment validation via agent scripts

### Build Testing
- `test-cloudflare-build.cjs`: Validates Cloudflare compatibility
- Production build testing with optimizations
- Manual chunk analysis for performance

## Deployment

### Cloudflare Pages
- Build command: `pnpm run build`
- Output directory: `dist`
- Environment variables configured in Cloudflare dashboard
- D1 database binding configured via `wrangler.toml`

### Admin System
- Separate admin interface at `/admin` routes
- JWT-based authentication with role-based access
- Content management for products, messages, and pages
- Dashboard with analytics and performance metrics

## Development Notes

### Performance Optimizations
- Manual chunk splitting for optimal loading
- Image optimization with lazy loading
- CSS code splitting enabled
- Source maps for development debugging

### Browser Compatibility
- Modern browser targets via Vite
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Autoprefixer for CSS compatibility

### Security Considerations
- Admin routes protected with authentication
- Input validation on all forms
- XSS protection via React's built-in escaping
- CORS configuration for API endpoints

## Key Implementation Details

### Cloudflare Worker API Structure
The project uses a single Cloudflare Worker (`/public/_worker.js`) that handles all API endpoints:
- Contact form submissions (`/api/contact`)
- Image uploads (`/api/upload-image`)
- Admin authentication (`/api/admin/login`)
- Product CRUD operations (`/api/admin/products/*`)
- Contact message management (`/api/admin/contacts/*`)
- Content management (`/api/admin/contents/*`)

### Routing Architecture
- **Multilingual Routes**: All public pages support `/:lang/path` structure (zh/en/ru)
- **Admin Routes**: Separate admin interface with independent layout system
- **Lazy Loading**: All components use React.lazy() for optimal code splitting
- **Default Redirects**: Root paths redirect to `/zh` (Chinese) by default

### Build Optimization
- **Manual Chunk Splitting**: Vendor libraries separated into logical chunks (react-vendor, ui-vendor, etc.)
- **Asset Organization**: Images, fonts, and media files organized into separate directories
- **Environment-Specific Builds**: Different build modes (dev, prod, cloudflare) with optimizations
- **Source Maps**: Enabled for development, disabled for production builds