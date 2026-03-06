#!/usr/bin/env node

/**
 * 博客管理器技能
 * AI辅助写作、多语言翻译、SEO优化
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
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
  log(`✍️  ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class BlogManagerSkill {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.options = {
      ...options
    };
    this.results = {};
  }

  // AI生成文章
  async generate(topic, keywords, length) {
    logStep('AI 生成博客文章');

    logInfo(`主题: ${topic}`);
    logInfo(`关键词: ${keywords}`);
    logInfo(`长度: ${length} 字`);

    // 检查是否配置了 AI API
    const hasOpenAI = process.env.OPENAI_API_KEY;
    const hasClaude = process.env.ANTHROPIC_API_KEY;

    if (!hasOpenAI && !hasClaude) {
      logError('未配置 AI API');
      logInfo('请在环境变量中设置 OPENAI_API_KEY 或 ANTHROPIC_API_KEY');
      logInfo('\n提示: 您可以手动创建文章并保存到 content-marketing/blogs/ 目录');

      // 生成一个模板文章供用户参考
      return this.generateTemplateArticle(topic, keywords, length);
    }

    try {
      // 使用配置的 AI API
      const prompt = this.buildPrompt(topic, keywords, length);

      let content;
      if (hasOpenAI) {
        content = await this.callOpenAI(prompt);
      } else {
        content = await this.callClaude(prompt);
      }

      if (content) {
        logSuccess('文章生成成功');

        const article = this.parseArticle(content);

        // 保存文章
        const filePath = await this.saveArticle(article);

        logSuccess(`文章已保存: ${filePath}`);

        return {
          ...article,
          filePath
        };
      }
    } catch (error) {
      logError(`生成失败: ${error.message}`);
      return null;
    }
  }

  // 生成模板文章（当没有 AI API 时）
  generateTemplateArticle(topic, keywords, length) {
    logInfo('生成文章模板...');

    const slug = this.generateSlug(topic);
    const article = {
      title: topic,
      slug: slug,
      category: '墙纸胶知识',
      tags: keywords.split(/[,，]/).map(k => k.trim()),
      excerpt: `关于${topic}的详细指南，帮助您了解${keywords}的相关知识。`,
      content: this.generateTemplateContent(topic, keywords),
      seo: {
        meta_title: `${topic} - 卡恩墙纸胶`,
        meta_description: `详细了解${topic}，${keywords}。卡恩墙纸胶为您提供专业的墙纸胶产品和解决方案。`,
        keywords: keywords
      }
    };

    // 保存模板
    const filePath = this.saveArticleSync(article);

    logSuccess(`文章模板已保存: ${filePath}`);
    logInfo('请手动编辑文章内容以填充详细信息');

    return {
      ...article,
      filePath
    };
  }

  // 生成模板内容
  generateTemplateContent(topic, keywords) {
    return `# ${topic}

## 引言

${topic}是墙纸施工过程中的重要环节。本文将详细介绍相关知识和技巧。

## 什么是${topic.split(' ')[0]}？

${topic}是指...（这里需要详细说明）

## 为什么选择环保墙纸胶？

环保墙纸胶具有以下优势：

- **无毒无害**：不含有害物质，保护家人健康
- **粘性强**：粘贴牢固，不易脱落
- **施工方便**：操作简单，提高施工效率
- **适用性广**：适用于各种类型的墙纸

## 施工步骤

### 1. 准备工作

在施工前，需要准备好以下工具和材料：

- 墙纸胶
- 刮板
- 刷子
- 测量工具
- 裁纸刀

### 2. 墙面处理

确保墙面干净、平整、干燥。如有裂缝或孔洞，需要先修补。

### 3. 调配墙纸胶

按照产品说明书的要求，正确调配墙纸胶。

### 4. 涂胶

将墙纸胶均匀涂抹在墙纸背面。

### 5. 粘贴

从上往下粘贴，用刮板排出气泡。

## 常见问题

### Q1: 墙纸胶多久能干？

A: 一般情况下，墙纸胶在24小时内基本干燥，完全固化需要3-7天。

### Q2: 墙纸胶有毒吗？

A: 环保型墙纸胶采用环保配方，无毒无害。建议选择有环保认证的产品。

### Q3: 如何判断墙纸胶的质量？

A: 可以从以下几个方面判断：

1. 粘性强度
2. 环保认证
3. 品牌信誉
4. 用户评价

## 注意事项

1. 施工环境温度应在5-35℃之间
2. 保持室内通风
3. 避免阳光直射
4. 按照产品说明正确使用

## 结论

选择合适的${topic}对于保证墙纸施工质量至关重要。卡恩墙纸胶提供高品质的墙纸胶产品，是您的理想选择。

如需了解更多信息，请联系我们的专业团队。

---

## SEO Meta信息
- meta_title: ${topic} - 卡恩墙纸胶专业指南
- meta_description: 详细了解${topic}，${keywords}。卡恩墙纸胶为您提供专业的墙纸胶产品和解决方案。
- keywords: ${keywords}
`;
  }

  // 同步保存文章
  saveArticleSync(article) {
    const blogDir = path.join(this.projectRoot, 'content-marketing', 'blogs');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const fileName = `${article.slug || Date.now()}.md`;
    const filePath = path.join(blogDir, fileName);

    const content = this.formatArticle(article);

    fs.writeFileSync(filePath, content, 'utf8');

    return filePath;
  }

  // 构建 AI 提示词
  buildPrompt(topic, keywords, length) {
    return `请写一篇关于"${topic}"的专业博客文章。

要求:
1. 文章长度: ${length} 字
2. 关键词: ${keywords}
3. 结构: 标题 + 摘要 + 正文 + 结论
4. SEO优化: 包含关键词密度 2-3%
5. 语言: 专业但易懂
6. 格式: Markdown

请按照以下格式输出:

---
title: [文章标题]
slug: [URL友好名称]
category: [分类]
tags: [标签1, 标签2, 标签3]
excerpt: [摘要]
---

[文章正文内容]

## SEO Meta信息
- meta_title: [SEO标题]
- meta_description: [SEO描述]
- keywords: ${keywords}
`;
  }

  // 调用 OpenAI API
  async callOpenAI(prompt) {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是一位专业的SEO内容创作者，擅长撰写技术博客文章。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  }

  // 调用 Claude API
  async callClaude(prompt) {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    return message.content[0].text;
  }

  // 解析文章内容
  parseArticle(content) {
    const parts = content.split('---');

    const frontmatter = parts[1].trim().split('\n').reduce((acc, line) => {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      if (key && value) {
        acc[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
      return acc;
    }, {});

    const body = parts.slice(2).join('---').trim();

    // 提取 SEO 信息
    const seoMatch = body.match(/## SEO Meta信息\n([\s\S]+?)(?=\n\n|$)/);
    let seo = {};
    if (seoMatch) {
      const seoText = seoMatch[1];
      seo.meta_title = seoText.match(/meta_title: (.+)/)?.[1];
      seo.meta_description = seoText.match(/meta_description: (.+)/)?.[1];
      seo.keywords = seoText.match(/keywords: (.+)/)?.[1];
    }

    return {
      title: frontmatter.title || '未命名文章',
      slug: frontmatter.slug || this.generateSlug(frontmatter.title),
      category: frontmatter.category || 'uncategorized',
      tags: frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : [],
      excerpt: frontmatter.excerpt || '',
      content: body.replace(/## SEO Meta信息[\s\S]+/, '').trim(),
      seo
    };
  }

  // 生成 URL 友好的 slug
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }

  // 保存文章
  async saveArticle(article) {
    return this.saveArticleSync(article);
  }

  // 格式化文章为 Markdown
  formatArticle(article) {
    return `---
title: ${article.title}
slug: ${article.slug}
category: ${article.category}
tags: [${article.tags.join(', ')}]
excerpt: ${article.excerpt}
${article.seo?.meta_title ? `meta_title: ${article.seo.meta_title}` : ''}
${article.seo?.meta_description ? `meta_description: ${article.seo.meta_description}` : ''}
${article.seo?.keywords ? `keywords: ${article.seo.keywords}` : ''}
---

${article.content}
`;
  }

  // 翻译文章
  async translate(articleId, targetLanguages) {
    logStep('翻译博客文章');

    logInfo(`文章ID: ${articleId}`);
    logInfo(`目标语言: ${targetLanguages.join(', ')}`);

    // 查找文章
    const article = await this.findArticle(articleId);
    if (!article) {
      logError('文章不存在');
      return null;
    }

    const translations = [];

    for (const lang of targetLanguages) {
      logInfo(`翻译为: ${lang}`);

      try {
        const translatedContent = await this.translateContent(article.content, lang);
        const translatedTitle = await this.translateContent(article.title, lang);

        translations.push({
          language: lang,
          title: translatedTitle,
          content: translatedContent
        });

        logSuccess(`${lang} 翻译完成`);
      } catch (error) {
        logError(`${lang} 翻译失败: ${error.message}`);
      }
    }

    return translations;
  }

  // 查找文章
  async findArticle(articleId) {
    const blogDir = path.join(this.projectRoot, 'content-marketing', 'blogs');
    if (!fs.existsSync(blogDir)) {
      return null;
    }

    const files = fs.readdirSync(blogDir);
    const articleFile = files.find(f => f.startsWith(articleId.toString()));

    if (!articleFile) {
      return null;
    }

    const content = fs.readFileSync(path.join(blogDir, articleFile), 'utf8');
    return this.parseArticle(content);
  }

  // 翻译内容
  async translateContent(content, targetLang) {
    // 这里可以集成 Google Translate API 或其他翻译服务
    // 暂时返回占位符
    logWarning('翻译功能需要配置翻译API (Google Translate / DeepL)');
    return `[${targetLang.toUpperCase()}] ${content}`;
  }

  // SEO 检查
  async seoCheck(articleId) {
    logStep('SEO 检查');

    const article = await this.findArticle(articleId);
    if (!article) {
      logError('文章不存在');
      return null;
    }

    const issues = [];
    const score = { total: 100, deducted: 0 };

    // 1. 标题长度检查
    if (article.title.length < 30) {
      issues.push({
        type: 'title',
        severity: 'warning',
        message: '标题过短，建议30-60字符',
        impact: 5
      });
      score.deducted += 5;
    } else if (article.title.length > 60) {
      issues.push({
        type: 'title',
        severity: 'warning',
        message: '标题过长，建议30-60字符',
        impact: 5
      });
      score.deducted += 5;
    }

    // 2. 摘要检查
    if (article.excerpt.length < 120) {
      issues.push({
        type: 'excerpt',
        severity: 'warning',
        message: '摘要过短，建议120-160字符',
        impact: 10
      });
      score.deducted += 10;
    }

    // 3. 关键词密度检查
    const keywordDensity = this.calculateKeywordDensity(article.content, article.seo?.keywords);
    if (keywordDensity < 0.02) {
      issues.push({
        type: 'keywords',
        severity: 'warning',
        message: `关键词密度过低 (${(keywordDensity * 100).toFixed(2)}%)，建议2-3%`,
        impact: 15
      });
      score.deducted += 15;
    } else if (keywordDensity > 0.03) {
      issues.push({
        type: 'keywords',
        severity: 'warning',
        message: `关键词密度过高 (${(keywordDensity * 100).toFixed(2)}%)，建议2-3%`,
        impact: 10
      });
      score.deducted += 10;
    }

    // 4. 内容长度检查
    const wordCount = article.content.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push({
        type: 'length',
        severity: 'error',
        message: `文章过短 (${wordCount}词)，建议至少300词`,
        impact: 20
      });
      score.deducted += 20;
    }

    // 5. 标题结构检查
    const headingStructure = this.analyzeHeadings(article.content);
    if (!headingStructure.hasH1) {
      issues.push({
        type: 'structure',
        severity: 'error',
        message: '缺少 H1 标题',
        impact: 15
      });
      score.deducted += 15;
    }

    score.total = 100 - score.deducted;

    log('\n📊 SEO 评分:', colors.cyan);
    log(`  得分: ${score.total}/100`, score.total >= 80 ? colors.green : score.total >= 60 ? colors.yellow : colors.red);

    if (issues.length > 0) {
      log('\n⚠️  发现问题:', colors.yellow);
      issues.forEach(issue => {
        log(`  [${issue.severity}] ${issue.type}: ${issue.message}`);
      });
    } else {
      logSuccess('SEO 检查通过！');
    }

    return {
      score,
      issues,
      keywordDensity,
      wordCount,
      headingStructure
    };
  }

  // 计算关键词密度
  calculateKeywordDensity(content, keywords) {
    if (!keywords) return 0;

    const words = content.toLowerCase().split(/\s+/);
    const keywordList = keywords.toLowerCase().split(/[,，]/);

    let keywordCount = 0;
    keywordList.forEach(keyword => {
      const regex = new RegExp(keyword.trim(), 'gi');
      const matches = content.match(regex);
      if (matches) {
        keywordCount += matches.length;
      }
    });

    return keywordCount / words.length;
  }

  // 分析标题结构
  analyzeHeadings(content) {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    const hasH1 = headings.some(h => h.startsWith('# '));
    const hasH2 = headings.some(h => h.startsWith('## '));
    const hasH3 = headings.some(h => h.startsWith('### '));

    return {
      total: headings.length,
      hasH1,
      hasH2,
      hasH3
    };
  }

  // 生成内容日历
  async calendar(month, frequency) {
    logStep('生成内容日历');

    const year = new Date().getFullYear();
    const monthNum = month ? parseInt(month.split('-')[1]) : new Date().getMonth() + 1;

    logInfo(`月份: ${year}-${monthNum.toString().padStart(2, '0')}`);
    logInfo(`频率: ${frequency || 'weekly'}`);

    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const calendar = [];

    const topics = await this.suggestTopics();

    let topicIndex = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day);
      const dayOfWeek = date.getDay();

      // 根据频率决定是否发布
      let shouldPublish = false;
      switch (frequency) {
        case 'daily':
          shouldPublish = true;
          break;
        case 'weekly':
          shouldPublish = dayOfWeek === 2; // 周二
          break;
        case 'biweekly':
          shouldPublish = dayOfWeek === 2 || dayOfWeek === 5; // 周二和周五
          break;
      }

      if (shouldPublish && topicIndex < topics.length) {
        calendar.push({
          date: `${year}-${monthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          topic: topics[topicIndex],
          status: 'planned'
        });
        topicIndex++;
      }
    }

    logSuccess(`生成 ${calendar.length} 篇文章计划`);

    return calendar;
  }

  // 建议文章主题
  async suggestTopics() {
    // 这里可以集成 AI API 生成主题建议
    return [
      '环保墙纸胶的优势和选择',
      '墙纸胶施工技巧和注意事项',
      '不同类型墙纸胶的对比',
      '墙纸胶常见问题解决方法',
      '墙纸胶的发展趋势和创新',
      '如何正确储存墙纸胶',
      '墙纸胶环保认证标准解读',
      '墙纸胶在特殊环境中的应用'
    ];
  }
}

// CLI 接口
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'generate';

  const options = {
    topic: args.includes('--topic') ? args[args.indexOf('--topic') + 1] : '墙纸胶使用技巧',
    keywords: args.includes('--keywords') ? args[args.indexOf('--keywords') + 1] : '墙纸胶,施工,技巧',
    length: args.includes('--length') ? parseInt(args[args.indexOf('--length') + 1]) : 1500,
    articleId: args.includes('--article-id') ? args[args.indexOf('--article-id') + 1] : null,
    targetLanguages: args.includes('--target-languages') ? args[args.indexOf('--target-languages') + 1].split(',') : ['en', 'ru'],
    month: args.includes('--month') ? args[args.indexOf('--month') + 1] : null,
    frequency: args.includes('--frequency') ? args[args.indexOf('--frequency') + 1] : 'weekly'
  };

  const skill = new BlogManagerSkill(options);

  try {
    switch (command) {
      case 'generate':
        await skill.generate(options.topic, options.keywords, options.length);
        break;

      case 'translate':
        if (!options.articleId) {
          logError('请指定文章ID: --article-id <id>');
          process.exit(1);
        }
        await skill.translate(options.articleId, options.targetLanguages);
        break;

      case 'seo-check':
        if (!options.articleId) {
          logError('请指定文章ID: --article-id <id>');
          process.exit(1);
        }
        await skill.seoCheck(options.articleId);
        break;

      case 'calendar':
        await skill.calendar(options.month, options.frequency);
        break;

      default:
        logError(`未知命令: ${command}`);
        log('\n可用命令:');
        log('  generate --topic <topic> --keywords <keywords> --length <words>');
        log('  translate --article-id <id> --target-languages <langs>');
        log('  seo-check --article-id <id>');
        log('  calendar --month <month> --frequency <freq>');
        break;
    }
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出
export { BlogManagerSkill };

// 如果直接运行
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  main();
}
