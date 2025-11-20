#!/usr/bin/env node

/**
 * 服务器缓存清理脚本
 * 清理Cloudflare CDN缓存并验证清理状态
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

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
  log(`🚀 ${step}`, colors.cyan);
}

function execCommand(command, description) {
  logInfo(`执行: ${description}`);
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe', timeout: 60000 });
    logSuccess(`${description} 完成`);
    return result.trim();
  } catch (error) {
    logError(`${description} 失败: ${error.message}`);
    return null;
  }
}

// 检查网站缓存状态
function checkCacheStatus(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    const req = client.get(url, { timeout: 10000 }, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const headers = {
        statusCode: res.statusCode,
        cacheControl: res.headers['cache-control'],
        cfCacheStatus: res.headers['cf-cache-status'],
        expires: res.headers['expires'],
        etag: res.headers['etag'],
        lastModified: res.headers['last-modified'],
        responseTime: `${responseTime}ms`
      };

      resolve(headers);
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Timeout'));
    });
  });
}

// 主要缓存清理流程
async function clearServerCache() {
  log('🧹 服务器缓存清理工具', colors.bright);
  log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);

  try {
    // 1. 检查当前缓存状态
    logStep('1. 检查当前缓存状态');
    const urls = [
      'https://kn-wallpaperglue.com/',
      'https://kn-wallpaperglue.com/faq',
      'https://kn-wallpaperglue.com/products',
      'https://kn-wallpaperglue.com/_headers'
    ];

    const beforeStatus = [];
    for (const url of urls) {
      try {
        logInfo(`检查: ${url}`);
        const status = await checkCacheStatus(url);
        beforeStatus.push({ url, ...status });

        logInfo(`  状态码: ${status.statusCode}`);
        logInfo(`  缓存状态: ${status.cfCacheStatus || 'N/A'}`);
        logInfo(`  缓存控制: ${status.cacheControl || 'N/A'}`);
        logInfo(`  响应时间: ${status.responseTime}`);
      } catch (error) {
        logWarning(`  检查失败: ${error.message}`);
      }
    }

    // 2. 尝试清理缓存方法1: Wrangler CLI
    logStep('2. 使用Wrangler清理Cloudflare缓存');
    try {
      logInfo('检查Wrangler CLI...');
      execCommand('wrangler --version', '检查Wrangler版本');

      logInfo('清理缓存...');
      const purgeResult = execCommand(
        'npx wrangler cache purge --url="https://kn-wallpaperglue.com/*" --tag=production',
        'Cloudflare缓存清理'
      );

      if (purgeResult) {
        logSuccess('缓存清理成功（方法1）');
      } else {
        throw new Error('Wrangler清理失败');
      }
    } catch (error) {
      logWarning(`Wrangler清理失败: ${error.message}`);

      // 3. 尝试清理缓存方法2: 创建缓存破坏文件
      logStep('3. 使用缓存破坏方法');
      try {
        const cacheBusterData = {
          timestamp: Date.now(),
          version: Math.random().toString(36).substr(2, 9),
          action: 'cache_clear',
          deployTime: new Date().toISOString()
        };

        const fs = require('fs');
        const path = require('path');
        const cacheBusterPath = path.join(process.cwd(), 'dist', 'cache-buster.json');

        // 确保dist目录存在
        const distPath = path.join(process.cwd(), 'dist');
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }

        fs.writeFileSync(cacheBusterPath, JSON.stringify(cacheBusterData, null, 2));
        logSuccess('缓存破坏文件已创建');

        // 尝试部署缓存破坏文件
        const deployResult = execCommand(
          `npx wrangler pages deploy "${cacheBusterPath}" --project-name="kn-wallpaperglue"`,
          '部署缓存破坏文件'
        );

        if (deployResult) {
          logSuccess('缓存清理成功（方法2）');
        }
      } catch (busterError) {
        logWarning(`缓存破坏方法失败: ${busterError.message}`);
      }
    }

    // 4. 等待缓存清理生效
    logStep('4. 等待缓存清理生效');
    logInfo('等待10秒让缓存清理生效...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 5. 验证缓存清理结果
    logStep('5. 验证缓存清理结果');
    const afterStatus = [];
    for (const url of urls) {
      try {
        logInfo(`验证: ${url}`);
        const status = await checkCacheStatus(url);
        afterStatus.push({ url, ...status });

        logInfo(`  状态码: ${status.statusCode}`);
        logInfo(`  缓存状态: ${status.cfCacheStatus || 'N/A'}`);
        logInfo(`  响应时间: ${status.responseTime}`);

        // 检查缓存是否真的被清理了
        if (status.cfCacheStatus === 'MISS' || status.cfCacheStatus === 'DYNAMIC') {
          logSuccess(`  ✓ 缓存已清理`);
        } else if (status.cfCacheStatus === 'HIT') {
          logWarning(`  ⚠ 缓存仍然命中，可能需要更多时间`);
        } else {
          logInfo(`  ℹ 缓存状态: ${status.cfCacheStatus}`);
        }
      } catch (error) {
        logWarning(`  验证失败: ${error.message}`);
      }
    }

    // 6. 生成清理报告
    logStep('6. 缓存清理报告');
    logSuccess('缓存清理流程完成！');
    log('\n📊 清理结果对比:', colors.blue);

    log('\n清理前状态:', colors.cyan);
    beforeStatus.forEach(item => {
      log(`  ${item.url}: ${item.cfCacheStatus || 'N/A'} (${item.responseTime})`, colors.yellow);
    });

    log('\n清理后状态:', colors.cyan);
    afterStatus.forEach(item => {
      const status = item.cfCacheStatus || 'N/A';
      const icon = status === 'MISS' ? '✅' : status === 'DYNAMIC' ? '🔄' : status === 'HIT' ? '⚠️' : '❓';
      log(`  ${item.url}: ${icon} ${status} (${item.responseTime})`, colors.yellow);
    });

    // 7. 建议后续操作
    log('\n💡 后续建议:', colors.blue);
    log('1. 如果某些页面仍显示HIT，请等待1-2分钟再测试', colors.yellow);
    log('2. 可以使用Ctrl+F5强制刷新浏览器缓存', colors.yellow);
    log('3. 移动端可能需要更长时间清理缓存', colors.yellow);
    log('4. 如需彻底清理，可以在Cloudflare控制台手动清理', colors.yellow);

    logSuccess('\n🎉 缓存清理任务完成！');

  } catch (error) {
    logError(`缓存清理失败: ${error.message}`);

    // 提供手动清理建议
    log('\n🔧 手动清理方法:', colors.cyan);
    log('1. 访问 Cloudflare Dashboard', colors.yellow);
    log('2. 选择您的域名 kn-wallpaperglue.com', colors.yellow);
    log('3. 点击 "Caching" → "Configuration"', colors.yellow);
    log('4. 找到 "Purge Cache" 部分', colors.yellow);
    log('5. 选择 "Custom purge" 并输入: kn-wallpaperglue.com/*', colors.yellow);
    log('6. 点击 "Purge"', colors.yellow);
  }
}

// 主函数
function main() {
  clearServerCache().catch(error => {
    logError(`脚本执行失败: ${error.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.clearServerCache = clearServerCache;