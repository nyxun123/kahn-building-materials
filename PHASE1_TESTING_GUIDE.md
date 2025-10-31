# 第一阶段修复验证测试指南

## 📋 测试概述

本指南提供了验证第一阶段所有 3 个严重问题修复的详细步骤。

**测试范围**:
- 问题 1: 图片上传返回值不匹配
- 问题 2: API 响应格式不统一
- 问题 3: 认证机制混乱

**预计时间**: 30-45 分钟

---

## 🔧 测试环境准备

### 1. 启动开发服务器

```bash
# 启动 Cloudflare Workers 本地开发服务器
npm run dev

# 或使用 wrangler
wrangler dev
```

### 2. 获取测试 Token

```bash
# 登录获取有效的 JWT token
curl -X POST http://localhost:8787/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 从响应中复制 accessToken
# 示例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 设置环境变量

```bash
export API_BASE_URL=http://localhost:8787
export TEST_TOKEN=your-access-token-here
```

---

## ✅ 问题 1: 图片上传返回值不匹配

### 测试目标

验证图片上传 API 返回的响应包含 `url` 字段，前端能正确显示上传的图片。

### 手动测试步骤

#### 步骤 1: 打开管理后台

1. 打开浏览器访问 `http://localhost:5173/admin`
2. 使用管理员账号登录
3. 导航到内容管理或产品管理页面

#### 步骤 2: 上传图片

1. 点击"上传图片"按钮
2. 选择一个 PNG 或 JPEG 图片文件
3. 等待上传完成

#### 步骤 3: 验证响应

打开浏览器开发者工具 (F12)，查看 Network 标签：

```
请求: POST /api/upload-image
响应状态: 200 OK
响应体:
{
  "success": true,
  "code": 200,
  "message": "图片上传成功",
  "data": {
    "url": "https://r2.example.com/images/...",  ✅ 必须包含 url 字段
    "original": "https://r2.example.com/images/...",
    "size": 12345,
    "type": "image/png"
  },
  "timestamp": "2025-10-31T..."
}
```

#### 步骤 4: 验证前端显示

1. 确认上传的图片在页面上正确显示
2. 右键点击图片，选择"在新标签页中打开图片"
3. 验证图片 URL 可以正常访问

### 自动化测试

```bash
# 运行测试脚本
node test-phase1-fixes.js

# 或在浏览器控制台中运行
# 1. 打开浏览器开发者工具 (F12)
# 2. 复制 test-phase1-fixes.js 的内容到控制台
# 3. 运行: runPhase1Tests()
```

### 验证清单

- [ ] 响应包含 `url` 字段
- [ ] `url` 字段值是有效的 URL
- [ ] 图片在前端正确显示
- [ ] 图片 URL 可以在浏览器中打开

---

## ✅ 问题 2: API 响应格式不统一

### 测试目标

验证所有 API 端点返回统一的响应格式。

### 测试的 API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/admin/login` | POST | 登录 |
| `/api/admin/contents` | GET | 获取内容列表 |
| `/api/admin/contents/:id` | PUT | 更新内容 |
| `/api/admin/products` | GET | 获取产品列表 |
| `/api/admin/products` | POST | 创建产品 |
| `/api/upload-image` | POST | 上传图片 |
| `/api/admin/refresh-token` | POST | 刷新 Token |
| `/api/admin/home-content` | GET | 获取首页内容 |

### 手动测试步骤

#### 步骤 1: 测试 GET 请求

```bash
curl -X GET http://localhost:8787/api/admin/contents \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" | jq .
```

**预期响应格式**:
```json
{
  "success": true,
  "code": 200,
  "message": "获取内容成功",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "timestamp": "2025-10-31T..."
}
```

#### 步骤 2: 测试 POST 请求

```bash
curl -X POST http://localhost:8787/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq .
```

**预期响应格式**:
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900
  },
  "timestamp": "2025-10-31T..."
}
```

#### 步骤 3: 测试错误响应

```bash
# 无效的 token
curl -X GET http://localhost:8787/api/admin/contents \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json" | jq .
```

**预期错误响应格式**:
```json
{
  "success": false,
  "code": 401,
  "message": "未授权",
  "error": "Invalid token",
  "timestamp": "2025-10-31T..."
}
```

### 验证清单

- [ ] 所有成功响应包含: success, code, message, data, timestamp
- [ ] 所有错误响应包含: success, code, message, error, timestamp
- [ ] 分页响应包含: page, limit, total, totalPages
- [ ] success 字段值正确 (true/false)
- [ ] code 字段值正确 (200/201/400/401/500 等)
- [ ] timestamp 字段格式正确 (ISO 8601)

---

## ✅ 问题 3: 认证机制混乱

### 测试目标

验证所有 API 都需要有效的 JWT token，认证机制正常工作。

### 手动测试步骤

#### 步骤 1: 测试无 Token 请求

```bash
curl -X GET http://localhost:8787/api/admin/contents \
  -H "Content-Type: application/json"
