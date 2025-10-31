#!/usr/bin/env node

/**
 * 第一阶段修复 API 测试脚本
 * 
 * 用途: 验证所有 API 修复是否正确工作
 * 使用: node test-phase1-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:8788';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testLogin() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  测试 1: 登录 API (问题 2 & 3)          ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  try {
    log('\n📝 发送登录请求...', 'cyan');
    const response = await makeRequest('POST', '/api/admin/login', {
      email: 'admin@kn-wallpaperglue.com',
      password: 'Admin@123456'
    });

    log(`✓ 状态码: ${response.status}`, 'green');

    // 验证响应格式
    const body = response.body;
    const requiredFields = ['success', 'code', 'message', 'data', 'timestamp'];
    const missingFields = requiredFields.filter(f => !(f in body));

    if (missingFields.length > 0) {
      log(`❌ 缺少字段: ${missingFields.join(', ')}`, 'red');
      return { success: false, token: null };
    }

    log('✓ 响应格式正确', 'green');
    log(`  - success: ${body.success}`, 'yellow');
    log(`  - code: ${body.code}`, 'yellow');
    log(`  - message: ${body.message}`, 'yellow');
    log(`  - timestamp: ${body.timestamp}`, 'yellow');

    if (body.data && body.data.accessToken) {
      log(`✓ 获得 Token: ${body.data.accessToken.substring(0, 50)}...`, 'green');
      return { success: true, token: body.data.accessToken };
    } else {
      log('❌ 响应中没有 accessToken', 'red');
      return { success: false, token: null };
    }
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    return { success: false, token: null };
  }
}

async function testGetContents(token) {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  测试 2: 获取内容列表 (问题 2 & 3)      ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  try {
    log('\n📝 发送获取内容请求...', 'cyan');
    const response = await makeRequest('GET', '/api/admin/contents', null, {
      'Authorization': `Bearer ${token}`
    });

    log(`✓ 状态码: ${response.status}`, 'green');

    // 验证响应格式
    const body = response.body;
    const requiredFields = ['success', 'code', 'message', 'data', 'timestamp'];
    const missingFields = requiredFields.filter(f => !(f in body));

    if (missingFields.length > 0) {
      log(`❌ 缺少字段: ${missingFields.join(', ')}`, 'red');
      return false;
    }

    log('✓ 响应格式正确', 'green');
    log(`  - success: ${body.success}`, 'yellow');
    log(`  - code: ${body.code}`, 'yellow');
    log(`  - message: ${body.message}`, 'yellow');
    log(`  - data 类型: ${Array.isArray(body.data) ? 'Array' : typeof body.data}`, 'yellow');
    log(`  - timestamp: ${body.timestamp}`, 'yellow');

    if (body.pagination) {
      log(`  - pagination: page=${body.pagination.page}, total=${body.pagination.total}`, 'yellow');
    }

    return true;
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    return false;
  }
}

async function testNoAuth() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  测试 3: 无认证请求 (问题 3)            ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  try {
    log('\n📝 发送无 Token 的请求...', 'cyan');
    const response = await makeRequest('GET', '/api/admin/contents');

    log(`✓ 状态码: ${response.status}`, 'green');

    if (response.status === 401) {
      log('✓ 正确拒绝无认证请求 (401)', 'green');
      return true;
    } else {
      log(`❌ 应该返回 401，但返回 ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    return false;
  }
}

async function testInvalidAuth() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  测试 4: 无效认证请求 (问题 3)          ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  try {
    log('\n📝 发送无效 Token 的请求...', 'cyan');
    const response = await makeRequest('GET', '/api/admin/contents', null, {
      'Authorization': 'Bearer invalid-token-12345'
    });

    log(`✓ 状态码: ${response.status}`, 'green');

    if (response.status === 401) {
      log('✓ 正确拒绝无效认证请求 (401)', 'green');
      return true;
    } else {
      log(`❌ 应该返回 401，但返回 ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║   第一阶段修复 API 测试                  ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  log('\n⏳ 等待服务器就绪...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const results = {};

  // 测试登录
  const loginResult = await testLogin();
  results.login = loginResult.success;

  if (!loginResult.token) {
    log('\n❌ 登录失败，无法继续测试', 'red');
    return;
  }

  // 测试获取内容
  results.getContents = await testGetContents(loginResult.token);

  // 测试无认证
  results.noAuth = await testNoAuth();

  // 测试无效认证
  results.invalidAuth = await testInvalidAuth();

  // 总结
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║   测试总结                              ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  log(`\n登录 API: ${results.login ? '✅ 通过' : '❌ 失败'}`, results.login ? 'green' : 'red');
  log(`获取内容: ${results.getContents ? '✅ 通过' : '❌ 失败'}`, results.getContents ? 'green' : 'red');
  log(`无认证拒绝: ${results.noAuth ? '✅ 通过' : '❌ 失败'}`, results.noAuth ? 'green' : 'red');
  log(`无效认证拒绝: ${results.invalidAuth ? '✅ 通过' : '❌ 失败'}`, results.invalidAuth ? 'green' : 'red');

  const allPassed = Object.values(results).every(r => r);
  log(`\n总体结果: ${allPassed ? '✅ 所有测试通过' : '❌ 部分测试失败'}`, allPassed ? 'green' : 'red');
}

runAllTests().catch(error => {
  log(`\n❌ 测试失败: ${error.message}`, 'red');
  process.exit(1);
});

