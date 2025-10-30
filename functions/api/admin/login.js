import { verifyPassword } from '../../lib/password-hash.js';
import { generateToken } from '../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../lib/rate-limit.js';
import { createCorsResponse, createCorsErrorResponse, handleCorsPreFlight } from '../../lib/cors.js';

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
      return createCorsErrorResponse('请求格式错误', 400, request);
    }

    const { email, password } = body || {};

    // 2. 输入验证
    if (!email || !password) {
      return createCorsErrorResponse('请填写邮箱和密码', 400, request);
    }

    // 3. Email 格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createCorsErrorResponse('邮箱格式无效', 400, request);
    }

    // 4. 密码长度验证（防止 DoS）
    if (password.length > 128) {
      return createCorsErrorResponse('密码长度无效', 400, request);
    }

    // 5. 数据库检查
    if (!env.DB) {
      console.error('D1数据库未配置');
      return createCorsErrorResponse('服务暂时不可用，请稍后重试', 500, request);
    }

    try {
      // 6. 查询管理员账户（包含锁定字段）
      const admin = await env.DB.prepare(`
        SELECT id, email, password_hash, name, role, is_active,
               failed_login_attempts, locked_until
        FROM admins
        WHERE email = ?
      `).bind(email.toLowerCase()).first();

      // 7. 检查账户是否存在
      if (!admin) {
        console.warn('登录失败: 账户不存在', email);
        // 使用通用错误消息（防止用户枚举）
        return createCorsErrorResponse('邮箱或密码错误', 401, request);
      }

      // 8. 检查账户锁定状态
      if (admin.locked_until) {
        const lockedUntil = new Date(admin.locked_until);
        const now = new Date();

        if (now < lockedUntil) {
          const remainingMinutes = Math.ceil((lockedUntil - now) / 60000);
          console.warn('登录失败: 账户已锁定', email, '剩余时间:', remainingMinutes, '分钟');
          return createCorsErrorResponse(
            `账户已被锁定，请在 ${remainingMinutes} 分钟后重试`,
            423,
            request
          );
        } else {
          // 锁定时间已过，重置锁定状态
          await env.DB.prepare(`
            UPDATE admins
            SET locked_until = NULL, failed_login_attempts = 0
            WHERE id = ?
          `).bind(admin.id).run();
          admin.failed_login_attempts = 0;
        }
      }

      // 9. 检查账户是否激活
      if (!admin.is_active) {
        console.warn('登录失败: 账户已禁用', email);
        return createCorsErrorResponse('账户已被禁用，请联系管理员', 403, request);
      }

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

        // 增加失败次数
        const failedAttempts = (admin.failed_login_attempts || 0) + 1;
        const shouldLock = failedAttempts >= 5;

        if (shouldLock) {
          // 锁定账户 30 分钟
          await env.DB.prepare(`
            UPDATE admins
            SET failed_login_attempts = ?,
                locked_until = datetime('now', '+30 minutes')
            WHERE id = ?
          `).bind(failedAttempts, admin.id).run();

          console.warn(`🔒 账户已锁定: ${email} (失败次数: ${failedAttempts})`);
          return createCorsErrorResponse(
            '登录失败次数过多，账户已被锁定 30 分钟',
            423,
            request
          );
        } else {
          // 仅增加失败次数
          await env.DB.prepare(`
            UPDATE admins
            SET failed_login_attempts = ?
            WHERE id = ?
          `).bind(failedAttempts, admin.id).run();

          const remainingAttempts = 5 - failedAttempts;
          console.warn(`⚠️ 登录失败: ${email} (剩余尝试次数: ${remainingAttempts})`);
        }

        return createCorsErrorResponse('邮箱或密码错误', 401, request);
      }

      // 11. 登录成功 - 重置失败次数
      if (admin.failed_login_attempts > 0 || admin.locked_until) {
        await env.DB.prepare(`
          UPDATE admins
          SET failed_login_attempts = 0, locked_until = NULL
          WHERE id = ?
        `).bind(admin.id).run();
        console.log(`✅ 重置失败次数: ${email}`);
      }

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

      // 12. 记录成功登录
      console.log('✅ 登录成功:', email, 'Role:', admin.role);

      // 13. 返回成功响应（带 CORS）
      return createCorsResponse({
        success: true,
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
      }, 200, request);

    } catch (dbError) {
      console.error('数据库查询失败:', dbError);
      return createCorsErrorResponse('服务暂时不可用，请稍后重试', 500, request);
    }

  } catch (error) {
    console.error('登录API错误:', error);
    return createCorsErrorResponse('服务器错误，请稍后重试', 500, request);
  }
}

/**
 * OPTIONS 请求处理（CORS 预检）
 */
export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}