// 公开产品API - 不需要认证，供前端展示使用
export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    const category = url.searchParams.get('category')?.trim();
    const searchTerm = url.searchParams.get('q')?.trim();
    
    // 数据库检查
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'D1数据库未配置',
        data: []
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 构建查询条件 - 只显示已发布的产品
      let whereClause = 'WHERE is_active = 1';
      let listBindings = [];
      let countBindings = [];

      if (category) {
        whereClause += ' AND category = ?';
        listBindings.push(category);
        countBindings.push(category);
      }

      if (searchTerm) {
        const likeValue = `%${searchTerm}%`;
        whereClause += ' AND (product_code LIKE ? OR name_zh LIKE ? OR name_en LIKE ? OR name_ru LIKE ?)';
        listBindings.push(likeValue, likeValue, likeValue, likeValue);
        countBindings.push(likeValue, likeValue, likeValue, likeValue);
      }

      // 添加分页参数
      listBindings.push(limit, offset);

      // 查询产品数据
      const productsPromise = env.DB.prepare(`
          SELECT id, product_code, name_zh, name_en, name_ru,
                 description_zh, description_en, description_ru,
                 price_range, image_url, category, features_zh, features_en, features_ru,
                 sort_order, created_at, updated_at
          FROM products 
          ${whereClause}
          ORDER BY sort_order ASC, created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(...listBindings).all();

      // 查询总数
      const countStatement = env.DB.prepare(`SELECT COUNT(*) as total FROM products ${whereClause}`);
      const countPromise = countBindings.length
        ? countStatement.bind(...countBindings).first()
        : countStatement.first();

      const [productsResult, countResult] = await Promise.all([productsPromise, countPromise]);
      
      // 处理产品数据 - 确保features字段是正确的JSON格式
      const processedProducts = (productsResult.results || []).map(product => ({
        ...product,
        features_zh: parseJsonArray(product.features_zh),
        features_en: parseJsonArray(product.features_en),
        features_ru: parseJsonArray(product.features_ru),
        is_active: true // 公开API只返回已发布产品
      }));
      
      return new Response(JSON.stringify({
        success: true,
        data: processedProducts,
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        meta: {
          category,
          searchTerm,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300' // 5分钟缓存
        }
      });

    } catch (dbError) {
      console.error('公开产品查询失败:', dbError);
      return new Response(JSON.stringify({
        success: false,
        message: `数据库查询失败: ${dbError.message}`,
        data: []
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('获取公开产品列表错误:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '获取产品列表失败',
      data: []
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理OPTIONS请求 (CORS预检)
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// 解析JSON数组字符串的辅助函数
function parseJsonArray(jsonString) {
  try {
    if (!jsonString || jsonString === '[]') {
      return [];
    }
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('解析JSON数组失败:', jsonString, error);
    return [];
  }
}