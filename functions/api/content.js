/**
 * 公开内容API - 无需认证
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const pageKey = url.searchParams.get('page');
    
    // 纯D1数据库查询
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 构建查询条件
      let whereClause = 'WHERE is_active = 1';
      let bindings = [];
      
      if (pageKey) {
        whereClause += ' AND page_key = ?';
        bindings = [pageKey];
      }
      
      // 获取内容数据
      const contents = await env.DB.prepare(`
        SELECT id, page_key, section_key, content_zh, content_en, content_ru, 
               content_type, meta_data, created_at, updated_at
        FROM page_contents 
        ${whereClause}
        ORDER BY sort_order, created_at DESC
      `).bind(...bindings).all();
      
      return new Response(JSON.stringify(contents.results || []), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (dbError) {
      console.error('D1查询失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库查询失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('获取内容数据错误:', error);
    return new Response(JSON.stringify({
      error: { message: '获取数据失败' }
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}