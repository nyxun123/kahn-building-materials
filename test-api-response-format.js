/**
 * API 响应格式测试脚本
 * 
 * 用途: 验证所有 API 端点返回统一的响应格式
 * 
 * 运行方式:
 * node test-api-response-format.js
 */

const API_BASE_URL = 'http://localhost:8787'; // Wrangler 本地开发服务器

// 测试用例
const testCases = [
  {
    name: '登录 API',
    method: 'POST',
    url: '/api/admin/login',
    body: {
      email: 'admin@example.com',
      password: 'password123'
    },
    expectedFields: ['success', 'code', 'message', 'data', 'timestamp']
  },
  {
    name: '获取产品列表',
    method: 'GET',
    url: '/api/admin/products?page=1&limit=10',
    headers: {
      'Authorization': 'Bearer test-token'
    },
    expectedFields: ['success', 'code', 'message', 'data', 'pagination', 'timestamp']
  },
  {
    name: '获取内容列表',
    method: 'GET',
    url: '/api/admin/contents?page=1&limit=10',
    headers: {
      'Authorization': 'Bearer test-token'
    },
    expectedFields: ['success', 'code', 'message', 'data', 'pagination', 'timestamp']
  }
];

/**
 * 验证响应格式
 */
function validateResponseFormat(response, expectedFields) {
  const missingFields = [];
  
  for (const field of expectedFields) {
    if (!(field in response)) {
      missingFields.push(field);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

/**
 * 运行单个测试
 */
async function runTest(testCase) {
  console.log(`\n📝 测试: ${testCase.name}`);
  console.log(`   ${testCase.method} ${testCase.url}`);
  
  try {
    const options = {
      method: testCase.method,
      headers: {
        'Content-Type': 'application/json',
        ...testCase.headers
      }
    };
    
    if (testCase.body) {
      options.body = JSON.stringify(testCase.body);
    }
    
    const response = await fetch(`${API_BASE_URL}${testCase.url}`, options);
    const data = await response.json();
    
    console.log(`   状态码: ${response.status}`);
    
    // 验证响应格式
    const validation = validateResponseFormat(data, testCase.expectedFields);
    
    if (validation.valid) {
      console.log(`   ✅ 响应格式正确`);
      console.log(`   响应数据:`, JSON.stringify(data, null, 2).split('\n').slice(0, 5).join('\n'));
    } else {
      console.log(`   ❌ 响应格式错误`);
      console.log(`   缺少字段: ${validation.missingFields.join(', ')}`);
      console.log(`   实际字段: ${Object.keys(data).join(', ')}`);
    }
    
    return validation.valid;
  } catch (error) {
    console.log(`   ❌ 测试失败: ${error.message}`);
    return false;
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('🚀 开始 API 响应格式测试\n');
  console.log(`API 基础 URL: ${API_BASE_URL}\n`);
  
  let passedCount = 0;
  let failedCount = 0;
  
  for (const testCase of testCases) {
    const passed = await runTest(testCase);
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  }
  
  console.log(`\n📊 测试结果`);
  console.log(`   通过: ${passedCount}/${testCases.length}`);
  console.log(`   失败: ${failedCount}/${testCases.length}`);
  
  if (failedCount === 0) {
    console.log(`\n✅ 所有测试通过！`);
  } else {
    console.log(`\n❌ 有 ${failedCount} 个测试失败`);
  }
}

// 运行测试
runAllTests().catch(console.error);

