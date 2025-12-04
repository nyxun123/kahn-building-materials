#!/bin/bash

# SEO Sitemap 验证脚本
# 检查所有 sitemap 文件是否可访问

BASE_URL="https://kn-wallpaperglue.com"

echo "🔍 开始验证 Sitemap 文件..."
echo "目标站点: $BASE_URL"
echo ""

# Sitemap 文件列表
SITEMAPS=(
  "sitemap.xml"
  "sitemap-index.xml"
  "sitemap-zh.xml"
  "sitemap-en.xml"
  "sitemap-ru.xml"
  "sitemap-vi.xml"
  "sitemap-th.xml"
  "sitemap-id.xml"
  "sitemap-products.xml"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

for sitemap in "${SITEMAPS[@]}"; do
  URL="$BASE_URL/$sitemap"
  echo "📄 检查: $sitemap"
  
  # 获取 HTTP 状态码和 Content-Type
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}|%{content_type}" "$URL")
  HTTP_CODE=$(echo "$RESPONSE" | cut -d'|' -f1)
  CONTENT_TYPE=$(echo "$RESPONSE" | cut -d'|' -f2)
  
  if [ "$HTTP_CODE" = "200" ]; then
    if [[ "$CONTENT_TYPE" == *"xml"* ]]; then
      echo "   ✅ 状态码: $HTTP_CODE, Content-Type: $CONTENT_TYPE"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
      echo "   ⚠️  状态码: $HTTP_CODE, 但 Content-Type 不是 XML: $CONTENT_TYPE"
      FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
  else
    echo "   ❌ 失败! 状态码: $HTTP_CODE"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
  echo ""
done

echo "========================================="
echo "📊 验证结果："
echo "   成功: $SUCCESS_COUNT"
echo "   失败: $FAIL_COUNT"
echo "   总计: ${#SITEMAPS[@]}"
echo "========================================="

if [ $FAIL_COUNT -eq 0 ]; then
  echo "🎉 所有 sitemap 文件验证通过！"
  exit 0
else
  echo "⚠️  有 $FAIL_COUNT 个文件验证失败，请检查。"
  exit 1
fi
