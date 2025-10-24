/**
 * 完善首页内容脚本
 */

async function populateHomeContent() {
  console.log('🏠 开始完善首页内容...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token';

    // 首页内容数据
    const homeContentData = [
      // 演示视频板块
      {
        page_key: 'home',
        section_key: 'demo_video_title',
        content_zh: '产品演示视频',
        content_en: 'Product Demo Video',
        content_ru: 'Видео демонстрации продукта',
        content_type: 'text',
        sort_order: 1
      },
      {
        page_key: 'home',
        section_key: 'demo_video_subtitle',
        content_zh: '通过视频了解我们的产品特性和使用方法',
        content_en: 'Learn about our product features and usage methods through video',
        content_ru: 'Узнайте о функциях продукта и методах использования через видео',
        content_type: 'text',
        sort_order: 2
      },
      {
        page_key: 'home',
        section_key: 'demo_video_url',
        content_zh: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content_en: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content_ru: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content_type: 'video',
        sort_order: 3
      },
      {
        page_key: 'home',
        section_key: 'demo_video_step1_title',
        content_zh: '简单混合步骤',
        content_en: 'Simple Mixing Steps',
        content_ru: 'Простые шаги смешивания',
        content_type: 'text',
        sort_order: 4
      },
      {
        page_key: 'home',
        section_key: 'demo_video_step1_desc',
        content_zh: '观看我们的产品如何与清水轻松高效地混合',
        content_en: 'Watch how our products mix easily and efficiently with clean water',
        content_ru: 'Посмотрите, как наши продукты легко и эффективно смешиваются с чистой водой',
        content_type: 'text',
        sort_order: 5
      },
      {
        page_key: 'home',
        section_key: 'demo_video_step2_title',
        content_zh: '专业施工技巧',
        content_en: 'Professional Application Techniques',
        content_ru: 'Профессиональные методы применения',
        content_type: 'text',
        sort_order: 6
      },
      {
        page_key: 'home',
        section_key: 'demo_video_step2_desc',
        content_zh: '学习如何正确施工我们的产品以获得最佳效果',
        content_en: 'Learn how to properly apply our products for optimal results',
        content_ru: 'Узнайте, как правильно применять наши продукты для достижения оптимальных результатов',
        content_type: 'text',
        sort_order: 7
      },

      // OEM定制板块
      {
        page_key: 'home',
        section_key: 'oem_title',
        content_zh: 'OEM定制生产服务',
        content_en: 'OEM Custom Manufacturing Services',
        content_ru: 'Услуги OEM производства',
        content_type: 'text',
        sort_order: 8
      },
      {
        page_key: 'home',
        section_key: 'oem_description',
        content_zh: '卡恩拥有23年墙纸胶生产经验，为全球客户提供专业OEM/ODM服务。我们可以根据您的要求定制产品配方、包装和品牌。',
        content_en: 'Karn has over 23 years of wallpaper adhesive production experience, providing professional OEM/ODM services to global clients. We can customize product formulations, packaging, and branding according to your requirements.',
        content_ru: 'Karn имеет более 23 лет опыта производства клея для обоев, предоставляя профессиональные OEM/ODM услуги глобальным клиентам. Мы можем настроить формулы продуктов, упаковку и брендинг согласно вашим требованиям.',
        content_type: 'text',
        sort_order: 9
      },
      {
        page_key: 'home',
        section_key: 'oem_feature1',
        content_zh: '品牌定制：根据您的品牌要求进行生产',
        content_en: 'Brand Customization: Production according to your brand requirements',
        content_ru: 'Брендинг: Производство согласно требованиям вашего бренда',
        content_type: 'text',
        sort_order: 10
      },
      {
        page_key: 'home',
        section_key: 'oem_feature2',
        content_zh: '包装定制：从小包装到大包装的各种包装选择',
        content_en: 'Packaging Customization: Various packaging options from small to large packages',
        content_ru: 'Упаковка: Различные варианты упаковки от маленькой до большой',
        content_type: 'text',
        sort_order: 11
      },
      {
        page_key: 'home',
        section_key: 'oem_feature3',
        content_zh: '配方定制：根据市场需求调整产品性能',
        content_en: 'Formula Customization: Adjust product performance according to market demands',
        content_ru: 'Формула: Настройка производительности продукта в соответствии с рыночными требованиями',
        content_type: 'text',
        sort_order: 12
      },
      {
        page_key: 'home',
        section_key: 'oem_feature4',
        content_zh: '出口至45个国家和地区',
        content_en: 'Exported to 45 countries and regions',
        content_ru: 'Экспорт в 45 стран и регионов',
        content_type: 'text',
        sort_order: 13
      },
      {
        page_key: 'home',
        section_key: 'oem_image',
        content_zh: '/images/home/oem-services.jpg',
        content_en: '/images/home/oem-services.jpg',
        content_ru: '/images/home/oem-services.jpg',
        content_type: 'image',
        sort_order: 14
      },

      // 半成品小袋板块
      {
        page_key: 'home',
        section_key: 'small_package_title',
        content_zh: '半成品墙纸胶小包装',
        content_en: 'Semi-Finished Wallpaper Adhesive Small Packaging',
        content_ru: 'Маленькая упаковка полуфабриката клея для обоев',
        content_type: 'text',
        sort_order: 15
      },
      {
        page_key: 'home',
        section_key: 'small_package_description',
        content_zh: '我们提供200g至500g铝箔袋小包装的半成品墙纸胶，适合小面积装修需求和零售市场。这些产品易于储存和运输，使用前只需加水即可。',
        content_en: 'We provide 200g to 500g aluminum foil bag small packaging of semi-finished wallpaper adhesive, suitable for small-area renovation needs and retail markets. These products are easy to store and transport, requiring only water addition before use.',
        content_ru: 'Мы предлагаем малую упаковку полуфабриката клея для обоев в алюминиевых пакетах от 200г до 500г, подходящую для небольших ремонтных работ и розничного рынка. Эти продукты легко хранить и транспортировать, требуется только добавление воды перед использованием.',
        content_type: 'text',
        sort_order: 16
      },
      {
        page_key: 'home',
        section_key: 'small_package_feature1',
        content_zh: '规格齐全：200g、300g、400g、500g可选',
        content_en: 'Complete Specifications: 200g, 300g, 400g, 500g available',
        content_ru: 'Полные спецификации: Доступны 200г, 300г, 400г, 500г',
        content_type: 'text',
        sort_order: 17
      },
      {
        page_key: 'home',
        section_key: 'small_package_feature2',
        content_zh: '铝箔袋包装：防潮性能好',
        content_en: 'Aluminum Foil Bag Packaging: Good moisture resistance',
        content_ru: 'Упаковка из алюминиевой фольги: Хорошая влагостойкость',
        content_type: 'text',
        sort_order: 18
      },
      {
        page_key: 'home',
        section_key: 'small_package_feature3',
        content_zh: '适合家装市场和建材零售',
        content_en: 'Suitable for home decoration markets and building materials retail',
        content_ru: 'Подходит для рынков домашнего декора и розничной продажи стройматериалов',
        content_type: 'text',
        sort_order: 19
      },
      {
        page_key: 'home',
        section_key: 'small_package_feature4',
        content_zh: '品牌定制：可定制包装和标签',
        content_en: 'Brand Customization: Custom packaging and labels available',
        content_ru: 'Брендинг: Доступны пользовательская упаковка и этикетки',
        content_type: 'text',
        sort_order: 20
      },
      {
        page_key: 'home',
        section_key: 'small_package_image',
        content_zh: '/images/home/small-packaging.jpg',
        content_en: '/images/home/small-packaging.jpg',
        content_ru: '/images/home/small-packaging.jpg',
        content_type: 'image',
        sort_order: 21
      }
    ];

    console.log(`📝 准备添加 ${homeContentData.length} 个首页内容项...`);

    let addedCount = 0;
    for (const content of homeContentData) {
      try {
        console.log(`📦 添加内容: ${content.section_key}...`);

        const response = await fetch(`${baseUrl}/api/admin/home-content`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(content)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ 成功添加: ${content.section_key}`);
          addedCount++;
        } else {
          const errorData = await response.json();
          console.log(`❌ 添加失败: ${content.section_key} - ${errorData.error?.message || response.status}`);
        }
      } catch (error) {
        console.log(`❌ 添加错误: ${content.section_key} - ${error.message}`);
      }
    }

    console.log(`\n🎉 首页内容添加完成! 成功添加 ${addedCount} 个内容项`);

    // 验证添加结果
    console.log('\n🔍 验证首页内容...');
    const verifyResponse = await fetch(`${baseUrl}/api/admin/home-content`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log(`📦 首页内容总数: ${verifyData.data?.length || 0}`);

      // 按板块分组显示
      const sections = {
        'demo_video_title': '演示视频板块',
        'oem_title': 'OEM定制板块',
        'small_package_title': '半成品小袋板块'
      };

      Object.entries(sections).forEach(([key, name]) => {
        const sectionItems = verifyData.data?.filter(item =>
          item.section_key === key || item.section_key.startsWith(key.replace('_title', ''))
        ) || [];
        console.log(`📋 ${name}: ${sectionItems.length} 个内容项`);
      });
    }

    console.log('\n✅ 首页内容完善完成！');
    console.log('🌐 管理后台现在应该显示完整的内容，不再有"未设置"状态。');

  } catch (error) {
    console.error('❌ 添加首页内容失败:', error.message);
  }
}

populateHomeContent();