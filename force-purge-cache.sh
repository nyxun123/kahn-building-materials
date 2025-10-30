#!/bin/bash

# 强制清理Cloudflare缓存 - 使用多种方法

set -e

echo "🧹 强制清理Cloudflare CDN缓存"
echo "═══════════════════════════════════════"
echo ""

DOMAIN="kn-wallpaperglue.com"
ACCOUNT_ID="6ae5d9a224117ca99a05304e017c43db"

# 方法1: 尝试通过Cloudflare API获取Zone ID并清理
echo "📍 方法1: 通过Cloudflare API清理缓存"
echo "──────────────────────────"

# 获取wrangler配置目录
WRANGLER_CONFIG_DIR="$HOME/.wrangler"

# 尝试从wrangler配置中读取API token
if [ -f "$WRANGLER_CONFIG_DIR/config/default.toml" ]; then
  echo "✅ 找到wrangler配置文件"
  
  # 尝试提取API token
  API_TOKEN=$(grep -o 'api_token = "[^"]*"' "$WRANGLER_CONFIG_DIR/config/default.toml" 2>/dev/null | cut -d'"' -f2 || echo "")
  
  if [ -n "$API_TOKEN" ]; then
    echo "✅ 获取到API Token"
    
    # 获取Zone ID
    echo "🔍 获取Zone ID..."
    ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}&account.id=${ACCOUNT_ID}" \
      -H "Authorization: Bearer ${API_TOKEN}" \
      -H "Content-Type: application/json")
    
    ZONE_ID=$(echo "$ZONE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$ZONE_ID" ] && [ "$ZONE_ID" != "null" ]; then
      echo "✅ Zone ID: $ZONE_ID"
      
      # 清理缓存
      echo "🧹 清理所有缓存..."
      PURGE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')
      
      if echo "$PURGE_RESPONSE" | grep -q '"success":true'; then
        echo "✅ 缓存清理成功！"
        echo ""
        
        # 等待缓存清理生效
        echo "⏳ 等待缓存清理生效（30秒）..."
        sleep 30
        
        # 验证
        echo ""
        echo "🔍 验证缓存清理效果..."
        LOADED_JS=$(curl -s "https://${DOMAIN}/en/products" | grep -o 'index-[^"]*\.js' | head -1)
        
        if [ "$LOADED_JS" == "index-B5a4vY9y.js" ]; then
          echo "✅ 成功！主域名已加载新版本: $LOADED_JS"
          exit 0
        else
          echo "⚠️  主域名仍加载: $LOADED_JS"
          echo "继续尝试其他方法..."
        fi
      else
        echo "❌ API清理失败"
        echo "响应: $PURGE_RESPONSE"
      fi
    else
      echo "❌ 无法获取Zone ID"
    fi
  else
    echo "⚠️  未找到API Token"
  fi
else
  echo "⚠️  未找到wrangler配置文件"
fi

echo ""
echo "📍 方法2: 重新部署触发缓存更新"
echo "──────────────────────────"

# 重新部署最新版本
echo "🚀 重新部署到Cloudflare Pages..."
if wrangler pages deploy dist --project-name=kn-wallpaperglue --branch=main 2>&1; then
  echo "✅ 重新部署成功"
  
  echo "⏳ 等待部署生效（30秒）..."
  sleep 30
  
  # 验证
  echo ""
  echo "🔍 验证部署效果..."
  LOADED_JS=$(curl -s "https://${DOMAIN}/en/products" | grep -o 'index-[^"]*\.js' | head -1)
  
  if [ "$LOADED_JS" == "index-B5a4vY9y.js" ]; then
    echo "✅ 成功！主域名已加载新版本: $LOADED_JS"
    exit 0
  else
    echo "⚠️  主域名仍加载: $LOADED_JS"
  fi
else
  echo "❌ 重新部署失败"
fi

echo ""
echo "📍 方法3: 使用缓存破坏参数验证"
echo "──────────────────────────"

# 使用缓存破坏参数测试
CACHE_BUSTER="?nocache=$(date +%s)"
echo "🔍 测试URL: https://${DOMAIN}/en/products${CACHE_BUSTER}"

RESPONSE=$(curl -s "https://${DOMAIN}/en/products${CACHE_BUSTER}")
LOADED_JS=$(echo "$RESPONSE" | grep -o 'index-[^"]*\.js' | head -1)

echo "📦 加载的文件: $LOADED_JS"

if [ "$LOADED_JS" == "index-B5a4vY9y.js" ]; then
  echo "✅ 新版本文件存在，但被CDN缓存"
else
  echo "⚠️  可能是部署问题"
fi

echo ""
echo "═══════════════════════════════════════"
echo "📋 手动清理指南"
echo "═══════════════════════════════════════"
echo ""
echo "自动清理未完全成功，请手动执行："
echo ""
echo "1. 访问 Cloudflare Dashboard"
echo "   https://dash.cloudflare.com/${ACCOUNT_ID}"
echo ""
echo "2. 选择域名: ${DOMAIN}"
echo ""
echo "3. 点击 Caching → Configuration → Purge Everything"
echo ""
echo "4. 等待2-3分钟后访问："
echo "   https://${DOMAIN}/en/products"
echo ""

exit 1

