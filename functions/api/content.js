/**
 * 公开内容API - 无需认证
 */
import {
  createSuccessResponse,
  createServerErrorResponse,
  createBadRequestResponse,
} from '../lib/api-response.js';
import { handleCorsPreFlight } from '../lib/cors.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const pageKey = url.searchParams.get('page');
    
    // 数据库检查
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
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
      
      return createSuccessResponse({
        data: contents.results || [],
        message: '获取内容成功',
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

export async function onRequestOptions(context) {
  return handleCorsPreFlight(context.request);
}