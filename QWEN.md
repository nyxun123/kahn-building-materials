# QWEN.md - 杭州卡恩新型建材有限公司官网项目

## 📋 项目概述

这是一个为**杭州卡恩新型建材有限公司**开发的现代化企业官网，使用 React + TypeScript + Vite 构建，支持多语言（中文、英文、俄语）和管理后台。

## 🏗️ 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ui/             # UI 基础组件
│   ├── layout.tsx      # 布局组件
│   ├── navbar.tsx      # 导航栏
│   └── footer.tsx      # 页脚
├── pages/              # 页面组件
│   ├── home/           # 首页
│   ├── products/       # 产品页面
│   ├── about/          # 关于我们
│   ├── contact/        # 联系我们
│   ├── oem/            # OEM 服务
│   └── admin/          # 管理后台
├── lib/                # 工具库
│   ├── supabase.ts     # Supabase 客户端（已迁移至D1）
│   ├── i18n.ts         # 国际化配置
│   ├── router.tsx      # 路由配置
│   └── utils.ts        # 工具函数
├── locales/            # 多语言文件
│   ├── zh/             # 中文
│   ├── en/             # 英文
│   └── ru/             # 俄语
└── hooks/              # 自定义 Hooks

functions/              # Cloudflare Workers API
├── api/
│   └── _worker.js      # API 路由和数据库操作

public/                 # 静态资源
├── images/             # 图片资源
├── _headers            # HTTP 响应头配置
├── _redirects          # 重定向配置
└── _worker.js          # 静态资源服务 Worker
```

## 🚀 技术栈

### 前端技术
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI 组件**: Radix UI + Shadcn/ui
- **路由**: React Router DOM
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Zod
- **国际化**: React i18next
- **动画库**: Framer Motion
- **图标库**: Lucide React + React Icons

### 后端技术
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2 (对象存储)
- **部署平台**: Cloudflare Pages
- **API**: Cloudflare Workers

### 数据库架构
- **products** - 产品信息表 (产品代码、多语言名称描述、规格、应用、包装选项等)
- **contacts** - 联系表单消息表 (用户提交的联系信息)
- **page_contents** - 页面内容表 (首页、产品页、关于我们等页面的多语言内容)
- **company_info** - 公司信息表 (公司简介、联系方式等多语言内容)
- **company_content** - 公司内容表 (公司详细介绍内容)
- **admins** - 管理员表 (后台登录认证)

## 📦 依赖说明

### 核心依赖
- `react`, `react-dom` - React 框架核心
- `@radix-ui/react-*` - Radix UI 组件库
- `@hookform/resolvers` - 表单验证
- `i18next`, `react-i18next` - 国际化支持
- `react-router-dom` - 路由管理
- `tailwindcss` - 样式框架
- `zod` - 数据验证

### UI 与组件库
- `@tremor/react` - 数据可视化组件
- `recharts` - 图表库
- `framer-motion` - 动画库
- `lucide-react` - 图标库
- `react-icons` - 图标库

### 开发工具
- `@types/*` - TypeScript 类型定义
- `vite` - 构建工具
- `typescript` - 类型系统
- `eslint` - 代码检查

## 🔧 开发命令

- `pnpm dev` - 启动开发服务器 (访问 http://localhost:5173)
- `pnpm build` - 构建生产版本
- `pnpm build:prod` - 构建生产版本（生产环境配置）
- `pnpm build:cloudflare` - 为 Cloudflare Pages 构建
- `pnpm test:cloudflare` - 测试 Cloudflare Pages 构建
- `pnpm preview` - 预览生产构建
- `pnpm lint` - 运行 ESLint 检查

## 🌐 多语言支持

项目支持三种语言：
- 中文 (zh) - 默认语言
- 英文 (en)
- 俄语 (ru)

语言文件位于 `src/locales/` 目录下，使用 React i18next 进行国际化处理。

## 🔑 环境变量

项目使用 Cloudflare D1 作为后端服务，需要配置以下环境变量：

```env
VITE_SUPABASE_URL=你的Supabase项目URL (已迁移至D1)
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥 (已迁移至D1)
```

## 🚀 部署

项目已优化支持 Cloudflare Pages 部署：
- 构建命令: `pnpm run build`
- 输出目录: `dist`
- 环境: Cloudflare Workers + D1 + R2

## 🏢 业务信息

- 公司: 杭州卡恩新型建材有限公司
- 邮箱: info@karn-materials.com
- 电话: +86 571-88888888
- 地址: 浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场
- 产品: 羧甲基淀粉（CMS）产品，主要用于墙纸胶粉、银粉纸涂布、建材添加等行业

## 🛠️ API 功能

### 公共 API
- 产品列表查询: `GET /api/products`
- 产品详情查询: `GET /api/products/{productCode}`
- 联系表单提交: `POST /api/contact`
- 页面内容查询: `GET /api/content/{pageType}`
- 公司信息查询: `GET /api/company/info/{sectionType}`
- 公司内容查询: `GET /api/company/content/{contentType}`

### 管理员 API
- 管理员登录: `POST /api/admin/login`
- 产品管理: `GET/POST/PUT/DELETE /api/admin/products`
- 联系消息管理: `GET/PUT/DELETE /api/admin/contacts`
- 页面内容管理: `GET/POST/PUT/DELETE /api/admin/content/{pageType}`
- 公司信息管理: `GET/POST/PUT/DELETE /api/admin/company/info`
- 公司内容管理: `GET/POST/PUT/DELETE /api/admin/company/content`
- 仪表板统计: `GET /api/admin/dashboard/stats`
- 仪表板活动: `GET /api/admin/dashboard/activities`
- 系统健康: `GET /api/admin/dashboard/health`
- 图片上传: `POST /api/upload-image`

### 认证机制
- 管理员接口使用简单的密码认证
- 请求头携带 Authorization 信息进行认证

## 📄 特殊配置

- 项目已从 Supabase 迁移到 Cloudflare D1 数据库
- 集成了 Cloudflare R2 用于图片和文件存储
- 支持管理后台功能（产品管理、消息管理、内容管理）
- 包含产品技术参数文件（CMS_TDS_Chinese.pdf, CMS_TDS_English.pdf 等）
- 集成了 Google reCAPTCHA 验证
- 包含自动化域名配置脚本

## 🎯 项目目标

1. **展示产品力**: 展示羧甲基淀粉（CMS）产品力与应用方案
2. **传达特点**: 传达冷水速溶、高粘度、环保、安全的产品特点
3. **客户便利**: 方便客户快速了解参数、下载资料、提交询价或 OEM 定制需求
4. **国际化**: 支持中、英、俄三种语言，面向国际市场
5. **现代化管理**: 通过后台管理系统，实现内容、产品和用户消息的便捷管理

## 📝 管理后台功能

管理后台位于 `/admin` 路径，提供以下功能：
- 仪表板统计和活动监控
- 产品分类管理 (增删改查)
- 联系消息管理 (查看、标记已读、删除)
- 页面内容管理 (首页、产品页、关于我们等页面内容)
- 公司信息管理 (公司简介、联系方式等)
- 图片上传管理 (支持多语言、多格式图片上传)

## 🌐 部署架构

- **前端**: React + Vite 构建的单页应用（SPA）
- **后端**: Cloudflare Workers + Cloudflare D1 (SQLite) + Cloudflare R2 (存储)
- **部署**: Cloudflare Pages 静态托管 + Workers 边缘计算
- **CDN**: Cloudflare 全球 CDN 网络
- **安全**: 所有 API 请求通过 Workers 处理，支持 CORS 配置