// 公开产品API - 不需要认证，供前端展示使用
import {
  createSuccessResponse,
  createErrorResponse,
  createServerErrorResponse,
  createNotFoundResponse,
  createPaginationInfo
} from '../lib/api-response.js';
import { handleCorsPreFlight } from '../lib/cors.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    // 检查是否是获取单个产品的请求
    if (pathSegments.length === 3 && pathSegments[0] === 'api' && pathSegments[1] === 'products') {
      const productCode = pathSegments[2];
      return await getProductDetail(productCode, env, request);
    }
    
    // 否则处理产品列表请求
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    const category = url.searchParams.get('category')?.trim();
    const searchTerm = url.searchParams.get('q')?.trim();
    
    // 数据库检查
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
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
                 specifications_zh, specifications_en, specifications_ru,
                 applications_zh, applications_en, applications_ru,
                 packaging_options_zh, packaging_options_en, packaging_options_ru,
                 tags, sort_order, created_at, updated_at
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
        tags: parseJsonArray(product.tags),
        is_active: true // 公开API只返回已发布产品
      }));
      
      return createSuccessResponse({
        data: processedProducts,
        message: '获取产品列表成功',
        pagination: createPaginationInfo(page, limit, countResult?.total || 0),
        request,
        additionalHeaders: {
          'Cache-Control': 'public, max-age=300' // 5分钟缓存
        }
      });

    } catch (dbError) {
      console.error('公开产品查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }
    
  } catch (error) {
    console.error('获取公开产品列表错误:', error);
    return createServerErrorResponse({
      message: '获取产品列表失败',
      error: error.message,
      request
    });
  }
}

// 获取单个产品详情的函数
async function getProductDetail(productCode, env, request = null) {
  try {
    if (!productCode) {
      return createErrorResponse({
        code: 400,
        message: '产品代码不能为空',
        request
      });
    }

    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    // 解码URL编码的产品代码（支持中文产品代码）
    const decodedProductCode = decodeURIComponent(productCode);
    
    // 查询产品详情
    const product = await env.DB.prepare(`
        SELECT id, product_code, name_zh, name_en, name_ru,
               description_zh, description_en, description_ru,
               price_range, image_url, category, features_zh, features_en, features_ru,
               specifications_zh, specifications_en, specifications_ru,
               applications_zh, applications_en, applications_ru,
               packaging_options_zh, packaging_options_en, packaging_options_ru,
               tags, gallery_images, is_active, sort_order, created_at, updated_at
        FROM products 
        WHERE product_code = ? AND is_active = 1
    `).bind(decodedProductCode).first();

    if (!product) {
      return createNotFoundResponse({
        message: '产品不存在或已下架',
        request
      });
    }

    // 处理产品数据
    const processedProduct = {
      ...product,
      features_zh: parseJsonArray(product.features_zh),
      features_en: parseJsonArray(product.features_en),
      features_ru: parseJsonArray(product.features_ru),
      tags: parseJsonArray(product.tags),
      gallery_images: parseJsonArray(product.gallery_images)
    };

    return createSuccessResponse({
      data: processedProduct,
      message: '获取产品详情成功',
      request,
      additionalHeaders: {
        'Cache-Control': 'public, max-age=600' // 10分钟缓存
      }
    });

  } catch (error) {
    console.error('获取产品详情失败:', error);
    return createServerErrorResponse({
      message: '获取产品详情失败',
      error: error.message,
      request
    });
  }
}

// 处理OPTIONS请求 (CORS预检)
export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
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
