#!/bin/bash

# Cloudflare 缓存清理脚本
# 用于清理 kn-wallpaperglue.com 域名的所有CDN缓存

set -e  # 遇到错误立即退出

echo "🧹 Cloudflare CDN 缓存清理工具"
echo "═══════════════════════════════════════"
echo ""

# 配置
DOMAIN="kn-wallpaperglue.com"
ACCOUNT_ID="6ae5d9a224117ca99a05304e017c43db"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查wrangler是否已登录
echo "🔐 检查Cloudflare认证状态..."
if ! wrangler whoami &>/dev/null; then
  echo -e "${RED}❌ 错误：未登录Cloudflare${NC}"
  echo "请先运行: wrangler login"
  exit 1
fi

echo -e "${GREEN}✅ 已登录Cloudflare${NC}"
echo ""

# 获取Zone ID
echo "🔍 获取域名Zone ID..."
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}&account.id=${ACCOUNT_ID}" \
  -H "Authorization: Bearer $(wrangler whoami 2>&1 | grep -o 'OAuth Token' | head -1 && echo '')" \
  2>/dev/null || echo "")

# 如果通过API获取失败，尝试使用wrangler命令
if [ -z "$ZONE_ID" ] || [ "$ZONE_ID" == "null" ]; then
  echo -e "${YELLOW}⚠️  通过API获取Zone ID失败，尝试手动方式...${NC}"
  
  # 方法1：通过Cloudflare API直接获取（需要API Token）
  echo ""
  echo "📋 请按以下步骤手动清理缓存："
  echo ""
  echo "1️⃣  访问 Cloudflare Dashboard"
  echo "   https://dash.cloudflare.com"
  echo ""
  echo "2️⃣  选择域名: ${DOMAIN}"
  echo ""
  echo "3️⃣  点击左侧菜单 'Caching'（缓存）"
  echo ""
  echo "4️⃣  点击 'Configuration'（配置）标签"
  echo ""
  echo "5️⃣  找到 'Purge Cache'（清理缓存）部分"
  echo ""
  echo "6️⃣  点击 'Purge Everything'（清理所有内容）"
  echo ""
  echo "7️⃣  在确认对话框中点击 'Purge Everything' 确认"
  echo ""
  echo -e "${BLUE}💡 提示：清理缓存后，网站可能会短暂变慢（1-2分钟）${NC}"
  echo ""
  
  # 询问用户是否已完成手动清理
  read -p "是否已完成手动清理缓存？(y/n) " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}✅ 继续验证流程...${NC}"
  else
    echo -e "${YELLOW}⚠️  请先完成缓存清理，然后重新运行此脚本${NC}"
    exit 0
  fi
else
  # 使用API清理缓存
  echo -e "${GREEN}✅ 获取到Zone ID${NC}"
  echo ""
  
  echo "🧹 开始清理CDN缓存..."
  
  # 调用Cloudflare API清理缓存
  PURGE_RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer $(cat ~/.wrangler/config/default.toml 2>/dev/null | grep 'api_token' | cut -d'"' -f2)" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' 2>/dev/null || echo '{"success":false}')
  
  # 检查清理结果
  if echo "$PURGE_RESULT" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ CDN缓存清理成功！${NC}"
  else
    echo -e "${YELLOW}⚠️  API清理失败，请手动清理${NC}"
    echo ""
    echo "📋 手动清理步骤："
    echo "1. 访问 https://dash.cloudflare.com"
    echo "2. 选择域名: ${DOMAIN}"
    echo "3. Caching → Configuration → Purge Everything"
    echo ""
    read -p "是否已完成手动清理？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
fi

echo ""
echo "⏳ 等待缓存清理生效（30秒）..."
sleep 30

echo ""
echo "🔍 验证新版本是否已生效..."
echo ""

# 检查主域名加载的JS文件
echo "📦 检查主域名加载的JavaScript文件..."
LOADED_JS=$(curl -s "https://${DOMAIN}/en/products" | grep -o 'index-[^"]*\.js' | head -1)

