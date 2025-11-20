#!/usr/bin/env node
/**
 * 自动提交 Sitemap 到搜索引擎
 * 
 * 使用方法：
 * 运行: node scripts/submit-sitemaps.js
 * 
 * 注意：这只是通知搜索引擎，正式提交需要在各自的 Webmaster 工具中完成
 */

import https from 'https';
import http from 'http';

const SITEMAP_URL = 'https://kn-wallpaperglue.com/sitemap.xml';
const SITE_URL = 'https://kn-wallpaperglue.com';

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

// 1. Google Search Console - 通过 Ping 服务
async function pingGoogle() {
  return new Promise((resolve) => {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    
    log('\n📤 正在通知 Google...', 'cyan');
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Google 已收到 sitemap 通知', 'green');
          log('   注意：这只是一个通知，您仍需要在 Search Console 中正式提交', 'yellow');
        } else {
          log(`⚠️  Google 响应状态码: ${res.statusCode}`, 'yellow');
        }
        resolve();
      });
    }).on('error', (err) => {
      log(`❌ Google ping 失败: ${err.message}`, 'red');
      resolve();
    });
  });
}

// 2. Bing Webmaster - 通过 Ping 服务
async function pingBing() {
  return new Promise((resolve) => {
    const url = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    
    log('\n📤 正在通知 Bing...', 'cyan');
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Bing 已收到 sitemap 通知', 'green');
          log('   注意：这只是一个通知，您仍需要在 Webmaster Tools 中正式提交', 'yellow');
        } else {
          log(`⚠️  Bing 响应状态码: ${res.statusCode}`, 'yellow');
        }
        resolve();
      });
    }).on('error', (err) => {
      log(`❌ Bing ping 失败: ${err.message}`, 'red');
      resolve();
    });
  });
}

// 3. Yandex Webmaster - 通过 Ping 服务
async function pingYandex() {
  return new Promise((resolve) => {
    const url = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    
    log('\n📤 正在通知 Yandex...', 'cyan');
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          log('✅ Yandex 已收到 sitemap 通知', 'green');
          log('   注意：这只是一个通知，您仍需要在 Webmaster 中正式提交', 'yellow');
        } else {
          log(`⚠️  Yandex 响应状态码: ${res.statusCode}`, 'yellow');
        }
        resolve();
      });
    }).on('error', (err) => {
      log(`❌ Yandex ping 失败: ${err.message}`, 'red');
      resolve();
    });
  });
}

// 验证 sitemap 是否可访问
async function verifySitemap() {
  return new Promise((resolve) => {
    log('\n🔍 验证 sitemap 可访问性...', 'cyan');
    
    https.get(SITEMAP_URL, (res) => {
      if (res.statusCode === 200) {
        log(`✅ Sitemap 可访问: ${SITEMAP_URL}`, 'green');
        resolve(true);
      } else {
        log(`❌ Sitemap 返回状态码: ${res.statusCode}`, 'red');
        resolve(false);
      }
    }).on('error', (err) => {
      log(`❌ 无法访问 sitemap: ${err.message}`, 'red');
      resolve(false);
    });
  });
}

// 主函数
async function main() {
  log('\n🚀 开始自动提交 Sitemap 到搜索引擎', 'blue');
  log('═══════════════════════════════════════', 'blue');
  
  // 验证 sitemap
  const sitemapAccessible = await verifySitemap();
  if (!sitemapAccessible) {
    log('\n⚠️  警告：Sitemap 无法访问，请先确保网站已部署', 'yellow');
    log('   继续执行 ping 操作...\n', 'yellow');
  }
  
  // 执行 ping
  await pingGoogle();
  await pingBing();
  await pingYandex();
  
  log('\n═══════════════════════════════════════', 'blue');
  log('📋 后续步骤：', 'cyan');
  log('', 'reset');
  log('1. Google Search Console:', 'yellow');
  log('   - 访问: https://search.google.com/search-console', 'reset');
  log('   - 添加属性: kn-wallpaperglue.com', 'reset');
  log('   - 验证所有权后，在 "Sitemaps" 中提交: sitemap.xml', 'reset');
  log('', 'reset');
  log('2. Bing Webmaster Tools:', 'yellow');
  log('   - 访问: https://www.bing.com/webmasters', 'reset');
  log('   - 添加网站后，在 "Sitemaps" 中提交:', 'reset');
  log(`   - URL: ${SITEMAP_URL}`, 'reset');
  log('', 'reset');
  log('3. Yandex Webmaster:', 'yellow');
  log('   - 访问: https://webmaster.yandex.com', 'reset');
  log('   - 添加网站后，在 "索引" → "Sitemap 文件" 中提交:', 'reset');
  log(`   - URL: ${SITEMAP_URL}`, 'reset');
  log('', 'reset');
  log('💡 提示：Ping 服务只是通知搜索引擎，正式提交需要在各自的 Webmaster 工具中完成', 'cyan');
  log('', 'reset');
}

// 运行
main().catch(console.error);

