# Enhanced MCP Memory 智能记忆管理指南

## 🧠 概述

`enhanced-mcp-memory` 是一个强大的 AI 记忆管理系统，专为 Claude Sonnet 4 优化，提供持久记忆、智能上下文管理和高级推理连贯性功能。

## ✨ 核心特性

### 🎯 智能记忆管理
- **语义搜索** - 使用 sentence-transformers 进行自然语言查询
- **自动记忆分类** - 智能重要性评分和分类
- **重复检测** - 自动去重和内容优化
- **文件路径关联** - 代码与记忆的智能关联
- **知识图谱** - 自动相似性检测和关系建立

### 🧬 序列思考引擎
- **5阶段推理链** - 分析→规划→执行→验证→反思
- **上下文管理** - 自动令牌优化和压缩
- **会话连续性** - 跨会话智能摘要和继承
- **实时令牌估算** - 30-70% 压缩率优化
- **自动提取** - 关键点、决策和行动项识别

### 📋 高级任务管理
- **自动任务提取** - 从对话和代码注释中提取任务
- **优先级和分类** - 智能验证和状态跟踪
- **任务记忆关联** - 知识图谱集成
- **项目组织** - 结构化任务管理
- **复杂任务分解** - 可管理子任务生成

### 🏗️ 项目约定学习
- **自动环境检测** - OS、Shell、工具和运行时版本
- **项目类型识别** - Node.js、Python、Rust、Go、Java、MCP 服务器等
- **命令模式学习** - npm 脚本、Makefile 目标和项目命令
- **工具配置检测** - IDE、linter、CI/CD、构建工具和测试框架
- **依赖管理** - 包管理器、锁定文件和安装命令
- **智能命令建议** - 基于项目约定的命令纠正

## 🚀 快速开始

### 配置详情

已自动配置为：
```json
{
  "command": "uvx",
  "args": ["enhanced-mcp-memory"],
  "env": {
    "LOG_LEVEL": "INFO",
    "MAX_MEMORY_ITEMS": "1000",
    "MAX_CONTEXT_TOKENS": "8000",
    "ENABLE_AUTO_CLEANUP": "true",
    "DATA_DIR": "~/.config/mcp/memory-data"
  }
}
```

### 数据库位置
- **SQLite 数据库**: `~/ClaudeMemory/data/mcp_memory.db`
- **语义模型**: 自动下载 `all-MiniLM-L6-v2` (~90MB)
- **日志文件**: `~/ClaudeMemory/logs/`

## 🛠️ 可用工具

### 🧠 核心记忆工具

#### `get_memory_context(query)`
获取相关记忆和上下文
```
参数: query (string) - 自然语言查询
示例: "查找关于图片上传优化的记忆"
```

#### `create_task(title, description, priority, category)`
创建新任务
```
参数: 
- title (string) - 任务标题
- description (string) - 任务描述
- priority (string) - 优先级: high/medium/low
- category (string) - 分类: development/design/testing等
```

#### `get_tasks(status, limit)`
检索任务（支持过滤）
```
参数:
- status (string, 可选) - pending/in_progress/completed/cancelled
- limit (number, 可选) - 返回数量限制
```

#### `get_project_summary()`
获取项目全面概览
```
返回: 项目状态、关键记忆、活跃任务、重要决策
```

### 🧬 序列思考工具

#### `start_thinking_chain(objective)`
开始结构化推理过程
```
参数: objective (string) - 推理目标
返回: thinking_chain_id 用于后续步骤
```

#### `add_thinking_step(chain_id, stage, title, content, reasoning)`
添加推理步骤
```
参数:
- chain_id (string) - 推理链ID
- stage (string) - analysis/planning/execution/validation/reflection
- title (string) - 步骤标题
- content (string) - 步骤内容
- reasoning (string) - 推理说明
```

#### `get_thinking_chain(chain_id)`
获取完整推理链
```
参数: chain_id (string) - 推理链ID
返回: 完整的5阶段推理过程
```

### 📊 上下文管理工具

#### `create_context_summary(content, key_points, decisions, actions)`
压缩上下文以优化令牌
```
参数:
- content (string) - 原始内容
- key_points (array) - 关键点列表
- decisions (array) - 决策列表
- actions (array) - 行动项列表
```

#### `start_new_chat_session(title, objective, continue_from)`
开始新会话（支持继承）
```
参数:
- title (string) - 会话标题
- objective (string) - 会话目标
- continue_from (string, 可选) - 继承的会话ID
```

#### `get_optimized_context(max_tokens)`
获取令牌优化的上下文
```
参数: max_tokens (number) - 最大令牌数
返回: 压缩优化后的上下文
```

### 🏗️ 项目约定工具

