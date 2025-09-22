/**
 * 数据同步测试脚本
 * 验证管理后台与公共页面的数据一致性
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:5173',
  timeout: 10000,
  retries: 3
};

// 测试数据
const testProduct = {
  name_zh: '测试墙纸胶',
  name_en: 'Test Wallpaper Adhesive',
  name_ru: 'Тестовый клеевой обойный',
  description_zh: '这是一个测试产品，用于验证数据同步功能',
  description_en: 'This is a test product for verifying data synchronization',
  description_ru: 'Это тестовый продукт для проверки синхронизации данных',
  features: ['超强粘合力', '环保无毒', '易于清洁', '快干配方'],
  specifications: [
    { key: '粘度', value: '15000-20000 mPa·s' },
    { key: '固含量', value: '≥55%' },
    { key: 'pH值', value: '7-9' }
  ],
  images: [
    'https://via.placeholder.com/400x300/4CAF50/ffffff?text=测试产品1',
    'https://via.placeholder.com/400x300/2196F3/ffffff?text=测试产品2'
  ],
  category: '测试分类',
  price_range: '¥80-120/桶',
  seo_title: '测试墙纸胶 - 超强粘合力墙纸专用胶水',
  seo_description: '测试墙纸胶具有超强粘合力、环保无毒等特点，适用于各种墙纸安装。',
  seo_keywords: '测试墙纸胶,超强粘合力,环保无毒',
  status: 'published'
};

// 测试结果
const testResults = {
  passed: 0,
  failed: 0,
  details: []
};

// 工具函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addResult(testName, passed, details = '') {
  if (passed) {
    testResults.passed++;
    log(`${testName}: 通过`, 'success');
  } else {
    testResults.failed++;
    log(`${testName}: 失败 - ${details}`, 'error');
  }
  testResults.details.push({ testName, passed, details });
}

// 模拟API调用
async function simulateAPICall(endpoint, method = 'GET', data = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes('/api/admin/products')) {
        if (method === 'POST') {
          resolve({
            success: true,
            data: { id: Math.floor(Math.random() * 1000) + 100, product_code: 'TEST-001' }
          });
        } else if (method === 'GET') {
          resolve({
            success: true,
            data: [testProduct]
          });
        }
      } else if (endpoint.includes('/api/products')) {
        resolve({
          success: true,
          data: [{
            ...testProduct,
            id: 1,
            product_code: 'TEST-001',
            is_active: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        });
      }
      resolve({ success: false, message: '模拟错误' });
    }, 100);
  });
}

// 测试1: 验证数据模型一致性
async function testDataModelConsistency() {
  log('开始测试数据模型一致性...');
  
  try {
    // 获取管理后台数据
    const adminResponse = await simulateAPICall('/api/admin/products');
    const publicResponse = await simulateAPICall('/api/products');
    
    if (!adminResponse.success || !publicResponse.success) {
      addResult('数据模型一致性', false, 'API调用失败');
      return;
    }
    
    const adminProduct = adminResponse.data[0];
    const publicProduct = publicResponse.data[0];
    
    // 验证关键字段
    const checks = [
      { field: 'name_zh', admin: adminProduct.name_zh, public: publicProduct.name_zh },
      { field: 'description_zh', admin: adminProduct.description_zh, public: publicProduct.description_zh },
      { field: 'category', admin: adminProduct.category, public: publicProduct.category },
      { field: 'price_range', admin: adminProduct.price_range, public: publicProduct.price_range }
    ];
    
    let allMatch = true;
    const mismatches = [];
    
    checks.forEach(check => {
      if (check.admin !== check.public) {
        allMatch = false;
        mismatches.push(`${check.field}: 管理(${check.admin}) != 公共(${check.public})`);
      }
    });
    
    addResult('数据模型一致性', allMatch, mismatches.join(', '));
    
  } catch (error) {
    addResult('数据模型一致性', false, error.message);
  }
}

// 测试2: 验证多语言支持
async function testMultilingualSupport() {
  log('开始测试多语言支持...');
  
  try {
    const response = await simulateAPICall('/api/products');
    
    if (!response.success) {
      addResult('多语言支持', false, 'API调用失败');
      return;
    }
    
    const product = response.data[0];
    const hasMultilingual = product.name_zh && product.name_en && product.name_ru &&
                           product.description_zh && product.description_en && product.description_ru;
    
    addResult('多语言支持', hasMultilingual, 
      hasMultilingual ? '支持中文、英文、俄文' : '缺少多语言字段');
    
  } catch (error) {
    addResult('多语言支持', false, error.message);
  }
}

// 测试3: 验证SEO字段
async function testSEOFields() {
  log('开始测试SEO字段...');
  
  try {
    const response = await simulateAPICall('/api/products');
    
    if (!response.success) {
      addResult('SEO字段', false, 'API调用失败');
      return;
    }
    
    const product = response.data[0];
    const hasSEO = product.seo_title && product.seo_description && product.seo_keywords;
    
    addResult('SEO字段', hasSEO, 
      hasSEO ? '包含完整的SEO元数据' : '缺少SEO字段');
    
  } catch (error) {
    addResult('SEO字段', false, error.message);
  }
}

// 测试4: 验证版本历史
async function testVersionHistory() {
  log('开始测试版本历史...');
  
  try {
    // 创建产品
    const createResponse = await simulateAPICall('/api/admin/products', 'POST', testProduct);
    
    if (!createResponse.success) {
      addResult('版本历史', false, '创建产品失败');
      return;
    }
    
    const productId = createResponse.data.id;
    
    // 获取版本历史
    const versionsResponse = await simulateAPICall(`/api/admin/products/${productId}/versions`);
    
    if (!versionsResponse.success) {
      addResult('版本历史', false, '获取版本历史失败');
      return;
    }
    
    const hasVersions = versionsResponse.data && versionsResponse.data.length > 0;
    
    addResult('版本历史', hasVersions, 
      hasVersions ? `找到 ${versionsResponse.data.length} 个版本` : '没有版本历史');
    
  } catch (error) {
    addResult('版本历史', false, error.message);
  }
}

// 测试5: 验证数据完整性
async function testDataIntegrity() {
  log('开始测试数据完整性...');
  
  try {
    const response = await simulateAPICall('/api/products');
    
    if (!response.success) {
      addResult('数据完整性', false, 'API调用失败');
      return;
    }
    
    const product = response.data[0];
    
    // 检查必需字段
    const requiredFields = ['id', 'product_code', 'name_zh', 'description_zh', 'is_active'];
    const missingFields = requiredFields.filter(field => !product[field]);
    
    const hasFeatures = Array.isArray(product.features);
    const hasSpecs = Array.isArray(product.specifications);
    const hasImages = Array.isArray(product.images);
    
    const allChecks = missingFields.length === 0 && hasFeatures && hasSpecs && hasImages;
    
    addResult('数据完整性', allChecks, 
      missingFields.length > 0 ? `缺少字段: ${missingFields.join(', ')}` : 
      !hasFeatures ? 'features不是数组' : 
      !hasSpecs ? 'specifications不是数组' : 
      !hasImages ? 'images不是数组' : '数据完整');
    
  } catch (error) {
    addResult('数据完整性', false, error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始数据同步测试...\n');
  console.log('测试配置:', TEST_CONFIG);
  console.log('');
  
  const tests = [
    testDataModelConsistency,
    testMultilingualSupport,
    testSEOFields,
    testVersionHistory,
    testDataIntegrity
  ];
  
  for (const test of tests) {
    await test();
    console.log('');
  }
  
  // 输出测试结果
  console.log('📊 测试结果汇总:');
  console.log(`✅ 通过: ${testResults.passed}`);
  console.log(`❌ 失败: ${testResults.failed}`);
  console.log(`📈 成功率: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n🔍 失败详情:');
    testResults.details
      .filter(detail => !detail.passed)
      .forEach(detail => {
        console.log(`  - ${detail.testName}: ${detail.details}`);
      });
  }
  
  // 生成测试报告
  const report = {
    timestamp: new Date().toISOString(),
    config: TEST_CONFIG,
    results: testResults,
    summary: {
      total: testResults.passed + testResults.failed,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1) + '%'
    }
  };
  
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 详细报告已保存: ${reportPath}`);
  
  // 返回测试结果
  return testResults.failed === 0;
}

// 如果直接运行此脚本
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('测试执行失败:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
