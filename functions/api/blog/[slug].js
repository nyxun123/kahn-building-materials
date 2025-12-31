/**
 * 博客文章详情 API (Static Version)
 * 返回指定 slug 的文章内容
 */

import { handleCorsPreFlight } from '../../lib/cors.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
  createNotFoundResponse
} from '../../lib/api-response.js';
import { STATIC_BLOG_ARTICLES } from '../../lib/blog-static-data.js';

export async function onRequestGet(context) {
  const { request, params } = context;

  try {
    const { slug } = params;
    const url = new URL(request.url);
    const rawLang = url.searchParams.get('lang') || 'en';
    const lang = rawLang.split('-')[0].toLowerCase();

    const article = STATIC_BLOG_ARTICLES.find((item) => item.slug === slug);

    if (!article) {
      return createNotFoundResponse({ message: 'Article not found', request });
    }

    const title = article[`title_${lang}`] || article.title_en || article.title_zh;
    const excerpt = article[`excerpt_${lang}`] || article.excerpt_en || article.excerpt_zh;
    const content = article[`content_${lang}`] || article.content_en || article.content_zh;
    const seoTitle = article[`meta_title_${lang}`] || title;
    const seoDescription = article[`meta_description_${lang}`] || excerpt;

    return createSuccessResponse({
      data: {
        id: article.id,
        slug: article.slug,
        title,
        content,
        excerpt,
        coverImage: article.cover_image,
        category: article.category,
        tags: article.tags || [],
        author: article.author,
        viewCount: article.view_count || 0,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        updatedAt: article.updated_at || article.published_at,
        seo: {
          title: seoTitle,
          description: seoDescription
        },
        translations: {
          zh: { title: article.title_zh || '', available: !!article.title_zh },
          en: { title: article.title_en || '', available: !!article.title_en },
          ru: { title: article.title_ru || '', available: !!article.title_ru }
        }
      },
      request
    });
  } catch (error) {
    console.error('Failed to fetch blog article:', error);
    return createServerErrorResponse({
      message: 'Failed to fetch blog article',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  return handleCorsPreFlight(context.request);
}
