#!/usr/bin/env node

/**
 * 外链和内容营销自动化脚本
 * 自动生成营销内容、创建外链机会和推广渠道
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logStep(step) {
  log(`🚀 ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(60)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(60)}`, colors.bright);
}

class ContentMarketing {
  constructor() {
    this.domain = 'https://kn-wallpaperglue.com';
    this.projectRoot = process.cwd();
    this.contentDir = path.join(this.projectRoot, 'content-marketing');

    // 营销内容配置
    this.contentTypes = {
      blog: '博客文章',
      faq: '问答内容',
      case: '客户案例',
      news: '行业新闻',
      tutorial: '教程指南'
    };

    // 目标平台配置
    this.platforms = {
      industryForums: ['化工网', '建材网', '纺织网'],
      socialMedia: ['LinkedIn', '知乎专栏', '百度百家号'],
      businessDirectories: ['阿里巴巴', '慧聪网', '马可波罗网'],
      qaPlatforms: ['百度知道', '知乎问答', '悟空问答']
    };

    // 关键词配置
    this.keywords = {
      primary: ['羧甲基淀粉', 'CMS', '壁纸胶粉', '建筑胶粉', '纺织助剂'],
      secondary: ['羧甲基淀粉钠', '环保建材', '天然高分子', '水溶性聚合物'],
      longTail: ['羧甲基淀粉厂家价格', 'CMS壁纸胶粉配方', '环保建筑胶粉供应商', '纺织印染助剂作用']
    };
  }

  // 确保内容目录存在
  ensureContentDirectory() {
    if (!fs.existsSync(this.contentDir)) {
      fs.mkdirSync(this.contentDir, { recursive: true });
      logInfo('创建内容营销目录');
    }

    // 创建子目录
    const subdirs = ['blogs', 'faqs', 'cases', 'press-releases', 'social-posts'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(this.contentDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    }
  }

  // 生成博客文章
  generateBlogPosts() {
    logStep('生成博客文章');

    const blogPosts = [
      {
        title: '羧甲基淀粉(CMS)在建筑行业的应用与发展趋势',
        category: '行业分析',
        keywords: ['羧甲基淀粉', '建筑材料', '环保建材', 'CMS应用'],
        content: this.generateBlogContent('building'),
        publishDate: new Date().toISOString()
      },
      {
        title: '如何选择优质的壁纸胶粉？专家建议与选购指南',
        category: '产品指南',
        keywords: ['壁纸胶粉', '选购指南', '质量标准', '施工要点'],
        content: this.generateBlogContent('wallpaper'),
        publishDate: new Date().toISOString()
      },
      {
        title: '环保型纺织助剂的革新：羧甲基淀粉的绿色应用',
        category: '技术创新',
        keywords: ['纺织助剂', '环保材料', 'CMS纺织应用', '绿色化学'],
        content: this.generateBlogContent('textile'),
        publishDate: new Date().toISOString()
      }
    ];

    const results = [];
    for (const post of blogPosts) {
      const filename = `${post.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.md`;
      const filepath = path.join(this.contentDir, 'blogs', filename);

      const markdown = this.generateMarkdownPost(post);
      fs.writeFileSync(filepath, markdown);

      results.push({ title: post.title, filename, category: post.category });
      logSuccess(`博客文章已生成: ${filename}`);
    }

    return results;
  }

  // 生成博客内容
  generateBlogContent(type) {
    const templates = {
      building: `## 引言
羧甲基淀粉(CMS)作为一种重要的环保建筑材料，正在现代建筑行业中发挥着越来越重要的作用。杭州卡恩新建材有限公司作为专业的CMS供应商，致力于为建筑行业提供高质量的产品解决方案。

## CMS在建筑中的主要应用

### 1. 壁纸胶粉
- **粘合性能优异**：提供强力的壁纸粘贴效果
- **环保无毒**：不含甲醛等有害物质
- **施工简便**：调配方便，干燥快速

### 2. 腻子粉添加剂
- **增强粘结力**：提高腻子与墙体的附着力
- **改善施工性**：使腻子更易涂抹和打磨
- **抗裂性能**：减少墙面开裂现象

### 3. 内墙涂料添加剂
- **增稠作用**：改善涂料的流变性能
- **稳定性强**：防止涂料沉淀和分层
- **成膜性好**：提高涂膜的附着力

## 技术优势

1. **环保特性**：可生物降解，符合绿色建筑标准
2. **成本效益**：相比传统助剂更具价格优势
3. **性能稳定**：批次间质量稳定可靠
4. **使用安全**：无毒无害，施工环境友好

## 发展趋势

随着环保法规的日益严格和消费者环保意识的提升，CMS在建筑行业的应用前景广阔：

- **绿色建材政策推动**
- **市场需求持续增长**
- **产品性能不断优化**
- **应用领域持续拓展`,

      wallpaper: `## 壁纸胶粉选购完全指南

选择合适的壁纸胶粉对于确保壁纸施工质量至关重要。本文将为您提供详细的选购建议和实用技巧。

## 什么是壁纸胶粉？

壁纸胶粉，特别是羧甲基淀粉(CMS)基壁纸胶粉，是一种专门用于壁纸粘贴的环保型粘合剂。

## 选购要点

### 1. 粘结强度
- **测试方法**：将胶粉涂布在玻璃板上，观察成膜性和粘性
- **判断标准**：成膜均匀，粘性适中，不拉丝

### 2. 环保性能
- **甲醛含量**：选择甲醛释放量低的产品
- **气味检测**：优质产品气味清淡或无味
- **认证标识**：查看是否有环保认证

### 3. 施工性能
- **溶解性**：在水中易溶解，无结块现象
- **开放时间**：可操作时间适中
- **干燥时间**：正常环境下24小时内完全干燥

### 4. 储存稳定性
- **保质期**：通常为12-18个月
- **储存条件**：阴凉干燥，避免受潮

## 常见问题解答

**Q: 如何判断壁纸胶粉的质量？**
A: 主要从粘结强度、环保性能、施工性能三个方面综合判断。

**Q: 不同类型的壁纸需要不同的胶粉吗？**
A: 是的，不同材质和克重的壁纸需要使用相应规格的胶粉。

**Q: 壁纸胶粉的用量如何计算？**
A: 一般按包装说明使用，通常每平方米壁纸需要50-100克胶粉。`,

      textile: `## 环保纺织助剂的革新：羧甲基淀粉的绿色应用

纺织工业正面临着环保转型的巨大挑战，羧甲基淀粉(CMS)作为一种绿色环保的纺织助剂，正在引领行业的可持续发展。

## CMS在纺织行业的应用

### 1. 经纱上浆
- **保护经纱**：减少织造过程中的断头
- **提高强度**：增强纱线的耐磨性能
- **易于退浆**：后处理工序简单方便

### 2. 印花粘合剂
- **图案清晰**：保证印花图案的精确性
- **色彩鲜艳**：不影响染料的发色效果
- **手感柔软**：保持织物的柔软手感

### 3. 整理剂
- **抗皱性能**：提高织物的抗皱性
- **手感改善**：使织物手感更佳
- **耐洗性能**：增强织物的耐洗涤性

## 环保优势

### 1. 生物降解性
- **完全降解**：在自然环境中可完全分解
- **无污染**：降解产物对环境无害
- **符合标准**：满足国际环保要求

### 2. 生产工艺
- **低温合成**：节约能源消耗
- **无污染排放**：生产过程环保清洁
- **资源可再生**：原料来源可持续

### 3. 使用安全
- **无毒无害**：对人体无刺激性
- **操作安全**：使用过程中安全可靠
- **废液处理**：废液易于处理和回收

## 市场前景

随着全球环保意识的提升，CMS在纺织行业的应用前景广阔：

- **政策支持**：各国环保政策推动绿色纺织发展
- **市场需求**：消费者对环保纺织品需求增长
- **技术进步**：产品性能不断提升
- **成本优势**：相比传统助剂更具成本竞争力`
    };

    return templates[type] || templates.building;
  }

  // 生成Markdown格式的文章
  generateMarkdownPost(post) {
    let markdown = `# ${post.title}

**分类**: ${post.category}
**关键词**: ${post.keywords.join(', ')}
**发布日期**: ${new Date(post.publishDate).toLocaleDateString('zh-CN')}

---

${post.content}

---

## 关于杭州卡恩新建材有限公司

杭州卡恩新建材有限公司是专业的羧甲基淀粉(CMS)生产商，拥有23年的行业经验。我们提供：
- 高质量的CMS产品
- 技术支持和解决方案
- 定制化产品服务
- 完善的质量保证体系

**联系我们**:
- 网站: ${this.domain}
- 邮箱: info@kn-wallpaperglue.com
- 电话: +86-XXX-XXXX-XXXX

**相关产品链接**:
- [羧甲基淀粉产品](${this.domain}/products)
- [应用领域](${this.domain}/applications)
- [常见问题](${this.domain}/faq)

---

*本文由杭州卡恩新建材有限公司原创，转载请注明出处。*
`;

    return markdown;
  }

  // 生成FAQ内容
  generateFAQs() {
    logStep('生成FAQ内容');

    const faqs = [
      {
        question: '羧甲基淀粉(CMS)与传统助剂相比有什么优势？',
        answer: 'CMS相比传统助剂具有环保无毒、可生物降解、成本效益高、性能稳定等优势，更符合现代绿色建筑和环保要求。',
        category: '产品对比',
        keywords: ['CMS优势', '环保助剂', '绿色建材']
      },
      {
        question: '如何正确使用壁纸胶粉？',
        answer: '将胶粉按说明比例加入水中，充分搅拌至无结块，静置15-20分钟使其充分溶解，然后进行壁纸粘贴。注意控制温度和湿度。',
        category: '使用指南',
        keywords: ['壁纸胶粉使用', '施工要点', '调配方法']
      },
      {
        question: 'CMS在纺织印染中的作用是什么？',
        answer: 'CMS在纺织印染中主要用作经纱上浆剂、印花粘合剂和整理剂，能够提高纱线强度、改善印花效果、增强织物性能。',
        category: '应用技术',
        keywords: ['纺织应用', '印染助剂', '经纱上浆']
      },
      {
        question: '环保建材材料的市场前景如何？',
        answer: '随着环保法规的完善和消费者环保意识的提升，环保建材市场前景广阔。CMS等绿色材料将获得更多政策支持和市场认可。',
        category: '市场分析',
        keywords: ['环保建材', '市场趋势', '绿色建筑']
      }
    ];

    const results = [];
    for (const faq of faqs) {
      const filename = `faq-${faq.question.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.md`;
      const filepath = path.join(this.contentDir, 'faqs', filename);

      const content = `# ${faq.question}

**分类**: ${faq.category}
**关键词**: ${faq.keywords.join(', ')}
**更新时间**: ${new Date().toLocaleDateString('zh-CN')}

## 答案

${faq.answer}

---

## 相关问题

- [什么是羧甲基淀粉？](${this.domain}/faq)
- [CMS的主要应用领域有哪些？](${this.domain}/faq)
- [如何选择合适的CMS产品？](${this.domain}/faq)

---

*更多问答请访问我们的[FAQ页面](${this.domain}/faq)*
`;

      fs.writeFileSync(filepath, content);
      results.push({ question: faq.question, filename, category: faq.category });
      logSuccess(`FAQ内容已生成: ${filename}`);
    }

    return results;
  }

  // 生成客户案例
  generateCaseStudies() {
    logStep('生成客户案例');

    const cases = [
      {
        title: '某大型建筑项目使用CMS壁纸胶粉的案例研究',
        industry: '建筑工程',
        challenge: '传统壁纸胶粘剂含有害物质，不环保，且粘结力不稳定',
        solution: '采用我司CMS环保壁纸胶粉，确保施工质量和环保要求',
        result: '项目通过环保验收，施工质量优秀，客户满意度高',
        clientType: '建筑公司'
      },
      {
        title: '纺织厂使用CMS助剂提升产品质量的成功经验',
        industry: '纺织印染',
        challenge: '传统助剂环保性差，影响产品出口，成本较高',
        solution: '替换为环保型CMS纺织助剂，提升产品环保性能',
        result: '产品通过国际环保认证，出口量增加30%',
        clientType: '纺织企业'
      }
    ];

    const results = [];
    for (const caseStudy of cases) {
      const filename = `case-${caseStudy.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.md`;
      const filepath = path.join(this.contentDir, 'cases', filename);

      const content = `# ${caseStudy.title}

**行业**: ${caseStudy.industry}
**客户类型**: ${caseStudy.clientType}
**案例时间**: ${new Date().toLocaleDateString('zh-CN')}

## 项目背景

${caseStudy.challenge}

## 解决方案

${caseStudy.solution}

## 实施结果

${caseStudy.result}

## 技术优势

- **环保性能**：符合国际环保标准
- **质量提升**：显著提高产品质量
- **成本控制**：有效降低生产成本
- **服务支持**：专业的技术指导

## 客户评价

"杭州卡恩的CMS产品质量稳定，技术服务专业，帮助我们成功解决了环保和成本问题。" - 项目负责人

---

## 相关产品

- [CMS产品系列](${this.domain}/products)
- [技术支持](${this.domain}/contact)
- [更多案例](${this.domain}/about)

---

*本案例经客户授权发布，保护客户隐私，部分数据已做处理。*
`;

      fs.writeFileSync(filepath, content);
      results.push({ title: caseStudy.title, filename, industry: caseStudy.industry });
      logSuccess(`客户案例已生成: ${filename}`);
    }

    return results;
  }

  // 生成社交媒体内容
  generateSocialPosts() {
    logStep('生成社交媒体内容');

    const socialPosts = [
      {
        platform: 'LinkedIn',
        title: '环保建材新选择：羧甲基淀粉的绿色应用',
        content: `🌱 环保建材新时代！杭州卡恩的羧甲基淀粉(CMS)产品正在改变建筑行业的环保标准。

✅ 无毒无害
✅ 可生物降解
✅ 性能稳定
✅ 成本效益高

了解更多绿色建材解决方案：${this.domain}

#环保建材 #绿色建筑 #羧甲基淀粉 #可持续发展`,
        hashtags: ['环保建材', '绿色建筑', '羧甲基淀粉', '可持续发展'],
        imageSuggestion: '环保建材和绿色树叶的结合图'
      },
      {
        platform: '知乎',
        title: '壁纸胶粉如何选择？专家详解选购要点',
        content: `作为专业的壁纸胶粉供应商，今天我来详细讲解如何选择优质的壁纸胶粉：

1️⃣ 看环保性能：选择甲醛含量低的产品
2️⃣ 检查粘结力：确保粘贴效果持久
3️⃣ 测试施工性：操作简便，干燥快速
4️⃣ 确认品牌资质：选择正规厂家

我们提供专业的CMS壁纸胶粉，环保无毒，性能优异。欢迎咨询！

#壁纸胶粉 #装修材料 #环保装修`,
        hashtags: ['壁纸胶粉', '装修材料', '环保装修'],
        imageSuggestion: '壁纸施工过程图'
      }
    ];

    const results = [];
    for (const post of socialPosts) {
      const filename = `social-${post.platform.toLowerCase()}-${Date.now()}.md`;
      const filepath = path.join(this.contentDir, 'social-posts', filename);

      const content = `# ${post.title}

**平台**: ${post.platform}
**发布时间**: ${new Date().toLocaleDateString('zh-CN')}
**建议图片**: ${post.imageSuggestion}

## 内容

${post.content}

**标签**: ${post.hashtags.join(', ')}

---

## 发布建议

- **最佳发布时间**: 工作日上午9-11点，下午2-4点
- **互动策略**: 及时回复评论和私信
- **数据监测**: 关注点赞、评论、转发数据

---

*更多营销内容请访问我们的[网站](${this.domain})*
`;

      fs.writeFileSync(filepath, content);
      results.push({ title: post.title, platform: post.platform, filename });
      logSuccess(`社交媒体内容已生成: ${filename}`);
    }

    return results;
  }

  // 生成外链机会清单
  generateBacklinkOpportunities() {
    logStep('生成外链机会清单');

    const opportunities = [
      {
        type: '行业目录',
        platforms: ['化工网', '建材网', '纺织网'],
        action: '提交公司信息和产品资料',
        priority: '高',
        estimatedTime: '1-2周'
      },
      {
        type: '商业列表',
        platforms: ['阿里巴巴', '慧聪网', '马可波罗网'],
        action: '创建企业展示页面，发布产品信息',
        priority: '高',
        estimatedTime: '2-3周'
      },
      {
        type: '内容平台',
        platforms: ['知乎专栏', '百度百家号', '行业博客'],
        action: '发布专业文章，建立权威形象',
        priority: '中',
        estimatedTime: '3-4周'
      },
      {
        type: '问答平台',
        platforms: ['百度知道', '知乎问答', '悟空问答'],
        action: '回答相关问题，推广专业知识',
        priority: '中',
        estimatedTime: '持续进行'
      },
      {
        type: '社交媒体',
        platforms: ['LinkedIn', 'Facebook', 'Twitter'],
        action: '定期发布行业动态和产品信息',
        priority: '低',
        estimatedTime: '持续进行'
      }
    ];

    let content = `# 外链建设机会清单

**生成时间**: ${new Date().toLocaleDateString('zh-CN')}
**目标网站**: ${this.domain}

## 外链建设策略

### 高优先级机会

`;

    for (const opp of opportunities) {
      content += `
#### ${opp.type} (${opp.priority}优先级)
- **平台**: ${opp.platforms.join(', ')}
- **行动**: ${opp.action}
- **预期时间**: ${opp.estimatedTime}
- **状态**: [ ] 待开始
`;
    }

    content += `

## 执行计划

### 第一周
- [ ] 准备企业信息和产品资料
- [ ] 注册高优先级平台账号

### 第二周
- [ ] 提交行业目录信息
- [ ] 创建商业列表页面

### 第三四周
- [ ] 发布内容平台专业文章
- [ ] 开始问答平台推广

### 长期执行
- [ ] 定期更新社交媒体内容
- [ ] 持续监控和维护外链

## 成功指标

- 外链数量增长
- 网站流量提升
- 搜索引擎排名改善
- 品牌知名度提高

---

*本清单建议每季度更新一次，根据执行情况调整策略。*
`;

    const filepath = path.join(this.contentDir, 'backlink-opportunities.md');
    fs.writeFileSync(filepath, content);

    logSuccess(`外链机会清单已生成: backlink-opportunities.md`);

    return opportunities;
  }

  // 生成营销日历
  generateMarketingCalendar() {
    logStep('生成营销日历');

    const calendar = {
      weekly: [
        {
          day: '周一',
          tasks: ['检查网站SEO状态', '发布一篇博客文章', '更新社交媒体']
        },
        {
          day: '周三',
          tasks: ['发布FAQ内容', '参与行业讨论', '检查外链状态']
        },
        {
          day: '周五',
          tasks: '发布客户案例，总结本周工作，规划下周内容'
        }
      ],
      monthly: [
        {
          week: '第一周',
          focus: '新产品推广和技术文章发布'
        },
        {
          week: '第二周',
          focus: '客户案例收集和发布'
        },
        {
          week: '第三周',
          focus: '行业趋势分析和评论文章'
        },
        {
          week: '第四周',
          focus: '月度总结和下月计划'
        }
      ]
    };

    let content = `# 内容营销日历

**生成时间**: ${new Date().toLocaleDateString('zh-CN')}
**适用网站**: ${this.domain}

## 每周任务安排

`;

    for (const dayTask of calendar.weekly) {
      content += `### ${dayTask.day}\n`;
      if (Array.isArray(dayTask.tasks)) {
        dayTask.tasks.forEach(task => {
          content += `- [ ] ${task}\n`;
        });
      } else {
        content += `- [ ] ${dayTask.tasks}\n`;
      }
      content += '\n';
    }

    content += `## 每月重点工作

`;

    for (const weekFocus of calendar.monthly) {
      content += `### ${weekFocus.week}\n`;
      content += `- 重点：${weekFocus.focus}\n\n`;
    }

    content += `## 季度目标

### Q1目标
- 建立稳定的发布频率
- 获得20+质量外链
- 提升网站流量50%

### Q2目标
- 扩大社交媒体影响力
- 增加客户案例数量
- 优化SEO排名

### Q3目标
- 加强行业权威性建设
- 开发新的内容形式
- 提升品牌知名度

### Q4目标
- 总结全年营销效果
- 制定下年度营销策略
- 优化营销流程

## 工具和资源

- 内容创作工具：Markdown编辑器、图片制作软件
- 发布平台：公司网站、行业平台、社交媒体
- 分析工具：Google Analytics、搜索引擎控制台
- 监控工具：外链检查工具、排名跟踪工具

---

*定期更新营销日历，根据实际情况调整策略。*
`;

    const filepath = path.join(this.contentDir, 'marketing-calendar.md');
    fs.writeFileSync(filepath, content);

    logSuccess(`营销日历已生成: marketing-calendar.md`);

    return calendar;
  }

  // 生成内容营销总结报告
  generateMarketingReport(results) {
    logStep('生成内容营销报告');

    const report = {
      generatedAt: new Date().toISOString(),
      website: this.domain,
      contentGenerated: {
        blogPosts: results.blogPosts ? results.blogPosts.length : 0,
        faqs: results.faqs ? results.faqs.length : 0,
        caseStudies: results.caseStudies ? results.caseStudies.length : 0,
        socialPosts: results.socialPosts ? results.socialPosts.length : 0
      },
      backlinkOpportunities: results.backlinkOpportunities ? results.backlinkOpportunities.length : 0,
      totalFiles: Object.values(results.contentGenerated || {}).reduce((sum, count) => sum + count, 0),
      nextSteps: [
        '开始执行外链建设计划',
        '定期发布新内容',
        '监控SEO表现',
        '调整营销策略'
      ]
    };

    const filepath = path.join(this.projectRoot, 'content-marketing-report.json');
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

    logSuccess(`内容营销报告已保存: content-marketing-report.json`);

    return report;
  }

  // 完整的内容营销生成流程
  async generate() {
    logHeader('📝 内容营销自动生成系统');
    log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);

    const results = {};

    try {
      // 1. 创建内容目录
      this.ensureContentDirectory();

      // 2. 生成博客文章
      results.blogPosts = this.generateBlogPosts();

      // 3. 生成FAQ内容
      results.faqs = this.generateFAQs();

      // 4. 生成客户案例
      results.caseStudies = this.generateCaseStudies();

      // 5. 生成社交媒体内容
      results.socialPosts = this.generateSocialPosts();

      // 6. 生成外链机会清单
      results.backlinkOpportunities = this.generateBacklinkOpportunities();

      // 7. 生成营销日历
      results.marketingCalendar = this.generateMarketingCalendar();

      // 8. 生成营销报告
      results.report = this.generateMarketingReport(results);

      // 9. 显示总结
      logHeader('📊 内容营销生成总结');
      logSuccess(`✅ 博客文章: ${results.blogPosts.length} 篇`);
      logSuccess(`✅ FAQ内容: ${results.faqs.length} 个`);
      logSuccess(`✅ 客户案例: ${results.caseStudies.length} 个`);
      logSuccess(`✅ 社交媒体内容: ${results.socialPosts.length} 个`);
      logSuccess(`✅ 外链机会: ${results.backlinkOpportunities.length} 类`);

      log('\n📁 生成的文件:', colors.blue);
      log(`  📂 ${this.contentDir}/`, colors.yellow);
      log(`  📂 ${this.contentDir}/blogs/`, colors.yellow);
      log(`  📂 ${this.contentDir}/faqs/`, colors.yellow);
      log(`  📂 ${this.contentDir}/cases/`, colors.yellow);
      log(`  📂 ${this.contentDir}/social-posts/`, colors.yellow);
      log(`  📄 ${this.contentDir}/backlink-opportunities.md`, colors.yellow);
      log(`  📄 ${this.contentDir}/marketing-calendar.md`, colors.yellow);

      log('\n🎯 后续执行建议:', colors.blue);
      log('1. 开始执行外链建设计划', colors.yellow);
      log('2. 按照营销日历定期发布内容', colors.yellow);
      log('3. 监控搜索引擎收录和排名情况', colors.yellow);
      log('4. 根据数据分析调整营销策略', colors.yellow);

      logSuccess('\n🎉 内容营销生成完成！');

      return results;

    } catch (error) {
      logError(`内容营销生成失败: ${error.message}`);
      throw error;
    }
  }
}

// 主函数
async function main() {
  const marketing = new ContentMarketing();
  await marketing.generate().catch(error => {
    logError(`脚本执行失败: ${error.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.ContentMarketing = ContentMarketing;