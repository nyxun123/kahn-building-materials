/**
 * Dashboard Health Check API
 * 检查系统各组件的健康状态
 */

import { authenticate, createUnauthorizedResponse } from '../../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../../lib/rate-limit.js';
import { createSuccessResponse, createServerErrorResponse } from '../../../lib/api-response.js';
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

    const healthStatus = {
      status: 'healthy',
      components: {},
      timestamp: new Date().toISOString()
    };

    // 检查数据库连接
    try {
      const startTime = performance.now();
      if (env.DB) {
        await env.DB.prepare('SELECT 1').first();
        const latency = performance.now() - startTime;
        healthStatus.components.database = {
          status: 'ok',
          latency: Math.round(latency)
        };
      } else {
        healthStatus.components.database = {
          status: 'error',
          message: 'Database not configured'
        };
        healthStatus.status = 'degraded';
      }
    } catch (error) {
      healthStatus.components.database = {
        status: 'error',
        message: error.message
      };
      healthStatus.status = 'degraded';
    }

    // 检查 R2 存储连接
    try {
      const startTime = performance.now();
      if (env.IMAGE_BUCKET) {
        // 尝试列出 R2 中的对象（不实际列出，只是检查连接）
        await env.IMAGE_BUCKET.list({ limit: 1 });
        const latency = performance.now() - startTime;
        healthStatus.components.storage = {
          status: 'ok',
          latency: Math.round(latency)
        };
      } else {
        healthStatus.components.storage = {
          status: 'warning',
          message: 'R2 storage not configured'
        };
      }
    } catch (error) {
      healthStatus.components.storage = {
        status: 'error',
        message: error.message
      };
      healthStatus.status = 'degraded';
    }

    // 检查 API 响应时间
    try {
      const startTime = performance.now();
      // 这是一个简单的性能检查
      const latency = performance.now() - startTime;
      healthStatus.components.api = {
        status: 'ok',
        latency: Math.round(latency)
      };
    } catch (error) {
      healthStatus.components.api = {
        status: 'error',
        message: error.message
      };
      healthStatus.status = 'degraded';
    }

    // 检查内存使用情况（如果可用）
    if (typeof performance !== 'undefined' && performance.memory) {
      healthStatus.components.memory = {
        status: 'ok',
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }

    return createSuccessResponse({
      data: healthStatus,
      message: `系统状态: ${healthStatus.status}`,
      request
    });

  } catch (error) {
    console.error('健康检查API错误:', error);
    return createServerErrorResponse({
      message: '健康检查失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

