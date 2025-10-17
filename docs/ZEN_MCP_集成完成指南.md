# Zen MCP Server 集成完成指南

## 🎉 集成状态：✅ 成功完成

您的 Zen MCP Server 已经成功集成到 Claude Code CLI 中！

## 📋 集成详情

- **安装方式**: NPX 包装器（官方推荐）
- **配置文件**: `~/.claude/settings.json`
- **服务器路径**: `~/.zen-mcp-server/`
- **API 配置**: Gemini API 已配置
- **最后更新**: 2025-10-16

## 🔧 可用工具

### 核心协作工具
- **`zen chat`** - 多模型对话协作
- **`zen thinkdeep`** - 深度思考分析
- **`zen planner`** - 项目规划
- **`zen consensus`** - 多模型共识决策

### 代码质量工具
- **`zen codereview`** - 专业代码审查
- **`zen precommit`** - 提交前验证
- **`zen debug`** - 系统性调试分析

### 实用工具
- **`zen apilookup`** - API文档查询
- **`zen challenge`** - 批判性思维分析
- **`zen version`** - 版本信息

### 已禁用工具（可按需启用）
- `analyze`, `refactor`, `testgen`, `secaudit`, `docgen`, `tracer`

## 💡 使用方法

### 基础用法示例

```bash
# 代码审查
"请使用 zen codereview 分析这段代码的质量"

# 深度分析
"用 zen thinkdeep 深入分析这个架构设计的优缺点"

# 项目规划
"使用 zen planner 制定我们的微服务迁移计划"

# 多模型共识
"通过 zen consensus 获取多个模型对这个技术选型的意见"
```

### 高级用法示例

```bash
# 复杂工作流
"执行 zen codereview，然后用 zen planner 制定修复计划，最后用 zen precommit 验证"

# API 查询
"用 zen apilookup 查询 React 19 的最新 API 变化"

# 批判分析
"对这个方案用 zen challenge 进行批判性分析，找出潜在风险"
```

## ⚙️ 配置选项

当前配置位于 `~/.claude/settings.json`：

```json
{
  "mcpServers": {
    "zen": {
      "command": "npx",
      "args": ["zen-mcp-server-199bio"],
      "env": {
        "GEMINI_API_KEY": "AIzaSyBeo4LFnt4LgZCwMoWtGaxiXNZL_AtY8xo",
        "DEFAULT_MODEL": "auto",
        "LOG_LEVEL": "INFO",
        "DISABLED_TOOLS": "analyze,refactor,testgen,secaudit,docgen,tracer",
        "ZEN_MCP_FORCE_ENV_OVERRIDE": "true"
      }
    }
  }
}
```

### 自定义配置

**更改默认模型**：
- `"DEFAULT_MODEL": "auto"` - 自动选择最佳模型
- `"DEFAULT_MODEL": "pro"` - Gemini Pro（深度思考）
- `"DEFAULT_MODEL": "flash"` - Gemini Flash（快速响应）

**启用更多工具**：
从 `DISABLED_TOOLS` 中移除不需要的工具名

**调整日志级别**：
- `"LOG_LEVEL": "INFO"` - 一般信息
- `"LOG_LEVEL": "DEBUG"` - 详细调试信息
- `"LOG_LEVEL": "WARNING"` - 仅警告和错误

## 🔍 故障排除

### 常见问题解决

1. **工具不可用**
   - 重启 Claude Code CLI
   - 检查配置文件语法
   - 运行测试脚本验证

2. **API 错误**
   - 验证 Gemini API 密钥有效性
   - 检查网络连接
   - 确认 API 配额未超限

3. **性能问题**
   - 考虑禁用不需要的工具
   - 调整 `DEFAULT_MODEL` 设置
   - 使用更轻量级的模型选择

### 日志查看

```bash
# 查看服务器日志
tail -f ~/.zen-mcp-server/logs/mcp_server.log

# 查看活动日志
tail -f ~/.zen-mcp-server/logs/mcp_activity.log
```

### 测试验证

```bash
# 运行集成测试
python3 /Users/nll/Documents/可以用的网站/scripts/test-zen-mcp-integration.py
```

## 📚 相关资源

- **项目主页**: `~/.zen-mcp-server/`
- **完整文档**: `~/.zen-mcp-server/README.md`
- **工具文档**: `~/.zen-mcp-server/docs/tools/`
- **GitHub 仓库**: https://github.com/BeehiveInnovations/zen-mcp-server

## 🎯 最佳实践

1. **工作流优化**: 结合多个工具构建完整的分析流程
2. **模型选择**: 根据任务复杂度选择合适的模型
3. **上下文管理**: 利用对话延续功能保持上下文一致性
4. **成本控制**: 合理使用高级模型，平衡成本和质量

---

**🚀 恭喜！您现在拥有了强大的多模型 AI 协作能力！**

开始探索 Zen MCP 的无限可能吧！