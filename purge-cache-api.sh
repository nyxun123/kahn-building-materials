#!/bin/bash

# Cloudflare 缓存清理脚本 - 使用 Cloudflare API
# 用于清理 kn-wallpaperglue.com 域名的所有CDN缓存

set -e

echo "🧹 Cloudflare CDN 缓存清理"
echo "═══════════════════════════════════════"
echo ""

DOMAIN="kn-wallpaperglue.com"
ACCOUNT_ID="6ae5d9a224117ca99a05304e017c43db"

# 检查是否需要API Token
echo "📋 准备清理缓存..."
echo ""
echo "⚠️  注意：清理CDN缓存需要 Cloudflare API Token"
echo ""
echo "请选择清理方式："
echo ""
echo "方法1: 使用 Cloudflare Dashboard（推荐，最简单）"
echo "  1. 访问: https://dash.cloudflare.com/${ACCOUNT_ID}"
echo "  2. 选择域名: ${DOMAIN}"
echo "  3. 点击: Caching → Configuration → Purge Everything"
echo "  4. 点击确认按钮"
echo ""
echo "方法2: 使用 Cloudflare API（需要API Token）"
echo "  1. 获取 Zone ID（在 Cloudflare Dashboard 的域名概览页可以看到）"
echo "  2. 创建 API Token（权限包含 Cache Purge）"
echo "  3. 使用以下命令："
echo ""
echo "     curl -X POST \"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache\" \\"
echo "       -H \"Authorization: Bearer {API_TOKEN}\" \\"
echo "       -H \"Content-Type: application/json\" \\"
echo "       --data '{\"purge_everything\":true}'"
echo ""

# 尝试使用 wrangler 获取 Zone ID
echo "🔍 尝试自动获取 Zone ID..."
echo ""

# 使用 wrangler 的配置来获取认证信息
if command -v wrangler &> /dev/null; then
  echo "✅ 找到 wrangler 工具"
  
  # 检查是否登录
  if wrangler whoami &>/dev/null; then
    echo "✅ 已登录 Cloudflare"
    echo ""
    echo "⚠️  由于使用的是 OAuth Token，需要通过 Dashboard 手动清理"
    echo ""
    echo "📋 快速操作步骤："
    echo ""
    echo "1. 打开浏览器访问："
    echo "   https://dash.cloudflare.com/${ACCOUNT_ID}/cache/purge"
    echo ""
    echo "2. 或者："
    echo "   访问: https://dash.cloudflare.com"
    echo "   → 选择域名: ${DOMAIN}"
    echo "   → Caching"
    echo "   → Configuration"
    echo "   → Purge Everything"
    echo "   → 点击确认"
    echo ""
    echo "3. 等待 30-60 秒让缓存清理生效"
    echo ""
    echo "4. 然后访问验证："
    echo "   https://kn-wallpaperglue.com/admin/login"
    echo ""
    echo "   按 Ctrl+Shift+R 强制刷新"
    echo ""
  else
    echo "❌ 未登录 Cloudflare"
    echo "请运行: wrangler login"
  fi
else
  echo "❌ 未找到 wrangler 工具"
fi

echo ""
echo "═══════════════════════════════════════"
echo "✅ 脚本执行完成"
echo "═══════════════════════════════════════"



