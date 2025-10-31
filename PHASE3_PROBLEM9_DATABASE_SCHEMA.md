# Phase 3 - Problem 9: 日志记录不完整 - 数据库架构

## 更新的 activity_logs 表结构

```sql
-- 创建活动日志表（完整版本）
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id INTEGER,
  details TEXT,
  result TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource_type ON activity_logs(resource_type);
```

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| admin_id | INTEGER | 执行操作的管理员 ID |
| action | TEXT | 操作类型（create, read, update, delete, login, logout 等） |
| resource_type | TEXT | 资源类型（product, content, admin, media 等） |
| resource_id | INTEGER | 被操作的资源 ID |
| details | TEXT | 操作详情（JSON 格式） |
| result | TEXT | 操作结果（JSON 格式） |
| ip_address | TEXT | 操作者的 IP 地址 |
| user_agent | TEXT | 操作者的浏览器信息 |
| status | TEXT | 操作状态（success, failure, partial） |
| created_at | DATETIME | 操作时间 |

## 迁移脚本

如果现有表结构不同，需要执行以下迁移：

```sql
-- 添加缺失的列
ALTER TABLE activity_logs ADD COLUMN result TEXT;
ALTER TABLE activity_logs ADD COLUMN status TEXT DEFAULT 'success';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource_type ON activity_logs(resource_type);
```

## 日志数据示例

### 创建产品操作
```json
{
  "id": 1,
  "admin_id": 1,
  "action": "create",
  "resource_type": "product",
  "resource_id": 123,
  "details": {
    "name_zh": "新产品",
    "price": 99.99,
    "category": "wallpaper"
  },
  "result": {
    "success": true,
    "id": 123
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "created_at": "2025-10-31T12:34:56Z"
}
```

### 登录操作
```json
{
  "id": 2,
  "admin_id": 1,
  "action": "login",
  "resource_type": "admin",
  "resource_id": 1,
  "details": {
    "email": "admin@example.com",
    "method": "password"
  },
  "result": {
    "success": true,
    "token_issued": true
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "created_at": "2025-10-31T12:34:56Z"
}
```

### 登录失败操作
```json
{
  "id": 3,
  "admin_id": null,
  "action": "login",
  "resource_type": "admin",
  "resource_id": null,
  "details": {
    "email": "admin@example.com",
    "reason": "invalid_password"
  },
  "result": {
    "success": false,
    "error": "Invalid credentials"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "failure",
  "created_at": "2025-10-31T12:34:56Z"
}
```

## 查询示例

### 获取特定管理员的所有操作
```sql
SELECT * FROM activity_logs
WHERE admin_id = 1
ORDER BY created_at DESC
LIMIT 100;
```

### 获取特定资源的所有操作
```sql
SELECT * FROM activity_logs
WHERE resource_type = 'product' AND resource_id = 123
ORDER BY created_at DESC;
```

### 获取失败的操作
```sql
SELECT * FROM activity_logs
WHERE status = 'failure'
ORDER BY created_at DESC
LIMIT 50;
```

### 获取特定时间范围内的操作
```sql
SELECT * FROM activity_logs
WHERE created_at BETWEEN '2025-10-31 00:00:00' AND '2025-10-31 23:59:59'
ORDER BY created_at DESC;
```

### 统计操作数量
```sql
SELECT action, COUNT(*) as count
FROM activity_logs
WHERE created_at >= datetime('now', '-7 days')
GROUP BY action
ORDER BY count DESC;
```

## 性能考虑

1. **索引**: 已为常用查询字段创建索引
2. **分区**: 可考虑按日期分区大表
3. **归档**: 定期归档旧日志到备份存储
4. **清理**: 定期删除超过 90 天的日志

## 安全考虑

1. **敏感数据**: 不记录密码、token 等敏感信息
2. **访问控制**: 只有管理员可以查看审计日志
3. **日志完整性**: 确保日志不被篡改
4. **加密**: 考虑加密敏感的日志数据

