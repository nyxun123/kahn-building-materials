#!/usr/bin/env node

/**
 * 产品数据修复脚本
 * 1. 检查当前数据库中的产品数据
 * 2. 清理测试数据
 * 3. 添加正常的产品示例数据
 */

const { createClient } = require('@libsql/client');

// 配置数据库连接
const DB_URL = process.env.DATABASE_URL || 'file:local.db';
const AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

async function fixProductData() {
  console.log('🔧 开始修复产品数据...');

  try {
    // 连接数据库
    const client = createClient({
      url: DB_URL,
      authToken: AUTH_TOKEN,
    });

    console.log('✅ 数据库连接成功');

    // 1. 检查当前产品数据
    console.log('\n📊 检查当前产品数据...');
    const currentProducts = await client.execute('SELECT * FROM products ORDER BY id');
    console.log(`当前数据库中共有 ${currentProducts.rows.length} 个产品:`);

    currentProducts.rows.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}, 代码: ${product.product_code}, 名称: ${product.name_zh}, 状态: ${product.is_active}`);
    });

    // 2. 识别并清理测试数据
    console.log('\n🧹 清理测试数据...');
    const testPatterns = [
      '嘻嘻嘻嘻嘻', '不不不不', '嘤嘤嘤嘤', 'QQ 群 QQ 群',
      '个 嘎嘎嘎嘎', '中中中中中中', '前前前前', '跟哥哥',
      'Deploy Test Product', 'Data Persistence Test Product',
      'Full Feature Test Product', '简单测试产品', '123123124'
    ];

    let deletedCount = 0;
    for (const pattern of testPatterns) {
      const deleteResult = await client.execute({
        sql: 'DELETE FROM products WHERE name_zh LIKE ? OR name_en LIKE ? OR product_code LIKE ?',
        args: [`%${pattern}%`, `%${pattern}%`, `%${pattern}%`]
      });
      deletedCount += deleteResult.rowsAffected;
      console.log(`删除包含 "${pattern}" 的测试产品: ${deleteResult.rowsAffected} 个`);
    }

    // 3. 添加正常的产品示例数据
    console.log('\n➕ 添加正常产品示例数据...');

    const sampleProducts = [
      {
        product_code: 'KWG-001',
        name_zh: '通用型墙纸胶粉',
        name_en: 'Universal Wallpaper Adhesive Powder',
        name_ru: 'Универсальный клей для обоев',
        description_zh: '高品质通用型墙纸胶粉，适用于各种类型的墙纸施工，粘结力强，环保无毒。',
        description_en: 'High-quality universal wallpaper adhesive powder suitable for all types of wallpaper applications with strong adhesion and eco-friendly formula.',
        description_ru: 'Высококачественный универсальный клей для обоев, подходит для всех видов обоев с сильной адгезией и экологичной формулой.',
        image_url: '/images/products/universal-wallpaper-glue.jpg',
        category: 'adhesive',
        price_range: '¥50-100/袋',
        is_active: 1,
        is_featured: 1,
        sort_order: 1,
        features_zh: JSON.stringify(['强效粘结', '环保配方', '易于施工', '持久耐用']),
        features_en: JSON.stringify(['Strong Adhesion', 'Eco-Friendly', 'Easy Application', 'Long-Lasting']),
        features_ru: JSON.stringify(['Сильная адгезия', 'Экологичный', 'Легкое нанесение', 'Долговечный'])
      },
      {
        product_code: 'KWG-002',
        name_zh: '重型墙纸专用胶',
        name_en: 'Heavy-Duty Wallpaper Adhesive',
        name_ru: 'Специальный клей для тяжелых обоев',
        description_zh: '专为重型墙纸设计的高强度胶粉，适用于厚重、织物质感的墙纸，提供卓越的支撑力。',
        description_en: 'High-strength adhesive powder specially designed for heavy-weight wallpapers, providing excellent support for thick and textured wallpapers.',
        description_ru: 'Клей высокой прочности, специально разработанный для тяжелых обоев, обеспечивающий отличную поддержку для толстых и текстурированных обоев.',
        image_url: '/images/products/heavy-duty-adhesive.jpg',
        category: 'adhesive',
        price_range: '¥80-150/袋',
        is_active: 1,
        is_featured: 1,
        sort_order: 2,
        features_zh: JSON.stringify(['超强粘结', '防霉防潮', '快干配方', '专业级']),
        features_en: JSON.stringify(['Extra Strong', 'Mold & Moisture Resistant', 'Fast-Drying', 'Professional Grade']),
        features_ru: JSON.stringify(['Сверхпрочный', 'Устойчивый к плесени и влаге', 'Быстросохнущий', 'Профессиональный'])
      },
      {
        product_code: 'KWG-003',
        name_zh: '无纺布墙纸胶',
        name_en: 'Non-Woven Wallpaper Adhesive',
        name_ru: 'Клей для флизелиновых обоев',
        description_zh: '专为无纺布墙纸调配的胶粉，配方温和，不会损伤墙纸材质，施工方便。',
        description_en: 'Specially formulated adhesive powder for non-woven wallpapers, gentle formula that won damage wallpaper material, easy to apply.',
        description_ru: 'Специально разработанный клей для флизелиновых обоев, мягкая формула, которая не повреждает материал обоев, легко наносится.',
        image_url: '/images/products/non-woven-adhesive.jpg',
        category: 'adhesive',
        price_range: '¥60-120/袋',
        is_active: 1,
        is_featured: 0,
        sort_order: 3,
        features_zh: JSON.stringify(['温和配方', '护墙纸材质', '环保无毒', '施工便捷']),
        features_en: JSON.stringify(['Gentle Formula', 'Wallpaper Protection', 'Eco-Friendly', 'Easy to Apply']),
        features_ru: JSON.stringify(['Мягкая формула', 'Защита обоев', 'Экологичный', 'Легко наносить'])
      },
      {
        product_code: 'KWO-001',
        name_zh: '小包装墙纸胶 200g',
        name_en: 'Small Package Wallpaper Adhesive 200g',
        name_ru: 'Маленькая упаковка клея для обоев 200г',
        description_zh: '铝箔袋小包装，适合小面积装修和DIY使用，即开即用，方便存储。',
        description_en: 'Aluminum foil small package, suitable for small area renovation and DIY use, ready to use, convenient storage.',
        description_ru: 'Маленькая упаковка из алюминиевой фольги, подходит для небольшого ремонта и DIY, готов к использованию, удобное хранение.',
        image_url: '/images/products/small-package-200g.jpg',
        category: 'retail',
        price_range: '¥15-25/袋',
        is_active: 1,
        is_featured: 1,
        sort_order: 4,
        features_zh: JSON.stringify(['铝箔包装', '防潮保鲜', '便携设计', 'DIY友好']),
        features_en: JSON.stringify(['Aluminum Foil Package', 'Moisture-Proof', 'Portable Design', 'DIY Friendly']),
        features_ru: JSON.stringify(['Упаковка из фольги', 'Влагостойкость', 'Портативный дизайн', 'Подходит для DIY'])
      }
    ];

    let addedCount = 0;
    for (const product of sampleProducts) {
      try {
        // 检查是否已存在
        const existing = await client.execute({
          sql: 'SELECT id FROM products WHERE product_code = ?',
          args: [product.product_code]
        });

        if (existing.rows.length === 0) {
          const insertResult = await client.execute({
            sql: `
              INSERT INTO products (
                product_code, name_zh, name_en, name_ru,
                description_zh, description_en, description_ru,
                image_url, category, price_range, is_active, is_featured, sort_order,
                features_zh, features_en, features_ru,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `,
            args: [
              product.product_code, product.name_zh, product.name_en, product.name_ru,
              product.description_zh, product.description_en, product.description_ru,
              product.image_url, product.category, product.price_range,
              product.is_active, product.is_featured, product.sort_order,
              product.features_zh, product.features_en, product.features_ru
            ]
          });

          console.log(`✅ 添加产品: ${product.name_zh} (${product.product_code})`);
          addedCount++;
        } else {
          console.log(`⚠️  产品已存在: ${product.name_zh} (${product.product_code})`);
        }
      } catch (error) {
        console.error(`❌ 添加产品失败 ${product.product_code}:`, error.message);
      }
    }

    // 4. 验证修复结果
    console.log('\n🔍 验证修复结果...');
    const finalProducts = await client.execute('SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order, id');
    console.log(`修复后数据库中共有 ${finalProducts.rows.length} 个活跃产品:`);

    finalProducts.rows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.product_code} - ${product.name_zh} (${product.name_en})`);
    });

    // 5. 关闭数据库连接
    client.close();

    console.log('\n🎉 产品数据修复完成!');
    console.log(`📊 修复统计:`);
    console.log(`   - 删除测试产品: ${deletedCount} 个`);
    console.log(`   - 添加正常产品: ${addedCount} 个`);
    console.log(`   - 最终活跃产品: ${finalProducts.rows.length} 个`);

  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  fixProductData();
}

module.exports = { fixProductData };