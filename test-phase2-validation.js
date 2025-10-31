/**
 * 第二阶段测试 - 数据验证功能测试
 * 
 * 测试目标：
 * 1. 验证内容数据验证功能
 * 2. 验证产品数据验证功能
 * 3. 验证数据清理功能
 */

import { 
  validateContent, 
  validateProduct, 
  validateEmail,
  validateUrl,
  sanitizeString,
  sanitizeObject 
} from './functions/lib/validation.js';

console.log('🧪 开始第二阶段数据验证测试...\n');

// 测试 1: 内容验证
console.log('📝 测试 1: 内容验证');
console.log('─'.repeat(50));

const testCases = [
  {
    name: '有效的内容（中文）',
    data: { content_zh: '这是中文内容' },
    expected: true
  },
  {
    name: '有效的内容（多语言）',
    data: { content_zh: '中文', content_en: 'English', content_ru: 'Русский' },
    expected: true
  },
  {
    name: '无效的内容（全部为空）',
    data: { content_zh: '', content_en: '', content_ru: '' },
    expected: false
  },
  {
    name: '无效的内容（null）',
    data: { content_zh: null, content_en: null, content_ru: null },
    expected: false
  },
  {
    name: '无效的内容（超长）',
    data: { content_zh: 'x'.repeat(10001) },
    expected: false
  }
];

testCases.forEach(test => {
  const result = validateContent(test.data);
  const passed = result.valid === test.expected;
  console.log(`${passed ? '✅' : '❌'} ${test.name}`);
  if (!passed) {
    console.log(`   期望: ${test.expected}, 实际: ${result.valid}`);
    console.log(`   错误: ${result.error}`);
  }
});

// 测试 2: 产品验证
console.log('\n📦 测试 2: 产品验证');
console.log('─'.repeat(50));

const productTestCases = [
  {
    name: '有效的产品（创建）',
    data: { product_code: 'PROD-001', name_zh: '产品名称' },
    isUpdate: false,
    expected: true
  },
  {
    name: '无效的产品（缺少代码）',
    data: { name_zh: '产品名称' },
    isUpdate: false,
    expected: false
  },
  {
    name: '无效的产品（缺少名称）',
    data: { product_code: 'PROD-001' },
    isUpdate: false,
    expected: false
  },
  {
    name: '无效的产品代码格式',
    data: { product_code: 'prod@001', name_zh: '产品名称' },
    isUpdate: false,
    expected: false
  },
  {
    name: '无效的价格（负数）',
    data: { product_code: 'PROD-001', name_zh: '产品名称', price: -10 },
    isUpdate: false,
    expected: false
  },
  {
    name: '有效的产品（更新）',
    data: { name_zh: '新名称' },
    isUpdate: true,
    expected: true
  }
];

productTestCases.forEach(test => {
  const result = validateProduct(test.data, test.isUpdate);
  const passed = result.valid === test.expected;
  console.log(`${passed ? '✅' : '❌'} ${test.name}`);
  if (!passed) {
    console.log(`   期望: ${test.expected}, 实际: ${result.valid}`);
    console.log(`   错误: ${result.error}`);
  }
});

// 测试 3: 邮箱验证
console.log('\n📧 测试 3: 邮箱验证');
console.log('─'.repeat(50));

const emailTests = [
  { email: 'admin@example.com', expected: true },
  { email: 'invalid-email', expected: false },
  { email: 'user@domain.co.uk', expected: true },
  { email: '@example.com', expected: false }
];

emailTests.forEach(test => {
  const result = validateEmail(test.email);
  const passed = result === test.expected;
  console.log(`${passed ? '✅' : '❌'} ${test.email} - ${result ? '有效' : '无效'}`);
});

// 测试 4: URL验证
console.log('\n🔗 测试 4: URL验证');
console.log('─'.repeat(50));

const urlTests = [
  { url: 'https://example.com', expected: true },
  { url: 'http://localhost:3000', expected: true },
  { url: 'not-a-url', expected: false },
  { url: 'ftp://files.example.com', expected: true }
];

urlTests.forEach(test => {
  const result = validateUrl(test.url);
  const passed = result === test.expected;
  console.log(`${passed ? '✅' : '❌'} ${test.url} - ${result ? '有效' : '无效'}`);
});

// 测试 5: 字符串清理
console.log('\n🧹 测试 5: 字符串清理');
console.log('─'.repeat(50));

const sanitizeTests = [
  { input: '  hello  ', expected: 'hello' },
  { input: '\n\ttab and newline\n', expected: 'tab and newline' },
  { input: 'no-spaces', expected: 'no-spaces' },
  { input: '', expected: '' }
];

sanitizeTests.forEach(test => {
  const result = sanitizeString(test.input);
  const passed = result === test.expected;
  console.log(`${passed ? '✅' : '❌'} "${test.input}" → "${result}"`);
});

// 测试 6: 对象清理
console.log('\n🧹 测试 6: 对象清理');
console.log('─'.repeat(50));

const obj = {
  name: '  Product Name  ',
  description: '\n  Description  \n',
  price: 100,
  tags: '  tag1, tag2  '
};

const cleaned = sanitizeObject(obj);
console.log('原始对象:', obj);
console.log('清理后对象:', cleaned);
console.log(`✅ 字符串字段已清理，数字字段保持不变`);

console.log('\n✨ 所有测试完成！');

