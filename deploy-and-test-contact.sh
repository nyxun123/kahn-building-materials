#!/bin/bash

echo "🚀 部署并测试联系表单功能"
echo "========================================"
echo ""

# 步骤 1: 构建项目
echo "📦 步骤 1/4: 构建项目..."
pnpm run build:prod

if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

echo "✅ 构建成功"
echo ""

# 步骤 2: 部署到 Cloudflare Pages
echo "🚀 步骤 2/4: 部署到 Cloudflare Pages..."
bash deploy.sh

if [ $? -ne 0 ]; then
  echo "❌ 部署失败"
  exit 1
fi

echo "✅ 部署成功"
echo ""

# 步骤 3: 等待部署生效
echo "⏳ 步骤 3/4: 等待部署生效（30秒）..."
sleep 30
echo "✅ 等待完成"
echo ""

# 步骤 4: 重新初始化生产环境数据库
echo "🗄️  步骤 4/4: 重新初始化生产环境数据库..."
INIT_RESPONSE=$(curl -s -X POST https://kn-wallpaperglue.com/api/admin/init-d1)
echo "$INIT_RESPONSE" | jq '.'

if echo "$INIT_RESPONSE" | jq -e '.tables | contains(["contacts"])' > /dev/null; then
  echo "✅ contacts 表已成功创建"
else
  echo "⚠️  contacts 表可能未创建，请检查响应"
fi

echo ""
echo "========================================"
echo "✅ 部署完成！"
echo ""
echo "🧪 现在可以运行测试："
echo "  API_URL='https://kn-wallpaperglue.com' node test-contact-form.js"
echo "========================================"


echo "🚀 部署并测试联系表单功能"
echo "========================================"
echo ""

# 步骤 1: 构建项目
echo "📦 步骤 1/4: 构建项目..."
pnpm run build:prod

if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

echo "✅ 构建成功"
echo ""

# 步骤 2: 部署到 Cloudflare Pages
echo "🚀 步骤 2/4: 部署到 Cloudflare Pages..."
bash deploy.sh

if [ $? -ne 0 ]; then
  echo "❌ 部署失败"
  exit 1
fi

echo "✅ 部署成功"
echo ""

# 步骤 3: 等待部署生效
echo "⏳ 步骤 3/4: 等待部署生效（30秒）..."
sleep 30
echo "✅ 等待完成"
echo ""

# 步骤 4: 重新初始化生产环境数据库
echo "🗄️  步骤 4/4: 重新初始化生产环境数据库..."
INIT_RESPONSE=$(curl -s -X POST https://kn-wallpaperglue.com/api/admin/init-d1)
echo "$INIT_RESPONSE" | jq '.'

if echo "$INIT_RESPONSE" | jq -e '.tables | contains(["contacts"])' > /dev/null; then
  echo "✅ contacts 表已成功创建"
else
  echo "⚠️  contacts 表可能未创建，请检查响应"
fi

echo ""
echo "========================================"
echo "✅ 部署完成！"
echo ""
echo "🧪 现在可以运行测试："
echo "  API_URL='https://kn-wallpaperglue.com' node test-contact-form.js"
echo "========================================"


