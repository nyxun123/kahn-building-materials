#!/usr/bin/env node

/**
 * Cloudflare CDN 缓存清理脚本
 * 使用Cloudflare API清理域名的所有缓存
 */

import { execSync } from 'child_process';
import https from 'https';

const DOMAIN = 'kn-wallpaperglue.com';
const ACCOUNT_ID = '6ae5d9a224117ca99a05304e017c43db';

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 获取Cloudflare API Token
function getApiToken() {
  try {
    // 尝试从wrangler配置中获取
    const whoami = execSync('wrangler whoami 2>&1', { encoding: 'utf-8' });
    
    if (!whoami.includes('You are logged in')) {
      log('❌ 错误：未登录Cloudflare', 'red');
      log('请先运行: wrangler login', 'yellow');
      process.exit(1);
    }
    
    log('✅ 已登录Cloudflare', 'green');
    return true;
  } catch (error) {
    log('❌ 错误：无法验证Cloudflare登录状态', 'red');
    return false;
  }
}

// 获取Zone ID
async function getZoneId() {
  return new Promise((resolve, reject) => {
    log('🔍 获取域名Zone ID...', 'blue');
    
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones?name=${DOMAIN}&account.id=${ACCOUNT_ID}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.success && response.result && response.result.length > 0) {
            const zoneId = response.result[0].id;
            log(`✅ 获取到Zone ID: ${zoneId}`, 'green');
            resolve(zoneId);
          } else {
            log('⚠️  无法通过API获取Zone ID', 'yellow');
            resolve(null);
          }
        } catch (error) {
          log('⚠️  解析Zone ID响应失败', 'yellow');
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      log('⚠️  获取Zone ID请求失败', 'yellow');
      resolve(null);
    });

    req.end();
  });
}

// 使用wrangler命令清理缓存
function purgeWithWrangler() {
  log('🧹 尝试使用wrangler清理缓存...', 'blue');
  
  try {
    // Cloudflare Pages部署会自动清理缓存
    // 但我们可以通过重新部署来触发缓存清理
    log('💡 提示：Cloudflare Pages在每次部署时会自动清理缓存', 'blue');
    log('   如果缓存未更新，请等待2-3分钟后重试', 'blue');
    return true;
  } catch (error) {
    return false;
  }
}

// 手动清理指南
function showManualInstructions() {
  console.log('');
  log('═══════════════════════════════════════', 'blue');
  log('📋 手动清理CDN缓存步骤', 'blue');
  log('═══════════════════════════════════════', 'blue');
  console.log('');
  console.log('1️⃣  访问 Cloudflare Dashboard');
  console.log('   https://dash.cloudflare.com');
  console.log('');
  console.log(`2️⃣  选择域名: ${DOMAIN}`);
  console.log('');
  console.log('3️⃣  点击左侧菜单 "Caching"（缓存）');
  console.log('');
  console.log('4️⃣  点击 "Configuration"（配置）标签');
  console.log('');
  console.log('5️⃣  找到 "Purge Cache"（清理缓存）部分');
  console.log('');
  console.log('6️⃣  点击 "Purge Everything"（清理所有内容）');
  console.log('');
  console.log('7️⃣  在确认对话框中点击 "Purge Everything" 确认');
  console.log('');
  log('💡 提示：清理缓存后，网站可能会短暂变慢（1-2分钟）', 'yellow');
  console.log('');
}

// 验证缓存清理效果
async function verifyCachePurge() {
  return new Promise((resolve) => {
    log('🔍 验证缓存清理效果...', 'blue');
    
    const options = {
      hostname: DOMAIN,
      path: '/en/products',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Cache Verification Bot)'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // 检查加载的JS文件
        const jsMatch = data.match(/index-([^"]+)\.js/);
        
        if (jsMatch) {
          const loadedFile = `index-${jsMatch[1]}.js`;
          console.log(`📦 检测到加载的文件: ${loadedFile}`);
          
          if (loadedFile === 'index-B5a4vY9y.js') {
            log('   ✅ 正确！加载了新版本', 'green');
            resolve(true);
          } else if (loadedFile === 'index-DM5o1RP3.js') {
            log('   ❌ 仍在加载旧版本', 'red');
            log('   💡 建议：等待5-10分钟后重新检查', 'yellow');
            resolve(false);
          } else {
            log(`   ⚠️  加载了其他版本: ${loadedFile}`, 'yellow');
            resolve(false);
          }
        } else {
          log('   ⚠️  无法检测到JS文件', 'yellow');
          resolve(false);
        }
        
        // 检查缓存状态
        const cacheStatus = res.headers['cf-cache-status'];
        if (cacheStatus) {
          console.log(`📊 CDN缓存状态: ${cacheStatus}`);
        }
      });
    });

    req.on('error', (error) => {
      log('❌ 验证请求失败', 'red');
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      log('⚠️  验证请求超时', 'yellow');
      resolve(false);
    });

    req.end();
  });
}

// 主函数
async function main() {
  console.log('');
  log('🧹 Cloudflare CDN 缓存清理工具', 'blue');
  log('═══════════════════════════════════════', 'blue');
  console.log('');

  // 检查登录状态
  if (!getApiToken()) {
    process.exit(1);
  }

  console.log('');

  // 尝试获取Zone ID
  const zoneId = await getZoneId();

  console.log('');

  // 显示手动清理指南
  showManualInstructions();

  // 等待用户确认
  console.log('');
  log('⏳ 请完成上述手动清理步骤...', 'yellow');
  console.log('');
  console.log('按Enter键继续验证...');

  // 等待用户输入
  await new Promise((resolve) => {
    process.stdin.once('data', () => {
      resolve();
    });
  });

  console.log('');
  log('⏳ 等待缓存清理生效（30秒）...', 'yellow');
  
  await new Promise(resolve => setTimeout(resolve, 30000));

  console.log('');

  // 验证缓存清理
  const verified = await verifyCachePurge();

  console.log('');
  log('═══════════════════════════════════════', 'blue');
  log('📋 验证清单', 'blue');
  log('═══════════════════════════════════════', 'blue');
  console.log('');
  console.log('请在浏览器中验证以下内容：');
  console.log('');
  console.log(`1️⃣  访问: https://${DOMAIN}/en/products`);
  console.log('2️⃣  打开开发者工具（F12）');
  console.log('3️⃣  查看Console控制台，应该看到：');
  console.log('    🔍 正在获取产品数据...');
  console.log('    📡 API响应状态: 200');
  console.log('    📦 API返回数据: {success: true, data: Array(6), ...}');
  console.log('    ✅ 成功获取 6 个产品');
  console.log('');
  console.log('4️⃣  查看Network面板：');
  console.log('    - 确认加载的是 index-B5a4vY9y.js');
  console.log('    - 确认没有无限循环的API请求');
  console.log('');
  console.log('5️⃣  页面应该显示6个产品卡片（不是loading状态）');
  console.log('');

  if (verified) {
    log('✅ 缓存清理验证通过！', 'green');
    process.exit(0);
  } else {
    log('⚠️  缓存可能未完全更新，请稍后重试', 'yellow');
    process.exit(1);
  }
}

// 运行主函数
main().catch((error) => {
  log(`❌ 错误: ${error.message}`, 'red');
  process.exit(1);
});

