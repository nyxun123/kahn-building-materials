# 🚀 卡恩官网自动部署技能使用指南

**版本**: 1.0.0
**更新时间**: 2025年11月19日
**适用网站**: https://kn-wallpaperglue.com

---

## 📋 概述

这是一个全自动化部署系统，专门为卡恩官网设计。每次你修改任务时，系统会自动：

1. ✅ **智能检测** 重要文件变更
2. ✅ **自动提交** 到Git仓库
3. ✅ **自动推送** 到远程仓库
4. ✅ **等待部署** Cloudflare Pages
5. ✅ **自动验证** 部署结果
6. ✅ **生成报告** 详细执行记录

**无需手动提醒，完全自动化！**

---

## 🛠️ 核心技能文件

### 1. 主要技能
- `scripts/auto-deploy-skill.cjs` - 核心自动部署技能
- `scripts/integrated-seo-deploy.cjs` - SEO优化+自动部署集成技能
- `scripts/smart-deploy-trigger.cjs` - 智能部署触发器

### 2. 集成技能
- `scripts/seo-master-skill.cjs` - SEO主控技能 (已集成自动部署)

---

## 🚀 快速使用

### 基础自动部署
```bash
# 检测变更并自动部署
node scripts/auto-deploy-skill.cjs

# 强制部署（忽略变更检测）
node scripts/auto-deploy-skill.cjs --force

# 查看帮助
node scripts/auto-deploy-skill.cjs --help
```

### SEO优化 + 自动部署
```bash
# 完整SEO优化 + 自动部署
node scripts/integrated-seo-deploy.cjs

# 仅内容营销 + 自动部署
node scripts/integrated-seo-deploy.cjs --content-only

# 仅SEO监控 + 自动部署
node scripts/integrated-seo-deploy.cjs --monitoring-only

# 查看帮助
node scripts/integrated-seo-deploy.cjs --help
```

### 编程接口调用
```javascript
const { autoDeployAfterTask } = require('./scripts/smart-deploy-trigger.cjs');

// 在任何任务完成后自动部署
await autoDeployAfterTask('任务名称', '任务描述');
```

---

## 📁 监控的文件类型

### 🎯 重要文件 (会触发自动部署)
- `index.html` - 网站主页面
- `public/` - 静态资源目录
  - `*.xml` - Sitemap文件
  - `*.html` - 验证文件
  - `*.ico` - 图标文件
- `src/` - 源代码目录
  - `*.tsx`, `*.jsx` - React组件
  - `*.ts`, `*.js` - JavaScript/TypeScript
- 配置文件
  - `package.json`
  - `vite.config.js`
  - `tailwind.config.js`
  - `_redirects`

### 🚫 忽略的文件 (不会触发部署)
- `node_modules/`
- `.git/`
- `dist/`
- `docs/`
- `scripts/`
- `*.md` (Markdown文件)
- `.DS_Store`

---

## 🔄 自动化流程

### 检测阶段
```
🔍 Git状态检测 → 📂 文件过滤 → 🎯 重要文件识别
```

### 部署阶段
```
➕ Git添加 → 💬 智能提交 → 📤 远程推送 → ⏳ 等待部署
```

### 验证阶段
```
🌐 网站访问检查 → 🔍 SEO标签验证 → 📋 生成报告
```

---

## 📊 部署报告

每次自动部署都会生成详细报告：

### JSON报告
`deployment-report-时间戳.json` - 包含完整的执行数据

### Markdown报告
`deployment-report-时间戳.md` - 可读性强的执行总结

### 报告内容
- ✅ 变更文件列表
- ✅ Git提交信息
- ✅ 部署状态
- ✅ 验证结果
- ✅ 错误信息
- ✅ 访问链接

---

## ⚡ 智能特性

### 🤖 智能提交信息
自动生成包含时间戳和变更详情的提交信息

### 🔍 智能验证
根据变更类型验证相应的功能（如HTML变更验证SEO标签）

### ⏰ 智能等待
自动等待Cloudflare Pages部署完成，最多等待5分钟

### 📊 智能过滤
只处理重要文件变更，忽略临时文件和文档

---

## 🛡️ 安全特性

### Git安全
- 使用标准Git命令
- 保留所有Git历史
- 支持分支管理

### 部署安全
- 只推送到main分支
- 验证部署成功
- 错误回滚机制

### 数据安全
- 本地执行，不上传敏感信息
- 报告仅保存本地
- 支持自定义忽略规则

---

## 🔧 自定义配置

### 修改监控文件
编辑 `scripts/auto-deploy-skill.cjs` 中的 `importantFiles` 数组：

```javascript
// 添加新的监控文件类型
this.importantFiles.push('new-directory/');
```

### 修改忽略规则
编辑 `ignorePatterns` 数组：

```javascript
// 添加新的忽略模式
this.ignorePatterns.push('temp/');
```

### 修改等待时间
编辑 `waitForDeployment` 方法中的设置：

```javascript
const maxWaitTime = 10 * 60 * 1000; // 改为10分钟
const checkInterval = 15 * 1000;     // 改为15秒检查一次
```

---

## 🚨 故障排除

### 常见问题

#### 1. Git权限问题
```bash
# 确保Git配置正确
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 2. 网络连接问题
```bash
# 检查网络连接
curl -I https://kn-wallpaperglue.com

# 检查Git远程连接
git remote -v
```

#### 3. 部署超时
- 通常只是需要更多时间，Cloudflare Pages仍在处理
- 可以手动访问网站检查部署状态

### 调试模式

启用详细日志输出：
```bash
DEBUG=1 node scripts/auto-deploy-skill.cjs
```

---

## 📈 最佳实践

### 1. 定期使用
每次修改重要文件后运行自动部署

### 2. 检查报告
定期查看生成的部署报告，了解系统状态

### 3. 监控性能
关注部署时间和成功率

### 4. 备份重要
定期备份重要的配置文件和报告

---

## 🎯 使用场景

### 日常开发
```bash
# 修改文件后
node scripts/auto-deploy-skill.cjs
```

### SEO优化
```bash
# 完整SEO优化并部署
node scripts/integrated-seo-deploy.cjs
```

### 紧急修复
```bash
# 强制部署修复
node scripts/auto-deploy-skill.cjs --force --reason="紧急修复"
```

### 定期维护
```bash
# 每周SEO检查并部署
node scripts/integrated-seo-deploy.cjs --monitoring-only
```

---

## 📞 技术支持

如果遇到问题：

1. 查看生成的部署报告
2. 检查Git和网络连接
3. 确认文件权限正确
4. 查看Cloudflare Pages部署状态

---

**🎉 现在你有了完全自动化的部署系统！**

*每次修改任务，系统都会自动部署到生产环境，无需手动干预。*