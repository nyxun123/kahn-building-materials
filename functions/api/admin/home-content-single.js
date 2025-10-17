/**
 * 首页内容管理API - 单文档模式
 * 将整个首页内容作为单个JSON文档进行管理
 *
 * 端点: /api/admin/home-content
 * 方法: GET (获取), PUT (更新/创建)
 */

// 默认首页内容结构
const defaultContentData = {
  video: {
    title: { zh: "", en: "", ru: "" },
    subtitle: { zh: "", en: "", ru: "" },
    video_url: "",
    description: { zh: "", en: "", ru: "" }
  },
  oem: {
    title: { zh: "", en: "", ru: "" },
    image_url: "",
    description: { zh: "", en: "", ru: "" }
  },
  semi: {
    title: { zh: "", en: "", ru: "" },
    image_url: "",
    description: { zh: "", en: "", ru: "" }
  }
};

/**
 * 统一的JSON响应格式
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    status: status
  });
}

/**
 * 认证检查
 */
function checkAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return { valid: false, error: '需要登录' };
  }
  return { valid: true };
}

/**
 * GET请求处理器 - 获取首页内容
 */
export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    // 认证检查
    const auth = checkAuth(request);
    if (!auth.valid) {
      return jsonResponse({ error: { message: auth.error } }, 401);
    }

    // 数据库检查
    if (!env.DB) {
      return jsonResponse({ error: { message: 'D1数据库未配置' } }, 500);
    }

    console.log('🔍 获取首页内容数据...');

    // 查询首页内容
    const result = await env.DB.prepare(
      "SELECT * FROM page_contents WHERE page_key = 'home' AND is_active = 1"
    ).first();

    if (!result) {
      console.log('📝 未找到首页内容，返回默认结构');
      return jsonResponse({
        success: true,
        data: {
          id: 'home',
          page_key: 'home',
          content_data: defaultContentData
        }
      });
    }

    // 解析JSON数据
    let contentData;
    try {
      contentData = JSON.parse(result.content_data || '{}');
    } catch (parseError) {
      console.error('解析JSON数据失败:', parseError);
      contentData = defaultContentData;
    }

    const responseData = {
      id: result.page_key || 'home',
      page_key: result.page_key,
      content_data: contentData,
      created_at: result.created_at,
      updated_at: result.updated_at
    };

    console.log('✅ 成功获取首页内容:', {
      hasVideoTitle: !!contentData.video?.title,
      hasOemImage: !!contentData.oem?.image_url,
      hasSemiImage: !!contentData.semi?.image_url
    });

    return jsonResponse({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('获取首页内容失败:', error);
    return jsonResponse({
      error: { message: '获取数据失败' }
    }, 500);
  }
}

/**
 * PUT请求处理器 - 更新首页内容（单文档模式）
 */
export async function onRequestPut(context) {
  const { request, env } = context;

  try {
    // 认证检查
    const auth = checkAuth(request);
    if (!auth.valid) {
      return jsonResponse({ error: { message: auth.error } }, 401);
    }

    // 数据库检查
    if (!env.DB) {
      return jsonResponse({ error: { message: 'D1数据库未配置' } }, 500);
    }

    // 解析请求数据
    const requestData = await request.json();

    console.log('🔍 接收到的Home Content数据:', {
      hasContentData: !!requestData.content_data,
      contentDataKeys: Object.keys(requestData.content_data || {})
    });

    const { content_data } = requestData;

    if (!content_data) {
      return jsonResponse({
        error: { message: '缺少content_data参数' }
      }, 400);
    }

    console.log('📝 开始更新Home Content数据...');

    // 序列化JSON数据
    const jsonData = JSON.stringify(content_data);

    // 使用UPSERT操作（更新或插入）
    const result = await env.DB.prepare(`
      INSERT INTO page_contents (page_key, content_data, is_active, created_at, updated_at)
      VALUES ('home', ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(page_key) DO UPDATE SET
        content_data = excluded.content_data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `).bind(jsonData).first();

    if (!result) {
      throw new Error('数据库操作失败');
    }

    // 解析更新后的数据
    let updatedContentData;
    try {
      updatedContentData = JSON.parse(result.content_data || '{}');
    } catch (parseError) {
      console.error('解析更新后的JSON数据失败:', parseError);
      updatedContentData = content_data;
    }

    const responseData = {
      id: result.page_key,
      page_key: result.page_key,
      content_data: updatedContentData,
      updated_at: result.updated_at
    };

    console.log('✅ Home Content更新完成:', {
      id: responseData.id,
      updated_at: responseData.updated_at,
      hasVideoUrl: !!updatedContentData.video?.video_url,
      hasOemImage: !!updatedContentData.oem?.image_url,
      hasSemiImage: !!updatedContentData.semi?.image_url
    });

    return jsonResponse({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('更新首页内容失败:', error);

    let errorMessage = '更新内容失败';
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = '请求数据格式错误（无效的JSON）';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = `更新内容失败: ${error.message}`;
    }

    return jsonResponse({
      error: { message: errorMessage }
    }, statusCode);
  }
}

/**
 * OPTIONS请求处理器 - CORS预检
 */
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