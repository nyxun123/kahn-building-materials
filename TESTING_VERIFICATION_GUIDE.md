# 前后端测试验证指南

**测试日期**: 2025-10-31  
**项目**: 杭州卡恩新型建材有限公司 - 后端管理平台

---

## 📍 前后端地址

### 前端地址

| 环境 | 地址 | 端口 | 说明 |
|------|------|------|------|
| 本地开发 | `http://localhost:5173` | 5173 | Vite 开发服务器 |
| 本地开发 | `http://127.0.0.1:5173` | 5173 | 本地回环地址 |
| 本地开发 | `http://0.0.0.0:5173` | 5173 | 所有网卡 |

### 后端地址

| 环境 | 地址 | 端口 | 说明 |
|------|------|------|------|
| 本地开发 | `http://localhost:8788` | 8788 | Cloudflare Workers 本地开发服务器 |
| 本地开发 | `http://127.0.0.1:8788` | 8788 | 本地回环地址 |

### API 代理配置

前端 Vite 配置中的代理设置：
```
/api/* -> http://localhost:8788/api/*
```

这意味着：
- 前端请求 `http://localhost:5173/api/admin/login`
- 会被代理到 `http://localhost:8788/api/admin/login`

---

## 🚀 启动步骤

### 步骤 1: 启动前端开发服务器

**终端 1**:
```bash
cd /Users/nll/Documents/可以用的网站
npm run dev
# 或
pnpm dev
```

**预期输出**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**访问地址**: http://localhost:5173

### 步骤 2: 启动后端 Cloudflare Workers 开发服务器

**终端 2**:
```bash
cd /Users/nll/Documents/可以用的网站
wrangler pages dev dist --local
```

**预期输出**:
```
✨ Compiled Worker successfully
⎔ Reloading local server...
```

**访问地址**: http://localhost:8788

---

## 🧪 测试验证清单

### 测试 1: 前端是否正常启动

**步骤**:
1. 打开浏览器
2. 访问 `http://localhost:5173`
3. 查看页面是否正常加载

**预期结果**:
- ✅ 页面正常显示
- ✅ 没有 404 错误
- ✅ 没有 CORS 错误

---

### 测试 2: 后端是否正常启动

**步骤**:
1. 打开浏览器
2. 访问 `http://localhost:8788/api/admin/login`
3. 查看响应

**预期结果**:
- ✅ 返回 405 Method Not Allowed（因为是 GET 请求）
- ✅ 或返回 CORS 预检响应

---

### 测试 3: 登录 API 测试

**使用 curl 测试**:
```bash
curl -X POST http://localhost:5173/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kn-wallpaperglue.com",
    "password": "Admin@123456"
  }'
```

**预期响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@kn-wallpaperglue.com",
      "name": "Admin",
      "role": "admin"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "authType": "JWT",
    "expiresIn": 900
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 测试 4: 获取产品列表 API 测试

**使用 curl 测试**:
```bash
# 先登录获取 token
TOKEN=$(curl -s -X POST http://localhost:5173/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin@123456"}' \
  | jq -r '.data.accessToken')

# 使用 token 获取产品列表
curl -X GET "http://localhost:5173/api/admin/products?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

**预期响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取产品列表成功",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 测试 5: 审计日志 API 测试

**使用 curl 测试**:
```bash
# 获取审计日志
curl -X GET "http://localhost:5173/api/admin/audit-logs?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

**预期响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取审计日志成功",
  "data": [
    {
      "id": 1,
      "admin_id": 1,
      "action": "login",
      "resource_type": "admin",
      "status": "success",
      "created_at": "2025-10-31T12:34:56Z"
    }
  ],
  "pagination": {...},
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 测试 6: 系统健康检查 API 测试

**使用 curl 测试**:
```bash
curl -X GET "http://localhost:5173/api/admin/dashboard/health" \
  -H "Authorization: Bearer $TOKEN"
```

