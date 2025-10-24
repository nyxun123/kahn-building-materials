/**
 * 清理测试产品脚本
 * 通过管理API删除测试产品
 */

async function cleanupTestProducts() {
  console.log('🧹 开始清理测试产品...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token'; // 默认管理员token

    // 1. 获取所有产品
    console.log('📋 获取产品列表...');
    const productsResponse = await fetch(`${baseUrl}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!productsResponse.ok) {
      throw new Error(`获取产品列表失败: ${productsResponse.status}`);
    }

    const productsData = await productsResponse.json();
    console.log(`📦 总共找到 ${productsData.data?.length || 0} 个产品`);

    if (!productsData.data || productsData.data.length === 0) {
      console.log('❌ 没有找到产品数据');
      return;
    }

    // 2. 识别测试产品
    const testKeywords = [
      '部署测试', '休息休息', '不不不不', '嘎嘎嘎嘎', '嘤嘤嘤',
      'DEPLOY-TEST', 'TEST-', 'PERSISTENCE-TEST', '简单测试',
      '完整功能测试', 'QQ 群', '中中中中', '前前前前', '跟哥哥'
    ];

    const testProducts = productsData.data.filter(product =>
      testKeywords.some(keyword =>
        (product.name_zh && product.name_zh.includes(keyword)) ||
        (product.name_en && product.name_en.includes(keyword)) ||
        (product.product_code && product.product_code.includes(keyword))
      )
    );

    console.log(`🎯 识别出 ${testProducts.length} 个测试产品需要清理:`);
    testProducts.forEach(product => {
      console.log(`   - ${product.product_code}: ${product.name_zh}`);
    });

    // 3. 删除测试产品
    let deletedCount = 0;
    for (const product of testProducts) {
      try {
        console.log(`🗑️  正在删除: ${product.product_code}...`);

        const deleteResponse = await fetch(`${baseUrl}/api/admin/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (deleteResponse.ok) {
          console.log(`✅ 成功删除: ${product.product_code}`);
          deletedCount++;
        } else {
          console.log(`❌ 删除失败: ${product.product_code} (${deleteResponse.status})`);
        }
      } catch (error) {
        console.log(`❌ 删除错误: ${product.product_code} - ${error.message}`);
      }
    }

    console.log(`\n🎉 清理完成! 成功删除 ${deletedCount} 个测试产品`);

    // 4. 验证清理结果
    console.log('\n🔍 验证清理结果...');
    const verifyResponse = await fetch(`${baseUrl}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      const remainingProducts = verifyData.data || [];
      console.log(`📦 清理后剩余产品: ${remainingProducts.length} 个`);

      remainingProducts.forEach(product => {
        console.log(`   - ${product.product_code}: ${product.name_zh}`);
      });
    }

    // 5. 添加正常示例产品（如果需要）
    if (remainingProducts.length < 3) {
      console.log('\n➕ 建议添加更多正常产品...');
      console.log('可以通过管理后台界面添加以下产品:');
      console.log('1. 通用型墙纸胶粉 (KWG-001)');
      console.log('2. 重型墙纸专用胶 (KWG-002)');
      console.log('3. 无纺布墙纸胶 (KWG-003)');
    }

  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error.message);
  }
}

cleanupTestProducts();