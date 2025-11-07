import { rateLimitMiddleware } from '../lib/rate-limit.js';
import { handleCorsPreFlight } from '../lib/cors.js';
import { validateContactForm } from '../lib/validation.js';
import {
  createSuccessResponse,
  createBadRequestResponse,
  createServerErrorResponse
} from '../lib/api-response.js';

/**
 * 处理联系表单提交
 * POST /api/contact
 * 
 * 安全措施：
 * - 速率限制：防止垃圾邮件
 * - 输入验证：防止恶意输入
 * - 数据清理：防止 XSS 攻击
 * - SQL 参数化：防止 SQL 注入
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 速率限制检查（public 级别：200次/分钟）
    const rateLimit = await rateLimitMiddleware(request, env, 'public');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return createBadRequestResponse({
        message: '请求格式错误',
        request
      });
    }

    // 兼容前端格式：{ data: { ... } } 或直接 { ... }
    const formData = body.data || body;

    // 验证表单数据
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      return createBadRequestResponse({
        message: validation.error,
        request
      });
    }

    const { sanitizedData } = validation;

    // 数据库检查
    if (!env.DB) {
      return createServerErrorResponse({
        message: '数据库未配置',
        request
      });
    }

    // 插入数据到数据库
    try {
      const result = await env.DB.prepare(`
        INSERT INTO contacts (
          name, email, phone, company, country, subject, message, language, status, is_read
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.company,
        sanitizedData.country,
        sanitizedData.subject,
        sanitizedData.message,
        sanitizedData.language,
        'new',
        0
      ).run();

      // 记录成功日志
      console.log('✅ 联系表单提交成功:', {
        id: result.meta.last_row_id,
        email: sanitizedData.email,
        language: sanitizedData.language,
        timestamp: new Date().toISOString()
      });

      return createSuccessResponse({
        message: '您的留言已成功提交！我们会尽快与您联系。',
        data: {
          id: result.meta.last_row_id,
          submitted: true
        },
        request
      });

    } catch (dbError) {
      console.error('❌ 数据库插入失败:', dbError);
      
      // 检查是否是重复提交（可选：基于email和时间戳）
      if (dbError.message && dbError.message.includes('UNIQUE')) {
        return createBadRequestResponse({
          message: '您已经提交过类似的留言，请勿重复提交',
          request
        });
      }

      return createServerErrorResponse({
        message: '提交失败，请稍后重试',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('❌ 联系表单提交错误:', error);
    return createServerErrorResponse({
      message: '系统错误，请稍后重试',
      error: error.message,
      request
    });
  }
}

/**
 * 处理 CORS 预检请求
 * OPTIONS /api/contact
 */
export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}


import { validateContactForm } from '../lib/validation.js';
import {
  createSuccessResponse,
  createBadRequestResponse,
  createServerErrorResponse
} from '../lib/api-response.js';

/**
 * 处理联系表单提交
 * POST /api/contact
 * 
 * 安全措施：
 * - 速率限制：防止垃圾邮件
 * - 输入验证：防止恶意输入
 * - 数据清理：防止 XSS 攻击
 * - SQL 参数化：防止 SQL 注入
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 速率限制检查（public 级别：200次/分钟）
    const rateLimit = await rateLimitMiddleware(request, env, 'public');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return createBadRequestResponse({
        message: '请求格式错误',
        request
      });
    }

    // 兼容前端格式：{ data: { ... } } 或直接 { ... }
    const formData = body.data || body;

    // 验证表单数据
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      return createBadRequestResponse({
        message: validation.error,
        request
      });
    }

    const { sanitizedData } = validation;

    // 数据库检查
    if (!env.DB) {
      return createServerErrorResponse({
        message: '数据库未配置',
        request
      });
    }

    // 插入数据到数据库
    try {
      const result = await env.DB.prepare(`
        INSERT INTO contacts (
          name, email, phone, company, country, subject, message, language, status, is_read
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.company,
        sanitizedData.country,
        sanitizedData.subject,
        sanitizedData.message,
        sanitizedData.language,
        'new',
        0
      ).run();

      // 记录成功日志
      console.log('✅ 联系表单提交成功:', {
        id: result.meta.last_row_id,
        email: sanitizedData.email,
        language: sanitizedData.language,
        timestamp: new Date().toISOString()
      });

      return createSuccessResponse({
        message: '您的留言已成功提交！我们会尽快与您联系。',
        data: {
          id: result.meta.last_row_id,
          submitted: true
        },
        request
      });

    } catch (dbError) {
      console.error('❌ 数据库插入失败:', dbError);
      
      // 检查是否是重复提交（可选：基于email和时间戳）
      if (dbError.message && dbError.message.includes('UNIQUE')) {
        return createBadRequestResponse({
          message: '您已经提交过类似的留言，请勿重复提交',
          request
        });
      }

      return createServerErrorResponse({
        message: '提交失败，请稍后重试',
        error: dbError.message,
        request
      });
    }

  } catch (error) {
    console.error('❌ 联系表单提交错误:', error);
    return createServerErrorResponse({
      message: '系统错误，请稍后重试',
      error: error.message,
      request
    });
  }
}

/**
 * 处理 CORS 预检请求
 * OPTIONS /api/contact
 */
export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

