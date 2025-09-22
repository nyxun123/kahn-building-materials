# 🧪 后端API测试指南

## 🌐 部署信息

**部署状态**: ✅ 成功部署到 Cloudflare Pages
**临时测试地址**: `https://a4681723.kahn-building-materials.pages.dev`
**正式域名**: `https://kn-wallpaperglue.com`

## 🔧 环境变量配置

已配置的环境变量：
- ✅ `VITE_API_BASE_URL` - API基础URL
- ✅ `VITE_SUPABASE_URL` - Supabase项目URL  
- ✅ `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥

## 📋 可用的后端API端点

### 1. 公共API端点

```bash
# 获取所有产品
curl https://a4681723.kahn-building-materials.pages.dev/api/products

# 提交联系表单
curl -X POST https://a4681723.kahn-building-materials.pages.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com","message":"测试消息"}'

# 图片上传（需要认证）
curl -X POST https://a4681723.kahn-building-materials.pages.dev/api/upload-image \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "image=@/path/to/image.jpg"
```

### 2. 管理后台API端点（需要管理员认证）

```bash
# 获取统计数据
curl -X GET https://a4681723.kahn-building-materials.pages.dev/api/admin/dashboard/stats \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 获取活动记录
curl -X GET https://a4681723.kahn-building-materials.pages.dev/api/admin/dashboard/activities \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 系统健康检查
curl -X GET https://a4681723.kahn-building-materials.pages.dev/api/admin/dashboard/health \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 用户管理
curl -X GET https://a4681723.kahn-building-materials.pages.dev/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 内容管理
curl -X GET https://a4681723.kahn-building-materials.pages.dev/api/admin/content \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 3. 管理员登录测试

首先获取管理员JWT令牌：

```bash
# 管理员登录（使用预设的管理员账户）
curl -X POST https://a4681723.kahn-building-materials.pages.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

响应将包含JWT令牌，用于后续API调用。

## 🎯 推荐测试顺序

### 第一阶段：基础功能测试
1. **首页访问**: 打开 `https://a4681723.kahn-building-materials.pages.dev`
2. **产品页面**: 测试 `/products` 路由
3. **API连通性**: 测试 `GET /api/products`

### 第二阶段：管理功能测试
1. **管理员登录**: 获取JWT令牌
2. **仪表板数据**: 测试管理API端点
3. **内容管理**: 测试CRUD操作

### 第三阶段：完整流程测试
1. **用户注册/登录**（如配置）
2. **图片上传功能**
3. **联系表单提交**
4. **多语言切换**

## 🔍 测试工具推荐

### 使用 curl（命令行）
```bash
# 测试产品API
curl -s https://a4681723.kahn-building-materials.pages.dev/api/products | jq

# 测试健康检查（需要认证）
curl -s -H "Authorization: Bearer $TOKEN" \
  https://a4681723.kahn-building-materials.pages.dev/api/admin/dashboard/health | jq
```

### 使用 Postman
1. 导入Postman集合（如有）
2. 设置基础URL: `https://a4681723.kahn-building-materials.pages.dev`
3. 配置认证头
4. 逐个测试API端点

### 使用浏览器开发者工具
1. 打开网站
2. 按F12打开开发者工具
3. 查看Network标签页的API请求
4. 检查响应状态和内容

## 🚨 常见问题排查

### 如果遇到CORS错误
- 检查API端点是否正确
- 确认请求头包含正确的Content-Type

### 如果遇到认证错误
- 检查JWT令牌是否有效
- 确认用户具有足够的权限

### 如果遇到404错误
- 检查API路径是否正确
- 确认后端Worker服务正常运行

### 如果遇到500错误
- 查看Cloudflare Worker日志
- 检查环境变量配置

## 📊 预期测试结果

### 成功响应示例
```json
{
  "success": true,
  "data": [...],
  "message": "操作成功"
}
```

### 错误响应示例
```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

## 🎉 测试完成标志

- ✅ 所有公共API端点返回200状态码
- ✅ 管理API在认证后正常工作
- ✅ 图片上传功能正常
- ✅ 数据库操作无错误
- ✅ 实时数据统计正确显示

**恭喜！您的后端API已成功部署并可供测试。** 🚀