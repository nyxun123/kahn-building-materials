import { authenticate } from '../../../lib/jwt-auth.js';
import { handleCorsPreFlight } from '../../../lib/cors.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
  createBadRequestResponse,
  createNotFoundResponse
} from '../../../lib/api-response.js';

/**
 * 更新单个联系数据
 * PUT /api/admin/contacts/:id
 */
export async function onRequestPut(context) {
  const { request, env, params } = context;

  try {
    // 1. JWT 认证验证
    const authResult = await authenticate(request, env);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    // 2. 获取联系 ID
    const contactId = params.id;
    if (!contactId) {
      return createBadRequestResponse({
        message: '缺少联系 ID',
        request
      });
    }

    // 3. 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return createBadRequestResponse({
        message: '请求格式错误',
        request
      });
    }

    const updates = body || {};

    // 4. 构建更新语句（只更新提供的字段）
    const allowedFields = ['admin_notes', 'status', 'is_read'];
    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updates[field]);
      }
    }

    if (updateFields.length === 0) {
      return createBadRequestResponse({
        message: '没有可更新的字段',
        request
      });
    }

    // 添加 updated_at
    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    // 5. 执行更新
    const updateSql = `
      UPDATE contacts 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    const result = await env.DB.prepare(updateSql)
      .bind(...updateValues, contactId)
      .run();

    if (result.meta.changes === 0) {
      return createNotFoundResponse({
        message: '联系数据不存在',
        request
      });
    }

    // 6. 查询更新后的数据
    const updatedContact = await env.DB.prepare(`
      SELECT id, name, email, phone, company, country, subject, message, language, 
             created_at, updated_at, status, is_read, admin_notes
      FROM contacts
      WHERE id = ?
    `).bind(contactId).first();

    return createSuccessResponse({
      data: updatedContact,
      message: '更新成功',
      request
    });

  } catch (error) {
    console.error('更新联系数据失败:', error);
    return createServerErrorResponse({
      message: '更新失败',
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

