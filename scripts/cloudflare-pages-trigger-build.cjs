#!/usr/bin/env node

/**
 * Cloudflare Pages构建触发器
 * 手动触发Cloudflare Pages重新构建
 */

const { execSync } = require('child_process');

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

class CloudflarePagesTrigger {
  constructor() {
    this.accountId = null;
    this.apiToken = process.env.CF_API_TOKEN;
    this.projectName = 'kahn-building-materials';
  }

  // 从wrangler.toml获取账户ID
  getAccountId() {
    try {
      const wranglerConfig = require('../wrangler.toml');
      // 这里需要手动设置或者从环境变量获取
      this.accountId = process.env.CF_ACCOUNT_ID || 'your-account-id-here';
      return this.accountId;
    } catch (error) {
      logError(`无法获取账户ID: ${error.message}`);
      logInfo('请设置环境变量 CF_ACCOUNT_ID');
      return null;
    }
  }

  // 触发Cloudflare Pages构建
  async triggerBuild() {
    logStep('触发Cloudflare Pages构建');

    const accountId = this.getAccountId();
    if (!accountId) {
      logError('无法获取Cloudflare账户ID');
      return false;
    }

    if (!this.apiToken) {
      logError('未设置CF_API_TOKEN环境变量');
      logInfo('请设置Cloudflare API Token');
      return false;
    }

    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${this.projectName}/deployments`;

    try {
      const response = execSync(`curl -X POST "${apiUrl}" \
        -H "Authorization: Bearer ${this.apiToken}" \
        -H "Content-Type: application/json" \
        -d '{}'`, { encoding: 'utf8', timeout: 30000 });

      const result = JSON.parse(response);

      if (result.success) {
        logSuccess('Cloudflare Pages构建触发成功');
        logInfo(`部署ID: ${result.result.id}`);
        logInfo(`部署URL: ${result.result.url}`);

        // 等待构建完成
        await this.waitForDeployment(result.result.id);
        return true;
      } else {
        logError('构建触发失败');
        if (result.errors) {
          result.errors.forEach(error => {
            logError(`错误: ${error.message}`);
          });
        }
        return false;
      }

    } catch (error) {
      logError(`触发构建时发生错误: ${error.message}`);

      // 如果API调用失败，提供替代方案
      logInfo('替代方案:');
      logInfo('1. 访问 Cloudflare Dashboard');
      logInfo('2. 进入 Pages 项目');
      logInfo('3. 手动触发构建');

      return false;
    }
  }

  // 等待构建完成
  async waitForDeployment(deploymentId) {
    logStep('等待构建完成...');

    const maxWaitTime = 10 * 60 * 1000; // 10分钟
    const checkInterval = 30 * 1000; // 30秒检查一次
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      try {
        const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${this.getAccountId()}/pages/projects/${this.projectName}/deployments/${deploymentId}`;
        const response = execSync(`curl -s "${apiUrl}" \
          -H "Authorization: Bearer ${this.apiToken}"`, { encoding: 'utf8' });

        const deployment = JSON.parse(response);

        if (deployment.result && deployment.result.latest_stage) {
          const stage = deployment.result.latest_stage;

          logInfo(`当前阶段: ${stage.name}`);
          logInfo(`状态: ${stage.status}`);
          logInfo(`开始时间: ${new Date(stage.started_on).toLocaleString('zh-CN')}`);

          if (stage.status === 'success') {
            logSuccess('构建完成！');
            logInfo(`最终URL: ${deployment.result.url}`);

            // 验证部署
            await this.verifyDeployment(deployment.result.url);
            return true;
          } else if (stage.status === 'failure') {
            logError(`构建失败: ${stage.name}`);
            return false;
          }
        }

      } catch (error) {
        // 继续等待
      }

      elapsed += checkInterval;
      if (elapsed < maxWaitTime) {
        logInfo(`等待中... (${Math.round(elapsed/1000)}秒)`);
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }

