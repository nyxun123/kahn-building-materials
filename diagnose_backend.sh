#!/bin/bash

# 后端深度诊断脚本 (Resilient Version)
# 使用 DEPLOYMENT_STATUS.md 中的凭据

BASE_URL="https://kn-wallpaperglue.com"
ADMIN_EMAIL="admin@kn-wallpaperglue.com"
ADMIN_PASSWORD="Admin#2025"

echo "🔍 开始后端深度诊断..."
echo "目标 URL: $BASE_URL"

# 1. 测试登录
echo -e "\n1️⃣  测试管理员登录..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=""
if echo "$LOGIN_RES" | grep -q "accessToken"; then
  TOKEN=$(echo "$LOGIN_RES" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  echo "✅ 登录成功! Token 获取成功。"
else
  echo "❌ 登录失败 (可能是密码错误或用户不存在)。"
  echo "响应: $LOGIN_RES"
  echo "⚠️  跳过需要认证的测试..."
fi

# 2. 测试仪表盘数据 (仅当 Token 存在时)
if [ -n "$TOKEN" ]; then
  echo -e "\n2️⃣  测试仪表盘数据..."
  DASH_RES=$(curl -s "$BASE_URL/api/admin/dashboard/stats" \
    -H "Authorization: Bearer $TOKEN")

  if echo "$DASH_RES" | grep -q "totalProducts"; then
    echo "✅ 仪表盘数据获取成功。"
  else
    echo "❌ 仪表盘数据获取失败!"
    echo "响应: $DASH_RES"
  fi
fi

# 3. 测试产品列表 (仅当 Token 存在时)
if [ -n "$TOKEN" ]; then
  echo -e "\n3️⃣  测试产品列表 (Admin)..."
  PROD_RES=$(curl -s "$BASE_URL/api/admin/products?page=1&limit=5" \
    -H "Authorization: Bearer $TOKEN")

  if echo "$PROD_RES" | grep -q "products"; then
    echo "✅ Admin 产品列表获取成功。"
  else
    echo "❌ Admin 产品列表获取失败!"
    echo "响应: $PROD_RES"
  fi
fi

# 4. 测试公开 API (无需 Token)
echo -e "\n4️⃣  测试公开产品 API..."
PUB_PROD_RES=$(curl -s "$BASE_URL/api/products?limit=1")
if echo "$PUB_PROD_RES" | grep -q "success\":true"; then
  echo "✅ 公开产品 API 正常。"
  echo "响应预览: $(echo "$PUB_PROD_RES" | cut -c 1-100)..."
else
  echo "❌ 公开产品 API 异常!"
  echo "响应: $PUB_PROD_RES"
fi

# 5. 测试单个产品详情 (如果列表成功)
if echo "$PUB_PROD_RES" | grep -q "product_code"; then
  P_CODE=$(echo "$PUB_PROD_RES" | grep -o '"product_code":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$P_CODE" ]; then
    echo -e "\n5️⃣  测试产品详情 API ($P_CODE)..."
    DETAIL_RES=$(curl -s "$BASE_URL/api/products/$P_CODE")
    if echo "$DETAIL_RES" | grep -q "success\":true"; then
      echo "✅ 产品详情 API 正常。"
    else
      echo "❌ 产品详情 API 异常!"
      echo "响应: $DETAIL_RES"
    fi
  fi
fi

# 6. 测试 API 根路径
echo -e "\n6️⃣  测试 API 根路径..."
ROOT_RES=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api")
echo "API 根路径状态码: $ROOT_RES"

echo -e "\n🏁 诊断完成。"
