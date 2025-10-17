# Cloudflare Pages 自定义域名绑定指南

## 当前状态
- 新页头页尾设计已成功部署到 Cloudflare Pages
- 项目名称: `kn-wallpaperglue`
- 部署 URL: https://f8462761.kn-wallpaperglue.pages.dev (最新部署)
- 主域名 `kn-wallpaperglue.com` 目前仍指向旧项目

## 绑定步骤

### 1. 登录 Cloudflare 控制台
访问 [Cloudflare Dashboard](https://dash.cloudflare.com) 并使用您的账户登录

### 2. 进入 Pages 项目
1. 在左侧导航栏中点击 "Pages"
2. 在项目列表中找到并点击 `kn-wallpaperglue`

### 3. 添加自定义域名
1. 点击 "Settings" 标签
2. 向下滚动到 "Domains" 部分
3. 点击 "Add domain"
4. 输入您的域名: `kn-wallpaperglue.com`
5. 点击 "Add domain"

### 4. DNS 验证
1. Cloudflare 会自动为您添加一条 TXT 记录用于验证
2. 如果提示需要手动添加 DNS 记录，请按照指示操作
3. 等待 DNS 记录生效（通常几分钟）

### 5. 等待部署完成
1. DNS 变更可能需要几分钟到几小时生效
2. 您可以通过访问 https://kn-wallpaperglue.com 来检查是否已更新

## 验证更新
部署完成后，您可以访问以下地址来验证页头页尾更新：
- https://kn-wallpaperglue.com
- 检查页尾是否显示为简洁的4列布局
- 确认页头包含企业信息栏和优化的导航菜单

## 技术支持
如果遇到任何问题，请联系技术支持或查看 Cloudflare Pages 文档。