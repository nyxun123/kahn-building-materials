/**
 * 博客文章详情 API (Static Version)
 */

import { handleCorsPreFlight } from '../../lib/cors.js';
import {
    createSuccessResponse,
    createServerErrorResponse,
    createNotFoundResponse
} from '../../lib/api-response.js';

// 静态文章详情数据
const STATIC_ARTICLE_DETAILS = {
    'how-to-choose-cms-products': {
        id: 1,
        slug: 'how-to-choose-cms-products',
        title_zh: 'CMS产品选型指南：如何根据应用场景选择合适的羧甲基淀粉？',
        title_en: 'CMS Product Selection Guide: How to Choose the Right Carboxymethyl Starch?',
        title_ru: 'Руководство по выбору CMS: Как выбрать правильный карбоксиметилкрахмал?',
        content_zh: `
            <h2>为什么选择合适的CMS型号至关重要？</h2>
            <p>羧甲基淀粉（CMS）作为一种多功能的改性淀粉，广泛应用于各行各业。选择错误的型号不仅会影响产品质量，还可能显著增加生产成本。本文将为您详细解析不同应用场景下的最佳选型方案。</p>

            <h3>1. 纺织印染行业：首选 K6 型</h3>
            <p>在纺织印染过程中，对浆料的渗透性和增稠性要求极高。<strong>K6型羧甲基淀粉</strong>是专为该行业研发的明星产品。</p>
            <ul>
                <li><strong>粘度范围：</strong> >400 mPa.s</li>
                <li><strong>替代优势：</strong> 可完全替代海藻酸钠，成本降低30%以上。</li>
                <li><strong>核心特性：</strong> 极佳的成膜性和易退浆性，确保印花图案清晰。</li>
            </ul>

            <h3>2. 建筑材料行业：推荐 8840 型</h3>
            <p>对于腻子粉和石膏基材料，保水性和施工性是关键。<strong>8840型</strong>是建筑行业的标配。</p>
            <ul>
                <li><strong>粘度范围：</strong> >30,000 mPa.s</li>
                <li><strong>核心特性：</strong> 优异的保水性能，有效防止墙面开裂。</li>
                <li><strong>应用建议：</strong> 建议添加量为0.5%-1.0%，可与HPMC复配使用。</li>
            </ul>

            <h3>3. 石油钻井行业：高粘降滤失 999 型</h3>
            <p>在复杂的钻井环境中，泥浆的稳定性决定了工程的安全。<strong>999型</strong>提供卓越的降滤失性能。</p>
            <ul>
                <li><strong>粘度范围：</strong> >3,500 mPa.s</li>
                <li><strong>耐温性：</strong> 可耐受120℃高温。</li>
                <li><strong>抗盐性：</strong> 在饱和盐水中仍能保持良好的流变性。</li>
            </ul>

            <h3>4. 干燥剂与吸湿盒：8820-2 型</h3>
            <p>针对氯化钙干燥剂容易液化泄漏的痛点，<strong>8820-2型</strong>提供了完美的锁水凝胶方案。</p>
            <ul>
                <li><strong>取代度：</strong> 低取代度设计，增强吸水后的凝胶强度。</li>
                <li><strong>吸水倍率：</strong> 可吸收自身重量200倍的水分。</li>
                <li><strong>安全性：</strong> 形成的凝胶坚固，无论如何挤压都不会渗漏。</li>
            </ul>

            <h2>结语</h2>
            <p>杭州卡恩新材料有限公司拥有20年的CMS生产经验，如果您不仅需要优质的产品，还需要专业的技术支持，请随时联系我们的技术团队。</p>
        `,
        content_en: `
            <h2>Why Selecting the Right CMS Model is Crucial?</h2>
            <p>Carboxymethyl Starch (CMS) is a versatile modified starch used across various industries. Choosing the wrong model can affect product quality and significantly increase production costs. This article details the best selection strategies for different scenarios.</p>

            <h3>1. Textile Printing & Dyeing: K6 Model</h3>
            <p>The textile industry demands high penetration and thickening properties. <strong>Model K6</strong> is specifically developed for this sector.</p>
            <ul>
                <li><strong>Viscosity:</strong> >400 mPa.s</li>
                <li><strong>Advantage:</strong> Perfectly replaces sodium alginate, reducing costs by over 30%.</li>
                <li><strong>Key Features:</strong> Excellent film-forming and easy desizing, ensuring clear print patterns.</li>
            </ul>

            <h3>2. Construction Materials: 8840 Model</h3>
            <p>For putty powder and gypsum-based materials, water retention is key. <strong>Model 8840</strong> is the standard for the construction industry.</p>
            <ul>
                <li><strong>Viscosity:</strong> >30,000 mPa.s</li>
                <li><strong>Key Features:</strong> Superior water retention, effectively preventing wall cracking.</li>
                <li><strong>Usage:</strong> Recommended dosage 0.5%-1.0%, compatible with HPMC.</li>
            </ul>

            <h3>3. Oil Drilling: 999 Model</h3>
            <p>In complex drilling environments, mud stability determines safety. <strong>Model 999</strong> offers excellent fluid loss control.</p>
            <ul>
                <li><strong>Viscosity:</strong> >3,500 mPa.s</li>
                <li><strong>Temperature Resistance:</strong> Withstands up to 120℃.</li>
                <li><strong>Salt Resistance:</strong> Maintains good rheology even in saturated brine.</li>
            </ul>

            <h3>4. Desiccants: 8820-2 Model</h3>
            <p>Addressing the leakage issue of calcium chloride desiccants, <strong>Model 8820-2</strong> provides a perfect gel water-locking solution.</p>
            <ul>
                <li><strong>Degree of Substitution:</strong> Low DS design enhances gel strength after absorption.</li>
                <li><strong>Absorption:</strong> Absorbs 200x its weight in water.</li>
                <li><strong>Safety:</strong> Forms a rigid gel that does not leak under pressure.</li>
            </ul>
        `,
        content_ru: `
             <h2>Почему выбор правильной модели CMS так важен?</h2>
             <p>Карбоксиметилкрахмал (CMS) - это универсальный модифицированный крахмал. Выбор неправильной модели может повлиять на качество и увеличить расходы.</p>
             
             <h3>1. Текстильная промышленность: Модель K6</h3>
             <p><strong>Модель K6</strong> - лучшая замена альгинату натрия.</p>
             
             <h3>2. Строительство: Модель 8840</h3>
             <p><strong>Модель 8840</strong> идеально подходит для шпаклевки, предотвращая трещины.</p>
        `,
        cover_image: '/images/应用领域/水性涂料.png',
        category: 'guide',
        author: 'Admin',
        view_count: 1250,
        published_at: '2025-12-20T10:00:00Z',
        created_at: '2025-12-20T09:00:00Z',
        seo_title_zh: 'CMS产品选型指南 - 杭州卡恩新材料',
        seo_description_zh: '专业解析K6、8840、999等CMS型号在纺织、建筑、石油行业的应用区别。',
        seo_keywords_zh: 'CMS选型, 羧甲基淀粉型号, K6, 8840, 999, 8820-2'
    }
};

