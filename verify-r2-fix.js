#!/usr/bin/env node

/**
 * 验证 R2 修复是否成功
 */

const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
};

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8788,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function verifyR2Fix() {
  log.section('🔍 R2 修复验证');

  try {
    // 步骤 1: 登录
    log.info('步骤 1: 登录管理员账户...');
    const loginResponse = await makeRequest('POST', '/api/admin/login', {
      email: 'admin@kn-wallpaperglue.com',
      password: 'Admin@123456'
    });

    if (loginResponse.status !== 200 || !loginResponse.data.data?.accessToken) {
      log.error('登录失败');
      return;
    }

    const token = loginResponse.data.data.accessToken;
    log.success(`登录成功，Token: ${token.substring(0, 30)}...`);

    // 步骤 2: 获取产品列表
    log.info('步骤 2: 获取产品列表...');
    const productsResponse = await makeRequest('GET', '/api/admin/products?page=1&limit=5', null, {
      'Authorization': `Bearer ${token}`
    });

    if (productsResponse.status !== 200) {
      log.error('获取产品列表失败');
      return;
    }

    const products = productsResponse.data.data || [];
    log.success(`获取产品列表成功，共 ${products.length} 个产品`);

    if (products.length === 0) {
      log.warn('没有产品数据，无法验证图片 URL');
      return;
    }

    // 步骤 3: 检查产品图片 URL
    log.info('步骤 3: 检查产品图片 URL...');
    
    let r2UrlCount = 0;
    let base64UrlCount = 0;
    let noUrlCount = 0;

    products.forEach((product, index) => {
      const imageUrl = product.image_url;
      
      if (!imageUrl) {
        noUrlCount++;
        log.warn(`产品 ${index + 1} (${product.name_zh}): 没有图片 URL`);
      } else if (imageUrl.includes('r2.dev')) {
        r2UrlCount++;
        log.success(`产品 ${index + 1} (${product.name_zh}): ✅ R2 URL`);
        console.log(`  URL: ${imageUrl.substring(0, 80)}...`);
      } else if (imageUrl.startsWith('data:')) {
        base64UrlCount++;
        log.error(`产品 ${index + 1} (${product.name_zh}): ❌ Base64 URL (修复未成功)`);
      } else {
        log.warn(`产品 ${index + 1} (${product.name_zh}): 未知 URL 格式`);
      }
    });

    // 步骤 4: 总结结果
    log.section('📊 验证结果');
    
    console.log(`R2 URL 数量: ${r2UrlCount}/${products.length}`);
    console.log(`Base64 URL 数量: ${base64UrlCount}/${products.length}`);
    console.log(`无 URL 数量: ${noUrlCount}/${products.length}`);

    if (r2UrlCount > 0 && base64UrlCount === 0) {
      log.success('✅ R2 修复成功！所有图片都使用 R2 URL');
      log.info('现在你可以在前端验证图片是否正确显示');
    } else if (base64UrlCount > 0) {
      log.error('❌ R2 修复未成功，仍有图片使用 Base64 URL');
      log.warn('请检查后端日志中是否有 "R2存储桶未配置" 的消息');
    } else {
      log.warn('⚠️  无法确定修复状态，请手动检查');
    }

  } catch (error) {
    log.error(`验证过程中出错: ${error.message}`);
    log.warn('请确保后端服务已启动: wrangler pages dev dist --local');
  }
}

verifyR2Fix();

