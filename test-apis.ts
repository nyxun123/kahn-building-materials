import { productAPI, contactAPI, contentAPI } from './src/lib/api';

async function testAPIs() {
  console.log('🧪 开始测试API...');
  
  try {
    // 测试产品API
    console.log('\n📦 测试产品API...');
    const products = await productAPI.getProducts();
    console.log('✅ 产品API测试成功:', products.length, '个产品');
    
    // 测试联系消息API
    console.log('\n📧 测试联系消息API...');
    const messages = await contactAPI.getMessages();
    console.log('✅ 联系消息API测试成功:', messages.length, '条消息');
    
    // 测试内容API
    console.log('\n📄 测试内容API...');
    const contents = await contentAPI.getContents();
    console.log('✅ 内容API测试成功:', contents.length, '条内容');
    
    console.log('\n🎉 所有API测试完成！');
  } catch (error) {
    console.error('❌ API测试失败:', error);
  }
}

// 运行测试
testAPIs();