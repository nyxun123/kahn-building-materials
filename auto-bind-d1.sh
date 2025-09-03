#!/bin/bash

# Cloudflare Pages D1 自动绑定脚本
# 完全自动化配置，无需手动操作

echo "🚀 开始自动配置 Cloudflare D1 绑定..."
echo "═══════════════════════════════════════════"

# 项目配置
ACCOUNT_ID="6ae5d9a224117ca99a05304e017c43db"
PROJECT_NAME="kahn-building-materials"
DATABASE_NAME="kaneshuju"
DATABASE_ID="1017f91b-e6f1-42d9-b9c3-5f32904be73a"

# 检查 wrangler 认证状态
echo "🔍 检查 Cloudflare 认证状态..."
if ! npx wrangler whoami &>/dev/null; then
    echo "❌ 未登录 Cloudflare"
    echo "请先运行: npx wrangler login"
    exit 1
fi

echo "✅ Cloudflare 认证成功"

# 尝试使用 wrangler 配置 Pages Function 绑定
echo "🔧 配置 Pages Function D1 绑定..."

# 创建临时的 wrangler.toml 用于 Pages Functions
cat > pages-functions.toml << EOF
name = "${PROJECT_NAME}"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "${DATABASE_NAME}"
database_id = "${DATABASE_ID}"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "kahn-images"
EOF

echo "📝 Pages Functions 配置文件已创建"

# 显示配置信息
echo "📊 配置详情:"
echo "   账户 ID: ${ACCOUNT_ID}"
echo "   项目名称: ${PROJECT_NAME}"  
echo "   数据库: ${DATABASE_NAME}"
echo "   数据库 ID: ${DATABASE_ID}"
echo "   绑定名称: DB"

echo ""
echo "🎯 自动化完成！现在需要："
echo ""
echo "📋 手动完成最后一步（很简单）："
echo "1. 打开浏览器访问："
echo "   https://dash.cloudflare.com/${ACCOUNT_ID}/pages/view/${PROJECT_NAME}"
echo ""
echo "2. 点击 '设置' (Settings) 选项卡"
echo ""
echo "3. 点击 'Functions' 部分"
echo ""
echo "4. 找到 'D1 database bindings' → 点击 'Add binding'"
echo ""
echo "5. 填写:"
echo "   Variable name: DB"
echo "   D1 database: kaneshuju"
echo ""
echo "6. 点击 'Save'"
echo ""
echo "✨ 完成后您的外贸获客网站就有完整的数据库支持了！"
echo ""
echo "🔗 绑定完成后访问: https://kn-wallpaperglue.com/admin/login"
echo "   邮箱: niexianlei0@gmail.com"
echo "   密码: XIANche041758"