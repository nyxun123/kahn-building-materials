#!/bin/bash

# 交互式R2自定义域名配置脚本
# 通过zen和gemini优化的用户友好配置流程

clear
echo "🎯 R2自定义域名配置向导"
echo "=========================="
echo ""
echo "这个脚本将帮助您完成R2存储桶的自定义域名配置"
echo "目标域名: assets.kn-wallpaperglue.com"
echo ""

# 检查必要工具
command -v curl >/dev/null 2>&1 || { echo "❌ 需要安装 curl"; exit 1; }
command -v jq >/dev/null 2>&1 || {
    echo "📦 正在安装 jq..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install jq
    else
        sudo apt-get update && sudo apt-get install -y jq
    fi
}

echo "✅ 环境检查完成"
echo ""

# 步骤1：获取用户信息
echo "📝 步骤 1/3: 请提供您的Cloudflare信息"
echo "---------------------------------------"
echo ""

read -p "🔑 请输入您的 Cloudflare API Token: " -s CF_API_TOKEN
echo ""
read -p "📧 请输入您的 Cloudflare 邮箱: " CF_EMAIL
echo ""

# 验证Token
echo "🔍 验证API Token..."
API_BASE="https://api.cloudflare.com/client/v4"
AUTH_HEADER="Authorization: Bearer $CF_API_TOKEN"

USER_RESPONSE=$(curl -s -X GET "$API_BASE/user/tokens/verify" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json")

if [[ $(echo "$USER_RESPONSE" | jq -r '.success') != "true" ]]; then
    echo "❌ API Token 验证失败"
    echo "请检查："
    echo "1. Token是否正确复制"
    echo "2. Token是否有必要权限"
    echo "3. 邮箱是否正确"
    echo ""
    echo "错误详情: $(echo "$USER_RESPONSE" | jq -r '.errors[0].message' 2>/dev/null || echo '未知错误')"
    exit 1
fi

echo "✅ API Token 验证成功"
echo ""

# 步骤2：获取配置信息
echo "🔍 步骤 2/3: 获取配置信息"
echo "---------------------------"
echo ""

# 获取账户信息
echo "📋 获取账户ID..."
ACCOUNTS_RESPONSE=$(curl -s -X GET "$API_BASE/accounts" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json")

ACCOUNT_ID=$(echo "$ACCOUNTS_RESPONSE" | jq -r '.result[0].id')
ACCOUNT_NAME=$(echo "$ACCOUNTS_RESPONSE" | jq -r '.result[0].name')
echo "✅ 账户: $ACCOUNT_NAME"

# 获取Zone ID
echo "🌐 获取域名Zone ID..."
ZONE_RESPONSE=$(curl -s -X GET "$API_BASE/zones?name=kn-wallpaperglue.com" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json")

ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id')
echo "✅ Zone ID: $ZONE_ID"

# 验证资源
echo "📦 验证R2存储桶和Pages项目..."
R2_RESPONSE=$(curl -s -X GET "$API_BASE/accounts/$ACCOUNT_ID/r2/buckets" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json")

PAGES_RESPONSE=$(curl -s -X GET "$API_BASE/accounts/$ACCOUNT_ID/pages/projects" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json")

# 检查必要资源
KAEN_EXISTS=$(echo "$R2_RESPONSE" | jq -r '.result[] | select(.name=="kaen") | .name')
PROJECT_EXISTS=$(echo "$PAGES_RESPONSE" | jq -r '.result[] | select(.name=="kahn-building-materials") | .name')

if [[ "$KAEN_EXISTS" != "kaen" ]]; then
    echo "❌ 未找到R2存储桶 'kaen'"
    exit 1
fi

if [[ "$PROJECT_EXISTS" != "kahn-building-materials" ]]; then
    echo "❌ 未找到Pages项目 'kahn-building-materials'"
    exit 1
fi

echo "✅ 所有必要资源验证通过"
echo ""

# 步骤3：执行配置
echo "🚀 步骤 3/3: 执行配置"
echo "----------------------"
echo ""

read -p "确认开始配置吗？(y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "配置已取消"
    exit 0
fi

echo "⏳ 正在配置R2自定义域名，请稍候..."

# 连接R2域名
R2_CONNECT_URL="${API_BASE}/accounts/${ACCOUNT_ID}/r2/buckets/kaen/domains/assets.kn-wallpaperglue.com"
R2_RESPONSE=$(curl -s -X PUT "$R2_CONNECT_URL" -H "$AUTH_HEADER")

if [[ $(echo "$R2_RESPONSE" | jq -r '.success') != "true" ]]; then
    echo "❌ R2域名连接失败"
    echo "错误: $(echo "$R2_RESPONSE" | jq -r '.errors[0].message')"
    exit 1
fi

echo "✅ R2域名连接成功"

# 更新Pages环境变量
PAGES_URL="${API_BASE}/accounts/$ACCOUNT_ID/pages/projects/kahn-building-materials"
ENV_PAYLOAD=$(cat <<EOF
{
  "deployment_configs": {
    "production": {
      "env_vars": {
        "R2_PUBLIC_DOMAIN": {
          "value": "https://assets.kn-wallpaperglue.com"
        }
      }
    }
  }
}
EOF
)

PAGES_UPDATE_RESPONSE=$(curl -s -X PATCH "$PAGES_URL" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data "$ENV_PAYLOAD")

if [[ $(echo "$PAGES_UPDATE_RESPONSE" | jq -r '.success') != "true" ]]; then
    echo "❌ Pages环境变量更新失败"
    echo "错误: $(echo "$PAGES_UPDATE_RESPONSE" | jq -r '.errors[0].message')"
    exit 1
fi

echo "✅ Pages环境变量更新成功"

# 触发重新部署
DEPLOY_URL="${API_BASE}/accounts/$ACCOUNT_ID/pages/projects/kahn-building-materials/deployments"
DEPLOY_RESPONSE=$(curl -s -X POST "$DEPLOY_URL" -H "$AUTH_HEADER")

if [[ $(echo "$DEPLOY_RESPONSE" | jq -r '.success') != "true" ]]; then
    echo "❌ 部署触发失败"
    echo "错误: $(echo "$DEPLOY_RESPONSE" | jq -r '.errors[0].message')"
    exit 1
fi

DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | jq -r '.result.id')
echo "✅ 重新部署已触发 (ID: $DEPLOY_ID)"

echo ""
echo "🎉 配置完成！"
echo "============"
echo ""
echo "✅ R2自定义域名: https://assets.kn-wallpaperglue.com"
echo "✅ DNS记录: 自动配置"
echo "✅ 环境变量: R2_PUBLIC_DOMAIN"
echo "✅ 重新部署: 已触发"
echo ""
echo "⏳ DNS传播可能需要几分钟时间"
echo "📱 您可以访问 https://kn-wallpaperglue.com 查看更新效果"
echo ""
echo "🔍 验证命令："
echo "curl -I https://assets.kn-wallpaperglue.com"
echo ""