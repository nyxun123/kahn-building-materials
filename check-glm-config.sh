#!/bin/bash
# 测试 Claude Code 与 zai-mcp-server 的配置

echo "当前工作目录: $(pwd)"
echo "当前环境变量设置:"
env | grep -E "(ZHIPU|ANTHROPIC|Z_AI|CLAUDE)" | sort

echo ""
echo "检查 MCP 服务器状态:"
echo "zai-mcp-server 应该被配置为可用的 MCP 服务器"

echo ""
echo "检查 .claude/settings.local.json 配置:"
if [ -f ".claude/settings.local.json" ]; then
    echo "✓ .claude/settings.local.json 存在"
    echo "包含 zai-mcp-server 权限: $(grep -c 'zai-mcp-server' .claude/settings.local.json 2>/dev/null || echo '未找到')"
else
    echo "✗ .claude/settings.local.json 不存在"
fi

echo ""
echo "检查 claude_config.json 配置:"
if [ -f "claude_config.json" ]; then
    echo "✓ claude_config.json 存在"
    echo "包含 zai-mcp-server 配置: $(grep -c 'zai-mcp-server' claude_config.json 2>/dev/null || echo '未找到')"
else
    echo "✗ claude_config.json 不存在"
fi

echo ""
echo "检查 .env 文件:"
if [ -f ".env" ]; then
    echo "✓ .env 文件存在，包含:"
    grep -E "(ZHIPU|Z_AI|ANTHROPIC)" .env
else
    echo "✗ .env 文件不存在"
fi

echo ""
echo "测试 MCP 服务器是否可以独立运行:"
npx -y @z_ai/mcp-server --help >/dev/null 2>&1 && echo "✓ @z_ai/mcp-server 可用" || echo "✗ @z_ai/mcp-server 不可用"

echo ""
echo "当前配置状态总结:"
echo "1. 确认 zai-mcp-server 在 claude_config.json 中已定义"
echo "2. 确认 .claude/settings.local.json 中启用了 zai-mcp-server 相关权限"
echo "3. 确认 .env 文件中设置了正确的 ZHIPU_API_KEY"
echo "4. 确认 PATH 中包含 Node.js/npm/npx"
echo ""
echo "Claude Code 会通过 MCP 协议调用智谱AI服务"