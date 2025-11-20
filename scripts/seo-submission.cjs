#!/usr/bin/env node

/**
 * 搜索引擎提交和验证脚本
 * 自动提交网站到Google、Yandex、Bing搜索引擎并验证收录状态
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');
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

// HTTP请求工具
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, { timeout: 30000, ...options }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

class SEOSubmission {
  constructor() {
    this.domain = 'https://kn-wallpaperglue.com';
    this.siteUrl = 'kn-wallpaperglue.com';
    this.projectRoot = process.cwd();

    // 搜索引擎配置
    this.searchEngines = {
      google: {
        name: 'Google',
        verificationFile: 'googlee5f164dd155314b6.html',
        sitemapUrl: 'https://search.google.com/search-console/sitemap',
        submitUrl: 'https://search.google.com/search-console/url-submission',
        apiUrl: 'https://www.google.com/ping'
      },
      bing: {
        name: 'Bing',
        verificationFile: 'BingSiteAuth.xml',
        sitemapUrl: 'https://www.bing.com/webmasters/sitemaps',
        submitUrl: 'https://www.bing.com/webmaster/submiturl',
        apiUrl: 'https://www.bing.com/ping.aspx'
      },
      yandex: {
        name: 'Yandex',
        verificationFile: 'yandex_3c49061d23e42f32.html',
        sitemapUrl: 'https://webmaster.yandex.ru/sitemap.xml',
        submitUrl: 'https://webmaster.yandex.ru/addurl',
        apiUrl: 'https://ping.blogs.yandex.ru/RPC2'
      }
    };
  }

  // 检查验证文件是否存在
  checkVerificationFiles() {
    logStep('检查搜索引擎验证文件');
    const publicPath = path.join(this.projectRoot, 'public');
    const results = {};

    for (const [engine, config] of Object.entries(this.searchEngines)) {
      const filePath = path.join(publicPath, config.verificationFile);
      if (fs.existsSync(filePath)) {
        logSuccess(`${config.name} 验证文件存在: ${config.verificationFile}`);
        results[engine] = true;
      } else {
        logWarning(`${config.name} 验证文件缺失: ${config.verificationFile}`);
        results[engine] = false;
      }
    }

    return results;
  }

  // 检查网站可访问性
  async checkWebsiteAccessibility() {
    logStep('检查网站可访问性');
    const urls = [
      this.domain,
      `${this.domain}/faq`,
      `${this.domain}/products`,
      `${this.domain}/sitemap.xml`
    ];

    const results = [];
    for (const url of urls) {
      try {
        logInfo(`检查: ${url}`);
        const response = await makeRequest(url);

        if (response.statusCode === 200) {
          logSuccess(`✅ ${url} - 可访问 (${response.statusCode})`);
          results.push({ url, accessible: true, statusCode: response.statusCode });
        } else {
          logWarning(`⚠️  ${url} - 状态码: ${response.statusCode}`);
          results.push({ url, accessible: false, statusCode: response.statusCode });
        }
      } catch (error) {
        logError(`❌ ${url} - 错误: ${error.message}`);
        results.push({ url, accessible: false, error: error.message });
      }
    }

    return results;
  }

  // 提交sitemap到搜索引擎
  async submitSitemaps() {
    logStep('提交Sitemap到搜索引擎');

    const sitemaps = [
      `${this.domain}/sitemap.xml`,
      `${this.domain}/sitemap-zh.xml`,
      `${this.domain}/sitemap-en.xml`,
      `${this.domain}/sitemap-ru.xml`
    ];

    const results = {};

    for (const [engine, config] of Object.entries(this.searchEngines)) {
      logInfo(`提交到 ${config.name}...`);
      results[engine] = [];

      for (const sitemap of sitemaps) {
        try {
          logInfo(`  提交: ${sitemap}`);

          // 使用搜索引擎的ping API
          let pingUrl;
          if (engine === 'google') {
            pingUrl = `${config.apiUrl}?sitemap=${encodeURIComponent(sitemap)}`;
          } else if (engine === 'bing') {
            pingUrl = `${config.apiUrl}?site=${encodeURIComponent(this.domain)}&url=${encodeURIComponent(sitemap)}`;
          }

          if (pingUrl) {
            const response = await makeRequest(pingUrl);
            if (response.statusCode >= 200 && response.statusCode < 300) {
              logSuccess(`  ✅ 提交成功: ${sitemap}`);
              results[engine].push({ sitemap, success: true, statusCode: response.statusCode });
            } else {
              logWarning(`  ⚠️  提交异常: ${sitemap} (${response.statusCode})`);
              results[engine].push({ sitemap, success: false, statusCode: response.statusCode });
            }
          } else {
            logInfo(`  ℹ️  ${config.name} 需要手动提交: ${sitemap}`);
            results[engine].push({ sitemap, success: false, manual: true });
          }

        } catch (error) {
          logError(`  ❌ 提交失败: ${sitemap} - ${error.message}`);
          results[engine].push({ sitemap, success: false, error: error.message });
        }
      }
    }

    return results;
  }

  // 提交主要URL到搜索引擎
  async submitMainUrls() {
    logStep('提交主要URL到搜索引擎');

    const mainUrls = [
      this.domain,
      `${this.domain}/faq`,
      `${this.domain}/products`,
      `${this.domain}/about`,
      `${this.domain}/contact`,
      `${this.domain}/applications`,
      `${this.domain}/oem`
    ];

    const results = {};

    for (const [engine, config] of Object.entries(this.searchEngines)) {
      logInfo(`提交到 ${config.name}...`);
      results[engine] = [];

      for (const url of mainUrls) {
        try {
          logInfo(`  提交: ${url}`);

          if (engine === 'google') {
            // Google API提交
            const pingUrl = `${config.apiUrl}?url=${encodeURIComponent(url)}`;
            const response = await makeRequest(pingUrl);

            if (response.statusCode >= 200 && response.statusCode < 300) {
              logSuccess(`  ✅ 提交成功: ${url}`);
              results[engine].push({ url, success: true, statusCode: response.statusCode });
            } else {
              logWarning(`  ⚠️  提交异常: ${url} (${response.statusCode})`);
              results[engine].push({ url, success: false, statusCode: response.statusCode });
            }
          } else if (engine === 'bing') {
            // Bing URL提交
            const pingUrl = `${config.apiUrl}?site=${encodeURIComponent(this.domain)}&url=${encodeURIComponent(url)}`;
            const response = await makeRequest(pingUrl);

            if (response.statusCode >= 200 && response.statusCode < 300) {
              logSuccess(`  ✅ 提交成功: ${url}`);
              results[engine].push({ url, success: true, statusCode: response.statusCode });
            } else {
              logWarning(`  ⚠️  提交异常: ${url} (${response.statusCode})`);
              results[engine].push({ url, success: false, statusCode: response.statusCode });
            }
          } else {
            // Yandex和其他搜索引擎需要手动提交
            logInfo(`  ℹ️  ${config.name} 需要手动提交: ${url}`);
            results[engine].push({ url, success: false, manual: true });
          }

        } catch (error) {
          logError(`  ❌ 提交失败: ${url} - ${error.message}`);
          results[engine].push({ url, success: false, error: error.message });
        }
      }
    }

    return results;
  }

  // 生成搜索控制台链接
  generateConsoleLinks() {
    logStep('生成搜索控制台链接');

    const links = {
      google: {
        name: 'Google Search Console',
        url: 'https://search.google.com/search-console',
        instructions: [
          '1. 登录Google账户',
          '2. 添加属性: kn-wallpaperglue.com',
          '3. 上传验证文件: googlee5f164dd155314b6.html',
          '4. 提交sitemap.xml',
          '5. 使用"网址检查"工具提交页面'
        ]
      },
      bing: {
        name: 'Bing Webmaster Tools',
        url: 'https://www.bing.com/webmasters',
        instructions: [
          '1. 使用Microsoft账户登录',
          '2. 添加网站: kn-wallpaperglue.com',
          '3. 上传验证文件: BingSiteAuth.xml',
          '4. 提交sitemap文件',
          '5. 使用"提交URL"功能'
        ]
      },
      yandex: {
        name: 'Yandex Webmaster',
        url: 'https://webmaster.yandex.ru',
        instructions: [
          '1. 使用Yandex账户登录',
          '2. 添加网站: kn-wallpaperglue.com',
          '3. 上传验证文件: yandex_3c49061d23e42f32.html',
          '4. 提交XML文件',
          '5. 使用"重新索引"功能'
        ]
      }
    };

    for (const [engine, config] of Object.entries(links)) {
      log(`\n🔗 ${config.name}`, colors.cyan);
      log(`链接: ${config.url}`, colors.blue);
      log('操作步骤:', colors.yellow);
      config.instructions.forEach((instruction, index) => {
        log(`  ${instruction}`, colors.yellow);
      });
    }
  }

  // 创建SEO提交报告
  generateSubmissionReport(results) {
    logStep('生成SEO提交报告');

    const report = {
      timestamp: new Date().toISOString(),
      domain: this.siteUrl,
      verificationFiles: results.verificationFiles,
      websiteAccessibility: results.websiteAccessibility,
      sitemapSubmission: results.sitemapSubmission,
      urlSubmission: results.urlSubmission,
      summary: {
        totalUrlsChecked: results.websiteAccessibility.length,
        accessibleUrls: results.websiteAccessibility.filter(r => r.accessible).length,
        searchEngines: Object.keys(this.searchEngines).length,
        successfulSubmissions: 0
      }
    };

    // 计算成功提交数量
    for (const engine of Object.keys(results.sitemapSubmission)) {
      for (const submission of results.sitemapSubmission[engine]) {
        if (submission.success) {
          report.summary.successfulSubmissions++;
        }
      }
    }

    // 保存报告
    const reportPath = path.join(this.projectRoot, 'seo-submission-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    logSuccess(`SEO提交报告已保存: seo-submission-report.json`);

    return report;
  }

  // 完整的SEO提交流程
  async submit() {
    logHeader('🔍 搜索引擎SEO收录自动提交');
    log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);

    const results = {};

    try {
      // 1. 检查验证文件
      results.verificationFiles = this.checkVerificationFiles();

      // 2. 检查网站可访问性
      results.websiteAccessibility = await this.checkWebsiteAccessibility();

      // 3. 提交sitemap
      results.sitemapSubmission = await this.submitSitemaps();

      // 4. 提交主要URL
      results.urlSubmission = await this.submitMainUrls();

      // 5. 生成控制台链接
      this.generateConsoleLinks();

      // 6. 生成报告
      const report = this.generateSubmissionReport(results);

      // 7. 显示总结
      logHeader('📊 SEO提交总结');
      logSuccess(`✅ 网站可访问性: ${report.summary.accessibleUrls}/${report.summary.totalUrlsChecked}`);
      logSuccess(`✅ 成功提交次数: ${report.summary.successfulSubmissions}`);

      log('\n🎯 后续建议:', colors.blue);
      log('1. 完成搜索引擎控制台的手动验证', colors.yellow);
      log('2. 定期检查收录状态', colors.yellow);
      log('3. 每周运行此脚本提交新内容', colors.yellow);
      log('4. 监控网站在搜索引擎中的排名', colors.yellow);

      logSuccess('\n🎉 SEO提交流程完成！');

      return report;

    } catch (error) {
      logError(`SEO提交流程失败: ${error.message}`);
      throw error;
    }
  }
}

// 主函数
async function main() {
  const seoSubmission = new SEOSubmission();
  await seoSubmission.submit().catch(error => {
    logError(`脚本执行失败: ${error.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.SEOSubmission = SEOSubmission;