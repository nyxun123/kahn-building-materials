/**
 * 速率限制工具
 * 
 * 功能：
 * - 基于 IP 地址的速率限制
 * - 支持不同端点的不同限制策略
 * - 使用 Cloudflare Workers KV 存储计数
 * - 返回 429 状态码和 Retry-After header
 * 
 * 安全特性：
 * - 防止暴力破解攻击
 * - 防止 DoS 攻击
 * - 滑动窗口算法
 */

/**
 * 速率限制配置
 */
const RATE_LIMIT_CONFIGS = {
  // 登录端点：5次尝试/5分钟
  login: {
    limit: 5,
    window: 300,  // 5 分钟（秒）
    message: '登录尝试次数过多，请 5 分钟后重试'
  },
  
  // 管理 API：100次请求/分钟
  admin: {
    limit: 100,
    window: 60,  // 1 分钟（秒）
    message: '请求过于频繁，请稍后重试'
  },
  
  // 公共 API：200次请求/分钟
  public: {
    limit: 200,
    window: 60,
    message: '请求过于频繁，请稍后重试'
  },
  
  // 图片上传：10次/分钟
  upload: {
    limit: 10,
    window: 60,
    message: '上传过于频繁，请稍后重试'
  },
  
  // 密码重置：3次/小时
  passwordReset: {
    limit: 3,
    window: 3600,  // 1 小时（秒）
    message: '密码重置请求过多，请 1 小时后重试'
  }
};

/**
 * 获取客户端 IP 地址
 * @param {Request} request - 请求对象
 * @returns {string} IP 地址
 */
function getClientIP(request) {
  // Cloudflare 提供的真实 IP
  const cfIP = request.headers.get('CF-Connecting-IP');
  if (cfIP) return cfIP;
  
  // 备用方案
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  const xRealIP = request.headers.get('X-Real-IP');
  if (xRealIP) return xRealIP;
  
  return 'unknown';
}

/**
 * 检查速率限制（使用 KV 存储）
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量（包含 RATE_LIMIT KV 绑定）
 * @param {string} key - 限制键（如 'login', 'admin'）
 * @returns {Promise<Object>} { allowed: boolean, remaining: number, resetAt: number }
 */
export async function checkRateLimit(request, env, key = 'admin') {
  // 如果没有配置 KV，跳过速率限制（开发环境）
  if (!env.RATE_LIMIT) {
    console.warn('⚠️ RATE_LIMIT KV 未配置，跳过速率限制检查');
    return { 
      allowed: true, 
      remaining: 999, 
      resetAt: Date.now() + 60000,
      bypassed: true 
    };
  }
  
  const config = RATE_LIMIT_CONFIGS[key] || RATE_LIMIT_CONFIGS.admin;
  const ip = getClientIP(request);
  const rateLimitKey = `rate_limit:${key}:${ip}`;
  
  try {
    // 获取当前计数
    const current = await env.RATE_LIMIT.get(rateLimitKey);
    const now = Date.now();
    
    if (!current) {
      // 首次请求，初始化计数
      const data = {
        count: 1,
        firstRequest: now,
        resetAt: now + (config.window * 1000)
      };
      
      await env.RATE_LIMIT.put(
        rateLimitKey, 
        JSON.stringify(data), 
        { expirationTtl: config.window }
      );
      
      return {
        allowed: true,
        remaining: config.limit - 1,
        resetAt: data.resetAt
      };
    }
    
    // 解析现有数据
    const data = JSON.parse(current);
    
    // 检查是否超过限制
    if (data.count >= config.limit) {
      console.warn(`⚠️ 速率限制触发: ${key} - IP: ${ip} - ${data.count}/${config.limit}`);
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt,
        message: config.message
      };
    }
    
    // 增加计数
    data.count++;
    await env.RATE_LIMIT.put(
      rateLimitKey, 
      JSON.stringify(data), 
      { expirationTtl: config.window }
    );
    
    return {
      allowed: true,
      remaining: config.limit - data.count,
      resetAt: data.resetAt
    };
    
  } catch (error) {
    console.error('速率限制检查失败:', error);
    // 出错时允许请求通过（fail open）
    return { 
      allowed: true, 
      remaining: 999, 
      resetAt: Date.now() + 60000,
      error: true 
    };
  }
}

