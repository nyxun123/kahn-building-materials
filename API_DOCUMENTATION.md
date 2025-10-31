# API 文档 - 后端管理平台

**版本**: 1.0.0  
**最后更新**: 2025-10-31  
**基础 URL**: `/api`

---

## 目录

1. [认证 API](#认证-api)
2. [产品管理 API](#产品管理-api)
3. [内容管理 API](#内容管理-api)
4. [媒体管理 API](#媒体管理-api)
5. [仪表板 API](#仪表板-api)
6. [审计日志 API](#审计日志-api)
7. [错误码说明](#错误码说明)
8. [认证说明](#认证说明)

---

## 认证 API

### 登录

**端点**: `POST /admin/login`

**描述**: 管理员登录，获取 JWT token

**请求体**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
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

**错误响应** (401):
```json
{
  "success": false,
  "code": 401,
  "message": "邮箱或密码错误",
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 刷新 Token

**端点**: `POST /admin/refresh-token`

**描述**: 使用 refresh token 获取新的 access token

**请求头**:
```
Authorization: Bearer <refresh_token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "Token 刷新成功",
  "data": {
    "accessToken": "eyJ...",
    "expiresIn": 900
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 产品管理 API

### 获取产品列表

**端点**: `GET /admin/products`

**描述**: 获取所有产品列表，支持分页和筛选

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码（默认: 1） |
| limit | number | 每页数量（默认: 20） |
| search | string | 搜索关键词 |
| category | string | 产品分类 |

**请求示例**:
```
GET /admin/products?page=1&limit=20&search=wallpaper
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取产品列表成功",
  "data": [
    {
      "id": 1,
      "product_code": "WP001",
      "name_zh": "产品名称",
      "price": 99.99,
      "image_url": "https://...",
      "created_at": "2025-10-31T12:34:56Z"
    }
  ],
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

### 获取单个产品

**端点**: `GET /admin/products/:id`

**描述**: 获取单个产品的详细信息

**请求示例**:
```
GET /admin/products/1
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取产品详情成功",
  "data": {
    "id": 1,
    "product_code": "WP001",
    "name_zh": "产品名称",
    "name_en": "Product Name",
    "description_zh": "产品描述",
    "price": 99.99,
    "image_url": "https://...",
    "gallery_images": ["https://...", "https://..."],
    "created_at": "2025-10-31T12:34:56Z",
    "updated_at": "2025-10-31T12:34:56Z"
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 创建产品

**端点**: `POST /admin/products`

**描述**: 创建新产品

**请求体**:
```json
{
  "product_code": "WP001",
  "name_zh": "产品名称",
  "name_en": "Product Name",
  "description_zh": "产品描述",
  "price": 99.99,
  "category": "wallpaper"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "code": 201,
  "message": "产品创建成功",
  "data": {
    "id": 1,
    "product_code": "WP001",
    "name_zh": "产品名称"
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 更新产品

**端点**: `PUT /admin/products/:id`

**描述**: 更新产品信息

**请求体**:
```json
{
  "name_zh": "新产品名称",
  "price": 109.99
}
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "产品更新成功",
  "data": {
    "id": 1,
    "name_zh": "新产品名称",
    "price": 109.99
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 删除产品

**端点**: `DELETE /admin/products/:id`

**描述**: 删除产品

**请求示例**:
```
DELETE /admin/products/1
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "产品删除成功",
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 内容管理 API

### 获取内容列表

**端点**: `GET /admin/contents`

**描述**: 获取所有内容列表

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码（默认: 1） |
| limit | number | 每页数量（默认: 20） |
| type | string | 内容类型 |

**请求示例**:
```
GET /admin/contents?page=1&limit=20
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取内容列表成功",
  "data": [
    {
      "id": 1,
      "title": "内容标题",
      "content": "内容正文",
      "type": "article",
      "created_at": "2025-10-31T12:34:56Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 媒体管理 API

### 上传文件

**端点**: `POST /upload-file`

**描述**: 上传文件到 R2 存储

**请求类型**: `multipart/form-data`

**请求参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| file | file | 要上传的文件 |
| type | string | 文件类型（image, document 等） |

**请求示例**:
```
POST /upload-file
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
type: image
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "文件上传成功",
  "data": {
    "url": "https://r2.example.com/uploads/file.jpg",
    "filename": "file.jpg",
    "size": 102400,
    "type": "image/jpeg"
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 仪表板 API

### 获取仪表板统计

**端点**: `GET /admin/dashboard/stats`

**描述**: 获取仪表板统计数据

**请求示例**:
```
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取统计数据成功",
  "data": {
    "totalProducts": 100,
    "totalContents": 50,
    "totalMessages": 25,
    "totalUsers": 1000
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

### 获取系统健康状态

**端点**: `GET /admin/dashboard/health`

**描述**: 检查系统各组件的健康状态

**请求示例**:
```
GET /admin/dashboard/health
Authorization: Bearer <token>
```

**成功响应** (200):
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

### 获取活动日志

**端点**: `GET /admin/dashboard/activities`

**描述**: 获取系统活动日志

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码（默认: 1） |
| limit | number | 每页数量（默认: 20） |

**请求示例**:
```
GET /admin/dashboard/activities?page=1&limit=20
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "code": 200,
  "message": "获取活动日志成功",
  "data": [
    {
      "id": 1,
      "admin_id": 1,
      "action": "create_product",
      "resource_type": "product",
      "resource_id": 123,
      "created_at": "2025-10-31T12:34:56Z"
    }
  ],
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

## 审计日志 API

### 获取审计日志

**端点**: `GET /admin/audit-logs`

**描述**: 获取系统审计日志

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码（默认: 1） |
| limit | number | 每页数量（默认: 50） |
| admin_id | number | 管理员 ID |
| action | string | 操作类型 |
| resource_type | string | 资源类型 |
| status | string | 操作状态 |
| start_date | string | 开始日期 |
| end_date | string | 结束日期 |

**请求示例**:
```
GET /admin/audit-logs?page=1&limit=50&action=login&status=success
Authorization: Bearer <token>
```

**成功响应** (200):
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
      "resource_id": 1,
      "details": { "email": "admin@example.com" },
      "status": "success",
      "ip_address": "192.168.1.1",
      "created_at": "2025-10-31T12:34:56Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20
  },
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 错误码说明

| 错误码 | 说明 | 示例 |
|--------|------|------|
| 400 | 请求参数错误 | 缺少必需字段、格式错误 |
| 401 | 未授权 | 缺少 token、token 无效或过期 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 资源不存在 | 产品不存在、页面不存在 |
| 429 | 请求过于频繁 | 超过速率限制 |
| 500 | 服务器错误 | 数据库错误、系统异常 |

---

## 认证说明

### JWT Token

所有需要认证的 API 都需要在请求头中包含 JWT token：

```
Authorization: Bearer <access_token>
```

### Token 过期

- **Access Token**: 15 分钟过期
- **Refresh Token**: 7 天过期

### 刷新 Token

当 access token 过期时，使用 refresh token 获取新的 access token：

```
POST /admin/refresh-token
Authorization: Bearer <refresh_token>
```

---

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {...},
  "pagination": {...},  // 可选
  "timestamp": "2025-10-31T12:34:56Z"
}
```

### 错误响应

```json
{
  "success": false,
  "code": 400,
  "message": "错误消息",
  "error": "详细错误信息",  // 可选
  "timestamp": "2025-10-31T12:34:56Z"
}
```

---

## 速率限制

- **登录 API**: 5 次/5 分钟
- **其他 API**: 100 次/分钟

超过限制时返回 429 状态码。

---

**文档版本**: 1.0.0  
**最后更新**: 2025-10-31

