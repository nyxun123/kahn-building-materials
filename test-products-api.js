#!/usr/bin/env node

/**
 * 测试产品API
 * 用于验证生产环境的产品API是否正常工作
 */

import https from 'https';

const API_URL = 'https://kn-wallpaperglue.com/api/products';

console.log('🔍 测试产品API...');
console.log('📡 API地址:', API_URL);
console.log('');

https.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      console.log('✅ API响应成功');
      console.log('📊 响应状态码:', res.statusCode);
      console.log('');
      
      if (result.success) {
        console.log('✅ 数据获取成功');
        console.log('📦 产品数量:', result.data.length);
        console.log('📄 分页信息:', result.pagination);
        console.log('');
        
        if (result.data.length > 0) {
          console.log('📋 产品列表:');
          result.data.forEach((product, index) => {
            console.log(`  ${index + 1}. [${product.product_code}] ${product.name_zh} / ${product.name_en}`);
            console.log(`     图片: ${product.image_url}`);
            console.log(`     状态: ${product.is_active ? '✅ 激活' : '❌ 未激活'}`);
            console.log('');
          });
        } else {
          console.log('⚠️  没有找到产品数据');
        }
      } else {
        console.log('❌ API返回失败');
        console.log('错误信息:', result.message);
      }
    } catch (error) {
      console.error('❌ 解析JSON失败:', error.message);
      console.log('原始响应:', data.substring(0, 500));
    }
  });
}).on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
  process.exit(1);
});

