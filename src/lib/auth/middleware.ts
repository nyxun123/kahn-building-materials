import { Request, Response, NextFunction } from 'express';
import { JWTService, JWTPayload } from './jwt';
import { PasswordService } from './password';

/**
 * 认证中间件
 * 验证JWT令牌并附加用户信息到请求对象
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: '访问被拒绝，需要认证令牌',
      code: 'AUTH_TOKEN_REQUIRED'
    });
  }

  const payload = JWTService.verifyAccessToken(token);
  
  if (!payload) {
    return res.status(403).json({ 
      error: '无效或过期的令牌',
      code: 'INVALID_TOKEN'
    });
  }

  // 将用户信息附加到请求对象
  (req as any).user = payload;
  next();
}

/**
 * 角色验证中间件
 * 检查用户是否具有所需角色
 */
export function requireRole(requiredRoles: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JWTPayload;
    
    if (!user) {
      return res.status(401).json({ 
        error: '需要认证',
        code: 'AUTH_REQUIRED'
      });
    }

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const hasRole = rolesArray.some(role => user.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ 
        error: '权限不足，需要角色: ' + rolesArray.join(', '),
        code: 'INSUFFICIENT_ROLE',
        requiredRoles: rolesArray,
        userRoles: user.roles
      });
    }

    next();
  };
}

/**
 * 权限验证中间件
 * 检查用户是否具有特定权限
 */
export function requirePermission(requiredPermissions: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JWTPayload;
    
    if (!user) {
      return res.status(401).json({ 
        error: '需要认证',
        code: 'AUTH_REQUIRED'
      });
    }

    const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const userPermissions = user.permissions || [];
    
    const hasPermission = permissionsArray.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        error: '权限不足，需要权限: ' + permissionsArray.join(', '),
        code: 'INSUFFICIENT_PERMISSION',
        requiredPermissions: permissionsArray,
        userPermissions: userPermissions
      });
    }

    next();
  };
}

/**
 * 可选认证中间件
 * 尝试认证但不强制要求，用于公开接口但有用户信息时使用
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const payload = JWTService.verifyAccessToken(token);
    if (payload) {
      (req as any).user = payload;
    }
  }

  next();
}

/**
 * 管理员权限验证中间件
 * 简化版，检查用户是否为管理员
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(['admin', 'superadmin'])(req, res, next);
}

/**
 * 超级管理员权限验证中间件
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(['superadmin'])(req, res, next);
}

/**
 * 速率限制中间件
 * 防止暴力破解攻击
 */
export function rateLimit(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // 清理过期记录
    for (const [key, value] of attempts.entries()) {
      if (value.resetTime < now) {
        attempts.delete(key);
      }
    }

    const attempt = attempts.get(ip) || { count: 0, resetTime: now + windowMs };

    if (attempt.count >= maxAttempts) {
      return res.status(429).json({
        error: '请求过于频繁，请稍后再试',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((attempt.resetTime - now) / 1000)
      });
    }

    attempt.count++;
    attempts.set(ip, attempt);

    // 添加速率限制头信息
    res.setHeader('X-RateLimit-Limit', maxAttempts.toString());
    res.setHeader('X-RateLimit-Remaining', (maxAttempts - attempt.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(attempt.resetTime / 1000).toString());

    next();
  };
}

/**
 * CORS中间件
 * 处理跨域请求
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

/**
 * 请求日志中间件
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const user = (req as any).user;
  const userId = user ? user.userId : 'anonymous';

  console.log(`${new Date().toISOString()} [${req.method}] ${req.path} - User: ${userId}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} [${req.method}] ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });

  next();
}

/**
 * 错误处理中间件
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: '数据验证失败',
      code: 'VALIDATION_ERROR',
      details: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: '认证失败',
      code: 'UNAUTHORIZED'
    });
  }

  // 默认错误响应
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

/**
 * 安全检查中间件
 * 防止常见Web攻击
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // 设置安全相关的HTTP头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // CSP头（根据实际需求调整）
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );

  next();
}

// 扩展Request类型以包含user属性
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = {
  authenticateToken,
  requireRole,
  requirePermission,
  optionalAuth,
  requireAdmin,
  requireSuperAdmin,
  rateLimit,
  corsMiddleware,
  requestLogger,
  errorHandler,
  securityHeaders
};