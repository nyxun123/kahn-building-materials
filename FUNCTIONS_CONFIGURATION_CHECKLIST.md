# 🔧 Cloudflare Pages Functions 配置检查清单

## 当前状态分析

### ✅ 已完成的项目
- ✅ 域名 `kn-wallpaperglue.com` 已正确解析到 Cloudflare
- ✅ SSL 证书已自动配置并正常工作
- ✅ 前端网站可通过 `https://kn-wallpaperglue.com` 访问
- ✅ `_worker.js` 文件已部署到 dist 目录
- ✅ `_routes.json` 文件已配置并部署

### 🔧 需要检查的项目

## 1. Cloudflare Dashboard Functions 配置

### 步骤 1: 登录 Cloudflare Dashboard
1. 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 选择您的账户
3. 进入 **Pages** > **kahn-building-materials** 项目

### 步骤 2: 检查 Functions 配置
1. 进入 **Settings** > **Functions**
2. 确保 **Pages Functions** 已启用
3. 检查 **Compatibility flags** 设置
4. 确认 **Environment variables** 正确设置

### 步骤 3: 验证部署配置
1. 进入 **Deployments** 标签页
2. 检查最新部署的状态
3. 确认 `_worker.js` 和 `_routes.json` 已正确上传

## 2. 环境变量验证

确保以下环境变量已在 Cloudflare Pages 中设置：

| 变量名 | 值 | 状态 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `https://kn-wallpaperglue.com` | 需要验证 |
| `VITE_SUPABASE_URL` | `https://ypjtdfsociepbzfvxzha.supabase.co` | 需要验证 |
| `VITE_SUPABASE_ANON_KEY` | (您的Supabase密钥) | 需要验证 |

## 3. Functions 路由配置验证

检查 `dist/_routes.json` 文件内容：
```json
{
  "version": 1,
  "include": [
    "/api/*"
  ],
  "exclude": [
    "/assets/*",
    "/_next/static/*",
    "/_next/image/*",
    "/favicon.ico"
  ]
}
```

## 4. Worker 配置验证

检查 `dist/_worker.js` 文件：
- ✅ 包含所有API端点处理逻辑
- ✅ 包含CORS配置
- ✅ 包含错误处理
- ✅ 包含数据库操作函数

## 5. 测试方案

### API 端点测试
```bash
# 测试产品API
curl https://kn-wallpaperglue.com/api/products

# 测试联系表单API
curl -X POST https://kn-wallpaperglue.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com","message":"测试消息"}'

# 测试管理登录
curl -X POST https://kn-wallpaperglue.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"admin123"}'
```

### 前端集成测试
1. 访问 `https://kn-wallpaperglue.com`
2. 测试产品页面功能
3. 测试联系表单提交
4. 测试管理后台登录

## 6. 故障排除指南

### 如果API仍然返回404
1. **检查 Functions 日志**
   - 在 Cloudflare Dashboard 中查看 Functions 日志
   - 检查是否有编译错误或运行时错误

2. **验证路由配置**
   - 确认 `_routes.json` 文件语法正确
   - 确保包含 `/api/*` 路由

3. **检查环境变量**
   - 确认所有必需的环境变量已设置
   - 检查变量名是否正确（区分大小写）

4. **重新部署**
   ```bash
   # 清除缓存并重新部署
   rm -rf dist deploy.zip
   npm run build
   npx wrangler pages deploy dist --project-name=kahn-building-materials
   ```

### 如果数据库连接失败
1. 检查 D1 数据库绑定配置
2. 验证数据库连接字符串
3. 检查数据库表结构是否匹配

## 7. 成功指标

- ✅ `https://kn-wallpaperglue.com/api/products` 返回200状态码
- ✅ 联系表单可以成功提交
- ✅ 管理后台可以正常登录
- ✅ 图片上传功能正常工作
- ✅ 所有页面响应时间在合理范围内

## 8. 技术支持资源

- **Cloudflare Pages 文档**: https://developers.cloudflare.com/pages/
- **Pages Functions 指南**: https://developers.cloudflare.com/pages/platform/functions/
- **D1 数据库文档**: https://developers.cloudflare.com/d1/

如果问题仍然存在，建议通过 Cloudflare Dashboard 提交支持请求。