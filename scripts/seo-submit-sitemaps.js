#!/usr/bin/env node

/**
 * 搜索引擎 Sitemap 自动提交脚本
 *
 * 功能:
 * 1. 提交 sitemap 到 Google Search Console
 * 2. 提交 sitemap 到 Bing Webmaster Tools
 * 3. 提交 sitemap 到 Yandex Webmaster
 * 4. 生成提交报告
 *
 * 使用方法:
 * node scripts/seo-submit-sitemaps.js
 */

import https from 'https';

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
  log(`🔍 ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

// 配置
const CONFIG = {
  domain: 'kn-wallpaperglue.com',
  sitemaps: [
    'https://kn-wallpaperglue.com/sitemap.xml',
    'https://kn-wallpaperglue.com/sitemap-products.xml',
    'https://kn-wallpaperglue.com/sitemap-blog.xml',
  ],
  // 搜索引擎提交端点
  endpoints: {
    google: 'https://www.google.com/ping?sitemap=',
    bing: 'https://www.bing.com/ping?sitemap=',
    yandex: 'https://webmaster.yandex.com/ping?sitemap=',
  }
};

/**
 * 提交 sitemap 到搜索引擎
 */
function submitSitemap(searchEngine, sitemapUrl) {
  return new Promise((resolve, reject) => {
    const endpoint = CONFIG.endpoints[searchEngine];
    const submitUrl = `${endpoint}${encodeURIComponent(sitemapUrl)}`;

    logInfo(`提交到 ${searchEngine.toUpperCase()}: ${sitemapUrl}`);

    https.get(submitUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          logSuccess(`✓ ${searchEngine.toUpperCase()} 提交成功`);
          resolve({ success: true, searchEngine, sitemapUrl, statusCode: res.statusCode });
        } else {
          logWarning(`${searchEngine.toUpperCase()} 返回状态码: ${res.statusCode}`);
          resolve({ success: false, searchEngine, sitemapUrl, statusCode: res.statusCode });
        }
      });
    }).on('error', (error) => {
      logError(`✗ ${searchEngine.toUpperCase()} 提交失败: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * 提交所有 sitemap 到所有搜索引擎
 */
async function submitAllSitemaps() {
  logHeader('🔍 搜索引擎 Sitemap 提交工具');

  log(`\n域名: ${CONFIG.domain}`, colors.cyan);
  log(`Sitemap 数量: ${CONFIG.sitemaps.length}`, colors.cyan);
  log(`搜索引擎: Google, Bing, Yandex\n`, colors.cyan);

  const results = {
    google: [],
    bing: [],
    yandex: [],
    total: 0,
    success: 0,
    failed: 0
  };

  // 遍历所有搜索引擎
  for (const searchEngine of Object.keys(CONFIG.endpoints)) {
    logStep(`提交到 ${searchEngine.toUpperCase()}`);

    // 遍历所有 sitemap
    for (const sitemapUrl of CONFIG.sitemaps) {
      try {
        const result = await submitSitemap(searchEngine, sitemapUrl);
        results[searchEngine].push(result);
        results.total++;

        if (result.success) {
          results.success++;
        } else {
          results.failed++;
        }

        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logError(`提交失败: ${error.message}`);
        results.failed++;
        results.total++;
      }
    }

    log(''); // 空行
  }

  return results;
}

/**
 * 生成提交报告
 */
function generateReport(results) {
  logHeader('📊 提交报告');

  log(`\n总计提交: ${results.total}`, colors.cyan);
  log(`成功: ${results.success}`, colors.green);
  log(`失败: ${results.failed}`, results.red);

  log('\n详细结果:', colors.cyan);

  // Google 结果
  log('\n🔍 Google:', colors.bright);
  if (results.google.length > 0) {
    results.google.forEach((result, index) => {
      const status = result.success ? '✅' : '⚠️';
      log(`  ${status} Sitemap ${index + 1}: ${result.sitemapUrl}`);
      log(`     状态码: ${result.statusCode}`);
    });
  } else {
    log('  未提交');
  }

  // Bing 结果
  log('\n🔍 Bing:', colors.bright);
  if (results.bing.length > 0) {
    results.bing.forEach((result, index) => {
      const status = result.success ? '✅' : '⚠️';
      log(`  ${status} Sitemap ${index + 1}: ${result.sitemapUrl}`);
      log(`     状态码: ${result.statusCode}`);
    });
  } else {
    log('  未提交');
  }

  // Yandex 结果
  log('\n🔍 Yandex:', colors.bright);
  if (results.yandex.length > 0) {
    results.yandex.forEach((result, index) => {
      const status = result.success ? '✅' : '⚠️';
      log(`  ${status} Sitemap ${index + 1}: ${result.sitemapUrl}`);
      log(`     状态码: ${result.statusCode}`);
    });
  } else {
    log('  未提交');
  }

  log('\n' + '='.repeat(80), colors.bright);
}

/**
 * 提供手动提交指南
 */
function showManualSubmissionGuide() {
  logHeader('📋 手动提交指南');

  log('\n如果自动提交失败，您可以通过以下方式手动提交:\n', colors.cyan);

  // Google
  log('🔍 Google Search Console:', colors.bright);
  log('  1. 访问: https://search.google.com/search-console');
  log('  2. 选择您的网站');
  log('  3. 左侧菜单选择 "索引" > "Sitemaps"');
  log('  4. 在 "添加新的 Sitemap" 框中输入:');
  CONFIG.sitemaps.forEach(sitemap => {
    log(`     - ${sitemap}`);
  });
  log('  5. 点击 "提交"');

  // Bing
  log('\n🔍 Bing Webmaster Tools:', colors.bright);
  log('  1. 访问: https://www.bing.com/webmasters');
  log('  2. 登录并添加您的网站');
  log('  3. 左侧菜单选择 "提交 Sitemap"');
  log('  4. 输入 Sitemap URL:');
  CONFIG.sitemaps.forEach(sitemap => {
    log(`     - ${sitemap}`);
  });
  log('  5. 点击 "提交"');

  // Yandex
  log('\n🔍 Yandex Webmaster:', colors.bright);
  log('  1. 访问: https://webmaster.yandex.com');
  log('  2. 添加并验证您的网站');
  log('  3. 左侧菜单选择 "索引" > "Sitemap 文件"');
  log('  4. 点击 "添加" 并输入 Sitemap URL:');
  CONFIG.sitemaps.forEach(sitemap => {
    log(`     - ${sitemap}`);
  });
  log('  5. 点击 "添加"');

  log('\n' + '='.repeat(80), colors.bright);
}

/**
 * 提交 sitemap 到 Google Search Console API
 * 需要配置 Google API 凭据
 */
async function submitToGoogleAPI() {
  logWarning('Google API 提交功能需要配置凭据');
  logInfo('如需使用 API 提交，请:');
  log('  1. 在 Google Cloud Console 创建项目');
  log('  2. 启用 Search Console API');
  log('  3. 创建服务账号并下载 JSON 密钥文件');
  log('  4. 设置环境变量: GOOGLE_APPLICATION_CREDENTIALS');
  log('  5. 在 Search Console 中添加服务账号为用户');

  log('\n参考文档:');
  log('  https://developers.google.com/webmaster-tools/search-console-api-original\n');
}

/**
 * 提交 sitemap 到 Bing Webmaster API
 * 需要配置 Bing API 密钥
 */
async function submitToBingAPI() {
  logWarning('Bing API 提交功能需要配置 API 密钥');
  logInfo('如需使用 API 提交，请:');
  log('  1. 在 Bing Webmaster Tools 获取 API 密钥');
  log('  2. 设置环境变量: BING_API_KEY');
  log('  3. 配置脚本使用 API 提交\n');
}

/**
 * 主函数
 */
async function main() {
  try {
    // 执行自动提交
    const results = await submitAllSitemaps();

    // 生成报告
    generateReport(results);

    // 显示手动提交指南
    showManualSubmissionGuide();

    // API 提交说明
    logHeader('💡 高级功能');
    logInfo('如需更高级的 API 提交功能:');
    await submitToGoogleAPI();
    await submitToBingAPI();

    logSuccess('\n提交完成！');
    logInfo('建议: 即使自动提交成功，也建议在各个搜索引擎的控制台中确认 sitemap 状态。');

    log('\n下一步:', colors.cyan);
    log('  1. 在 Google Search Console 检查索引状态');
    log('  2. 在 Bing Webmaster Tools 检查收录情况');
    log('  3. 在 Yandex Webmaster 检查索引进度');
    log('  4. 定期监控 sitemap 提交状态（建议每月一次）');

  } catch (error) {
    logError(`执行失败: ${error.message}`);
    logInfo('\n请尝试手动提交（参考上面的手动提交指南）');
    process.exit(1);
  }
}

// 运行
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}

export { submitSitemap, submitAllSitemaps };
