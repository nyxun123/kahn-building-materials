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

---

## BMAD 多代理协作开发系统

本项目已集成 **BMAD (Business Model Architecture Design)** 系统，提供从需求分析到实现的完整多代理协作工作流。

### 系统架构

```
_bmad/                          # BMAD 核心系统（单一数据源）
├── _config/                    # 配置清单和代理定制
│   ├── workflow-manifest.csv   # 32+ 工作流注册表
│   ├── agent-manifest.csv      # 10 个专业化代理
│   └── agents/                 # 代理行为定制文件
├── core/                       # 核心工作流和资源
│   ├── agents/                 # 主控代理 (bmad-master)
│   ├── workflows/              # 核心工作流 (brainstorming, party-mode)
│   └── resources/              # 共享资源 (Excalidraw, templates)
└── bmm/                        # 业务建模模块
    ├── agents/                 # 业务领域代理 (analyst, architect, dev, pm等)
    ├── workflows/              # 业务工作流 (Analysis → Plan → Solution → Implement)
    ├── testarch/               # 测试架构知识库
    └── data/                   # 知识库和文档标准

_bmad-output/                   # 生成的人工产物（不要编辑）
├── planning-artifacts/         # 需求、PRD、架构、Epic/Story
└── implementation-artifacts/   # Sprint状态、Story文件、实现输出
```

### 10 个专业化代理

| 代理 | 角色 | 专业领域 |
|------|------|----------|
| **bmad-master** | 总控代理 | 任务执行、工作流协调 |
| **analyst (Mary)** | 业务分析师 | 市场研究、需求分析、竞品分析 |
| **architect (Winston)** | 系统架构师 | 分布式系统、可扩展性、技术设计 |
| **dev (Amelia)** | 开发工程师 | Story执行、TDD、严格AC遵守 |
| **pm (John)** | 产品经理 | 用户访谈、PRD编写、利益相关者对齐 |
| **sm (Bob)** | Scrum Master | Story准备、Sprint规划 |
| **tea (Murat)** | 测试架构师 | API测试、CI/CD、质量门控 |
| **tech-writer (Paige)** | 技术文档工程师 | 文档、CommonMark标准 |
| **ux-designer (Sally)** | UX设计师 | 用户研究、交互设计 |
| **quick-flow-solo-dev (Barry)** | 全栈开发 | 快速流专家、精益实现 |

### 工作流分类

#### 阶段 1 - 分析 (Analysis)
- `create-product-brief`: 协作产品发现
- `research`: 市场、技术、领域研究

#### 阶段 2 - 规划 (Planning)
- `prd`: 三模态PRD工作流 (create/validate/edit)
- `create-ux-design`: UX模式和设计规划

#### 阶段 3 - 解决方案 (Solutioning)
- `check-implementation-readiness`: PRD/架构/Epic的对抗性验证
- `create-architecture`: 协作架构决策促进
- `create-epics-and-stories`: 将需求转换为可实现的故事

#### 阶段 4 - 实现 (Implementation)
- `sprint-planning`: 生成Sprint状态跟踪
- `create-story`: 创建增强上下文的下一个用户故事
- `dev-story`: 使用TDD执行Story实现
- `code-review`: 对抗性评审（发现3-10个具体问题）
- `correct-course`: Sprint期间的重大变更导航
- `sprint-status`: 总结Sprint并路由到适当的工作流
- `retrospective`: Epic后的回顾和经验教训

#### 特殊工作流
- `quick-spec`: 对话式规范工程
- `quick-dev`: 灵活的开发执行
- `document-project`: 现有代码库分析和文档化
- `party-mode`: 多代理讨论编排
- `brainstorming`: 交互式创意会议

#### 测试架构工作流
- `testarch-framework`: 初始化测试框架 (Playwright/Cypress)
- `testarch-attdb`: 验收测试驱动开发
- `testarch-test-design`: 系统级可测试性评审
- `testarch-automate`: 测试自动化覆盖扩展
- `testarch-nfr`: 非功能性需求评估

