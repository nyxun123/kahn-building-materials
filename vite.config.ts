import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-info'

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
        // 手动分割chunks以优化加载
        manualChunks: {
          // 将React相关库分离
          'react-vendor': ['react', 'react-dom'],
          // 将UI组件库分离
          'ui-vendor': ['react-hot-toast', 'react-helmet-async'],
          // 将路由相关分离
          'router-vendor': ['react-router-dom'],
          // 将图标库分离
          'icons-vendor': ['react-icons'],
          // 将国际化相关分离
          'i18n-vendor': ['react-i18next', 'i18next'],
          // 将工具库分离
          'utils-vendor': ['clsx', 'tailwind-merge']
        },
        // 优化文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'unknown'
          const info = name.split('.')
          const extType = info[info.length - 1]
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(name)) {
            return `media/[name]-[hash].${extType}`
          }
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(name)) {
            return `images/[name]-[hash].${extType}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return `fonts/[name]-[hash].${extType}`
          }
          return `assets/[name]-[hash].${extType}`
        }
      }
    },
    // 压缩配置
    minify: 'esbuild',
    // 生成source map（用于调试）
    sourcemap: !isProd,
    // 启用CSS代码分割
    cssCodeSplit: true
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
      'react-icons/ri'
    ],
    exclude: []
  },
  
  // CSS优化
  css: {
    devSourcemap: !isProd,
  },
  
  define: {
    // 确保环境变量在构建时可用
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://ypjtdfsociepbzfvxzha.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w'),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || ''),
    // Cloudflare Pages兼容
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || 'https://ypjtdfsociepbzfvxzha.supabase.co'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w'),
  },
})
