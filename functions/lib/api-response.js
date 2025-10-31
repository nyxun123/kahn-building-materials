/**
 * 统一的 API 响应格式工具
 * 
 * 所有 API 端点都应该使用这个工具来返回统一格式的响应
 * 
 * 成功响应格式:
 * {
 *   success: true,
 *   code: 200,
 *   message: "操作成功",
 *   data: { ... },
 *   pagination: { ... },  // 可选
 *   timestamp: "2025-10-31T..."
 * }
 * 
 * 错误响应格式:
 * {
 *   success: false,
 *   code: 400/401/403/404/500,
 *   message: "错误消息",
 *   error: "详细错误信息",  // 可选
 *   timestamp: "2025-10-31T..."
 * }
 */

import { getCorsHeaders } from './cors.js';

/**
 * 创建统一的成功响应
 * @param {Object} options - 选项对象
 * @param {*} options.data - 响应数据
 * @param {string} options.message - 成功消息，默认 "操作成功"
 * @param {Object} options.pagination - 分页信息（可选）
 * @param {number} options.code - HTTP 状态码，默认 200
 * @param {Request} options.request - 请求对象（用于 CORS）
 * @param {Object} options.additionalHeaders - 额外的响应头
 * @returns {Response} 响应对象
 */
export function createSuccessResponse({
  data,
  message = '操作成功',
  pagination = null,
  code = 200,
  request = null,
  additionalHeaders = {}
}) {
  const responseBody = {
    success: true,
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  // 如果有分页信息，添加到响应中
  if (pagination) {
    responseBody.pagination = pagination;
  }

  const corsHeaders = request ? getCorsHeaders(request) : {};

  return new Response(JSON.stringify(responseBody), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders
    }
  });
}

/**
 * 创建统一的错误响应
 * @param {Object} options - 选项对象
 * @param {number} options.code - HTTP 状态码
 * @param {string} options.message - 错误消息
 * @param {string} options.error - 详细错误信息（可选）
 * @param {Request} options.request - 请求对象（用于 CORS）
 * @param {Object} options.additionalHeaders - 额外的响应头
 * @returns {Response} 响应对象
 */
export function createErrorResponse({
  code = 500,
  message = '服务器错误',
  error = null,
  request = null,
  additionalHeaders = {}
}) {
  const responseBody = {
    success: false,
    code,
    message,
    timestamp: new Date().toISOString()
  };

  // 如果有详细错误信息，添加到响应中
  if (error) {
    responseBody.error = error;
  }

  const corsHeaders = request ? getCorsHeaders(request) : {};

  return new Response(JSON.stringify(responseBody), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders
    }
  });
}

/**
 * 创建 401 未授权响应
 * @param {Object} options - 选项对象
 * @param {string} options.message - 错误消息，默认 "未授权"
 * @param {Request} options.request - 请求对象
 * @returns {Response} 响应对象
 */
export function createUnauthorizedResponse({
  message = '未授权',
  request = null
} = {}) {
  return createErrorResponse({
    code: 401,
    message,
    request
  });
}

/**
 * 创建 403 禁止访问响应
 * @param {Object} options - 选项对象
 * @param {string} options.message - 错误消息，默认 "禁止访问"
 * @param {Request} options.request - 请求对象
 * @returns {Response} 响应对象
 */
export function createForbiddenResponse({
  message = '禁止访问',
  request = null
} = {}) {
  return createErrorResponse({
    code: 403,
    message,
    request
  });
}

/**
 * 创建 404 未找到响应
 * @param {Object} options - 选项对象
 * @param {string} options.message - 错误消息，默认 "资源未找到"
 * @param {Request} options.request - 请求对象
 * @returns {Response} 响应对象
 */
export function createNotFoundResponse({
  message = '资源未找到',
  request = null
} = {}) {
  return createErrorResponse({
    code: 404,
    message,
    request
  });
}

/**
 * 创建 400 请求错误响应
 * @param {Object} options - 选项对象
 * @param {string} options.message - 错误消息，默认 "请求错误"
 * @param {Request} options.request - 请求对象
 * @returns {Response} 响应对象
 */
export function createBadRequestResponse({
  message = '请求错误',
  request = null
} = {}) {
  return createErrorResponse({
    code: 400,
    message,
    request
  });
}

/**
 * 创建 500 服务器错误响应
 * @param {Object} options - 选项对象
 * @param {string} options.message - 错误消息，默认 "服务器错误"
 * @param {string} options.error - 详细错误信息
 * @param {Request} options.request - 请求对象
 * @returns {Response} 响应对象
 */
export function createServerErrorResponse({
  message = '服务器错误',
  error = null,
  request = null
} = {}) {
  return createErrorResponse({
    code: 500,
    message,
    error,
    request
  });
}

/**
 * 创建分页信息对象
 * @param {number} page - 当前页码
 * @param {number} limit - 每页数量
 * @param {number} total - 总数
 * @returns {Object} 分页信息对象
 */
export function createPaginationInfo(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

