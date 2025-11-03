// 媒体文件管理 API
// 支持获取、创建、更新、删除媒体文件记录

import { authenticate, createUnauthorizedResponse } from '../../lib/jwt-auth.js';
import {
  createSuccessResponse,
  createErrorResponse,
  createServerErrorResponse,
  createBadRequestResponse,
  createNotFoundResponse,
  createPaginationInfo
} from '../../lib/api-response.js';

// GET - 获取媒体文件列表
export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    // 验证JWT Token
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '需要登录',
        request
      });
    }

    // 解析查询参数
    const url = new URL(request.url);
    const fileType = url.searchParams.get('file_type'); // 'image' 或 'video'
    const folder = url.searchParams.get('folder');
    const usageLocation = url.searchParams.get('usage_location');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('page_size') || '20');
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereConditions = ['is_active = 1'];
    let params = [];

    if (fileType) {
      whereConditions.push('file_type = ?');
      params.push(fileType);
    }

    if (folder) {
      whereConditions.push('folder = ?');
      params.push(folder);
    }

    if (usageLocation) {
      whereConditions.push('usage_location = ?');
      params.push(usageLocation);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // 获取总数
    const countSQL = `SELECT COUNT(*) as total FROM media_files ${whereClause}`;
    const countResult = await env.DB.prepare(countSQL).bind(...params).first();
    const total = countResult?.total || 0;

    // 获取媒体文件列表
    const listSQL = `
      SELECT * FROM media_files 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await env.DB.prepare(listSQL)
      .bind(...params, pageSize, offset)
      .all();

    return createSuccessResponse({
      data: result.results || [],
      message: '获取媒体文件列表成功',
      pagination: createPaginationInfo(page, pageSize, total),
      request
    });

  } catch (error) {
    console.error('❌ 获取媒体文件列表失败:', error);
    return createServerErrorResponse({
      message: '获取媒体文件列表失败',
      error: error.message,
      request
    });
  }
}

// POST - 创建媒体文件记录
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 验证JWT Token
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '需要登录',
        request
      });
    }

    const data = await request.json();

    // 验证必填字段
    if (!data.file_name || !data.file_url || !data.file_type || !data.mime_type) {
      return createBadRequestResponse({
        message: '缺少必填字段：file_name, file_url, file_type, mime_type',
        request
      });
    }

    // 插入媒体文件记录
    const insertSQL = `
      INSERT INTO media_files (
        file_name, file_url, file_type, file_size, mime_type, folder,
        title_zh, title_en, title_ru,
        description_zh, description_en, description_ru,
        alt_text_zh, alt_text_en, alt_text_ru,
        usage_location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await env.DB.prepare(insertSQL).bind(
      data.file_name,
      data.file_url,
      data.file_type,
      data.file_size || 0,
      data.mime_type,
      data.folder || 'general',
      data.title_zh || '',
      data.title_en || '',
      data.title_ru || '',
      data.description_zh || '',
      data.description_en || '',
      data.description_ru || '',
      data.alt_text_zh || '',
      data.alt_text_en || '',
      data.alt_text_ru || '',
      data.usage_location || ''
    ).run();

    // 获取新创建的记录
    const newRecord = await env.DB.prepare(
      'SELECT * FROM media_files WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return createSuccessResponse({
      data: newRecord,
      message: '媒体文件记录创建成功',
      code: 201,
      request
    });

  } catch (error) {
    console.error('❌ 创建媒体文件记录失败:', error);
    return createServerErrorResponse({
      message: '创建媒体文件记录失败',
      error: error.message,
      request
    });
  }
}

// PUT - 更新媒体文件记录
export async function onRequestPut(context) {
  const { request, env } = context;

  try {
    // 验证JWT Token
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '需要登录',
        request
      });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return createBadRequestResponse({
        message: '缺少媒体文件ID',
        request
      });
    }

    const data = await request.json();

    // 更新媒体文件记录
    const updateSQL = `
      UPDATE media_files SET
        title_zh = ?,
        title_en = ?,
        title_ru = ?,
        description_zh = ?,
        description_en = ?,
        description_ru = ?,
        alt_text_zh = ?,
        alt_text_en = ?,
        alt_text_ru = ?,
        usage_location = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await env.DB.prepare(updateSQL).bind(
      data.title_zh || '',
      data.title_en || '',
      data.title_ru || '',
      data.description_zh || '',
      data.description_en || '',
      data.description_ru || '',
      data.alt_text_zh || '',
      data.alt_text_en || '',
      data.alt_text_ru || '',
      data.usage_location || '',
      id
    ).run();

    // 获取更新后的记录
    const updatedRecord = await env.DB.prepare(
      'SELECT * FROM media_files WHERE id = ?'
    ).bind(id).first();

    return createSuccessResponse({
      data: updatedRecord,
      message: '媒体文件记录更新成功',
      request
    });

  } catch (error) {
    console.error('❌ 更新媒体文件记录失败:', error);
    return createServerErrorResponse({
      message: '更新媒体文件记录失败',
      error: error.message,
      request
    });
  }
}

// DELETE - 删除媒体文件记录（软删除）
export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    // 验证JWT Token
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '需要登录',
        request
      });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return createBadRequestResponse({
        message: '缺少媒体文件ID',
        request
      });
    }

    // 软删除（设置 is_active = 0）
    await env.DB.prepare(
      'UPDATE media_files SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(id).run();

    return createSuccessResponse({
      data: { id },
      message: '媒体文件删除成功',
      request
    });

  } catch (error) {
    console.error('❌ 删除媒体文件失败:', error);
    return createServerErrorResponse({
      message: '删除媒体文件失败',
      error: error.message,
      request
    });
  }
}

