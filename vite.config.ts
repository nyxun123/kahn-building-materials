import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-info'
import copy from 'rollup-plugin-copy'
// @ts-expect-error - static data is plain JS without type declarations
import { STATIC_BLOG_ARTICLES } from './functions/lib/blog-static-data.js'

const isProd = process.env.BUILD_MODE === 'prod'
const devHost = process.env.VITE_DEV_HOST || '127.0.0.1'
const devPort = Number.parseInt(process.env.VITE_DEV_PORT || '5173', 10)

type BlogLang = 'zh' | 'en' | 'ru'

type LocalizedKey =
  | 'title_zh' | 'title_en' | 'title_ru'
  | 'excerpt_zh' | 'excerpt_en' | 'excerpt_ru'
  | 'content_zh' | 'content_en' | 'content_ru'
  | 'meta_title_zh' | 'meta_title_en' | 'meta_title_ru'
  | 'meta_description_zh' | 'meta_description_en' | 'meta_description_ru'

type StaticBlogArticle = {
  id: number
  slug: string
  category: string
  tags?: string[]
  author: string
  cover_image: string
  title_zh?: string
  title_en?: string
  title_ru?: string
  excerpt_zh?: string
  excerpt_en?: string
  excerpt_ru?: string
  content_zh?: string
  content_en?: string
  content_ru?: string
  meta_title_zh?: string
  meta_title_en?: string
  meta_title_ru?: string
  meta_description_zh?: string
  meta_description_en?: string
  meta_description_ru?: string
  view_count?: number
  published_at?: string
  created_at?: string
  updated_at?: string
} & Partial<Record<LocalizedKey, string>>

const blogArticles = STATIC_BLOG_ARTICLES as StaticBlogArticle[]

const normalizeLang = (rawLang: string): BlogLang => {
  const value = rawLang.split('-')[0].toLowerCase()
  if (value === 'zh' || value === 'ru') {
    return value
  }
  return 'en'
}

const getLocalizedField = (article: StaticBlogArticle, base: string, lang: BlogLang) => {
  const key = `${base}_${lang}` as LocalizedKey
  return article[key]
}

const createPaginationInfo = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit)
})

const buildSuccessResponse = (data: unknown, pagination?: ReturnType<typeof createPaginationInfo>) => {
  const response: Record<string, unknown> = {
    success: true,
    code: 200,
    message: '操作成功',
    data,
    timestamp: new Date().toISOString()
  }

  if (pagination) {
    response.pagination = pagination
  }

  return response
}

const buildErrorResponse = (code: number, message: string) => ({
  success: false,
  code,
  message,
  timestamp: new Date().toISOString()
})

const devBlogApiPlugin = () => ({
  name: 'dev-blog-api',
  configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
    server.middlewares.use((req, res, next) => {
      if (!req.url || !req.url.startsWith('/api/blog')) {
        next()
        return
      }

      if (req.method && req.method !== 'GET') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(buildErrorResponse(405, 'Method Not Allowed')))
        return
      }

      const url = new URL(req.url, 'http://localhost')
      const lang = normalizeLang(url.searchParams.get('lang') || 'en')
      const pathname = url.pathname

      if (pathname === '/api/blog') {
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
        const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10)))
        const offset = (page - 1) * limit
        const category = url.searchParams.get('category')

        let filteredArticles = blogArticles
        if (category) {
          filteredArticles = filteredArticles.filter((article) => article.category === category)
        }

        const paginatedArticles = filteredArticles.slice(offset, offset + limit)
        const total = filteredArticles.length

        const articles = paginatedArticles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: getLocalizedField(article, 'title', lang) || article.title_en || article.title_zh,
          excerpt: getLocalizedField(article, 'excerpt', lang) || article.excerpt_en || article.excerpt_zh,
          coverImage: article.cover_image,
          category: article.category,
          author: article.author,
          viewCount: article.view_count || 0,
          publishedAt: article.published_at,
          createdAt: article.created_at
        }))

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(buildSuccessResponse(articles, createPaginationInfo(page, limit, total))))
        return
      }

      const match = pathname.match(/^\/api\/blog\/([^/]+)$/)
      if (match) {
        const slug = decodeURIComponent(match[1])
        const article = blogArticles.find((item) => item.slug === slug)

        if (!article) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(buildErrorResponse(404, 'Article not found')))
          return
        }

        const title = getLocalizedField(article, 'title', lang) || article.title_en || article.title_zh
        const excerpt = getLocalizedField(article, 'excerpt', lang) || article.excerpt_en || article.excerpt_zh
        const content = getLocalizedField(article, 'content', lang) || article.content_en || article.content_zh
        const seoTitle = getLocalizedField(article, 'meta_title', lang) || title
        const seoDescription = getLocalizedField(article, 'meta_description', lang) || excerpt

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(buildSuccessResponse({
          id: article.id,
          slug: article.slug,
          title,
          content,
          excerpt,
          coverImage: article.cover_image,
          category: article.category,
          tags: article.tags || [],
          author: article.author,
          viewCount: article.view_count || 0,
          publishedAt: article.published_at,
          createdAt: article.created_at,
          updatedAt: article.updated_at || article.published_at,
          seo: {
            title: seoTitle,
            description: seoDescription
          },
          translations: {
            zh: { title: article.title_zh || '', available: !!article.title_zh },
            en: { title: article.title_en || '', available: !!article.title_en },
            ru: { title: article.title_ru || '', available: !!article.title_ru }
          }
        })))
        return
      }

      res.statusCode = 404
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(buildErrorResponse(404, 'Not Found')))
    })
  }
})

