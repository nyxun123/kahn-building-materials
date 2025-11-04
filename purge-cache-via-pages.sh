#!/bin/bash

# 通过 Cloudflare Pages API 清理缓存
# 当重新部署 Pages 时，会自动清理相关缓存

echo "🚀 通过重新部署 Cloudflare Pages 清理缓存"
echo "═══════════════════════════════════════"
echo ""

PROJECT_NAME="kahn-building-materials"

# 检查最新部署
echo "📋 检查最新部署状态..."
LATEST_DEPLOY=$(wrangler pages deployment list --project-name=$PROJECT_NAME 2>&1 | grep "Production" | head -1 | awk '{print $4}')

if [ -n "$LATEST_DEPLOY" ]; then
  echo "✅ 最新部署 Commit: $LATEST_DEPLOY"
else
  echo "⚠️  无法获取最新部署信息"
fi

echo ""
echo "💡 提示：重新部署 Cloudflare Pages 会自动清理相关缓存"
echo ""
echo "📋 当前状态："
echo "   - 代码已推送到 GitHub (Commit: 8e99db2, 3333c5e)"
echo "   - Cloudflare Pages 应该会自动检测并部署"
echo ""
echo "⏳ 如果自动部署未触发，可以："
echo ""
echo "   1. 访问 Cloudflare Dashboard:"
echo "      https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/pages/view/kahn-building-materials"
echo ""
echo "   2. 点击 'Create deployment' 或找到最新提交点击 'Retry'"
echo ""
echo "   3. 等待 2-3 分钟部署完成"
echo ""
echo "📝 清理CDN缓存（必需步骤）："
echo ""
echo "   在部署完成后，清理 CDN 缓存："
echo ""
echo "   1. 访问: https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db"
echo "   2. 选择域名: kn-wallpaperglue.com"
echo "   3. 点击: Caching → Configuration → Purge Everything"
echo "   4. 点击确认"
echo "   5. 等待 30-60 秒"
echo "   6. 访问: https://kn-wallpaperglue.com/admin/login"
echo "   7. 按 Ctrl+Shift+R 强制刷新"
echo ""



