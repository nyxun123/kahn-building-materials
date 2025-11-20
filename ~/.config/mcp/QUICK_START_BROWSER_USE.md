# MCP Browser Use 快速开始指南

## 🚀 立即开始使用

### 第一步：获取 Google AI API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 使用 Google 账号登录
3. 点击 "Create API Key"
4. 复制生成的 API Key

### 第二步：重启 MCP 客户端
重启你的 MCP 客户端，系统会提示输入 API Key。

### 第三步：开始使用

## 💡 实用示例

### 🌐 网页自动化示例

#### 1. 搜索功能
```text
打开百度搜索"墙纸胶产品"，获取前5个结果的标题和链接
```

#### 2. 数据提取
```text
访问淘宝网站，搜索墙纸胶，提取商品名称、价格和销量信息
```

#### 3. 表单填写
```text
打开某个网站的联系我们页面，填写联系表单
```

### 🔬 深度研究示例

#### 1. 行业分析
```text
研究墙纸胶行业的市场规模、主要厂商和发展趋势
```

#### 2. 竞品分析
```text
分析主要墙纸胶品牌的产品特点、价格策略和市场定位
```

#### 3. 技术调研
```text
调研墙纸胶的最新技术发展、环保标准和施工工艺
```

## 🛠️ 高级用法

### 视觉任务
```text
截图当前页面并识别其中的文字内容
```

### 多步骤任务
```text
1. 打开建材商城网站
2. 搜索墙纸胶产品
3. 筛选价格在100-500元的产品
4. 提取产品信息并整理成表格
```

### 数据验证
```text
验证我们公司网站在搜索引擎中的排名情况
```

## ⚙️ 配置优化

### 调整浏览器窗口大小
在配置文件中修改：
```json
"MCP_BROWSER_WINDOW_WIDTH": "1920",
"MCP_BROWSER_WINDOW_HEIGHT": "1080"
```

### 启用详细日志
```json
"MCP_SERVER_LOGGING_LEVEL": "DEBUG"
```

### 调整并行浏览器数量
```json
"MCP_RESEARCH_TOOL_MAX_BROWSERS": "3"
```

## 📝 输出位置

### 研究报告保存路径
```
~/.config/mcp/mcp-browser-use/research_outputs/
```

### 日志文件
检查 MCP 客户端日志获取详细执行信息。

## 🔧 故障排除

### 常见问题

**Q: 提示 API Key 无效**
A: 检查 API Key 是否正确，确保在 Google AI Studio 中生成的是 Gemini API Key

**Q: 浏览器启动失败**
A: 确保 Playwright 浏览器已正确安装，运行 `playwright install`

**Q: 网络连接问题**
A: 检查是否能访问 Google API，确认防火墙设置

**Q: 任务执行超时**
A: 简化任务描述，或增加超时时间配置

### 调试模式
启用 DEBUG 日志级别获取更详细的执行信息。

## 📚 更多资源

- [完整安装报告](~/.config/mcp/MCP_BROWSER_USE_INSTALLATION_REPORT.md)
- [详细配置指南](~/.config/mcp/BROWSER_USE_SETUP_GUIDE.md)
- [官方项目文档](https://github.com/Saik0s/mcp-browser-use)

---

**准备就绪！** 🎉  
现在你可以开始使用 AI 驱动的浏览器自动化功能了！

**提示**: 从简单的搜索任务开始，逐步尝试更复杂的功能。
