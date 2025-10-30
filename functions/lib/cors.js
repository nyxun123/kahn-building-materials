/**
 * CORS 配置工具
 * 
 * 功能：
 * - 域名白名单验证
 * - 动态 CORS headers 生成
 * - 预检请求处理
 * 
 * 安全特性：
 * - 仅允许白名单中的域名
 * - 支持开发环境和生产环境
 * - 防止 CORS 绕过攻击
 */

// 允许的域名白名单
const ALLOWED_ORIGINS = [
  'https://kn-wallpaperglue.com',                      // 生产环境
  'https://6622cb5c.kn-wallpaperglue.pages.dev',      // Pages 预览环境
  'http://localhost:5173',                             // Vite 开发服务器
  'http://localhost:3000',                             // 备用开发端口
  'http://127.0.0.1:5173',                             // 本地 IP
  'http://127.0.0.1:3000',                             // 本地 IP 备用
];

/**
 * 检查请求来源是否在白名单中
 * @param {string} origin - 请求的 Origin header
 * @returns {boolean} 是否允许该来源
 */
export function isOriginAllowed(origin) {
  if (!origin) {
    return false;
  }
  
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * 获取 CORS headers
 * @param {Request} request - 请求对象
 * @returns {Object} CORS headers 对象
 */
export function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  
  // 如果来源在白名单中，返回该来源
  if (isOriginAllowed(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',  // 24 小时
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'  // 重要：告诉缓存根据 Origin 变化
    };
  }
  
  // 不在白名单中，返回空对象（不设置 CORS headers）
  return {};
}

/**
 * 创建带 CORS headers 的响应
 * @param {Object} data - 响应数据
 * @param {number} status - HTTP 状态码
 * @param {Request} request - 请求对象
 * @param {Object} additionalHeaders - 额外的 headers
 * @returns {Response} 响应对象
 */
export function createCorsResponse(data, status, request, additionalHeaders = {}) {
  const corsHeaders = getCorsHeaders(request);
  
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders
    }
  });
}

/**
 * 处理 OPTIONS 预检请求
 * @param {Request} request - 请求对象
 * @returns {Response} 预检响应
 */
export function handleCorsPreFlight(request) {
  const origin = request.headers.get('Origin');
  
  if (isOriginAllowed(origin)) {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin'
      }
    });
  }
  
  // 不在白名单中，返回 403
  return new Response(JSON.stringify({
    code: 403,
    message: '不允许的来源'
  }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 创建错误响应（带 CORS）
 * @param {string} message - 错误消息
 * @param {number} status - HTTP 状态码
 * @param {Request} request - 请求对象
 * @returns {Response} 错误响应
 */
export function createCorsErrorResponse(message, status, request) {
  return createCorsResponse({
    code: status,
    message
  }, status, request);
}

/**
 * 创建成功响应（带 CORS）
 * @param {Object} data - 响应数据
 * @param {Request} request - 请求对象
 * @returns {Response} 成功响应
 */
export function createCorsSuccessResponse(data, request) {
  return createCorsResponse(data, 200, request);
}

/**
 * 验证请求来源（中间件）
 * @param {Request} request - 请求对象
 * @returns {Object} { allowed: boolean, origin: string }
 */
export function validateOrigin(request) {
  const origin = request.headers.get('Origin');
  
  return {
    allowed: isOriginAllowed(origin),
    origin: origin || 'unknown'
  };
}

/**
 * 添加 CORS headers 到现有响应
 * @param {Response} response - 原始响应
 * @param {Request} request - 请求对象
 * @returns {Response} 添加了 CORS headers 的新响应
 */
export async function addCorsHeaders(response, request) {
  const corsHeaders = getCorsHeaders(request);
  
  // 克隆响应并添加 CORS headers
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

/**
 * 日志记录 CORS 请求
 * @param {Request} request - 请求对象
 * @param {boolean} allowed - 是否允许
 */
export function logCorsRequest(request, allowed) {
  const origin = request.headers.get('Origin');
  const method = request.method;
  const url = new URL(request.url);
  
  if (allowed) {
    console.log(`✅ CORS 允许: ${method} ${url.pathname} from ${origin}`);
  } else {
    console.warn(`⚠️ CORS 拒绝: ${method} ${url.pathname} from ${origin}`);
  }
}

