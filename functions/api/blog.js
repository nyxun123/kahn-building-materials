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
    },
    {
        id: 3,
        slug: 'cms-construction-applications-guide',
        title_zh: '羧甲基淀粉在建筑行业的全面应用指南：从腻子粉到墙纸胶',
        title_en: 'Complete Guide to CMS Applications in Construction: From Putty to Wallpaper Adhesive',
        title_ru: 'Полное руководство по применению КМК в строительстве: от шпатлевки до обойного клея',
        excerpt_zh: '深入解析羧甲基淀粉(CMS)在建筑材料领域的核心应用，包括腻子粉添加剂、石膏缓凝剂、墙纸胶粉等，助您选择最适合的产品型号。',
        excerpt_en: 'In-depth analysis of CMS core applications in construction materials, including putty additives, gypsum retarders, and wallpaper adhesive powder.',
        excerpt_ru: 'Подробный анализ основных применений КМК в строительных материалах, включая добавки для шпатлевки, замедлители схватывания гипса и обойный клей.',
        cover_image: '/images/应用领域/腻子粉.jpg',
        category: 'guide',
        author: 'Technical Team',
        view_count: 320,
        published_at: '2025-12-23T10:00:00Z',
        created_at: '2025-12-23T09:00:00Z'
    },
    {
        id: 4,
        slug: 'k6-textile-printing-revolution',
        title_zh: 'K6型羧甲基淀粉：纺织印染行业的革命性材料',
        title_en: 'K6 Carboxymethyl Starch: Revolutionary Material for Textile Printing Industry',
        title_ru: 'Карбоксиметилкрахмал K6: Революционный материал для текстильной печати',
        excerpt_zh: '详解K6型羧甲基淀粉如何以38000 mPa·s超高粘度和优异性能，成为替代海藻酸钠的最佳选择，帮助纺织企业降本增效。',
        excerpt_en: 'Learn how K6 CMS with 38,000 mPa·s ultra-high viscosity becomes the best alternative to sodium alginate, helping textile companies reduce costs.',
        excerpt_ru: 'Узнайте, как K6 CMS со сверхвысокой вязкостью 38 000 мПа·с становится лучшей альтернативой альгинату натрия.',
        cover_image: '/images/应用领域/纺织印染.jpg',
        category: 'industry',
        author: 'Technical Team',
        view_count: 180,
        published_at: '2025-12-23T11:00:00Z',
        created_at: '2025-12-23T10:00:00Z'
    },
    {
        id: 5,
        slug: 'cms-desiccant-gel-technology',
        title_zh: '工业干燥剂中的CMS应用：凝胶锁水技术详解',
        title_en: 'CMS in Industrial Desiccants: Gel Water-Locking Technology Explained',
        title_ru: 'КМК в промышленных осушителях: технология гелеобразного удержания воды',
        excerpt_zh: '深入了解8820-2型羧甲基淀粉如何与氯化钙复配，形成稳定凝胶状态，彻底解决传统干燥剂液化泄漏问题。',
        excerpt_en: 'Learn how 8820-2 CMS combined with calcium chloride forms a stable gel state, completely solving the liquefaction problem of traditional desiccants.',
        excerpt_ru: 'Узнайте, как 8820-2 КМК в сочетании с хлоридом кальция образует стабильное гелеобразное состояние.',
        cover_image: '/images/应用领域/desiccant_bag_v2.jpg',
        category: 'guide',
        author: 'Technical Team',
        view_count: 95,
        published_at: '2025-12-23T12:00:00Z',
        created_at: '2025-12-23T11:00:00Z'
    },
    {
        id: 6,
        slug: 'karn-expands-production-2025',
        title_zh: '公司新闻：2025年卡恩新材料年产5万吨CMS生产线正式投产',
        title_en: 'Company News: Karn New Materials Commences 50,000-Ton CMS Production Line in 2025',
        title_ru: 'Новости компании: Karn New Materials запускает линию по производству CMS мощностью 50 000 тонн',
        excerpt_zh: '2025年全新生产基地正式投产，引入西门子DCS控制系统，年产能突破5万吨，全球供应链更稳定，批次稳定性提高40%。',
        excerpt_en: 'New production facility with 50,000 tons capacity and Siemens DCS system commences operation in 2025.',
        excerpt_ru: 'Новый завод мощностью 50 000 тонн с системой Siemens DCS введен в эксплуатацию в 2025 году.',
        cover_image: '/images/company/factory_expansion.jpg',
        category: 'news',
        author: 'PR Dept',
        view_count: 560,
        published_at: '2025-12-24T09:00:00Z',
        created_at: '2025-12-24T08:00:00Z'
    },
    {
        id: 7,
        slug: 'green-building-trends-2026',
        title_zh: '行业资讯：环保风暴下，建筑添加剂行业的绿色转型之路',
        title_en: 'Industry News: Green Transition in Construction Additives Amid Environmental Regulations',
        title_ru: 'Новости отрасли: Зеленый переход в добавках для строительства на фоне экологических норм',
        excerpt_zh: '随着环保法规趋严，低VOC、生物基建筑添加剂成趋势。深入解读CMS如何助力建材企业实现绿色转型。',
        excerpt_en: 'With stricter environmental regulations, low-VOC and bio-based additives are trending. Learn how CMS helps in green transition.',
        excerpt_ru: 'В условиях ужесточения экологических норм популярность приобретают добавки с низким содержанием ЛОС и на биологической основе.',
        cover_image: '/images/industry/green_building.jpg',
        category: 'industry',
        author: 'Market Research',
        view_count: 420,
        published_at: '2025-12-24T10:00:00Z',
        created_at: '2025-12-24T09:00:00Z'
    },
    {
        id: 8,
        slug: 'guide-mixing-cms-with-putty',
        title_zh: '使用指南：干货分享！如何正确使用CMS提高腻子粉保水性？',
        title_en: 'User Guide: How to Properly Use CMS to Improve Putty Water Retention',
        title_ru: 'Руководство: Как правильно использовать КМК для улучшения удержания воды в шпатлевке',
        excerpt_zh: '腻子粉保水性差导致干裂？专家教你如何通过科学复配CMS与HPMC，提升施工性能并降低成本。',
        excerpt_en: 'Putty cracking due to poor water retention? Experts guide you on mixing CMS and HPMC for better performance and lower costs.',
        excerpt_ru: 'Шпатлевка трескается из-за плохого удержания воды? Эксперты расскажут, как смешивать КМК и ГПМЦ.',
        cover_image: '/images/guide/mixing_putty.jpg',
        category: 'guide',
        author: 'Technical Support',
        view_count: 890,
        published_at: '2025-12-24T11:00:00Z',
        created_at: '2025-12-24T10:00:00Z'
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
        // Fix: Normalize language code
        const rawLang = url.searchParams.get('lang') || 'en';
        const lang = rawLang.split('-')[0].toLowerCase();

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
