#!/bin/bash
# CloudBase域名绑定脚本 - 适用于火山引擎域名

set -e

# 配置变量
DOMAIN="kn-wallpaperglue.com"
ENV_ID="cloud1-2g202f0id4414562"
CNAME_TARGET="cloud1-2g202f0id4414562-1358123634.tcloudbaseapp.com"

echo "🚀 开始配置域名: $DOMAIN"
echo "📍 环境ID: $ENV_ID"
echo "🔗 CNAME目标: $CNAME_TARGET"

# 检查依赖
echo "📋 检查依赖..."
if ! command -v tcb &> /dev/null; then
    echo "❌ 未找到tcb命令，正在安装..."
    npm install -g @cloudbase/cli
fi

# 登录腾讯云
echo "🔐 登录腾讯云..."
tcb login

# 设置环境
echo "⚙️ 设置环境..."
tcb env:use $ENV_ID

# 域名绑定
echo "🌐 配置域名绑定..."
tcb domain:add $DOMAIN --envId $ENV_ID

# 生成DNS配置
echo "📄 生成DNS配置..."
cat > dns-config.txt << EOF
火山引擎DNS配置：
==================
类型: CNAME
主机记录: @
记录值: $CNAME_TARGET
TTL: 600

可选配置：
类型: CNAME  
主机记录: www
记录值: $CNAME_TARGET
TTL: 600
EOF

echo "✅ 配置完成！"
echo "📁 DNS配置文件已生成: dns-config.txt"
echo "📝 下一步: 在火山引擎控制台添加以上DNS记录"