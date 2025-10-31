import { refreshAccessToken } from '../../lib/jwt-auth.js';
import {
  createSuccessResponse,
  createErrorResponse,
  createServerErrorResponse
} from '../../lib/api-response.js';

/**
 * Token 刷新端点
 * 
 * 功能：
 * - 使用 refresh token 获取新的 access token
 * - 实施滚动刷新（返回新的 refresh token）
 * - 验证 refresh token 的有效性
 * 
 * 使用方法：
 * POST /api/admin/refresh-token
 * Body: { "refreshToken": "your-refresh-token" }
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse({
        code: 400,
        message: '请求格式错误',
        request
      });
    }

    const { refreshToken } = body || {};

    // 验证 refresh token 是否存在
    if (!refreshToken) {
      return createErrorResponse({
        code: 400,
        message: '缺少 refresh token',
        request
      });
    }

    // 刷新 token
    const tokens = await refreshAccessToken(refreshToken, env);

    if (!tokens) {
      return createErrorResponse({
        code: 401,
        message: 'Refresh token 无效或已过期，请重新登录',
        request
      });
    }

    console.log('✅ Token 刷新成功');

    // 返回新的 tokens
    return createSuccessResponse({
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 900  // 15 分钟（秒）
      },
      message: 'Token 刷新成功',
      request
    });

  } catch (error) {
    console.error('Token 刷新失败:', error);
    return createServerErrorResponse({
      message: '服务器错误，请稍后重试',
      error: error.message,
      request
    });
  }
}

/**
 * OPTIONS 请求处理（CORS 预检）
 */
import { handleCorsPreFlight } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

