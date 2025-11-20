#!/usr/bin/env node

/**
 * SEO主控技能脚本
 * 统一管理所有SEO相关功能：收录、监控、内容营销、报告
 * 让Google、Yandex、Bing都能快速收录和优化网站
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 导入SEO相关模块
const { SEOSubmission } = require('./seo-submission.cjs');
const { SitemapGenerator } = require('./sitemap-generator.cjs');
const { ContentMarketing } = require('./content-marketing.cjs');
const { SEOMonitor } = require('./seo-monitor.cjs');

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
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class SEOMasterSkill {
  constructor() {
    this.domain = 'https://kn-wallpaperglue.com';
    this.projectRoot = process.cwd();
    this.startTime = Date.now();

    // 初始化各个模块
    this.submission = new SEOSubmission();
    this.sitemapGenerator = new SitemapGenerator();
    this.contentMarketing = new ContentMarketing();
    this.monitor = new SEOMonitor();

    // 配置选项
    this.options = {
      runSitemap: true,
      runSubmission: true,
      runContentMarketing: true,
      runMonitoring: true,
      generateReport: true,
      skipIfNoChanges: false
    };

    // 结果存储
    this.results = {
      sitemap: null,
      submission: null,
      contentMarketing: null,
      monitoring: null,
      overall: {
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0,
        success: false,
        errors: []
      }
    };
  }

  // 解析命令行参数
  parseArgs(args) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case '--skip-sitemap':
          this.options.runSitemap = false;
          break;
        case '--skip-submission':
          this.options.runSubmission = false;
          break;
        case '--skip-content':
          this.options.runContentMarketing = false;
          break;
        case '--skip-monitoring':
          this.options.runMonitoring = false;
          break;
        case '--skip-report':
          this.options.generateReport = false;
          break;
        case '--monitoring-only':
          this.options.runSitemap = false;
          this.options.runSubmission = false;
          this.options.runContentMarketing = false;
          break;
        case '--submission-only':
          this.options.runSitemap = true;
          this.options.runSubmission = true;
          this.options.runContentMarketing = false;
          this.options.runMonitoring = false;
          break;
        case '--content-only':
          this.options.runSitemap = false;
          this.options.runSubmission = false;
          this.options.runContentMarketing = true;
          this.options.runMonitoring = false;
          break;
        case '--force':
          this.options.skipIfNoChanges = false;
          break;
        case '--help':
        case '-h':
          this.showHelp();
          process.exit(0);
          break;
        default:
          if (!arg.startsWith('--')) {
            logWarning(`未知参数: ${arg}`);
          }
          break;
      }
    }
  }

  // 显示帮助信息
  showHelp() {
    logHeader('🛠️  SEO主控技能使用说明');

    log('\n📋 基本用法:', colors.cyan);
    log('  node scripts/seo-master-skill.js [选项]', colors.blue);

    log('\n🎯 主要命令:', colors.cyan);
    log('  node scripts/seo-master-skill.js              - 完整SEO流程（默认）', colors.blue);
    log('  node scripts/seo-master-skill.js --monitoring-only  - 仅SEO监控', colors.blue);
    log('  node scripts/seo-master-skill.js --submission-only  - 仅sitemap生成和提交', colors.blue);
    log('  node scripts/seo-master-skill.js --content-only     - 仅内容营销生成', colors.blue);

    log('\n⚙️  选项:', colors.cyan);
    log('  --skip-sitemap       跳过sitemap生成', colors.blue);
    log('  --skip-submission    跳过搜索引擎提交', colors.blue);
    log('  --skip-content       跳过内容营销生成', colors.blue);
    log('  --skip-monitoring    跳过SEO监控', colors.blue);
    log('  --skip-report        跳过报告生成', colors.blue);
    log('  --force              强制执行所有步骤', colors.blue);
    log('  -h, --help           显示此帮助信息', colors.blue);

    log('\n🔧 单独模块调用:', colors.cyan);
    log('  node scripts/seo-submission.cjs     - 搜索引擎提交', colors.blue);
    log('  node scripts/sitemap-generator.cjs   - Sitemap生成', colors.blue);
    log('  node scripts/content-marketing.cjs   - 内容营销生成', colors.blue);
    log('  node scripts/seo-monitor.cjs         - SEO监控分析', colors.blue);
    log('  node scripts/clear-cache.cjs          - 缓存清理', colors.blue);
  }

  // 显示配置信息
  showConfiguration() {
    logHeader('📊 SEO主控技能配置');
    log(`🌐 目标网站: ${this.domain}`, colors.blue);
    log(`📁 项目路径: ${this.projectRoot}`, colors.blue);
    log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);

    log('\n🎯 执行模块:', colors.cyan);
    log(`  Sitemap生成: ${this.options.runSitemap ? '✅' : '❌'}`, colors[this.options.runSitemap ? 'green' : 'red']);
    log(`  搜索引擎提交: ${this.options.runSubmission ? '✅' : '❌'}`, colors[this.options.runSubmission ? 'green' : 'red']);
    log(`  内容营销生成: ${this.options.runContentMarketing ? '✅' : '❌'}`, colors[this.options.runContentMarketing ? 'green' : 'red']);
    log(`  SEO监控分析: ${this.options.runMonitoring ? '✅' : '❌'}`, colors[this.options.runMonitoring ? 'green' : 'red']);
    log(`  报告生成: ${this.options.generateReport ? '✅' : '❌'}`, colors[this.options.generateReport ? 'green' : 'red']);
  }

  // 执行Sitemap生成
  async runSitemapGeneration() {
    if (!this.options.runSitemap) {
      logInfo('跳过Sitemap生成');
      return null;
    }

    logStep('1. Sitemap生成和优化');

    try {
      this.results.sitemap = await this.sitemapGenerator.generate();
      logSuccess('Sitemap生成完成');
      return this.results.sitemap;
    } catch (error) {
      this.results.overall.errors.push({
        module: 'sitemap',
        error: error.message
      });
      logError(`Sitemap生成失败: ${error.message}`);
      return null;
    }
  }

  // 执行搜索引擎提交
  async runSearchEngineSubmission() {
    if (!this.options.runSubmission) {
      logInfo('跳过搜索引擎提交');
      return null;
    }

    logStep('2. 搜索引擎提交和验证');

    try {
      this.results.submission = await this.submission.submit();
      logSuccess('搜索引擎提交完成');
      return this.results.submission;
    } catch (error) {
      this.results.overall.errors.push({
        module: 'submission',
        error: error.message
      });
      logError(`搜索引擎提交失败: ${error.message}`);
      return null;
    }
  }

  // 执行内容营销生成
  async runContentMarketingGeneration() {
    if (!this.options.runContentMarketing) {
      logInfo('跳过内容营销生成');
      return null;
    }

    logStep('3. 内容营销策略生成');

    try {
      this.results.contentMarketing = await this.contentMarketing.generate();
      logSuccess('内容营销生成完成');
      return this.results.contentMarketing;
    } catch (error) {
      this.results.overall.errors.push({
        module: 'contentMarketing',
        error: error.message
      });
      logError(`内容营销生成失败: ${error.message}`);
      return null;
    }
  }

  // 执行SEO监控
  async runSEOMonitoring() {
    if (!this.options.runMonitoring) {
      logInfo('跳过SEO监控');
      return null;
    }

    logStep('4. SEO监控和性能分析');

    try {
      this.results.monitoring = await this.monitor.monitor();
      logSuccess('SEO监控分析完成');
      return this.results.monitoring;
    } catch (error) {
      this.results.overall.errors.push({
        module: 'monitoring',
        error: error.message
      });
      logError(`SEO监控失败: ${error.message}`);
      return null;
    }
  }

  // 生成综合报告
  generateComprehensiveReport() {
    if (!this.options.generateReport) {
      logInfo('跳过报告生成');
      return null;
    }

    logStep('5. 生成综合SEO报告');

    try {
      const report = {
        execution: this.results.overall,
        modules: {
          sitemap: this.results.sitemap ? {
            status: 'success',
            files: Object.keys(this.results.sitemap).length,
            summary: {
              totalUrls: this.results.sitemap.stats?.totalUrls || 0,
              languages: Object.keys(this.results.sitemap.stats?.languages || {}).length
            }
          } : { status: 'skipped' },

          submission: this.results.submission ? {
            status: 'success',
            summary: {
              accessibleUrls: this.results.submission.websiteAccessibility?.filter(r => r.accessible).length || 0,
              totalUrls: this.results.submission.websiteAccessibility?.length || 0,
              searchEngines: 3 // Google, Bing, Yandex
            }
          } : { status: 'skipped' },

          contentMarketing: this.results.contentMarketing ? {
            status: 'success',
            summary: {
              blogPosts: this.results.contentMarketing.blogPosts?.length || 0,
              faqs: this.results.contentMarketing.faqs?.length || 0,
              caseStudies: this.results.contentMarketing.caseStudies?.length || 0,
              socialPosts: this.results.contentMarketing.socialPosts?.length || 0
            }
          } : { status: 'skipped' },

          monitoring: this.results.monitoring ? {
            status: 'success',
            summary: {
              overallScore: this.results.monitoring.report?.overallScore || 0,
              accessibility: this.results.monitoring.accessibility?.summary?.accessibilityRate || 0,
              performance: Math.round(this.results.monitoring.performance?.averageTime || 0),
              mobile: this.results.monitoring.mobile?.score || 0
            }
          } : { status: 'skipped' }
        },

        recommendations: this.generateOverallRecommendations(),
        nextSteps: this.generateOverallNextSteps(),
        insights: this.generateKeyInsights()
      };

      // 保存JSON报告
      const reportPath = path.join(this.projectRoot, `seo-master-report-${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

      // 生成Markdown报告
      const markdownReport = this.generateMarkdownReport(report);
      const mdPath = path.join(this.projectRoot, `seo-master-report-${Date.now()}.md`);
      fs.writeFileSync(mdPath, markdownReport);

      logSuccess(`综合SEO报告已生成:`);
      logSuccess(`  JSON: ${path.basename(reportPath)}`);
      logSuccess(`  Markdown: ${path.basename(mdPath)}`);

      return { jsonPath: reportPath, mdPath, report };
    } catch (error) {
      logError(`报告生成失败: ${error.message}`);
      return null;
    }
  }

  // 生成总体建议
  generateOverallRecommendations() {
    const recommendations = [];

    // 基于各个模块的结果生成建议
    if (this.results.monitoring && this.results.monitoring.report?.overallScore < 80) {
      recommendations.push({
        priority: 'high',
        category: 'Performance',
        title: 'SEO整体分数需要提升',
        description: '当前SEO分数低于80分，需要重点优化网站性能和SEO元素',
        actionItems: [
          '优化页面加载速度',
          '改进移动端友好性',
          '完善SEO元素配置'
        ]
      });
    }

    if (this.results.submission) {
      recommendations.push({
        priority: 'medium',
        category: 'Indexing',
        title: '持续监控搜索引擎收录状态',
        description: '网站已提交到搜索引擎，需要定期检查收录情况',
        actionItems: [
          '每周检查Google Search Console',
          '监控Bing Webmaster Tools',
          '验证Yandex Webmaster收录'
        ]
      });
    }

    if (this.results.contentMarketing) {
      recommendations.push({
        priority: 'medium',
        category: 'Content',
        title: '开始执行内容营销计划',
        description: '已生成丰富的营销内容，需要开始执行推广策略',
        actionItems: [
          '发布博客文章到内容平台',
          '在问答平台建立专业形象',
          '执行外链建设计划'
        ]
      });
    }

    return recommendations;
  }

  // 生成下一步行动
  generateOverallNextSteps() {
    const nextSteps = [
      {
        timeframe: 'Immediate (1-3 days)',
        actions: [
          '检查搜索控制台验证状态',
          '监控网站可访问性',
          '开始执行关键SEO优化建议'
        ]
      },
      {
        timeframe: 'Short term (1-2 weeks)',
        actions: [
          '定期发布内容营销材料',
          '监控搜索引擎收录情况',
          '优化页面性能问题'
        ]
      },
      {
        timeframe: 'Medium term (1 month)',
        actions: [
          '评估SEO改进效果',
          '扩展内容营销渠道',
          '建立行业外链关系'
        ]
      },
      {
        timeframe: 'Long term (3+ months)',
        actions: [
          '持续监控和优化SEO策略',
          '建立品牌权威性',
          '扩展目标关键词覆盖'
        ]
      }
    ];

    return nextSteps;
  }

  // 生成关键洞察
  generateKeyInsights() {
    const insights = [];

    if (this.results.monitoring) {
      const score = this.results.monitoring.report?.overallScore || 0;
      insights.push({
        category: 'SEO Performance',
        insight: `当前SEO分数为 ${score}/100，${score >= 80 ? '表现优秀' : score >= 60 ? '有改进空间' : '需要重点优化'}`,
        impact: score >= 80 ? 'positive' : score >= 60 ? 'neutral' : 'negative'
      });
    }

    if (this.results.sitemap) {
      const urlCount = this.results.sitemap.stats?.totalUrls || 0;
      insights.push({
        category: 'Site Structure',
        insight: `网站sitemap包含 ${urlCount} 个URL，为搜索引擎提供了完整的网站结构`,
        impact: 'positive'
      });
    }

    insights.push({
      category: 'Multi-Engine Strategy',
      insight: '已向Google、Bing、Yandex三大搜索引擎提交网站，最大化搜索曝光机会',
      impact: 'positive'
    });

    return insights;
  }

  // 生成Markdown报告
  generateMarkdownReport(report) {
    let markdown = `# 🚀 SEO主控技能执行报告

**网站**: ${this.domain}
**执行时间**: ${new Date(report.execution.startTime).toLocaleString('zh-CN')}
**执行时长**: ${report.execution.duration}秒

---

## 📊 总体执行结果

| 模块 | 状态 | 结果 |
|------|------|------|
| Sitemap生成 | ${report.modules.sitemap.status} | ${report.modules.sitemap.status === 'success' ? `${report.modules.sitemap.summary.totalUrls} 个URL` : '跳过'} |
| 搜索引擎提交 | ${report.modules.submission.status} | ${report.modules.submission.status === 'success' ? `${report.modules.submission.summary.accessibleUrls}/${report.modules.submission.summary.totalUrls} 页面可访问` : '跳过'} |
| 内容营销生成 | ${report.modules.contentMarketing.status} | ${report.modules.contentMarketing.status === 'success' ? `${report.modules.contentMarketing.summary.blogPosts} 篇博客` : '跳过'} |
| SEO监控分析 | ${report.modules.monitoring.status} | ${report.modules.monitoring.status === 'success' ? `SEO分数 ${report.modules.monitoring.summary.overallScore}/100` : '跳过'} |

`;

    if (report.modules.monitoring.status === 'success') {
      markdown += `
## 🔍 SEO监控详情

### 总体分数
**SEO分数**: ${report.modules.monitoring.summary.overallScore}/100

### 性能指标
- **网站可访问率**: ${report.modules.monitoring.summary.accessibility.toFixed(1)}%
- **平均响应时间**: ${report.modules.monitoring.summary.performance}ms
- **移动端友好性**: ${report.modules.monitoring.summary.mobile}/100

`;
    }

    markdown += `
## 🎯 关键洞察

`;

    report.insights.forEach((insight, index) => {
      const icon = insight.impact === 'positive' ? '✅' : insight.impact === 'negative' ? '❌' : 'ℹ️';
      markdown += `${index + 1}. ${icon} **${insight.category}**: ${insight.insight}\n\n`;
    });

    markdown += `
## 💡 优化建议

`;

    report.recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      markdown += `### ${index + 1}. ${priorityIcon} ${rec.title} (${rec.category})\n\n`;
      markdown += `${rec.description}\n\n`;
      markdown += `**行动项目**:\n`;
      rec.actionItems.forEach(item => {
        markdown += `- [ ] ${item}\n`;
      });
      markdown += `\n\n`;
    });

    markdown += `
## 📅 下一步行动计划

`;

    report.nextSteps.forEach((step, index) => {
      markdown += `### ${index + 1}. ${step.timeframe}\n\n`;
      step.actions.forEach(action => {
        markdown += `- [ ] ${action}\n`;
      });
      markdown += `\n\n`;
    });

    markdown += `
## 📊 执行统计

- **成功执行的模块**: ${Object.values(report.modules).filter(m => m.status === 'success').length}/${Object.keys(report.modules).length}
- **错误数量**: ${report.execution.errors.length}
- **总执行时间**: ${report.execution.duration}秒

---

*此报告由SEO主控技能自动生成 - ${new Date().toLocaleString('zh-CN')}*
`;

    return markdown;
  }

  // 完整的SEO主控流程
  async execute() {
    logHeader('🎯 SEO主控技能 - 全方位搜索引擎优化系统');
    log(`🎯 目标: 让Google、Yandex、Bing都能快速收录和优化网站`, colors.magenta);

    try {
      // 1. 显示配置
      this.showConfiguration();

      // 2. 执行各个SEO模块
      await this.runSitemapGeneration();
      await this.runSearchEngineSubmission();
      await this.runContentMarketingGeneration();
      await this.runSEOMonitoring();

      // 3. 生成综合报告
      const reportFiles = this.generateComprehensiveReport();

      // 4. 更新执行结果
      const endTime = Date.now();
      this.results.overall.endTime = new Date().toISOString();
      this.results.overall.duration = Math.round((endTime - this.startTime) / 1000);
      this.results.overall.success = this.results.overall.errors.length === 0;

      // 5. 显示最终总结
      logHeader('🎉 SEO主控技能执行完成');

      const successModules = Object.values(this.results)
        .filter(result => result !== null && result !== this.results.overall)
        .length;

      logSuccess(`✅ 成功执行模块: ${successModules} 个`);
      logSuccess(`✅ 执行时长: ${this.results.overall.duration} 秒`);
      logSuccess(`✅ 错误数量: ${this.results.overall.errors.length} 个`);

      if (reportFiles) {
        log('\n📁 生成的报告:', colors.blue);
        log(`  📄 ${path.basename(reportFiles.jsonPath)}`);
        log(`  📄 ${path.basename(reportFiles.mdPath)}`);
      }

      log('\n🎯 关键成果:', colors.blue);
      if (this.results.sitemap) {
        log(`  🗺️  Sitemap: ${this.results.sitemap.stats?.totalUrls || 0} 个URL`);
      }
      if (this.results.contentMarketing) {
        log(`  📝 营销内容: ${(this.results.contentMarketing.blogPosts?.length || 0) + (this.results.contentMarketing.faqs?.length || 0)} 个`);
      }
      if (this.results.monitoring) {
        log(`  📊 SEO分数: ${this.results.monitoring.report?.overallScore || 0}/100`);
      }

      log('\n🔥 立即开始行动:', colors.magenta);
      log('1. 完成搜索引擎控制台验证', colors.yellow);
      log('2. 开始发布营销内容', colors.yellow);
      log('3. 监控网站收录状态', colors.yellow);
      log('4. 每周运行SEO监控', colors.yellow);

      log('\n🌟 成功预期:', colors.green);
      log('• 1-2周内: 搜索引擎开始收录网站', colors.green);
      log('• 1个月内: 获得基础搜索排名', colors.green);
      log('• 3个月内: 目标关键词进入前50名', colors.green);

      return this.results;

    } catch (error) {
      logError(`SEO主控技能执行失败: ${error.message}`);
      this.results.overall.errors.push({
        module: 'master',
        error: error.message
      });
      throw error;
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const master = new SEOMasterSkill();
  master.parseArgs(args);
  await master.execute().catch(error => {
    logError(`脚本执行失败: ${error.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.SEOMasterSkill = SEOMasterSkill;