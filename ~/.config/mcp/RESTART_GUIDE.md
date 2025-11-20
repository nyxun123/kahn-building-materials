# 🔄 Cline 重启指南 - 加载完整的 MCP 工具套件

## 🎯 重启目的

重启 Cline 以加载已安装的 6 个专业 MCP 工具，启用完整的 AI 能力套件。

## 🛠️ 已配置的 MCP 工具

### 🧠 核心智能工具
1. **Enhanced MCP Memory** - 智能记忆管理和持久上下文
2. **Filesystem MCP Server** - 深度项目文件系统访问
3. **mcp-browser-use** - 本地浏览器自动化和视觉分析

### 🌐 云端服务工具
4. **Cloudflare Playwright MCP** - 全球部署的浏览器自动化
5. **GitHub MCP Server** - 代码仓库管理和协作
6. **Context7 MCP** - 高速 API 服务和私有仓库支持

## 📋 重启步骤

### 第一步：完全关闭 Cline
1. 在 VS Code 中完全关闭 Cline 扩展
2. 确保所有相关进程已终止

### 第二步：重新启动 Cline
1. 重新启用 Cline 扩展
2. 等待 MCP 服务器连接建立

### 第三步：验证工具加载
重启后，Cline 应该自动识别并加载以下工具：

#### 🧠 记忆管理工具
- `get_memory_context(query)` - 语义搜索记忆
- `create_task(...)` - 创建任务
- `get_tasks(...)` - 获取任务列表
- `start_thinking_chain(...)` - 开始推理链
- `auto_learn_project_conventions(...)` - 学习项目约定

#### 📁 文件系统工具
- `read_file(path)` - 读取文件
- `write_file(...)` - 写入文件
- `list_directory(...)` - 列出目录
- `copy_file(...)` - 复制文件/目录
- `delete_file(...)` - 安全删除

#### 🌐 浏览器工具
- `browser_navigate(url)` - 导航到网页
- `browser_click(selector)` - 点击元素
- `browser_type(text)` - 输入文本
- `browser_screenshot()` - 截图
- `browser_analyze()` - 页面分析

### 第四步：首次使用测试

#### 🧠 测试记忆管理
```
"请为这个墙纸胶项目创建一个开发任务，描述为'优化图片上传性能'"
```

#### 📁 测试文件系统
```
"请分析 src/components/ 目录结构，列出所有组件文件"
```

#### 🌐 浏览器测试
```
"请截图当前项目的本地开发环境"
```

## 🔍 验证配置

### 检查配置文件
确认以下文件存在且配置正确：
- `~/.config/mcp/cline_mcp_settings.json` - 主配置文件
- `~/.config/mcp-filesystem.json` - 文件系统配置
- `~/.config/mcp/memory-data/` - 记忆数据库目录

### 检查数据库状态
- Enhanced MCP Memory 数据库：`~/ClaudeMemory/data/mcp_memory.db`
- 语义模型：已下载 `all-MiniLM-L6-v2`

### 检查环境变量
确保以下环境变量可用：
- `GITHUB_PERSONAL_ACCESS_TOKEN`（如使用 GitHub MCP）
- `GOOGLE_API_KEY`（如使用 mcp-browser-use）

## 🎉 重启后的增强能力

### 🧠 智能记忆功能
- **持久记忆** - 跨会话保持项目知识
- **语义搜索** - 自然语言查询记忆内容
- **任务管理** - 自动提取和跟踪开发任务
- **项目学习** - 自动识别项目模式和约定

### 📁 文件系统访问
- **深度理解** - 完整的项目文件访问
- **批量操作** - 高效的文件管理
- **安全控制** - 受限的目录访问
- **智能分析** - 代码结构和依赖分析

### 🌐 浏览器自动化
- **本地测试** - 开发环境功能验证
- **云端部署** - 生产环境监控
- **视觉分析** - 网页截图和分析
- **交互测试** - 用户界面自动化测试

## 🚨 故障排除

### 如果工具未加载

#### 1. 检查配置文件
```bash
# 验证 JSON 语法
cat ~/.config/mcp/cline_mcp_settings.json | python -m json.tool
```

#### 2. 检查路径权限
```bash
# 确保配置目录可访问
ls -la ~/.config/mcp/
```

#### 3. 检查依赖工具
```bash
# 验证 uvx 可用
uvx --version

# 验证 Docker 可用（GitHub MCP）
docker --version
```

#### 4. 重新安装问题工具
```bash
# 重新安装 filesystem server
npm install -g @modelcontextprotocol/server-filesystem

# 重新安装 enhanced memory
uvx enhanced-mcp-memory --help
```

### 如果记忆系统初始化失败

#### 检查数据库权限
```bash
# 确保数据库目录可写
mkdir -p ~/ClaudeMemory/data
chmod 755 ~/ClaudeMemory
```

#### 检查模型下载
```bash
# 手动测试模型下载
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

## 📞 获取帮助

### 配置问题
- 检查 `~/.config/mcp/` 目录下的配置文件
- 参考各个工具的使用指南

### 工具问题
- 查看工具日志输出
- 检查工具的 GitHub 仓库文档

### 性能问题
- 调整日志级别减少输出
- 限制记忆项目数量
- 定期清理旧数据

## 🎯 成功标志

重启成功后，你应该看到：

### ✅ 工具加载成功
- Cline 界面显示 6 个 MCP 工具已连接
- 工具列表包含记忆、文件系统、浏览器等功能

### ✅ 功能正常工作
- 能够创建和管理记忆
- 能够访问和分析项目文件
- 能够进行浏览器自动化操作

### ✅ 项目自动学习
- 自动识别项目类型为 React + TypeScript + Cloudflare
- 学习项目特定的命令和约定
- 建立项目知识库

---

**重启完成后，Cline 将拥有企业级的 AI 能力！**

**🚀 准备体验智能、记忆、自动化合一的开发助手！**
