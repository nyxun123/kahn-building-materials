// 快速修复产品数据脚本
const productUpdates = [
  {
    product_code: 'WPG-001',
    updates: {
      specifications_zh: '• 环保配方，无毒无味\n• 高粘度，持久性强\n• 防霉抗菌，使用寿命长\n• 适用于各种材质墙面\n• 易调配，施工方便',
      specifications_en: '• Eco-friendly formula, non-toxic and odorless\n• High viscosity, strong durability\n• Mold and bacteria resistant, long service life\n• Suitable for all wall materials\n• Easy to mix and apply',
      specifications_ru: '• Экологичная формула, нетоксичная и без запаха\n• Высокая вязкость, прочная адгезия\n• Устойчивость к плесени и бактериям, долгий срок службы\n• Подходит для всех видов стеновых материалов\n• Легко смешивать и наносить',
      applications_zh: '• 客厅、卧室、书房等室内空间\n• 商业办公空间装饰\n• 酒店、宾馆墙面装修\n• 各种纸质、布质、无纺布壁纸',
      applications_en: '• Living rooms, bedrooms, study rooms and other indoor spaces\n• Commercial office space decoration\n• Hotel and guesthouse wall decoration\n• All types of paper, fabric, non-woven wallpapers',
      applications_ru: '• Гостиные, спальни, кабинеты и другие внутренние помещения\n• Декорирование коммерческих офисных пространств\n• Отделка стен в отелях и гостевых домах\n• Все виды бумажных, тканевых, нетканых обоев',
      features_zh: JSON.stringify(['环保配方', '高粘度', '持久耐用', '防霉抗菌', '易于施工']),
      features_en: JSON.stringify(['Eco-friendly', 'High Viscosity', 'Durable', 'Mold Resistant', 'Easy to Apply']),
      features_ru: JSON.stringify(['Экологичный', 'Высокая вязкость', 'Долговечный', 'Устойчивый к плесени', 'Легко наносить']),
      image_url: '/images/hanmero_wallpaper_glue_powder_product_packaging_box.jpg'
    }
  }
];

console.log('产品数据修复脚本已生成');
console.log('请使用以下SQL命令手动更新数据库：');
console.log('');

productUpdates.forEach(({ product_code, updates }) => {
  console.log(`-- 更新产品 ${product_code}`);
  console.log(`UPDATE products SET`);
  Object.entries(updates).forEach(([key, value], index) => {
    const comma = index < Object.entries(updates).length - 1 ? ',' : '';
    console.log(`  ${key} = '${value}'${comma}`);
  });
  console.log(`WHERE product_code = '${product_code}';`);
  console.log('');
});