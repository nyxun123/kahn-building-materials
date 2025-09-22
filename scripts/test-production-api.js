#!/usr/bin/env node

/**
 * 生产环境API测试脚本
 * 测试 kn-wallpaperglue.com 的API端点功能
 */

import https from 'https';

const BASE_URL = 'https://kn-wallpaperglue.com';
const TEST_CASES = [
  {
    name: '首页访问测试',
    path: '/',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: '产品API测试',
    path: '/api/products',
    method: 'GET', 
    expectedStatus: 200
  },
  {
    name: '联系表单API测试',
    path: '/api/contact',
    method: 'POST',
    expectedStatus: 400, // 期望400因为缺少必要参数
    data: JSON.stringify({ test: true })
  },
  {
    name: '管理登录API测试',
    path: '/api/admin/login',
    method: 'POST',
    expectedStatus: 400, // 期望400因为缺少凭证
    data: JSON.stringify({})
  }
];

function testEndpoint(testCase) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: testCase.path,
      method: testCase.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Production-API-Tester/1.0'
      }
    };

    if (testCase.data) {
      options.headers['Content-Length'] = Buffer.byteLength(testCase.data);
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const success = res.statusCode === testCase.expectedStatus;
        const result = {
          name: testCase.name,
          url: BASE_URL + testCase.path,
          method: testCase.method,
          expected: testCase.expectedStatus,
          actual: res.statusCode,
          success: success,
          headers: res.headers,
          body: data.length > 500 ? data.substring(0, 500) + '...' : data
        };

        if (success) {
          console.log(`✅ ${testCase.name}: ${res.statusCode} OK`);
        } else {
          console.log(`❌ ${testCase.name}: 期望 ${testCase.expectedStatus}, 实际 ${res.statusCode}`);
          console.log(`   响应: ${data.substring(0, 200)}...`);
        }

        resolve(result);
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${testCase.name}: 请求错误 - ${error.message}`);
      resolve({
        name: testCase.name,
        url: BASE_URL + testCase.path,
        error: error.message,
        success: false
      });
    });

    if (testCase.data) {
      req.write(testCase.data);
    }

    req.end();
  });
}

async function runAllTests() {
  console.log('🚀 开始生产环境API测试');
  console.log('🌐 测试域名: kn-wallpaperglue.com');
  console.log('=' .repeat(60));

  const results = [];
  
  for (const testCase of TEST_CASES) {
    const result = await testEndpoint(testCase);
    results.push(result);
    // 添加短暂延迟避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '=' .repeat(60));
  console.log('📊 测试结果汇总:');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📈 总计: ${results.length}`);

  // 显示详细错误信息
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('\n🔍 失败详情:');
    failures.forEach((failure, index) => {
      console.log(`${index + 1}. ${failure.name}`);
      if (failure.error) {
        console.log(`   错误: ${failure.error}`);
      } else {
        console.log(`   期望: HTTP ${failure.expected}`);
        console.log(`   实际: HTTP ${failure.actual}`);
      }
    });
  }

  console.log('\n💡 建议:');
  if (failures.length > 0) {
    console.log('1. 检查 Cloudflare Pages Functions 配置');
    console.log('2. 验证 _worker.js 文件是否正确部署');
    console.log('3. 检查环境变量设置');
    console.log('4. 查看 Cloudflare Dashboard 中的 Functions 日志');
  } else {
    console.log('🎉 所有测试通过！生产环境API正常工作。');
  }

  return results;
}

// 执行测试
runAllTests().catch(console.error);