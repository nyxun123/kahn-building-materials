# Agents CLI 使用指南

## 概述
Agents CLI 是一个命令行工具，提供类似 Claude Code 的子代理功能，可以直接在开发中调用不同的专业代理来完成特定任务。

## 安装和设置

### 确保依赖已安装
```bash
# 项目已经配置了所有必要依赖
# Agent CLI工具已集成到项目中
```

### 给脚本添加执行权限
```bash
chmod +x scripts/agent-cli.cjs
```

## 使用方法

### 查看帮助信息
```bash
npm run agent -- help
# 或者
node scripts/agent-cli.cjs help
```

### 列出所有可用代理
```bash
npm run agent -- list
# 或者
node scripts/agent-cli.cjs list
```

### 调用代理执行任务
```bash
npm run agent -- call <代理名称> "<任务描述>"
# 或者
node scripts/agent-cli.cjs call <代理名称> "<任务描述>"
```

## 可用代理

### 1. 前端开发代理 (frontend)
**职责**: React组件开发、UI/UX实现、响应式设计
**技能**: React, TypeScript, Tailwind CSS, Vite

**使用示例**:
```bash
# 创建新组件
npm run agent -- call frontend "创建产品卡片组件"

# 创建新页面
npm run agent -- call frontend "创建关于我们页面"

# 创建样式文件
npm run agent -- call frontend "创建导航栏样式"
```

### 2. 后端API代理 (backend)
**职责**: Cloudflare Workers API开发、数据验证、性能优化
**技能**: JavaScript, Cloudflare Workers, RESTful API, D1数据库

**使用示例**:
```bash
# 创建API端点
npm run agent -- call backend "创建产品管理API"

# 创建认证接口
npm run agent -- call backend "创建用户登录API"

# 创建数据处理函数
npm run agent -- call backend "创建订单处理函数"
```

### 3. 数据库代理 (database)
**职责**: D1数据库设计、数据迁移、性能优化
**技能**: SQL, Cloudflare D1, 数据建模, 性能优化

**使用示例**:
```bash
# 创建数据表
npm run agent -- call database "创建产品表"

# 创建数据迁移
npm run agent -- call database "创建用户表迁移"

# 创建索引
npm run agent -- call database "为产品表创建索引"
```

### 4. 运维代理 (devops)
**职责**: 部署、监控、环境管理
**技能**: Cloudflare, CI/CD, 监控, 性能分析

**使用示例**:
```bash
# 部署应用
npm run agent -- call devops "部署前端应用到生产环境"

# 配置监控
npm run agent -- call devops "配置性能监控"

# 环境设置
npm run agent -- call devops "设置测试环境变量"
```

## 实际使用示例

### 示例1: 创建新的产品展示功能
```bash
# 1. 创建产品组件
npm run agent -- call frontend "创建产品卡片组件"

# 2. 创建产品页面
npm run agent -- call frontend "创建产品列表页面"

# 3. 创建产品API
npm run agent -- call backend "创建产品管理API"

# 4. 创建产品表
npm run agent -- call database "创建产品表"
```

### 示例2: 实现用户认证系统
```bash
# 1. 创建登录页面
npm run agent -- call frontend "创建用户登录页面"

# 2. 创建认证API
npm run agent -- call backend "创建用户认证API"

# 3. 创建用户表
npm run agent -- call database "创建用户表"
```

## 开发自定义代理

### 添加新代理
在 `scripts/agent-cli.cjs` 文件中添加新的代理定义：

```javascript
const AGENTS = {
  // ...现有代理
  
  'new-agent': {
    name: '新代理名称',
    description: '代理描述',
    skills: ['技能1', '技能2', '技能3'],
    execute: function(task) {
      // 实现代理功能
      return '任务执行结果';
    }
  }
};
```

## 故障排除

### 常见问题

1. **权限问题**:
   ```bash
   # 确保脚本有执行权限
   chmod +x scripts/agent-cli.cjs
   ```

2. **命令执行失败**:
   ```bash
   # 检查Node.js版本
   node --version
   
   # 确保使用正确的命令格式
   npm run agent -- call frontend "任务描述"
   ```

## 最佳实践

### 1. 任务描述清晰
```bash
# 好的做法
npm run agent -- call frontend "创建产品详情页面，包含图片展示和描述信息"

# 避免模糊描述
npm run agent -- call frontend "创建页面"  # 太模糊
```

### 2. 组合使用多个代理
```bash
# 对于复杂功能，组合使用多个代理
npm run agent -- call frontend "创建购物车组件"
npm run agent -- call backend "创建购物车API"
npm run agent -- call database "创建购物车表"
```

### 3. 版本控制
```bash
# 使用Git跟踪代理生成的代码
git add .
git commit -m "feat: 使用agents cli创建产品管理功能"
```

## 扩展功能

### 集成到开发流程
可以在 `package.json` 中添加快捷命令：

```json
{
  "scripts": {
    "agent": "node ./scripts/agent-cli.cjs",
    "create-component": "npm run agent -- call frontend",
    "create-api": "npm run agent -- call backend",
    "create-table": "npm run agent -- call database"
  }
}
```

这样就可以使用更简洁的命令：
```bash
npm run create-component "创建用户头像组件"
npm run create-api "创建用户管理接口"
npm run create-table "创建订单表"
```