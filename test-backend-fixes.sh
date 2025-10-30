#!/bin/bash

# 后端管理系统修复验证测试脚本
# 用于测试仪表板数据加载和产品详情页显示修复

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BASE_URL="https://kn-wallpaperglue.com"
ADMIN_EMAIL="admin@kn-wallpaperglue.com"
ADMIN_PASSWORD="admin123"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}后端管理系统修复验证测试${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试结果记录
test_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name"
        [ -n "$message" ] && echo -e "   ${message}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name"
        [ -n "$message" ] && echo -e "   ${RED}${message}${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# ============================================
# 测试 1: 管理员登录并获取 JWT Token
# ============================================
echo -e "${YELLOW}测试 1: 管理员登录并获取 JWT Token${NC}"
echo "-------------------------------------------"

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}")

echo "登录响应: $LOGIN_RESPONSE"

# 提取 accessToken
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    test_result "管理员登录" "PASS" "成功获取 JWT Token: ${ACCESS_TOKEN:0:20}..."
    echo -e "${GREEN}Access Token (前20字符): ${ACCESS_TOKEN:0:20}...${NC}"
else
    test_result "管理员登录" "FAIL" "无法获取有效的 JWT Token"
    echo -e "${RED}完整响应: $LOGIN_RESPONSE${NC}"
    exit 1
fi

echo ""

# ============================================
# 测试 2: 仪表板数据加载（使用 JWT Token）
# ============================================
echo -e "${YELLOW}测试 2: 仪表板数据加载（使用 JWT Token）${NC}"
echo "-------------------------------------------"

DASHBOARD_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  "${BASE_URL}/api/admin/dashboard/stats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

