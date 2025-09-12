#!/bin/bash
# Cloudflare Pages部署脚本 - 适用于kn-wallpaperglue.com域名

set -e

echo "🚀 开始Cloudflare Pages部署..."

# 检查当前目录
echo "📍 当前目录: $(pwd)"

# 检查依赖 - 使用npx避免权限问题
echo "📋 检查依赖..."
if ! command -v npx &> /dev/null; then
    echo "❌ 未找到npx命令"
    exit 1
fi

# 检查Cloudflare认证
if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
    echo "🔐 请设置Cloudflare API Token:"
    echo "   export CLOUDFLARE_API_TOKEN=your_token_here"
    echo "   获取token: https://dash.cloudflare.com/profile/api-tokens"
    echo ""
    echo "💡 或者使用交互式登录:"
    echo "   npx wrangler login"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 验证构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist目录不存在"
    exit 1
fi

echo "✅ 构建成功，准备部署..."

# 部署到Cloudflare Pages
echo "🌐 部署到Cloudflare Pages..."
echo "使用npx wrangler避免权限问题..."
npx wrangler pages deploy dist --project-name="kahn-building-materials" --branch="main"

echo "✅ Cloudflare Pages部署完成！"
echo "🔗 访问地址将显示在上面的输出中"

echo "📋 下一步: 绑定自定义域名"
echo "   1. 登录 https://dash.cloudflare.com"
echo "   2. 选择您的Pages项目"
echo "   3. 添加自定义域名: kn-wallpaperglue.com"