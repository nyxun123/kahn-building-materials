// 公开单个产品API - 通过产品代码获取产品详情
export async function onRequestGet(context) {
  const { request, env, params } = context;
  
  try {
    const productCode = params.code;
    
    if (!productCode) {
      return new Response(JSON.stringify({
        success: false,
        message: '产品代码不能为空',
        data: null
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 数据库检查
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'D1数据库未配置',
        data: null
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      console.log('🔍 查询产品详情，产品代码:', productCode);

      // 查询产品详情 - 只返回已发布的产品
      const product = await env.DB.prepare(`
        SELECT id, product_code, name_zh, name_en, name_ru,
               description_zh, description_en, description_ru,
               specifications_zh, specifications_en, specifications_ru,
               applications_zh, applications_en, applications_ru,
               features_zh, features_en, features_ru,
               packaging_options_zh, packaging_options_en, packaging_options_ru,
               price, price_range, image_url, gallery_images,
               category, tags, sort_order, is_active,
               created_at, updated_at
        FROM products
        WHERE product_code = ? AND is_active = 1
      `).bind(productCode).first();

      console.log('📦 查询结果:', product ? '找到产品' : '未找到产品');

      if (!product) {
        // 检查产品是否存在但未激活
        const inactiveProduct = await env.DB.prepare(`
          SELECT id, product_code, is_active FROM products WHERE product_code = ?
        `).bind(productCode).first();

        if (inactiveProduct) {
          console.warn('⚠️ 产品存在但未激活:', inactiveProduct);
          return new Response(JSON.stringify({
            success: false,
            message: '产品已下架或未发布',
            data: null
          }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        console.warn('❌ 产品不存在:', productCode);
        return new Response(JSON.stringify({
          success: false,
          message: '产品不存在',
          data: null
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // 处理产品数据 - 确保JSON字段正确解析
      const processedProduct = {
        ...product,
        features_zh: parseJsonArray(product.features_zh),
        features_en: parseJsonArray(product.features_en),
        features_ru: parseJsonArray(product.features_ru),
        gallery_images: parseJsonArray(product.gallery_images),
        tags: parseJsonArray(product.tags),
        is_active: true // 公开API只返回已发布产品
      };
      
      return new Response(JSON.stringify({
        success: true,
        data: processedProduct,
        meta: {
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=600' // 10分钟缓存
        }
      });
      
    } catch (dbError) {
      console.error('查询产品详情失败:', dbError);
      return new Response(JSON.stringify({
        success: false,
        message: `数据库查询失败: ${dbError.message}`,
        data: null
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('获取产品详情错误:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '获取产品详情失败',
      data: null
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
    if (!jsonString || jsonString === '[]' || jsonString === 'null') {
      return [];
    }
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('解析JSON数组失败:', jsonString, error);
    return [];
  }
}