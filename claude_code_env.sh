#!/bin/bash

# Claude Code - GLM 模型配置脚本
# 用于设置 Claude Code CLI 连接到 Zhipu AI API

# 检查是否在项目目录中
if [ -f ".env" ]; then
    # 加载项目环境变量
    export $(grep -v '^#' .env | xargs)
fi

# 设置 Anthropic 兼容的 API 配置
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
export ANTHROPIC_API_KEY="$ZHIPU_API_KEY"

# 设置 Claude Code 使用的模型
export CLAUDE_MODEL="glm-4"

echo "✅ Claude Code 环境变量已设置（GLM-4.6）："
echo "   Anthropic Base URL: $ANTHROPIC_BASE_URL"
echo "   使用 AUTH_TOKEN: ${ZHIPU_API_KEY:0:8}..."
echo "   默认模型: $CLAUDE_MODEL"
echo "   小模型: glm-4.5-air"
echo ""
echo "🚀 现在您可以运行: claude"

# 执行原始的 claude 命令，传递所有参数
exec /Users/nll/.npm-global/bin/claude "$@"