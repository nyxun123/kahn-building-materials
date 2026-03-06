# 技能系统快速使用指南

## 📋 概述

本项目包含全方位的自动化技能体系,涵盖开发、部署、SEO、内容管理、监控、营销、性能、安全、测试和备份等10大领域。

---

## 🚀 快速开始

### 1. 性能优化技能

**评分页面性能:**
```bash
pnpm skill:performance score /products
pnpm skill:performance score /products --mobile
```

**自动优化页面:**
```bash
pnpm skill:performance optimize /products
pnpm skill:performance optimize /products --level=aggressive
```

**压缩资源:**
```bash
# 压缩所有资源
pnpm skill:performance compress

# 仅压缩图片
pnpm skill:performance compress --type=images
```

**优化缓存策略:**
```bash
pnpm skill:performance cache-strategy --pattern="images/*" --duration=2592000
```

**Core Web Vitals 优化:**
```bash
pnpm skill:performance core-vitals /products --target=90
```

---

### 2. 安全卫士技能

**全面安全扫描:**
```bash
pnpm skill:security scan
pnpm skill:security scan --target=src/ --severity=high
```

**依赖审计:**
```bash
pnpm skill:security audit-dependencies
pnpm skill:security audit-dependencies --fix
```

**配置检查:**
```bash
pnpm skill:security config-check
```

**渗透测试:**
```bash
# 全部测试
pnpm skill:security pentest --type=xss,sql,injection

# 仅 XSS 测试
pnpm skill:security pentest --type=xss
```

---

### 3. 博客管理技能

**AI 生成文章:**
```bash
pnpm skill:blog generate \
  --topic "环保墙纸胶的优势" \
  --keywords "环保,无毒,墙纸胶" \
  --length 2000
```

**翻译文章:**
```bash
pnpm skill:blog translate \
  --article-id 123 \
  --target-languages "en,ru,vi"
```

**SEO 检查:**
```bash
pnpm skill:blog seo-check --article-id 123
```

**生成内容日历:**
```bash
# 每周发布
pnpm skill:blog calendar --month="2025-01" --frequency=weekly

# 每两周发布
pnpm skill:blog calendar --month="2025-01" --frequency=biweekly
```

---

## 📊 技能组合使用场景

### 场景 1: 发布新文章
```bash
# 1. AI 生成文章
pnpm skill:blog generate --topic "墙纸胶施工技巧" --keywords "施工,技巧,墙纸胶" --length 1500

# 2. SEO 检查
pnpm skill:blog seo-check --article-id <生成的文章ID>

# 3. 翻译为多语言
pnpm skill:blog translate --article-id <文章ID> --target-languages "en,ru,vi"

# 4. 部署上线
node scripts/skill-deploy.js "发布新博客文章"
```

### 场景 2: 性能优化流程
```bash
# 1. 评分当前性能
pnpm skill:performance score /products

# 2. 自动优化
pnpm skill:performance optimize /products

# 3. 压缩资源
pnpm skill:performance compress --type=images

# 4. 优化缓存策略
pnpm skill:performance cache-strategy --pattern="images/*" --duration=2592000

# 5. 重新评分验证
pnpm skill:performance score /products
```

### 场景 3: 安全加固流程
```bash
# 1. 全面扫描
pnpm skill:security scan --severity=high

# 2. 修复依赖问题
pnpm skill:security audit-dependencies --fix

# 3. 检查配置
pnpm skill:security config-check

# 4. 生成报告
pnpm skill:security scan --format=json > security-report.json
```

---

## 🔧 高级用法

### 性能优化 - 定时任务
```json
// package.json
{
  "scripts": {
    "daily:performance": "pnpm skill:performance score / && pnpm skill:performance compress",
    "weekly:optimization": "pnpm skill:performance optimize / && pnpm skill:performance cache-strategy --pattern='*' --duration=604800"
  }
}
```

### 安全扫描 - CI/CD 集成
```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Security Scan
        run: |
          pnpm install
          pnpm skill:security scan --severity=high
```

### 博客发布 - 自动化流程
```bash
#!/bin/bash
# publish-blog.sh

TOPIC=$1
KEYWORDS=$2

# 1. 生成文章
ARTICLE=$(pnpm skill:blog generate --topic "$TOPIC" --keywords "$KEYWORDS" --length 1500)

# 2. SEO 检查
pnpm skill:blog seo-check --article-id $ARTICLE

# 3. 翻译
pnpm skill:blog translate --article-id $ARTICLE --target-languages "en,ru"

# 4. 部署
node scripts/skill-deploy.js "发布博客: $TOPIC"
```

---

## 📈 性能指标参考

### Core Web Vitals 目标值
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TBT** (Total Blocking Time): < 200ms

### 性能评分标准
- **90-100**: 优秀 (绿色)
- **75-89**: 良好 (橙色)
- **50-74**: 需要改进 (红色)
- **0-49**: 差 (深红色)

---

## 🔒 安全评分标准

### 安全等级
- **90-100 (A级)**: 安全性优秀
- **80-89 (B级)**: 安全性良好
- **70-79 (C级)**: 安全性一般
- **60-69 (D级)**: 存在安全隐患
- **0-59 (F级)**: 高风险

### 漏洞严重程度
- **Critical**: 立即修复 (-25分)
- **High**: 尽快修复 (-15分)
- **Medium**: 计划修复 (-8分)
- **Low**: 可选修复 (-3分)

---

## 🎯 最佳实践

### 1. 定期维护
```bash
# 每日任务
pnpm skill:security scan
pnpm skill:performance score /

# 每周任务
pnpm skill:security audit-dependencies
pnpm skill:performance compress

# 每月任务
pnpm skill:security pentest
pnpm skill:performance optimize
```

### 2. 发布前检查
```bash
# 1. 安全检查
pnpm skill:security scan --severity=high

# 2. 性能检查
pnpm skill:performance score / --mobile

# 3. 依赖审计
pnpm skill:security audit-dependencies
```

### 3. 内容创作流程
```bash
# 1. 生成文章
pnpm skill:blog generate --topic "xxx" --keywords "xxx"

# 2. SEO 优化
pnpm skill:blog seo-check --article-id <id>

# 3. 多语言翻译
pnpm skill:blog translate --article-id <id>

# 4. 部署发布
node scripts/skill-deploy.js
```

---

## 🛠️ 故障排除

### 问题 1: Lighthouse 未安装
```bash
pnpm add -D lighthouse chrome-launcher
```

### 问题 2: AI API 未配置
```bash
# 设置 OpenAI API
export OPENAI_API_KEY="sk-xxx"

# 或设置 Claude API
export ANTHROPIC_API_KEY="sk-ant-xxx"
```

### 问题 3: 权限错误
```bash
# 给脚本添加执行权限
chmod +x scripts/skills/**/*.js
```

---

## 📚 更多技能

查看完整的技能体系设计文档:
- [技能系统设计文档](./SKILL_SYSTEM_DESIGN.md)

---

## 💡 技能开发

如果你想创建自己的技能:

1. **创建技能文件**
```bash
# 在相应目录创建技能
touch scripts/skills/custom/my-skill.js
```

2. **使用技能模板**
```javascript
class MyCustomSkill {
  constructor(options) {
    this.options = options;
  }

  async execute() {
    // 实现逻辑
  }
}
```

3. **添加到 package.json**
```json
{
  "scripts": {
    "skill:my-custom": "node scripts/skills/custom/my-skill.js"
  }
}
```

---

**版本:** v1.0.0
**更新时间:** 2025-01-09
**维护者:** AI Development Team