```

**预期结果**: 返回 401 Unauthorized

```json
{
  "success": false,
  "code": 401,
  "message": "未授权",
  "timestamp": "2025-10-31T..."
}
```

#### 步骤 2: 测试无效 Token 请求

```bash
curl -X GET http://localhost:8787/api/admin/contents \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json"
```

**预期结果**: 返回 401 Unauthorized

#### 步骤 3: 测试有效 Token 请求

```bash
curl -X GET http://localhost:8787/api/admin/contents \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json"
```

**预期结果**: 返回 200 OK 和数据

#### 步骤 4: 测试 Token 刷新

```bash
# 获取 refresh token (从登录响应中)
curl -X POST http://localhost:8787/api/admin/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token"}'
```

**预期结果**: 返回新的 accessToken 和 refreshToken

### 验证清单

- [ ] 无 token 请求返回 401
- [ ] 无效 token 请求返回 401
- [ ] 有效 token 请求返回 200
- [ ] Token 刷新成功返回新 token
- [ ] 所有 API 都需要认证

---

## 🔄 集成测试

### 完整的用户流程测试

#### 场景 1: 登录 → 上传图片 → 修改内容

1. **登录**
   ```bash
   curl -X POST http://localhost:8787/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password"}'
   ```
   - 保存 accessToken 和 refreshToken

2. **上传图片**
   ```bash
   curl -X POST http://localhost:8787/api/upload-image \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -F "file=@test.png"
   ```
   - 验证返回 url 字段
   - 保存图片 URL

3. **修改内容**
   ```bash
   curl -X PUT http://localhost:8787/api/admin/contents/1 \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"content_zh":"新内容","image_url":"..."}'
   ```
   - 验证修改成功

4. **验证前端显示**
   - 打开管理后台
   - 验证修改的内容和图片正确显示

### 验证清单

- [ ] 登录成功获得 token
- [ ] 使用 token 上传图片成功
- [ ] 使用 token 修改内容成功
- [ ] 前端显示修改后的内容
- [ ] 前端显示上传的图片

---

## 📊 测试报告

### 测试结果记录

| 问题 | 测试项 | 结果 | 备注 |
|------|--------|------|------|
| 1 | 图片上传返回 url | ✅/❌ | |
| 1 | 前端显示图片 | ✅/❌ | |
| 2 | GET 响应格式 | ✅/❌ | |
| 2 | POST 响应格式 | ✅/❌ | |
| 2 | 错误响应格式 | ✅/❌ | |
| 3 | 无 token 拒绝 | ✅/❌ | |
| 3 | 无效 token 拒绝 | ✅/❌ | |
| 3 | 有效 token 接受 | ✅/❌ | |

### 总体结果

- [ ] 所有测试通过 ✅
- [ ] 部分测试失败 ❌

---

## 🐛 故障排查

### 问题: 图片上传失败

**可能原因**:
- R2 存储桶未配置
- 文件大小超过限制
- 文件格式不支持

**解决方案**:
- 检查 `functions/api/upload-image.js` 中的 R2 配置
- 检查文件大小限制
- 尝试上传不同格式的图片

### 问题: API 返回格式不一致

**可能原因**:
- 某些 API 端点未更新
- 缓存问题

**解决方案**:
- 清除浏览器缓存
- 重启开发服务器
- 检查所有 API 端点是否都导入了 `api-response.js`

### 问题: 认证失败

**可能原因**:
- Token 已过期
- Token 格式错误
- JWT 密钥配置错误

**解决方案**:
- 重新登录获取新 token
- 检查 Authorization header 格式: `Bearer <token>`
- 检查 `functions/lib/jwt-auth.js` 中的密钥配置

---

## ✨ 测试完成

所有测试通过后，第一阶段修复验证完成！

**下一步**: 进行第二阶段修复 (5 个中等优先级问题)


