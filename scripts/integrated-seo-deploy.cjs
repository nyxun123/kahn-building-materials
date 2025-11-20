#!/usr/bin/env node

/**
 * 集成SEO主控技能 + 自动部署
 * 完成SEO优化后自动部署到生产环境
 */

const { SEOMasterSkill } = require('./seo-master-skill.cjs');
const { autoDeployAfterTask } = require('./smart-deploy-trigger.cjs');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class IntegratedSEODeploy {
  constructor() {
    this.seoMaster = new SEOMasterSkill();
    this.startTime = Date.now();
  }

  // 执行完整的SEO优化和部署流程
  async execute() {
    logHeader('🎯 集成SEO主控技能 + 自动部署');
    log('🎯 目标: SEO优化完成后自动部署到生产环境', colors.magenta);

    try {
      // 1. 解析命令行参数
      const args = process.argv.slice(2);
      this.seoMaster.parseArgs(args);

      // 2. 执行SEO优化
      log('📊 开始执行SEO主控技能...', colors.cyan);
      const seoResults = await this.seoMaster.execute();

      // 3. 检查是否需要部署
      log('🔍 检查是否需要部署变更...', colors.cyan);
      const needDeploy = await autoDeployAfterTask.checkDeploymentNeeded();

      if (needDeploy) {
        log('🚀 检测到SEO优化产生了文件变更，开始自动部署...', colors.cyan);

        // 4. 自动部署
        const deployResults = await autoDeployAfterTask(
          'SEO优化完成',
          `SEO分数: ${seoResults.monitoring?.report?.overallScore || 0}/100, 生成内容: ${(seoResults.contentMarketing?.blogPosts?.length || 0) + (seoResults.contentMarketing?.faqs?.length || 0)}个`
        );

        // 5. 显示完整总结
        this.showIntegratedSummary(seoResults, deployResults);

        return { seoResults, deployResults };
      } else {
        log('ℹ️  SEO优化完成，但没有需要部署的文件变更', colors.blue);
        return { seoResults, deployResults: null };
      }

    } catch (error) {
      log(`❌ 集成执行失败: ${error.message}`, colors.red);
      throw error;
    }
  }

  // 显示集成执行总结
  showIntegratedSummary(seoResults, deployResults) {
    logHeader('🎉 SEO优化 + 自动部署完成');

    // SEO优化总结
    log('📊 SEO优化成果:', colors.cyan);
    const successModules = Object.values(seoResults)
      .filter(result => result !== null && result !== seoResults.overall)
      .length;

    log(`  ✅ 成功执行模块: ${successModules} 个`);
    log(`  ✅ 执行时长: ${seoResults.overall.duration} 秒`);
    log(`  ✅ 错误数量: ${seoResults.overall.errors.length} 个`);

    // 显示关键成果
    if (seoResults.sitemap) {
      log(`  🗺️  Sitemap: ${seoResults.sitemap.stats?.totalUrls || 0} 个URL`);
    }
    if (seoResults.contentMarketing) {
      const contentCount = (seoResults.contentMarketing.blogPosts?.length || 0) +
                          (seoResults.contentMarketing.faqs?.length || 0);
      log(`  📝 营销内容: ${contentCount} 个`);
    }
    if (seoResults.monitoring) {
      log(`  📊 SEO分数: ${seoResults.monitoring.report?.overallScore || 0}/100`);
    }

    // 自动部署总结
    if (deployResults) {
      log('\n🚀 自动部署成果:', colors.cyan);
      log(`  ✅ 变更文件: ${deployResults.changes?.detectedFiles || 0} 个`);
      log(`  ✅ 提交Hash: ${deployResults.changes?.commitHash?.substring(0, 7) || 'N/A'}`);
      log(`  ✅ 部署状态: ${deployResults.deployment?.status || 'N/A'}`);
      log(`  ✅ 验证结果: ${deployResults.verification?.overall ? '通过' : '进行中'}`);
    }

    // 访问链接
    log('\n🌐 网站访问:', colors.blue);
    log(`  🔗 https://kn-wallpaperglue.com`);
    log(`  🗺️  https://kn-wallpaperglue.com/sitemap.xml`);

    // 下一步建议
    log('\n🔥 下一步建议:', colors.magenta);
    log('1. ✅ SEO优化已部署，搜索引擎会逐步收录');
    log('2. 📊 每周运行SEO监控检查效果');
    log('3. 📝 按照营销日历发布内容');
    log('4. 🔗 执行外链建设计划');

    // 预期效果
    log('\n🌟 预期效果:', colors.green);
    log('• 1-2周内: 搜索引擎开始收录网站');
    log('• 1个月内: 获得基础搜索排名');
    log('• 3个月内: 目标关键词进入前50名');
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    logHeader('🛠️  集成SEO部署技能使用说明');
    log('\n📋 基本用法:', colors.cyan);
    log('  node scripts/integrated-seo-deploy.cjs [SEO选项]', colors.blue);
    log('\n🎯 功能:', colors.cyan);
    log('  1. 执行完整的SEO主控技能', colors.green);
    log('  2. 自动检测文件变更', colors.green);
    log('  3. 自动提交和部署到生产环境', colors.green);
    log('  4. 自动验证部署结果', colors.green);
    log('  5. 生成综合执行报告', colors.green);
    log('\n📝 示例:', colors.cyan);
    log('  node scripts/integrated-seo-deploy.cjs --content-only', colors.blue);
    log('  node scripts/integrated-seo-deploy.cjs --monitoring-only', colors.blue);
    log('  node scripts/integrated-seo-deploy.cjs --submission-only', colors.blue);
    return;
  }

  const integratedDeploy = new IntegratedSEODeploy();
  await integratedDeploy.execute().catch(error => {
    log(`❌ 集成SEO部署失败: ${error.message}`, colors.red);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.IntegratedSEODeploy = IntegratedSEODeploy;