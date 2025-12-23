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

// 静态博客数据
const STATIC_ARTICLES = [
    {
        id: 1,
        slug: 'how-to-choose-cms-products',
        title_zh: 'CMS产品选型指南：如何根据应用场景选择合适的羧甲基淀粉？',
        title_en: 'CMS Product Selection Guide: How to Choose the Right Carboxymethyl Starch?',
        title_ru: 'Руководство по выбору CMS: Как выбрать правильный карбоксиметилкрахмал?',
        excerpt_zh: '不同的应用场景需要不同规格的羧甲基淀粉。本文详细解析了纺织印染(K6)、建筑腻子(8840)、石油钻井(999)等行业的最佳选型方案。',
        excerpt_en: 'Different applications require different specifications of Carboxymethyl Starch. This article details the best selection for textile usage (K6), construction putty (8840), and oil drilling (999).',
        excerpt_ru: 'Различные применения требуют различных характеристик карбоксиметилкрахмала. В этой статье подробно описан лучший выбор для текстильной промышленности (K6), строительной шпатлевки (8840) и бурения нефтяных скважин (999).',
        cover_image: '/images/应用领域/水性涂料.png',
        category: 'guide',
        author: 'Admin',
        view_count: 1250,
        published_at: '2025-12-20T10:00:00Z',
        created_at: '2025-12-20T09:00:00Z'
    },
    {
        id: 2,
        slug: 'cms-in-textile-industry',
        title_zh: '羧甲基淀粉在纺织印染中的应用优势',
        title_en: 'Application Advantages of Carboxymethyl Starch in Textile Printing and Dyeing',
        title_ru: 'Преимущества применения карбоксиметилкрахмала в текстильной печати и крашении',
        excerpt_zh: 'K6型羧甲基淀粉凭借其高粘度和优秀的渗透性，正在成为海藻酸钠的最佳替代品。',
        excerpt_en: 'K6 Carboxymethyl Starch is becoming the best substitute for sodium alginate due to its high viscosity and excellent penetration.',
        excerpt_ru: 'Карбоксиметилкрахмал K6 становится лучшим заменителем альгината натрия благодаря своей высокой вязкости и отличному проникновению.',
        cover_image: '/images/应用领域/纺织印染.jpg',
        category: 'industry',
        author: 'Technical Team',
        view_count: 850,
        published_at: '2025-12-18T14:30:00Z',
        created_at: '2025-12-18T10:00:00Z'
    }
];

// 获取文章列表
export async function onRequestGet(context) {
    const { request } = context;

    try {
        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
        const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
        const offset = (page - 1) * limit;
        const category = url.searchParams.get('category');
        const lang = url.searchParams.get('lang') || 'en';

        // 过滤数据
        let filteredArticles = STATIC_ARTICLES;
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
