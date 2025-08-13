# Cloudflare Pages 部署指南

本指南将帮助您将项目部署到 Cloudflare Pages。

## 前置准备

1. 确保您有 Cloudflare 账户
2. 项目代码已推送到 GitHub 仓库
3. 准备好以下环境变量的值：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 部署步骤

### 1. 登录 Cloudflare Dashboard

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录您的账户。

### 2. 创建 Pages 项目

1. 在左侧导航栏中点击 "Pages"
2. 点击 "Create a project" 按钮
3. 选择 "Connect to Git"

### 3. 连接 GitHub 仓库

1. 选择 "GitHub" 作为 Git 提供商
2. 授权 Cloudflare 访问您的 GitHub 账户
3. 选择包含项目代码的仓库
4. 点击 "Begin setup"

### 4. 配置构建设置

在项目设置页面中配置以下信息：

- **Project name**: `kahn-building-materials`
- **Production branch**: `main`
- **Build command**: `pnpm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (保持默认)

### 5. 设置环境变量

在 "Environment variables" 部分添加以下变量：

```
VITE_SUPABASE_URL=您的Supabase项目URL
VITE_SUPABASE_ANON_KEY=您的Supabase匿名密钥
```

### 6. 部署项目

1. 检查所有配置是否正确
2. 点击 "Save and Deploy" 按钮
3. Cloudflare 将开始构建和部署您的项目

### 7. 验证部署

部署完成后：

1. 您将获得一个 Cloudflare Pages 域名（如：`kahn-building-materials.pages.dev`）
2. 访问该域名验证网站是否正常工作
3. 测试所有页面路由是否正常
4. 测试管理后台登录功能

## 自定义域名（可选）

如果您有自己的域名：

1. 在 Pages 项目设置中点击 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入您的域名
4. 按照提示配置 DNS 记录

## 后续更新

每当您向 GitHub 仓库的 `main` 分支推送代码时，Cloudflare Pages 将自动重新构建和部署您的网站。

## 故障排除

### 构建失败

如果构建失败，请检查：

1. 构建命令是否正确：`pnpm run build`
2. 输出目录是否正确：`dist`
3. 环境变量是否正确设置
4. 查看构建日志中的错误信息

### 路由问题

如果页面路由不工作：

1. 确保 `public/_redirects` 文件存在
2. 确保文件内容为：`/*    /index.html   200`

### 环境变量问题

如果功能不正常：

1. 检查环境变量名称是否正确（必须以 `VITE_` 开头）
2. 检查环境变量值是否正确
3. 重新部署项目以应用环境变量更改

## 支持

如果遇到问题，可以：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 检查构建日志中的详细错误信息
3. 联系技术支持