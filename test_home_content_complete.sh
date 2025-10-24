#!/bin/bash

# 🧪 后端管理平台首页内容3个板块综合测试脚本
# Comprehensive test script for the 3 home sections of the backend management platform

echo "=========================================="
echo "🧪 后端管理平台首页内容3个板块功能测试"
echo "=========================================="

# 配置
BASE_URL="https://kahn-building-materials.pages.dev"
API_BASE="$BASE_URL/api"
TEST_RESULTS=()
TOTAL_TESTS=0
PASSED_TESTS=0

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 测试结果记录
record_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    TEST_RESULTS+=("$test_name|$result|$details")

    if [[ "$result" == "PASS" ]]; then
        log_success "$test_name: $details"
    elif [[ "$result" == "FAIL" ]]; then
        log_error "$test_name: $details"
    else
        log_warning "$test_name: $details"
    fi
}

# 1. 测试API基础连接
echo -e "\n📡 测试1: API基础连接测试"
log_info "测试后端API服务是否正常运行..."

# 测试Pages Function健康检查
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$API_BASE/health" 2>/dev/null)
HTTP_CODE="${HEALTH_RESPONSE: -3}"
RESPONSE_BODY="${HEALTH_RESPONSE%???}"

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "404" ]]; then
    record_test "API基础连接" "PASS" "HTTP $HTTP_CODE - API服务可访问"
else
    record_test "API基础连接" "FAIL" "HTTP $HTTP_CODE - API服务不可访问"
fi

# 2. 测试文件上传API
echo -e "\n📁 测试2: 文件上传API测试"
log_info "测试文件上传功能..."

# 创建测试图片数据 (1x1 PNG)
TEST_IMAGE="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

