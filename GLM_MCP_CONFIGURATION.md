# Zhipu AI (ZAI) MCP 集成配置说明

## 配置概述

本配置将 Zhipu AI API 与 Claude Code CLI 通过 MCP (Model Context Protocol) 集成，以启用以下功能：

1. **API 功能**：利用 Zhipu AI 的 GLM 模型高级语言处理能力
2. **联网功能**：通过 MCP 协议支持实时信息查询
3. **图片理解功能**：使用 @z_ai/mcp-server 支持图像处理能力

## 配置文件

### 1. 环境变量 (.env)
- 包含 `Z_AI_API_KEY` 和 `Z_AI_MODE` 配置

### 2. Claude MCP 服务器配置 (claude_config.json)
- 添加 `zai-mcp-server` MCP 服务器配置
- 使用 `npx` 启动 `@z_ai/mcp-server` 包
- 设置正确的环境变量和启动参数

### 3. Claude 权限配置 (.claude/settings.local.json)
- 启用 `zai-mcp-server` 服务器
- 添加所需权限包括 `mcp__zai-mcp-server__listmodels`, `mcp__zai-mcp-server__chat`, `mcp__zai-mcp-server__vision`

## 设置步骤

1. **获取 API 密钥**：
   - 从智谱 AI 账户获取 API 密钥

2. **确认环境要求**：
   - 确保 Node.js >= v18.0.0 (当前版本: v22.18.0 - 符合要求)

## 使用说明

完成配置后，Claude Code CLI 将能够通过 MCP 协议使用 Zhipu AI 的能力，包括：

- 文本生成与处理
- 图像识别与分析（通过 @z_ai/mcp-server）
- 联网功能（取决于 MCP 实现）

## 故障排除

如果遇到问题：

1. 确保 API 密钥正确设置且有效
2. 检查 npx 和 Node.js 已正确安装 (Node.js >= 18.0.0)
3. 验证网络连接是否允许访问智谱 AI API
4. 查看 Claude Code CLI 日志以获取详细错误信息
5. 首次使用时，@z_ai/mcp-server 包将在运行时自动下载