import { authenticate } from '../../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../../lib/rate-limit.js';
import { handleCorsPreFlight } from '../../../lib/cors.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
  createUnauthorizedResponse
} from '../../../lib/api-response.js';

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
    
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    try {
      // 并行获取所有统计数据
      const [
        totalProducts,
        totalContacts,
        unreadContacts,
        activeProducts,
        recentActivities
      ] = await Promise.all([
        // 产品总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products`).first(),
        // 联系消息总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts`).first(),
        // 未读联系消息
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts WHERE is_read = 0`).first(),
        // 活跃产品数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products WHERE is_active = 1`).first(),
        // 最近7天活动数
        env.DB.prepare(`
          SELECT COUNT(*) as count FROM contacts
          WHERE created_at >= datetime('now', '-7 days')
        `).first()
      ]);

      // 获取最近30天的每日联系消息统计
      const dailyContacts = await env.DB.prepare(`
        SELECT
          date(created_at) as date,
          COUNT(*) as count
        FROM contacts
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY date(created_at)
        ORDER BY date
      `).all();

      // 获取产品分类统计
      const categoryStats = await env.DB.prepare(`
        SELECT
          category,
          COUNT(*) as count
        FROM products
        WHERE is_active = 1
        GROUP BY category
        ORDER BY count DESC
      `).all();

      return createSuccessResponse({
        data: {
          totalProducts: totalProducts?.count || 0,
          totalContacts: totalContacts?.count || 0,
          unreadContacts: unreadContacts?.count || 0,
          activeProducts: activeProducts?.count || 0,
          recentActivities: recentActivities?.count || 0,
          dailyContacts: dailyContacts.results || [],
          categoryStats: categoryStats.results || []
        },
        message: '获取仪表板统计成功',
        request
      });

    } catch (dbError) {
      console.error('仪表板统计查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('仪表板统计API错误:', error);
    return createServerErrorResponse({
      message: '获取仪表板统计失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}