const plugins = [
  react({
    // 移除开发环境下的prop-types检查
    babel: {
      plugins: isProd ? ['babel-plugin-dev-expression'] : []
    }
  }),
  sourceIdentifierPlugin({
    enabled: !isProd,
    attributePrefix: 'data-matrix',
    includeProps: true,
  }),
  copy({
    targets: [
      { src: 'functions/**/*', dest: 'dist/functions' }
    ],
    hook: 'writeBundle'
  })
]

if (!isProd) {
  plugins.push(devBlogApiPlugin())
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: devHost,
    port: devPort,
    proxy: {
      '/api/content': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/content/, '/api/content-local'),
      },
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  base: '/',
  
  // 构建优化
  build: {
    // 增加chunk大小限制
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 优化的手动分割chunks策略
        manualChunks: {
          // React核心库
          'react-vendor': ['react', 'react-dom'],
          // React路由
          'router-vendor': ['react-router-dom'],
          // Refine框架相关
          'refine-vendor': [
            '@refinedev/core', 
            '@refinedev/react-hook-form', 
            '@refinedev/react-router-v6',
            '@tanstack/react-query'
          ],
          // UI组件库 - 细分更小的chunks
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          'ui-core': [
            'react-hot-toast',
            'react-helmet-async'
          ],
          // 图标库分离
          'icons-vendor': ['react-icons', 'lucide-react', '@radix-ui/react-icons'],
          // 国际化
          'i18n-vendor': [
            'react-i18next', 
            'i18next', 
            'i18next-browser-languagedetector',
            'i18next-resources-to-backend'
          ],
          // 表单处理
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'yup',
            'zod'
          ],
          // 工具库
          'utils-vendor': [
            'clsx', 
            'tailwind-merge',
            'class-variance-authority',
            'date-fns'
          ],
        },
        // 优化文件名，增加缓存策略
        chunkFileNames: (chunkInfo) => {
          // Admin相关chunk使用不同命名策略
          if (chunkInfo.name && chunkInfo.name.includes('admin')) {
            return 'admin/[name]-[hash].js';
          }
          return 'js/[name]-[hash].js';
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'unknown'
          const info = name.split('.')
          const extType = info[info.length - 1]
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
            return `media/[name]-[hash].${extType}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
            return `images/[name]-[hash].${extType}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return `fonts/[name]-[hash].${extType}`
          }
          return `assets/[name]-[hash].${extType}`
        }
      }
    },
    // 启用更好的压缩
    minify: isProd ? 'terser' : 'esbuild',
    // Terser 压缩选项（仅生产环境）
    terserOptions: isProd ? {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log'], // 移除特定函数调用
      },
      mangle: {
        safari10: true, // Safari 10+ 兼容
      },
    } : undefined,
    // target优化
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // 生成source map（用于调试）
    sourcemap: !isProd,
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 实验性特性
    reportCompressedSize: false, // 在大项目中禁用压缩大小报告以加快构建
    // 清理输出目录
    emptyOutDir: true
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'react-hot-toast',
      'react-helmet-async',
      'react-icons/ri',
      // 新增预构建优化
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'framer-motion'
    ],
    exclude: [
      // 排除一些不需要预构建的包
      '@vite/client',
      '@vite/env'
    ],
    // 强制优化部分依赖
    force: true
  },
  
  // CSS优化
  css: {
    devSourcemap: !isProd,
  },
  
  define: {
    // 确保环境变量在构建时可用
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || ''),
    // Cloudflare Pages兼容
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ''),
  },
})
