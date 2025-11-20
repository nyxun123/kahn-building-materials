# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + TypeScript 的多语言企业官网项目，使用 Vite 构建，部署在 Cloudflare Pages。项目包含产品展示、内容管理、后台管理系统等功能模块。

## 开发命令

### 核心开发命令
```bash
# 开发环境启动
pnpm dev

# 生产构建
pnpm build:prod

# Cloudflare Pages 构建
pnpm build:cloudflare

# 代码检查
pnpm lint

# 预览构建结果
pnpm preview

# 测试相关
pnpm test              # 运行测试
pnpm test:ui           # 测试UI界面
pnpm test:run          # 运行所有测试
```

### API和部署测试
```bash
# API测试
pnpm test:apis         # 测试API接口
pnpm test:api          # API测试脚本

# Cloudflare相关
pnpm test:cloudflare   # Cloudflare构建测试
pnpm test:admin        # 管理后台综合测试
```

### 域名和自动化脚本
```bash
# 域名管理相关脚本
pnpm domain:verify     # 验证域名配置
pnpm domain:check      # 快速部署检查
pnpm domain:status     # 域名状态检查
pnpm domain:complete-auto  # 完整自动化配置
```

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **路由**: React Router v6
- **UI组件**: Radix UI + Tailwind CSS
- **状态管理**: @tanstack/react-query
- **表单处理**: react-hook-form + yup/zod
- **国际化**: i18next (支持中英俄越泰印尼等多语言)

### 后端架构
- **部署平台**: Cloudflare Pages
- **数据库**: Cloudflare D1 (SQLite)
- **文件存储**: Cloudflare R2 (图片上传)
- **API**: Cloudflare Functions (通过 Wrangler 部署)

### 核心目录结构
```
src/
├── components/       # 通用组件库
├── pages/           # 页面组件 (包含admin管理页面)
├── lib/             # 工具库和配置
├── hooks/           # 自定义React Hooks
├── data/            # 静态数据和类型定义
├── locales/         # 多语言翻译文件
└── styles/          # 全局样式

functions/           # Cloudflare Functions API
public/             # 静态资源和SEO文件
```

## 关键特性

### 多语言支持
- 使用 i18next 实现动态语言切换
- 支持语言: 中文、英文、俄文、越南文、泰文、印尼文
- 翻译文件位于 `src/locales/` 目录

### 管理后台系统
- 路径: `/admin/*`
- 功能: 产品管理、内容管理、媒体库、SEO设置、数据分析
- 认证: JWT token 认证机制

### SEO优化
- 动态生成多语言 sitemap
- 结构化数据 (JSON-LD)
- 多语言 meta 标签管理
- 搜索引擎验证文件集成

### 图片上传功能
- 使用 Cloudflare R2 存储
- 支持拖拽上传和批量处理
- 自动生成缩略图和优化

## 环境配置

### Cloudflare配置
- D1数据库ID: `1017f91b-e6f1-42d9-b9c3-5f32904be73a`
- R2存储桶: `kaen`
- 兼容性: Node.js compatibility enabled

### 构建优化
- 代码分割: 按功能模块分割chunks
- 压缩: Terser (生产环境)
- 预构建: 关键依赖预优化
- 资源优化: 图片、字体、CSS分类管理

## 开发注意事项

### 代码规范
- 使用 ESLint 进行代码检查
- TypeScript 严格模式
- 组件采用函数式组件 + Hooks
- 样式使用 Tailwind CSS 类名

### 性能优化
- 路由级别的懒加载
- 图片优化和懒加载
- Service Worker 缓存策略
- 关键资源预加载

### 部署流程
1. 本地构建测试: `pnpm build:cloudflare`
2. 部署到 Cloudflare Pages
3. 配置环境变量和域名绑定
4. 清除CDN缓存验证

### 调试和测试
- 本地开发端口: 5173
- API代理配置: `/api` 路径代理到本地函数
- 测试环境: 支持热重载和source map

## 故障排除

### 常见问题
- **构建失败**: 检查 TypeScript 类型错误
- **API请求失败**: 验证 D1 数据库连接配置
- **图片上传问题**: 检查 R2 存储桶权限设置
- **路由404**: 确认 Cloudflare Pages 重写规则

### 性能监控
- 使用 Cloudflare Analytics 监控页面性能
- 数据库查询优化和索引管理
- 图片资源压缩和CDN优化