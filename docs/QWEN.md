# 杭州卡恩新型建材有限公司官网 - QWEN.md

## 项目概述

这是一个基于 React + TypeScript + Vite 构建的现代化企业官网，专门为杭州卡恩新型建材有限公司开发。该网站支持多语言（中文、英文、俄语），并配备管理后台，主要展示公司的羧甲基淀粉(CMS)产品。

## 项目结构

```
/Users/nll/Documents/可以用的网站/
├── functions/          # Cloudflare Workers 函数
├── public/             # 静态资源
├── src/                # 源代码目录
│   ├── components/     # React 组件
│   ├── hooks/          # React 自定义 Hooks
│   ├── lib/            # 工具库、API、路由、国际化等
│   ├── locales/        # 多语言资源文件
│   ├── pages/          # 页面组件
│   └── styles/         # 样式文件
├── dist/               # 构建输出目录
├── node_modules/       # 依赖包
├── .cloudbase/         # Claude AI 配置
├── .gemini-clipboard/  # Gemini 配置
├── .vscode/            # VSCode 配置
└── ...
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI 组件**: Radix UI + Shadcn/ui
- **路由**: React Router DOM
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Zod
- **国际化**: React i18next
- **后端服务**: Cloudflare D1、R2
- **部署平台**: Cloudflare Pages

## 依赖信息

关键依赖包括：
- React 18 + React DOM
- React Router DOM
- TypeScript
- Tailwind CSS
- Radix UI 组件库
- React Hook Form + Zod 验证
- i18next 国际化
- Framer Motion (动画)
- Recharts (图表)
- PDFMake (PDF 生成)
- Refine 框架 (管理后台)
- Cloudflare Workers (服务端功能)

## 环境配置

### 环境变量
需要在 `.env` 文件中配置：
```env
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 本地开发
1. 确保已安装 Node.js 18+ 和 pnpm
2. 安装依赖：`pnpm install`
3. 启动开发服务器：`pnpm dev`
4. 访问 [http://localhost:5173](http://localhost:5173)

### 构建命令
- `pnpm build` - 构建生产版本
- `pnpm build:prod` - 构建生产版本（生产环境配置）
- `pnpm build:cloudflare` - 为 Cloudflare Pages 构建
- `pnpm preview` - 预览生产构建

### 测试命令
- `pnpm test` - 运行测试
- `pnpm test:run` - 运行测试（非监听模式）
- `pnpm test:cloudflare` - 测试 Cloudflare 构建

## 应用功能

### 前端页面
- 首页
- 产品展示页面
- 产品详情页面
- OEM 服务页面
- 关于我们页面
- 联系我们页面

### 管理后台
- 产品管理（添加、编辑、删除产品）
- 消息管理（查看用户留言）
- 内容管理（编辑页面内容）
- 公司信息管理
- SEO 管理
- 数据分析

### 多语言支持
- 支持中文 (zh)、英文 (en)、俄语 (ru)
- 语言文件位于 `src/locales/` 目录
- 使用 React i18next 进行国际化处理

### 数据存储
- 使用 Cloudflare D1 作为数据库
- 使用 Cloudflare R2 作为图片存储
- 通过 API 进行数据交互

## Cloudflare 配置

`wrangler.toml` 配置：
- 项目名称: kahn-building-materials
- D1 数据库: kaneshuju (ID: 1017f91b-e6f1-42d9-b9c3-5f32904be73a)
- R2 存储桶: kaen

## 项目特色

1. **现代化技术栈**: 使用最新的前端技术，确保性能和开发体验
2. **响应式设计**: 适配桌面端和移动端
3. **多语言支持**: 满足国际化需求
4. **管理后台**: 完整的内容和产品管理功能
5. **云原生架构**: 利用 Cloudflare 的 D1 和 R2 服务
6. **SEO 友好**: 支持 SEO 配置和网站地图
7. **性能优化**: 包含代码分割、懒加载等优化措施

## 业务背景

杭州卡恩新型建材有限公司专业生产羧甲基淀粉(CMS)产品，主要用于墙纸胶粉、银粉纸涂布、建材添加等行业。网站作为展示公司产品和服务的重要平台，需要支持多种语言以满足不同国家客户的需求，并提供管理后台方便内容更新和客户管理。

## 开发约定

- 使用 TypeScript 进行类型安全的开发
- 组件采用 React 函数式组件 + Hooks
- 样式使用 Tailwind CSS 进行原子化设计
- 路由配置使用 React Router v6 的 createBrowserRouter
- 国际化使用 i18next，语言文件按模块组织
- API 请求使用自定义 hooks 进行封装
- 遵循 React 最佳实践和性能优化原则