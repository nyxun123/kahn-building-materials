/**
 * 第一阶段修复验证测试脚本
 * 
 * 用途: 验证所有 3 个严重问题的修复是否正确
 * 
 * 使用方法:
 * 1. 在浏览器控制台中运行此脚本
 * 2. 或在 Node.js 中运行: node test-phase1-fixes.js
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8787';
const TEST_TOKEN = process.env.TEST_TOKEN || 'your-test-token-here';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// 问题 1: 图片上传返回值不匹配
// ============================================

async function testImageUploadResponse() {
  log('\n=== 测试问题 1: 图片上传返回值 ===', 'blue');
  
  try {
    // 创建测试图片
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 100, 100);
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const formData = new FormData();
    formData.append('file', blob, 'test.png');
    
    const response = await fetch(`${API_BASE_URL}/api/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    // 验证响应格式
    if (!data.url) {
      log('❌ 失败: 响应中缺少 url 字段', 'red');
      log(`响应数据: ${JSON.stringify(data)}`, 'yellow');
      return false;
    }
    
    log('✅ 成功: 响应包含 url 字段', 'green');
    log(`URL: ${data.url}`, 'yellow');
    return true;
    
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    return false;
  }
}

// ============================================
// 问题 2: API 响应格式不统一
// ============================================

async function testApiResponseFormat() {
  log('\n=== 测试问题 2: API 响应格式 ===', 'blue');
  
  const endpoints = [
    { method: 'GET', url: '/api/admin/contents', name: '获取内容' },
    { method: 'GET', url: '/api/admin/products', name: '获取产品' },
    { method: 'POST', url: '/api/admin/login', name: '登录', body: { username: 'admin', password: 'password' } }
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`, options);
      const data = await response.json();
      
      // 验证响应格式
      const requiredFields = ['success', 'code', 'message', 'data', 'timestamp'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        log(`❌ ${endpoint.name}: 缺少字段 ${missingFields.join(', ')}`, 'red');
        allPassed = false;
      } else {
        log(`✅ ${endpoint.name}: 响应格式正确`, 'green');
      }
      
    } catch (error) {
      log(`❌ ${endpoint.name}: ${error.message}`, 'red');
      allPassed = false;
    }
  }
  
  return allPassed;
}

// ============================================
// 问题 3: 认证机制混乱
// ============================================

async function testAuthenticationMechanism() {
  log('\n=== 测试问题 3: 认证机制 ===', 'blue');
  
  let allPassed = true;
  
  // 测试 1: 无 token 请求应该被拒绝
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/contents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      log('✅ 无 token 请求被正确拒绝 (401)', 'green');
    } else {
      log(`❌ 无 token 请求应该返回 401，但返回 ${response.status}`, 'red');
      allPassed = false;
    }
  } catch (error) {
    log(`❌ 测试无 token 请求失败: ${error.message}`, 'red');
    allPassed = false;
  }
  
  // 测试 2: 无效 token 请求应该被拒绝
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/contents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    if (response.status === 401) {
      log('✅ 无效 token 请求被正确拒绝 (401)', 'green');
    } else {
      log(`❌ 无效 token 请求应该返回 401，但返回 ${response.status}`, 'red');
      allPassed = false;
    }
  } catch (error) {
    log(`❌ 测试无效 token 请求失败: ${error.message}`, 'red');
    allPassed = false;
  }
  
  // 测试 3: 有效 token 请求应该成功
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/contents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (response.status === 200) {
      log('✅ 有效 token 请求成功 (200)', 'green');
    } else {
      log(`❌ 有效 token 请求应该返回 200，但返回 ${response.status}`, 'red');
      allPassed = false;
    }
  } catch (error) {
    log(`❌ 测试有效 token 请求失败: ${error.message}`, 'red');
    allPassed = false;
  }
  
  return allPassed;
}

// ============================================
// 主测试函数
// ============================================

async function runAllTests() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║   第一阶段修复验证测试                  ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  
  const results = {
    problem1: await testImageUploadResponse(),
    problem2: await testApiResponseFormat(),
    problem3: await testAuthenticationMechanism()
  };
  
  // 总结
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║   测试总结                              ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  
  log(`问题 1 (图片上传): ${results.problem1 ? '✅ 通过' : '❌ 失败'}`, results.problem1 ? 'green' : 'red');
  log(`问题 2 (API 格式): ${results.problem2 ? '✅ 通过' : '❌ 失败'}`, results.problem2 ? 'green' : 'red');
  log(`问题 3 (认证机制): ${results.problem3 ? '✅ 通过' : '❌ 失败'}`, results.problem3 ? 'green' : 'red');
  
  const allPassed = results.problem1 && results.problem2 && results.problem3;
  log(`\n总体结果: ${allPassed ? '✅ 所有测试通过' : '❌ 部分测试失败'}`, allPassed ? 'green' : 'red');
  
  return allPassed;
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testImageUploadResponse,
    testApiResponseFormat,
    testAuthenticationMechanism,
    runAllTests
  };
}

// 如果在浏览器中运行，自动执行
if (typeof window !== 'undefined') {
  window.runPhase1Tests = runAllTests;
  log('测试函数已加载。运行 runPhase1Tests() 开始测试。', 'yellow');
}

