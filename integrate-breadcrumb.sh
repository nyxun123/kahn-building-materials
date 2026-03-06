#!/bin/bash

# 面包屑导航快速集成脚本
# 此脚本帮助在所有主要页面中添加面包屑导航组件

echo "=========================================="
echo "面包屑导航快速集成脚本"
echo "=========================================="
echo ""

PROJECT_ROOT="/Users/nll/Documents/可以用的网站"
PAGES_DIR="$PROJECT_ROOT/src/pages"

# 检查是否在正确的目录
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "❌ 项目目录不存在: $PROJECT_ROOT"
    exit 1
fi

echo "✅ 项目目录: $PROJECT_ROOT"
echo ""

# 定义需要添加面包屑的页面
declare -A PAGES=(
    ["products/index.tsx"]="产品列表页"
    ["product-detail/index.tsx"]="产品详情页"
    ["about/index.tsx"]="关于我们"
    ["contact/index.tsx"]="联系我们"
    ["oem/index.tsx"]="OEM服务"
    ["solutions/index.tsx"]="解决方案"
)

echo "📋 将在以下页面添加面包屑导航："
echo ""
for page in "${!PAGES[@]}"; do
    echo "  ✅ ${PAGES[$page]} ($page)"
done
echo ""

# 询问是否继续
read -p "是否继续？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 1
fi

echo ""
echo "🔧 开始集成..."
echo ""

# 备份函数
backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        local backup="${file}.backup.$(date +%Y%m%d%H%M%S)"
        cp "$file" "$backup"
        echo "  📦 备份: $backup"
    fi
}

# 检查是否已导入
has_import() {
    local file=$1
    grep -q "BreadcrumbNavigation" "$file" 2>/dev/null
    return $?
}

# 检查是否已使用组件
has_component() {
    local file=$1
    grep -q "<BreadcrumbNavigation" "$file" 2>/dev/null
    return $?
}

# 统计信息
SUCCESS_COUNT=0
SKIP_COUNT=0
ERROR_COUNT=0

# 处理每个页面
for page in "${!PAGES[@]}"; do
    PAGE_PATH="$PAGES_DIR/$page"

    if [ ! -f "$PAGE_PATH" ]; then
        echo "⚠️  跳过: ${PAGES[$page]} (文件不存在)"
        ((SKIP_COUNT++))
        continue
    fi

    echo "📄 处理: ${PAGES[$page]}"

    # 检查是否已经集成
    if has_component "$PAGE_PATH"; then
        echo "  ⏭️  已包含面包屑组件，跳过"
        ((SKIP_COUNT++))
        echo ""
        continue
    fi

    # 备份文件
    backup_file "$PAGE_PATH"

    # 添加导入语句（如果还没有）
    if ! has_import "$PAGE_PATH"; then
        # 查找最后一个 import 语句
        LAST_IMPORT=$(grep -n "^import" "$PAGE_PATH" | tail -1 | cut -d: -f1)

        if [ -n "$LAST_IMPORT" ]; then
            # 在最后一个 import 后添加新导入
            sed -i '' "${LAST_IMPORT}a\\
import BreadcrumbNavigation from '../../components/BreadcrumbNavigation';
" "$PAGE_PATH"
            echo "  ✅ 添加导入语句"
        else
            echo "  ❌ 无法找到 import 语句位置"
            ((ERROR_COUNT++))
            echo ""
            continue
        fi
    else
        echo "  ℹ️  导入语句已存在"
    fi

    # 查找 return 语句或 JSX 开始位置
    # 这个步骤需要更复杂的逻辑，这里提供指导
    echo "  📝 需要手动添加组件到 JSX"
    echo "     在页面顶部添加: <BreadcrumbNavigation />"

    ((SUCCESS_COUNT++))
    echo ""
done

echo "=========================================="
echo "✅ 集成完成"
echo "=========================================="
echo ""
echo "📊 统计:"
echo "  成功: $SUCCESS_COUNT"
echo "  跳过: $SKIP_COUNT"
echo "  错误: $ERROR_COUNT"
echo ""

# 提供下一步指导
echo "🎯 下一步操作:"
echo ""
echo "1. 在各页面中手动添加 <BreadcrumbNavigation /> 组件"
echo "   推荐位置: return 语句内的最外层 <div> 后"
echo ""
echo "2. 示例:"
echo '   <div className="container">'
echo '     <BreadcrumbNavigation />'
echo '     {/* 其他内容 */}'
echo '   </div>'
echo ""
echo "3. 添加多语言翻译 (如果需要)"
echo "   编辑 src/locales/zh.json 和 en.json"
echo ""
echo "4. 本地测试:"
echo "   pnpm dev"
echo ""
echo "5. 查看示例文件:"
echo "   cat src/components/BreadcrumbExample.tsx"
echo ""

# 创建集成检查清单
cat > "$PROJECT_ROOT/breadcrumb-integration-checklist.md" << 'EOF'
# 面包屑导航集成检查清单

## 📋 需要集成的页面

- [ ] src/pages/products/index.tsx
  - 在产品列表顶部添加 <BreadcrumbNavigation />

- [ ] src/pages/product-detail/index.tsx
  - 在产品详情顶部添加 <BreadcrumbNavigation />

- [ ] src/pages/about/index.tsx
  - 在关于我们页面顶部添加 <BreadcrumbNavigation />

- [ ] src/pages/contact/index.tsx
  - 在联系我们页面顶部添加 <BreadcrumbNavigation />

- [ ] src/pages/oem/index.tsx
  - 在 OEM 服务页面顶部添加 <BreadcrumbNavigation />

- [ ] src/pages/solutions/index.tsx
  - 在解决方案页面顶部添加 <BreadcrumbNavigation />

## 🌍 多语言翻译

### 中文 (zh.json)
```json
{
  "breadcrumbs": {
    "home": "首页",
    "products": "产品中心",
    "productDetail": "产品详情",
    "applications": "应用领域",
    "about": "关于我们",
    "contact": "联系我们",
    "oem": "OEM服务",
    "solutions": "解决方案",
    "blog": "博客"
  }
}
```

### 英语 (en.json)
```json
{
  "breadcrumbs": {
    "home": "Home",
    "products": "Products",
    "productDetail": "Product Detail",
    "applications": "Applications",
    "about": "About Us",
    "contact": "Contact Us",
    "oem": "OEM Service",
    "solutions": "Solutions",
    "blog": "Blog"
  }
}
```

## ✅ 测试清单

- [ ] 启动开发服务器 (pnpm dev)
- [ ] 访问各个页面，检查面包屑显示
- [ ] 测试多语言切换
- [ ] 测试移动端响应式
- [ ] 验证 Schema.org 结构化数据
- [ ] 使用 Google Rich Results Test 测试

## 🚀 部署清单

- [ ] 本地测试完成
- [ ] 代码审查完成
- [ ] 构建测试通过 (pnpm build)
- [ ] 部署到生产环境
- [ ] 验证面包屑显示正常
- [ ] 提交 Sitemap 更新

## 📊 预期效果

- ✅ 改善用户体验
- ✅ 提升导航 SEO
- ✅ 获得 Rich Snippets 展示
- ✅ 降低跳出率
EOF

echo "✅ 检查清单已创建: breadcrumb-integration-checklist.md"
echo ""
echo "🎉 集成脚本执行完成！"
echo ""
echo "💡 提示: 查看 BreadcrumbExample.tsx 获取更多使用示例"
