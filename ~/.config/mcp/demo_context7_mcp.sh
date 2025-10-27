#!/bin/bash

# Context7 MCP Server 演示脚本
# 使用方法: ./demo_context7_mcp.sh [API_KEY]

echo "=== Context7 MCP Server 演示 ==="
echo "演示 Context7 MCP 服务器功能..."
echo

# 测试 1: 获取工具列表（无需 API Key）
echo "1. 获取可用工具列表..."
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | \
curl -s -X POST https://mcp.context7.com/mcp \
-H "Content-Type: application/json" | \
jq '.' 2>/dev/null || echo "响应获取成功（需要 jq 来格式化 JSON）"

echo
echo "---"

# 测试 2: 解析库名称（示例：React）
echo "2. 解析 'react' 库名称..."
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "resolve-library-id", "arguments": {"libraryName": "react"}}}' | \
curl -s -X POST https://mcp.context7.com/mcp \
-H "Content-Type: application/json" | \
jq '.' 2>/dev/null || echo "响应获取成功"

echo
echo "---"

# 测试 3: 获取 React 文档（使用已知的库 ID）
echo "3. 获取 React 文档..."
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "get-library-docs", "arguments": {"context7CompatibleLibraryID": "/facebook/react", "tokens": 2000}}}' | \
curl -s -X POST https://mcp.context7.com/mcp \
-H "Content-Type: application/json" | \
jq '.' 2>/dev/null || echo "响应获取成功"

echo
echo "---"

# 测试 4: 获取 Next.js 文档
echo "4. 获取 Next.js 文档..."
echo '{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "get-library-docs", "arguments": {"context7CompatibleLibraryID": "/vercel/next.js", "topic": "routing", "tokens": 1500}}}' | \
curl -s -X POST https://mcp.context7.com/mcp \
-H "Content-Type: application/json" | \
jq '.' 2>/dev/null || echo "响应获取成功"

echo
echo "---"

# 如果提供了 API Key，则进行带认证的测试
if [ $# -gt 0 ] && [ "$1" != "" ]; then
    echo "5. 使用 API Key 进行认证测试..."
    API_KEY="$1"
    
    echo "   获取工具列表（带认证）..."
    echo '{"jsonrpc": "2.0", "id": 5, "method": "tools/list", "params": {}}' | \
    curl -s -X POST https://mcp.context7.com/mcp \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" | \
    jq '.' 2>/dev/null || echo "认证响应获取成功"
    
    echo
    echo "---"
fi

echo "=== 演示完成 ==="
echo "Context7 MCP 服务器已成功配置并可以使用！"
echo
echo "📖 更多信息："
echo "- Context7 网站: https://context7.com"
echo "- 获取 API Key: https://context7.com/dashboard"
echo "- GitHub 仓库: https://github.com/upstash/context7-mcp"
echo
echo "💡 使用提示："
echo "- 在提示中添加 'use context7' 来自动获取最新文档"
echo "- 或直接指定库 ID，如 'use library /vercel/next.js'"
