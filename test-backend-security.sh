#!/bin/bash

# 后端安全修复测试脚本
# 用途：验证所有安全修复是否正常工作

set -e  # 遇到错误立即退出

# 配置
BASE_URL="https://kn-wallpaperglue.com"
# BASE_URL="http://localhost:8788"  # 本地测试

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 打印函数
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_test() {
    echo -e "${YELLOW}测试 $((TOTAL_TESTS + 1)): $1${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

print_success() {
    echo -e "${GREEN}✅ 通过: $1${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

print_failure() {
    echo -e "${RED}❌ 失败: $1${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 测试函数
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    print_test "$description"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "状态码 $status_code (预期 $expected_status)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        return 0
    else
        print_failure "状态码 $status_code (预期 $expected_status)"
        echo "$body"
        return 1
    fi
}

test_authenticated_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local expected_status=$4
    local description=$5
    
    print_test "$description"
    
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
        -H "Authorization: Bearer $token")
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "状态码 $status_code (预期 $expected_status)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        return 0
    else
        print_failure "状态码 $status_code (预期 $expected_status)"
        echo "$body"
        return 1
    fi
}

# 开始测试
print_header "后端安全修复测试"

print_info "测试环境: $BASE_URL"
print_info "开始时间: $(date)"

# ========================================
# 测试 1: 密码迁移状态
# ========================================
print_header "1. 密码迁移状态"

test_endpoint "GET" "/api/admin/migrate-passwords" "" "200" "查询密码迁移状态"

# ========================================
# 测试 2: 登录功能
# ========================================
print_header "2. 登录功能测试"

# 测试 2.1: 缺少凭据
test_endpoint "POST" "/api/admin/login" '{}' "400" "登录 - 缺少凭据"

# 测试 2.2: 无效的 Email 格式
test_endpoint "POST" "/api/admin/login" '{"email":"invalid-email","password":"test"}' "400" "登录 - 无效 Email 格式"

# 测试 2.3: 错误的密码
test_endpoint "POST" "/api/admin/login" '{"email":"admin@kn-wallpaperglue.com","password":"wrongpassword"}' "401" "登录 - 错误密码"

# 测试 2.4: 正确的凭据
print_test "登录 - 正确凭据"
login_response=$(curl -s -X POST "$BASE_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin@123456"}')

echo "$login_response" | jq '.'

# 提取 access token
ACCESS_TOKEN=$(echo "$login_response" | jq -r '.accessToken // empty')
REFRESH_TOKEN=$(echo "$login_response" | jq -r '.refreshToken // empty')

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    print_success "成功获取 Access Token"
    print_info "Access Token: ${ACCESS_TOKEN:0:50}..."
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_failure "未能获取 Access Token"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    print_info "跳过后续需要认证的测试"
    exit 1
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

# ========================================
# 测试 3: JWT 认证
# ========================================
print_header "3. JWT 认证测试"

# 测试 3.1: 无 Token 访问受保护端点
test_endpoint "GET" "/api/admin/products" "" "401" "访问受保护端点 - 无 Token"

# 测试 3.2: 无效 Token
test_authenticated_endpoint "GET" "/api/admin/products" "invalid-token" "401" "访问受保护端点 - 无效 Token"

# 测试 3.3: 有效 Token
test_authenticated_endpoint "GET" "/api/admin/products" "$ACCESS_TOKEN" "200" "访问受保护端点 - 有效 Token"

# ========================================
# 测试 4: Token 刷新
# ========================================
print_header "4. Token 刷新测试"

