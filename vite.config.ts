import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-info'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(), 
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
  },
  base: '/',
  define: {
    // 确保环境变量在构建时可用
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://ypjtdfsociepbzfvxzha.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w'),
    // Cloudflare Pages兼容
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || 'https://ypjtdfsociepbzfvxzha.supabase.co'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w'),
  },
})

