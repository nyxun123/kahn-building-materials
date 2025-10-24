/**
 * 删除最后一个测试产品
 */

async function deleteLastTestProduct() {
  console.log('🗑️  删除剩余的测试产品...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token';

    // 获取产品列表
    const response = await fetch(`${baseUrl}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`获取产品列表失败: ${response.status}`);
    }

    const data = await response.json();
    const products = data.data || [];

    // 找到测试产品
    const testProduct = products.find(p =>
      p.product_code === '发过 253413' ||
      p.name_zh === '12 人工' ||
      p.name_en === '123123124'
    );

    if (testProduct) {
      console.log(`🎯 找到测试产品: ${testProduct.product_code} - ${testProduct.name_zh}`);

      const deleteResponse = await fetch(`${baseUrl}/api/admin/products/${testProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (deleteResponse.ok) {
        console.log('✅ 成功删除最后的测试产品');
      } else {
        console.log(`❌ 删除失败: ${deleteResponse.status}`);
      }
    } else {
      console.log('❓ 没有找到需要删除的测试产品');
    }

    // 验证结果
    console.log('\n🔍 验证最终结果...');
    const verifyResponse = await fetch(`${baseUrl}/api/products`);
    const finalData = await verifyResponse.json();

    console.log(`📦 最终产品数量: ${finalData.pagination?.total || 0}`);
    finalData.data?.forEach(product => {
      console.log(`   - ${product.product_code}: ${product.name_zh}`);
    });

  } catch (error) {
    console.error('❌ 删除失败:', error.message);
  }
}

deleteLastTestProduct();