# 🚀 技能部署系统使用指南

## 📋 概述

这个技能部署系统可以自动化处理每次代码修改的完整部署流程，包括：
- Git操作（检查状态、添加文件、提交、推送）
- 项目构建
- Cloudflare Pages部署
- CDN缓存清理
- 部署验证

## 🎯 快速使用

### 完整部署（推荐）
```bash
node scripts/skill-deploy.js "修复SEO优化问题"
```

### 快速部署（跳过验证）
```bash
node scripts/skill-deploy.js quick
```

### 仅构建项目
```bash
node scripts/skill-deploy.js build
```

### 测试部署流程
```bash
node scripts/skill-deploy.js test
```

## 📜 可用的脚本

### 1. 主控脚本 `skill-deploy.js`
统一的部署控制脚本，支持多种部署模式。

### 2. Git自动化 `git-automation.js`
专门处理Git相关操作的工具。

### 3. Cloudflare部署 `cloudflare-deploy.js`
专门处理Cloudflare Pages部署的工具。

### 4. 原始部署脚本 `deploy-skill.js`
功能完整的部署脚本。

## ⚙️ 选项参数

```bash
node scripts/skill-deploy.js deploy [选项]

选项:
  -m, --message <text>      自定义提交信息
  --skip-git                跳过Git操作
  --skip-build              跳过构建步骤
  --skip-deploy             跳过Cloudflare部署
  --skip-cache              跳过缓存清理
  --skip-verify             跳过部署验证
  -f, --force               强制部署（跳过安全检查）
  --dry-run                 模拟运行（不实际部署）
  -h, --help                显示帮助信息
```

## 🔧 常用命令示例

### 日常部署
```bash
# 自动提交信息
node scripts/skill-deploy.js "添加新功能"

# 快速部署（跳过验证）
node scripts/skill-deploy.js quick

# 强制部署
node scripts/skill-deploy.js deploy --force
```

### 跳过特定步骤
```bash
# 跳过Git操作（仅部署当前状态）
node scripts/skill-deploy.js deploy --skip-git

# 跳过构建（仅部署已有构建）
node scripts/skill-deploy.js deploy --skip-build

# 跳过验证（加快部署速度）
node scripts/skill-deploy.js deploy --skip-verify
```

### 测试和调试
```bash
# 模拟运行（查看将要执行的操作）
node scripts/skill-deploy.js test

# 仅Git操作
node scripts/git-automation.js auto

# 仅Cloudflare部署
node scripts/cloudflare-deploy.js deploy
```

## 📊 部署流程详解

### 完整部署流程包含以下步骤：

1. **预检查**
   - 检查项目目录
   - 验证Git状态
   - 检查修改的文件

2. **Git操作**
   - 添加修改的文件到暂存区
   - 生成智能提交信息
   - 提交更改
   - 推送到远程仓库

3. **项目构建**
   - 清理旧的构建文件
   - 安装/更新依赖
   - 执行构建命令
   - 验证构建结果

4. **Cloudflare部署**
   - 检查Wrangler CLI
   - 部署到Cloudflare Pages
   - 获取部署URL

5. **缓存清理**
   - 等待部署生效
   - 清理Cloudflare CDN缓存
   - 创建缓存清理文件

6. **部署验证**
   - 检查网站可访问性
   - 验证关键页面
   - 生成验证报告

## 🌐 网站信息

- **生产网站**: https://kn-wallpaperglue.com
- **FAQ页面**: https://kn-wallpaperglue.com/faq
- **产品页面**: https://kn-wallpaperglue.com/products
- **关于页面**: https://kn-wallpaperglue.com/about

## 🔍 故障排除

### 常见问题

1. **Git操作失败**
   - 检查是否有未提交的冲突
   - 确认远程仓库访问权限
   - 使用 `--force` 强制执行

2. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 确认依赖正确安装
   - 查看构建日志中的错误信息

3. **Cloudflare部署失败**
   - 检查Wrangler CLI是否正确安装
   - 确认Cloudflare账户权限
   - 验证项目配置

4. **缓存清理失败**
   - 这不会影响主要部署功能
   - 可以手动在Cloudflare控制台清理缓存

### 调试技巧

```bash
# 查看详细日志
DEBUG=1 node scripts/skill-deploy.js deploy

# 模拟运行查看问题
node scripts/skill-deploy.js test --dry-run

# 分步执行
node scripts/git-automation.js status
node scripts/cloudflare-deploy.js build
node scripts/cloudflare-deploy.js deploy
```

## 📈 部署统计

使用测试脚本查看当前状态：
```bash
node scripts/test-deploy.cjs
```

这个命令会显示：
- 项目状态
- Git状态
- 构建工具版本
- 部署脚本状态
- 使用说明

## 💡 最佳实践

1. **提交信息规范**
   ```bash
   node scripts/skill-deploy.js "feat: 添加新功能"
   node scripts/skill-deploy.js "fix: 修复bug"
   node scripts/skill-deploy.js "docs: 更新文档"
   ```

2. **定期清理**
   - 定期运行完整部署确保所有更改都已同步
   - 使用 `--force` 跳过检查时确保了解影响

3. **备份策略**
   - 重要更改前先手动备份
   - 使用 `test` 命令验证配置

## 🎉 完成

现在您拥有了一个完整的自动化部署技能系统！每次修改代码后，只需运行简单的命令就能自动完成所有部署步骤并清理服务器缓存。

---

**记住关键命令：**
```bash
node scripts/skill-deploy.js "你的提交信息"  # 完整部署
node scripts/skill-deploy.js quick             # 快速部署
```