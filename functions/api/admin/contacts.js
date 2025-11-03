import { authenticate } from '../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../lib/rate-limit.js';
import { handleCorsPreFlight } from '../../lib/cors.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
  createUnauthorizedResponse,
  createPaginationInfo
} from '../../lib/api-response.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    // 速率限制检查
    const rateLimit = await rateLimitMiddleware(request, env, 'admin');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

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
    
    // 纯D1数据库查询
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    try {
      // 获取联系数据
      const contacts = await env.DB.prepare(`
        SELECT id, name, email, phone, company, message, created_at, status, is_read
        FROM contacts
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();

      // 获取总数
      const countResult = await env.DB.prepare(`
        SELECT COUNT(*) as total FROM contacts
      `).first();

      return createSuccessResponse({
        data: contacts.results || [],
        message: '获取联系数据成功',
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
    console.error('获取联系数据错误:', error);
    return createServerErrorResponse({
      message: '获取数据失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}