#### `auto_learn_project_conventions(project_path)`
自动检测和学习项目模式
```
参数: project_path (string) - 项目路径
功能: 检测项目类型、工具配置、命令模式等
```

#### `get_project_conventions_summary()`
获取学习约定的格式化摘要
```
返回: 项目类型、检测到的约定、推荐命令、环境信息
```

#### `suggest_correct_command(user_command)`
建议项目适当的命令纠正
```
参数: user_command (string) - 用户输入的命令
返回: 纠正后的命令建议和解释
```

### 🔧 系统管理工具

#### `health_check()`
检查服务器健康状态和连接性
```
返回: 系统状态、数据库连接、模型加载情况
```

#### `get_performance_stats()`
获取详细性能指标
```
返回: 响应时间、成功率、内存使用、数据库性能
```

#### `cleanup_old_data(days_old)`
清理旧记忆和任务
```
参数: days_old (number) - 保留天数
功能: 删除超过指定天数的旧数据
```

## 🎯 针对你的墙纸胶项目应用

### 📁 项目理解增强

1. **自动学习项目约定**
   ```
   让我学习这个墙纸胶项目的结构和约定：
   - 检测到这是 React + TypeScript + Cloudflare 项目
   - 识别出 Vite 构建系统和 Tailwind CSS
   - 学习 npm run dev, npm run build 等命令
   - 记录组件结构和 API 端点模式
   ```

2. **持久化项目知识**
   ```
   记录关键项目信息：
   - 多语言支持 (中英俄)
   - 管理后台功能模块
   - Cloudflare D1 数据库结构
   - 图片上传和 R2 存储配置
   ```

### 🛠️ 开发流程优化

3. **智能任务管理**
   ```
   自动提取和跟踪开发任务：
   - 修复图片上传功能
   - 优化数据库查询性能
   - 添加新的产品管理功能
   - 更新多语言内容
   ```

4. **上下文连续性**
   ```
   跨会话保持上下文：
   - 记住之前的决策和技术选择
   - 维护开发进度状态
   - 保存重要的代码模式
   - 跟踪已知问题和解决方案
   ```

### 🧠 代码决策记忆

5. **技术决策记录**
   ```
   自动记录重要决策：
   - 选择 Cloudflare Pages 部署的原因
   - 认证系统的实现方案
   - 文件上传的安全考虑
   - 数据库设计的权衡
   ```

6. **问题解决知识库**
   ```
   累积问题解决经验：
   - 常见部署问题的解决方案
   - 性能优化技巧
   - 安全最佳实践
   - 调试和测试方法
   ```

## 🔧 高级用法

### 🔄 工作流集成

#### 开发会话开始
```
1. start_new_chat_session("墙纸胶项目开发", "继续开发管理后台功能")
2. get_memory_context("最新的开发进展和待解决的问题")
3. auto_learn_project_conventions("/Users/nll/Documents/可以用的网站")
4. get_tasks("in_progress", 10)
```

#### 复杂问题分析
```
1. start_thinking_chain("优化图片上传性能")
2. add_thinking_step(chain_id, "analysis", "当前性能瓶颈分析", ...)
3. add_thinking_step(chain_id, "planning", "优化方案设计", ...)
4. add_thinking_step(chain_id, "execution", "实施方案", ...)
5. get_thinking_chain(chain_id)
```

#### 项目知识积累
```
1. auto_process_conversation(对话内容, "development")
2. create_task("新功能开发", "实现产品搜索功能", "high", "development")
3. remember_project_pattern("api_pattern", "RESTful API 设计", "统一的 API 响应格式")
```

### 📈 性能监控

#### 定期维护
```
1. health_check() - 检查系统状态
2. get_performance_stats() - 获取性能指标
3. cleanup_old_data(30) - 清理30天前的旧数据
4. optimize_memories() - 优化存储空间
```

#### 数据分析
```
1. get_database_stats() - 数据库统计
2. get_memory_context("项目总结") - 获取项目概览
3. get_project_summary() - 完整项目状态
```

## 🔍 智能功能

### 🎯 语义搜索示例

```javascript
// 自然语言查询
get_memory_context("图片上传相关的安全措施")

// 会找到：
// - R2 存储配置
// - 文件类型验证
// - 权限控制机制
// - 安全最佳实践
// - 相关的代码实现
```

### 🧬 推理链示例

