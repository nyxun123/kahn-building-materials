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

// 创建新首页内容
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ 创建内容失败: 缺少认证头');
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
      console.error('❌ 创建内容失败: D1数据库未配置');
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
    let requestData;
    try {
      requestData = await request.json();
      console.log('🔍 收到创建Home Content请求:', {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries())
      });
    } catch (parseError) {
      console.error('❌ JSON解析失败:', parseError);
      return new Response(JSON.stringify({
        error: { message: '请求数据格式错误（无效的JSON）' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('📋 创建Home Content数据详情:', {
      page_key: requestData.page_key,
      section_key: requestData.section_key,
      content_type: requestData.content_type,
      hasContentZh: !!requestData.content_zh,
      contentZhLength: requestData.content_zh?.length || 0,
      hasContentEn: !!requestData.content_en,
      contentEnLength: requestData.content_en?.length || 0,
      hasContentRu: !!requestData.content_ru,
      contentRuLength: requestData.content_ru?.length || 0,
      isImageUrl: requestData.content_zh?.startsWith('https://') || false,
      isVideoUrl: requestData.content_zh?.startsWith('https://') && (requestData.content_type === 'video') || false
    });

    const {
      page_key,
      section_key,
      content_zh,
      content_en,
      content_ru,
      content_type = 'text',
      sort_order = 0
    } = requestData;

    // 参数验证
    if (!page_key) {
      console.error('❌ 缺少page_key参数');
      return new Response(JSON.stringify({
        error: { message: '缺少必要参数: page_key' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!section_key) {
      console.error('❌ 缺少section_key参数');
      return new Response(JSON.stringify({
        error: { message: '缺少必要参数: section_key' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('📝 开始创建Home Content记录...');

    // 插入新内容数据
    let result;
    try {
      result = await env.DB.prepare(`
        INSERT INTO page_contents (
          page_key, section_key, content_zh, content_en, content_ru,
          content_type, sort_order, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        page_key,
        section_key,
        content_zh || '',
        content_en || '',
        content_ru || '',
        content_type,
        sort_order
      ).run();

      console.log('✅ 数据库插入成功:', {
        success: result.success,
        changes: result.changes,
        meta: result.meta,
        lastRowId: result.meta?.last_row_id
      });

      if (!result.success || result.changes === 0) {
        throw new Error('数据库插入失败');
      }

    } catch (dbError) {
      console.error('❌ 数据库操作失败:', dbError);
      throw new Error(`数据库操作失败: ${dbError.message}`);
    }

    // 返回创建后的内容
    let createdContent;
    try {
      createdContent = await env.DB.prepare(
        'SELECT * FROM page_contents WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      if (!createdContent) {
        throw new Error('创建后查询失败');
      }

      console.log('✅ 创建成功，返回数据:', {
        id: createdContent.id,
        page_key: createdContent.page_key,
        section_key: createdContent.section_key,
        content_type: createdContent.content_type
      });

    } catch (queryError) {
      console.error('❌ 查询创建结果失败:', queryError);
      throw new Error(`查询创建结果失败: ${queryError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      data: createdContent,
      message: '内容创建成功'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('💥 创建首页内容失败:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    let errorMessage = '创建内容失败';
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = '请求数据格式错误';
      statusCode = 400;
    } else if (error.message.includes('参数')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('数据库')) {
      errorMessage = '数据库操作失败';
      statusCode = 500;
    }

    return new Response(JSON.stringify({
      error: { message: `${errorMessage}: ${error.message}` }
    }), {
      status: statusCode,
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

    const {
      id,
      page_key,
      section_key,
      content_zh,
      content_en,
      content_ru,
      content_type,
      sort_order
    } = requestData;

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

    // 构建动态更新SQL
    let updateFields = [];
    let bindValues = [];

    if (page_key !== undefined) {
      updateFields.push('page_key = ?');
      bindValues.push(page_key);
    }
    if (section_key !== undefined) {
      updateFields.push('section_key = ?');
      bindValues.push(section_key);
    }
    if (content_zh !== undefined) {
      updateFields.push('content_zh = ?');
      bindValues.push(content_zh);
    }
    if (content_en !== undefined) {
      updateFields.push('content_en = ?');
      bindValues.push(content_en);
    }
    if (content_ru !== undefined) {
      updateFields.push('content_ru = ?');
      bindValues.push(content_ru);
    }
    if (content_type !== undefined) {
      updateFields.push('content_type = ?');
      bindValues.push(content_type);
    }
    if (sort_order !== undefined) {
      updateFields.push('sort_order = ?');
      bindValues.push(sort_order);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    bindValues.push(parseInt(id));

    const updateSQL = `
      UPDATE page_contents
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    const result = await env.DB.prepare(updateSQL).bind(...bindValues).run();

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