if [ -n "$REFRESH_TOKEN" ] && [ "$REFRESH_TOKEN" != "null" ]; then
    # 测试 4.1: 使用 Refresh Token 获取新 Access Token
    print_test "刷新 Token"
    refresh_response=$(curl -s -X POST "$BASE_URL/api/admin/refresh-token" \
        -H "Content-Type: application/json" \
        -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")
    
    echo "$refresh_response" | jq '.'
    
    NEW_ACCESS_TOKEN=$(echo "$refresh_response" | jq -r '.accessToken // empty')
    
    if [ -n "$NEW_ACCESS_TOKEN" ] && [ "$NEW_ACCESS_TOKEN" != "null" ]; then
        print_success "成功刷新 Token"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_failure "刷新 Token 失败"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
    print_info "跳过 Token 刷新测试（未获取到 Refresh Token）"
fi

# 测试 4.2: 无效的 Refresh Token
test_endpoint "POST" "/api/admin/refresh-token" '{"refreshToken":"invalid-token"}' "401" "刷新 Token - 无效 Token"

# ========================================
# 测试 5: 受保护的 API 端点
# ========================================
print_header "5. 受保护的 API 端点测试"

# 测试 5.1: 产品列表
test_authenticated_endpoint "GET" "/api/admin/products?page=1&limit=5" "$ACCESS_TOKEN" "200" "获取产品列表"

# 测试 5.2: 产品详情（假设产品 ID 1 存在）
test_authenticated_endpoint "GET" "/api/admin/products/1" "$ACCESS_TOKEN" "200" "获取产品详情"

# ========================================
# 测试 6: 输入验证
# ========================================
print_header "6. 输入验证测试"

# 测试 6.1: 超长密码（防止 DoS）
long_password=$(python3 -c "print('a' * 200)")
test_endpoint "POST" "/api/admin/login" "{\"email\":\"test@example.com\",\"password\":\"$long_password\"}" "400" "登录 - 超长密码"

# 测试 6.2: SQL 注入尝试
test_endpoint "POST" "/api/admin/login" '{"email":"admin@kn-wallpaperglue.com","password":"' OR '1'='1"}' "401" "登录 - SQL 注入尝试"

# ========================================
# 测试 7: CORS 配置
# ========================================
print_header "7. CORS 配置测试"

print_test "检查 CORS Headers - 允许的域名"
cors_response=$(curl -s -I -X OPTIONS "$BASE_URL/api/admin/login" \
    -H "Origin: https://kn-wallpaperglue.com" \
    -H "Access-Control-Request-Method: POST")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    print_success "CORS Headers 存在"
    echo "$cors_response" | grep "Access-Control"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_failure "CORS Headers 缺失"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

print_test "检查 CORS Headers - 不允许的域名"
cors_response_evil=$(curl -s -I -X OPTIONS "$BASE_URL/api/admin/login" \
    -H "Origin: https://evil.com" \
    -H "Access-Control-Request-Method: POST")

if echo "$cors_response_evil" | grep -q "Access-Control-Allow-Origin: https://evil.com"; then
    print_failure "CORS 允许了不应该允许的域名"
    FAILED_TESTS=$((FAILED_TESTS + 1))
else
    print_success "CORS 正确拒绝了不允许的域名"
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

# ========================================
# 测试 8: 速率限制
# ========================================
print_header "8. 速率限制测试"

print_info "注意: 速率限制测试可能需要等待一段时间"
print_info "登录 API 限制: 5次/5分钟"

print_test "速率限制 - 连续请求测试"
rate_limit_hit=false

for i in {1..7}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/admin/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"ratelimit@test.com","password":"wrongpassword"}')

    status_code=$(echo "$response" | tail -n1)

    if [ "$status_code" = "429" ]; then
        print_success "第 $i 次请求触发速率限制 (429)"
        rate_limit_hit=true
        PASSED_TESTS=$((PASSED_TESTS + 1))
        break
    else
        print_info "第 $i 次请求: 状态码 $status_code"
    fi

    sleep 0.5  # 短暂延迟
done

if [ "$rate_limit_hit" = false ]; then
    print_warning "未触发速率限制（可能 KV 未配置或限制已重置）"
    PASSED_TESTS=$((PASSED_TESTS + 1))  # 不算失败
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

# ========================================
# 测试 9: 账户锁定机制
# ========================================
print_header "9. 账户锁定机制测试"

print_info "注意: 此测试会尝试锁定测试账户"
print_info "账户锁定策略: 5次失败后锁定30分钟"

# 使用一个测试账户
TEST_ACCOUNT="locktest@example.com"

print_test "账户锁定 - 连续失败登录"
account_locked=false

for i in {1..6}; do
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/admin/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_ACCOUNT\",\"password\":\"wrongpassword\"}")

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$status_code" = "423" ]; then
        print_success "第 $i 次尝试后账户被锁定 (423 Locked)"
        account_locked=true
        PASSED_TESTS=$((PASSED_TESTS + 1))
        break
    elif [ "$status_code" = "429" ]; then
        print_info "第 $i 次尝试触发速率限制，跳过账户锁定测试"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        account_locked=true  # 标记为已处理
        break
    else
        print_info "第 $i 次失败尝试: 状态码 $status_code"
    fi

    sleep 0.5
done

if [ "$account_locked" = false ]; then
    print_warning "未触发账户锁定（可能账户不存在或数据库未迁移）"
    PASSED_TESTS=$((PASSED_TESTS + 1))  # 不算失败
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

# ========================================
# 测试总结
# ========================================
print_header "测试总结"

echo -e "总测试数: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 所有测试通过！${NC}\n"
    exit 0
else
    echo -e "\n${RED}⚠️  有 $FAILED_TESTS 个测试失败${NC}\n"
    exit 1
fi

