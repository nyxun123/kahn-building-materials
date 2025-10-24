#!/bin/bash

# 验证当前R2配置状态的脚本
echo "🔍 当前R2配置状态验证"
echo "===================="
echo ""

# 测试当前上传功能
echo "1. 测试当前文件上传功能..."
TEST_RESPONSE=$(curl -s "https://kahn-building-materials.pages.dev/api/upload-file" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "fileData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "fileName": "status-test.png",
    "folder": "status-check"
  }')

echo "当前上传响应:"
echo "$TEST_RESPONSE" | jq .

# 提取当前URL
CURRENT_URL=$(echo "$TEST_RESPONSE" | jq -r '.data.original')
echo ""
echo "2. 当前文件URL格式:"
echo "📍 $CURRENT_URL"

# 检查是否使用R2默认域名
if [[ "$CURRENT_URL" == *"pub-b9f0c2c358074609bf8701513c879957.r2.dev"* ]]; then
    echo ""
    echo "⚠️ 状态：使用R2默认域名"
    echo "🎯 建议：配置自定义域名 assets.kn-wallpaperglue.com"
    echo ""
    echo "📋 配置步骤："
    echo "1. 获取Cloudflare API Token"
    echo "2. 运行: ./setup_r2_interactive.sh"
    echo "3. 输入Token和邮箱信息"
    echo "4. 确认配置"
else
    echo ""
    echo "✅ 状态：可能已配置自定义域名"
fi

# 测试目标域名是否可访问
echo ""
echo "3. 测试目标域名状态..."
TARGET_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://assets.kn-wallpaperglue.com" 2>/dev/null || echo "000")

case "$TARGET_STATUS" in
    "404")
        echo "🌐 assets.kn-wallpaperglue.com - 域名已连接，但文件不存在"
        ;;
    "200")
        echo "🌐 assets.kn-wallpaperglue.com - 域名正常工作"
        ;;
    "000")
        echo "🌐 assets.kn-wallpaperglue.com - 域名无法访问"
        ;;
    *)
        echo "🌐 assets.kn-wallpaperglue.com - HTTP状态码: $TARGET_STATUS"
        ;;
esac

echo ""
echo "📋 完整配置指南请参考: R2_CUSTOM_DOMAIN_SETUP_GUIDE.md"
echo "🔑 API Token获取指南请参考: API_TOKEN_GUIDE.md"