#### Excalidraw 图表工作流
- `create-excalidraw-diagram`: 系统架构、ERD、UML图
- `create-excalidraw-flowchart`: 流程图和逻辑可视化
- `create-excalidraw-dataflow`: 数据流图
- `create-excalidraw-wireframe`: UI/UX线框图

### 使用 BMAD 系统

#### 启动工作流
向 AI 助手说明需求，例如：
- "我要开始一个新功能开发" → 选择 `prd` 工作流
- "我需要分析现有代码" → 选择 `document-project` 工作流
- "帮我快速实现一个功能" → 选择 `quick-spec` → `quick-dev`

#### 关键原则
- **Step-File 架构**: 每个步骤是自包含的指令文件
- **即时加载**: 只加载当前步骤 - 绝不预加载未来步骤
- **顺序执行**: 按顺序执行步骤，不跳过或优化
- **状态跟踪**: 更新输出 frontmatter 中的 `stepsCompleted` 数组
- **追加构建**: 按指示通过追加内容构建文档

#### 文档标准
所有文档必须遵循 **CommonMark 规范**：
- 标题：仅 ATX 样式（`#` `##` `###`），`#` 后空一格，无尾部 `#`
- 代码块：带语言标识符的围栏块（` ```javascript `）
- 列表：一致的标记（全用 `-` 或全用 `*`），正确的嵌套缩进
- 链接：内联样式 `[text](url)` 或引用样式
- **禁止时间估算**: 永远不要记录持续时间、完成时间或时间测量

#### Mermaid 图表
- 始终在第一行指定图表类型
- 使用有效的 Mermaid v10+ 语法
- 输出前测试语法
- 保持聚焦：理想5-10个节点，最多15个

### 配置文件

#### 核心配置 (`_bmad/core/config.yaml`)
```yaml
user_name: Nie Lei
communication_language: 中文
document_output_language: 中文
output_folder: "{project-root}/_bmad-output"
```

#### BMM 配置 (`_bmad/bmm/config.yaml`)
```yaml
project_name: 墙纸胶企业官网
user_skill_level: intermediate
planning_artifacts: "{project-root}/_bmad-output/planning-artifacts"
implementation_artifacts: "{project-root}/_bmad-output/implementation-artifacts"
project_knowledge: "{project-root}/docs"
tea_use_mcp_enhancements: true
tea_use_playwright_utils: true
```

### 典型开发流程

#### 新功能开发
1. **分析**: `create-product-brief` → `research`
2. **规划**: `prd` → `create-ux-design`
3. **解决方案**: `check-implementation-readiness` → `create-architecture` → `create-epics-and-stories`
4. **实现**: `sprint-planning` → `create-story` → `dev-story` → `code-review`
5. **评审**: `retrospective`

#### 快速流程替代方案
- `quick-spec` → `quick-dev`（最小仪式，直接实现）

### 资源和工具

#### Excalidraw 集成
- 位置: `_bmad/core/resources/excalidraw/`
- JSON 模式验证: `validate-json-instructions.md`
- 支持图表、流程图、线框图、数据流

#### 测试架构知识库
- 位置: `_bmad/bmm/data/testarch/`
- 专业测试最佳实践和模式
- 由测试架构师代理用于工作流执行

#### 文档标准
- 完整参考: `_bmad/bmm/data/documentation-standards.md`
- CommonMark 合规规则
- Mermaid 图表语法指南

### 定制化

#### 代理定制
编辑 `_bmad/_config/agents/*.customize.yaml` 以覆盖：
- 代理人设、角色、身份、沟通风格
- 关键动作和菜单项
- 持久记忆和自定义提示

#### 模板定制
- 在 `.spec-workflow/user-templates/` 中添加用户模板
- 按项目覆盖默认模板

#### 工作流定制
- 根据需要修改工作流步骤文件
- 保持 step-file 架构原则
- 添加/删除工作流时更新清单