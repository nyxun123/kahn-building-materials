import { verifyPassword } from '../../lib/password-hash.js';
import { generateToken } from '../../lib/jwt-auth.js';
import { createCorsResponse, createCorsErrorResponse } from '../../lib/cors.js';

/**
 * 测试登录功能 - 用于诊断问题
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { email, password } = body || {};

    console.log('🧪 测试登录 - Email:', email);

    if (!email || !password) {
      return createCorsErrorResponse('请填写邮箱和密码', 400, request);
    }

    // 检查数据库
    if (!env.DB) {
      console.error('❌ D1数据库未配置');
      return createCorsErrorResponse('数据库未配置', 500, request);
    }

    console.log('✅ 数据库已配置');

    // 查询管理员
    let admin;
    try {
      admin = await env.DB.prepare(`
        SELECT id, email, password_hash, name, role
        FROM admins
        WHERE email = ?
      `).bind(email.toLowerCase()).first();
      
      console.log('✅ 数据库查询成功');
      console.log('👤 找到用户:', admin ? 'Yes' : 'No');
    } catch (dbError) {
      console.error('❌ 数据库查询失败:', dbError);
      return createCorsErrorResponse('数据库查询失败: ' + dbError.message, 500, request);
    }

    if (!admin) {
      return createCorsErrorResponse('用户不存在', 404, request);
    }

    console.log('👤 用户信息:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      password_hash_preview: admin.password_hash ? admin.password_hash.substring(0, 20) + '...' : 'null'
    });

    // 验证密码
    let isPasswordValid = false;
    try {
      isPasswordValid = await verifyPassword(password, admin.password_hash);
      console.log('🔑 密码验证结果:', isPasswordValid);
    } catch (pwError) {
      console.error('❌ 密码验证失败:', pwError);
      return createCorsErrorResponse('密码验证失败: ' + pwError.message, 500, request);
    }

    if (!isPasswordValid) {
      return createCorsErrorResponse('密码错误', 401, request);
    }

    // 生成 JWT Token
    let accessToken, refreshToken;
    try {
      const tokenPayload = {
        sub: admin.id.toString(),
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      };

      console.log('🎫 生成 Token - Payload:', tokenPayload);
      console.log('🔐 JWT_SECRET 是否存在:', env.JWT_SECRET ? 'Yes' : 'No');

      accessToken = await generateToken(tokenPayload, env, 'access');
      console.log('✅ Access Token 生成成功');

      refreshToken = await generateToken(tokenPayload, env, 'refresh');
      console.log('✅ Refresh Token 生成成功');
    } catch (tokenError) {
      console.error('❌ Token 生成失败:', tokenError);
      return createCorsErrorResponse('Token生成失败: ' + tokenError.message, 500, request);
    }

    // 返回成功响应
    return createCorsResponse({
      success: true,
      message: '测试登录成功',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
      debug: {
        hasDB: !!env.DB,
        hasJWTSecret: !!env.JWT_SECRET,
        passwordHashFormat: admin.password_hash.includes(':') ? 'hashed' : 'plaintext'
      }
    }, 200, request);

  } catch (error) {
    console.error('❌ 测试登录失败:', error);
    return createCorsErrorResponse('测试失败: ' + error.message, 500, request);
  }
}

