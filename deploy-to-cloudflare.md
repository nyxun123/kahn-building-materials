# 🚀 Cloudflare Pages 一键部署指南

## 📋 你需要做的事情（只需要 3 步）

### 第 1 步：获取 Supabase 配置信息
1. 打开 https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧 "Settings" → "API"
4. 复制以下两个值：
   - Project URL（项目 URL）
   - anon public（匿名公钥）

### 第 2 步：访问 Cloudflare Pages 设置
1. 打开 https://dash.cloudflare.com/pages
2. 点击你的项目 "kahn-building-materials"
3. 点击 "Settings"
4. 点击 "Environment variables"

### 第 3 步：添加环境变量
点击 "Add variable" 两次，分别添加：

**第一个变量：**
- Name: `VITE_SUPABASE_URL`
- Value: 第1步复制的 Project URL
- Environment: 选择 Production 和 Preview

**第二个变量：**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: 第1步复制的 anon public
- Environment: 选择 Production 和 Preview

### 第 4 步：修改构建设置
在同一个 Settings 页面：
1. 找到 "Build configurations"
2. 将 "Build command" 改为：`pnpm install && pnpm run build`
3. 确认 "Build output directory" 是：`dist`
4. 点击 "Save"

### 第 5 步：重新部署
1. 回到项目主页
2. 点击最新的部署
3. 点击 "Retry deployment"

## 🎯 如果还是不会操作

请告诉我你在哪一步卡住了，我会提供更详细的指导！
