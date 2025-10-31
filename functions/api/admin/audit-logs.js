/**
 * 审计日志 API
 * 获取系统的审计日志
 */

import { authenticate, createUnauthorizedResponse } from '../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../lib/rate-limit.js';
import { createSuccessResponse, createErrorResponse, createServerErrorResponse } from '../../lib/api-response.js';
import { handleCorsPreFlight } from '../../lib/cors.js';
import { logApiRequest, logError } from '../../lib/logger.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const startTime = performance.now();

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
      // 获取查询参数
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const adminId = url.searchParams.get('admin_id');
      const action = url.searchParams.get('action');
      const resourceType = url.searchParams.get('resource_type');
      const status = url.searchParams.get('status');
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');

      const offset = (page - 1) * limit;

      // 构建查询条件
      let whereConditions = [];
      let bindParams = [];

      if (adminId) {
        whereConditions.push('admin_id = ?');
        bindParams.push(parseInt(adminId));
      }

      if (action) {
        whereConditions.push('action = ?');
        bindParams.push(action);
      }

      if (resourceType) {
        whereConditions.push('resource_type = ?');
        bindParams.push(resourceType);
      }

      if (status) {
        whereConditions.push('status = ?');
        bindParams.push(status);
      }

      if (startDate) {
        whereConditions.push('created_at >= ?');
        bindParams.push(startDate);
      }

      if (endDate) {
        whereConditions.push('created_at <= ?');
        bindParams.push(endDate);
      }

      const whereClause = whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      // 获取总数
      const countQuery = `SELECT COUNT(*) as total FROM activity_logs ${whereClause}`;
      const countResult = await env.DB.prepare(countQuery).bind(...bindParams).first();

      // 获取日志列表
      const logsQuery = `
        SELECT 
          al.id,
          al.admin_id,
          al.action,
          al.resource_type,
          al.resource_id,
          al.details,
          al.result,
          al.ip_address,
          al.user_agent,
          al.status,
          al.created_at,
          a.email as admin_email,
          a.name as admin_name
        FROM activity_logs al
        LEFT JOIN admins a ON al.admin_id = a.id
        ${whereClause}
        ORDER BY al.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const logs = await env.DB.prepare(logsQuery)
        .bind(...bindParams, limit, offset)
        .all();

      // 解析 JSON 字段
      const enrichedLogs = logs.results?.map(log => ({
        ...log,
        details: log.details ? JSON.parse(log.details) : null,
        result: log.result ? JSON.parse(log.result) : null
      })) || [];

      const duration = performance.now() - startTime;
      logApiRequest(request, {
        endpoint: '/api/admin/audit-logs',
        method: 'GET',
        adminId: auth.adminId,
        status: 200,
        duration
      });

      return createSuccessResponse({
        data: enrichedLogs,
        message: '获取审计日志成功',
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        request
      });

    } catch (dbError) {
      logError('审计日志查询失败', dbError, {
        adminId: auth.adminId
      });

      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    logError('审计日志API错误', error);

    return createServerErrorResponse({
      message: '获取审计日志失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