    logWarning('等待超时，但构建可能仍在进行中');
    return true;
  }

  // 验证部署
  async verifyDeployment(deploymentUrl) {
    logStep('验证部署结果');

    try {
      // 等待几秒让部署完全生效
      await new Promise(resolve => setTimeout(resolve, 10000));

      const response = execSync(`curl -I "${deploymentUrl}"`, { encoding: 'utf8' });

      if (response.includes('HTTP/2 200') || response.includes('HTTP/1.1 200')) {
        logSuccess('部署验证成功');

        // 检查SEO优化是否生效
        await this.verifySEO(deploymentUrl);
        return true;
      } else {
        logError('部署验证失败');
        return false;
      }
    } catch (error) {
      logError(`验证部署时发生错误: ${error.message}`);
      return false;
    }
  }

  // 验证SEO优化
  async verifySEO(url) {
    logStep('验证SEO优化效果');

    try {
      // 检查页面标题
      const titleResponse = execSync(`curl -s "${url}"`, { encoding: 'utf8' });
      const titleMatch = titleResponse.match(/<title>(.*?)<\/title>/);

      if (titleMatch) {
        const title = titleMatch[1];
        logInfo(`页面标题: ${title}`);

        if (title.includes('专业羧甲基淀粉')) {
          logSuccess('✅ 页面标题已更新');
        } else {
          logWarning('⚠️  页面标题可能还未更新');
        }
      }

      // 检查meta description
      const descMatch = titleResponse.match(/<meta name="description" content="(.*?)"/);

      if (descMatch) {
        const description = descMatch[1];
        logInfo(`Meta Description: ${description.substring(0, 100)}...`);

        if (description.includes('羧甲基淀粉') && description.includes('23年')) {
          logSuccess('✅ Meta Description已更新');
        } else {
          logWarning('⚠️  Meta Description可能还未更新');
        }
      }

      // 检查sitemap
      const sitemapResponse = execSync(`curl -I "${url}/sitemap.xml"`, { encoding: 'utf8' });

      if (sitemapResponse.includes('HTTP/2 200')) {
        logSuccess('✅ Sitemap可访问');
      } else {
        logWarning('⚠️  Sitemap可能还未部署');
      }

    } catch (error) {
      logError(`SEO验证时发生错误: ${error.message}`);
    }
  }

  // 显示帮助信息
  showHelp() {
    logHeader('🛠️  Cloudflare Pages构建触发器使用说明');

    log('\n📋 前置要求:', colors.cyan);
    log('1. 设置环境变量 CF_API_TOKEN', colors.blue);
    log('2. 设置环境变量 CF_ACCOUNT_ID', colors.blue);
    log('3. 确保有wrangler.toml配置文件', colors.blue);

    log('\n📋 基本用法:', colors.cyan);
    log('  node scripts/cloudflare-pages-trigger-build.cjs              - 触发构建', colors.blue);
    log('  node scripts/cloudflare-pages-trigger-build.cjs --verify     - 仅验证SEO', colors.blue);

    log('\n🎯 功能:', colors.cyan);
    log('  ✅ 手动触发Cloudflare Pages构建', colors.green);
    log('  ✅ 等待构建完成', colors.green);
    log('  ✅ 验证部署结果', colors.green);
    log('  ✅ 检查SEO优化效果', colors.green);

    log('\n🔧 故障排除:', colors.cyan);
    log('• 如果API调用失败，请手动在Cloudflare Dashboard中触发构建', colors.yellow);
    log• 检查CF_API_TOKEN是否正确', colors.yellow);
    log• 检查CF_ACCOUNT_ID是否正确', colors.yellow);
    log• 确认项目名称是否正确', colors.yellow);
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
    const trigger = new CloudflarePagesTrigger();
    trigger.showHelp();
    return;
  }

  const trigger = new CloudflarePagesTrigger();

  if (args.includes('--verify')) {
    logInfo('验证模式：仅检查SEO效果');
    await trigger.verifySEO('https://kn-wallpaperglue.com');
  } else {
    await trigger.triggerBuild();
  }
}

if (require.main === module) {
  main();
}

exports.CloudflarePagesTrigger = CloudflarePagesTrigger;