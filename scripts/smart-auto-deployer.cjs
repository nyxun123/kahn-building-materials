#!/usr/bin/env node

/**
 * 智能自动部署器 - Cursor级别的完全自动化
 * 无需任何人工干预，自动处理所有部署流程
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

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

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logStep(step) {
  log(`🚀 ${step}`, colors.cyan);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

class SmartAutoDeployer {
  constructor() {
    this.projectName = 'kahn-building-materials';
    this.domain = 'https://kn-wallpaperglue.com';
    this.githubToken = process.env.GITHUB_TOKEN || this.getGitHubToken();
    this.cloudflareToken = process.env.CF_API_TOKEN || this.getCloudflareToken();
    this.accountId = process.env.CF_ACCOUNT_ID || this.getAccountId();
    this.timestamp = new Date().toISOString();
    this.deploymentTriggered = false;
  }

  // 尝试从配置文件获取GitHub Token
  getGitHubToken() {
    try {
      // 尝试从多个常见位置获取
      const possiblePaths = [
        path.join(process.env.HOME, '.github', 'token'),
        path.join(process.cwd(), '.github-token'),
        path.join(process.cwd(), '.config', 'github-token')
      ];

      for (const tokenPath of possiblePaths) {
        if (fs.existsSync(tokenPath)) {
          return fs.readFileSync(tokenPath, 'utf8').trim();
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // 尝试获取Cloudflare Token
  getCloudflareToken() {
    try {
      const possiblePaths = [
        path.join(process.env.HOME, '.cloudflare', 'api-token'),
        path.join(process.cwd(), '.cf-token'),
        path.join(process.cwd(), '.config', 'cloudflare-token')
      ];

      for (const tokenPath of possiblePaths) {
        if (fs.existsSync(tokenPath)) {
          return fs.readFileSync(tokenPath, 'utf8').trim();
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // 尝试获取Account ID
  getAccountId() {
    try {
      // 从环境变量或配置文件获取
      if (process.env.CF_ACCOUNT_ID) {
        return process.env.CF_ACCOUNT_ID;
      }

      // 尝试从wrangler.toml读取
      const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
      if (fs.existsSync(wranglerPath)) {
        const content = fs.readFileSync(wranglerPath, 'utf8');
        const match = content.match(/account_id\s*=\s*["']([^"']+)["']/);
        if (match) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // 检测重要文件变更
  detectChanges() {
    logStep('检测文件变更');

    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const changedFiles = status.split('\n').filter(line => line.trim());

      if (changedFiles.length === 0) {
        logInfo('没有检测到文件变更');
        return { hasChanges: false, files: [] };
      }

      // 重要文件模式
      const importantPatterns = [
        /^index\.html$/,
        /^public\//,
        /^src\//,
        /^package\.json$/,
        /^vite\.config/,
        /^tailwind\.config/,
        /^_redirects$/
      ];

      const importantFiles = changedFiles
        .map(line => line.substring(3).trim())
        .filter(file => {
          return importantPatterns.some(pattern => pattern.test(file));
        })
        .filter(file => {
          // 排除不重要的文件
          const excludePatterns = [
            /node_modules/,
            /\.git/,
            /dist/,
            /\.DS_Store/,
            /\.md$/,
            /\.log$/
          ];
          return !excludePatterns.some(pattern => pattern.test(file));
        });

      logInfo(`检测到 ${changedFiles.length} 个文件变更`);
      logInfo(`重要文件: ${importantFiles.length} 个`);

      if (importantFiles.length > 0) {
        importantFiles.forEach(file => {
          logInfo(`  📝 ${file}`);
        });
      }

      return {
        hasChanges: importantFiles.length > 0,
        files: importantFiles,
        allFiles: changedFiles
      };

    } catch (error) {
      logError(`检测变更失败: ${error.message}`);
      return { hasChanges: false, files: [] };
    }
  }

  // 智能提交变更
  async commitChanges(files, reason = 'Auto deployment') {
    logStep('智能提交变更');

    try {
      // 添加所有变更文件
      const addCmd = files.length > 0
        ? `git add ${files.map(f => `"${f}"`).join(' ')}`
        : 'git add .';

      execSync(addCmd, { encoding: 'utf8' });
      logSuccess('文件已添加到暂存区');

      // 生成智能提交信息
      const timestamp = new Date().toLocaleString('zh-CN');
      const commitMsg = `feat: ${timestamp} ${reason}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf8' });

      const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      logSuccess(`提交成功: ${commitHash}`);

      return commitHash;

    } catch (error) {
      logError(`提交失败: ${error.message}`);
      return null;
    }
  }

  // 推送到远程仓库
  async pushToRemote() {
    logStep('推送到远程仓库');

    try {
      execSync('git push origin main', { encoding: 'utf8' });
      logSuccess('代码已推送到远程仓库');
      return true;
    } catch (error) {
      logError(`推送失败: ${error.message}`);
      return false;
    }
  }

  // 使用Cloudflare API触发构建
  async triggerCloudflareBuild() {
    if (!this.cloudflareToken || !this.accountId) {
      logWarning('缺少Cloudflare API凭证，跳过API触发');
      return false;
    }

    logStep('通过Cloudflare API触发构建');

    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/pages/projects/${this.projectName}/deployments`;

    return new Promise((resolve) => {
      const postData = JSON.stringify({});

      const options = {
        hostname: 'api.cloudflare.com',
        port: 443,
        path: `/client/v4/accounts/${this.accountId}/pages/projects/${this.projectName}/deployments`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${this.cloudflareToken}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(data);

            if (result.success) {
              logSuccess('Cloudflare Pages构建触发成功');
              logInfo(`部署ID: ${result.result.id}`);
              logInfo(`部署URL: ${result.result.url}`);
              this.deploymentTriggered = true;
              resolve(true);
            } else {
              logError('Cloudflare Pages构建触发失败');
              if (result.errors) {
                result.errors.forEach(error => {
                  logError(`错误: ${error.message}`);
                });
              }
              resolve(false);
            }
          } catch (error) {
            logError(`解析响应失败: ${error.message}`);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        logError(`API请求失败: ${error.message}`);
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  }

  // 智能等待部署完成
  async waitForDeployment() {
    if (!this.deploymentTriggered) {
      logInfo('未触发API构建，跳过等待');
      return false;
    }

    logStep('等待Cloudflare Pages构建完成');

    const maxWaitTime = 10 * 60 * 1000; // 10分钟
    const checkInterval = 15 * 1000; // 15秒检查一次
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;

      try {
        // 检查网站是否更新
        const response = execSync(`curl -s "${this.domain}"`, { encoding: 'utf8', timeout: 10000 });
        const titleMatch = response.match(/<title>(.*?)<\/title>/);

        if (titleMatch && titleMatch[1].includes('羧甲基淀粉')) {
          logSuccess('检测到SEO优化已生效！');
          return true;
        }

        logInfo(`等待中... (${Math.round(elapsed/1000)}秒)`);

      } catch (error) {
        // 继续等待
      }
    }

    logWarning('等待超时，但构建可能仍在进行中');
    return false;
  }

  // 全面验证部署
  async verifyDeployment() {
    logStep('全面验证部署结果');

    const results = [];

    // 1. 检查网站可访问性
    try {
      const response = execSync(`curl -I "${this.domain}"`, { encoding: 'utf8', timeout: 10000 });
      if (response.includes('200')) {
        logSuccess('网站可正常访问');
        results.push({ name: '网站访问', status: '✅ 通过' });
      } else {
        logError('网站访问异常');
        results.push({ name: '网站访问', status: '❌ 失败' });
      }
    } catch (error) {
      logError(`网站访问检查失败: ${error.message}`);
      results.push({ name: '网站访问', status: '❌ 失败' });
    }

    // 2. 检查SEO优化
    try {
      const response = execSync(`curl -s "${this.domain}"`, { encoding: 'utf8', timeout: 10000 });
      const titleMatch = response.match(/<title>(.*?)<\/title>/);
      const descMatch = response.match(/<meta name="description" content="(.*?)"/);

      let seoPassed = true;

      if (titleMatch && titleMatch[1].includes('羧甲基淀粉')) {
        logSuccess('SEO标题优化已生效');
        results.push({ name: 'SEO标题', status: '✅ 通过' });
      } else {
        logWarning('SEO标题尚未生效');
        results.push({ name: 'SEO标题', status: '⚠️ 待生效' });
        seoPassed = false;
      }

      if (descMatch && descMatch[1].includes('CMS') && descMatch[1].includes('23年')) {
        logSuccess('SEO描述优化已生效');
        results.push({ name: 'SEO描述', status: '✅ 通过' });
      } else {
        logWarning('SEO描述尚未生效');
        results.push({ name: 'SEO描述', status: '⚠️ 待生效' });
        seoPassed = false;
      }

      if (seoPassed) {
        logSuccess('SEO优化完全生效');
      }

    } catch (error) {
      logError(`SEO验证失败: ${error.message}`);
      results.push({ name: 'SEO验证', status: '❌ 失败' });
    }

    // 3. 检查Sitemap
    try {
      const response = execSync(`curl -I "${this.domain}/sitemap.xml"`, { encoding: 'utf8', timeout: 10000 });
      if (response.includes('200')) {
        logSuccess('Sitemap可访问');
        results.push({ name: 'Sitemap', status: '✅ 通过' });
      } else {
        logError('Sitemap访问异常');
        results.push({ name: 'Sitemap', status: '❌ 失败' });
      }
    } catch (error) {
      logError(`Sitemap检查失败: ${error.message}`);
      results.push({ name: 'Sitemap', status: '❌ 失败' });
    }

    return results;
  }

  // 生成智能报告
  generateReport(changes, commitHash, results) {
    const report = {
      timestamp: this.timestamp,
      domain: this.domain,
      changes: {
        total: changes.allFiles?.length || 0,
        important: changes.files.length,
        files: changes.files
      },
      deployment: {
        commit: commitHash,
        apiTriggered: this.deploymentTriggered,
        status: 'completed'
      },
      verification: results,
      summary: {
        success: results.filter(r => r.status.includes('✅')).length,
        warnings: results.filter(r => r.status.includes('⚠️')).length,
        failed: results.filter(r => r.status.includes('❌')).length
      }
    };

    // 保存JSON报告
    const jsonFile = `smart-deployment-report-${Date.now()}.json`;
    fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));
    logSuccess(`JSON报告已保存: ${jsonFile}`);

    // 生成Markdown报告
    const markdown = this.generateMarkdownReport(report);
    const mdFile = `smart-deployment-report-${Date.now()}.md`;
    fs.writeFileSync(mdFile, markdown);
    logSuccess(`Markdown报告已保存: ${mdFile}`);

    return { jsonFile, mdFile };
  }

  generateMarkdownReport(report) {
    return `# 🚀 智能自动部署报告

**部署时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}
**网站**: ${report.domain}
**执行时长**: ${Math.round((Date.now() - new Date(report.timestamp).getTime()) / 1000)}秒

---

## 📋 部署概览

- **变更文件数**: ${report.changes.total} (重要: ${report.changes.important})
- **提交Hash**: ${report.deployment.commit}
- **API触发**: ${report.deployment.apiTriggered ? '✅ 是' : '❌ 否'}
- **整体状态**: ${report.summary.failed === 0 ? '✅ 成功' : '⚠️ 部分成功'}

---

## 📝 变更详情

${report.changes.files.length > 0 ? report.changes.files.map(file => `- ${file}`).join('\n') : '- 无重要文件变更'}

---

## 🔍 验证结果

${report.verification.map(item => `- ${item.name}: ${item.status}`).join('\n')}

---

## 📊 结果统计

- ✅ **成功**: ${report.summary.success} 项
- ⚠️ **警告**: ${report.summary.warnings} 项
- ❌ **失败**: ${report.summary.failed} 项

---

## 🎯 访问链接

- **网站**: ${report.domain}
- **Sitemap**: ${report.domain}/sitemap.xml

---

*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
`;
  }

  // 主执行流程
  async execute(options = {}) {
    const {
      force = false,
      reason = '智能自动部署',
      verify = true
    } = options;

    logStep('开始智能自动部署流程');

    // 1. 检测变更
    const changes = this.detectChanges();

    if (!changes.hasChanges && !force) {
      logInfo('没有检测到重要变更，无需部署');
      return { success: true, reason: '无重要变更' };
    }

    // 2. 提交变更
    const commitHash = await this.commitChanges(changes.files, reason);
    if (!commitHash) {
      return { success: false, reason: '提交失败' };
    }

    // 3. 推送到远程
    const pushSuccess = await this.pushToRemote();
    if (!pushSuccess) {
      return { success: false, reason: '推送失败' };
    }

    // 4. 尝试API触发构建
    await this.triggerCloudflareBuild();

    // 5. 等待部署（如果API触发成功）
    if (this.deploymentTriggered) {
      await this.waitForDeployment();
    }

    // 6. 验证部署
    let results = [];
    if (verify) {
      results = await this.verifyDeployment();
    }

    // 7. 生成报告
    const reportFiles = this.generateReport(changes, commitHash, results);

    return {
      success: true,
      commitHash,
      deploymentTriggered: this.deploymentTriggered,
      results,
      reportFiles
    };
  }
}

// 显示标题
function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    logHeader('🚀 智能自动部署器使用说明');

    log('\n📋 基本用法:', colors.cyan);
    log('  node scripts/smart-auto-deployer.cjs              - 智能自动部署', colors.blue);
    log('  node scripts/smart-auto-deployer.cjs --force      - 强制部署', colors.blue);
    log('  node scripts/smart-auto-deployer.cjs --reason="修复bug"  - 指定部署原因', colors.blue);

    log('\n🎯 功能特性:', colors.cyan);
    log('  ✅ 智能检测重要文件变更', colors.green);
    log('  ✅ 自动生成智能提交信息', colors.green);
    log('  ✅ 推送到远程仓库', colors.green);
    log('  ✅ Cloudflare API自动触发构建', colors.green);
    log('  ✅ 智能等待部署完成', colors.green);
    log('  ✅ 全面验证部署结果', colors.green);
    log('  ✅ 生成详细执行报告', colors.green);

    log('\n🔧 环境变量配置:', colors.cyan);
    log('  GITHUB_TOKEN - GitHub API Token (可选)', colors.blue);
    log('  CF_API_TOKEN - Cloudflare API Token (可选)', colors.blue);
    log('  CF_ACCOUNT_ID - Cloudflare Account ID (可选)', colors.blue);

    return;
  }

  logHeader('🚀 智能自动部署器 - Cursor级别自动化');

  const deployer = new SmartAutoDeployer();
  const options = {
    force: args.includes('--force'),
    verify: !args.includes('--no-verify'),
    reason: args.find(arg => arg.startsWith('--reason='))?.split('=')[1] || '智能自动部署'
  };

  try {
    const result = await deployer.execute(options);

    if (result.success) {
      logSuccess('智能自动部署完成！');

      if (result.deploymentTriggered) {
        logInfo('✅ 通过API触发了Cloudflare Pages构建');
      } else {
        logInfo('⚠️  未触发API构建，可能需要在Cloudflare Dashboard手动触发');
      }

      if (result.reportFiles) {
        logInfo('📊 查看详细报告:');
        Object.values(result.reportFiles).forEach(file => {
          logInfo(`  📄 ${file}`);
        });
      }
    } else {
      logError(`智能自动部署失败: ${result.reason}`);
      process.exit(1);
    }

  } catch (error) {
    logError(`执行过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { SmartAutoDeployer };