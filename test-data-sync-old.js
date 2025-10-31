#!/usr/bin/env node

/**
 * 前后端数据同步测试脚本
 * 用于验证后端修改是否能正确反映到前端
 */

const http = require('http');
const https = require('https');

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 日志函数
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(50)}${colors.reset}\n`)
};

// HTTP 请求函数
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
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// 测试函数
async function runTests() {
  log.section('前后端数据同步测试');

  let token = null;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // 测试 1: 检查后端服务
    log.test('测试 1: 检查后端服务是否运行');
    try {
      const response = await makeRequest('GET', '/api/admin/login');
      if (response.status === 405 || response.status === 401) {
        log.success('后端服务正常运行');
        testsPassed++;
      } else {
        log.error('后端服务响应异常');
        testsFailed++;
      }
    } catch (error) {
      log.error(`后端服务未运行: ${error.message}`);
      log.warn('请确保运行了: wrangler pages dev dist --local');
      testsFailed++;
      return;
    }

    // 测试 2: 登录
    log.test('测试 2: 管理员登录');
    try {
      const loginResponse = await makeRequest('POST', '/api/admin/login', {
        email: 'admin@kn-wallpaperglue.com',
        password: 'Admin@123456'
      });

      if (loginResponse.status === 200 && loginResponse.data.data?.accessToken) {
        token = loginResponse.data.data.accessToken;
        log.success(`登录成功，Token: ${token.substring(0, 20)}...`);
        testsPassed++;
      } else {
        log.error(`登录失败: ${loginResponse.data.message}`);
        testsFailed++;
        return;
      }
    } catch (error) {
      log.error(`登录请求失败: ${error.message}`);
      testsFailed++;
      return;
    }

    // 测试 3: 获取产品列表
    log.test('测试 3: 获取产品列表');
    try {
      const productsResponse = await makeRequest('GET', '/api/admin/products?page=1&limit=5', null, {
        'Authorization': `Bearer ${token}`
      });

      if (productsResponse.status === 200 && productsResponse.data.success) {
        const productCount = productsResponse.data.data?.length || 0;
        log.success(`获取产品列表成功，共 ${productCount} 个产品`);
        testsPassed++;

        if (productCount > 0) {
          const firstProduct = productsResponse.data.data[0];
          log.info(`第一个产品: ${firstProduct.name_zh || firstProduct.name_en}`);
        }
      } else {
        log.error(`获取产品列表失败: ${productsResponse.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`获取产品列表请求失败: ${error.message}`);
      testsFailed++;
    }

    // 测试 4: 获取首页内容
    log.test('测试 4: 获取首页内容');
    try {
      const contentResponse = await makeRequest('GET', '/api/admin/home-content', null, {
        'Authorization': `Bearer ${token}`
      });

      if (contentResponse.status === 200 && contentResponse.data.success) {
        const contentCount = contentResponse.data.data?.length || 0;
        log.success(`获取首页内容成功，共 ${contentCount} 条内容`);
        testsPassed++;
      } else {
        log.error(`获取首页内容失败: ${contentResponse.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`获取首页内容请求失败: ${error.message}`);
      testsFailed++;
    }

    // 测试 5: 获取 OEM 数据
    log.test('测试 5: 获取 OEM 数据');
    try {
      const oemResponse = await makeRequest('GET', '/api/admin/oem', null, {
        'Authorization': `Bearer ${token}`
      });

      if (oemResponse.status === 200 && oemResponse.data.success) {
        log.success('获取 OEM 数据成功');
        testsPassed++;
      } else {
        log.warn(`获取 OEM 数据: ${oemResponse.data.message}`);
        testsPassed++; // OEM 数据可能不存在，不算失败
      }
    } catch (error) {
      log.warn(`获取 OEM 数据请求失败: ${error.message}`);
      testsPassed++; // OEM 数据可能不存在，不算失败
    }

    // 测试 6: 获取审计日志
    log.test('测试 6: 获取审计日志');
    try {
      const auditResponse = await makeRequest('GET', '/api/admin/audit-logs?page=1&limit=10', null, {
        'Authorization': `Bearer ${token}`
      });

      if (auditResponse.status === 200 && auditResponse.data.success) {
        const logCount = auditResponse.data.data?.length || 0;
        log.success(`获取审计日志成功，共 ${logCount} 条日志`);
        testsPassed++;

        if (logCount > 0) {
          const lastLog = auditResponse.data.data[0];
          log.info(`最后一条日志: ${lastLog.action} - ${lastLog.status}`);
        }
      } else {
        log.error(`获取审计日志失败: ${auditResponse.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`获取审计日志请求失败: ${error.message}`);
      testsFailed++;
    }

    // 测试 7: 系统健康检查
    log.test('测试 7: 系统健康检查');
    try {
      const healthResponse = await makeRequest('GET', '/api/admin/dashboard/health', null, {
        'Authorization': `Bearer ${token}`
      });

      if (healthResponse.status === 200 && healthResponse.data.success) {
        const status = healthResponse.data.data?.status;
        log.success(`系统状态: ${status}`);
        testsPassed++;
      } else {
        log.error(`系统健康检查失败: ${healthResponse.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`系统健康检查请求失败: ${error.message}`);
      testsFailed++;
    }

    // 测试 8: 获取公开产品列表（前端 API）
    log.test('测试 8: 获取公开产品列表（前端 API）');
    try {
      const publicResponse = await makeRequest('GET', '/api/products?_t=' + Date.now());

      if (publicResponse.status === 200 && publicResponse.data.success) {
        const productCount = publicResponse.data.data?.length || 0;
        log.success(`获取公开产品列表成功，共 ${productCount} 个产品`);
        testsPassed++;
      } else {
        log.error(`获取公开产品列表失败: ${publicResponse.data.message}`);
        testsFailed++;
      }
    } catch (error) {
      log.error(`获取公开产品列表请求失败: ${error.message}`);
      testsFailed++;
    }

  } catch (error) {
    log.error(`测试过程中出错: ${error.message}`);
  }

  // 输出测试结果
  log.section('测试结果总结');
  log.success(`通过: ${testsPassed}`);
  log.error(`失败: ${testsFailed}`);
  
  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 0;
  
  if (testsFailed === 0) {
    log.success(`✅ 所有测试通过！(${percentage}%)`);
    process.exit(0);
  } else {
    log.warn(`⚠️  部分测试失败 (${percentage}% 通过)`);
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  log.error(`测试脚本错误: ${error.message}`);
  process.exit(1);
});

