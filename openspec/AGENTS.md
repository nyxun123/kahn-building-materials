# 墙纸胶企业官网 - AI Agents 配置指南

## 🎯 项目概述

这是一个专业的墙纸胶企业官网项目，采用 React + TypeScript + Cloudflare 技术栈，支持多语言（中英俄）和完整的管理后台系统。

## 🤖 AI Assistant 角色配置

### 项目架构师 AI
**职责**: 负责整体架构设计和技术选型

**专业知识**:
- React 18 + TypeScript + Vite 现代前端架构
- Cloudflare 生态系统 (Pages, Workers, D1, R2)
- 多语言国际化 (i18next)
- 响应式设计和性能优化

**工作原则**:
- 优先考虑用户体验和页面加载性能
- 确保代码可维护性和扩展性
- 遵循现代前端开发最佳实践

### 前端开发 AI
**职责**: 实现用户界面和交互功能

**专业知识**:
- React Hooks 和组件设计模式
- Tailwind CSS + Radix UI 组件库
- Framer Motion 动画效果
- React Router v6 路由管理

**工作原则**:
- 组件化和模块化开发
- 移动端优先的响应式设计
- 无障碍访问和语义化 HTML

### 后端开发 AI
**职责**: 开发 Cloudflare Workers API 和数据库设计

**专业知识**:
- Cloudflare Workers Serverless 函数
- D1 数据库设计和 SQL 查询优化
- R2 对象存储和文件管理
- JWT 认证和安全实现

**工作原则**:
- API 设计简洁高效
- 数据库查询性能优化
- 安全性和数据保护优先

### 内容管理 AI
**职责**: 管理多语言内容和SEO优化

**专业知识**:
- 多语言内容管理策略
- SEO 最佳实践和结构化数据
- 内容建模和信息架构
- 媒体资源管理和优化

**工作原则**:
- 内容一致性和准确性
- 搜索引擎友好设计
- 用户体验优化

## 📋 开发指导原则

### 代码规范
```typescript
// 组件命名使用 PascalCase
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Hook 和状态管理使用 camelCase
  const [isLoading, setIsLoading] = useState(false);

  // API 调用使用 async/await
  const handleProductUpdate = async (productData: ProductData) => {
    try {
      await productService.update(productData);
    } catch (error) {
      console.error('Product update failed:', error);
    }
  };

  return <div>...</div>;
};
```

### 文件组织结构
```
src/
├── components/          # 可复用组件
│   ├── ui/             # 基础 UI 组件
│   ├── layout/         # 布局组件
│   └── features/       # 功能组件
├── pages/              # 页面组件
│   ├── admin/          # 管理后台页面
│   └── public/         # 公共页面
├── lib/                # 工具函数和服务
├── hooks/              # 自定义 Hooks
├── types/              # TypeScript 类型定义
└── locales/            # 国际化资源
```

### Git 提交规范
```bash
# 功能开发
git commit -m "feat: add product search functionality"

# Bug 修复
git commit -m "fix: resolve mobile navigation menu issue"

# 文档更新
git commit -m "docs: update API documentation for product endpoints"

# 样式调整
git commit -m "style: improve responsive design for product cards"
```

## 🛠️ 技术栈详细配置

### 前端技术栈
- **React 18.3.1**: 使用并发特性和 Suspense
- **TypeScript 5.6.2**: 严格类型检查，提高代码质量
- **Vite 6.0.1**: 快速开发服务器和构建工具
- **Tailwind CSS 3.4.16**: 原子化 CSS，高度可定制
- **Radix UI**: 无样式、可访问的组件基础库

### 后端技术栈
- **Cloudflare Workers**: 边缘计算运行环境
- **D1 数据库**: SQLite 兼容的分布式数据库
- **R2 存储**: S3 兼容的对象存储
- **Workers KV**: 键值存储，用于缓存和会话

### 开发工具
- **ESLint + TypeScript ESLint**: 代码质量检查
- **Vitest**: 单元测试框架，与 Vite 深度集成
- **Playwright**: 端到端测试
- **PNPM**: 高效的包管理器

## 🌍 多语言支持策略

### 语言支持
- **中文 (zh)**: 主要市场，完整功能支持
- **英文 (en)**: 国际市场，标准功能支持
- **俄文 (ru)**: 新兴市场，基础功能支持

### 实现方式
```typescript
// i18next 配置
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: require('./locales/zh.json') },
      en: { translation: require('./locales/en.json') },
      ru: { translation: require('./locales/ru.json') }
    },
    lng: 'zh',
    fallbackLng: 'en'
  });
```

## 🔒 安全最佳实践

### 前端安全
- 输入验证和 XSS 防护
- CSRF 令牌保护
- 内容安全策略 (CSP) 配置
- 敏感数据不在客户端存储

### 后端安全
- JWT 令牌管理和验证
- API 速率限制
- SQL 注入防护
- 文件上传安全检查

### 数据保护
- GDPR 合规性考虑
- 数据最小化原则
- 定期安全审计
- 用户隐私保护

## 📊 性能优化策略

### 前端优化
- 代码分割和懒加载
- 图片优化和 WebP 格式
- 缓存策略和 CDN 利用
- 预加载关键资源

### 后端优化
- D1 查询优化和索引设计
- API 响应缓存
- Worker 冷启动优化
- 数据库连接池管理

### 监控和分析
- Core Web Vitals 监控
- 错误追踪和报告
- 性能指标收集
- 用户体验分析

## 🚀 部署和运维

### 部署流程
```bash
# 构建生产版本
pnpm run build:prod

# 部署到 Cloudflare Pages
wrangler pages deploy dist

# 更新 D1 数据库
wrangler d1 migrations apply kaneshuju
```

### 环境管理
- **开发环境**: 本地开发，热重载
- **测试环境**: 自动化测试，预览部署
- **生产环境**: 性能优化，监控告警

## 📞 联系和支持

### 技术支持
- 项目文档: `/docs` 目录
- API 文档: `/docs/api.md`
- 部署指南: `/docs/deployment.md`

### 常见问题
1. **多语言切换问题**: 检查 i18next 配置和资源文件
2. **图片上传失败**: 验证 R2 配置和 CORS 设置
3. **数据库连接问题**: 检查 D1 绑定和迁移状态
4. **构建失败**: 检查 TypeScript 类型和依赖版本

---

**注意**: 这个配置文件应该与项目的实际情况保持同步更新。定期审查和更新以确保最佳实践的适用性。