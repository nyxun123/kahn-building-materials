# 中文快速开始指南

## 项目概述
这是一个基于 React + TypeScript + Vite 构建的多语言企业网站，专为杭州卡恩新型建材有限公司设计。

## 快速开始

### 1. 环境准备
确保已安装以下工具：
- Node.js (版本 18+)
- pnpm (包管理器)
- Git (版本控制)

### 2. 项目初始化
```bash
# 克隆项目仓库
git clone <项目地址>

# 进入项目目录
cd kahn-building-materials

# 安装依赖
npm install
```

### 3. 本地开发
```bash
# 启动开发服务器
npm run dev
```
访问 http://localhost:5173 查看网站

### 4. 构建项目
```bash
# 构建生产版本
npm run build
```

### 5. 代码检查
```bash
# 运行代码规范检查
npm run lint
```

## 目录结构
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
├── public/                 # 静态资源
├── dist/                   # 构建输出
└── docs/                   # 文档
```

## 核心功能

### 前端功能
- 多语言支持（中文/英文/俄文）
- 响应式设计适配移动端
- 产品展示和搜索
- 联系表单提交
- 公司信息展示

### 后端功能
- 管理员登录认证
- 产品管理CRUD操作
- 联系消息管理
- 内容管理系统
- 数据统计仪表板

## 管理后台

### 访问地址
- 登录页面: `/admin/login`
- 管理面板: `/admin/dashboard`

### 默认账户
- 邮箱: niexianlei0@gmail.com
- 密码: XIANche041758

### 功能模块
1. 仪表板 - 系统概览和统计数据
2. 产品管理 - 产品增删改查
3. 联系消息 - 用户留言管理
4. 内容管理 - 网站内容编辑

## 部署流程

### Cloudflare Pages 部署
1. 构建项目: `npm run build`
2. 部署命令: `npx wrangler pages deploy dist --project-name="kahn-building-materials"`
3. 绑定自定义域名: kn-wallpaperglue.com

### 环境变量配置
```bash
VITE_API_BASE_URL=https://kn-wallpaperglue.com
VITE_SUPABASE_URL=https://ypjtdfsociepbzfvxzha.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 常见问题

### 1. 管理员登录失败
**问题**: 登录页面提示"请输入有效的电子邮箱地址"
**解决方案**: 
- 检查邮箱格式是否正确
- 清除浏览器缓存后重试
- 参考 `FINAL_ADMIN_DEPLOYMENT.md` 文件中的修复方案

### 2. API 404错误
**问题**: 前端无法获取数据
**解决方案**:
- 检查环境变量配置
- 确认Cloudflare Workers部署状态
- 验证API端点是否正确

### 3. 图片上传失败
**问题**: 产品图片无法上传
**解决方案**:
- 检查Cloudflare R2存储桶配置
- 验证文件大小是否超过限制
- 确认网络连接稳定

## 技术支持

### 文档资源
- `IFLOW.md` - 项目上下文和架构说明
- `AGENTS.md` - Agents团队配置
- `HOW_TO_USE_AGENTS.md` - Agents使用指南
- `AGENT_WORKFLOWS.md` - 工作流程规范

### 问题处理
1. 查阅相关文档
2. 检查错误日志
3. 联系技术支持团队
4. 提交问题报告

## 后续开发

### 功能扩展
1. 添加新页面: 创建页面组件并注册路由
2. 添加新API: 在 `functions/api/_worker.js` 中添加处理函数
3. 添加新组件: 在 `src/components/` 中创建新组件

### 性能优化
1. 代码分割优化
2. 资源缓存策略
3. 数据库查询优化
4. API响应缓存

### 安全加固
1. 输入验证和过滤
2. SQL注入防护
3. XSS攻击防护
4. 访问控制加强