/**
 * 添加正常产品示例
 */

async function addNormalProducts() {
  console.log('➕ 添加正常产品示例...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token';

    const normalProducts = [
      {
        product_code: 'KWG-002',
        name_zh: '重型墙纸专用胶',
        name_en: 'Heavy-Duty Wallpaper Adhesive',
        name_ru: 'Специальный клей для тяжелых обоев',
        description_zh: '专为重型墙纸设计的高强度胶粉，适用于厚重、织物质感的墙纸，提供卓越的支撑力。',
        description_en: 'High-strength adhesive powder specially designed for heavy-weight wallpapers.',
        description_ru: 'Клей высокой прочности для тяжелых обоев.',
        image_url: '/images/products/heavy-duty-adhesive.jpg',
        category: 'adhesive',
        price_range: '¥80-150/袋',
        is_active: true,
        is_featured: true,
        sort_order: 2,
        features_zh: '["超强粘结", "防霉防潮", "快干配方", "专业级"]',
        features_en: '["Extra Strong", "Mold & Moisture Resistant", "Fast-Drying", "Professional Grade"]',
        features_ru: '["Сверхпрочный", "Устойчивый к плесени", "Быстросохнущий", "Профессиональный"]'
      },
      {
        product_code: 'KWG-003',
        name_zh: '无纺布墙纸胶',
        name_en: 'Non-Woven Wallpaper Adhesive',
        name_ru: 'Клей для флизелиновых обоев',
        description_zh: '专为无纺布墙纸调配的胶粉，配方温和，不会损伤墙纸材质，施工方便。',
        description_en: 'Specially formulated adhesive powder for non-woven wallpapers, gentle formula.',
        description_ru: 'Специальный клей для флизелиновых обоев, мягкая формула.',
        image_url: '/images/products/non-woven-adhesive.jpg',
        category: 'adhesive',
        price_range: '¥60-120/袋',
        is_active: true,
        is_featured: false,
        sort_order: 3,
        features_zh: '["温和配方", "护墙纸材质", "环保无毒", "施工便捷"]',
        features_en: '["Gentle Formula", "Wallpaper Protection", "Eco-Friendly", "Easy to Apply"]',
        features_ru: '["Мягкая формула", "Защита обоев", "Экологичный", "Легко наносить"]'
      },
      {
        product_code: 'KWO-001',
        name_zh: '小包装墙纸胶 200g',
        name_en: 'Small Package Wallpaper Adhesive 200g',
        name_ru: 'Маленькая упаковка клея для обоев 200г',
        description_zh: '铝箔袋小包装，适合小面积装修和DIY使用，即开即用，方便存储。',
        description_en: 'Aluminum foil small package, suitable for small area renovation and DIY use.',
        description_ru: 'Маленькая упаковка для небольшого ремонта и DIY.',
        image_url: '/images/products/small-package-200g.jpg',
        category: 'retail',
        price_range: '¥15-25/袋',
        is_active: true,
        is_featured: true,
        sort_order: 4,
        features_zh: '["铝箔包装", "防潮保鲜", "便携设计", "DIY友好"]',
        features_en: '["Aluminum Foil Package", "Moisture-Proof", "Portable Design", "DIY Friendly"]',
        features_ru: '["Упаковка из фольги", "Влагостойкость", "Портативный", "Подходит для DIY"]'
      }
    ];

    let addedCount = 0;
    for (const product of normalProducts) {
      try {
        console.log(`📦 添加产品: ${product.name_zh}...`);

        const response = await fetch(`${baseUrl}/api/admin/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ 成功添加: ${product.product_code} - ${product.name_zh}`);
          addedCount++;
        } else {
          const errorData = await response.json();
          console.log(`❌ 添加失败: ${product.product_code} - ${errorData.error?.message || response.status}`);
        }
      } catch (error) {
        console.log(`❌ 添加错误: ${product.product_code} - ${error.message}`);
      }
    }

    console.log(`\n🎉 产品添加完成! 成功添加 ${addedCount} 个产品`);

    // 验证最终结果
    console.log('\n🔍 验证最终产品列表...');
    const verifyResponse = await fetch(`${baseUrl}/api/products`);
    const finalData = await verifyResponse.json();

    console.log(`📦 最终产品数量: ${finalData.pagination?.total || 0}`);
    console.log('📋 产品列表:');
    finalData.data?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.product_code} - ${product.name_zh}`);
    });

    console.log('\n✅ 产品数据修复完成！');
    console.log('🌐 前端现在应该显示正常的产品列表，不再有测试数据。');

  } catch (error) {
    console.error('❌ 添加产品失败:', error.message);
  }
}

addNormalProducts();