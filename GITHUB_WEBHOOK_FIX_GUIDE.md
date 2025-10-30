# GitHub Webhook 修复指南

## 📋 问题概述

**当前状态**：
- ✅ 代码已提交到 Git（commit b99d7c9 和 76ae3f8）
- ✅ 代码已推送到 GitHub
- ❌ Cloudflare Pages 没有自动部署
- ❌ GitHub Webhook 可能未配置或失效

**目标**：
- 修复 GitHub Webhook，让推送自动触发 Cloudflare Pages 部署
- 确保部署包含 D1 数据库和 R2 存储桶绑定

---

## 🚀 方案 1: Cloudflare Pages 控制台手动触发部署（推荐，最快）

### 步骤 1: 打开 Cloudflare Pages 控制台

1. 访问：https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/pages/view/kahn-building-materials

2. 你应该看到：
   - 项目名称：kahn-building-materials
   - 域名：kn-wallpaperglue.com
   - 最近的部署列表

### 步骤 2: 手动触发部署

**方法 A: 重新部署最新的 commit**

1. 在部署列表中，找到最新的部署（可能是 2 小时前的）
2. 点击该部署右侧的 **"..."** 菜单
3. 选择 **"Retry deployment"** 或 **"重新部署"**
4. 等待 2-3 分钟，部署完成

**方法 B: 创建新部署**

1. 点击页面右上角的 **"Create deployment"** 或 **"创建部署"** 按钮
2. 选择部署方式：
   - **Production branch**: `main`
   - **Source**: GitHub
3. Cloudflare 会自动从 GitHub 拉取最新代码
4. 等待构建和部署完成

### 步骤 3: 验证部署

部署完成后，测试登录 API：

```bash
curl -X POST "https://kn-wallpaperglue.com/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin#2025"}' | jq
```

**预期结果**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "authType": "JWT",  ← 应该是 JWT，不是 D1_DATABASE
    "expiresIn": 900
  }
}
```

---

## 🔧 方案 2: 检查并修复 GitHub Webhook

### 步骤 1: 访问 GitHub Webhook 设置

1. 打开浏览器，访问：
   ```
   https://github.com/nyxun123/kahn-building-materials/settings/hooks
   ```

2. 如果看到 404 错误，请确保：
   - 你已登录 GitHub
   - 你有该仓库的管理员权限

### 步骤 2: 检查现有 Webhook

在 Webhooks 页面，你应该看到：

**如果有 Cloudflare Pages Webhook**：
- Payload URL: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`
- Content type: `application/json`
- Events: `Just the push event` 或 `Let me select individual events`
- Active: ✅（绿色勾号）

**检查 Recent Deliveries**：
1. 点击 Webhook 进入详情页
2. 查看 "Recent Deliveries" 标签
3. 找到最近的推送记录（commit b99d7c9 和 76ae3f8）

**如果显示成功（绿色勾号）**：
- Webhook 配置正确，但 Cloudflare 可能没有触发部署
- 尝试方案 1 手动触发部署

**如果显示失败（红色 X）**：
- 点击查看错误详情
- 常见错误：
  - `401 Unauthorized`: Webhook Secret 不匹配
  - `404 Not Found`: Webhook URL 错误
  - `500 Internal Server Error`: Cloudflare 服务问题

### 步骤 3: 重新发送 Webhook（如果失败）

1. 在失败的 Delivery 详情页
2. 点击右上角的 **"Redeliver"** 按钮
3. 确认重新发送
4. 等待 1-2 分钟，检查 Cloudflare Pages 是否开始部署

### 步骤 4: 修复 Webhook 配置（如果错误）

**如果 Webhook URL 错误**：
1. 点击 Webhook 进入编辑页面
2. 更新 Payload URL（从 Cloudflare Pages 控制台获取）
3. 保存更改

**如果 Webhook Secret 不匹配**：
1. 在 Cloudflare Pages 控制台，进入项目设置
2. 找到 "Build & deployments" → "Deploy hooks"
3. 重新生成 Deploy Hook URL
4. 复制新的 URL 和 Secret
5. 在 GitHub Webhook 设置中更新

---

## 🔄 方案 3: 重新连接 GitHub 集成

### 何时使用此方案

- Webhook 完全不存在
- Webhook 无法修复
- 想要重新建立 GitHub 和 Cloudflare Pages 的连接

### 步骤 1: 在 Cloudflare Pages 中断开 GitHub

1. 访问：https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/pages/view/kahn-building-materials
2. 进入 **"Settings"** 标签
3. 找到 **"Build & deployments"** 部分
4. 点击 **"Disconnect from GitHub"** 或类似选项

