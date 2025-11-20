#!/usr/bin/env node

/**
 * 快速部署验证脚本
 * 验证SEO优化是否在生产环境生效
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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

async function quickVerify() {
  log('\n🔍 快速部署验证 - 检查SEO优化是否生效');
  log('='.repeat(50));

  const url = 'https://kn-wallpaperglue.com';

  try {
    logInfo('检查网站可访问性...');
    const response = execSync(`curl -I "${url}"`, { encoding: 'utf8' });

    if (response.includes('HTTP/2 200') || response.includes('HTTP/1.1 200')) {
      logSuccess('网站可正常访问');
    } else {
      logError('网站访问异常');
      return;
    }

    logInfo('检查SEO标签...');
    const html = execSync(`curl -s "${url}"`, { encoding: 'utf8' });

    // 检查title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      const title = titleMatch[1];
      logInfo(`页面标题: ${title}`);

      if (title.includes('羧甲基淀粉')) {
        logSuccess('✅ SEO优化标题已生效');
      } else {
        logWarning('⚠️  SEO优化标题尚未生效');
        logInfo('可能需要重新触发Cloudflare Pages构建');
      }
    }

    // 检查meta description
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    if (descMatch) {
      const description = descMatch[1];
      logInfo(`Meta描述: ${description.substring(0, 100)}...`);

      if (description.includes('CMS') && description.includes('23年')) {
        logSuccess('✅ Meta描述已生效');
      } else {
        logWarning('⚠️  Meta描述尚未生效');
      }
    }

    // 检查sitemap
    logInfo('检查sitemap文件...');
    try {
      const sitemapResponse = execSync(`curl -I "${url}/sitemap.xml"`, { encoding: 'utf8' });
      if (sitemapResponse.includes('HTTP/2 200')) {
        logSuccess('✅ Sitemap可访问');
      } else {
        logWarning('⚠️  Sitemap访问异常');
      }
    } catch (error) {
      logWarning('⚠️  Sitemap访问失败');
    }

    log('\n📋 验证总结:');
    logInfo('如果SEO优化尚未生效，请:');
    log('1. 访问 Cloudflare Dashboard', colors.cyan);
    log('2. 进入 Pages 项目', colors.cyan);
    log('3. 手动触发构建', colors.cyan);
    log('4. 等待构建完成后再次验证', colors.cyan);

  } catch (error) {
    logError(`验证过程中发生错误: ${error.message}`);
  }
}

if (require.main === module) {
  quickVerify();
}

module.exports = { quickVerify };