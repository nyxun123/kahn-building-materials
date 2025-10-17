// 首页内容管理API
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

    // 获取首页内容数据
    const contents = await env.DB.prepare(`
      SELECT id, page_key, section_key, content_zh, content_en, content_ru, 
             content_type, is_active, sort_order, created_at, updated_at
      FROM page_contents 
      WHERE page_key = 'home' AND is_active = 1
      ORDER BY sort_order, created_at DESC
    `).all();
    
    return new Response(JSON.stringify({
      success: true,
      data: contents.results || []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('获取首页内容数据错误:', error);
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

// 更新首页内容
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
    const requestData = await request.json();

    console.log('🔍 调试信息 - 接收到的Home Content数据:', {
      id: requestData.id,
      hasContentZh: !!requestData.content_zh,
      hasContentEn: !!requestData.content_en,
      hasContentRu: !!requestData.content_ru,
      contentZhLength: requestData.content_zh?.length || 0,
      contentEnLength: requestData.content_en?.length || 0,
      contentRuLength: requestData.content_ru?.length || 0,
      isImageUrl: requestData.content_zh?.startsWith('https://') || false
    });

    const { id, content_zh, content_en, content_ru } = requestData;

    if (!id || isNaN(parseInt(id))) {
      console.error('❌ 无效的内容ID:', id);
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

    console.log('📝 开始更新Home Content数据...');

    // 更新内容数据
    const result = await env.DB.prepare(`
      UPDATE page_contents
      SET content_zh = ?, content_en = ?, content_ru = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      content_zh || '',
      content_en || '',
      content_ru || '',
      parseInt(id)
    ).run();

    console.log('✅ Home Content更新完成:', {
      changes: result.changes || 0,
      success: result.success || false
    });
    
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
    console.error('更新首页内容失败:', error);
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