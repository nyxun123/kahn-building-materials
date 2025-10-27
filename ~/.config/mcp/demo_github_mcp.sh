#!/bin/bash

# GitHub MCP Server 演示脚本
# 使用方法: ./demo_github_mcp.sh YOUR_GITHUB_TOKEN

if [ $# -eq 0 ]; then
    echo "使用方法: $0 YOUR_GITHUB_TOKEN"
    echo "或者设置环境变量: export GITHUB_PAT=your_token_here && $0"
    exit 1
fi

GITHUB_TOKEN=$1

echo "=== GitHub MCP Server 演示 ==="
echo "使用提供的 GitHub Token 测试 MCP 服务器功能..."
echo

# 测试 1: 获取工具列表
echo "1. 获取可用工具列表..."
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | \
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_TOKEN" \
ghcr.io/github/github-mcp-server stdio | head -20

echo
echo "---"

# 测试 2: 获取用户信息（使用 get_me 工具）
echo "2. 获取当前用户信息..."
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_me", "arguments": {}}}' | \
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_TOKEN" \
ghcr.io/github/github-mcp-server stdio

echo
echo "---"

# 测试 3: 搜索仓库（使用 search_repositories 工具）
echo "3. 搜索包含 'wallpaper' 的公开仓库..."
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "search_repositories", "arguments": {"query": "wallpaper language:javascript stars:>10", "perPage": 5}}}' | \
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_TOKEN" \
ghcr.io/github/github-mcp-server stdio

echo
echo "---"

# 测试 4: 获取资源列表
echo "4. 获取可用的 MCP 资源..."
echo '{"jsonrpc": "2.0", "id": 4, "method": "resources/list", "params": {}}' | \
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_TOKEN" \
ghcr.io/github/github-mcp-server stdio

echo
echo "=== 演示完成 ==="
echo "GitHub MCP 服务器已成功配置并可以使用！"
