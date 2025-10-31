import { authenticate } from '../../lib/jwt-auth.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
  createUnauthorizedResponse,
  createPaginationInfo
} from '../../lib/api-response.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    // JWT 认证检查
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '未授权',
        request
      });
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    const searchTerm = url.searchParams.get('q')?.trim();
    
    // 快速数据库检查
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    try {
      // 使用单一查询同时获取数据和计数，优化性能
      let whereClause = '';
      let listBindings = [];
      let countBindings = [];

      if (searchTerm) {
        const likeValue = `%${searchTerm}%`;
        whereClause = `WHERE product_code LIKE ? OR name_zh LIKE ? OR name_en LIKE ? OR name_ru LIKE ?`;
        listBindings = [likeValue, likeValue, likeValue, likeValue, limit, offset];
        countBindings = [likeValue, likeValue, likeValue, likeValue];
      } else {
        listBindings = [limit, offset];
      }

      const productsPromise = env.DB.prepare(`
          SELECT id, product_code, name_zh, name_en, name_ru,
                 description_zh, description_en, description_ru,
                 price_range, image_url, category,
                 is_active, sort_order, created_at, updated_at
          FROM products 
          ${whereClause}
          ORDER BY sort_order ASC, created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(...listBindings).all();

      const countStatement = env.DB.prepare(`SELECT COUNT(*) as total FROM products ${whereClause}`);
      const countPromise = countBindings.length
        ? countStatement.bind(...countBindings).first()
        : countStatement.first();

      const [productsResult, countResult] = await Promise.all([productsPromise, countPromise]);

      return createSuccessResponse({
        data: productsResult.results || [],
        message: '获取产品列表成功',
        pagination: createPaginationInfo(page, limit, countResult?.total || 0),
        request,
        additionalHeaders: {
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error('产品查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('获取产品列表错误:', error);
    return createServerErrorResponse({
      message: '获取产品列表失败',
      error: error.message,
      request
    });
  }
}

// 创建产品 - POST请求
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // JWT 认证检查
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '未授权',
        request
      });
    }

    // 数据库检查
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    // 解析请求数据
    const productData = await request.json();
    console.log('📝 创建产品数据:', {
      product_code: productData.product_code,
      name_zh: productData.name_zh,
      is_active: productData.is_active,
      category: productData.category,
      has_image: !!productData.image_url
    });

    // 基础验证
    if (!productData.product_code || !productData.name_zh) {
      return createErrorResponse({
        code: 400,
        message: '产品代码和中文名称为必填项',
        request
      });
    }

    // 检查产品代码是否已存在
    const existingProduct = await env.DB.prepare(
      'SELECT id FROM products WHERE product_code = ?'
    ).bind(productData.product_code).first();

    if (existingProduct) {
      return createErrorResponse({
        code: 400,
        message: '产品代码已存在',
        request
      });
    }
    
    // 确保数据库表存在 - 完整的产品表结构
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_code TEXT UNIQUE NOT NULL,
        name_zh TEXT NOT NULL,
        name_en TEXT,
        name_ru TEXT,
        description_zh TEXT,
        description_en TEXT,
        description_ru TEXT,
        specifications_zh TEXT,
        specifications_en TEXT,
        specifications_ru TEXT,
        applications_zh TEXT,
        applications_en TEXT,
        applications_ru TEXT,
        features_zh TEXT DEFAULT '[]',
        features_en TEXT DEFAULT '[]',
        features_ru TEXT DEFAULT '[]',
        image_url TEXT,
        gallery_images TEXT,
        price REAL DEFAULT 0,
        price_range TEXT,
        packaging_options_zh TEXT,
        packaging_options_en TEXT,
        packaging_options_ru TEXT,
        category TEXT DEFAULT 'adhesive',
        tags TEXT,
        is_active INTEGER DEFAULT 1,
        is_featured INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        stock_quantity INTEGER DEFAULT 0,
        min_order_quantity INTEGER DEFAULT 1,
        meta_title_zh TEXT,
        meta_title_en TEXT,
        meta_title_ru TEXT,
        meta_description_zh TEXT,
        meta_description_en TEXT,
        meta_description_ru TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    
    // 插入产品数据 - 使用完整的字段（不包括id、created_at、updated_at，它们有默认值）
    const result = await env.DB.prepare(`
      INSERT INTO products (
        product_code, name_zh, name_en, name_ru,
        description_zh, description_en, description_ru,
        specifications_zh, specifications_en, specifications_ru,
        applications_zh, applications_en, applications_ru,
        features_zh, features_en, features_ru,
        image_url, gallery_images, price, price_range,
        packaging_options_zh, packaging_options_en, packaging_options_ru,
        category, tags, is_active, is_featured, sort_order,
        stock_quantity, min_order_quantity,
        meta_title_zh, meta_title_en, meta_title_ru,
        meta_description_zh, meta_description_en, meta_description_ru
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      productData.product_code,
      productData.name_zh,
      productData.name_en || '',
      productData.name_ru || '',
      productData.description_zh || '',
      productData.description_en || '',
      productData.description_ru || '',
      productData.specifications_zh || '',
      productData.specifications_en || '',
      productData.specifications_ru || '',
      productData.applications_zh || '',
      productData.applications_en || '',
      productData.applications_ru || '',
      typeof productData.features_zh === 'string' ? productData.features_zh : '[]',
      typeof productData.features_en === 'string' ? productData.features_en : '[]',
      typeof productData.features_ru === 'string' ? productData.features_ru : '[]',
      productData.image_url || '',
      productData.gallery_images || '',
      typeof productData.price === 'number' ? productData.price : 0,
      productData.price_range || '',
      productData.packaging_options_zh || '',
      productData.packaging_options_en || '',
      productData.packaging_options_ru || '',
      productData.category || 'adhesive',
      productData.tags || '',
      productData.is_active !== false ? 1 : 0,
      productData.is_featured === true ? 1 : 0,
      typeof productData.sort_order === 'number' ? productData.sort_order : 0,
      typeof productData.stock_quantity === 'number' ? productData.stock_quantity : 0,
      typeof productData.min_order_quantity === 'number' ? productData.min_order_quantity : 1,
      productData.meta_title_zh || '',
      productData.meta_title_en || '',
      productData.meta_title_ru || '',
      productData.meta_description_zh || '',
      productData.meta_description_en || '',
      productData.meta_description_ru || ''
    ).run();

    const newProductId = result.meta.last_row_id;
    console.log('✅ 产品创建成功，ID:', newProductId);

    // 返回创建的产品
    const newProduct = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(newProductId).first();

    console.log('📦 新产品详情:', {
      id: newProduct.id,
      product_code: newProduct.product_code,
      name_zh: newProduct.name_zh,
      is_active: newProduct.is_active,
      image_url: newProduct.image_url ? '已设置' : '未设置'
    });

    return createSuccessResponse({
      data: newProduct,
      message: '产品创建成功',
      code: 201,
      request
    });

  } catch (error) {
    console.error('创建产品失败:', error);
    return createServerErrorResponse({
      message: '创建产品失败',
      error: error.message,
      request
    });
  }
}

import { handleCorsPreFlight } from '../../lib/cors.js';
import { createErrorResponse } from '../../lib/api-response.js';

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}