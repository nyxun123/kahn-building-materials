// Cloudflare D1数据库更新脚本
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 更新产品数据
    const updates = [
      'specifications_zh = ?',
      'specifications_en = ?',
      'specifications_ru = ?',
      'applications_zh = ?',
      'applications_en = ?',
      'applications_ru = ?',
      'features_zh = ?',
      'features_en = ?',
      'features_ru = ?',
      'image_url = ?'
    ];

    const values = [
      '• 环保配方，无毒无味\n• 高粘度，持久性强\n• 防霉抗菌，使用寿命长\n• 适用于各种材质墙面\n• 易调配，施工方便',
      '• Eco-friendly formula, non-toxic and odorless\n• High viscosity, strong durability\n• Mold and bacteria resistant, long service life\n• Suitable for all wall materials\n• Easy to mix and apply',
      '• Экологичная формула, нетоксичная и без запаха\n• Высокая вязкость, прочная адгезия\n• Устойчивость к плесени и бактериям, долгий срок службы\n• Подходит для всех видов стеновых материалов\n• Легко смешивать и наносить',
      '• 客厅、卧室、书房等室内空间\n• 商业办公空间装饰\n• 酒店、宾馆墙面装修\n• 各种纸质、布质、无纺布壁纸',
      '• Living rooms, bedrooms, study rooms and other indoor spaces\n• Commercial office space decoration\n• Hotel and guesthouse wall decoration\n• All types of paper, fabric, non-woven wallpapers',
      '• Гостиные, спальни, кабинеты и другие внутренние помещения\n• Декорирование коммерческих офисных пространств\n• Отделка стен в отелях и гостевых домах\n• Все виды бумажных, тканевых, нетканых обоев',
      JSON.stringify(['环保配方', '高粘度', '持久耐用', '防霉抗菌', '易于施工']),
      JSON.stringify(['Eco-friendly', 'High Viscosity', 'Durable', 'Mold Resistant', 'Easy to Apply']),
      JSON.stringify(['Экологичный', 'Высокая вязкость', 'Долговечный', 'Устойчивый к плесени', 'Легко наносить']),
      '/images/hanmero_wallpaper_glue_powder_product_packaging_box.jpg'
    ];

    const result = await env.DB.prepare(`
      UPDATE products
      SET ${updates.join(', ')}
      WHERE product_code = 'WPG-001'
    `).bind(...values).run();

    return new Response(JSON.stringify({
      success: true,
      message: '产品数据更新成功',
      changes: result.changes
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: `更新失败: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}