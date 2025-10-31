import { verifyPassword } from '../../lib/password-hash.js';
import { generateToken } from '../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../lib/rate-limit.js';
import { createCorsResponse, createCorsErrorResponse, handleCorsPreFlight } from '../../lib/cors.js';
import {
  createSuccessResponse,
  createErrorResponse,
  createServerErrorResponse
} from '../../lib/api-response.js';
import { logAudit, logAuthEvent, getClientIp, getUserAgent } from '../../lib/logger.js';

/**
 * 管理员登录 API
 *
 * 安全特性:
 * 1. 密码哈希验证（PBKDF2）
 * 2. JWT Token 生成
 * 3. Email 格式验证
 * 4. 速率限制（TODO: 实施 KV 存储）
 * 5. 账户锁定（TODO: 实施）
 * 6. 安全日志记录
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 0. 速率限制检查
    const rateLimit = await rateLimitMiddleware(request, env, 'login');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // 1. 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.warn('登录请求格式错误:', parseError.message);
      return createErrorResponse({
        code: 400,
        message: '请求格式错误',
        request
      });
    }

    const { email, password } = body || {};

    // 2. 输入验证
    if (!email || !password) {
      return createErrorResponse({
        code: 400,
        message: '请填写邮箱和密码',
        request
      });
    }

    // 3. Email 格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse({
        code: 400,
        message: '邮箱格式无效',
        request
      });
    }

    // 4. 密码长度验证（防止 DoS）
    if (password.length > 128) {
      return createErrorResponse({
        code: 400,
        message: '密码长度无效',
        request
      });
    }

    // 5. 数据库检查
    if (!env.DB) {
      console.error('D1数据库未配置');
      return createServerErrorResponse({
        message: '服务暂时不可用，请稍后重试',
        request
      });
    }

    try {
      // 6. 查询管理员账户
      const admin = await env.DB.prepare(`
        SELECT id, email, password_hash, name, role
        FROM admins
        WHERE email = ?
      `).bind(email.toLowerCase()).first();

      // 7. 检查账户是否存在
      if (!admin) {
        console.warn('登录失败: 账户不存在', email);

        // 记录登录失败的审计日志
        try {
          await logAudit(env, {
            adminId: null,
            action: 'login',
            resourceType: 'admin',
            resourceId: null,
            details: { email, reason: 'account_not_found' },
            ipAddress: getClientIp(request),
            userAgent: getUserAgent(request),
            status: 'failure'
          });
        } catch (auditError) {
          console.error('记录审计日志失败:', auditError);
        }

        // 使用通用错误消息（防止用户枚举）
        return createErrorResponse({
          code: 401,
          message: '邮箱或密码错误',
          request
        });
      }

      // 8. 账户锁定检查（暂时跳过，待数据库迁移）
      // TODO: 实施账户锁定功能

      // 10. 验证密码
      let isPasswordValid = false;

      // 兼容性处理：检查是否是旧的明文密码
      if (admin.password_hash && !admin.password_hash.includes(':')) {
        // 旧的明文密码（临时兼容）
        console.warn('⚠️ 检测到明文密码，建议尽快迁移到哈希密码');
        isPasswordValid = (admin.password_hash === password);
      } else {
        // 新的哈希密码
        isPasswordValid = await verifyPassword(password, admin.password_hash);
      }

      if (!isPasswordValid) {
        console.warn('登录失败: 密码错误', email);

        // 记录登录失败的审计日志
        try {
          await logAudit(env, {
            adminId: admin.id,
            action: 'login',
            resourceType: 'admin',
            resourceId: admin.id,
            details: { email, reason: 'invalid_password' },
            ipAddress: getClientIp(request),
            userAgent: getUserAgent(request),
            status: 'failure'
          });
        } catch (auditError) {
          console.error('记录审计日志失败:', auditError);
        }

        return createErrorResponse({
          code: 401,
          message: '邮箱或密码错误',
          request
        });
      }

      // 11. 登录成功
      console.log(`✅ 登录成功: ${email}`);

      // 10. 生成 JWT Tokens
      const tokenPayload = {
        sub: admin.id.toString(),
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      };

      const accessToken = await generateToken(tokenPayload, env, 'access');
      const refreshToken = await generateToken(tokenPayload, env, 'refresh');

      // 11. 更新最后登录时间
      await env.DB.prepare(`
        UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(admin.id).run();

      // 12. 记录成功登录的审计日志
      try {
        await logAudit(env, {
          adminId: admin.id,
          action: 'login',
          resourceType: 'admin',
          resourceId: admin.id,
          details: { email, method: 'password' },
          ipAddress: getClientIp(request),
          userAgent: getUserAgent(request),
          status: 'success',
          result: { token_issued: true }
        });
      } catch (auditError) {
        console.error('记录审计日志失败:', auditError);
      }

      // 13. 记录成功登录
      console.log('✅ 登录成功:', email, 'Role:', admin.role);

      // 13. 返回成功响应（使用统一格式）
      return createSuccessResponse({
        data: {
          user: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
          },
          accessToken: accessToken,
          refreshToken: refreshToken,
          authType: 'JWT',
          expiresIn: 900  // 15 分钟（秒）
        },
        message: '登录成功',
        request
      });

    } catch (dbError) {
      console.error('数据库查询失败:', dbError);
      return createServerErrorResponse({
        message: '服务暂时不可用，请稍后重试',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('登录API错误:', error);
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
export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}