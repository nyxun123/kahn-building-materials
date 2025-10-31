/**
 * Dashboard Activities API
 * 获取系统活动日志
 */

import { authenticate, createUnauthorizedResponse } from '../../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../../lib/rate-limit.js';
import { createSuccessResponse, createErrorResponse, createServerErrorResponse } from '../../../lib/api-response.js';
import { handleCorsPreFlight } from '../../../lib/cors.js';

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
      return createUnauthorizedResponse(auth.error, request);
    }

    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    try {
      // 获取分页参数
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      // 获取活动日志总数
      const countResult = await env.DB.prepare(`
        SELECT COUNT(*) as total FROM activity_logs
      `).first();

      // 获取活动日志列表
      const activities = await env.DB.prepare(`
        SELECT 
          id,
          admin_id,
          action,
          resource_type,
          resource_id,
          details,
          ip_address,
          user_agent,
          created_at
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();

      // 获取管理员信息（用于显示操作者）
      const adminIds = [...new Set(activities.results?.map(a => a.admin_id) || [])];
      let adminMap = {};
      
      if (adminIds.length > 0) {
        const adminResults = await env.DB.prepare(`
          SELECT id, email, name FROM admins WHERE id IN (${adminIds.map(() => '?').join(',')})
        `).bind(...adminIds).all();
        
        adminResults.results?.forEach(admin => {
          adminMap[admin.id] = admin;
        });
      }

      // 增强活动日志数据
      const enrichedActivities = activities.results?.map(activity => ({
        ...activity,
        admin: adminMap[activity.admin_id] || { id: activity.admin_id, email: 'Unknown' }
      })) || [];

      return createSuccessResponse({
        data: enrichedActivities,
        message: '获取活动日志成功',
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        request
      });

    } catch (dbError) {
      console.error('活动日志查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('活动日志API错误:', error);
    return createServerErrorResponse({
      message: '获取活动日志失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

