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
    },
    'cms-construction-applications-guide': {
        id: 3,
        slug: 'cms-construction-applications-guide',
        title_zh: '羧甲基淀粉在建筑行业的全面应用指南：从腻子粉到墙纸胶',
        title_en: 'Complete Guide to CMS Applications in Construction: From Putty to Wallpaper Adhesive',
        title_ru: 'Полное руководство по применению КМК в строительстве',
        content_zh: `
            <h2>建筑级羧甲基淀粉（CMS）的核心价值</h2>
            <p>在现代建筑材料工业中，<a href="/zh/products/construction-cms" class="product-link">建筑材料专用羧甲基淀粉 8840</a> 作为一种关键的添加剂，扮演着不可或缺的角色。它不仅能显著提高材料的粘结强度，更在改善施工性能方面效果卓越。</p>

            <h3>1. 腻子粉中的“保水尖兵”</h3>
            <p>内墙腻子粉对保水率有着极高的要求。使用 <a href="/zh/products/construction-cms" class="product-link">8840型建筑级CMS</a> 可以带来以下提升：</p>
            <ul>
                <li><strong>防止开裂：</strong> 通过优异的保水性能，确保腻子在干燥过程中水分不会过快流失，从根本上解决开裂问题。</li>
                <li><strong>提高施工效率：</strong> 增强浆料的爽滑感，使工人批刮时更加省力，提高施工速度。</li>
                <li><strong>防止粉化：</strong> 增强腻子层干燥后的表面强度，防止后期出现脱粉现象。</li>
            </ul>

            <h3>2. 墙纸胶粉的核心原料</h3>
            <p>专业的强力墙纸胶粉主要由高粘度的 CMS 组成。我们的 <a href="/zh/products/wallpaper-adhesive" class="product-link">999型墙纸胶粉专用CMS</a> 粘度高达 65,000 mPa·s，是该领域的顶级选择。</p>
            <blockquote>
                <p><strong>SEO提示：</strong> 墙纸胶粉的质量直接决定了壁纸的寿命。优质的 CMS 不仅要粘度高，还要具备出色的防霉抗菌性能。</p>
            </blockquote>

            <h3>3. 石膏基材料的流变改性</h3>
            <p>在粉刷石膏或石膏勾缝剂中，CMS 可以有效调节石膏的凝结时间，改善流动性，使石膏面层更加细腻平整。</p>

            <h2>总结与建议</h2>
            <p>选择建筑级 CMS 时，应重点关注产品的<strong>纯度、粘度和稳定性</strong>。作为中国领先的羧甲基淀粉制造商，杭州卡恩提供量身定制的 <a href="/zh/oem" class="product-link">OEM服务</a>，可根据您的特定配方需求调整参数。</p>
        `,
        content_en: `
            <h2>Core Value of Construction-Grade Carboxymethyl Starch (CMS)</h2>
            <p><a href="/en/products/construction-cms" class="product-link">Construction Materials CMS 8840</a> is a crucial additive in modern construction, enhancing bonding strength and workability.</p>
            <h3>1. Water Retention in Putty Powder</h3>
            <p>Using <a href="/en/products/construction-cms" class="product-link">Model 8840</a> prevents cracking and improves surface strength.</p>
            <h3>2. Wallpaper Adhesive Expert</h3>
            <p>Our <a href="/en/products/wallpaper-adhesive" class="product-link">999 Wallpaper Adhesive CMS</a> features 65,000 mPa·s viscosity for heavy-duty applications.</p>
        `,
        cover_image: '/images/应用领域/腻子粉.jpg',
        category: 'guide',
        author: 'Technical Team',
        view_count: 320,
        published_at: '2025-12-23T10:00:00Z',
        created_at: '2025-12-23T09:00:00Z',
        seo_title_zh: '建筑级羧甲基淀粉应用指南 - 腻子粉/墙纸胶专用CMS',
        seo_description_zh: '详细介绍8840和999型CMS在建筑腻子、石膏及墙纸胶中的应用优势和技术参数。',
        seo_keywords_zh: '建筑级CMS, 腻子粉添加剂, 墙纸胶粉原料, 8840, 999, 杭州卡恩'
    },
    'k6-textile-printing-revolution': {
        id: 4,
        slug: 'k6-textile-printing-revolution',
        title_zh: 'K6型羧甲基淀粉：纺织印染行业的革命性材料',
        title_en: 'K6 Carboxymethyl Starch: A Revolution in Textile Printing',
        content_zh: `
            <h2>打破传统：K6型CMS替代海藻酸钠</h2>
            <p>长期以来，海藻酸钠一直是活性染料印花的标准糊料。然而，由于原材料价格波动大且供应不稳定，纺织企业急需一种更具性价比的选择。<a href="/zh/products/textile-cms" class="product-link">纺织印染专用羧甲基淀粉 K6</a> 正是为此而生。</p>

            <h3>K6型号的核心技术优势</h3>
            <ul>
                <li><strong>超高粘度稳定性：</strong> 旋转粘度可达 38,000 mPa·s，确保染料在织物上分布极其均匀。</li>
                <li><strong>极色鲜艳度：</strong> 优异的渗透性提高了色牢度，使印花图案色彩更加饱满、细节更清晰。</li>
                <li><strong>易水洗性：</strong> K6 的特殊化学结构使其在后处理过程中极易去除，不残留硬块，保持织物手感。</li>
            </ul>

            <h3>经济效益分析</h3>
            <p>根据纺织客户反馈，使用 <a href="/zh/products/textile-cms" class="product-link">K6型CMS</a> 替代海藻酸钠，在保证同等印花质量的前提下，浆料成本可降低 <strong>20%-40%</strong>。这对于利润微薄的纺织印染企业来说是巨大的竞争优势。</p>

            <h2>为什么选择卡恩新材料？</h2>
            <p>我们专注于 <a href="/zh/products/textile-cms" class="product-link">纺织印染级羧甲基淀粉</a> 的研发。我们的 K6 型号具有极强的耐盐和耐碱性，非常适合各种纤维材质（如棉、麻、丝及化纤）的印花工艺。欢迎联系我们获取免费样品体验选型方案。</p>
        `,
        content_en: `
            <h2>K6 CMS: The Perfect Substitute for Sodium Alginate</h2>
            <p><a href="/en/products/textile-cms" class="product-link">Textile Printing CMS K6</a> offers a cost-effective solution with 38,000 mPa·s viscosity.</p>
            <h3>Advantages</h3>
            <ul>
                <li>High color yield and sharp patterns.</li>
                <li>Excellent salt/alkali resistance.</li>
                <li>Significant cost reduction (20-40%).</li>
            </ul>
        `,
        cover_image: '/images/应用领域/纺织印染.jpg',
        category: 'industry',
        author: 'Technical Team',
        view_count: 180,
        published_at: '2025-12-23T11:00:00Z',
        created_at: '2025-12-23T10:00:00Z',
        seo_title_zh: 'K6型纺织印染增稠剂 - 海藻酸钠最佳替代方案',
        seo_description_zh: 'K6型羧甲基淀粉具有高粘度、易褪色、耐碱等特点，是纺织印染企业的降本利器。',
        seo_keywords_zh: 'K6, 纺织印染级CMS, 印花糊料, 杭州卡恩, 粘度38000'
    },
    'cms-desiccant-gel-technology': {
        id: 5,
        slug: 'cms-desiccant-gel-technology',
        title_zh: '工业干燥剂中的CMS应用：凝胶锁水技术详解',
        title_en: 'CMS in Industrial Desiccants: Gel Water-Locking Technology',
        content_zh: `
            <h2>攻克干燥剂泄漏难题</h2>
            <p>传统的氯化钙干燥剂在吸收大量水分后会液化，变成黄色的水溶液，一旦袋子破损极易污染货物。使用 <a href="/zh/products/desiccant-gel" class="product-link">干燥剂凝胶锁水专用羧甲基淀粉 8820-2</a> 可以从根本上解决这一安全隐患。</p>

            <h3>凝胶锁水原理探秘</h3>
            <p>当水分接触到 <a href="/zh/products/desiccant-gel" class="product-link">8820-2 CMS</a> 与氯化钙的复配材料时，CMS 会迅速吸水膨胀，并将液态水分包裹在分子链中，形成极其稳定的凝胶状态。</p>

            <h3>产品特性与参数</h3>
            <ul>
                <li><strong>超强吸附：</strong> 饱和吸附量可达 250% - 300%。</li>
                <li><strong>物理安全：</strong> 即使在集装箱的高温高湿环境下，凝胶也极度稳定，不会液化。</li>
                <li><strong>配方灵活：</strong> 建议配比为 35% CMS + 65% 氯化钙，可根据需求进行 <a href="/zh/oem" class="product-link">OEM定制</a>。</li>
            </ul>

            <h2>多元应用场景</h2>
            <p>除集装箱外，该技术已广泛应用于家用除湿盒、精密电子产品防潮及高档成衣仓储。杭州卡恩采用优质玉米淀粉为原料，确保产品天然环保、无毒无害。</p>
        `,
        content_en: `
            <h2>Eliminate Desiccant Leakage with CMS Gel Technology</h2>
            <p><a href="/en/products/desiccant-gel" class="product-link">Desiccant Gel CMS 8820-2</a> turns liquid moisture into stable gel.</p>
            <h3>Technical Benefits</h3>
            <ul>
                <li>Strong water-locking performance.</li>
                <li>Stable even under high physical pressure.</li>
                <li>Eco-friendly corn-starch based polymer.</li>
            </ul>
        `,
        cover_image: '/images/应用领域/desiccant_bag_v2.jpg',
        category: 'guide',
        author: 'Technical Team',
        view_count: 95,
        published_at: '2025-12-23T12:00:00Z',
        created_at: '2025-12-23T11:00:00Z',
        seo_title_zh: '干燥剂专用CMS锁水凝胶技术 - 杭州卡恩定制方案',
        seo_description_zh: '了解8820-2型CMS在氯化钙干燥剂中的锁水应用，防止液化泄漏，提升产品安全性。',
        seo_keywords_zh: '干燥剂CMS, 锁水凝胶, 8820-2, 氯化钙除湿, 杭州卡恩'
    },
    'karn-expands-production-2025': {
        id: 6,
        slug: 'karn-expands-production-2025',
        title_zh: '杭州卡恩新材料年产5万吨羧甲基淀粉生产线正式投产',
        title_en: 'Hangzhou Karn Launches 50,000-Ton CMS Production Line',
        title_ru: 'Hangzhou Karn запускает линию производства CMS мощностью 50 000 тонн',
        content_zh: `
            <p>2025年1月，杭州卡恩新材料有限公司全新生产基地正式投入运营。新工厂占地30,000平方米，<strong>年产能达到50,000吨</strong>，较原有产能翻倍，能够更好地满足全球客户的供货需求。</p>

            <p>新工厂引入了德国西门子DCS控制系统，实现了从原料投料到成品包装的全程自动化控制。根据测试数据，产品批次稳定性较之前提升了约40%。</p>

            <h2>主要设备升级</h2>
            <ul>
                <li><strong>自动化反应釜</strong>：10立方米×8台，温度控制精度±0.5℃</li>
                <li><strong>闪蒸干燥系统</strong>：处理能力5吨/小时，出料水分控制在8%以下</li>
                <li><strong>在线粘度监测</strong>：每批产品粘度数据可追溯</li>
                <li><strong>自动包装线</strong>：20kg/25kg袋装，500袋/小时</li>
            </ul>

            <h2>环保投入</h2>
            <p>新工厂在环保设施方面投入超过500万元：</p>
            <ul>
                <li>废水采用厌氧-好氧生化处理工艺，出水达GB8978一级标准</li>
                <li>粉尘回收率超过99%，回收淀粉循环利用</li>
                <li>余热回收系统降低蒸汽消耗20%</li>
            </ul>

            <h2>研发实验室扩建</h2>
            <p>配套的应用技术实验室面积扩展至500平方米，新增Anton Paar流变仪、Brookfield粘度计等检测设备。可为客户提供定制化配方开发服务，从需求确认到样品交付最快7个工作日。</p>

            <p>如需了解更多产品信息或索取样品，请联系我们的销售团队。</p>
        `,
        content_en: `
            <p>In January 2025, Hangzhou Karn New Materials officially launched its new production facility. The 30,000 m² factory has an <strong>annual capacity of 50,000 tons</strong>, doubling our previous output.</p>

            <p>The new facility features Siemens DCS control system for end-to-end automation. Batch stability has improved by approximately 40%.</p>

            <h2>Equipment Upgrades</h2>
            <ul>
                <li><strong>Automated reactors</strong>: 8 units × 10m³, temperature control ±0.5°C</li>
                <li><strong>Flash drying system</strong>: 5 tons/hour, output moisture below 8%</li>
                <li><strong>Online viscosity monitoring</strong>: Full traceability for each batch</li>
                <li><strong>Automatic packaging</strong>: 500 bags/hour</li>
            </ul>

            <h2>Environmental Investment</h2>
            <p>Over 5 million RMB invested in environmental facilities:</p>
            <ul>
                <li>Wastewater treatment meeting GB8978 Class I standards</li>
                <li>Dust recovery rate exceeding 99%</li>
                <li>Heat recovery reducing steam consumption by 20%</li>
            </ul>

            <h2>R&D Lab Expansion</h2>
            <p>Our application lab has expanded to 500 m², equipped with Anton Paar rheometer and Brookfield viscometer. Custom formulation development available with 7-day sample delivery.</p>

            <p>Contact our sales team for product information or samples.</p>
        `,
        cover_image: '/images/factory-view.jpg',
        category: 'news',
        author: 'PR Dept',
        view_count: 560,
        published_at: '2025-12-24T09:00:00Z',
        created_at: '2025-12-24T08:00:00Z',
        seo_title_zh: '卡恩新材料5万吨羧甲基淀粉新工厂投产',
        seo_description_zh: '杭州卡恩新材料2025年新工厂投产，年产5万吨羧甲基淀粉，引入西门子DCS系统，批次稳定性提升40%。',
        seo_keywords_zh: 'CMS生产厂家, 羧甲基淀粉工厂, 卡恩新材料, 扩产新闻'
    },
    'green-building-trends-2026': {
        id: 7,
        slug: 'green-building-trends-2026',
        title_zh: '环保法规收紧，建筑添加剂行业如何应对',
        title_en: 'How Construction Additives Industry Responds to Stricter Environmental Regulations',
        title_ru: 'Как отрасль строительных добавок реагирует на ужесточение экологических норм',
        content_zh: `
            <p>2024年起，住建部发布的《绿色建筑评价标准》对室内装饰材料的VOC排放限值大幅收紧。欧盟REACH法规也在持续更新，对建材原材料的要求愈加严格。</p>

            <p>仍在使用高VOC化学添加剂的建材企业可能面临产品无法通过绿色认证、出口受阻等问题。</p>

            <h2>生物基添加剂的市场机会</h2>
            <p>根据行业报告，全球建筑添加剂市场规模将从2024年的520亿美元增长至2029年的680亿美元，其中生物基添加剂增速最快。</p>

            <h2>CMS与HPMC对比</h2>
            <p>羧甲基淀粉(CMS)相较于传统纤维素醚(HPMC)的主要区别：</p>
            <ul>
                <li><strong>原料来源</strong>：CMS来自天然玉米/木薯淀粉，HPMC来自棉短绒或木浆</li>
                <li><strong>价格</strong>：CMS约8,000-12,000元/吨，HPMC约18,000-25,000元/吨</li>
                <li><strong>VOC释放</strong>：CMS接近零排放</li>
                <li><strong>保水性能</strong>：HPMC略优，但CMS与HPMC复配后效果相当</li>
            </ul>

            <h2>配方建议</h2>
            <p>将CMS与少量HPMC复配使用（约7:3比例），既能保证保水性，又能降低成本，同时满足环保标准。</p>

            <h2>案例参考</h2>
            <p>某腻子粉厂商已完成配方升级，将CMS添加量提升至1.5%，同时减少HPMC用量30%，原材料成本降低约18%，并通过了绿色建材产品认证。</p>

            <p>如需技术支持或样品，请联系我们的销售团队。</p>
        `,
        content_en: `
            <p>Since 2024, China's Green Building Evaluation Standard has tightened VOC emission limits for interior materials. EU REACH regulations continue to update with stricter requirements.</p>

            <p>Companies using high-VOC chemical additives may face certification and export challenges.</p>

            <h2>Market Opportunity for Bio-based Additives</h2>
            <p>The global construction additives market is expected to grow from $52 billion in 2024 to $68 billion by 2029, with bio-based additives showing the fastest growth.</p>

            <h2>CMS vs HPMC Comparison</h2>
            <ul>
                <li><strong>Raw Material</strong>: CMS from natural corn/tapioca starch; HPMC from cotton linter or wood pulp</li>
                <li><strong>Price</strong>: CMS $1,100-1,700/ton; HPMC $2,500-3,500/ton</li>
                <li><strong>VOC Emission</strong>: CMS near zero</li>
                <li><strong>Water Retention</strong>: HPMC slightly better, but CMS+HPMC blend performs equally</li>
            </ul>

            <h2>Formulation Recommendation</h2>
            <p>Blend CMS with HPMC at approximately 7:3 ratio for optimal performance and cost savings.</p>

            <p>Contact our team for technical support or samples.</p>
        `,
        cover_image: '/images/eco_friendly_natural_products_collage.jpg',
        category: 'industry',
        author: 'Market Research',
        view_count: 420,
        published_at: '2025-12-24T10:00:00Z',
        created_at: '2025-12-24T09:00:00Z',
        seo_title_zh: '环保法规与建筑添加剂行业趋势',
        seo_description_zh: '分析环保法规对建筑添加剂行业的影响，对比CMS与HPMC的成本和性能。',
        seo_keywords_zh: '绿色建材, 环保添加剂, CMS, HPMC, 建筑行业'
    },
    'guide-mixing-cms-with-putty': {
        id: 8,
        slug: 'guide-mixing-cms-with-putty',
        title_zh: '如何在腻子粉中正确添加CMS',
        title_en: 'How to Properly Add CMS in Putty Powder',
        title_ru: 'Как правильно добавлять КМК в шпатлевку',
        content_zh: `
            <p>很多建材厂商反馈，即使添加了保水剂，腻子粉还是容易干裂、起粉。常见原因包括：选用了低粘度型号、添加量过低、或者混合时间不够。</p>

            <h2>型号选择</h2>
            <p>腻子粉需要使用高粘度CMS，推荐粘度在30,000 mPa.s以上的型号（如8840型）。</p>

            <h2>添加比例</h2>
            <p>CMS通常与HPMC复配使用，建议配比如下：</p>
            <ul>
                <li><strong>普通内墙腻子</strong>：HPMC 3-4公斤 + CMS 2-3公斤/吨</li>
                <li><strong>粉刷石膏</strong>：HPMC 1.5-2公斤 + CMS 1.5-2公斤/吨</li>
            </ul>

            <h2>投料顺序</h2>
            <ol>
                <li>先投入重钙、灰钙等大宗粉料</li>
                <li>开启搅拌机低速运行</li>
                <li>均匀撒入CMS和HPMC</li>
                <li>最后添加其他助剂</li>
            </ol>

            <h2>混合时间</h2>
            <p>CMS添加量较小，必须确保充分分散。建议干混时间不少于15分钟。混合时间不足是导致腻子起泡、剥落的主要原因。</p>

            <h2>季节调整</h2>
            <ul>
                <li><strong>夏季(>30℃)</strong>：CMS添加量增加0.3-0.5公斤/吨</li>
                <li><strong>冬季(<10℃)</strong>：CMS添加量减少0.2公斤/吨</li>
            </ul>

            <h2>简易检验方法</h2>
            <ul>
                <li><strong>开放时间</strong>：加水搅拌后≥20分钟不结皮</li>
                <li><strong>批刮手感</strong>：顺滑、不粘刀</li>
                <li><strong>干燥后</strong>：无开裂、不起粉</li>
            </ul>

            <p>如需配方支持或样品，请联系我们的技术团队。</p>
        `,
        content_en: `
            <p>Many manufacturers report putty cracking and dusting despite using water retention agents. Common causes include low-viscosity grades, insufficient dosage, or inadequate mixing time.</p>

            <h2>Grade Selection</h2>
            <p>Use high-viscosity CMS with >30,000 mPa.s (such as Model 8840).</p>

            <h2>Recommended Ratio</h2>
            <ul>
                <li><strong>Interior Wall Putty</strong>: HPMC 3-4kg + CMS 2-3kg per ton</li>
                <li><strong>Gypsum Plaster</strong>: HPMC 1.5-2kg + CMS 1.5-2kg per ton</li>
            </ul>

            <h2>Feeding Sequence</h2>
            <ol>
                <li>Add bulk fillers first</li>
                <li>Start mixer at low speed</li>
                <li>Sprinkle CMS and HPMC evenly</li>
                <li>Add other additives last</li>
            </ol>

            <h2>Mixing Time</h2>
            <p>Ensure at least 15 minutes of dry mixing. Insufficient mixing is the main cause of bubbling and peeling.</p>

            <h2>Seasonal Adjustments</h2>
            <ul>
                <li><strong>Summer (>30°C)</strong>: Increase CMS by 0.3-0.5 kg/ton</li>
                <li><strong>Winter (<10°C)</strong>: Decrease CMS by 0.2 kg/ton</li>
            </ul>

            <p>Contact our technical team for formulation support or samples.</p>
        `,
        cover_image: '/images/应用领域/腻子粉.jpg',
        category: 'guide',
        author: 'Technical Support',
        view_count: 890,
        published_at: '2025-12-24T11:00:00Z',
        created_at: '2025-12-24T10:00:00Z',
        seo_title_zh: '腻子粉CMS添加指南',
        seo_description_zh: '如何在腻子粉中正确添加羧甲基淀粉(CMS)，包含型号选择、配比和混合方法。',
        seo_keywords_zh: '腻子粉配方, CMS使用方法, 保水剂, 建筑施工'
    }
};


export async function onRequestGet(context) {
    const { request, params } = context;
    const slug = params.slug;

    try {
        const url = new URL(request.url);
        // Fix: Normalize language code (e.g. zh-CN -> zh, en-US -> en) to match data keys
        const rawLang = url.searchParams.get('lang') || 'en';
        const lang = rawLang.split('-')[0].toLowerCase();

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
            },
            tags: (article[`seo_keywords_${lang}`] || '').split(/,|，/).map(tag => tag.trim()).filter(Boolean)
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
