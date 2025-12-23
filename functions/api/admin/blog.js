/**
 * 博客文章管理 API
 * 需要管理员认证
 */

import { authenticate } from '../../lib/jwt-auth.js';
import { handleCorsPreFlight } from '../../lib/cors.js';
import {
    createSuccessResponse,
    createServerErrorResponse,
    createUnauthorizedResponse,
    createErrorResponse,
    createPaginationInfo
} from '../../lib/api-response.js';

// 获取所有文章（包括草稿）
export async function onRequestGet(context) {
    const { request, env } = context;

    try {
        const auth = await authenticate(request, env);
        if (!auth.authenticated) {
            return createUnauthorizedResponse({ message: auth.error || '未授权', request });
        }

        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
        const offset = (page - 1) * limit;
        const status = url.searchParams.get('status'); // published, draft, all

        if (!env.DB) {
            return createServerErrorResponse({ message: 'D1数据库未配置', request });
        }

        // 确保表存在
        await ensureBlogTableExists(env.DB);

        let whereClause = '';
        let bindings = [];

        if (status === 'published') {
            whereClause = 'WHERE is_published = 1';
        } else if (status === 'draft') {
            whereClause = 'WHERE is_published = 0';
        }

        const articlesResult = await env.DB.prepare(`
      SELECT * FROM blog_articles ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(...bindings, limit, offset).all();

        const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as total FROM blog_articles ${whereClause}
    `).bind(...bindings).first();

        return createSuccessResponse({
            data: articlesResult.results || [],
            pagination: createPaginationInfo(page, limit, countResult?.total || 0),
            request
        });

    } catch (error) {
        console.error('获取博客列表失败:', error);
        return createServerErrorResponse({
            message: '获取博客列表失败',
            error: error.message,
            request
        });
    }
}

// 创建文章
export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const auth = await authenticate(request, env);
        if (!auth.authenticated) {
            return createUnauthorizedResponse({ message: auth.error || '未授权', request });
        }

        if (!env.DB) {
            return createServerErrorResponse({ message: 'D1数据库未配置', request });
        }

        await ensureBlogTableExists(env.DB);

        const data = await request.json();

        // 验证必填字段
        if (!data.slug || !data.title_zh) {
            return createErrorResponse({
                code: 400,
                message: 'slug 和中文标题为必填项',
                request
            });
        }

        // 检查 slug 是否已存在
        const existing = await env.DB.prepare(
            'SELECT id FROM blog_articles WHERE slug = ?'
        ).bind(data.slug).first();

        if (existing) {
            return createErrorResponse({
                code: 400,
                message: 'URL标识符(slug)已存在',
                request
            });
        }

        // 处理发布时间
        const publishedAt = data.is_published ? new Date().toISOString() : null;

        const result = await env.DB.prepare(`
      INSERT INTO blog_articles (
        slug, title_zh, title_en, title_ru,
        content_zh, content_en, content_ru,
        excerpt_zh, excerpt_en, excerpt_ru,
        cover_image, category, tags, author,
        is_published, is_featured, published_at,
        meta_title_zh, meta_title_en, meta_title_ru,
        meta_description_zh, meta_description_en, meta_description_ru
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
            data.slug,
            data.title_zh,
            data.title_en || '',
            data.title_ru || '',
            data.content_zh || '',
            data.content_en || '',
            data.content_ru || '',
            data.excerpt_zh || '',
            data.excerpt_en || '',
            data.excerpt_ru || '',
            data.cover_image || '',
            data.category || 'news',
            JSON.stringify(data.tags || []),
            data.author || 'Kahn Team',
            data.is_published ? 1 : 0,
            data.is_featured ? 1 : 0,
            publishedAt,
            data.meta_title_zh || '',
            data.meta_title_en || '',
            data.meta_title_ru || '',
            data.meta_description_zh || '',
            data.meta_description_en || '',
            data.meta_description_ru || ''
        ).run();

        const newArticle = await env.DB.prepare(
            'SELECT * FROM blog_articles WHERE id = ?'
        ).bind(result.meta.last_row_id).first();

        return createSuccessResponse({
            data: newArticle,
            message: '文章创建成功',
            code: 201,
            request
        });

    } catch (error) {
        console.error('创建文章失败:', error);
        return createServerErrorResponse({
            message: '创建文章失败',
            error: error.message,
            request
        });
    }
}

// 确保博客表存在
async function ensureBlogTableExists(db) {
    await db.prepare(`
    CREATE TABLE IF NOT EXISTS blog_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title_zh TEXT NOT NULL,
      title_en TEXT,
      title_ru TEXT,
      content_zh TEXT,
      content_en TEXT,
      content_ru TEXT,
      excerpt_zh TEXT,
      excerpt_en TEXT,
      excerpt_ru TEXT,
      cover_image TEXT,
      category TEXT DEFAULT 'news',
      tags TEXT,
      author TEXT DEFAULT 'Kahn Team',
      is_published INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      meta_title_zh TEXT,
      meta_title_en TEXT,
      meta_title_ru TEXT,
      meta_description_zh TEXT,
      meta_description_en TEXT,
      meta_description_ru TEXT,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export async function onRequestOptions(context) {
    return handleCorsPreFlight(context.request);
}
