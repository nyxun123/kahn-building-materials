// 测试首页内容管理功能
async function testHomeContent() {
  console.log('🧪 开始测试首页内容管理功能...\n');
  
  try {
    // 测试1: 检查API是否能获取首页内容
    console.log('1. 测试获取首页内容...');
    const response = await fetch('http://localhost:5175/api/content-local?page=home');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API访问成功');
      console.log(`📊 获取到 ${data.length} 条首页内容`);
      
      // 检查是否包含新板块内容
      const videoContent = data.find(item => item.section_key.includes('video'));
      const oemContent = data.find(item => item.section_key.includes('oem'));
      const semiContent = data.find(item => item.section_key.includes('semi'));
      
      console.log('📺 演示视频板块:', videoContent ? '存在' : '缺失');
      console.log('🏭 OEM定制板块:', oemContent ? '存在' : '缺失');
      console.log('📦 半成品小袋板块:', semiContent ? '存在' : '缺失');
    } else {
      console.log('❌ API访问失败:', data.error?.message || '未知错误');
    }
    
    // 测试2: 检查管理页面是否可访问
    console.log('\n2. 测试管理后台页面...');
    console.log('请手动访问以下URL进行测试:');
    console.log('- 管理登录: http://localhost:5175/admin/login');
    console.log('- 首页内容管理: http://localhost:5175/admin/home-content');
    
    console.log('\n✅ 测试完成! 请在浏览器中验证管理界面功能。');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    console.log('请确保开发服务器正在运行: npm run dev');
  }
}

// 运行测试
testHomeContent();