if [ -z "$LOADED_JS" ]; then
  echo -e "${YELLOW}⚠️  无法检测到加载的JS文件${NC}"
else
  echo "   加载的文件: ${LOADED_JS}"
  
  if [ "$LOADED_JS" == "index-B5a4vY9y.js" ]; then
    echo -e "${GREEN}   ✅ 正确！加载了新版本${NC}"
  elif [ "$LOADED_JS" == "index-DM5o1RP3.js" ]; then
    echo -e "${RED}   ❌ 错误！仍在加载旧版本${NC}"
    echo ""
    echo "🔧 建议操作："
    echo "1. 再次清理缓存（可能需要多次）"
    echo "2. 等待5-10分钟让CDN完全更新"
    echo "3. 使用隐身模式访问网站"
    echo "4. 强制刷新浏览器：Ctrl+Shift+R"
  else
    echo -e "${YELLOW}   ⚠️  加载了其他版本: ${LOADED_JS}${NC}"
  fi
fi

echo ""

# 检查API请求
echo "🌐 检查API端点..."
API_RESPONSE=$(curl -s "https://${DOMAIN}/api/products" | head -100)

if echo "$API_RESPONSE" | grep -q '"success":true'; then
  PRODUCT_COUNT=$(echo "$API_RESPONSE" | grep -o '"data":\[' | wc -l)
  echo -e "${GREEN}   ✅ API正常响应${NC}"
  echo "   产品数据: 可用"
else
  echo -e "${RED}   ❌ API响应异常${NC}"
fi

echo ""
echo "═══════════════════════════════════════"
echo "📋 验证清单"
echo "═══════════════════════════════════════"
echo ""
echo "请在浏览器中验证以下内容："
echo ""
echo "1️⃣  访问: https://${DOMAIN}/en/products"
echo "2️⃣  打开开发者工具（F12）"
echo "3️⃣  查看Console控制台，应该看到："
echo "    🔍 正在获取产品数据..."
echo "    📡 API响应状态: 200"
echo "    📦 API返回数据: {success: true, data: Array(6), ...}"
echo "    ✅ 成功获取 6 个产品"
echo ""
echo "4️⃣  查看Network面板："
echo "    - 确认加载的是 index-B5a4vY9y.js"
echo "    - 确认没有无限循环的API请求"
echo ""
echo "5️⃣  页面应该显示6个产品卡片（不是loading状态）"
echo ""
echo "6️⃣  测试其他语言版本："
echo "    - 中文: https://${DOMAIN}/zh/products"
echo "    - 俄文: https://${DOMAIN}/ru/products"
echo ""

# 提供快速验证命令
echo "═══════════════════════════════════════"
echo "🔧 快速验证命令"
echo "═══════════════════════════════════════"
echo ""
echo "# 检查加载的JS文件"
echo "curl -s https://${DOMAIN}/en/products | grep -o 'index-[^\"]*\.js' | head -1"
echo ""
echo "# 检查API响应"
echo "curl -s https://${DOMAIN}/api/products | jq '{success, count: (.data | length)}'"
echo ""
echo "# 检查HTTP缓存状态"
echo "curl -I https://${DOMAIN}/en/products | grep -i 'cf-cache-status'"
echo ""

echo "═══════════════════════════════════════"
echo -e "${GREEN}✅ 缓存清理流程完成！${NC}"
echo "═══════════════════════════════════════"
echo ""

# 如果检测到仍是旧版本，提供额外建议
if [ "$LOADED_JS" == "index-DM5o1RP3.js" ]; then
  echo -e "${YELLOW}⚠️  检测到仍在加载旧版本，建议：${NC}"
  echo ""
  echo "1. 等待5-10分钟后重新检查"
  echo "2. 在Cloudflare Dashboard中再次执行 Purge Everything"
  echo "3. 检查是否有Page Rules影响缓存"
  echo "4. 联系Cloudflare支持检查CDN配置"
  echo ""
  exit 1
fi

exit 0

