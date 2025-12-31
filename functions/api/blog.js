/**
 * 博客文章公开 API (Static Version)
 * 用于前台获取已发布的博客文章
 */

import { handleCorsPreFlight } from '../lib/cors.js';
import {
    createSuccessResponse,
    createServerErrorResponse,
    createPaginationInfo
} from '../lib/api-response.js';
import { STATIC_BLOG_ARTICLES } from '../lib/blog-static-data.js';

// 获取文章列表
export async function onRequestGet(context) {
    const { request } = context;

    try {
        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
        const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
        const offset = (page - 1) * limit;
        const category = url.searchParams.get('category');
        // Fix: Normalize language code
        const rawLang = url.searchParams.get('lang') || 'en';
        const lang = rawLang.split('-')[0].toLowerCase();

        // 过滤数据
        let filteredArticles = STATIC_BLOG_ARTICLES;
        if (category) {
            filteredArticles = filteredArticles.filter(article => article.category === category);
        }

        // 分页
        const paginatedArticles = filteredArticles.slice(offset, offset + limit);
        const total = filteredArticles.length;

        // 处理文章数据，根据语言返回对应字段
        const articles = paginatedArticles.map(article => ({
            id: article.id,
            slug: article.slug,
            title: article[`title_${lang}`] || article.title_en || article.title_zh,
            excerpt: article[`excerpt_${lang}`] || article.excerpt_en || article.excerpt_zh,
            coverImage: article.cover_image,
            category: article.category,
            author: article.author,
            viewCount: article.view_count,
            publishedAt: article.published_at,
            createdAt: article.created_at
        }));

        return createSuccessResponse({
            data: articles,
            pagination: createPaginationInfo(page, limit, total),
            request
        });

    } catch (error) {
        console.error('Failed to fetch blog articles:', error);
        return createServerErrorResponse({
            message: 'Failed to fetch blog articles',
            error: error.message,
            request
        });
    }
}

export async function onRequestOptions(context) {
    return handleCorsPreFlight(context.request);
}
