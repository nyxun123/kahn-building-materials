// Initialize D1 database for Cloudflare Pages
// This script will create the necessary tables in the D1 database

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Check if D1 database is available
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'D1 database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🚀 Starting D1 database initialization...');
    
    // Create the page_contents table
    const createTableSql = `
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
    `;
    
    await env.DB.prepare(createTableSql).run();
    
    console.log('✅ page_contents table created (if not exists)');
    
    // Create indexes
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_page_contents_page_key ON page_contents(page_key)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_page_contents_section_key ON page_contents(section_key)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_page_contents_is_active ON page_contents(is_active)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_page_contents_sort_order ON page_contents(sort_order)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_page_contents_updated_at ON page_contents(updated_at)').run();
    
    console.log('✅ Indexes created');
    
    // Create the contacts table with migration support
    // First, check if the table exists
    const tableExists = await env.DB.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='contacts'
    `).first();
    
    if (tableExists) {
      // Check if we need to add missing columns
      const tableInfo = await env.DB.prepare('PRAGMA table_info(contacts)').all();
      const columns = tableInfo.results.map(col => col.name);
      
      // Add missing columns if needed
      if (!columns.includes('country')) {
        await env.DB.prepare('ALTER TABLE contacts ADD COLUMN country TEXT').run();
        console.log('✅ Added country column to contacts table');
      }
      if (!columns.includes('subject')) {
        await env.DB.prepare('ALTER TABLE contacts ADD COLUMN subject TEXT').run();
        console.log('✅ Added subject column to contacts table');
      }
      if (!columns.includes('language')) {
        await env.DB.prepare('ALTER TABLE contacts ADD COLUMN language TEXT DEFAULT "zh"').run();
        console.log('✅ Added language column to contacts table');
      }
    } else {
      // Create the contacts table from scratch
      const createContactsTableSql = `
        CREATE TABLE contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          company TEXT,
          country TEXT,
          subject TEXT,
          message TEXT NOT NULL,
          language TEXT DEFAULT 'zh',
          status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
          is_read INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await env.DB.prepare(createContactsTableSql).run();
      console.log('✅ contacts table created');
    }
    
    // Create indexes for contacts table (IF NOT EXISTS handles existing indexes)
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at)').run();
    
    console.log('✅ Contacts indexes created');
    
    // Insert default OEM content if it doesn't exist
    const defaultOEMContents = [
      {
        page_key: 'oem',
        section_key: 'oem_title',
        content_zh: 'OEM代工定制服务',
        content_en: 'OEM Custom Manufacturing Services',
        content_ru: 'OEM услуги по индивидуальному производству',
        content_type: 'text',
        sort_order: 1
      },
      {
        page_key: 'oem',
        section_key: 'oem_description',
        content_zh: '卡恩拥有超过23年的墙纸胶生产经验，为全球客户提供专业的OEM/ODM代工服务。我们可以根据您的要求定制产品配方、包装和品牌。',
        content_en: 'Karn has over 23 years of wallpaper adhesive production experience, providing professional OEM/ODM services to global clients. We can customize product formulations, packaging, and branding according to your requirements.',
        content_ru: 'Карн имеет более чем 23-летний опыт производства клея для обоев, предоставляя профессиональные OEM/ODM услуги клиентам по всему миру. Мы можем настраивать формулы продукции, упаковку и брендинг в соответствии с вашими требованиями.',
        content_type: 'text',
        sort_order: 2
      },
      {
        page_key: 'oem',
        section_key: 'oem_features',
        content_zh: '["专业研发团队","先进生产设备","严格质量控制","个性化包装","快速交付","技术支持"]',
        content_en: '["Professional R&D Team","Advanced Production Equipment","Strict Quality Control","Personalized Packaging","Fast Delivery","Technical Support"]',
        content_ru: '["Профессиональная команда НИОКР","Передовое производственное оборудование","Строгий контроль качества","Персонализированная упаковка","Быстрая доставка","Техническая поддержка"]',
        content_type: 'json',
        sort_order: 3
      },
      {
        page_key: 'oem',
        section_key: 'oem_images',
        content_zh: '["/images/oem-home.png"]',
        content_en: '["/images/oem-home.png"]',
        content_ru: '["/images/oem-home.png"]',
        content_type: 'json',
        sort_order: 4
      },
      {
        page_key: 'oem',
        section_key: 'seo_title',
        content_zh: 'OEM/ODM墙纸胶定制服务 - 专业墙纸胶代工生产厂家',
        content_en: 'OEM/ODM Wallpaper Adhesive Custom Service - Professional Wallpaper Adhesive Manufacturing Factory',
        content_ru: 'OEM/ODM услуги клея для обоев на заказ - Профессиональный завод по производству клея для обоев',
        content_type: 'text',
        sort_order: 10
      }
    ];

    for (const content of defaultOEMContents) {
      const existing = await env.DB.prepare(
        'SELECT id FROM page_contents WHERE page_key = ? AND section_key = ?'
      ).bind(content.page_key, content.section_key).first();
      
      if (!existing) {
        await env.DB.prepare(`
          INSERT INTO page_contents 
          (page_key, section_key, content_zh, content_en, content_ru, content_type, sort_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          content.page_key,
          content.section_key,
          content.content_zh,
          content.content_en,
          content.content_ru,
          content.content_type,
          content.sort_order,
          1
        ).run();
      }
    }
    
    console.log('✅ Default OEM content inserted');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'D1 database initialized successfully',
      tables: ['page_contents', 'contacts']
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
      const existing = await env.DB.prepare(
        'SELECT id FROM page_contents WHERE page_key = ? AND section_key = ?'
      ).bind(content.page_key, content.section_key).first();
      
      if (!existing) {
        await env.DB.prepare(`
          INSERT INTO page_contents 
          (page_key, section_key, content_zh, content_en, content_ru, content_type, sort_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          content.page_key,
          content.section_key,
          content.content_zh,
          content.content_en,
          content.content_ru,
          content.content_type,
          content.sort_order,
          1
        ).run();
      }
    }
    
    console.log('✅ Default OEM content inserted');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'D1 database initialized successfully',
      tables: ['page_contents', 'contacts']
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}