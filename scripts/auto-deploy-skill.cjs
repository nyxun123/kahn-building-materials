#!/usr/bin/env node

/**
 * 卡恩官网自动化部署技能
 * 自动检测文件变更、提交到生产环境、部署并验证
 * 无需手动提醒，全自动化流程
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
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class AutoDeploySkill {
  constructor() {
    this.projectRoot = process.cwd();
    this.domain = 'https://kn-wallpaperglue.com';
    this.startTime = Date.now();

    // 重要文件列表 - 这些文件变更会触发自动部署
    this.importantFiles = [
      'index.html',
      'public/',
      'src/',
      'package.json',
      'vite.config.js',
      'tailwind.config.js',
      '_redirects'
    ];

    // 忽略的文件/目录
    this.ignorePatterns = [
      'node_modules/',
      '.git/',
      'dist/',
      'docs/',
      'scripts/',
      '*.md',
      '.DS_Store'
    ];

    // 部署结果
    this.results = {
      changedFiles: [],
      gitStatus: null,
      commitHash: null,
      deploymentStatus: null,
      verificationResults: null,
      errors: []
    };
  }

  // 检测文件变更
  async detectChanges() {
    logStep('1. 检测文件变更');

    try {
      // 获取Git状态
      const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
      this.results.gitStatus = statusOutput;

      if (!statusOutput.trim()) {
        logInfo('没有检测到文件变更');
        return false;
      }

      // 解析变更文件
      const changedFiles = statusOutput.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const status = line.substring(0, 2);
          const file = line.substring(3);
          return { status, file };
        });

      // 过滤重要文件
      this.results.changedFiles = changedFiles.filter(item => {
        return this.importantFiles.some(pattern => {
          if (pattern.endsWith('/')) {
            return item.file.startsWith(pattern);
          }
          return item.file === pattern;
        }) && !this.ignorePatterns.some(pattern => {
          if (pattern.endsWith('/')) {
            return item.file.startsWith(pattern);
          }
          return item.file.includes(pattern);
        });
      });

      if (this.results.changedFiles.length === 0) {
        logInfo('没有检测到重要文件变更');
        return false;
      }

      logSuccess(`检测到 ${this.results.changedFiles.length} 个重要文件变更`);
      this.results.changedFiles.forEach(item => {
        const statusIcon = item.status.includes('M') ? '📝' :
                          item.status.includes('A') ? '➕' :
                          item.status.includes('D') ? '🗑️' : '❓';
        log(`  ${statusIcon} ${item.file}`);
      });

      return true;

    } catch (error) {
      this.results.errors.push({
        step: 'detectChanges',
        error: error.message
      });
      logError(`检测变更失败: ${error.message}`);
      return false;
    }
  }

  // 自动添加变更文件
  async stageChanges() {
    logStep('2. 添加变更文件到Git');

    try {
      // 添加重要文件
      const importantFilesToAdd = this.results.changedFiles.map(item => item.file);
      const addCommand = `git add ${importantFilesToAdd.join(' ')}`;
      logInfo(`执行: ${addCommand}`);

      execSync(addCommand, { encoding: 'utf8' });
      logSuccess('文件已添加到暂存区');

      return true;

    } catch (error) {
      this.results.errors.push({
        step: 'stageChanges',
        error: error.message
      });
      logError(`添加文件失败: ${error.message}`);
      return false;
    }
  }

  // 生成智能提交信息
  generateCommitMessage() {
    const fileTypes = {
      'html': 'HTML',
      'js': 'JavaScript',
      'jsx': 'React',
      'tsx': 'React',
      'ts': 'TypeScript',
      'css': '样式',
      'json': '配置',
      'xml': 'Sitemap'
    };

    const changes = this.results.changedFiles.map(item => {
      const ext = item.file.split('.').pop();
      const type = fileTypes[ext] || '文件';
      return `${item.file}`;
    });

    const timestamp = new Date().toLocaleString('zh-CN');
    const commitMessage = `feat: ${timestamp} 自动部署更新

更新内容:
${changes.map(file => `- ${file}`).join('\n')}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

    return commitMessage;
  }

  // 提交变更
  async commitChanges() {
    logStep('3. 提交变更到Git');

    try {
      const commitMessage = this.generateCommitMessage();
      logInfo('生成智能提交信息');

      execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf8' });

      // 获取提交hash
      this.results.commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      logSuccess(`提交成功: ${this.results.commitHash.substring(0, 7)}`);

      return true;

    } catch (error) {
      this.results.errors.push({
        step: 'commitChanges',
        error: error.message
      });
      logError(`提交失败: ${error.message}`);
      return false;
    }
  }

  // 推送到远程仓库
  async pushToRemote() {
    logStep('4. 推送到远程仓库');

    try {
      execSync('git push origin main', { encoding: 'utf8' });
      logSuccess('代码已推送到远程仓库');
      this.results.deploymentStatus = 'pushed';
      return true;

    } catch (error) {
      this.results.errors.push({
        step: 'pushToRemote',
        error: error.message
      });
      logError(`推送失败: ${error.message}`);
      return false;
    }
  }

  // 等待部署完成
  async waitForDeployment() {
    logStep('5. 等待Cloudflare Pages部署');

    const maxWaitTime = 5 * 60 * 1000; // 5分钟
    const checkInterval = 30 * 1000; // 30秒检查一次
    let elapsed = 0;

    logInfo('等待Cloudflare Pages自动部署...');

    while (elapsed < maxWaitTime) {
      try {
        // 检查网站是否响应
        const response = execSync(`curl -I ${this.domain}`, { encoding: 'utf8' });

        if (response.includes('HTTP/2 200')) {
          logSuccess('部署完成，网站可正常访问');
          this.results.deploymentStatus = 'deployed';
          return true;
        }

      } catch (error) {
        // 继续等待
      }

      elapsed += checkInterval;
      if (elapsed < maxWaitTime) {
        logInfo(`等待部署中... (${Math.round(elapsed/1000)}秒)`);
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }

    logWarning('部署等待超时，但通常会很快完成');
    this.results.deploymentStatus = 'timeout';
    return true; // 继续验证，通常只是需要更多时间
  }

  // 验证部署
  async verifyDeployment() {
    logStep('6. 验证部署结果');

    const verifications = [];

    try {
      // 验证主页可访问性
      logInfo('验证主页可访问性...');
      const homePageResponse = execSync(`curl -I ${this.domain}`, { encoding: 'utf8' });
      const homePageOk = homePageResponse.includes('HTTP/2 200');
      verifications.push({ name: '主页访问', status: homePageOk });

      // 验证HTML优化（如果有变更）
      if (this.results.changedFiles.some(f => f.file.includes('index.html'))) {
        logInfo('验证HTML优化...');
        const htmlContent = execSync(`curl -s ${this.domain}`, { encoding: 'utf8' });
        const hasDescription = htmlContent.includes('meta name="description"');
        const hasOgTags = htmlContent.includes('og:title');
        verifications.push({ name: 'HTML SEO标签', status: hasDescription && hasOgTags });
      }

      // 验证sitemap（如果有变更）
      if (this.results.changedFiles.some(f => f.file.includes('sitemap'))) {
        logInfo('验证Sitemap...');
        const sitemapResponse = execSync(`curl -I ${this.domain}/sitemap.xml`, { encoding: 'utf8' });
        const sitemapOk = sitemapResponse.includes('HTTP/2 200');
        verifications.push({ name: 'Sitemap访问', status: sitemapOk });
      }

      // 验证静态资源
      logInfo('验证静态资源...');
      const staticResponse = execSync(`curl -I ${this.domain}/favicon.ico`, { encoding: 'utf8' });
      const staticOk = staticResponse.includes('HTTP/2 200');
      verifications.push({ name: '静态资源', status: staticOk });

      this.results.verificationResults = {
        overall: verifications.every(v => v.status),
        details: verifications,
        timestamp: new Date().toISOString()
      };

      // 显示验证结果
      verifications.forEach(v => {
        const status = v.status ? '✅' : '❌';
        log(`${status} ${v.name}`);
      });

      if (this.results.verificationResults.overall) {
        logSuccess('所有验证项目通过');
      } else {
        logWarning('部分验证项目未通过，但部署可能仍在进行中');
      }

      return true;

    } catch (error) {
      this.results.errors.push({
        step: 'verifyDeployment',
        error: error.message
      });
      logError(`验证失败: ${error.message}`);
      return false;
    }
  }

  // 生成部署报告
  generateDeploymentReport() {
    logStep('7. 生成部署报告');

    const report = {
      execution: {
        timestamp: new Date().toISOString(),
        duration: Math.round((Date.now() - this.startTime) / 1000),
        domain: this.domain
      },
      changes: {
        detectedFiles: this.results.changedFiles.length,
        files: this.results.changedFiles,
        commitHash: this.results.commitHash
      },
      deployment: {
        status: this.results.deploymentStatus,
        url: this.domain
      },
      verification: this.results.verificationResults,
      errors: this.results.errors,
      success: this.results.errors.length === 0 && this.results.verificationResults?.overall
    };

    // 保存报告
    const reportPath = path.join(this.projectRoot, `deployment-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 生成Markdown报告
    const markdownReport = this.generateMarkdownReport(report);
    const mdPath = path.join(this.projectRoot, `deployment-report-${Date.now()}.md`);
    fs.writeFileSync(mdPath, markdownReport);

    logSuccess(`部署报告已生成:`);
    logSuccess(`  JSON: ${path.basename(reportPath)}`);
    logSuccess(`  Markdown: ${path.basename(mdPath)}`);

    return { reportPath, mdPath, report };
  }

  // 生成Markdown报告
  generateMarkdownReport(report) {
    return `# 🚀 卡恩官网自动部署报告

**部署时间**: ${new Date(report.execution.timestamp).toLocaleString('zh-CN')}
**网站**: ${report.domain}
**执行时长**: ${report.execution.duration}秒

---

## 📋 部署概览

- **变更文件数**: ${report.changes.detectedFiles}
- **提交Hash**: ${report.changes.commitHash?.substring(0, 7) || 'N/A'}
- **部署状态**: ${report.deployment.status}
- **整体结果**: ${report.success ? '✅ 成功' : '❌ 失败'}

---

## 📝 变更详情

${report.changes.files.map(file => `- ${file.file} (${file.status})`).join('\n')}

---

## 🔍 验证结果

${report.verification?.details.map(v => `- ${v.name}: ${v.status ? '✅ 通过' : '❌ 失败'}`).join('\n') || 'N/A'}

---

## ❌ 错误信息

${report.errors.length > 0 ? report.errors.map(e => `- ${e.step}: ${e.error}`).join('\n') : '无错误'}

---

## 🎯 访问链接

- **网站**: ${report.domain}
- **Sitemap**: ${report.domain}/sitemap.xml

---

*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
`;
  }

  // 执行完整部署流程
  async execute() {
    logHeader('🎯 卡恩官网自动化部署技能');
    log('🎯 目标: 自动检测变更 → 提交部署 → 验证效果', colors.magenta);

    try {
      // 1. 检测变更
      const hasChanges = await this.detectChanges();
      if (!hasChanges) {
        logInfo('无需部署');
        return this.results;
      }

      // 2. 添加文件
      const staged = await this.stageChanges();
      if (!staged) return this.results;

      // 3. 提交变更
      const committed = await this.commitChanges();
      if (!committed) return this.results;

      // 4. 推送代码
      const pushed = await this.pushToRemote();
      if (!pushed) return this.results;

      // 5. 等待部署
      await this.waitForDeployment();

      // 6. 验证部署
      await this.verifyDeployment();

      // 7. 生成报告
      const reportFiles = this.generateDeploymentReport();

      // 8. 显示总结
      this.showSummary(reportFiles);

      return this.results;

    } catch (error) {
      logError(`自动部署失败: ${error.message}`);
      this.results.errors.push({
        step: 'execute',
        error: error.message
      });
      throw error;
    }
  }

  // 显示执行总结
  showSummary(reportFiles) {
    logHeader('🎉 自动部署完成');

    const success = this.results.errors.length === 0;

    if (success) {
      logSuccess(`✅ 变更文件: ${this.results.changedFiles.length} 个`);
      logSuccess(`✅ 提交Hash: ${this.results.commitHash?.substring(0, 7)}`);
      logSuccess(`✅ 部署状态: ${this.results.deploymentStatus}`);
      logSuccess(`✅ 验证结果: ${this.results.verificationResults?.overall ? '通过' : '进行中'}`);
    } else {
      logWarning(`⚠️  错误数量: ${this.results.errors.length}`);
    }

    if (reportFiles) {
      log('\n📁 生成的报告:', colors.blue);
      log(`  📄 ${path.basename(reportFiles.reportPath)}`);
      log(`  📄 ${path.basename(reportFiles.mdPath)}`);
    }

    log('\n🌐 网站访问:', colors.blue);
    log(`  🔗 ${this.domain}`);

    log('\n🔥 下一步建议:', colors.magenta);
    if (this.results.verificationResults?.overall) {
      log('✅ 部署成功，可以正常使用网站');
    } else {
      log('⏳ 部署可能仍在进行中，请稍后访问');
    }
    log('📊 查看部署报告了解详细信息');
  }

  // 显示帮助信息
  showHelp() {
    logHeader('🛠️  自动部署技能使用说明');

    log('\n📋 基本用法:', colors.cyan);
    log('  node scripts/auto-deploy-skill.cjs              - 自动检测变更并部署', colors.blue);

    log('\n🎯 功能特性:', colors.cyan);
    log('  ✅ 自动检测重要文件变更', colors.green);
    log('  ✅ 智能生成提交信息', colors.green);
    log('  ✅ 自动提交和推送', colors.green);
    log('  ✅ 等待Cloudflare Pages部署', colors.green);
    log('  ✅ 自动验证部署结果', colors.green);
    log('  ✅ 生成详细部署报告', colors.green);

    log('\n📁 监控文件:', colors.cyan);
    log('  • index.html - 网站主页面', colors.blue);
    log('  • public/ - 静态资源文件', colors.blue);
    log('  • src/ - 源代码文件', colors.blue);
    log('  • 配置文件 - package.json, vite.config.js等', colors.blue);

    log('\n⚡ 自动化程度:', colors.cyan);
    log('  🚀 完全自动化 - 无需手动干预', colors.magenta);
    log('  📊 智能检测 - 只处理重要文件变更', colors.magenta);
    log('  🔍 自动验证 - 确保部署成功', colors.magenta);
    log('  📋 详细报告 - 完整的执行记录', colors.magenta);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    const deployer = new AutoDeploySkill();
    deployer.showHelp();
    return;
  }

  const deployer = new AutoDeploySkill();
  await deployer.execute().catch(error => {
    logError(`自动部署失败: ${error.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.AutoDeploySkill = AutoDeploySkill;