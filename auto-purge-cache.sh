#!/bin/bash

# 自动清理 Cloudflare CDN 缓存
# 需要 Cloudflare API Token（如果已配置）

set -e

DOMAIN="kn-wallpaperglue.com"
ACCOUNT_ID="6ae5d9a224117ca99a05304e017c43db"

echo "🧹 Cloudflare CDN 缓存自动清理工具"
echo "═══════════════════════════════════════"
echo ""

# 尝试方法1: 使用 Cloudflare Pages 重新部署（会自动清理相关缓存）
echo "📍 方法1: 通过重新部署触发缓存更新"
echo "─────────────────────────────────────"

# 检查是否有可用的 API Token 或 Zone ID
echo "💡 提示：清理 CDN 缓存有两种方式："
echo ""
echo "方式A: 手动清理（推荐，最简单）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📍 直接访问链接（如果已登录Cloudflare）："
echo "     https://dash.cloudflare.com/${ACCOUNT_ID}/cache/purge"
echo ""
echo "  📋 或按以下步骤："
echo "     1. 访问: https://dash.cloudflare.com"
echo "     2. 选择域名: ${DOMAIN}"
echo "     3. 点击: Caching → Configuration"
echo "     4. 点击: Purge Everything"
echo "     5. 确认操作"
echo ""
echo "方式B: 使用 API 自动清理（需要 API Token）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  如需使用 API，请："
echo "  1. 创建 API Token: https://dash.cloudflare.com/profile/api-tokens"
echo "  2. 获取 Zone ID（在域名概览页）"
echo "  3. 运行以下命令："
echo ""
echo "     export CF_ZONE_ID='你的Zone_ID'"
echo "     export CF_API_TOKEN='你的API_Token'"
echo "     bash auto-purge-cache.sh --api"
echo ""

# 检查是否有 API Token 和 Zone ID
if [ "$1" == "--api" ] && [ -n "$CF_ZONE_ID" ] && [ -n "$CF_API_TOKEN" ]; then
  echo "🔧 使用 API 清理缓存..."
  echo ""
  
  PURGE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}')
  
  if echo "$PURGE_RESPONSE" | grep -q '"success":true'; then
    echo "✅ 缓存清理成功！"
    echo ""
    echo "⏳ 等待 30-60 秒让缓存清理生效..."
    sleep 30
    echo ""
    echo "✅ 现在可以访问验证："
    echo "   https://kn-wallpaperglue.com/admin/login"
    echo "   （按 Ctrl+Shift+R 强制刷新）"
    exit 0
  else
    echo "❌ API 清理失败"
    echo "响应: $PURGE_RESPONSE"
    exit 1
  fi
fi

echo ""
echo "═══════════════════════════════════════"
echo "📋 推荐操作"
echo "═══════════════════════════════════════"
echo ""
echo "✅ 最简单的方式："
echo ""
echo "   1. 打开浏览器访问以下链接（如果已登录Cloudflare）："
echo "      https://dash.cloudflare.com/${ACCOUNT_ID}/cache/purge"
echo ""
echo "   2. 点击 'Purge Everything' 按钮"
echo ""
echo "   3. 等待 30-60 秒"
echo ""
echo "   4. 访问验证："
echo "      https://kn-wallpaperglue.com/admin/login"
echo "      按 Ctrl+Shift+R 强制刷新"
echo ""
echo "═══════════════════════════════════════"
echo "✅ 脚本执行完成"
echo "═══════════════════════════════════════"