**预期响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "系统状态: healthy",
  "data": {
    "status": "healthy",
    "components": {
      "database": { "status": "ok", "latency": 10 },
      "storage": { "status": "ok", "latency": 20 },
      "api": { "status": "ok", "latency": 5 }
    }
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 🔍 浏览器开发者工具测试

### 打开开发者工具

1. 按 `F12` 或 `Cmd+Option+I`（Mac）
2. 切换到 **Network** 标签
3. 刷新页面

### 检查 API 请求

1. 在 Network 标签中查看所有请求
2. 查找 `/api/` 开头的请求
3. 检查：
   - ✅ 请求 URL 是否正确
   - ✅ 请求头是否包含 `Authorization: Bearer <token>`
   - ✅ 响应状态码是否为 200
   - ✅ 响应体是否符合统一格式

### 检查 CORS 错误

如果出现 CORS 错误：
1. 检查浏览器控制台（Console 标签）
2. 查看错误信息
3. 确认后端 CORS 配置是否正确

---

## 📊 测试结果记录

### 测试 1: 前端启动
- [ ] 页面正常加载
- [ ] 没有 404 错误
- [ ] 没有 CORS 错误

**结果**: ___________

### 测试 2: 后端启动
- [ ] 后端服务正常运行
- [ ] 可以访问 API 端点

**结果**: ___________

### 测试 3: 登录 API
- [ ] 返回 200 状态码
- [ ] 返回有效的 token
- [ ] 响应格式正确

**结果**: ___________

### 测试 4: 产品列表 API
- [ ] 返回 200 状态码
- [ ] 返回产品列表
- [ ] 分页信息正确

**结果**: ___________

### 测试 5: 审计日志 API
- [ ] 返回 200 状态码
- [ ] 返回审计日志
- [ ] 包含登录记录

**结果**: ___________

### 测试 6: 系统健康检查
- [ ] 返回 200 状态码
- [ ] 系统状态为 healthy
- [ ] 所有组件状态正常

**结果**: ___________

---

## 🐛 常见问题排查

### 问题 1: 前端无法连接到后端

**症状**: 
- CORS 错误
- 请求超时
- 404 错误

**排查步骤**:
1. 确认后端服务是否启动（检查终端 2）
2. 确认后端地址是否正确（应该是 `http://localhost:8788`）
3. 检查 Vite 代理配置是否正确
4. 检查防火墙设置

**解决方案**:
```bash
# 重启后端服务
wrangler pages dev dist --local

# 重启前端服务
npm run dev
```

### 问题 2: 登录失败

**症状**:
- 返回 401 Unauthorized
- 返回 "邮箱或密码错误"

**排查步骤**:
1. 确认邮箱和密码是否正确
2. 检查数据库中是否存在该管理员账户
3. 查看后端日志是否有错误信息

**解决方案**:
```bash
# 检查数据库中的管理员账户
sqlite3 data/backend-management.db "SELECT * FROM admins LIMIT 5;"
```

### 问题 3: Token 过期

**症状**:
- 返回 401 Unauthorized
- 消息为 "Token 已过期"

**排查步骤**:
1. 使用 refresh token 获取新的 access token
2. 检查 token 过期时间是否正确

**解决方案**:
```bash
# 使用 refresh token 刷新
curl -X POST http://localhost:5173/api/admin/refresh-token \
  -H "Authorization: Bearer $REFRESH_TOKEN"
```

---

## 📝 测试报告模板

**测试日期**: ___________  
**测试人员**: ___________  
**测试环境**: 本地开发环境

### 测试结果总结

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 前端启动 | ✅/❌ | |
| 后端启动 | ✅/❌ | |
| 登录 API | ✅/❌ | |
| 产品列表 API | ✅/❌ | |
| 审计日志 API | ✅/❌ | |
| 系统健康检查 | ✅/❌ | |

### 发现的问题

1. ___________
2. ___________
3. ___________

### 建议

1. ___________
2. ___________
3. ___________

---

**测试完成时间**: ___________  
**测试状态**: ✅ 通过 / ❌ 失败 / ⚠️ 部分通过

