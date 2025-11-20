#!/usr/bin/env node

/**
 * 自动提交 Sitemap 到搜索引擎的辅助脚本
 * 
 * 注意：此脚本无法直接操作搜索引擎控制台（需要登录），
 * 但可以帮助验证 sitemap 文件是否可访问，并提供提交命令。
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://kn-wallpaperglue.com';
const SITEMAPS = [
  'sitemap.xml',
  'sitemap-zh.xml',
  'sitemap-en.xml',
  'sitemap-ru.xml',
  'sitemap-vi.xml',
  'sitemap-th.xml',
  'sitemap-id.xml',
];

/**
 * 检查 URL 是否可访问
 */
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          size: data.length,
          valid: res.statusCode === 200 && res.headers['content-type']?.includes('xml'),
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * 验证所有 sitemap 文件
 */
async function validateSitemaps() {
  console.log('🔍 开始验证 sitemap 文件...\n');
  
  const results = [];
  
  for (const sitemap of SITEMAPS) {
    const url = `${SITE_URL}/${sitemap}`;
    try {
      const result = await checkUrl(url);
      results.push({
        sitemap,
        url,
        ...result,
      });
      
      if (result.valid) {
        console.log(`✅ ${sitemap}: 可访问 (${result.statusCode}, ${result.contentType})`);
      } else {
        console.log(`⚠️  ${sitemap}: 可访问但格式可能不正确 (${result.statusCode}, ${result.contentType})`);
      }
    } catch (error) {
      results.push({
        sitemap,
        url,
        error: error.message,
        valid: false,
      });
      console.log(`❌ ${sitemap}: 无法访问 - ${error.message}`);
    }
  }
  
  console.log('\n📊 验证结果汇总:');
  const validCount = results.filter(r => r.valid).length;
  const totalCount = results.length;
  console.log(`   成功: ${validCount}/${totalCount}`);
  
  if (validCount === totalCount) {
    console.log('\n✅ 所有 sitemap 文件验证通过！可以提交到搜索引擎控制台。\n');
    console.log('📝 下一步操作：');
    console.log('   1. 按照 scripts/automate-search-console-operations.md 中的指南操作');
    console.log('   2. 或使用浏览器自动化工具执行操作\n');
  } else {
    console.log('\n⚠️  部分 sitemap 文件验证失败，请检查部署状态。\n');
  }
  
  return results;
}

/**
 * 生成提交命令
 */
function generateSubmitCommands() {
  console.log('\n📋 搜索引擎控制台提交命令参考：\n');
  
  console.log('Google Search Console:');
  console.log('  1. 访问: https://search.google.com/search-console');
  console.log('  2. 进入 "站点地图" 部分');
  console.log('  3. 提交: sitemap.xml\n');
  
  console.log('Bing Webmaster Tools:');
  console.log('  1. 访问: https://www.bing.com/webmasters');
  console.log('  2. 进入 "站点地图" 部分');
  console.log('  3. 提交: https://kn-wallpaperglue.com/sitemap.xml\n');
  
  console.log('Yandex Webmaster:');
  console.log('  1. 访问: https://webmaster.yandex.com');
  console.log('  2. 进入 "索引" → "站点地图文件"');
  console.log('  3. 提交: https://kn-wallpaperglue.com/sitemap.xml\n');
}

// 主函数
async function main() {
  console.log('🚀 Sitemap 验证和提交辅助工具\n');
  console.log(`网站: ${SITE_URL}\n`);
  
  try {
    await validateSitemaps();
    generateSubmitCommands();
  } catch (error) {
    console.error('❌ 执行出错:', error.message);
    process.exit(1);
  }
}

// 运行
main();

export { validateSitemaps, checkUrl };

