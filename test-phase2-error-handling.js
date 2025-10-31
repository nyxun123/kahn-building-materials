#!/usr/bin/env node

/**
 * Phase 2 - Problem 8: Error Handling Consistency Test
 * 
 * 测试所有 API 端点的错误处理是否一致
 * 验证所有错误响应都遵循统一的格式
 */

const BASE_URL = 'http://localhost:8788';
const ADMIN_EMAIL = 'admin@kn-wallpaperglue.com';
const ADMIN_PASSWORD = 'Admin@123456';

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

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

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status}: ${name}`, color);
  if (details) {
    log(`  ${details}`, 'yellow');
  }
  
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

async function getAuthToken() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    
    const data = await response.json();
    if (data.success && data.data?.token) {
      return data.data.token;
    }
    throw new Error('Failed to get auth token');
  } catch (error) {
    log(`Error getting auth token: ${error.message}`, 'red');
    process.exit(1);
  }
}

function validateErrorResponse(response, expectedCode) {
  const errors = [];
  
  // 检查必需字段
  if (response.success !== false) {
    errors.push('Missing or incorrect "success" field (should be false)');
  }
  if (response.code !== expectedCode) {
    errors.push(`Incorrect "code" field (expected ${expectedCode}, got ${response.code})`);
  }
  if (!response.message || typeof response.message !== 'string') {
    errors.push('Missing or invalid "message" field');
  }
  if (!response.timestamp || typeof response.timestamp !== 'string') {
    errors.push('Missing or invalid "timestamp" field');
  }
  
  return errors;
}

function validateSuccessResponse(response) {
  const errors = [];
  
  // 检查必需字段
  if (response.success !== true) {
    errors.push('Missing or incorrect "success" field (should be true)');
  }
  if (response.code !== 200 && response.code !== 201) {
    errors.push(`Incorrect "code" field (expected 200 or 201, got ${response.code})`);
  }
  if (!response.message || typeof response.message !== 'string') {
    errors.push('Missing or invalid "message" field');
  }
  if (!response.timestamp || typeof response.timestamp !== 'string') {
    errors.push('Missing or invalid "timestamp" field');
  }
  
  return errors;
}

async function testUnauthorizedRequest() {
  log('\n📋 Test 1: Unauthorized Request (No Token)', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/contents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    const errors = validateErrorResponse(data, 401);
    
    if (errors.length === 0 && response.status === 401) {
      logTest('Unauthorized request returns 401 with correct format', true);
    } else {
      logTest('Unauthorized request returns 401 with correct format', false, 
        `Errors: ${errors.join(', ')}`);
    }
  } catch (error) {
    logTest('Unauthorized request test', false, error.message);
  }
}

async function testInvalidToken() {
  log('\n📋 Test 2: Invalid Token', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/contents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_token_12345'
      }
    });
    
    const data = await response.json();
    const errors = validateErrorResponse(data, 401);
    
    if (errors.length === 0 && response.status === 401) {
      logTest('Invalid token returns 401 with correct format', true);
    } else {
      logTest('Invalid token returns 401 with correct format', false,
        `Errors: ${errors.join(', ')}`);
    }
  } catch (error) {
    logTest('Invalid token test', false, error.message);
  }
}

async function testBadRequest(token) {
  log('\n📋 Test 3: Bad Request (Invalid Data)', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        // 缺少必需的语言字段
        title: 'Test'
      })
    });
    
    const data = await response.json();
    const errors = validateErrorResponse(data, 400);
    
    if (errors.length === 0 && response.status === 400) {
      logTest('Bad request returns 400 with correct format', true);
    } else {
      logTest('Bad request returns 400 with correct format', false,
        `Errors: ${errors.join(', ')}`);
    }
  } catch (error) {
    logTest('Bad request test', false, error.message);
  }
}

async function testSuccessResponse(token) {
  log('\n📋 Test 4: Success Response Format', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/contents?page=1&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    const errors = validateSuccessResponse(data);
    
    if (errors.length === 0 && response.status === 200) {
      logTest('Success response has correct format', true);
    } else {
      logTest('Success response has correct format', false,
        `Errors: ${errors.join(', ')}`);
    }
  } catch (error) {
    logTest('Success response test', false, error.message);
  }
}

async function testNotFoundError(token) {
  log('\n📋 Test 5: Not Found Error (404)', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/contents/99999`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    const errors = validateErrorResponse(data, 404);
    
    if (errors.length === 0 && response.status === 404) {
      logTest('Not found error returns 404 with correct format', true);
    } else {
      logTest('Not found error returns 404 with correct format', false,
        `Errors: ${errors.join(', ')}`);
    }
  } catch (error) {
    logTest('Not found error test', false, error.message);
  }
}

async function runTests() {
  log('\n🧪 Phase 2 - Problem 8: Error Handling Consistency Tests', 'blue');
  log('=' .repeat(60), 'blue');
  
  // 获取认证 token
  log('\n🔐 Getting authentication token...', 'yellow');
  const token = await getAuthToken();
  log('✅ Authentication successful', 'green');
  
  // 运行测试
  await testUnauthorizedRequest();
  await testInvalidToken();
  await testBadRequest(token);
  await testSuccessResponse(token);
  await testNotFoundError(token);
  
  // 输出总结
  log('\n' + '='.repeat(60), 'blue');
  log(`\n📊 Test Results: ${testResults.passed} passed, ${testResults.failed} failed`, 
    testResults.failed === 0 ? 'green' : 'red');
  
  if (testResults.failed === 0) {
    log('\n✅ All error handling tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Please review the errors above.', 'red');
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});