```javascript
// 5阶段推理过程
start_thinking_chain("优化数据库查询性能")

// Stage 1: Analysis - 分析当前查询瓶颈
add_thinking_step(chain_id, "analysis", "查询性能分析", "发现产品列表查询耗时过长", "...")

// Stage 2: Planning - 制定优化方案  
add_thinking_step(chain_id, "planning", "优化方案设计", "添加索引、分页、缓存", "...")

// Stage 3: Execution - 实施优化
add_thinking_step(chain_id, "execution", "代码实现", "添加数据库索引和查询优化", "...")

// Stage 4: Validation - 验证效果
add_thinking_step(chain_id, "validation", "性能测试", "查询时间从2s降至200ms", "...")

// Stage 5: Reflection - 总结经验
add_thinking_step(chain_id, "reflection", "经验总结", "数据库优化的最佳实践", "...")
```

### 🏗️ 项目约定学习

```javascript
// 自动检测项目特征
auto_learn_project_conventions("/Users/nll/Documents/可以用的网站")

// 检测结果：
// - 项目类型: React + TypeScript + Cloudflare
// - 构建工具: Vite
// - 样式框架: Tailwind CSS
// - 包管理: pnpm
// - 部署平台: Cloudflare Pages
// - 数据库: Cloudflare D1
// - 存储服务: Cloudflare R2

// 智能命令建议
suggest_correct_command("npm install")  // 建议: "pnpm install"
suggest_correct_command("npm run dev") // 确认: 正确
suggest_correct_command("python main.py") // 建议: "pnpm dev"
```

## 📊 配置选项

### 环境变量配置

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `LOG_LEVEL` | `INFO` | 日志级别 (DEBUG/INFO/WARNING/ERROR) |
| `MAX_MEMORY_ITEMS` | `1000` | 每个项目最大记忆数量 |
| `MAX_CONTEXT_TOKENS` | `8000` | 自动压缩的令牌阈值 |
| `CLEANUP_INTERVAL_HOURS` | `24` | 自动清理间隔 |
| `ENABLE_AUTO_CLEANUP` | `true` | 启用自动清理 |
| `MAX_CONCURRENT_REQUESTS` | `5` | 最大并发请求数 |
| `REQUEST_TIMEOUT` | `30` | 请求超时时间（秒） |
| `DATA_DIR` | `~/ClaudeMemory` | 数据和日志存储目录 |

### 性能调优

#### 令牌优化
- **压缩率**: 30-70% 上下文压缩
- **智能摘要**: 自动提取关键信息
- **分层存储**: 按重要性分级存储

#### 数据库优化
- **SQLite**: 高性能本地数据库
- **自动索引**: 语义搜索和快速查询
- **定期维护**: 自动清理和优化

## 🚨 故障排除

### 常见问题

#### 模型下载慢
- 首次运行需要下载 ~90MB 的语义模型
- 使用 `all-MiniLM-L6-v2` 模型，质量与速度平衡
- 模型缓存后后续使用快速

#### 内存使用高
- 语义模型需要一定内存（约200MB）
- 可通过 `MAX_MEMORY_ITEMS` 限制记忆数量
- 定期清理旧数据释放空间

#### 性能问题
- 语义搜索比关键字搜索慢但更准确
- 可调整 `LOG_LEVEL` 为 `WARNING` 减少日志
- 使用 `get_optimized_context()` 优化长上下文

### 调试方法

```javascript
// 检查系统状态
health_check()

// 查看性能统计
get_performance_stats()

// 数据库状态
get_database_stats()

// 清理和优化
cleanup_old_data(7)
optimize_memories()
```

## 🎉 最佳实践

### 🔄 日常使用

1. **会话开始时**
   - 恢复上下文和项目约定
   - 检查待处理任务
   - 获取相关记忆

2. **开发过程中**
   - 自动记录重要决策
   - 提取和管理任务
   - 建立知识关联

3. **会话结束时**
   - 创建上下文摘要
   - 保存关键成果
   - 为下次会话准备

### 📈 知识积累

1. **技术决策**
   - 记录决策背景和考虑因素
   - 跟踪实施效果
   - 总结经验教训

2. **问题解决**
   - 记录问题描述和解决方案
   - 建立问题分类和标签
   - 积累最佳实践

3. **项目模式**
   - 识别和记录代码模式
   - 学习项目特定约定
   - 优化开发流程

## 🔮 未来增强

### 计划功能
- **多模态记忆** - 支持图片、图表等
- **协作记忆** - 团队共享知识库
- **智能提醒** - 主动提供相关建议
- **深度学习** - 更智能的模式识别

### 扩展集成
- **IDE 插件** - VSCode、Cursor 集成
- **CI/CD 集成** - 构建过程记忆
- **文档生成** - 自动项目文档
- **测试增强** - 智能测试建议

---

**最后更新**: 2025-11-14 17:53  
**版本**: enhanced-mcp-memory v2.0.8  
**状态**: ✅ 完全配置完成  
**数据库**: ✅ 已初始化  
**模型**: ✅ 已下载并加载  

**现在 Cline 拥有了强大的持久记忆和智能上下文管理能力！**
