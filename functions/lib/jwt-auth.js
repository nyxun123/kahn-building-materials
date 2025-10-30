/**
 * JWT 认证中间件 - 使用 Web Crypto API
 * 
 * 功能:
 * 1. 生成 JWT token
 * 2. 验证 JWT token
 * 3. 刷新 token
 * 4. 认证中间件
 * 
 * 安全特性:
 * - HMAC-SHA256 签名
 * - Token 过期验证
 * - 防止时序攻击
 * - 安全的密钥管理
 */

// JWT 配置
const JWT_CONFIG = {
  // 从环境变量获取密钥，如果没有则使用随机生成的密钥
  // 注意：生产环境必须设置 JWT_SECRET 环境变量
  secret: null,  // 将在运行时初始化
  accessTokenExpiry: 15 * 60,  // 15 分钟（秒）
  refreshTokenExpiry: 7 * 24 * 60 * 60,  // 7 天（秒）
  issuer: 'kn-wallpaperglue.com',
  algorithm: 'HS256'
};

/**
 * 初始化 JWT 密钥
 * @param {Object} env - Cloudflare Workers 环境变量
 */
async function initializeSecret(env) {
  if (JWT_CONFIG.secret) {
    return;  // 已初始化
  }
  
  // 优先使用环境变量
  if (env.JWT_SECRET) {
    JWT_CONFIG.secret = env.JWT_SECRET;
    return;
  }
  
  // 警告：使用默认密钥（仅用于开发）
  console.warn('⚠️ 警告：未设置 JWT_SECRET 环境变量，使用默认密钥（不安全）');
  JWT_CONFIG.secret = 'default-jwt-secret-change-in-production-' + Date.now();
}

/**
 * Base64 URL 编码
 * 使用 TextEncoder 支持 UTF-8 字符
 */
function base64UrlEncode(str) {
  // 将字符串转换为 UTF-8 字节数组
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  // 将字节数组转换为二进制字符串
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Base64 编码
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL 解码
 * 使用 TextDecoder 支持 UTF-8 字符
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }

  // Base64 解码为二进制字符串
  const binary = atob(str);

  // 将二进制字符串转换为字节数组
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // 使用 TextDecoder 解码 UTF-8
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * 生成 HMAC-SHA256 签名
 */
async function generateSignature(data, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    messageData
  );
  
  const signatureArray = new Uint8Array(signature);
  const signatureString = String.fromCharCode(...signatureArray);
  return base64UrlEncode(signatureString);
}

/**
 * 验证 HMAC-SHA256 签名
 */
async function verifySignature(data, signature, secret) {
  const expectedSignature = await generateSignature(data, secret);
  
  // 时间安全的比较
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * 生成 JWT Token
 * @param {Object} payload - Token 载荷
 * @param {Object} env - 环境变量
 * @param {string} type - Token 类型: 'access' 或 'refresh'
 * @returns {Promise<string>} JWT Token
 */
export async function generateToken(payload, env, type = 'access') {
  await initializeSecret(env);
  
  const now = Math.floor(Date.now() / 1000);
  const expiry = type === 'access' 
    ? JWT_CONFIG.accessTokenExpiry 
    : JWT_CONFIG.refreshTokenExpiry;
  
  // JWT Header
  const header = {
    alg: JWT_CONFIG.algorithm,
    typ: 'JWT'
  };
  
  // JWT Payload
  const claims = {
    ...payload,
    iss: JWT_CONFIG.issuer,
    iat: now,
    exp: now + expiry,
    type: type
  };
  
  // 编码 Header 和 Payload
  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(claims));
  
  // 生成签名
  const dataToSign = `${headerEncoded}.${payloadEncoded}`;
  const signature = await generateSignature(dataToSign, JWT_CONFIG.secret);
  
  // 返回完整的 JWT
  return `${dataToSign}.${signature}`;
}

/**
 * 验证 JWT Token
 * @param {string} token - JWT Token
 * @param {Object} env - 环境变量
 * @returns {Promise<Object|null>} 解码后的 payload，如果无效则返回 null
 */
export async function verifyToken(token, env) {
  try {
    await initializeSecret(env);
    
    // 分割 Token
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('JWT 格式无效');
      return null;
    }
    
    const [headerEncoded, payloadEncoded, signature] = parts;
    
    // 验证签名
    const dataToVerify = `${headerEncoded}.${payloadEncoded}`;
    const isValid = await verifySignature(dataToVerify, signature, JWT_CONFIG.secret);
    
    if (!isValid) {
      console.error('JWT 签名无效');
      return null;
    }
    
    // 解码 Payload
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload = JSON.parse(payloadJson);
    
    // 验证过期时间
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error('JWT 已过期');
      return null;
    }
    
    // 验证签发者
    if (payload.iss !== JWT_CONFIG.issuer) {
      console.error('JWT 签发者无效');
      return null;
    }
    
    return payload;
    
  } catch (error) {
    console.error('JWT 验证失败:', error);
    return null;
  }
}

/**
 * 从请求中提取 Token
 * @param {Request} request - HTTP 请求
 * @returns {string|null} Token 或 null
 */
export function extractToken(request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return null;
  }
  
  // 支持 "Bearer <token>" 格式
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  // 也支持直接传递 token
  return authHeader;
}

/**
 * 认证中间件 - 验证请求是否包含有效的 JWT
 * @param {Request} request - HTTP 请求
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 包含 authenticated 和 user 的对象
 */
export async function authenticate(request, env) {
  const token = extractToken(request);
  
  if (!token) {
    return {
      authenticated: false,
      user: null,
      error: '缺少认证 Token'
    };
  }
  
  const payload = await verifyToken(token, env);
  
  if (!payload) {
    return {
      authenticated: false,
      user: null,
      error: 'Token 无效或已过期'
    };
  }
  
  // 验证 Token 类型（必须是 access token）
  if (payload.type !== 'access') {
    return {
      authenticated: false,
      user: null,
      error: 'Token 类型错误'
    };
  }
  
  return {
    authenticated: true,
    user: {
      id: payload.sub || payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    },
    payload: payload
  };
}

/**
 * 创建认证响应（401 Unauthorized）
 * @param {string} message - 错误消息
 * @returns {Response} HTTP 响应
 */
export function createUnauthorizedResponse(message = '需要登录') {
  return new Response(JSON.stringify({
    error: { message: message },
    code: 401
  }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

/**
 * 创建禁止访问响应（403 Forbidden）
 * @param {string} message - 错误消息
 * @returns {Response} HTTP 响应
 */
export function createForbiddenResponse(message = '权限不足') {
  return new Response(JSON.stringify({
    error: { message: message },
    code: 403
  }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

/**
 * 刷新 Token
 * @param {string} refreshToken - Refresh Token
 * @param {Object} env - 环境变量
 * @returns {Promise<Object|null>} 新的 access token 和 refresh token
 */
export async function refreshAccessToken(refreshToken, env) {
  const payload = await verifyToken(refreshToken, env);
  
  if (!payload) {
    return null;
  }
  
  // 验证 Token 类型（必须是 refresh token）
  if (payload.type !== 'refresh') {
    return null;
  }
  
  // 生成新的 access token
  const newAccessToken = await generateToken({
    sub: payload.sub || payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role
  }, env, 'access');
  
  // 可选：生成新的 refresh token（滚动刷新）
  const newRefreshToken = await generateToken({
    sub: payload.sub || payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role
  }, env, 'refresh');
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