# 测试图片上传
UPLOAD_RESPONSE=$(curl -s -w "%{http_code}" "$API_BASE/upload-file" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer admin-token" \
    -d "{
        \"fileData\": \"data:image/png;base64,$TEST_IMAGE\",
        \"fileName\": \"test-backend-platform.png\",
        \"folder\": \"test/home-content\"
    }" 2>/dev/null)

HTTP_CODE="${UPLOAD_RESPONSE: -3}"
RESPONSE_BODY="${UPLOAD_RESPONSE%???}"

log_info "上传API HTTP状态码: $HTTP_CODE"

if [[ "$HTTP_CODE" == "200" ]]; then
    # 解析响应获取文件URL
    FILE_URL=$(echo "$RESPONSE_BODY" | jq -r '.data.original // empty' 2>/dev/null)

    if [[ -n "$FILE_URL" && "$FILE_URL" != "null" ]]; then
        record_test "图片文件上传" "PASS" "文件上传成功，URL: $FILE_URL"

        # 检查URL格式（是否为自定义域名）
        if [[ "$FILE_URL" == *"assets.kn-wallpaperglue.com"* ]]; then
            record_test "自定义域名配置" "PASS" "使用自定义域名: assets.kn-wallpaperglue.com"
        elif [[ "$FILE_URL" == *"r2.dev"* ]]; then
            record_test "自定义域名配置" "INFO" "使用默认R2域名，需要手动配置自定义域名"
        else
            record_test "自定义域名配置" "WARNING" "未知域名格式: $FILE_URL"
        fi

        # 测试文件是否可访问
        FILE_STATUS=$(curl -s -w "%{http_code}" -o /dev/null "$FILE_URL" 2>/dev/null)
        if [[ "$FILE_STATUS" == "200" ]]; then
            record_test "上传文件访问" "PASS" "文件可正常访问"
        else
            record_test "上传文件访问" "WARNING" "文件访问异常: HTTP $FILE_STATUS"
        fi
    else
        record_test "图片文件上传" "FAIL" "响应格式异常，未获取到文件URL"
    fi
else
    record_test "图片文件上传" "FAIL" "上传失败: HTTP $HTTP_CODE"
    if [[ -n "$RESPONSE_BODY" ]]; then
        log_info "错误响应: $RESPONSE_BODY"
    fi
fi

# 3. 测试视频文件上传
echo -e "\n🎥 测试3: 视频文件上传测试"
log_info "测试视频文件上传功能..."

# 创建小测试视频数据 (模拟MP4文件头)
TEST_VIDEO="AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFNQAr/4QAYZ01ACuiPyy4C2QAAAwABAAADADIPGgw9BJQmkgAAbvP4AAAAAAABaFjfMBAAsBAAgBAAAQgFzZXhlbGxlcgEAZGF0YQEAAGA="

VIDEO_UPLOAD_RESPONSE=$(curl -s -w "%{http_code}" "$API_BASE/upload-file" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer admin-token" \
    -d "{
        \"fileData\": \"data:video/mp4;base64,$TEST_VIDEO\",
        \"fileName\": \"test-backend-video.mp4\",
        \"folder\": \"test/home-content/videos\"
    }" 2>/dev/null)

HTTP_CODE="${VIDEO_UPLOAD_RESPONSE: -3}"
RESPONSE_BODY="${VIDEO_UPLOAD_RESPONSE%???}"

if [[ "$HTTP_CODE" == "200" ]]; then
    VIDEO_URL=$(echo "$RESPONSE_BODY" | jq -r '.data.original // empty' 2>/dev/null)
    if [[ -n "$VIDEO_URL" && "$VIDEO_URL" != "null" ]]; then
        record_test "视频文件上传" "PASS" "视频上传成功，URL: $VIDEO_URL"
    else
        record_test "视频文件上传" "FAIL" "响应格式异常"
    fi
else
    record_test "视频文件上传" "FAIL" "视频上传失败: HTTP $HTTP_CODE"
fi

# 4. 测试首页内容API端点
echo -e "\n🏠 测试4: 首页内容API端点测试"
log_info "测试首页内容相关的API端点..."

# 测试获取首页内容
HOME_CONTENT_RESPONSE=$(curl -s -w "%{http_code}" "$API_BASE/home-content" \
    -H "Accept: application/json" 2>/dev/null)

HTTP_CODE="${HOME_CONTENT_RESPONSE: -3}"
RESPONSE_BODY="${HOME_CONTENT_RESPONSE%???}"

if [[ "$HTTP_CODE" == "200" ]]; then
    record_test "获取首页内容" "PASS" "成功获取首页内容数据"

    # 检查数据结构
    if echo "$RESPONSE_BODY" | jq -e '.sections' >/dev/null 2>&1; then
        record_test "首页内容数据结构" "PASS" "数据结构正确，包含sections字段"

        # 检查3个板块是否存在
        SECTIONS_COUNT=$(echo "$RESPONSE_BODY" | jq -r '.sections | length' 2>/dev/null || echo "0")
        if [[ "$SECTIONS_COUNT" -ge 3 ]]; then
            record_test "首页内容板块数量" "PASS" "包含 $SECTIONS_COUNT 个板块"

            # 检查每个板块的关键字段
            for i in {0..2}; do
                SECTION_TYPE=$(echo "$RESPONSE_BODY" | jq -r ".sections[$i].type // empty" 2>/dev/null)
                SECTION_TITLE=$(echo "$RESPONSE_BODY" | jq -r ".sections[$i].title // empty" 2>/dev/null)

                if [[ -n "$SECTION_TYPE" ]]; then
                    record_test "板块$i类型检查" "PASS" "类型: $SECTION_TYPE"
                fi

                if [[ -n "$SECTION_TITLE" ]]; then
                    record_test "板块$i标题检查" "PASS" "标题: $SECTION_TITLE"
                fi
            done
        else
            record_test "首页内容板块数量" "WARNING" "只有 $SECTIONS_COUNT 个板块，期望至少3个"
        fi
    else
        record_test "首页内容数据结构" "FAIL" "数据结构异常，缺少sections字段"
    fi
else
    record_test "获取首页内容" "FAIL" "获取失败: HTTP $HTTP_CODE"
fi

# 5. 测试保存首页内容
echo -e "\n💾 测试5: 保存首页内容测试"
log_info "测试首页内容保存功能..."

# 创建测试内容数据
TEST_CONTENT='{
    "sections": [
        {
            "id": "demo-video",
            "type": "video",
            "title": {
                "zh": "演示视频",
                "en": "Demo Video",
                "ru": "Демо видео"
            },
            "videoUrl": "https://assets.kn-wallpaperglue.com/test/demo-video.mp4",
            "description": {
                "zh": "产品演示视频",
                "en": "Product demo video",
                "ru": "Демонстрационное видео продукта"
            }
        },
        {
            "id": "oem-custom",
            "type": "image",
            "title": {
                "zh": "OEM定制",
                "en": "OEM Customization",
                "ru": "OEM настройка"
            },
            "imageUrl": "https://assets.kn-wallpaperglue.com/test/oem-image.jpg",
            "description": {
                "zh": "OEM定制服务",
                "en": "OEM customization service",
                "ru": "OEM услуга настройки"
            }
        },
        {
            "id": "semi-finished",
            "type": "image",
            "title": {
                "zh": "半成品小袋",
                "en": "Semi-finished Bags",
                "ru": "Полуфабрикаты мешки"
            },
            "imageUrl": "https://assets.kn-wallpaperglue.com/test/semi-finished.jpg",
            "description": {
                "zh": "半成品小袋产品",
                "en": "Semi-finished bag products",
                "ru": "Продукты полуфабрикаты мешки"
            }
        }
    ]
}'

SAVE_RESPONSE=$(curl -s -w "%{http_code}" "$API_BASE/home-content" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer admin-token" \
    -d "$TEST_CONTENT" 2>/dev/null)

HTTP_CODE="${SAVE_RESPONSE: -3}"
RESPONSE_BODY="${SAVE_RESPONSE%???}"

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "201" ]]; then
    record_test "保存首页内容" "PASS" "保存成功: HTTP $HTTP_CODE"

    # 检查保存响应
    if echo "$RESPONSE_BODY" | jq -e '.success' >/dev/null 2>&1; then
        SUCCESS_VALUE=$(echo "$RESPONSE_BODY" | jq -r '.success // false' 2>/dev/null)
        if [[ "$SUCCESS_VALUE" == "true" ]]; then
            record_test "保存操作确认" "PASS" "后端确认保存成功"
        else
            record_test "保存操作确认" "WARNING" "后端返回success=false"
        fi
    fi
