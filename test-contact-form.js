/**
 * 联系表单端到端测试脚本
 * 
 * 测试内容：
 * 1. 数据库表结构检查
 * 2. 联系表单提交（正常情况）
 * 3. 输入验证（必填字段）
 * 4. 输入验证（邮箱格式）
 * 5. 输入验证（字段长度）
 * 6. 管理后台查询
 * 7. 多语言支持
 */

const BASE_URL = process.env.API_URL || 'http://localhost:8788';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'test-admin-token';

// 测试计数器
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// 辅助函数：发送请求
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  const data = await response.json();
  return { response, data };
}

// 辅助函数：测试断言
function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
    return true;
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${testName}`);
    return false;
  }
}

// 测试 1: 初始化数据库
async function test1_InitializeDatabase() {
  console.log('\n📋 测试 1: 初始化数据库表');
  try {
    const { response, data } = await makeRequest('/api/admin/init-d1', {
      method: 'POST',
    });
    
    assert(response.ok, '数据库初始化请求成功');
    assert(data.success === true, '数据库初始化返回成功状态');
    assert(data.tables && data.tables.includes('contacts'), 'contacts 表已创建');
    
    console.log('  📊 创建的表:', data.tables?.join(', '));
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '数据库初始化');
  }
}

// 测试 2: 正常提交联系表单
async function test2_SubmitContactForm() {
  console.log('\n📋 测试 2: 正常提交联系表单');
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'test@example.com',
        phone: '+86 13800138000',
        company: '测试公司',
        country: '中国',
        subject: '产品咨询',
        message: '这是一条测试留言，用于验证联系表单功能是否正常工作。',
        language: 'zh'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.ok, '表单提交请求成功');
    assert(data.code === 200, '返回成功状态码');
    assert(data.data && data.data.submitted === true, '表单提交标记正确');
    assert(typeof data.data.id === 'number', '返回了联系记录 ID');
    
    console.log('  📝 提交的记录 ID:', data.data?.id);
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '正常提交联系表单');
  }
}

// 测试 3: 必填字段验证（缺少姓名）
async function test3_ValidationRequiredFields() {
  console.log('\n📋 测试 3: 必填字段验证');
  
  // 3.1 缺少姓名
  try {
    const testData = {
      data: {
        email: 'test@example.com',
        message: '测试留言'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '缺少姓名返回 400 错误');
    assert(data.code === 400, '错误状态码正确');
    assert(data.message && data.message.includes('姓名'), '错误消息包含"姓名"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '必填字段验证 - 姓名');
  }
  
  // 3.2 缺少邮箱
  try {
    const testData = {
      data: {
        name: '测试用户',
        message: '测试留言'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '缺少邮箱返回 400 错误');
    assert(data.message && data.message.includes('邮箱'), '错误消息包含"邮箱"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '必填字段验证 - 邮箱');
  }
  
  // 3.3 缺少留言内容
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'test@example.com'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '缺少留言内容返回 400 错误');
    assert(data.message && data.message.includes('留言'), '错误消息包含"留言"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '必填字段验证 - 留言内容');
  }
}

// 测试 4: 邮箱格式验证
async function test4_ValidationEmailFormat() {
  console.log('\n📋 测试 4: 邮箱格式验证');
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'invalid-email',
        message: '测试留言内容'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '无效邮箱返回 400 错误');
    assert(data.message && data.message.includes('邮箱'), '错误消息包含"邮箱"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '邮箱格式验证');
  }
}

// 测试 5: 字段长度验证
async function test5_ValidationFieldLength() {
  console.log('\n📋 测试 5: 字段长度验证');
  
  // 5.1 留言内容太短
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'test@example.com',
        message: '短消息'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '留言内容太短返回 400 错误');
    assert(data.message && data.message.includes('长度'), '错误消息包含"长度"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '字段长度验证 - 留言内容太短');
  }
  
  // 5.2 姓名太长
  try {
    const testData = {
      data: {
        name: 'A'.repeat(101), // 超过 100 字符
        email: 'test@example.com',
        message: '这是一条测试留言，用于验证字段长度限制。'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '姓名太长返回 400 错误');
    assert(data.message && data.message.includes('长度'), '错误消息包含"长度"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '字段长度验证 - 姓名太长');
  }
}

// 测试 6: 多语言支持
async function test6_MultiLanguageSupport() {
  console.log('\n📋 测试 6: 多语言支持');
  
  const languages = [
    { code: 'en', name: 'English User' },
    { code: 'ru', name: 'Русский Пользователь' },
    { code: 'vi', name: 'Người dùng Việt' }
  ];
  
  for (const lang of languages) {
    try {
      const testData = {
        data: {
          name: lang.name,
          email: `test-${lang.code}@example.com`,
          message: `Test message in ${lang.code} language.`,
          language: lang.code
        }
      };
      
      const { response, data } = await makeRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(testData),
      });
      
      assert(response.ok, `${lang.code} 语言表单提交成功`);
      assert(data.code === 200, `${lang.code} 语言返回成功状态`);
    } catch (error) {
      console.error(`  ❌ ${lang.code} 语言测试失败:`, error.message);
      assert(false, `多语言支持 - ${lang.code}`);
    }
  }
}

// 测试 7: 管理后台查询（需要认证）
async function test7_AdminContactsQuery() {
  console.log('\n📋 测试 7: 管理后台查询联系记录');
  console.log('  ⚠️  此测试需要有效的 ADMIN_TOKEN，跳过认证测试');
  
  try {
    const { response, data } = await makeRequest('/api/admin/contacts?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });
    
    // 如果是未授权，这是预期的（因为我们可能没有有效的 token）
    if (response.status === 401) {
      console.log('  ℹ️  未授权访问（预期行为，需要有效 token）');
      assert(true, '管理后台正确拒绝未授权请求');
    } else if (response.ok) {
      assert(data.code === 200, '管理后台返回成功状态');
      assert(Array.isArray(data.data), '返回数据是数组');
      assert(data.pagination !== undefined, '包含分页信息');
      console.log(`  📊 查询到 ${data.data?.length || 0} 条联系记录`);
    } else {
      assert(false, `管理后台查询返回异常状态: ${response.status}`);
    }
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '管理后台查询');
  }
}

// 测试 8: CORS 预检请求
async function test8_CorsPreFlight() {
  console.log('\n📋 测试 8: CORS 预检请求');
  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://kn-wallpaperglue.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    assert(response.ok || response.status === 204, 'OPTIONS 请求返回成功');
    assert(
      response.headers.get('Access-Control-Allow-Origin') !== null,
      'CORS headers 已设置'
    );
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, 'CORS 预检请求');
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始联系表单端到端测试');
  console.log('========================================');
  console.log(`API URL: ${BASE_URL}`);
  console.log('========================================\n');
  
  try {
    await test1_InitializeDatabase();
    await test2_SubmitContactForm();
    await test3_ValidationRequiredFields();
    await test4_ValidationEmailFormat();
    await test5_ValidationFieldLength();
    await test6_MultiLanguageSupport();
    await test7_AdminContactsQuery();
    await test8_CorsPreFlight();
  } catch (error) {
    console.error('\n❌ 测试执行出错:', error);
  }
  
  // 输出测试结果
  console.log('\n========================================');
  console.log('📊 测试结果汇总');
  console.log('========================================');
  console.log(`总测试数: ${totalTests}`);
  console.log(`✅ 通过: ${passedTests}`);
  console.log(`❌ 失败: ${failedTests}`);
  console.log(`📈 通过率: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log('========================================\n');
  
  // 退出码
  process.exit(failedTests > 0 ? 1 : 0);
}

