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
        title_zh: '公司新闻：2025年卡恩新材料年产5万吨CMS生产线正式投产',
        title_en: 'Company News: Karn New Materials Commences 50,000-Ton CMS Production Line in 2025',
        title_ru: 'Новости компании: Karn New Materials запускает линию по производству CMS мощностью 50 000 тонн',
        content_zh: `
            <h2>迈向新高度：产能与技术的双重飞跃</h2>
            <p>我们自豪地宣布，杭州卡恩新材料有限公司全新的现代化生产基地已于2025年初正式投入运营。新工厂配备了全自动化的反应釜与干燥系统，标志着我们在<a href="/zh/products" class="product-link">羧甲基淀粉(CMS)</a>制造领域迈上了新的台阶。</p>

            <h3>新工厂亮点</h3>
            <ul>
                <li><strong>产能翻倍：</strong> 年设计产能达到50,000吨，确保为全球客户提供稳定、及时的供货保障。</li>
                <li><strong>质量控制：</strong> 引入了德国西门子DCS控制系统，实现从原料投料到成品包装的全程精准控制，批次稳定性提高40%。</li>
                <li><strong>环保升级：</strong> 配备了先进的污水处理与粉尘回收系统，全面符合ISO14001环境管理体系要求，践行绿色制造承诺。</li>
            </ul>

            <h3>研发中心同步升级</h3>
            <p>与此同时，我们扩建了应用技术实验室，配备了Brookfield粘度计、流变仪等高端检测设备。我们的技术团队现在可以更快速地为客户提供<a href="/zh/oem" class="product-link">定制化配方服务</a>，特别是在纺织印染和石油钻井领域的高端应用开发上。</p>

            <h2>展望未来</h2>
            <p>此次扩产不仅是规模的扩大，更是服务能力的提升。我们将继续秉持"品质第一，客户至上"的理念，致力于成为全球领先的水溶性高分子材料供应商。</p>
        `,
        content_en: `
            <h2>A Leap in Capacity and Technology</h2>
            <p>We are proud to announce that our new state-of-the-art production facility has officially commenced operations in early 2025. This marks a significant milestone in our <a href="/en/products" class="product-link">Carboxymethyl Starch (CMS)</a> manufacturing capabilities.</p>
            <h3>Highlights</h3>
            <ul>
                <li><strong>50,000 Tons Capacity:</strong> Ensuring stable supply for global customers.</li>
                <li><strong>Advanced Quality Control:</strong> Siemens DCS system ensures 40% higher batch stability.</li>
                <li><strong>Green Manufacturing:</strong> Fully compliant with ISO14001 standards.</li>
            </ul>
        `,
        cover_image: '/images/company/factory_expansion.jpg',
        category: 'news',
        author: 'PR Dept',
        view_count: 560,
        published_at: '2025-12-24T09:00:00Z',
        created_at: '2025-12-24T08:00:00Z',
        seo_title_zh: '卡恩新材料5万吨CMS新工厂投产 - 公司新闻',
        seo_description_zh: '杭州卡恩新材料2025年新工厂正式投产，年产5万吨羧甲基淀粉，引入自动化控制系统，提升产品质量与供货稳定性。',
        seo_keywords_zh: 'CMS生产厂家, 卡恩新材料, 羧甲基淀粉工厂, 5万吨产能, 扩产新闻'
    },
    'green-building-trends-2026': {
        id: 7,
        slug: 'green-building-trends-2026',
        title_zh: '行业资讯：环保风暴下，建筑添加剂行业的绿色转型之路',
        title_en: 'Industry News: Green Transition in Construction Additives Amid Environmental Regulations',
        title_ru: 'Новости отрасли: Зеленый переход в добавках для строительства',
        content_zh: `
            <h2>环保法规趋严，建材行业面临新挑战</h2>
            <p>随着全球对建筑材料VOC（挥发性有机化合物）排放标准的日益严格，传统化学添加剂正面临淘汰风险。以淀粉醚为代表的天然改性材料，因其可再生、可降解的特性，正成为行业新宠。</p>

            <h3>羧甲基淀粉(CMS)的环保优势</h3>
            <p>与传统的纤维素醚相比，<a href="/zh/products/construction-cms" class="product-link">建筑级CMS</a> 在环保性能上具有天然优势：</p>
            <ul>
                <li><strong>源于自然：</strong> 主要原料为天然玉米淀粉，碳足迹远低于石油基产品。</li>
                <li><strong>无毒无害：</strong> 生产过程无有害副产物，最终产品安全无气味，非常适合用于家庭装修的腻子粉和墙纸胶。</li>
                <li><strong>性价比高：</strong> 在保证保水性和增稠效果的前提下，成本更具竞争力。</li>
            </ul>

            <h3>市场趋势预测</h3>
            <p>根据最新行业报告，预计到2026年，生物基建筑添加剂的市场份额将增长30%。对于建材生产商而言，尽早引入<a href="/zh/products/construction-cms" class="product-link">高品质CMS</a> 优化配方，不仅是应对环保检查的需要，更是抢占绿色建筑市场的关键策略。</p>
        `,
        content_en: `
            <h2>Green Transition in Construction Materials</h2>
            <p>With stricter VOC regulations, natural modified materials like <a href="/en/products/construction-cms" class="product-link">CMS</a> are gaining popularity.</p>
            <h3>Eco-friendly Advantages</h3>
            <ul>
                <li><strong>Natural Origin:</strong> Made from corn starch, low carbon footprint.</li>
                <li><strong>Non-toxic:</strong> Safe for indoor use in putty and adhesives.</li>
                <li><strong>Cost-effective:</strong> Competitive pricing with excellent performance.</li>
            </ul>
        `,
        cover_image: '/images/industry/green_building.jpg',
        category: 'industry',
        author: 'Market Research',
        view_count: 420,
        published_at: '2025-12-24T10:00:00Z',
        created_at: '2025-12-24T09:00:00Z',
        seo_title_zh: '2026建筑添加剂行业趋势 - 环保CMS的应用前景',
        seo_description_zh: '探讨环保法规下建筑添加剂的绿色转型，分析羧甲基淀粉(CMS)作为生物基材料在低VOC建材中的应用优势。',
        seo_keywords_zh: '绿色建材, 环保添加剂, CMS优势, 建筑行业趋势, 生物基材料'
    },
    'guide-mixing-cms-with-putty': {
        id: 8,
        slug: 'guide-mixing-cms-with-putty',
        title_zh: '使用指南：干货分享！如何正确使用CMS提高腻子粉保水性？',
        title_en: 'User Guide: How to Properly Use CMS to Improve Putty Water Retention',
        title_ru: 'Руководство: Как правильно использовать КМК для улучшения шпатлевки',
        content_zh: `
            <h2>为什么你的腻子粉容易干裂？</h2>
            <p>很多客户反馈，即使使用了添加剂，腻子粉在施工时仍然容易干得太快，甚至后期出现裂纹。这往往是因为<strong>保水剂的选择或配比不当</strong>。</p>

            <h3>正确使用CMS的三个关键步骤</h3>
            
            <h4>1. 选择合适的型号</h4>
            <p>并不是所有的CMS都适合做腻子。必须选择粘度在30,000 mPa.s以上的高取代度产品，如我们的 <a href="/zh/products/construction-cms" class="product-link">8840型</a>，才能保证足够的保水率。</p>

            <h4>2. 科学的复配比例</h4>
            <p>CMS很少单独使用，通常与HPMC（羟丙基甲基纤维素）复配效果最佳。推荐配方：</p>
            <div class="bg-gray-50 p-4 rounded-lg my-4">
                <ul class="list-disc pl-5">
                    <li><strong>内墙腻子：</strong> HPMC (3-4公斤) + <a href="/zh/products/construction-cms" class="product-link">CMS 8840</a> (2-3公斤) / 吨</li>
                    <li><strong>粉刷石膏：</strong> HPMC (1.5公斤) + CMS 8840 (1.5公斤) / 吨</li>
                </ul>
            </div>
            <p><em>注意：具体比例需根据当地气温和原料进行微调。</em></p>

            <h4>3. 充分的干混时间</h4>
            <p>由于CMS添加量较小，必须确保在干粉混合机中搅拌足够的时间（通常建议15-20分钟），以保证分散均匀。局部浓度过高可能导致起泡或剥落。</p>

            <blockquote>
                <p><strong>专家提示：</strong> 在夏季高温施工环境下，可适当增加 <a href="/zh/products/construction-cms" class="product-link">CMS</a> 的添加量0.5公斤/吨，以延长开放时间。</p>
            </blockquote>
        `,
        content_en: `
            <h2>Why Does Your Putty Crack?</h2>
            <p>Poor water retention is the main culprit. Using <a href="/en/products/construction-cms" class="product-link">Model 8840 CMS</a> correctly can solve this.</p>
            <h3>Key Steps</h3>
            <h4>1. Choose High Viscosity</h4>
            <p>Select CMS with >30,000 mPa.s viscosity for optimal water retention.</p>
            <h4>2. Recommended Ratio</h4>
            <p>Mix HPMC (3-4kg) + <a href="/en/products/construction-cms" class="product-link">CMS 8840</a> (2-3kg) per ton for interior putty.</p>
            <h4>3. Mixing Time</h4>
            <p>Ensure 15-20 minutes of dry mixing to prevent local concentration issues.</p>
        `,
        cover_image: '/images/guide/mixing_putty.jpg',
        category: 'guide',
        author: 'Technical Support',
        view_count: 890,
        published_at: '2025-12-24T11:00:00Z',
        created_at: '2025-12-24T10:00:00Z',
        seo_title_zh: '腻子粉CMS添加配方指南 - 提高保水性防开裂',
        seo_description_zh: '详细教程：如何在腻子粉生产中正确添加羧甲基淀粉(CMS)，包含最佳复配比例和施工建议，解决干裂问题。',
        seo_keywords_zh: '腻子粉配方, CMS使用方法, 保水剂配比, 8840使用指南, 建筑施工技巧'
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
