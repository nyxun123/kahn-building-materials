# Cloudflare Pages部署指南

## 🔗 部署步骤

### 1. 部署到Cloudflare Pages
```bash
# 安装依赖
npm install -g wrangler

# 设置API Token
export CLOUDFLARE_API_TOKEN=your_token_here

# 运行部署
./deploy-cloudflare.sh
```

### 2. 绑定自定义域名

#### 步骤1: 获取Cloudflare Pages域名
部署完成后，您将获得类似：
`https://kahn-building-materials.pages.dev`

#### 步骤2: 火山引擎DNS配置
登录火山引擎控制台，配置DNS记录：

**A记录配置：**
```
类型: A
主机记录: @
记录值: [Cloudflare分配的IP地址]
TTL: 300
```

**CNAME配置（推荐）：**
```
类型: CNAME
主机记录: @
记录值: kahn-building-materials.pages.dev
TTL: 300
```

#### 步骤3: Cloudflare控制台配置
1. 登录 https://dash.cloudflare.com
2. 选择您的域名: kn-wallpaperglue.com
3. 进入 "Pages" > "kahn-building-materials"
4. 点击 "Custom domains" > "Add custom domain"
5. 输入: kn-wallpaperglue.com
6. 按照提示完成验证

### 3. 环境变量配置

在Cloudflare Pages控制台设置环境变量：
- `VITE_SUPABASE_URL`: 您的Supabase项目URL
- `VITE_SUPABASE_ANON_KEY`: 您的Supabase匿名密钥
- `VITE_API_BASE_URL`: API基础地址

### 4. 验证部署

部署完成后，访问：
- **主域名**: https://kn-wallpaperglue.com
- **预览域名**: https://kahn-building-materials.pages.dev

## ✅ 预期结果
- ✅ 网站成功部署到Cloudflare Pages
- ✅ 自定义域名 kn-wallpaperglue.com 绑定成功
- ✅ SSL证书自动配置
- ✅ 所有功能正常工作

## 🚀 一键部署命令
```bash
# 完整的部署流程
./deploy-cloudflare.sh
```