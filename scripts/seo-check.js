#!/usr/bin/env node

/**
 * SEO 检测脚本
 * 检测网站在 Google、百度、Yandex、Bing 的收录情况
 */

import https from 'https';
import http from 'http';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://kn-wallpaperglue.com';
const DOMAIN = 'kn-wallpaperglue.com';

// 主要页面列表
const MAIN_PAGES = [
  '',
  '/zh',
  '/en',
  '/ru',
  '/vi',
  '/th',
  '/id',
  '/zh/products',
  '/en/products',
  '/zh/applications',
  '/en/applications',
  '/zh/oem',
  '/en/oem',
  '/zh/about',
  '/en/about',
  '/zh/contact',
  '/en/contact',
];

// 搜索引擎配置
const SEARCH_ENGINES = {
  google: {
    name: 'Google',
    siteUrl: `https://www.google.com/search?q=site:${DOMAIN}`,
    apiUrl: null, // Google 没有公开的收录查询API
  },
  baidu: {
    name: '百度',
    siteUrl: `https://www.baidu.com/s?wd=site:${DOMAIN}`,
    apiUrl: null,
  },
  yandex: {
    name: 'Yandex',
    siteUrl: `https://yandex.com/search/?text=site:${DOMAIN}`,
    apiUrl: null,
  },
  bing: {
    name: 'Bing',
    siteUrl: `https://www.bing.com/search?q=site:${DOMAIN}`,
    apiUrl: null,
  },
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检测页面是否可访问
function checkPageAccessibility(url) {
  return new Promise((resolve) => {
    const parsed = parse(url);
    const client = parsed.protocol === 'https:' ? https : http;
    
    const req = client.get(url, { timeout: 10000 }, (res) => {
      resolve({
        status: res.statusCode,
        accessible: res.statusCode >= 200 && res.statusCode < 400,
      });
    });
    
    req.on('error', () => {
      resolve({ status: 0, accessible: false });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, accessible: false });
    });
    
    req.setTimeout(10000);
  });
}

// 检测sitemap可访问性
async function checkSitemaps() {
  log('\n📋 检测 Sitemap 可访问性...', 'cyan');

  const sitemaps = [
    '/sitemap.xml',
    '/sitemap-zh.xml',
    '/sitemap-en.xml',
    '/sitemap-ru.xml',
    '/sitemap-vi.xml',
    '/sitemap-th.xml',
    '/sitemap-id.xml',
];

  const results = [];

  for (const sitemap of sitemaps) {
    const url = `${SITE_URL}${sitemap}`;
    const result = await checkPageAccessibility(url);
    results.push({
      url: sitemap,
      accessible: result.accessible,
      status: result.status,
    });
    
    if (result.accessible) {
      log(`  ✅ ${sitemap} - 可访问 (${result.status})`, 'green');
    } else {
      log(`  ❌ ${sitemap} - 不可访问 (${result.status})`, 'red');
    }
  }
  
  return results;
}

// 检测主要页面可访问性
async function checkMainPages() {
  log('\n📄 检测主要页面可访问性...', 'cyan');
  
  const results = [];
  
  for (const page of MAIN_PAGES) {
    const url = `${SITE_URL}${page}`;
    const result = await checkPageAccessibility(url);
    results.push({
      url: page || '/',
      accessible: result.accessible,
      status: result.status,
    });
    
    if (result.accessible) {
      log(`  ✅ ${page || '/'} - 可访问 (${result.status})`, 'green');
    } else {
      log(`  ❌ ${page || '/'} - 不可访问 (${result.status})`, 'red');
    }
  }
  
  return results;
}

// 检测robots.txt
async function checkRobotsTxt() {
  log('\n🤖 检测 robots.txt...', 'cyan');
  
  const url = `${SITE_URL}/robots.txt`;
  const result = await checkPageAccessibility(url);
  
  if (result.accessible) {
    log(`  ✅ robots.txt - 可访问 (${result.status})`, 'green');
  } else {
    log(`  ❌ robots.txt - 不可访问 (${result.status})`, 'red');
  }
  
  return result;
}

// 生成检测报告
function generateReport(sitemapResults, pageResults, robotsResult) {
  const report = {
    timestamp: new Date().toISOString(),
    site: SITE_URL,
    domain: DOMAIN,
    sitemaps: {
      total: sitemapResults.length,
      accessible: sitemapResults.filter(r => r.accessible).length,
      inaccessible: sitemapResults.filter(r => !r.accessible).length,
      details: sitemapResults,
    },
    pages: {
      total: pageResults.length,
      accessible: pageResults.filter(r => r.accessible).length,
      inaccessible: pageResults.filter(r => !r.accessible).length,
      details: pageResults,
    },
    robots: {
      accessible: robotsResult.accessible,
      status: robotsResult.status,
    },
    searchEngines: {
      note: '由于搜索引擎没有公开的收录查询API，请手动访问以下链接检查收录情况：',
      links: Object.values(SEARCH_ENGINES).map(engine => ({
        name: engine.name,
        url: engine.siteUrl,
      })),
    },
  };
  
  return report;
}

// 主函数
async function main() {
  log('🔍 SEO 检测开始...', 'blue');
  log(`网站: ${SITE_URL}`, 'cyan');
  log(`域名: ${DOMAIN}\n`, 'cyan');
  
  // 检测sitemap
  const sitemapResults = await checkSitemaps();
  
  // 检测主要页面
  const pageResults = await checkMainPages();
  
  // 检测robots.txt
  const robotsResult = await checkRobotsTxt();
  
  // 生成报告
  const report = generateReport(sitemapResults, pageResults, robotsResult);
  
  // 输出摘要
  log('\n📊 检测摘要:', 'blue');
  log(`  Sitemap: ${report.sitemaps.accessible}/${report.sitemaps.total} 可访问`, 
    report.sitemaps.accessible === report.sitemaps.total ? 'green' : 'yellow');
  log(`  主要页面: ${report.pages.accessible}/${report.pages.total} 可访问`, 
    report.pages.accessible === report.pages.total ? 'green' : 'yellow');
  log(`  robots.txt: ${robotsResult.accessible ? '可访问' : '不可访问'}`, 
    robotsResult.accessible ? 'green' : 'red');
  
  // 搜索引擎收录检查提示
  log('\n🌐 搜索引擎收录检查:', 'blue');
  log('  由于搜索引擎没有公开的收录查询API，请手动访问以下链接检查收录情况：', 'yellow');
  report.searchEngines.links.forEach(link => {
    log(`  ${link.name}: ${link.url}`, 'cyan');
  });
  
  // 保存报告到文件
  const reportPath = path.join(__dirname, '..', 'docs', 'SEO_AUDIT_REPORT.json');
  const reportDir = path.dirname(reportPath);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  log(`\n📝 详细报告已保存到: ${reportPath}`, 'green');
  
  log('\n✅ SEO 检测完成!', 'green');
  }

// 运行
main().catch(error => {
  log(`\n❌ 检测过程中出现错误: ${error.message}`, 'red');
  process.exit(1);
});
