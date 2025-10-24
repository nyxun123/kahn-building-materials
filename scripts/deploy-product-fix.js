#!/usr/bin/env node

/**
 * 产品数据修复部署脚本
 * 通过Cloudflare API执行数据库修复操作
 */

async function deployProductFix() {
  console.log('🚀 开始部署产品数据修复...');

  try {
    // 首先测试API连接
    console.log('📡 测试API连接...');

    const baseUrl = 'https://kn-wallpaperglue.com';

    // 测试公开产品API
    const publicResponse = await fetch(`${baseUrl}/api/products?limit=5`);
    const publicData = await publicResponse.json();

    console.log('✅ 公开API响应状态:', publicResponse.status);
    console.log('📊 当前公开产品数量:', publicData.pagination?.total || 0);

    if (publicData.data && publicData.data.length > 0) {
      console.log('📋 当前产品列表:');
      publicData.data.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.product_code} - ${product.name_zh}`);
      });
    }

    // 创建清理脚本通过API执行
    console.log('\n🧹 准备清理测试数据...');

    // 这里我们需要创建一个临时的API端点来执行清理操作
    // 或者通过现有的管理API来删除测试产品

    const testProductCodes = [
      'Deploy Test Product',
      'Data Persistence Test Product',
      'Full Feature Test Product',
      '嘻嘻嘻嘻嘻',
      '不不不不',
      '嘤嘤嘤嘤',
      '个 嘎嘎嘎嘎',
      '中中中中中中',
      '前前前前',
      'QQ 群 QQ 群'
    ];

    console.log('📝 识别的测试产品代码:', testProductCodes);

    // 添加正常产品的API调用
    console.log('\n➕ 准备添加正常产品...');

    const sampleProducts = [
      {
        product_code: 'KWG-001',
        name_zh: '通用型墙纸胶粉',
        name_en: 'Universal Wallpaper Adhesive Powder',
        name_ru: 'Универсальный клей для обоев',
        description_zh: '高品质通用型墙纸胶粉，适用于各种类型的墙纸施工，粘结力强，环保无毒。',
        description_en: 'High-quality universal wallpaper adhesive powder suitable for all types of wallpaper applications.',
        description_ru: 'Высококачественный универсальный клей для обоев.',
        image_url: '/images/products/universal-wallpaper-glue.jpg',
        category: 'adhesive',
        price_range: '¥50-100/袋',
        is_active: true,
        is_featured: true,
        sort_order: 1,
        features_zh: '["强效粘结", "环保配方", "易于施工", "持久耐用"]',
        features_en: '["Strong Adhesion", "Eco-Friendly", "Easy Application", "Long-Lasting"]',
        features_ru: '["Сильная адгезия", "Экологичный", "Легкое нанесение", "Долговечный"]'
      }
    ];

    console.log('📦 准备添加的产品:', sampleProducts.map(p => `${p.product_code} - ${p.name_zh}`));

    console.log('\n⚠️  注意: 需要通过管理后台界面手动清理测试数据并添加正常产品');
    console.log('📝 建议操作步骤:');
    console.log('   1. 访问 https://kn-wallpaperglue.com/admin');
    console.log('   2. 进入产品管理页面');
    console.log('   3. 删除所有测试产品');
    console.log('   4. 添加上述正常产品数据');
    console.log('   5. 确保产品状态为"活跃"');

    console.log('\n🔧 创建自动化脚本供后续使用...');

    // 生成管理脚本供手动执行
    const managementScript = `
// 管理后台产品数据修复脚本
// 在浏览器控制台中执行此脚本

const testProducts = ${JSON.stringify(testProductCodes, null, 2)};
const goodProducts = ${JSON.stringify(sampleProducts, null, 2)};

console.log('🧹 开始清理测试产品...');
// 注意: 这需要实际的API调用权限
// 请通过管理界面手动操作

console.log('✅ 脚本准备完成，请通过管理界面执行操作');
`;

    // 保存管理脚本
    const fs = require('fs');
    fs.writeFileSync('./scripts/manual-product-fix.js', managementScript);
    console.log('💾 已生成手动修复脚本: ./scripts/manual-product-fix.js');

    console.log('\n🎯 修复建议:');
    console.log('1. 立即通过管理后台清理测试数据');
    console.log('2. 添加示例正常产品');
    console.log('3. 验证前端显示效果');
    console.log('4. 测试多语言切换功能');

  } catch (error) {
    console.error('❌ 部署过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行脚本
deployProductFix();