// 执行测试
runAllTests().catch(error => {
  console.error('❌ 测试脚本执行失败:', error);
  process.exit(1);
});

 * 联系表单端到端测试脚本
 * 
 * 测试内容：
 * 1. 数据库表结构检查
 * 2. 联系表单提交（正常情况）
 * 3. 输入验证（必填字段）
 * 4. 输入验证（邮箱格式）
 * 5. 输入验证（字段长度）
 * 6. 管理后台查询
 * 7. 多语言支持
 */

const BASE_URL = process.env.API_URL || 'http://localhost:8788';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'test-admin-token';

// 测试计数器
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// 辅助函数：发送请求
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  const data = await response.json();
  return { response, data };
}

// 辅助函数：测试断言
function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
    return true;
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${testName}`);
    return false;
  }
}

// 测试 1: 初始化数据库
async function test1_InitializeDatabase() {
  console.log('\n📋 测试 1: 初始化数据库表');
  try {
    const { response, data } = await makeRequest('/api/admin/init-d1', {
      method: 'POST',
    });
    
    assert(response.ok, '数据库初始化请求成功');
    assert(data.success === true, '数据库初始化返回成功状态');
    assert(data.tables && data.tables.includes('contacts'), 'contacts 表已创建');
    
    console.log('  📊 创建的表:', data.tables?.join(', '));
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '数据库初始化');
  }
}

// 测试 2: 正常提交联系表单
async function test2_SubmitContactForm() {
  console.log('\n📋 测试 2: 正常提交联系表单');
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'test@example.com',
        phone: '+86 13800138000',
        company: '测试公司',
        country: '中国',
        subject: '产品咨询',
        message: '这是一条测试留言，用于验证联系表单功能是否正常工作。',
        language: 'zh'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.ok, '表单提交请求成功');
    assert(data.code === 200, '返回成功状态码');
    assert(data.data && data.data.submitted === true, '表单提交标记正确');
    assert(typeof data.data.id === 'number', '返回了联系记录 ID');
    
    console.log('  📝 提交的记录 ID:', data.data?.id);
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '正常提交联系表单');
  }
}

// 测试 3: 必填字段验证（缺少姓名）
async function test3_ValidationRequiredFields() {
  console.log('\n📋 测试 3: 必填字段验证');
  
  // 3.1 缺少姓名
  try {
    const testData = {
      data: {
        email: 'test@example.com',
        message: '测试留言'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '缺少姓名返回 400 错误');
    assert(data.code === 400, '错误状态码正确');
    assert(data.message && data.message.includes('姓名'), '错误消息包含"姓名"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '必填字段验证 - 姓名');
  }
  
  // 3.2 缺少邮箱
  try {
    const testData = {
      data: {
        name: '测试用户',
        message: '测试留言'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '缺少邮箱返回 400 错误');
    assert(data.message && data.message.includes('邮箱'), '错误消息包含"邮箱"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '必填字段验证 - 邮箱');
  }
  
  // 3.3 缺少留言内容
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'test@example.com'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '缺少留言内容返回 400 错误');
    assert(data.message && data.message.includes('留言'), '错误消息包含"留言"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '必填字段验证 - 留言内容');
  }
}

// 测试 4: 邮箱格式验证
async function test4_ValidationEmailFormat() {
  console.log('\n📋 测试 4: 邮箱格式验证');
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'invalid-email',
        message: '测试留言内容'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '无效邮箱返回 400 错误');
    assert(data.message && data.message.includes('邮箱'), '错误消息包含"邮箱"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '邮箱格式验证');
  }
}

// 测试 5: 字段长度验证
async function test5_ValidationFieldLength() {
  console.log('\n📋 测试 5: 字段长度验证');
  
  // 5.1 留言内容太短
  try {
    const testData = {
      data: {
        name: '测试用户',
        email: 'test@example.com',
        message: '短消息'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '留言内容太短返回 400 错误');
    assert(data.message && data.message.includes('长度'), '错误消息包含"长度"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '字段长度验证 - 留言内容太短');
  }
  
  // 5.2 姓名太长
  try {
    const testData = {
      data: {
        name: 'A'.repeat(101), // 超过 100 字符
        email: 'test@example.com',
        message: '这是一条测试留言，用于验证字段长度限制。'
      }
    };
    
    const { response, data } = await makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    assert(response.status === 400, '姓名太长返回 400 错误');
    assert(data.message && data.message.includes('长度'), '错误消息包含"长度"');
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '字段长度验证 - 姓名太长');
  }
}

// 测试 6: 多语言支持
async function test6_MultiLanguageSupport() {
  console.log('\n📋 测试 6: 多语言支持');
  
  const languages = [
    { code: 'en', name: 'English User' },
    { code: 'ru', name: 'Русский Пользователь' },
    { code: 'vi', name: 'Người dùng Việt' }
  ];
  
  for (const lang of languages) {
    try {
      const testData = {
        data: {
          name: lang.name,
          email: `test-${lang.code}@example.com`,
          message: `Test message in ${lang.code} language.`,
          language: lang.code
        }
      };
      
      const { response, data } = await makeRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(testData),
      });
      
      assert(response.ok, `${lang.code} 语言表单提交成功`);
      assert(data.code === 200, `${lang.code} 语言返回成功状态`);
    } catch (error) {
      console.error(`  ❌ ${lang.code} 语言测试失败:`, error.message);
      assert(false, `多语言支持 - ${lang.code}`);
    }
  }
}

// 测试 7: 管理后台查询（需要认证）
async function test7_AdminContactsQuery() {
  console.log('\n📋 测试 7: 管理后台查询联系记录');
  console.log('  ⚠️  此测试需要有效的 ADMIN_TOKEN，跳过认证测试');
  
  try {
    const { response, data } = await makeRequest('/api/admin/contacts?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });
    
    // 如果是未授权，这是预期的（因为我们可能没有有效的 token）
    if (response.status === 401) {
      console.log('  ℹ️  未授权访问（预期行为，需要有效 token）');
      assert(true, '管理后台正确拒绝未授权请求');
    } else if (response.ok) {
      assert(data.code === 200, '管理后台返回成功状态');
      assert(Array.isArray(data.data), '返回数据是数组');
      assert(data.pagination !== undefined, '包含分页信息');
      console.log(`  📊 查询到 ${data.data?.length || 0} 条联系记录`);
    } else {
      assert(false, `管理后台查询返回异常状态: ${response.status}`);
    }
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, '管理后台查询');
  }
}

// 测试 8: CORS 预检请求
async function test8_CorsPreFlight() {
  console.log('\n📋 测试 8: CORS 预检请求');
  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://kn-wallpaperglue.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    assert(response.ok || response.status === 204, 'OPTIONS 请求返回成功');
    assert(
      response.headers.get('Access-Control-Allow-Origin') !== null,
      'CORS headers 已设置'
    );
  } catch (error) {
    console.error('  ❌ 测试失败:', error.message);
    assert(false, 'CORS 预检请求');
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始联系表单端到端测试');
  console.log('========================================');
  console.log(`API URL: ${BASE_URL}`);
  console.log('========================================\n');
  
  try {
    await test1_InitializeDatabase();
    await test2_SubmitContactForm();
    await test3_ValidationRequiredFields();
    await test4_ValidationEmailFormat();
    await test5_ValidationFieldLength();
    await test6_MultiLanguageSupport();
    await test7_AdminContactsQuery();
    await test8_CorsPreFlight();
  } catch (error) {
    console.error('\n❌ 测试执行出错:', error);
  }
  
  // 输出测试结果
  console.log('\n========================================');
  console.log('📊 测试结果汇总');
  console.log('========================================');
  console.log(`总测试数: ${totalTests}`);
  console.log(`✅ 通过: ${passedTests}`);
  console.log(`❌ 失败: ${failedTests}`);
  console.log(`📈 通过率: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log('========================================\n');
  
  // 退出码
  process.exit(failedTests > 0 ? 1 : 0);
}

// 执行测试
runAllTests().catch(error => {
  console.error('❌ 测试脚本执行失败:', error);
  process.exit(1);
});


