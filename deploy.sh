#!/bin/bash

# 部署脚本 - 将最新构建部署到Cloudflare Pages并自动清理缓存

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🚀 Cloudflare Pages 完整部署流程"
echo "═══════════════════════════════════════"
echo ""

# 参数解析
AUTO_PURGE=true
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --no-purge)
      AUTO_PURGE=false
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    *)
      echo "未知参数: $1"
      echo "用法: $0 [--no-purge] [--skip-build]"
      exit 1
      ;;
  esac
done

# 1. 确认构建产物存在
echo "1️⃣  检查构建产物"
echo "──────────────────────────"

if [ ! -d "dist" ]; then
  if [ "$SKIP_BUILD" = true ]; then
    echo -e "${RED}❌ 错误：dist目录不存在，且指定了--skip-build${NC}"
    exit 1
  fi

  echo -e "${YELLOW}⚠️  dist目录不存在，开始构建...${NC}"
  pnpm build
fi

echo -e "${GREEN}✅ 构建产物目录存在${NC}"
echo ""

# 2. 显示关键文件信息
echo "2️⃣  关键文件检查"
echo "──────────────────────────"

# 查找最新的index-*.js文件
LATEST_INDEX_JS=$(ls -t dist/js/index-*.js 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "")

if [ -n "$LATEST_INDEX_JS" ]; then
  echo -e "${GREEN}✅ 找到最新构建文件: ${LATEST_INDEX_JS}${NC}"
  ls -lh "dist/js/${LATEST_INDEX_JS}"
else
  echo -e "${RED}❌ 错误：未找到index-*.js文件${NC}"
  exit 1
fi

# 检查产品页面组件
if grep -q "🔍 正在获取产品数据" "dist/js/${LATEST_INDEX_JS}" 2>/dev/null; then
  echo -e "${GREEN}✅ 产品页面包含调试日志（已修复）${NC}"
else
  echo -e "${YELLOW}⚠️  产品页面可能未包含最新修复${NC}"
fi

echo ""

# 3. 部署到Cloudflare Pages
echo "3️⃣  部署到Cloudflare Pages"
echo "──────────────────────────"

# 使用wrangler pages deploy命令
# 注意：自定义域名 kn-wallpaperglue.com 绑定在 kahn-building-materials 项目上
echo "🌐 开始部署..."
DEPLOY_OUTPUT=$(wrangler pages deploy dist --project-name=kahn-building-materials --branch=main --commit-dirty=true 2>&1)
echo "$DEPLOY_OUTPUT"

# 提取部署URL
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[a-z0-9]*\.kahn-building-materials\.pages\.dev' | head -1)

if [ -n "$DEPLOY_URL" ]; then
  echo ""
  echo -e "${GREEN}✅ 部署成功！${NC}"
  echo -e "${BLUE}📎 预览URL: ${DEPLOY_URL}${NC}"
else
  echo ""
  echo -e "${GREEN}✅ 部署完成${NC}"
fi

echo ""

# 4. 自动清理CDN缓存
if [ "$AUTO_PURGE" = true ]; then
  echo "4️⃣  清理CDN缓存"
  echo "──────────────────────────"
  echo ""

  if [ -f "./purge-cache.sh" ]; then
    chmod +x ./purge-cache.sh
    ./purge-cache.sh
  else
    echo -e "${YELLOW}⚠️  未找到purge-cache.sh脚本${NC}"
    echo "请手动清理缓存："
    echo "1. 访问 https://dash.cloudflare.com"
    echo "2. 选择域名 kn-wallpaperglue.com"
    echo "3. Caching → Configuration → Purge Everything"
  fi
else
  echo "4️⃣  跳过缓存清理（使用了--no-purge参数）"
  echo ""
  echo -e "${YELLOW}⚠️  重要提示：${NC}"
  echo "部署完成，但未清理CDN缓存。"
  echo "主域名可能仍显示旧版本，请手动清理缓存："
  echo ""
  echo "方法1：运行缓存清理脚本"
  echo "  ./purge-cache.sh"
  echo ""
  echo "方法2：手动清理"
  echo "  1. 访问 https://dash.cloudflare.com"
  echo "  2. 选择域名 kn-wallpaperglue.com"
  echo "  3. Caching → Configuration → Purge Everything"
  echo ""
fi

echo ""
echo "═══════════════════════════════════════"
echo -e "${GREEN}🎉 部署流程完成！${NC}"
echo "═══════════════════════════════════════"
echo ""
echo "📋 后续步骤："
echo "1. 访问 https://kn-wallpaperglue.com/en/products"
echo "2. 打开开发者工具（F12）检查Console和Network"
echo "3. 确认页面显示6个产品（不是loading状态）"
echo "4. 测试其他语言版本（/zh/products, /ru/products）"
echo ""

if [ -n "$DEPLOY_URL" ]; then
  echo "💡 提示：可以先在预览URL测试："
  echo "   ${DEPLOY_URL}/en/products"
  echo ""
fi

