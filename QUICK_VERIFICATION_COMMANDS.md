# 快速验证命令 - 前后端打通测试

## 🚀 启动服务

### 终端 1：启动前端
```bash
cd /Users/nll/Documents/可以用的网站
npm run dev
```

### 终端 2：启动后端
```bash
cd /Users/nll/Documents/可以用的网站
wrangler pages dev dist --local
```

---

## ✅ 验证清单

### 1️⃣ 验证前端是否启动

```bash
curl http://localhost:5173/ | head -20
```

**预期**：返回 HTML 内容（包含 `<!DOCTYPE html>` 或 `<html>`）

---

### 2️⃣ 验证后端是否启动

```bash
curl http://localhost:8788/ | head -20
```

**预期**：返回 HTML 内容（与前端相同，因为 8788 也服务前端）

---

### 3️⃣ 验证 API 是否可访问（直接访问）

```bash
curl -X POST http://localhost:8788/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kn-wallpaperglue.com",
    "password": "Admin@123456"
  }' | jq .
```

**预期**：返回 JSON 响应
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {...},
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  },
  "timestamp": "2025-10-31T..."
}
```

---

### 4️⃣ 验证 API 是否可访问（通过前端代理）

```bash
curl -X POST http://localhost:5173/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kn-wallpaperglue.com",
    "password": "Admin@123456"
  }' | jq .
```

**预期**：返回相同的 JSON 响应

---

### 5️⃣ 获取 Token 并测试其他 API

```bash
# 1. 登录获取 token
TOKEN=$(curl -s -X POST http://localhost:8788/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin@123456"}' \
  | jq -r '.data.accessToken')

echo "Token: $TOKEN"

# 2. 使用 token 获取产品列表
curl -X GET "http://localhost:8788/api/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. 获取审计日志
curl -X GET "http://localhost:8788/api/admin/audit-logs?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. 系统健康检查
curl -X GET "http://localhost:8788/api/admin/dashboard/health" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 🔍 详细测试脚本

### 完整测试脚本

```bash
#!/bin/bash

echo "=========================================="
echo "前后端打通测试"
echo "=========================================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 测试 1: 前端是否启动
echo -e "\n${GREEN}[测试 1]${NC} 检查前端服务 (5173)..."
if curl -s http://localhost:5173/ > /dev/null; then
  echo -e "${GREEN}✅ 前端服务正常${NC}"
else
  echo -e "${RED}❌ 前端服务未启动${NC}"
  exit 1
fi

# 测试 2: 后端是否启动
echo -e "\n${GREEN}[测试 2]${NC} 检查后端服务 (8788)..."
if curl -s http://localhost:8788/ > /dev/null; then
  echo -e "${GREEN}✅ 后端服务正常${NC}"
else
  echo -e "${RED}❌ 后端服务未启动${NC}"
  exit 1
fi

# 测试 3: 登录 API
echo -e "\n${GREEN}[测试 3]${NC} 测试登录 API..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8788/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin@123456"}')

if echo "$LOGIN_RESPONSE" | jq -e '.data.accessToken' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 登录成功${NC}"
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
  echo "Token: $TOKEN"
else
  echo -e "${RED}❌ 登录失败${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

# 测试 4: 获取产品列表
echo -e "\n${GREEN}[测试 4]${NC} 测试获取产品列表..."
PRODUCTS_RESPONSE=$(curl -s -X GET "http://localhost:8788/api/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PRODUCTS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 获取产品列表成功${NC}"
  echo "产品数: $(echo "$PRODUCTS_RESPONSE" | jq '.data | length')"
else
  echo -e "${RED}❌ 获取产品列表失败${NC}"
  echo "Response: $PRODUCTS_RESPONSE"
  exit 1
fi

# 测试 5: 获取审计日志
echo -e "\n${GREEN}[测试 5]${NC} 测试获取审计日志..."
AUDIT_RESPONSE=$(curl -s -X GET "http://localhost:8788/api/admin/audit-logs?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if echo "$AUDIT_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 获取审计日志成功${NC}"
  echo "日志数: $(echo "$AUDIT_RESPONSE" | jq '.data | length')"
else
  echo -e "${RED}❌ 获取审计日志失败${NC}"
  echo "Response: $AUDIT_RESPONSE"
  exit 1
fi

# 测试 6: 系统健康检查
echo -e "\n${GREEN}[测试 6]${NC} 测试系统健康检查..."
HEALTH_RESPONSE=$(curl -s -X GET "http://localhost:8788/api/admin/dashboard/health" \
  -H "Authorization: Bearer $TOKEN")

if echo "$HEALTH_RESPONSE" | jq -e '.data.status' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 系统健康检查成功${NC}"
  echo "系统状态: $(echo "$HEALTH_RESPONSE" | jq -r '.data.status')"
else
  echo -e "${RED}❌ 系统健康检查失败${NC}"
  echo "Response: $HEALTH_RESPONSE"
  exit 1
fi

echo -e "\n${GREEN}=========================================="
echo "✅ 所有测试通过！前后端已打通"
echo "==========================================${NC}"
```

### 保存并运行脚本

```bash
# 保存脚本
cat > test-integration.sh << 'EOF'
# 上面的脚本内容
EOF

# 给脚本执行权限
chmod +x test-integration.sh

# 运行脚本
./test-integration.sh
```

---

## 📊 测试结果示例

### ✅ 成功的测试结果

```
==========================================
前后端打通测试
==========================================

[测试 1] 检查前端服务 (5173)...
✅ 前端服务正常

[测试 2] 检查后端服务 (8788)...
✅ 后端服务正常

[测试 3] 测试登录 API...
✅ 登录成功
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

[测试 4] 测试获取产品列表...
✅ 获取产品列表成功
产品数: 5

[测试 5] 测试获取审计日志...
✅ 获取审计日志成功
日志数: 3

[测试 6] 测试系统健康检查...
✅ 系统健康检查成功
系统状态: healthy

==========================================
✅ 所有测试通过！前后端已打通
==========================================
```

---

## 🐛 常见问题排查

### 问题 1: 连接被拒绝

```
curl: (7) Failed to connect to localhost port 8788: Connection refused
```

**解决**：
```bash
# 确认后端是否启动
ps aux | grep wrangler

# 如果没有启动，运行
wrangler pages dev dist --local
```

### 问题 2: 登录失败

```json
{
  "success": false,
  "code": 401,
  "message": "邮箱或密码错误"
}
```

**解决**：
- 检查邮箱和密码是否正确
- 默认账户：`admin@kn-wallpaperglue.com` / `Admin@123456`
- 检查数据库中是否存在该账户

### 问题 3: Token 过期

```json
{
  "success": false,
  "code": 401,
  "message": "Token 已过期"
}
```

**解决**：
- 重新登录获取新 token
- 或使用 refresh token 刷新

---

## 📝 测试记录

**测试日期**: ___________  
**测试人员**: ___________

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 前端服务 | ✅/❌ | |
| 后端服务 | ✅/❌ | |
| 登录 API | ✅/❌ | |
| 产品列表 API | ✅/❌ | |
| 审计日志 API | ✅/❌ | |
| 系统健康检查 | ✅/❌ | |

**总体状态**: ✅ 通过 / ❌ 失败

---

**生成时间**: 2025-10-31

