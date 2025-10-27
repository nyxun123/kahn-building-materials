# GitHub Personal Access Token 设置指南

## 创建 GitHub Personal Access Token

1. 访问 GitHub 设置页面：https://github.com/settings/personal-access-tokens/new

2. 配置 Token 详情：
   - **Note**: 输入描述性名称，如 "MCP Server Access"
   - **Expiration**: 选择合适的过期时间
   - **Scopes**: 根据需要选择权限，推荐的最小权限集：
     - `repo` - 访问仓库
     - `read:org` - 读取组织信息（如果需要）
     - `read:user` - 读取用户信息
     - `notifications` - 访问通知（如果需要）

3. 点击 "Generate token"

4. **重要**: 立即复制并保存 token，因为离开页面后将无法再次查看

## 安全使用 Token

### 方法 1: 环境变量（推荐）
```bash
export GITHUB_PAT=your_token_here
```

### 方法 2: 创建 .env 文件
```bash
echo "GITHUB_PAT=your_token_here" > ~/.config/mcp/.env
echo ".env" >> ~/.config/mcp/.gitignore
```

### 方法 3: 使用 keychain（macOS）
```bash
security add-generic-password -a $USER -s github-mcp-token -w your_token_here
```

## 测试 MCP 服务器

设置好 token 后，可以使用以下命令测试：

```bash
# 使用环境变量
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | \
GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN \
  ghcr.io/github/github-mcp-server stdio
```

## 安全注意事项

- 永远不要将 token 提交到版本控制系统
- 定期轮换 token
- 使用最小权限原则
- 考虑使用 GitHub Apps 来替代 Personal Access Tokens（对于生产环境）
