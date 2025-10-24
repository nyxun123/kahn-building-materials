/**
 * 简单的产品数据检查脚本
 */

async function checkProducts() {
  console.log('🔍 检查产品数据状态...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';

    // 检查公开API
    const response = await fetch(`${baseUrl}/api/products?limit=20`);
    const data = await response.json();

    console.log('📊 API响应状态:', response.status);
    console.log('📦 产品总数:', data.pagination?.total || 0);

    if (data.data && data.data.length > 0) {
      console.log('\n📋 当前产品列表:');
      data.data.forEach((product, index) => {
        console.log(`${index + 1}. ${product.product_code}`);
        console.log(`   中文名: ${product.name_zh}`);
        console.log(`   英文名: ${product.name_en}`);
        console.log(`   状态: ${product.is_active ? '活跃' : '非活跃'}`);
        console.log('');
      });

      // 识别测试产品
      const testKeywords = ['部署测试', '休息休息', '不不不不', '嘎嘎嘎嘎', '嘤嘤嘤', 'DEPLOY-TEST'];
      const testProducts = data.data.filter(product =>
        testKeywords.some(keyword =>
          product.name_zh?.includes(keyword) ||
          product.name_en?.includes(keyword) ||
          product.product_code?.includes(keyword)
        )
      );

      console.log('🧹 需要清理的测试产品:', testProducts.length);
      testProducts.forEach(product => {
        console.log(`   - ${product.product_code}: ${product.name_zh}`);
      });

      console.log('\n⚠️  建议立即清理这些测试产品!');
    } else {
      console.log('❌ 没有找到产品数据');
    }

  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  }
}

checkProducts();