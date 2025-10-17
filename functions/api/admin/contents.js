export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // 简单的认证检查
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
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const pageKey = url.searchParams.get('page_key');
    
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
      let whereClause = '';
      let bindings = [limit, offset];
      
      if (pageKey) {
        whereClause = 'WHERE page_key = ?';
        bindings = [pageKey, limit, offset];
      }
      
      // 获取内容数据
      const contents = await env.DB.prepare(`
        SELECT id, page_key, section_key, content_zh, content_en, content_ru, 
               content_type, is_active, sort_order, created_at, updated_at
        FROM page_contents 
        ${whereClause}
        ORDER BY page_key, sort_order, created_at DESC 
        LIMIT ? OFFSET ?
      `).bind(...bindings).all();
      
      // 获取总数
      let countQuery = 'SELECT COUNT(*) as total FROM page_contents';
      let countBindings = [];
      
      if (pageKey) {
        countQuery += ' WHERE page_key = ?';
        countBindings = [pageKey];
      }
      
      const countResult = await env.DB.prepare(countQuery).bind(...countBindings).first();
      
      return new Response(JSON.stringify({
        data: contents.results || [],
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        }
      }), {
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

// 更新内容 - PUT请求
export async function onRequestPut(context) {
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
    
    // 数据库检查
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

    // 解析请求数据
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id || isNaN(parseInt(id))) {
      return new Response(JSON.stringify({
        error: { message: '无效的内容ID' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const contentData = await request.json();
    console.log('更新内容数据:', id, contentData);
    
    // 更新内容数据
    const result = await env.DB.prepare(`
      UPDATE page_contents 
      SET content_zh = ?, content_en = ?, content_ru = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      contentData.content_zh || '',
      contentData.content_en || '',
      contentData.content_ru || '',
      parseInt(id)
    ).run();
    
    console.log('✅ 内容更新成功:', result);
    
    // 返回更新后的内容
    const updatedContent = await env.DB.prepare(
      'SELECT * FROM page_contents WHERE id = ?'
    ).bind(parseInt(id)).first();
    
    return new Response(JSON.stringify({
      success: true,
      data: updatedContent
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        }
    });
    
  } catch (error) {
    console.error('更新内容失败:', error);
    return new Response(JSON.stringify({
      error: { message: `更新内容失败: ${error.message}` }
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