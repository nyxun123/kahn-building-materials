import { authenticate, createUnauthorizedResponse } from '../../lib/jwt-auth.js';
import { rateLimitMiddleware } from '../../lib/rate-limit.js';
import { handleCorsPreFlight } from '../../lib/cors.js';
import {
  createSuccessResponse,
  createServerErrorResponse,
} from '../../lib/api-response.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    // 速率限制检查
    const rateLimit = await rateLimitMiddleware(request, env, 'admin');
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // JWT 认证检查
    const auth = await authenticate(request, env);
    if (!auth.authenticated) {
      return createUnauthorizedResponse(auth.error);
    }
    
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('range') || '7d';

    // 生成模拟分析数据
    const analyticsData = generateAnalyticsData(timeRange);

    return createSuccessResponse({
      data: analyticsData,
      message: '获取分析数据成功',
      request
    });

  } catch (error) {
    console.error('分析API错误:', error);
    return createServerErrorResponse({
      message: '获取分析数据失败',
      error: error.message,
      request
    });
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  return handleCorsPreFlight(request);
}

function generateAnalyticsData(timeRange) {
  const baseMultiplier = {
    '1d': 0.1,
    '7d': 1,
    '30d': 4,
    '90d': 12
  }[timeRange] || 1;

  const days = {
    '1d': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90
  }[timeRange] || 7;

  return {
    totalVisits: Math.floor(15847 * baseMultiplier),
    uniqueVisitors: Math.floor(12456 * baseMultiplier),
    pageViews: Math.floor(28934 * baseMultiplier),
    bounceRate: 45.2 + (Math.random() - 0.5) * 10,
    avgSessionDuration: 185 + Math.floor((Math.random() - 0.5) * 60),
    
    geoData: [
      { 
        country: "中国", 
        countryCode: "CN", 
        visits: Math.floor(8923 * baseMultiplier), 
        percentage: 56.3 + (Math.random() - 0.5) * 5 
      },
      { 
        country: "俄罗斯", 
        countryCode: "RU", 
        visits: Math.floor(3456 * baseMultiplier), 
        percentage: 21.8 + (Math.random() - 0.5) * 3 
      },
      { 
        country: "美国", 
        countryCode: "US", 
        visits: Math.floor(1789 * baseMultiplier), 
        percentage: 11.3 + (Math.random() - 0.5) * 2 
      },
      { 
        country: "德国", 
        countryCode: "DE", 
        visits: Math.floor(987 * baseMultiplier), 
        percentage: 6.2 + (Math.random() - 0.5) * 1 
      },
      { 
        country: "其他", 
        countryCode: "XX", 
        visits: Math.floor(692 * baseMultiplier), 
        percentage: 4.4 
      },
    ],
    
    deviceData: [
      { device: "桌面端", visits: Math.floor(9508 * baseMultiplier), percentage: 60.0 },
      { device: "移动端", visits: Math.floor(5085 * baseMultiplier), percentage: 32.1 },
      { device: "平板", visits: Math.floor(1254 * baseMultiplier), percentage: 7.9 },
    ],
    
    searchEngineData: [
      { 
        engine: "Google", 
        visits: Math.floor(7823 * baseMultiplier), 
        percentage: 49.4,
        keywords: ["wallpaper adhesive", "墙纸胶", "building materials", "杭州建材"]
      },
      { 
        engine: "Baidu", 
        visits: Math.floor(4567 * baseMultiplier), 
        percentage: 28.8,
        keywords: ["墙纸胶粉", "建材", "杭州建材", "卡恩建材"]
      },
      { 
        engine: "Yandex", 
        visits: Math.floor(2345 * baseMultiplier), 
        percentage: 14.8,
        keywords: ["клей для обоев", "строительные материалы", "обойный клей"]
      },
      { 
        engine: "Bing", 
        visits: Math.floor(1112 * baseMultiplier), 
        percentage: 7.0,
        keywords: ["adhesive powder", "construction materials", "wallpaper glue"]
      },
    ],
    
    pageData: [
      { page: "/", visits: Math.floor(5678 * baseMultiplier), avgLoadTime: 1.2, bounceRate: 35.5 },
      { page: "/products", visits: Math.floor(4234 * baseMultiplier), avgLoadTime: 1.8, bounceRate: 42.1 },
      { page: "/oem", visits: Math.floor(2345 * baseMultiplier), avgLoadTime: 1.5, bounceRate: 38.7 },
      { page: "/about", visits: Math.floor(1789 * baseMultiplier), avgLoadTime: 1.1, bounceRate: 55.2 },
      { page: "/contact", visits: Math.floor(1801 * baseMultiplier), avgLoadTime: 1.3, bounceRate: 28.9 },
    ],
    
    languageData: [
      { language: "中文", code: "zh", visits: Math.floor(9234 * baseMultiplier), percentage: 58.3 },
      { language: "English", code: "en", visits: Math.floor(4567 * baseMultiplier), percentage: 28.8 },
      { language: "Русский", code: "ru", visits: Math.floor(2046 * baseMultiplier), percentage: 12.9 },
    ],
    
    timeSeriesData: Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        visits: Math.floor((Math.random() * 500 + 200) * baseMultiplier / days * 7),
        uniqueVisitors: Math.floor((Math.random() * 300 + 150) * baseMultiplier / days * 7),
        pageViews: Math.floor((Math.random() * 800 + 400) * baseMultiplier / days * 7),
      };
    }),
  };
}