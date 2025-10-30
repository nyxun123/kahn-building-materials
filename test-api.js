// API测试脚本
async function testAPI() {
  console.log('🔍 开始测试API连接...');
  
  try {
    // 测试产品列表API
    console.log('\n📦 测试产品列表API: /api/products');
    const productListResponse = await fetch('/api/products?limit=1&_t=' + Date.now(), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    const productListData = await productListResponse.json();
    console.log('✅ 产品列表API响应:', productListResponse.ok, '状态:', productListResponse.status);
    console.log('📊 产品列表数据:', productListData.success ? `获取到 ${productListData.data?.length || 0} 个产品` : '失败');
    
    // 测试特定产品API（如果产品列表不为空）
    if (productListData.success && productListData.data && productListData.data.length > 0) {
      const firstProduct = productListData.data[0];
      console.log(`\n🔍 测试产品详情API: /api/products/${firstProduct.product_code}`);
      const productDetailResponse = await fetch(`/api/products/${firstProduct.product_code}?_t=` + Date.now(), {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const productDetailData = await productDetailResponse.json();
      console.log('✅ 产品详情API响应:', productDetailResponse.ok, '状态:', productDetailResponse.status);
      console.log('📝 产品详情数据:', productDetailData.success ? `成功获取产品: ${firstProduct.product_code}` : '失败');
    } else {
      console.log('\n⚠️  产品列表为空，无法测试产品详情API');
    }
    
    console.log('\n🎉 API测试完成！');
  } catch (error) {
    console.error('\n❌ API测试失败:', error.message);
  }
}

// 在浏览器环境中运行测试
if (typeof window !== 'undefined') {
  console.log('🌐 在浏览器环境中运行API测试...');
  testAPI();
} else {
  console.log('🖥️ 在Node.js环境中，需要使用适当的适配器进行测试');
}