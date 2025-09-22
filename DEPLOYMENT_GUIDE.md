# 生产环境部署指南

## Cloudflare Pages 环境变量配置

在部署到 Cloudflare Pages 之前，请确保配置以下环境变量：

### 必需的环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API基础URL | `https://kn-wallpaperglue.com` |
| `VITE_SUPABASE_URL` | Supabase项目URL | `https://ypjtdfsociepbzfvxzha.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 在 Cloudflare Pages 中配置环境变量

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择您的 Pages 项目
3. 进入 **Settings** > **Environment variables**
4. 添加上述环境变量

### 环境变量配置示例

```bash
# 生产环境
VITE_API_BASE_URL=https://kn-wallpaperglue.com
VITE_SUPABASE_URL=https://ypjtdfsociepbzfvxzha.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 构建和部署

### 本地构建测试

```bash
# 安装依赖
npm install

# 设置环境变量并构建
export VITE_API_BASE_URL=https://kn-wallpaperglue.com
export VITE_SUPABASE_URL=https://ypjtdfsociepbzfvxzha.supabase.co
export VITE_SUPABASE_ANON_KEY=your-anon-key-here

npm run build
```

### Cloudflare Pages 部署

项目已配置为与 Cloudflare Pages 兼容：

1. **构建命令**: `npm run build`
2. **构建输出目录**: `dist`
3. **Node.js 版本**: 18+

## API 配置说明

### 生产环境 API 端点

- **产品API**: `https://kn-wallpaperglue.com/api/products`
- **联系表单API**: `https://kn-wallpaperglue.com/api/contact`
- **图片上传API**: `https://kn-wallpaperglue.com/api/upload-image`
- **管理API**: `https://kn-wallpaperglue.com/api/admin/*`

### 开发环境回退

如果 `VITE_API_BASE_URL` 环境变量未设置：
- 开发环境：使用相对路径 `/api/`（指向本地开发服务器）
- 生产环境：使用当前部署域名作为基础URL

## 验证部署

部署完成后，请验证以下功能：

1. ✅ 首页产品展示
2. ✅ 产品列表页面
3. ✅ 产品详情页面
4. ✅ 联系表单提交
5. ✅ 图片上传功能
6. ✅ 管理后台登录
7. ✅ 多语言切换

## 故障排除

### 常见问题

1. **API 404 错误**
   - 检查 `VITE_API_BASE_URL` 是否正确配置
   - 确保后端API服务正常运行

2. **图片上传失败**
   - 检查 Cloudflare Worker 是否部署
   - 验证 Supabase 存储配置

3. **管理后台无法登录**
   - 检查 D1 数据库连接
   - 验证管理员账户配置

### 调试模式

如需调试，可以在本地设置开发环境变量：

```bash
# .env.development.local
VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=https://ypjtdfsociepbzfvxzha.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 技术支持

如有部署问题，请联系：
- 项目维护者
- Cloudflare 支持
- Supabase 支持