### 步骤 2: 重新连接 GitHub

1. 在同一页面，点击 **"Connect to Git"**
2. 选择 **GitHub**
3. 授权 Cloudflare Pages 访问你的 GitHub 账户
4. 选择仓库：`nyxun123/kahn-building-materials`
5. 配置构建设置：
   - **Production branch**: `main`
   - **Build command**: `pnpm run build:cloudflare`
   - **Build output directory**: `dist`
6. 点击 **"Save and Deploy"**

### 步骤 3: 配置环境变量和绑定

重新连接后，需要重新配置：

**D1 数据库绑定**：
1. 进入 **"Settings"** → **"Functions"**
2. 添加 D1 绑定：
   - Variable name: `DB`
   - D1 database: `kaneshuju`

**R2 存储桶绑定**：
1. 在同一页面添加 R2 绑定：
   - Variable name: `IMAGE_BUCKET`
   - R2 bucket: `kaen`

**环境变量**：
1. 进入 **"Settings"** → **"Environment variables"**
2. 添加：
   - `R2_PUBLIC_DOMAIN`: `https://pub-b9f0c2c358074609bf8701513c879957.r2.dev`
   - `ENVIRONMENT`: `production`

### 步骤 4: 触发首次部署

1. 重新连接后，Cloudflare 会自动触发首次部署
2. 等待 2-3 分钟
3. 验证部署是否成功

---

## 🧪 验证修复结果

### 1. 检查 Cloudflare Pages 部署

```bash
wrangler pages deployment list --project-name=kahn-building-materials | head -10
```

**预期结果**：
- 应该看到新的部署记录
- Commit 应该是 `76ae3f8` 或 `b99d7c9`
- 状态应该是 "Success"

### 2. 测试登录 API

```bash
curl -X POST "https://kn-wallpaperglue.com/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin#2025"}' | jq '.data.authType'
```

**预期结果**：
```
"JWT"
```

### 3. 测试自动部署

创建一个测试提交：

```bash
git commit --allow-empty -m "test: verify GitHub webhook"
git push origin main
```

等待 2-3 分钟，检查 Cloudflare Pages 是否自动开始部署。

---

## 📞 常见问题

### Q1: 手动部署成功，但自动部署仍然失败？

**原因**：GitHub Webhook 仍然有问题

**解决**：
1. 按照方案 2 检查 Webhook
2. 或者按照方案 3 重新连接 GitHub 集成

### Q2: 部署成功，但 API 仍然返回 500 错误？

**原因**：D1 数据库或 R2 存储桶绑定缺失

**解决**：
1. 检查 Cloudflare Pages 设置中的绑定配置
2. 确保 D1 和 R2 绑定正确
3. 重新部署

### Q3: 如何获取 Cloudflare Pages 的 Deploy Hook URL？

**步骤**：
1. 访问 Cloudflare Pages 项目设置
2. 进入 "Build & deployments" → "Deploy hooks"
3. 点击 "Create deploy hook"
4. 复制生成的 URL

### Q4: GitHub Webhook 一直显示失败？

**可能原因**：
- Cloudflare API 问题
- Webhook URL 过期
- 网络问题

**解决**：
- 尝试重新生成 Deploy Hook
- 或者使用方案 3 重新连接 GitHub

---

## 📊 总结

**最快的解决方案**：
1. 使用方案 1 在 Cloudflare Pages 控制台手动触发部署
2. 验证部署成功后，再修复 Webhook

**长期解决方案**：
1. 检查并修复 GitHub Webhook（方案 2）
2. 或者重新连接 GitHub 集成（方案 3）
3. 确保自动部署正常工作

**关键点**：
- ✅ 代码已经在 GitHub 上（commit b99d7c9 包含 JWT 修复）
- ✅ 只需要触发一次正确的部署
- ✅ 部署后会自动包含 D1 和 R2 绑定
- ✅ 修复 Webhook 后，未来的推送会自动部署

---

## 🎯 下一步行动

**立即执行**：
1. 打开 Cloudflare Pages 控制台
2. 手动触发部署（方案 1）
3. 等待部署完成
4. 测试登录 API

**后续优化**：
1. 检查 GitHub Webhook 状态
2. 修复或重新配置 Webhook
3. 测试自动部署功能

---

**需要帮助？**
- Cloudflare Pages 文档：https://developers.cloudflare.com/pages/
- GitHub Webhooks 文档：https://docs.github.com/en/webhooks

