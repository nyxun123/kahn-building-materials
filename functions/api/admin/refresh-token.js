import { refreshAccessToken } from '../../lib/jwt-auth.js';

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
      return new Response(JSON.stringify({
        code: 400,
        message: '请求格式错误'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const { refreshToken } = body || {};

    // 验证 refresh token 是否存在
    if (!refreshToken) {
      return new Response(JSON.stringify({
        code: 400,
        message: '缺少 refresh token'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 刷新 token
    const tokens = await refreshAccessToken(refreshToken, env);

    if (!tokens) {
      return new Response(JSON.stringify({
        code: 401,
        message: 'Refresh token 无效或已过期，请重新登录'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('✅ Token 刷新成功');

    // 返回新的 tokens
    return new Response(JSON.stringify({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 900  // 15 分钟（秒）
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Token 刷新失败:', error);
    return new Response(JSON.stringify({
      code: 500,
      message: '服务器错误，请稍后重试'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * OPTIONS 请求处理（CORS 预检）
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

