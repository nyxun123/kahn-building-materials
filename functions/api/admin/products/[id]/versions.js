/**
 * Product Versions API
 * 获取产品的版本历史
 */

import { authenticate, createUnauthorizedResponse } from '../../../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../../../lib/rate-limit.js';
import { createSuccessResponse, createErrorResponse, createServerErrorResponse } from '../../../../lib/api-response.js';
import { handleCorsPreFlight } from '../../../../lib/cors.js';

export async function onRequestGet(context) {
  const { request, env, params } = context;

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

    const productId = params.id;
    if (!productId) {
      return createErrorResponse({
        code: 400,
        message: '产品ID不能为空',
        request
      });
    }

    try {
      // 获取分页参数
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      // 检查产品是否存在
      const product = await env.DB.prepare(`
        SELECT id FROM products WHERE id = ?
      `).bind(productId).first();

      if (!product) {
        return createErrorResponse({
          code: 404,
          message: '产品不存在',
          request
        });
      }

      // 获取版本总数
      const countResult = await env.DB.prepare(`
        SELECT COUNT(*) as total FROM product_versions WHERE product_id = ?
      `).bind(productId).first();

      // 获取版本列表
      const versions = await env.DB.prepare(`
        SELECT 
          id,
          product_id,
          version_number,
          changes,
          created_by,
          created_at,
          notes
        FROM product_versions
        WHERE product_id = ?
        ORDER BY version_number DESC
        LIMIT ? OFFSET ?
      `).bind(productId, limit, offset).all();

      // 获取创建者信息
      const creatorIds = [...new Set(versions.results?.map(v => v.created_by) || [])];
      let creatorMap = {};
      
      if (creatorIds.length > 0) {
        const creatorResults = await env.DB.prepare(`
          SELECT id, email, name FROM admins WHERE id IN (${creatorIds.map(() => '?').join(',')})
        `).bind(...creatorIds).all();
        
        creatorResults.results?.forEach(creator => {
          creatorMap[creator.id] = creator;
        });
      }

      // 增强版本数据
      const enrichedVersions = versions.results?.map(version => ({
        ...version,
        creator: creatorMap[version.created_by] || { id: version.created_by, email: 'Unknown' },
        changes: typeof version.changes === 'string' ? JSON.parse(version.changes) : version.changes
      })) || [];

      return createSuccessResponse({
        data: enrichedVersions,
        message: '获取产品版本历史成功',
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        request
      });

    } catch (dbError) {
      console.error('产品版本查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('产品版本API错误:', error);
    return createServerErrorResponse({
      message: '获取产品版本失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

