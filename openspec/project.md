# Project Context

## Purpose
杭州卡恩新型建材有限公司官方网站 - 专业的墙纸胶产品展示和企业形象展示平台。主要目标包括：
- 展示公司全系列墙纸胶产品和技术优势
- 提供OEM定制服务介绍和咨询入口
- 建立专业企业形象，吸引国内外客户
- 支持多语言市场拓展（中国、英语、俄语地区）
- 提供便捷的产品查询和联系渠道

## Tech Stack
### 前端技术栈
- **React 18.3.1** - 现代化前端框架，支持并发特性
- **TypeScript 5.6.2** - 类型安全的JavaScript超集
- **Vite 6.0.1** - 快速的构建工具和开发服务器
- **React Router DOM v6** - 单页应用路由管理
- **Tailwind CSS 3.4.16** - 原子化CSS框架
- **Radix UI** - 无样式、可访问的UI组件库
- **Framer Motion** - 高性能动画库
- **React Hook Form + Yup/Zod** - 表单处理和验证
- **react-i18next** - 国际化支持（中英俄三语）

### 后端技术栈
- **Cloudflare Workers** - 边缘计算运行环境
- **Cloudflare D1** - SQLite兼容的分布式数据库
- **Cloudflare R2** - S3兼容的对象存储服务
- **Cloudflare Pages** - 静态网站托管平台

### 开发工具
- **ESLint + TypeScript ESLint** - 代码质量检查
- **Vitest** - 单元测试框架
- **Playwright** - 端到端测试
- **PNPM** - 高效的包管理器

## Project Conventions

### Code Style
- **命名规范**:
  - 组件使用 PascalCase (ProductCard, AdminDashboard)
  - 函数和变量使用 camelCase (getUserData, isLoading)
  - 常量使用 UPPER_SNAKE_CASE (API_BASE_URL)
  - 文件名使用 kebab-case (product-card.tsx, user-service.ts)
- **文件组织**:
  - 每个组件一个文件夹，包含 index.tsx, styles.css, types.ts
  - 工具函数按功能模块分类到 lib/ 目录
  - 类型定义集中到 types/ 目录
- **导入顺序**:
  1. React 相关 (import React from 'react')
  2. 第三方库 (import { motion } from 'framer-motion')
  3. 内部组件 (import { Button } from '@/components/ui/button')
  4. 工具函数 (import { apiClient } from '@/lib/api')
  5. 类型定义 (import type { User } from '@/types/user')

### Architecture Patterns
- **组件化设计**: 采用原子设计理念，按钮、输入框等为基础原子组件
- **自定义Hook**: 业务逻辑抽取为可复用的Hook (useProducts, useAuth)
- **API层**: 统一的API客户端，错误处理和重试机制
- **状态管理**: 主要使用React内置状态，复杂状态使用useReducer
- **响应式设计**: Mobile-first设计原则，支持断点: sm(640px), md(768px), lg(1024px), xl(1280px)

### Testing Strategy
- **单元测试**: 使用Vitest + React Testing Library，覆盖率目标80%+
- **集成测试**: API接口和数据库操作测试
- **E2E测试**: 关键用户流程使用Playwright自动化测试
- **视觉回归测试**: UI组件变更检测
- **性能测试**: 页面加载速度和交互响应时间

### Git Workflow
- **分支策略**:
  - main: 生产环境稳定版本
  - develop: 开发环境集成分支
  - feature/*: 功能开发分支
  - hotfix/*: 紧急修复分支
- **提交规范**: 使用Conventional Commits
  - feat: 新功能
  - fix: Bug修复
  - docs: 文档更新
  - style: 代码格式调整
  - refactor: 代码重构
  - test: 测试相关
  - chore: 构建工具或辅助工具的变动

## Domain Context
### 行业背景
墙纸胶建筑装饰行业，主要客户群体：
- **国内客户**: 装饰公司、建筑工程承包商、建材经销商
- **国际客户**: 海外建材进口商、大型建筑工程项目
- **OEM客户**: 需要定制化墙纸胶产品的品牌商

### 产品特点
- **环保认证**: 产品通过多重环保标准认证
- **技术优势**: 专利配方，粘性强、环保无毒
- **应用场景**: 室内装修、高端建筑工程、特殊环境使用
- **产品线**: 基础系列、高端系列、专用系列、OEM定制

### 业务流程
1. **产品展示** → 客户浏览产品详情和技术参数
2. **OEM咨询** → 提交定制需求，技术团队对接
3. **样品申请** → 寄送样品进行测试
4. **商务洽谈** → 价格、交期、付款方式协商
5. **订单执行** → 生产、质检、发货、售后

## Important Constraints

### 技术约束
- **边缘计算限制**: Cloudflare Workers有CPU时间和内存限制
- **数据库限制**: D1数据库单个查询结果限制，需要分页处理
- **文件大小限制**: R2上传单个文件限制，需要客户端压缩
- **无状态设计**: Workers函数必须设计为无状态

### 业务约束
- **多语言要求**: 必须支持中文、英语、俄语完整界面
- **数据准确性**: 产品技术参数必须准确，错误信息可能影响商业合作
- **响应时间**: 网站加载速度必须在3秒以内
- **移动端兼容**: 必须支持主流移动设备浏览器

### 合规约束
- **数据保护**: 客户提交的联系信息需要GDPR合规处理
- **内容审核**: 网站内容需要符合广告法规定
- **无障碍访问**: 需要满足WCAG 2.1 AA级别标准

## External Dependencies

### Cloudflare生态系统
- **Cloudflare Pages**: 静态网站托管，自动部署
- **Cloudflare Workers**: API服务运行环境
- **Cloudflare D1**: SQLite数据库，存储产品和管理数据
- **Cloudflare R2**: 对象存储，存储产品图片和文件
- **Cloudflare CDN**: 全球内容分发网络

### 第三方服务
- **Google reCAPTCHA**: 防止机器人垃圾提交
- **国际化服务**: i18next资源管理和翻译
- **分析服务**: 可能集成Google Analytics或类似服务

### 开发工具依赖
- **包管理**: PNPM registry配置
- **CI/CD**: GitHub Actions（如果配置）
- **代码质量**: SonarQube或类似代码质量检查工具
