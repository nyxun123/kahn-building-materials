# iFlow CLI Context - 建筑材料企业网站

## 项目概述

这是一个基于 React + TypeScript + Vite 构建的多语言企业网站，支持中文、英文、俄语三语切换。该项目专为杭州卡恩新型建材有限公司设计，提供产品展示、联系表单、内容管理等功能。

### 核心特性
- 🌐 多语言支持（中文、英文、俄语）
- 📱 响应式设计，支持移动端
- 🎨 现代化工业风格UI设计
- 📦 产品展示和管理系统
- 📞 联系表单和留言管理
- 🖼️ 图片上传和管理
- 🔐 管理后台和权限控制
- 📊 实时数据仪表板和系统监控
- ⚡ 基于 Vite 的快速构建

## 技术栈

### 前端技术
- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **国际化**: react-i18next
- **路由**: React Router
- **状态管理**: React Hooks
- **UI组件库**: Radix UI + 自定义组件

### 后端技术
- **部署平台**: Cloudflare Workers + Cloudflare Pages
- **数据库**: Cloudflare D1 (SQLite兼容)
- **存储**: Cloudflare R2 (对象存储)
- **API架构**: 无服务器函数 (Serverless Functions)

### 开发工具
- **包管理**: pnpm
- **构建工具**: Vite
- **类型检查**: TypeScript
- **代码规范**: ESLint
- **部署**: Cloudflare Pages 自动化部署

## 项目结构

```
.
├── src/                     # 前端源代码
│   ├── components/         # 可复用组件
│   ├── pages/              # 页面组件
│   ├── lib/                # 工具库和配置
│   ├── hooks/              # 自定义React Hooks
│   ├── locales/            # 国际化文件
│   ├── App.tsx             # 应用根组件
│   └── main.tsx            # 应用入口点
├── functions/              # Cloudflare Functions
│   └── api/
│       └── _worker.js      # API路由处理器
├── worker/                 # Worker相关代码
│   ├── api/                # API业务逻辑
│   └── migrations/         # 数据库迁移脚本
├── public/                 # 静态资源
│   ├── images/             # 图片资源
│   ├── _headers            # HTTP安全头配置
│   └── _redirects          # 路由重定向配置
├── dist/                   # 前端构建输出
├── dist-backend/           # 后端构建输出
└── scripts/                # 自动化脚本
```

## 核心模块

### 1. 前端应用 (src/)
- **路由管理**: 使用 React Router 实现多语言路由和页面导航
- **国际化**: 通过 react-i18next 实现三语切换
- **状态管理**: 使用 React Hooks 进行状态管理
- **组件系统**: 基于 Radix UI 和自定义组件构建

### 2. API 后端 (functions/api/_worker.js)
- **联系表单处理**: 接收并存储用户联系信息
- **产品管理**: CRUD操作管理产品信息
- **内容管理**: 管理网站各页面内容
- **图片上传**: 支持图片上传到 Cloudflare R2
- **管理后台**: 提供管理员登录和数据管理接口
- **仪表板**: 提供统计数据和系统监控
- **公司信息管理**: 管理公司联系信息和内容

### 3. 数据库 (Cloudflare D1)
- **产品表**: 存储产品信息和多语言内容
- **联系表**: 存储用户联系信息
- **内容表**: 存储网站页面内容
- **管理员表**: 存储管理员账户信息
- **公司信息表**: 存储公司基本信息和内容
- **页面内容表**: 存储各页面的详细内容

## 开发工作流

### 1. 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 构建项目
```bash
# 构建前端
npm run build

# 构建生产环境前端
npm run build:prod

# 构建Cloudflare版本
npm run build:cloudflare
```

### 3. 代码规范检查
```bash
# 运行ESLint检查
npm run lint
```

## 部署流程

### Cloudflare Pages 部署
1. **构建配置**:
   - 构建命令: `npm run build`
   - 输出目录: `dist`
   - Node.js 版本: 18+

2. **环境变量配置**:
   ```bash
   VITE_API_BASE_URL=https://kn-wallpaperglue.com
   VITE_SUPABASE_URL=https://ypjtdfsociepbzfvxzha.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **一键部署**:
   ```bash
   ./deploy-cloudflare.sh
   ```

## 管理后台

### 访问地址
- 登录页面: `/admin/login`
- 管理面板: `/admin/dashboard`

### 功能模块
1. **仪表板**: 系统概览和统计数据
2. **产品管理**: 产品增删改查和版本控制
3. **联系消息**: 用户留言管理和状态更新
4. **内容管理**: 网站各页面内容编辑
5. **系统监控**: 系统健康状态检查

## 国际化支持

### 支持语言
- 中文 (zh)
- 英文 (en)
- 俄文 (ru)

### 语言切换
- URL参数: `/zh/`, `/en/`, `/ru/`
- 浏览器自动检测
- 用户手动切换并保存偏好

## 性能优化

### 前端优化
- **代码分割**: 基于路由的代码分割
- **资源缓存**: 静态资源长期缓存
- **图片优化**: 支持WebP格式
- **预加载**: 关键资源预加载

### 后端优化
- **数据库索引**: 优化查询性能
- **API缓存**: 合理使用缓存策略
- **响应压缩**: 自动Gzip压缩
- **CDN加速**: Cloudflare全球网络加速

## 安全措施

### 前端安全
- **CSP策略**: 内容安全策略防护
- **XSS防护**: 输入验证和转义
- **点击劫持防护**: X-Frame-Options头

### 后端安全
- **CORS控制**: 跨域资源共享控制
- **输入验证**: 严格的API输入验证
- **认证授权**: 管理员权限控制
- **SQL注入防护**: 参数化查询

## 故障排除

### 常见问题
1. **API 404错误**: 检查环境变量配置
2. **图片上传失败**: 验证R2存储桶配置
3. **管理后台无法登录**: 检查管理员账户和数据库连接

### 调试模式
```bash
# 本地开发环境变量
VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 维护和更新

### 数据库迁移
使用 `worker/migrations/` 目录中的脚本进行数据库结构更新

### 内容更新
通过管理后台直接更新网站内容，无需重新部署

### 功能扩展
1. 添加新页面: 创建页面组件并注册路由
2. 添加新API: 在 `functions/api/_worker.js` 中添加处理函数
3. 添加新组件: 在 `src/components/` 中创建新组件