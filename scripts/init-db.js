import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// 创建页面内容表迁移
async function createPageContentsTable(db) {
  await new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS page_contents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_key TEXT NOT NULL,
        section_key TEXT NOT NULL,
        content_zh TEXT,
        content_en TEXT,
        content_ru TEXT,
        content_type TEXT DEFAULT 'text',
        meta_data TEXT,
        category TEXT,
        tags TEXT,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        meta_title_zh TEXT,
        meta_title_en TEXT,
        meta_title_ru TEXT,
        meta_description_zh TEXT,
        meta_description_en TEXT,
        meta_description_ru TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page_key, section_key)
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // 创建索引
  await new Promise((resolve, reject) => {
    db.run('CREATE INDEX IF NOT EXISTS idx_page_contents_page_key ON page_contents(page_key)', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  await new Promise((resolve, reject) => {
    db.run('CREATE INDEX IF NOT EXISTS idx_page_contents_section_key ON page_contents(section_key)', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  await new Promise((resolve, reject) => {
    db.run('CREATE INDEX IF NOT EXISTS idx_page_contents_is_active ON page_contents(is_active)', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  await new Promise((resolve, reject) => {
    db.run('CREATE INDEX IF NOT EXISTS idx_page_contents_sort_order ON page_contents(sort_order)', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  await new Promise((resolve, reject) => {
    db.run('CREATE INDEX IF NOT EXISTS idx_page_contents_updated_at ON page_contents(updated_at)', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // 插入默认首页内容数据
  const defaultHomeContents = [
    {
      page_key: 'home',
      section_key: 'hero_title',
      content_zh: '专业的新型建材供应商',
      content_en: 'Professional New Building Materials Supplier',
      content_ru: 'Профессиональный поставщик новых строительных материалов',
      content_type: 'text',
      sort_order: 1
    },
    {
      page_key: 'home',
      section_key: 'hero_subtitle',
      content_zh: '杭州卡恩新型建材有限公司专注于高品质墙纸胶粉的研发与生产',
      content_en: 'Hangzhou Karn New Building Materials Co., Ltd. specializes in the R&D and production of high-quality wallpaper adhesive powders',
      content_ru: 'Ханчжоу Карн Новые Строительные Материалы Ко., Лтд. специализируется на НИОКР и производстве высококачественных клеевых порошков для обоев',
      content_type: 'text',
      sort_order: 2
    },
    {
      page_key: 'home',
      section_key: 'products_title',
      content_zh: '我们的产品',
      content_en: 'Our Products',
      content_ru: 'Наша продукция',
      content_type: 'text',
      sort_order: 3
    },
    {
      page_key: 'home',
      section_key: 'products_subtitle',
      content_zh: '发现我们的高品质墙纸胶产品系列',
      content_en: 'Discover our high-quality wallpaper adhesive product series',
      content_ru: 'Откройте для себя нашу серию высококачественных клеев для обоев',
      content_type: 'text',
      sort_order: 4
    },
    {
      page_key: 'home',
      section_key: 'video_title',
      content_zh: '产品演示视频',
      content_en: 'Product Demo Video',
      content_ru: 'Видео демонстрации продукции',
      content_type: 'text',
      sort_order: 5
    },
    {
      page_key: 'home',
      section_key: 'video_subtitle',
      content_zh: '通过视频了解我们的产品特点和使用方法',
      content_en: 'Learn about our product features and usage methods through video',
      content_ru: 'Узнайте о функциях и методах использования нашей продукции через видео',
      content_type: 'text',
      sort_order: 6
    },
    {
      page_key: 'home',
      section_key: 'video_url',
      content_zh: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content_en: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content_ru: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content_type: 'url',
      sort_order: 7
    },
    {
      page_key: 'home',
      section_key: 'oem_title',
      content_zh: 'OEM代工定制服务',
      content_en: 'OEM Custom Manufacturing Services',
      content_ru: 'OEM услуги по индивидуальному производству',
      content_type: 'text',
      sort_order: 8
    },
    {
      page_key: 'home',
      section_key: 'oem_subtitle',
      content_zh: '卡恩拥有超过23年的墙纸胶生产经验，为全球客户提供专业的OEM/ODM代工服务。我们可以根据您的要求定制产品配方、包装和品牌。',
      content_en: 'Karn has over 23 years of wallpaper adhesive production experience, providing professional OEM/ODM services to global clients. We can customize product formulations, packaging, and branding according to your requirements.',
      content_ru: 'Карн имеет более чем 23-летний опыт производства клея для обоев, предоставляя профессиональные OEM/ODM услуги клиентам по всему миру. Мы можем настраивать формулы продукции, упаковку и брендинг в соответствии с вашими требованиями.',
      content_type: 'text',
      sort_order: 9
    },
    {
      page_key: 'home',
      section_key: 'semi_title',
      content_zh: '半成品墙纸胶小包装',
      content_en: 'Semi-Finished Wallpaper Adhesive Small Packaging',
      content_ru: 'Полуфабрикаты клея для обоев в малой упаковке',
      content_type: 'text',
      sort_order: 10
    },
    {
      page_key: 'home',
      section_key: 'semi_subtitle',
      content_zh: '我们提供200g至500g铝膜袋小包装的半成品墙纸胶，适合小面积装修需求和零售市场。这些产品便于存储和运输，使用时只需加水即可。',
      content_en: 'We provide 200g to 500g aluminum foil bag small packaging of semi-finished wallpaper adhesive, suitable for small-area renovation needs and retail markets. These products are easy to store and transport, requiring only water addition before use.',
      content_ru: 'Мы предоставляем полуфабрикаты клея для обоев в алюминиевых пакетах от 200г до 500г, подходящие для небольших площадей ремонта и розничных рынков. Эта продукция удобна для хранения и транспортировки, требует только добавления воды перед использованием.',
      content_type: 'text',
      sort_order: 11
    },
    {
      page_key: 'home',
      section_key: 'why_us_title',
      content_zh: '为什么选择我们',
      content_en: 'Why Choose Us',
      content_ru: 'Почему выбирают нас',
      content_type: 'text',
      sort_order: 12
    },
    {
      page_key: 'home',
      section_key: 'why_us_subtitle',
      content_zh: '20年专业经验，为全球客户提供高品质的墙面处理产品',
      content_en: '20 years of professional experience providing high-quality wall treatment products to global clients',
      content_ru: '20 лет профессионального опыта предоставления высококачественной продукции для обработки стен клиентам по всему миру',
      content_type: 'text',
      sort_order: 13
    },
    {
      page_key: 'home',
      section_key: 'cta_title',
      content_zh: '联系我们获取专业解决方案',
      content_en: 'Contact Us for Professional Solutions',
      content_ru: 'Свяжитесь с нами для профессиональных решений',
      content_type: 'text',
      sort_order: 14
    },
    {
      page_key: 'home',
      section_key: 'cta_description',
      content_zh: '立即联系我们的专业团队，获取适合您需求的高品质墙纸胶产品和定制服务',
      content_en: 'Contact our professional team now to get high-quality wallpaper adhesive products and custom services tailored to your needs',
      content_ru: 'Свяжитесь с нашей профессиональной командой прямо сейчас, чтобы получить высококачественную продукцию для клея для обоев и индивидуальные услуги, адаптированные к вашим потребностям',
      content_type: 'text',
      sort_order: 15
    }
  ];

  // 插入默认数据
  for (const content of defaultHomeContents) {
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO page_contents 
        (page_key, section_key, content_zh, content_en, content_ru, content_type, sort_order) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        content.page_key,
        content.section_key,
        content.content_zh,
        content.content_en,
        content.content_ru,
        content.content_type,
        content.sort_order
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

async function initializeDatabase() {
  console.log('🚀 开始初始化数据库...\n');

  try {
    // 确保数据目录存在
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'backend-management.db');
    console.log('数据库路径:', dbPath);

    // 创建数据库连接
    const db = new sqlite3.Database(dbPath);

    // 启用外键约束
    await new Promise((resolve, reject) => {
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 创建页面内容表
    await createPageContentsTable(db);

    // 测试查询
    const contents = await new Promise((resolve, reject) => {
      db.all('SELECT COUNT(*) as count FROM page_contents', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log('📊 数据库初始化完成');
    console.log('📋 页面内容表记录数:', contents[0].count);

    // 关闭数据库连接
    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ 数据库初始化成功完成！');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initializeDatabase().catch(error => {
  console.error('❌ 初始化脚本执行失败:', error);
  process.exit(1);
});