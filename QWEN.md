# 杭州卡恩新型建材有限公司官网项目指南

## 📋 项目概述

这是一个基于 React + TypeScript + Vite 构建的现代化企业官网，支持多语言（中文、英文、俄语）和管理后台。该项目主要用于展示杭州卡恩新型建材有限公司的产品信息，特别是羧甲基淀粉（CMS）产品，该产品主要用于墙纸胶粉、银粉纸涂布、建材添加等行业。

### 核心技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI 组件**: Radix UI + Shadcn/ui
- **路由**: React Router DOM
- **国际化**: React i18next
- **后端服务**: Supabase (数据库和认证)
- **部署平台**: Cloudflare Pages

### 功能特性
- **多语言支持**: 支持中文、英文、俄语三种语言
- **响应式设计**: 适配桌面端和移动端
- **管理后台**: 产品管理、消息管理、内容管理
- **表单验证**: React Hook Form + Zod
- **现代化UI组件**: 使用 Radix UI 和 Shadcn/ui 构建

## 🔧 项目结构

```
/ (项目根目录)
├── src/                    # 源代码目录
│   ├── components/         # React 组件
│   ├── pages/              # 页面组件
│   ├── hooks/              # 自定义 hooks
│   ├── lib/                # 工具函数库
│   ├── locales/            # 国际化语言文件
│   ├── services/           # API 服务
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 通用工具函数
│   ├── styles/             # 样式文件
│   ├── assets/             # 静态资源
│   ├── constants/          # 常量定义
│   └── App.tsx             # 主应用组件
├── functions/              # Cloudflare Workers 函数
├── public/                 # 静态资源目录
├── .env                    # 环境变量配置
├── .env.example            # 环境变量示例
├── .gitignore              # Git 忽略配置
├── package.json            # 项目依赖和脚本
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 构建配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
└── README.md               # 项目说明文档
```

## 🛠️ 开发环境设置

### 环境要求
- Node.js 18+
- pnpm

### 安装和运行

1. **安装依赖**:
```bash
pnpm install
```

2. **环境变量配置**:
复制 `.env.example` 为 `.env` 并填入相应的值：
```bash
cp .env.example .env
```

需要配置的环境变量：
```env
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
VITE_API_BASE_URL=API基础URL
```

3. **启动开发服务器**:
```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看网站。

## 📝 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm build:prod` - 构建生产版本（生产环境配置）
- `pnpm build:cloudflare` - 为 Cloudflare Pages 构建
- `pnpm test:cloudflare` - 测试 Cloudflare Pages 构建
- `pnpm preview` - 预览生产构建
- `pnpm lint` - 运行 ESLint 检查
- `pnpm test` - 运行 Vitest 测试
- `pnpm test:ui` - 运行 Vitest UI 测试
- `pnpm test:run` - 运行 Vitest 测试（非监听模式）

## 🌐 多语言支持

项目支持三种语言：
- 中文 (zh) - 默认语言
- 英文 (en)
- 俄语 (ru)

语言文件位于 `src/locales/` 目录下，使用 React i18next 进行国际化处理。

## 🔐 管理后台

管理后台功能包括：
- **产品管理**: 添加、编辑、删除产品信息
- **消息管理**: 查看和管理用户留言
- **内容管理**: 编辑页面内容

访问路径: `/admin/login`

管理后台使用 Refine 框架构建，集成了 Supabase 作为数据源。

## 🚀 构建和部署

### Cloudflare Pages 部署

本项目已优化支持 Cloudflare Pages 部署。

快速部署步骤：
1. 推送代码到 GitHub 仓库
2. 在 Cloudflare Dashboard 中创建 Pages 项目
3. 连接 GitHub 仓库
4. 配置构建设置：
   - 构建命令: `pnpm run build:cloudflare`
   - 输出目录: `dist`
5. 设置环境变量
6. 部署项目

## 💾 数据库集成

项目使用 Supabase 作为后端服务，提供数据库和认证功能：
- 数据库: PostgreSQL
- 认证: Supabase Auth
- 存储: Supabase Storage

## 🧪 测试

项目使用 Vitest 作为测试框架，包含：
- 单元测试
- 组件测试
- 集成测试

测试文件通常位于 `tests/` 目录或与源代码并列。

## 📦 依赖说明

主要依赖包括：
- **React 18**: 前端框架
- **TypeScript**: 类型检查
- **Tailwind CSS**: CSS 框架
- **React Router DOM**: 路由控制
- **React Hook Form**: 表单处理
- **Zod**: 表单验证
- **React i18next**: 国际化
- **Refine**: 企业级应用框架
- **Supabase**: 后端服务
- **Radix UI**: 无障碍 UI 组件
- **Shadcn/ui**: UI 组件库

## 🎨 UI 组件

项目使用 Radix UI 和 Shadcn/ui 作为 UI 组件库，通过 `@/components/ui` 和 `@/hooks` 别名访问。

## 🌍 业务信息

- 公司: 杭州卡恩新型建材有限公司
- 邮箱: info@karn-materials.com
- 电话: +86 571-88888888
- 地址: 浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场
- 产品: 羧甲基淀粉（CMS）产品，主要用于墙纸胶粉、银粉纸涂布、建材添加等行业

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## ⚙️ 额外工具脚本

项目包含许多自动化工具脚本，用于域名验证、API设置、DNS配置等：
- `domain:verify` - 域名验证
- `domain:check` - 快速部署检查  
- `domain:monitor` - 实时域名监控
- `agent:d1:create-admin` - 创建D1数据库管理员
- 以及其他多个自动化脚本