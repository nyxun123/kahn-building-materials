#!/bin/bash

# 自动提交 Sitemap 到搜索引擎
# 使用 HTTP Ping 方式通知搜索引擎

BASE_URL="https://kn-wallpaperglue.com"
SITEMAP_URL="$BASE_URL/sitemap.xml"

echo "🚀 开始自动提交 Sitemap 到搜索引擎..."
echo "目标 Sitemap: $SITEMAP_URL"
echo ""

# 1. Google Ping
echo "1️⃣  提交到 Google..."
GOOGLE_PING="http://www.google.com/ping?sitemap=$(echo $SITEMAP_URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
GOOGLE_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "$GOOGLE_PING")

if [ "$GOOGLE_RESULT" = "200" ]; then
  echo "   ✅ Google 提交成功 (HTTP $GOOGLE_RESULT)"
else
  echo "   ⚠️  Google 响应码: $GOOGLE_RESULT (可能需要手动提交)"
fi
echo ""

# 2. Bing Ping
echo "2️⃣  提交到 Bing..."
BING_PING="http://www.bing.com/ping?sitemap=$(echo $SITEMAP_URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
BING_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "$BING_PING")

if [ "$BING_RESULT" = "200" ]; then
  echo "   ✅ Bing 提交成功 (HTTP $BING_RESULT)"
else
  echo "   ⚠️  Bing 响应码: $BING_RESULT (可能需要手动提交)"
fi
echo ""

# 3. 其他语言 Sitemap (可选)
echo "3️⃣  提交其他语言 Sitemap..."

LANG_SITEMAPS=("zh" "en" "ru" "vi" "th" "id")

for lang in "${LANG_SITEMAPS[@]}"; do
  LANG_SITEMAP_URL="$BASE_URL/sitemap-$lang.xml"
  
  # Google
  GOOGLE_LANG_PING="http://www.google.com/ping?sitemap=$(echo $LANG_SITEMAP_URL | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
  RESULT=$(curl -s -o /dev/null -w "%{http_code}" "$GOOGLE_LANG_PING")
  
  if [ "$RESULT" = "200" ]; then
    echo "   ✅ sitemap-$lang.xml 提交成功"
  else
    echo "   ⚠️  sitemap-$lang.xml 响应码: $RESULT"
  fi
done

echo ""
echo "========================================="
echo "✅ Sitemap 自动提交完成！"
echo ""
echo "📝 注意事项："
echo "1. HTTP Ping 只是通知搜索引擎，不保证立即索引"
echo "2. 首次提交建议在 Search Console 中手动验证"
echo "3. 搜索引擎通常需要 1-4 周才能完整索引"
echo ""
echo "🔍 验证索引状态："
echo "- Google: site:kn-wallpaperglue.com"
echo "- Bing: site:kn-wallpaperglue.com"
echo "========================================="