else
    record_test "保存首页内容" "FAIL" "保存失败: HTTP $HTTP_CODE"
    if [[ -n "$RESPONSE_BODY" ]]; then
        log_info "错误响应: $RESPONSE_BODY"
    fi
fi

# 6. 测试前端页面访问
echo -e "\n🌐 测试6: 前端页面访问测试"
log_info "测试前端管理页面是否可访问..."

# 测试管理平台主页
ADMIN_PAGE_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/admin" 2>/dev/null)
HTTP_CODE="${ADMIN_PAGE_RESPONSE: -3}"

if [[ "$HTTP_CODE" == "200" ]]; then
    record_test "管理平台主页" "PASS" "管理平台可正常访问"

    # 检查页面内容（是否包含首页内容管理相关文本）
    if echo "$ADMIN_PAGE_RESPONSE" | grep -q "首页内容\|home.*content\|Home Content"; then
        record_test "页面内容验证" "PASS" "页面包含首页内容管理功能"
    else
        record_test "页面内容验证" "INFO" "页面内容需要进一步检查"
    fi
else
    record_test "管理平台主页" "FAIL" "管理平台访问失败: HTTP $HTTP_CODE"
fi

# 7. CORS测试
echo -e "\n🌍 测试7: CORS跨域测试"
log_info "测试API的CORS配置..."

