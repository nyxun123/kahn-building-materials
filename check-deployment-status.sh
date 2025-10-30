#!/bin/bash

# Cloudflare Pages 部署状态检查脚本
# 用途：快速检查部署状态和验证 API 修复

set -e

echo "======================================"
echo "  Cloudflare Pages 部署状态检查"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="kahn-building-materials"
DOMAIN="kn-wallpaperglue.com"
EXPECTED_COMMIT="b99d7c9"

echo "📋 项目信息："
echo "  - 项目名称: $PROJECT_NAME"
echo "  - 生产域名: $DOMAIN"
echo "  - 预期 Commit: $EXPECTED_COMMIT (JWT 修复)"
echo ""

# 1. 检查 Git 状态
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  检查 Git 状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "本地最新提交："
git log --oneline -3
echo ""

echo "远程最新提交："
git log origin/main --oneline -3
echo ""

# 检查是否有未推送的提交
UNPUSHED=$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')
if [ "$UNPUSHED" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  警告：有 $UNPUSHED 个未推送的提交${NC}"
    git log origin/main..HEAD --oneline
    echo ""
else
    echo -e "${GREEN}✅ 所有提交已推送到 GitHub${NC}"
    echo ""
fi

# 2. 检查 Cloudflare Pages 部署
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  检查 Cloudflare Pages 部署"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v wrangler &> /dev/null; then
    echo "获取最近的部署列表..."
    echo ""
    wrangler pages deployment list --project-name=$PROJECT_NAME | head -15
    echo ""
    
    # 检查最新部署的 commit
    LATEST_DEPLOYMENT=$(wrangler pages deployment list --project-name=$PROJECT_NAME 2>/dev/null | grep -m1 "Production" | awk '{print $4}')
    
    if [ -n "$LATEST_DEPLOYMENT" ]; then
        echo "最新部署的 Commit: $LATEST_DEPLOYMENT"
        
        if [ "$LATEST_DEPLOYMENT" = "$EXPECTED_COMMIT" ]; then
            echo -e "${GREEN}✅ 最新部署包含 JWT 修复${NC}"
        else
            echo -e "${RED}❌ 最新部署不是预期的 commit${NC}"
            echo -e "${YELLOW}   预期: $EXPECTED_COMMIT${NC}"
            echo -e "${YELLOW}   实际: $LATEST_DEPLOYMENT${NC}"
        fi
    fi
    echo ""
else
    echo -e "${RED}❌ Wrangler CLI 未安装${NC}"
    echo "   安装命令: npm install -g wrangler"
    echo ""
fi

# 3. 测试生产环境 API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  测试生产环境 API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "测试登录 API..."
echo "URL: https://$DOMAIN/api/admin/login"
echo ""

# 测试登录 API
RESPONSE=$(curl -s -X POST "https://$DOMAIN/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin#2025"}')

# 检查响应
if echo "$RESPONSE" | grep -q '"code":200'; then
    echo -e "${GREEN}✅ API 响应成功 (HTTP 200)${NC}"
    echo ""
    
    # 检查 authType
    AUTH_TYPE=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('authType', 'N/A'))" 2>/dev/null || echo "N/A")
    
    echo "认证类型: $AUTH_TYPE"
    
    if [ "$AUTH_TYPE" = "JWT" ]; then
        echo -e "${GREEN}✅✅✅ JWT 修复已生效！${NC}"
        echo ""
        echo "完整响应："
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    elif [ "$AUTH_TYPE" = "D1_DATABASE" ]; then
        echo -e "${RED}❌ 仍然使用旧的认证方式 (D1_DATABASE)${NC}"
        echo -e "${YELLOW}   需要重新部署包含 JWT 修复的代码${NC}"
    else
        echo -e "${YELLOW}⚠️  无法确定认证类型${NC}"
        echo "响应："
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    fi
elif echo "$RESPONSE" | grep -q '"code":500'; then
    echo -e "${RED}❌ API 返回 500 错误${NC}"
    echo ""
    echo "可能原因："
    echo "  - D1 数据库绑定缺失"
    echo "  - R2 存储桶绑定缺失"
    echo "  - 后端代码错误"
    echo ""
    echo "响应："
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo -e "${RED}❌ API 响应异常${NC}"
    echo ""
    echo "响应："
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
fi

echo ""

# 4. 总结和建议
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  总结和建议"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 判断状态
if [ "$AUTH_TYPE" = "JWT" ]; then
    echo -e "${GREEN}🎉 恭喜！所有修复已成功部署！${NC}"
    echo ""
    echo "✅ 代码已推送到 GitHub"
    echo "✅ Cloudflare Pages 已部署最新代码"
    echo "✅ JWT 认证修复已生效"
    echo ""
    echo "下一步："
    echo "  1. 测试管理后台登录功能"
    echo "  2. 验证仪表板数据显示"
    echo "  3. 检查产品详情页功能"
else
    echo -e "${YELLOW}⚠️  修复尚未完全生效${NC}"
    echo ""
    echo "建议操作："
    echo ""
    echo "方案 1: 手动触发 Cloudflare Pages 部署（最快）"
    echo "  1. 访问: https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/pages/view/kahn-building-materials"
    echo "  2. 点击 'Create deployment' 或找到最新部署点击 'Retry deployment'"
    echo "  3. 等待 2-3 分钟部署完成"
    echo "  4. 重新运行此脚本验证"
    echo ""
    echo "方案 2: 检查 GitHub Webhook"
    echo "  1. 访问: https://github.com/nyxun123/kahn-building-materials/settings/hooks"
    echo "  2. 检查 Cloudflare Pages Webhook 状态"
    echo "  3. 查看 Recent Deliveries 是否有失败记录"
    echo "  4. 如果失败，点击 'Redeliver' 重新发送"
    echo ""
    echo "方案 3: 创建触发提交"
    echo "  运行: git commit --allow-empty -m 'trigger deployment' && git push"
    echo "  等待 2-3 分钟后重新运行此脚本"
    echo ""
    echo "详细指南："
    echo "  查看 GITHUB_WEBHOOK_FIX_GUIDE.md 文件"
fi

echo ""
echo "======================================"
echo "  检查完成"
echo "======================================"

