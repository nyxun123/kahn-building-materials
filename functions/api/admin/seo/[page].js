import { authenticate, createUnauthorizedResponse } from '../../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../../lib/rate-limit.js';
import { handleCorsPreFlight } from '../../../lib/cors.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
  createBadRequestResponse,
  createUnauthorizedResponse as createUnauthorizedResponseFromApi,
} from '../../../lib/api-response.js';

export async function onRequestGet(context) {
  const { request, env, params } = context;

  try {
    // 速率限制检查
    const rateLimit = await rateLimitMiddleware(request, env, 'admin');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // JWT 认证检查
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '未授权',
        request
      });
    }
    
    const pageKey = params.page || 'home';
    
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    try {
      // 查询SEO配置
      const seoConfig = await env.DB.prepare(`
        SELECT * FROM seo_configs WHERE page_key = ?
      `).bind(pageKey).first();
      
      const configData = seoConfig || {
        page_key: pageKey,
        page_name: getPageName(pageKey),
        title_zh: '',
        title_en: '',
        title_ru: '',
        description_zh: '',
        description_en: '',
        description_ru: '',
        keywords_zh: '',
        keywords_en: '',
        keywords_ru: '',
        geo_region: 'CN-ZJ',
        geo_placename: '杭州市',
        geo_position: '30.2741,120.1551',
        og_title_zh: '',
        og_title_en: '',
        og_title_ru: '',
        og_description_zh: '',
        og_description_en: '',
        og_description_ru: '',
        og_image_url: '',
        schema_type: 'Organization',
        schema_data: '',
        is_active: true,
        priority: 1,
        last_updated: new Date().toISOString(),
      };
      
      return createSuccessResponse({
        data: configData,
        message: '获取SEO配置成功',
        request
      });
    } catch (dbError) {
      console.error('SEO配置查询失败:', dbError);
      return createServerErrorResponse({
        message: '数据库查询失败',
        error: dbError.message,
        request
      });
    }
    
  } catch (error) {
    console.error('SEO API错误:', error);
    return createServerErrorResponse({
      message: '获取SEO配置失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestPost(context) {
  const { request, env, params } = context;
  
  try {
    // 速率限制检查
    const rateLimit = await rateLimitMiddleware(request, env, 'admin');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // JWT 认证检查
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse({
        message: auth.error || '未授权',
        request
      });
    }
    
    const pageKey = params.page || 'home';
    const seoData = await request.json();
    
    if (!env.DB) {
      return createServerErrorResponse({
        message: 'D1数据库未配置',
        request
      });
    }

    try {
      // 检查表是否存在，如果不存在则创建
      await ensureSEOTable(env.DB);
      
      // 更新或插入SEO配置
      await env.DB.prepare(`
        INSERT OR REPLACE INTO seo_configs (
          page_key, page_name, title_zh, title_en, title_ru,
          description_zh, description_en, description_ru,
          keywords_zh, keywords_en, keywords_ru,
          geo_region, geo_placename, geo_position,
          og_title_zh, og_title_en, og_title_ru,
          og_description_zh, og_description_en, og_description_ru,
          og_image_url, schema_type, schema_data,
          is_active, priority, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        pageKey,
        seoData.page_name || getPageName(pageKey),
        seoData.title_zh || '',
        seoData.title_en || '',
        seoData.title_ru || '',
        seoData.description_zh || '',
        seoData.description_en || '',
        seoData.description_ru || '',
        seoData.keywords_zh || '',
        seoData.keywords_en || '',
        seoData.keywords_ru || '',
        seoData.geo_region || 'CN-ZJ',
        seoData.geo_placename || '杭州市',
        seoData.geo_position || '30.2741,120.1551',
        seoData.og_title_zh || '',
        seoData.og_title_en || '',
        seoData.og_title_ru || '',
        seoData.og_description_zh || '',
        seoData.og_description_en || '',
        seoData.og_description_ru || '',
        seoData.og_image_url || '',
        seoData.schema_type || 'Organization',
        seoData.schema_data || '',
        seoData.is_active ? 1 : 0,
        seoData.priority || 1,
        new Date().toISOString()
      ).run();
      
      // 返回更新后的配置
      const updatedConfig = await env.DB.prepare(`
        SELECT * FROM seo_configs WHERE page_key = ?
      `).bind(pageKey).first();
      
      return createSuccessResponse({
        data: updatedConfig || seoData,
        message: 'SEO配置保存成功',
        request
      });
    } catch (dbError) {
      console.error('SEO配置保存失败:', dbError);
      return createServerErrorResponse({
        message: '数据库保存失败',
        error: dbError.message,
        request
      });
    }
    
  } catch (error) {
    console.error('SEO保存API错误:', error);
    return createServerErrorResponse({
      message: '保存SEO配置失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  return handleCorsPreFlight(context.request);
}

// 辅助函数
function getPageName(pageKey) {
  const pageNames = {
    home: '首页',
    products: '产品页',
    oem: 'OEM服务',
    about: '关于我们',
    contact: '联系我们',
  };
  return pageNames[pageKey] || pageKey;
}

async function ensureSEOTable(db) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS seo_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_key TEXT UNIQUE NOT NULL,
        page_name TEXT,
        title_zh TEXT,
        title_en TEXT,
        title_ru TEXT,
        description_zh TEXT,
        description_en TEXT,
        description_ru TEXT,
        keywords_zh TEXT,
        keywords_en TEXT,
        keywords_ru TEXT,
        geo_region TEXT,
        geo_placename TEXT,
        geo_position TEXT,
        og_title_zh TEXT,
        og_title_en TEXT,
        og_title_ru TEXT,
        og_description_zh TEXT,
        og_description_en TEXT,
        og_description_ru TEXT,
        og_image_url TEXT,
        schema_type TEXT,
        schema_data TEXT,
        is_active INTEGER DEFAULT 1,
        priority INTEGER DEFAULT 1,
        last_updated TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (error) {
    console.error('创建SEO表失败:', error);
  }
}