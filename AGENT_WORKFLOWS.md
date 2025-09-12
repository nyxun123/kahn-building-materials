# 🔄 Sub Agent协作流程与工作规范

## 🎯 核心协作原则

### 1. 🚀 效率优先原则
- **并行执行**: 无依赖关系的任务必须并行处理
- **工具优化**: 优先使用批量工具调用，减少等待时间
- **状态同步**: 实时更新任务状态，避免重复工作

### 2. 🎨 质量保障原则  
- **代码审查**: 所有代码变更必须经过Code Review Agent审查
- **测试覆盖**: 新功能必须包含完整的测试用例
- **文档同步**: 重要变更必须同步更新相关文档

### 3. 🔐 安全防护原则
- **权限最小化**: Agent只拥有必要的操作权限
- **敏感信息保护**: 不在代码中硬编码敏感数据
- **安全扫描**: Security Agent对所有代码进行安全检查

## 📋 标准工作流程

### 🎪 Phase 1: 需求分析阶段
```mermaid
sequenceDiagram
    participant User as 用户
    participant PL as Project Lead Agent
    participant Teams as 各专业团队

    User->>PL: 提出需求
    PL->>PL: 需求分析和场景识别
    PL->>Teams: 需求澄清和确认
    Teams->>PL: 技术可行性反馈
    PL->>User: 需求确认和方案建议
```

**Project Lead Agent职责:**
1. 接收用户需求，识别项目场景类型
2. 根据场景选择适用的规则文件
3. 向用户确认理解的正确性
4. 制定初步技术方案

### 🏗️ Phase 2: 技术设计阶段
```mermaid
sequenceDiagram
    participant PL as Project Lead Agent
    participant FE as Frontend Lead
    participant BE as Backend Lead  
    participant DevOps as DevOps Lead
    participant QA as QA Lead

    PL->>FE: 前端架构设计任务
    PL->>BE: 后端架构设计任务
    PL->>DevOps: 部署方案设计任务
    PL->>QA: 测试策略设计任务
    
    par 并行设计
        FE->>FE: UI/UX设计 + 技术选型
        BE->>BE: 数据库设计 + API设计
        DevOps->>DevOps: CI/CD流程设计
        QA->>QA: 测试用例设计
    end
    
    FE->>PL: 前端方案
    BE->>PL: 后端方案
    DevOps->>PL: 部署方案
    QA->>PL: 测试方案
    
    PL->>PL: 方案整合和优化
    PL->>User: 完整技术方案确认
```

### 🛠️ Phase 3: 开发实施阶段
```mermaid
sequenceDiagram
    participant PL as Project Lead
    participant FE as Frontend Team
    participant BE as Backend Team
    participant DevOps as DevOps Team

    PL->>BE: 优先部署后端服务
    BE->>BE: 云函数开发和部署
    BE->>BE: 数据库配置和数据模型
    BE->>PL: 后端服务完成

    PL->>FE: 启动前端开发
    PL->>DevOps: 准备部署环境
    
    par 并行开发
        FE->>FE: 组件开发 + 页面实现
        DevOps->>DevOps: CI/CD配置
    end
    
    FE->>PL: 前端开发完成
    DevOps->>PL: 部署环境就绪
```

### ✅ Phase 4: 测试验收阶段
```mermaid
sequenceDiagram
    participant Dev as 开发团队
    participant QA as QA Testing Agent
    participant CR as Code Review Agent
    participant Sec as Security Agent
    participant PL as Project Lead

    Dev->>CR: 代码审查请求
    CR->>CR: 代码质量检查
    CR->>QA: 代码审查通过
    
    QA->>QA: 功能测试执行
    QA->>Sec: 功能测试通过
    
    Sec->>Sec: 安全检查执行
    Sec->>PL: 安全检查通过
    
    PL->>PL: 最终质量验收
    PL->>User: 交付确认
```

## 🎭 Agent专业分工细则

### Frontend Team内部协作
```mermaid
graph TD
    FL[Frontend Lead] --> |架构指导| UID[UI/UX Design]
    FL --> |技术指导| MRA[Mobile Responsive]  
    FL --> |集成指导| I18N[I18n Agent]
    
    UID --> |设计稿| MRA
    UID --> |组件规范| I18N
    MRA --> |适配方案| I18N
```

**协作规范:**
- Frontend Lead负责技术架构决策
- UI/UX Design Agent先出设计稿
- Mobile Responsive Agent基于设计稿进行适配
- I18n Agent负责多语言实现

### Backend Team内部协作
```mermaid
graph TD
    BL[Backend Lead] --> |架构设计| DBA[Database Agent]
    BL --> |API规范| API[API Integration]
    DBA --> |数据模型| API
    API --> |接口测试| BL
```

**协作规范:**
- Backend Lead制定整体架构
- Database Agent优先设计数据模型
- API Integration Agent基于数据模型开发接口
- 所有后端变更需Backend Lead最终确认

## ⚙️ 工具使用分配

### CloudBase MCP工具分配表
| Agent角色 | 主要工具 | 权限级别 |
|----------|---------|---------|
| Project Lead | 所有工具 | 完全权限 |
| Backend Lead | 云函数、数据库工具 | 高权限 |
| Database Agent | 数据库、数据模型工具 | 专业权限 |
| Deployment Agent | 静态托管、域名工具 | 部署权限 |
| Security Agent | 安全规则工具 | 只读权限 |

### 工具调用优先级
1. **高优先级**: 云函数部署、数据库操作
2. **中优先级**: 静态托管、域名配置
3. **低优先级**: 查询类、监控类操作

## 🔔 异常处理机制

### 常见问题解决流程
```mermaid
graph TD
    A[Agent遇到问题] --> B{问题类型}
    B -->|技术问题| C[向Team Lead求助]
    B -->|工具问题| D[尝试替代方案]
    B -->|需求不明确| E[向Project Lead澄清]
    
    C --> F[Team Lead提供技术指导]
    D --> G[使用备用工具继续]
    E --> H[Project Lead与用户确认]
    
    F --> I[问题解决继续任务]
    G --> I
    H --> I
```

### 升级机制
1. **Level 1**: Agent内部解决
2. **Level 2**: Team Lead介入
3. **Level 3**: Project Lead协调
4. **Level 4**: 向用户寻求帮助

## 📊 质量度量标准

### 代码质量指标
- **代码覆盖率**: >80%
- **ESLint检查**: 0错误，0警告
- **TypeScript检查**: 无类型错误
- **性能评分**: Lighthouse >90分

### 协作效率指标
- **任务完成率**: >95%
- **平均响应时间**: <2分钟
- **问题解决率**: >90%
- **用户满意度**: >4.5/5星

## 🎓 持续改进机制

### 知识库建设
1. **经验总结**: 每个项目结束后总结最佳实践
2. **问题库**: 建立常见问题和解决方案库
3. **模板库**: 沉淀可复用的代码模板和配置
4. **培训材料**: 为新Agent提供培训文档

### 流程优化
1. **定期回顾**: 每周团队回顾会议
2. **流程改进**: 基于反馈优化协作流程
3. **工具升级**: 跟进新工具和技术趋势
4. **规则更新**: 根据项目经验更新规则文档

---

*本工作流程文档是活文档，将根据项目实践不断优化更新*