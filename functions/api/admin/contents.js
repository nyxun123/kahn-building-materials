import { authenticate } from '../../lib/jwt-auth.js';
import { validateContent, sanitizeObject } from '../../lib/validation.js';
import {
  createSuccessResponse,
  createBadRequestResponse,
  createUnauthorizedResponse,
  createServerErrorResponse,
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
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const pageKey = url.searchParams.get('page_key');
    
    // 纯D1数据库查询
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
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

      return createSuccessResponse({
        data: contents.results || [],
        message: '获取内容成功',
        pagination: createPaginationInfo(page, limit, countResult?.total || 0),
        request
      });
    } catch (dbError) {
      console.error('D1查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('获取内容数据错误:', error);
    return createServerErrorResponse({
      message: '获取数据失败',
      error: error.message,
      request
    });
  }
}

// 更新内容 - PUT请求
export async function onRequestPut(context) {
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
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(parseInt(id))) {
      return createBadRequestResponse({
        message: '无效的内容ID',
        request
      });
    }
    
    const contentData = await request.json();
    console.log('更新内容数据:', id, contentData);

    // 数据验证
    const validation = validateContent(contentData);
    if (!validation.valid) {
      return createBadRequestResponse({
        message: validation.error,
        request
      });
    }

    // 清理数据（移除前后空格）
    const cleanedData = sanitizeObject(contentData);

    // 更新内容数据
    const result = await env.DB.prepare(`
      UPDATE page_contents
      SET content_zh = ?, content_en = ?, content_ru = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      cleanedData.content_zh || '',
      cleanedData.content_en || '',
      cleanedData.content_ru || '',
      parseInt(id)
    ).run();
    
    console.log('✅ 内容更新成功:', result);
    
    // 返回更新后的内容
    const updatedContent = await env.DB.prepare(
      'SELECT * FROM page_contents WHERE id = ?'
    ).bind(parseInt(id)).first();

    return createSuccessResponse({
      data: updatedContent,
      message: '内容更新成功',
      request
    });

  } catch (error) {
    console.error('更新内容失败:', error);
    return createServerErrorResponse({
      message: '更新内容失败',
      error: error.message,
      request
    });
  }
}

import { handleCorsPreFlight } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}