# 杭州卡恩新型建材有限公司官网

基于 React + TypeScript + Vite 构建的现代化企业官网，支持多语言（中文、英文、俄语）和管理后台。

## 🚀 功能特性

- **多语言支持**: 中文、英文、俄语三种语言
- **响应式设计**: 适配桌面端和移动端
- **管理后台**: 产品管理、消息管理、内容管理
- **现代化技术栈**: React 18 + TypeScript + Vite + Tailwind CSS
- **数据库集成**: Supabase 后端服务
- **表单验证**: React Hook Form + Zod
- **UI 组件**: Radix UI + Shadcn/ui

## 📦 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI 组件**: Radix UI + Shadcn/ui
- **路由**: React Router DOM
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Zod
- **国际化**: React i18next
- **后端服务**: Supabase
- **部署平台**: Cloudflare Pages

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

复制 `.env.example` 为 `.env` 并填入相应的值：

```bash
cp .env.example .env
```

需要配置的环境变量：

```env
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看网站。

## 📝 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm build:cloudflare` - 为 Cloudflare Pages 构建
- `pnpm test:cloudflare` - 测试 Cloudflare Pages 构建
- `pnpm preview` - 预览生产构建
- `pnpm lint` - 运行 ESLint 检查

## 🚀 部署

### Cloudflare Pages 部署

本项目已优化支持 Cloudflare Pages 部署。详细部署步骤请参考 [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)。

#### 快速部署步骤：

1. 推送代码到 GitHub 仓库
2. 在 Cloudflare Dashboard 中创建 Pages 项目
3. 连接 GitHub 仓库
4. 配置构建设置：
   - 构建命令: `pnpm run build`
   - 输出目录: `dist`
5. 设置环境变量
6. 部署项目

#### 测试构建

在部署前，可以本地测试构建：

```bash
pnpm run test:cloudflare
```

## 📁 项目结构

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
│   ├── supabase.ts     # Supabase 客户端
│   ├── i18n.ts         # 国际化配置
│   ├── router.tsx      # 路由配置
│   └── utils.ts        # 工具函数
├── locales/            # 多语言文件
│   ├── zh/             # 中文
│   ├── en/             # 英文
│   └── ru/             # 俄语
└── hooks/              # 自定义 Hooks
```

## 🌐 多语言支持

项目支持三种语言：

- 中文 (zh) - 默认语言
- 英文 (en)
- 俄语 (ru)

语言文件位于 `src/locales/` 目录下，使用 React i18next 进行国际化处理。

## 🔧 管理后台

管理后台功能包括：

- **产品管理**: 添加、编辑、删除产品信息
- **消息管理**: 查看和管理用户留言
- **内容管理**: 编辑页面内容

访问路径: `/admin/login`

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 公司: 杭州卡恩新型建材有限公司
- 邮箱: info@karn-materials.com
- 电话: +86 571-88888888
- 地址: 浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场
