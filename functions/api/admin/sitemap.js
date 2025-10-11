export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // 认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: '需要登录' }
      }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (!env.DB) {
      // 如果没有数据库，返回默认网站地图配置
      const defaultSitemap = getDefaultSitemapEntries();
      return new Response(JSON.stringify(defaultSitemap), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 查询网站地图配置
      const sitemapEntries = await env.DB.prepare(`
        SELECT * FROM sitemap_entries ORDER BY priority DESC, created_at ASC
      `).all();
      
      if (sitemapEntries.results && sitemapEntries.results.length > 0) {
        return new Response(JSON.stringify(sitemapEntries.results), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } else {
        // 返回默认配置
        const defaultSitemap = getDefaultSitemapEntries();
        return new Response(JSON.stringify(defaultSitemap), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (dbError) {
      console.error('网站地图查询失败:', dbError);
      // 返回默认配置
      const defaultSitemap = getDefaultSitemapEntries();
      return new Response(JSON.stringify(defaultSitemap), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('网站地图API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '获取网站地图失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: '需要登录' }
      }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const entryData = await request.json();
    
    if (!env.DB) {
      return new Response(JSON.stringify({
        message: '网站地图条目保存成功（演示模式）'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 检查表是否存在，如果不存在则创建
      await ensureSitemapTable(env.DB);
      
      // 插入或更新网站地图条目
      if (entryData.id) {
        // 更新现有条目
        await env.DB.prepare(`
          UPDATE sitemap_entries SET 
            url = ?, url_zh = ?, url_en = ?, url_ru = ?,
            priority = ?, changefreq = ?, status = ?, page_type = ?,
            is_multilingual = ?, lastmod = ?
          WHERE id = ?
        `).bind(
          entryData.url,
          entryData.url_zh,
          entryData.url_en,
          entryData.url_ru,
          entryData.priority,
          entryData.changefreq,
          entryData.status,
          entryData.page_type,
          entryData.is_multilingual ? 1 : 0,
          new Date().toISOString(),
          entryData.id
        ).run();
      } else {
        // 插入新条目
        await env.DB.prepare(`
          INSERT INTO sitemap_entries (
            url, url_zh, url_en, url_ru, priority, changefreq, 
            status, page_type, is_multilingual, lastmod
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          entryData.url,
          entryData.url_zh || entryData.url,
          entryData.url_en || entryData.url,
          entryData.url_ru || entryData.url,
          entryData.priority || 0.5,
          entryData.changefreq || 'monthly',
          entryData.status || 'active',
          entryData.page_type || 'other',
          entryData.is_multilingual ? 1 : 0,
          new Date().toISOString()
        ).run();
      }
      
      return new Response(JSON.stringify({
        message: '网站地图条目保存成功'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (dbError) {
      console.error('网站地图保存失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库保存失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('网站地图保存API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '保存网站地图失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// 辅助函数
function getDefaultSitemapEntries() {
  return [
    {
      id: 1,
      url: "/",
      url_zh: "/",
      url_en: "/en",
      url_ru: "/ru",
      priority: 1.0,
      changefreq: "daily",
      lastmod: new Date().toISOString(),
      status: "active",
      page_type: "homepage",
      is_multilingual: true,
    },
    {
      id: 2,
      url: "/products",
      url_zh: "/products",
      url_en: "/en/products",
      url_ru: "/ru/products",
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
      status: "active",
      page_type: "product",
      is_multilingual: true,
    },
    {
      id: 3,
      url: "/oem",
      url_zh: "/oem",
      url_en: "/en/oem",
      url_ru: "/ru/oem",
      priority: 0.8,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
      status: "active",
      page_type: "service",
      is_multilingual: true,
    },
    {
      id: 4,
      url: "/about",
      url_zh: "/about",
      url_en: "/en/about",
      url_ru: "/ru/about",
      priority: 0.7,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
      status: "active",
      page_type: "about",
      is_multilingual: true,
    },
    {
      id: 5,
      url: "/contact",
      url_zh: "/contact",
      url_en: "/en/contact",
      url_ru: "/ru/contact",
      priority: 0.8,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
      status: "active",
      page_type: "contact",
      is_multilingual: true,
    },
  ];
}

async function ensureSitemapTable(db) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS sitemap_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        url_zh TEXT,
        url_en TEXT,
        url_ru TEXT,
        priority REAL DEFAULT 0.5,
        changefreq TEXT DEFAULT 'monthly',
        lastmod TEXT,
        status TEXT DEFAULT 'active',
        page_type TEXT DEFAULT 'other',
        is_multilingual INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (error) {
    console.error('创建网站地图表失败:', error);
  }
}