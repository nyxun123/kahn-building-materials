#!/bin/bash

# 后端深度诊断脚本 (User Credentials Version)

BASE_URL="https://kn-wallpaperglue.com"
ADMIN_EMAIL="niexianlei0@gmail.com"
ADMIN_PASSWORD="XIANche041758"

echo "🔍 开始后端深度诊断 (使用用户提供的凭据)..."
echo "目标 URL: $BASE_URL"

# 1. 测试管理员登录
echo -e "\n1️⃣  测试管理员登录..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=""
if echo "$LOGIN_RES" | grep -q "accessToken"; then
  TOKEN=$(echo "$LOGIN_RES" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  echo "✅ 登录成功! Token 获取成功。"
else
  echo "❌ 登录失败。"
  echo "响应: $LOGIN_RES"
  exit 1
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

echo -e "\n🏁 验证完成。"
