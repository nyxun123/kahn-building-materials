import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-info'
import copy from 'rollup-plugin-copy'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
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
          'ui-components': [
            'react-hot-toast', 
            'react-helmet-async',
            '@tremor/react',
            'framer-motion'
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
          // Admin专用chunk
          'admin-vendor': [
            'pdfmake',
            'recharts',
            'jsonwebtoken'
          ]
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
    minify: 'esbuild',
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