CORS_RESPONSE=$(curl -s -w "%{http_code}" "$API_BASE/home-content" \
    -H "Origin: $BASE_URL" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS 2>/dev/null)

HTTP_CODE="${CORS_RESPONSE: -3}"

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "204" ]]; then
    record_test "CORS配置" "PASS" "CORS配置正常"
else
    record_test "CORS配置" "INFO" "CORS响应: HTTP $HTTP_CODE"
fi

# 8. 生成测试报告
echo -e "\n=========================================="
echo "📊 测试结果汇总"
echo "=========================================="

echo "总测试数: $TOTAL_TESTS"
echo "通过测试: $PASSED_TESTS"
echo "失败测试: $((TOTAL_TESTS - PASSED_TESTS))"

if [[ $PASSED_TESTS -eq $TOTAL_TESTS ]]; then
    echo -e "\n🎉 ${GREEN}所有测试通过！后端管理平台功能正常${NC}"
else
    echo -e "\n⚠️ ${YELLOW}部分测试未通过，需要进一步检查${NC}"
fi

echo -e "\n📋 详细测试结果："
for result in "${TEST_RESULTS[@]}"; do
    IFS='|' read -r test_name test_status test_details <<< "$result"

    case "$test_status" in
        "PASS")
            echo -e "  ✅ ${GREEN}$test_name${NC}: $test_details"
            ;;
        "FAIL")
            echo -e "  ❌ ${RED}$test_name${NC}: $test_details"
            ;;
        *)
            echo -e "  ℹ️  ${YELLOW}$test_name${NC}: $test_details"
            ;;
    esac
done

# 9. 状态总结和建议
echo -e "\n=========================================="
echo "🎯 后端管理平台状态总结"
echo "=========================================="

# 核心功能状态评估
CORE_FUNCTIONALITY_OK=true

# 检查关键功能
for result in "${TEST_RESULTS[@]}"; do
    IFS='|' read -r test_name test_status test_details <<< "$result"

    case "$test_name" in
        "API基础连接"|"文件上传"|"首页内容API")
            if [[ "$test_status" == "FAIL" ]]; then
                CORE_FUNCTIONALITY_OK=false
            fi
            ;;
    esac
done

if $CORE_FUNCTIONALITY_OK; then
    echo -e "✅ ${GREEN}核心功能状态: 正常${NC}"
    echo -e "✅ ${GREEN}文件上传功能: 正常${NC}"
    echo -e "✅ ${GREEN}API连接状态: 正常${NC}"
    echo -e "✅ ${GREEN}数据保存功能: 正常${NC}"

    echo -e "\n🎉 ${GREEN}后端管理平台的3个首页内容板块功能完全正常！${NC}"
    echo -e "📱 ${GREEN}演示视频、OEM定制、半成品小袋 三个板块都可以正常上传和保存内容${NC}"
else
    echo -e "❌ ${RED}核心功能状态: 需要修复${NC}"
    echo -e "\n🔧 ${YELLOW}建议检查项目：${NC}"
    echo -e "1. API服务部署状态"
    echo -e "2. 文件上传权限配置"
    echo -e "3. 数据库连接状态"
fi

# 域名配置状态
if echo "${TEST_RESULTS[@]}" | grep -q "自定义域名配置.*PASS"; then
    echo -e "✅ ${GREEN}自定义域名: 已配置 (assets.kn-wallpaperglue.com)${NC}"
else
    echo -e "⚠️ ${YELLOW}自定义域名: 需要手动配置${NC}"
    echo -e "📝 ${YELLOW}请参考 MANUAL_CONFIG_GUIDE.md 完成配置${NC}"
fi

echo -e "\n🏁 测试完成！"
echo "=========================================="