export async function onRequestGet(context) {
    const { request, params } = context;
    const slug = params.slug;

    try {
        const url = new URL(request.url);
        const lang = url.searchParams.get('lang') || 'en';

        const article = STATIC_ARTICLE_DETAILS[slug];

        if (!article) {
            return createNotFoundResponse({
                message: 'Article not found',
                slug,
                request
            });
        }

        // 构造响应数据
        const responseData = {
            id: article.id,
            slug: article.slug,
            title: article[`title_${lang}`] || article.title_en,
            content: article[`content_${lang}`] || article.content_en,
            excerpt: article[`excerpt_${lang}`] || article.excerpt_en,
            coverImage: article.cover_image,
            category: article.category,
            author: article.author,
            viewCount: article.view_count,
            publishedAt: article.published_at,
            createdAt: article.created_at,
            seo: {
                title: article[`seo_title_${lang}`] || article[`title_${lang}`],
                description: article[`seo_description_${lang}`] || article[`excerpt_${lang}`],
                keywords: article[`seo_keywords_${lang}`] || ''
            }
        };

        return createSuccessResponse({
            data: responseData,
            request
        });

    } catch (error) {
        return createServerErrorResponse({
            message: 'Failed to fetch article details',
            error: error.message,
            request
        });
    }
}

export async function onRequestOptions(context) {
    return handleCorsPreFlight(context.request);
}
