/**
 * 博客文章详情管理 API
 * 更新和删除单篇文章
 */

import { authenticate } from '../../../lib/jwt-auth.js';
import { handleCorsPreFlight } from '../../../lib/cors.js';
import {
    createSuccessResponse,
    createServerErrorResponse,
    createUnauthorizedResponse,
    createNotFoundResponse
} from '../../../lib/api-response.js';

// 获取单篇文章
export async function onRequestGet(context) {
    const { request, env, params } = context;

    try {
        const auth = await authenticate(request, env);
        if (!auth.authenticated) {
            return createUnauthorizedResponse({ message: auth.error || '未授权', request });
        }

        const id = params.id;

        if (!env.DB) {
            return createServerErrorResponse({ message: 'D1数据库未配置', request });
        }

        const article = await env.DB.prepare(
            'SELECT * FROM blog_articles WHERE id = ?'
        ).bind(id).first();

        if (!article) {
            return createNotFoundResponse({ message: '文章不存在', request });
        }

        // 解析 tags
        if (article.tags) {
            try {
                article.tags = JSON.parse(article.tags);
            } catch (e) {
                article.tags = [];
            }
        }

        return createSuccessResponse({ data: article, request });

    } catch (error) {
        console.error('获取文章详情失败:', error);
        return createServerErrorResponse({
            message: '获取文章详情失败',
            error: error.message,
            request
        });
    }
}

// 更新文章
export async function onRequestPut(context) {
    const { request, env, params } = context;

    try {
        const auth = await authenticate(request, env);
        if (!auth.authenticated) {
            return createUnauthorizedResponse({ message: auth.error || '未授权', request });
        }

        const id = params.id;

        if (!env.DB) {
            return createServerErrorResponse({ message: 'D1数据库未配置', request });
        }

        // 检查文章是否存在
        const existing = await env.DB.prepare(
            'SELECT * FROM blog_articles WHERE id = ?'
        ).bind(id).first();

        if (!existing) {
            return createNotFoundResponse({ message: '文章不存在', request });
        }

        const data = await request.json();

        // 如果 slug 改变了，检查新 slug 是否已存在
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await env.DB.prepare(
                'SELECT id FROM blog_articles WHERE slug = ? AND id != ?'
            ).bind(data.slug, id).first();

            if (slugExists) {
                return createErrorResponse({
                    code: 400,
                    message: 'URL标识符(slug)已被其他文章使用',
                    request
                });
            }
        }

        // 处理发布时间
        let publishedAt = existing.published_at;
        if (data.is_published && !existing.is_published) {
            publishedAt = new Date().toISOString();
        }

        await env.DB.prepare(`
      UPDATE blog_articles SET
        slug = ?, title_zh = ?, title_en = ?, title_ru = ?,
        content_zh = ?, content_en = ?, content_ru = ?,
        excerpt_zh = ?, excerpt_en = ?, excerpt_ru = ?,
        cover_image = ?, category = ?, tags = ?, author = ?,
        is_published = ?, is_featured = ?, published_at = ?,
        meta_title_zh = ?, meta_title_en = ?, meta_title_ru = ?,
        meta_description_zh = ?, meta_description_en = ?, meta_description_ru = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
            data.slug || existing.slug,
            data.title_zh || existing.title_zh,
            data.title_en ?? existing.title_en,
            data.title_ru ?? existing.title_ru,
            data.content_zh ?? existing.content_zh,
            data.content_en ?? existing.content_en,
            data.content_ru ?? existing.content_ru,
            data.excerpt_zh ?? existing.excerpt_zh,
            data.excerpt_en ?? existing.excerpt_en,
            data.excerpt_ru ?? existing.excerpt_ru,
            data.cover_image ?? existing.cover_image,
            data.category || existing.category,
            JSON.stringify(data.tags || []),
            data.author || existing.author,
            data.is_published !== undefined ? (data.is_published ? 1 : 0) : existing.is_published,
            data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : existing.is_featured,
            publishedAt,
            data.meta_title_zh ?? existing.meta_title_zh,
            data.meta_title_en ?? existing.meta_title_en,
            data.meta_title_ru ?? existing.meta_title_ru,
            data.meta_description_zh ?? existing.meta_description_zh,
            data.meta_description_en ?? existing.meta_description_en,
            data.meta_description_ru ?? existing.meta_description_ru,
            id
        ).run();

        const updated = await env.DB.prepare(
            'SELECT * FROM blog_articles WHERE id = ?'
        ).bind(id).first();

        return createSuccessResponse({
            data: updated,
            message: '文章更新成功',
            request
        });

    } catch (error) {
        console.error('更新文章失败:', error);
        return createServerErrorResponse({
            message: '更新文章失败',
            error: error.message,
            request
        });
    }
}

// 删除文章
export async function onRequestDelete(context) {
    const { request, env, params } = context;

    try {
        const auth = await authenticate(request, env);
        if (!auth.authenticated) {
            return createUnauthorizedResponse({ message: auth.error || '未授权', request });
        }

        const id = params.id;

        if (!env.DB) {
            return createServerErrorResponse({ message: 'D1数据库未配置', request });
        }

        // 检查文章是否存在
        const existing = await env.DB.prepare(
            'SELECT id FROM blog_articles WHERE id = ?'
        ).bind(id).first();

        if (!existing) {
            return createNotFoundResponse({ message: '文章不存在', request });
        }

        await env.DB.prepare('DELETE FROM blog_articles WHERE id = ?').bind(id).run();

        return createSuccessResponse({
            message: '文章删除成功',
            request
        });

    } catch (error) {
        console.error('删除文章失败:', error);
        return createServerErrorResponse({
            message: '删除文章失败',
            error: error.message,
            request
        });
    }
}

export async function onRequestOptions(context) {
    return handleCorsPreFlight(context.request);
}

import { createErrorResponse } from '../../../lib/api-response.js';