HTTP_STATUS=$(echo "$DASHBOARD_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
DASHBOARD_BODY=$(echo "$DASHBOARD_RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP 状态码: $HTTP_STATUS"
echo "响应内容: ${DASHBOARD_BODY:0:200}..."

if [ "$HTTP_STATUS" = "200" ]; then
    # 检查响应中是否包含预期的数据字段
    if echo "$DASHBOARD_BODY" | grep -q '"totalProducts"' && \
       echo "$DASHBOARD_BODY" | grep -q '"totalContacts"' && \
       echo "$DASHBOARD_BODY" | grep -q '"unreadContacts"'; then
        test_result "仪表板数据加载" "PASS" "成功获取仪表板统计数据"
        
        # 提取并显示关键数据
        TOTAL_PRODUCTS=$(echo "$DASHBOARD_BODY" | grep -o '"totalProducts":[0-9]*' | cut -d':' -f2)
        TOTAL_CONTACTS=$(echo "$DASHBOARD_BODY" | grep -o '"totalContacts":[0-9]*' | cut -d':' -f2)
        UNREAD_CONTACTS=$(echo "$DASHBOARD_BODY" | grep -o '"unreadContacts":[0-9]*' | cut -d':' -f2)
        
        echo -e "${GREEN}   总产品数: ${TOTAL_PRODUCTS}${NC}"
        echo -e "${GREEN}   总留言数: ${TOTAL_CONTACTS}${NC}"
        echo -e "${GREEN}   未读留言: ${UNREAD_CONTACTS}${NC}"
    else
        test_result "仪表板数据加载" "FAIL" "响应缺少必需的数据字段"
    fi
elif [ "$HTTP_STATUS" = "401" ]; then
    test_result "仪表板数据加载" "FAIL" "JWT 认证失败（401 Unauthorized）"
else
    test_result "仪表板数据加载" "FAIL" "HTTP 状态码: $HTTP_STATUS"
fi

echo ""

# ============================================
# 测试 3: 创建测试产品
# ============================================
echo -e "${YELLOW}测试 3: 创建测试产品${NC}"
echo "-------------------------------------------"

TEST_PRODUCT_CODE="TEST-$(date +%s)"
echo "测试产品代码: $TEST_PRODUCT_CODE"

CREATE_PRODUCT_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "${BASE_URL}/api/admin/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"product_code\": \"${TEST_PRODUCT_CODE}\",
    \"name_zh\": \"测试产品\",
    \"name_en\": \"Test Product\",
    \"description_zh\": \"这是一个测试产品\",
    \"category\": \"adhesive\",
    \"is_active\": true,
    \"price_range\": \"100-200\"
  }")

HTTP_STATUS=$(echo "$CREATE_PRODUCT_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
CREATE_BODY=$(echo "$CREATE_PRODUCT_RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP 状态码: $HTTP_STATUS"
echo "响应内容: ${CREATE_BODY:0:200}..."

if [ "$HTTP_STATUS" = "200" ]; then
    if echo "$CREATE_BODY" | grep -q '"success":true'; then
        test_result "创建测试产品" "PASS" "成功创建产品: $TEST_PRODUCT_CODE"
    else
        test_result "创建测试产品" "FAIL" "创建失败: $(echo "$CREATE_BODY" | grep -o '"message":"[^"]*"')"
    fi
else
    test_result "创建测试产品" "FAIL" "HTTP 状态码: $HTTP_STATUS"
fi

echo ""

# ============================================
# 测试 4: 访问产品详情页（已激活）
# ============================================
echo -e "${YELLOW}测试 4: 访问产品详情页（已激活）${NC}"
echo "-------------------------------------------"

sleep 2  # 等待数据库写入

PRODUCT_DETAIL_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  "${BASE_URL}/api/products/${TEST_PRODUCT_CODE}")

HTTP_STATUS=$(echo "$PRODUCT_DETAIL_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
DETAIL_BODY=$(echo "$PRODUCT_DETAIL_RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP 状态码: $HTTP_STATUS"
echo "响应内容: ${DETAIL_BODY:0:200}..."

if [ "$HTTP_STATUS" = "200" ]; then
    if echo "$DETAIL_BODY" | grep -q '"success":true' && \
       echo "$DETAIL_BODY" | grep -q "\"product_code\":\"${TEST_PRODUCT_CODE}\""; then
        test_result "访问产品详情页（已激活）" "PASS" "成功获取产品详情"
    else
        test_result "访问产品详情页（已激活）" "FAIL" "响应格式不正确"
    fi
elif [ "$HTTP_STATUS" = "404" ]; then
    test_result "访问产品详情页（已激活）" "FAIL" "产品未找到（404）- 可能是 is_active 设置问题"
else
    test_result "访问产品详情页（已激活）" "FAIL" "HTTP 状态码: $HTTP_STATUS"
fi

echo ""

# ============================================
# 测试 5: 检查现有产品详情页
# ============================================
echo -e "${YELLOW}测试 5: 检查现有产品详情页${NC}"
echo "-------------------------------------------"

# 先获取产品列表
PRODUCTS_RESPONSE=$(curl -s "${BASE_URL}/api/admin/products?limit=1" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

EXISTING_PRODUCT_CODE=$(echo "$PRODUCTS_RESPONSE" | grep -o '"product_code":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$EXISTING_PRODUCT_CODE" ]; then
    echo "测试现有产品: $EXISTING_PRODUCT_CODE"
    
    EXISTING_DETAIL_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
      "${BASE_URL}/api/products/${EXISTING_PRODUCT_CODE}")
    
    HTTP_STATUS=$(echo "$EXISTING_DETAIL_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        test_result "检查现有产品详情页" "PASS" "产品代码: $EXISTING_PRODUCT_CODE"
    else
        test_result "检查现有产品详情页" "FAIL" "HTTP 状态码: $HTTP_STATUS"
    fi
else
    test_result "检查现有产品详情页" "SKIP" "没有找到现有产品"
fi

echo ""

# ============================================
# 测试总结
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}测试总结${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "总测试数: ${TOTAL_TESTS}"
echo -e "${GREEN}通过: ${PASSED_TESTS}${NC}"
echo -e "${RED}失败: ${FAILED_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ 所有测试通过！修复成功！${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 ${FAILED_TESTS} 个测试失败，请检查日志${NC}"
    exit 1
fi