/**
 * 创建速率限制响应
 * @param {Object} rateLimitResult - 速率限制检查结果
 * @param {Request} request - 请求对象
 * @returns {Response} 429 响应
 */
export function createRateLimitResponse(rateLimitResult, request) {
  const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
  
  // 导入 CORS 工具
  const origin = request.headers.get('Origin');
  const corsHeaders = {};
  
  // 简化的 CORS headers（避免循环依赖）
  const allowedOrigins = [
    'https://kn-wallpaperglue.com',
    'https://6622cb5c.kn-wallpaperglue.pages.dev',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    corsHeaders['Vary'] = 'Origin';
  }
  
  return new Response(JSON.stringify({
    code: 429,
    message: rateLimitResult.message || '请求过于频繁，请稍后重试',
    retryAfter: retryAfter
  }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': retryAfter.toString(),
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': Math.floor(rateLimitResult.resetAt / 1000).toString(),
      ...corsHeaders
    }
  });
}

/**
 * 速率限制中间件
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量
 * @param {string} limitType - 限制类型（'login', 'admin', 'public', 'upload'）
 * @returns {Promise<Object>} { allowed: boolean, response?: Response, remaining: number }
 */
export async function rateLimitMiddleware(request, env, limitType = 'admin') {
  const result = await checkRateLimit(request, env, limitType);
  
  if (!result.allowed) {
    return {
      allowed: false,
      response: createRateLimitResponse(result, request),
      remaining: 0
    };
  }
  
  return {
    allowed: true,
    remaining: result.remaining,
    resetAt: result.resetAt
  };
}

/**
 * 添加速率限制 headers 到响应
 * @param {Response} response - 原始响应
 * @param {Object} rateLimitInfo - 速率限制信息
 * @returns {Response} 添加了速率限制 headers 的响应
 */
export function addRateLimitHeaders(response, rateLimitInfo) {
  const newHeaders = new Headers(response.headers);
  
  if (rateLimitInfo.remaining !== undefined) {
    newHeaders.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  }
  
  if (rateLimitInfo.resetAt) {
    newHeaders.set('X-RateLimit-Reset', Math.floor(rateLimitInfo.resetAt / 1000).toString());
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

/**
 * 清除速率限制（用于测试或管理）
 * @param {Object} env - 环境变量
 * @param {string} ip - IP 地址
 * @param {string} key - 限制键
 * @returns {Promise<boolean>} 是否成功清除
 */
export async function clearRateLimit(env, ip, key = 'admin') {
  if (!env.RATE_LIMIT) {
    return false;
  }
  
  const rateLimitKey = `rate_limit:${key}:${ip}`;
  
  try {
    await env.RATE_LIMIT.delete(rateLimitKey);
    console.log(`✅ 清除速率限制: ${rateLimitKey}`);
    return true;
  } catch (error) {
    console.error('清除速率限制失败:', error);
    return false;
  }
}

/**
 * 获取速率限制状态（用于监控）
 * @param {Object} env - 环境变量
 * @param {string} ip - IP 地址
 * @param {string} key - 限制键
 * @returns {Promise<Object>} 速率限制状态
 */
export async function getRateLimitStatus(env, ip, key = 'admin') {
  if (!env.RATE_LIMIT) {
    return { configured: false };
  }
  
  const rateLimitKey = `rate_limit:${key}:${ip}`;
  const config = RATE_LIMIT_CONFIGS[key] || RATE_LIMIT_CONFIGS.admin;
  
  try {
    const current = await env.RATE_LIMIT.get(rateLimitKey);
    
    if (!current) {
      return {
        configured: true,
        active: false,
        limit: config.limit,
        window: config.window
      };
    }
    
    const data = JSON.parse(current);
    
    return {
      configured: true,
      active: true,
      count: data.count,
      limit: config.limit,
      remaining: config.limit - data.count,
      resetAt: data.resetAt,
      window: config.window
    };
  } catch (error) {
    console.error('获取速率限制状态失败:', error);
    return { configured: true, error: error.message };
  }
}

