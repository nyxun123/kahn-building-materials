# 📋 API 文档

## 概述

本文档详细描述了杨州卡恩新型建材有限公司管理系统的所有API端点。系统基于Cloudflare Workers和D1数据库构建，提供完整的内容管理和数据分析功能。

## 基础信息

- **基础URL**: `/api/`
- **认证方式**: Bearer Token (在请求头中添加 `Authorization: Bearer <token>`)
- **响应格式**: JSON

## 认证API

### 管理员登录
- **端点**: `POST /api/admin/login`
- **描述**: 管理员用户登录
- **请求体**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "管理员",
      "role": "admin"
    },
    "authType": "D1_DATABASE"
  }
  ```

## 产品管理API

### 获取产品列表
- **端点**: `GET /api/admin/products`
- **查询参数**: 
  - `page` (可选): 页码，默认1
  - `limit` (可选): 每页数量，默认20
- **响应**:
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
  ```

### 获取单个产品
- **端点**: `GET /api/admin/products/{id}`
- **响应**: 单个产品对象

### 创建产品
- **端点**: `POST /api/admin/products`
- **请求体**: 产品数据对象
- **响应**: 新创建的产品

### 更新产品
- **端点**: `PUT /api/admin/products/{id}`
- **请求体**: 需要更新的字段
- **响应**: 更新后的产品

### 删除产品
- **端点**: `DELETE /api/admin/products/{id}`
- **响应**: 成功消息

## 联系消息API

### 获取联系消息列表
- **端点**: `GET /api/admin/contacts`
- **查询参数**:
  - `page` (可选): 页码
  - `limit` (可选): 每页数量
- **响应**: 分页的联系消息列表

### 更新联系消息状态
- **端点**: `PUT /api/admin/contacts/{id}`
- **请求体**:
  ```json
  {
    "status": "read",
    "is_read": 1
  }
  ```

### 删除联系消息
- **端点**: `DELETE /api/admin/contacts/{id}`

## 页面内容API

### 获取页面内容
- **端点**: `GET /api/admin/contents`
- **查询参数**:
  - `page_key` (可选): 页面标识符
  - `page` (可选): 页码
  - `limit` (可选): 每页数量
- **响应**: 页面内容列表

### 更新页面内容
- **端点**: `PUT /api/admin/contents/{id}`
- **请求体**: 需要更新的内容字段

## 图片上传API

### 上传图片
- **端点**: `POST /api/upload-image`
- **请求格式**: `multipart/form-data`
- **表单字段**:
  - `file`: 图片文件
  - `folder` (可选): 存储文件夹，默认'products'
- **响应**:
  ```json
  {
    "code": 200,
    "message": "图片上传成功",
    "data": {
      "original": "https://...",
      "large": "https://...",
      "medium": "https://...",
      "small": "https://...",
      "thumbnail": "https://..."
    }
  }
  ```

## 仪表板API (新增)

### 获取统计信息
- **端点**: `GET /api/admin/dashboard/stats`
- **描述**: 获取系统总体统计数据
- **响应**:
  ```json
  {
    "data": {
      "totalProducts": 24,
      "totalContacts": 12,
      "unreadContacts": 5,
      "activeProducts": 20,
      "recentActivities": 8,
      "dailyContacts": [
        {"date": "2024-01-01", "count": 3},
        {"date": "2024-01-02", "count": 5}
      ],
      "categoryStats": [
        {"category": "adhesive", "count": 15},
        {"category": "sealant", "count": 9}
      ]
    },
    "meta": {
      "timestamp": "2024-01-03T10:00:00Z"
    }
  }
  ```

### 获取活动记录
- **端点**: `GET /api/admin/dashboard/activities`
- **查询参数**:
  - `limit` (可选): 返回的活动数量，默认20
- **响应**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "张三",
        "email": "zhangsan@example.com",
        "created_at": "2024-01-03T09:30:00Z",
        "type": "contact",
        "timestamp": "2024-01-03T09:30:00Z"
      },
      {
        "id": 101,
        "product_code": "ADH-001",
        "name_zh": "强力粘合剂",
        "updated_at": "2024-01-03T08:15:00Z",
        "type": "product",
        "timestamp": "2024-01-03T08:15:00Z"
      }
    ],
    "pagination": {
      "limit": 20,
      "total": 45
    }
  }
  ```

### 获取系统健康信息
- **端点**: `GET /api/admin/dashboard/health`
- **描述**: 获取系统运行状态和健康信息
- **响应**:
  ```json
  {
    "data": {
      "database": {
        "status": "connected",
        "timestamp": "2024-01-03T10:00:00Z"
      },
      "storage": {
        "status": "configured",
        "timestamp": "2024-01-03T10:00:00Z"
      },
      "system": {
        "uptime": 86400,
        "memory": {...},
        "timestamp": "2024-01-03T10:00:00Z"
      },
      "environment": {
        "node_env": "production",
        "timestamp": "2024-01-03T10:00:00Z"
      }
    }
  }
  ```

## 公开API (无需认证)

### 获取公开产品列表
- **端点**: `GET /api/products`
- **描述**: 获取所有激活的产品信息（前台使用）
- **响应**: 产品列表

### 提交联系表单
- **端点**: `POST /api/contact`
- **请求体**:
  ```json
  {
    "data": {
      "name": "李四",
      "email": "lisi@example.com",
      "phone": "13800138000",
      "company": "测试公司",
      "message": "我想了解更多产品信息"
    }
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "消息提交成功",
    "data": {
      "id": 123,
      "submitted_at": "2024-01-03T10:00:00Z"
    }
  }
  ```

## 错误处理

所有API都遵循统一的错误响应格式：

```json
{
  "code": 400,
  "message": "错误描述",
  "timestamp": "2024-01-03T10:00:00Z"
}
```

### 常见错误码
- `400`: 请求参数错误
- `401`: 未授权访问
- `404`: 资源不存在
- `500`: 服务器内部错误

## 速率限制

- 认证API: 5次/15分钟
- 其他API: 无严格限制，但建议合理使用

## 数据格式

### 日期时间
所有日期时间字段都使用ISO 8601格式: `YYYY-MM-DDTHH:mm:ss.sssZ`

### 多语言支持
产品和支持多语言的内容字段使用后缀标识:
- `_zh`: 中文
- `_en`: 英文  
- `_ru`: 俄文

## 安全注意事项

1. 所有管理API都需要有效的认证令牌
2. 敏感操作（如删除）需要额外确认
3. 文件上传有大小和类型限制
4. 输入数据都会进行验证和清理

## 版本信息

- **当前版本**: v1.0
- **最后更新**: 2024-01-03
- **技术支持**: 技术支持团队

---

*本文档会根据API的更新而持续维护。如有疑问，请联系开发团队。*