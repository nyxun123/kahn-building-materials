# MCP Browser Use 服务器设置指南

## 🎯 概述

已成功安装并配置了来自 https://github.com/Saik0s/mcp-browser-use 的 MCP 服务器。该服务器提供 AI 驱动的浏览器自动化功能，支持自然语言控制和网络研究。

## 📁 安装位置

- **配置目录**: `~/.config/mcp/mcp-browser-use/`
- **环境配置**: `~/.config/mcp/mcp-browser-use/.env`
- **研究输出**: `~/.config/mcp/mcp-browser-use/research_outputs/`

## 🔧 配置详情

### MCP 服务器配置
已添加到 `~/.config/mcp/cline_mcp_settings.json`：

```json
"github.com/Saik0s/mcp-browser-use": {
  "command": "uvx",
  "args": ["mcp-server-browser-use@latest"],
  "env": {
    "MCP_LLM_GOOGLE_API_KEY": "${input:google_api_key}",
    "MCP_LLM_PROVIDER": "google",
    "MCP_LLM_MODEL_NAME": "gemini-2.5-flash-preview-04-17",
    "MCP_BROWSER_HEADLESS": "true",
    "MCP_BROWSER_WINDOW_WIDTH": "1280",
    "MCP_BROWSER_WINDOW_HEIGHT": "720",
    "MCP_AGENT_TOOL_USE_VISION": "true",
    "MCP_RESEARCH_TOOL_SAVE_DIR": "~/.config/mcp/mcp-browser-use/research_outputs",
    "MCP_SERVER_LOGGING_LEVEL": "INFO"
  }
}
```

### 支持的 LLM 提供商

当前配置使用 **Google Gemini**：
- **模型**: `gemini-2.5-flash-preview-04-17`
- **优势**: 免费额度，支持视觉功能
- **需要**: Google AI API Key

### 备选配置

可以通过修改 `.env` 文件切换到其他提供商：

1. **OpenRouter** (支持多种免费模型)
2. **OpenAI** (GPT 系列)
3. **Anthropic** (Claude 系列)
4. **本地 Ollama**

## 🚀 可用工具

### 1. `run_browser_agent`
- **功能**: 执行自然语言浏览器自动化任务
- **参数**: `task` (字符串) - 任务描述
- **返回**: 执行结果或错误信息

### 2. `run_deep_research`
- **功能**: 执行深度网络研究并生成报告
- **参数**: 
  - `research_task` (字符串) - 研究主题
  - `max_parallel_browsers` (可选) - 最大并行浏览器数
- **返回**: Markdown 格式的研究报告

## 📋 使用步骤

### 1. 获取 API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 创建新的 API Key
3. 在启动时输入 API Key

### 2. 重启 MCP 客户端
重启您的 MCP 客户端以加载新的服务器配置。

### 3. 开始使用
- 使用 `run_browser_agent` 进行网页自动化
- 使用 `run_deep_research` 进行深度研究

## 🔒 安全注意事项

- API Key 已配置为安全输入，不会被存储在配置文件中
- 浏览器运行在 headless 模式下
- 所有日志记录设置为 INFO 级别

## 🛠️ 故障排除

### 常见问题

1. **网络连接问题**
   - 检查网络连接
   - 确认 API Key 有效

2. **浏览器启动失败**
   - 确保系统支持 headless 浏览器
   - 检查依赖项安装

3. **API 配额超限**
   - 检查 Google AI API 配额
   - 考虑切换到其他提供商

### 日志查看
检查 `MCP_SERVER_LOGGING_LEVEL` 设置，可调整为 `DEBUG` 获取更详细日志。

## 📚 更多资源

- [项目文档](https://docs.browser-use.com)
- [GitHub 仓库](https://github.com/Saik0s/mcp-browser-use)
- [MCP 协议文档](https://modelcontextprotocol.io/)

## 🎉 下一步

1. 测试基本浏览器自动化任务
2. 尝试深度研究功能
3. 根据需要调整配置
4. 集成到您的工作流程中

---

**注意**: 首次使用时，系统会提示输入 Google AI API Key。请确保您已获取有效的 API Key。
