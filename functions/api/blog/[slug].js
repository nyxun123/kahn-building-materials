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
        title_zh: '重磅！杭州卡恩年产5万吨羧甲基淀粉新生产线正式投产',
        title_en: 'Breaking: Hangzhou Karn Launches 50,000-Ton Annual CMS Production Line',
        title_ru: 'Новости: Hangzhou Karn запускает линию производства CMS мощностью 50 000 тонн',
        content_zh: `
            <div class="article-hero" style="background: linear-gradient(135deg, #064E3B 0%, #047857 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: white; margin-bottom: 0.5rem;">🏭 产能实现历史性突破</h2>
                <p style="font-size: 1.25rem; margin: 0;">年产能从25,000吨跃升至<strong>50,000吨</strong>，满足全球客户的稳定供货需求</p>
            </div>

            <p>2025年1月，<a href="/zh/about" class="product-link">杭州卡恩新材料有限公司</a>全新现代化生产基地正式投入运营。这座占地30,000平方米的智能化工厂，标志着我们在<a href="/zh/products" class="product-link">羧甲基淀粉(CMS)</a>制造领域迈上了全新的台阶。</p>

            <figure style="margin: 2rem 0;">
                <img src="/images/factory-view.jpg" alt="卡恩新材料现代化生产基地全景" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem; font-size: 0.9rem;">卡恩新材料智能化生产基地全景</figcaption>
            </figure>

            <h2>📊 核心数据一览</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">50,000</div>
                    <div style="color: #065F46;">吨/年设计产能</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">40%</div>
                    <div style="color: #065F46;">批次稳定性提升</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">30+</div>
                    <div style="color: #065F46;">出口国家和地区</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">ISO14001</div>
                    <div style="color: #065F46;">环境管理认证</div>
                </div>
            </div>

            <h2>🔧 智能制造系统升级</h2>
            <p>新工厂引入了<strong>德国西门子SIMATIC PCS 7 DCS控制系统</strong>，实现了从原料投料到成品包装的全程数字化精准控制。</p>

            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="background: #064E3B; color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">升级项目</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">技术规格</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">客户价值</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>自动化反应釜</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">10m³ x 8台，温度控制精度±0.5℃</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">产品取代度均一，批次差异≤2%</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>闪蒸干燥系统</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">处理能力5吨/小时，出料水分≤8%</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">产品储存稳定性大幅提升</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>在线粘度监测</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Brookfield实时监测，数据上传MES</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">每批产品粘度可追溯，质量有保障</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>自动包装线</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">20kg/25kg袋，500袋/小时</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">缩短交货周期，保证供货及时性</td>
                    </tr>
                </tbody>
            </table>

            <figure style="margin: 2rem 0;">
                <img src="/images/laboratory_quality_control_testing.jpg" alt="卡恩质检实验室" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem; font-size: 0.9rem;">配备先进检测设备的质量控制实验室</figcaption>
            </figure>

            <h2>🌿 绿色制造承诺</h2>
            <p>作为负责任的企业公民，我们在新工厂中投入超过<strong>500万元</strong>用于环保设施建设：</p>
            <ul>
                <li><strong>废水处理：</strong>采用厌氧-好氧生化处理工艺，出水达GB8978一级标准</li>
                <li><strong>粉尘回收：</strong>旋风+布袋除尘，回收率＞99%，回收淀粉循环利用</li>
                <li><strong>能源优化：</strong>余热回收系统降低蒸汽消耗20%，年节约标煤800吨</li>
            </ul>

            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
                <strong>🎯 对客户的意义：</strong> 选择卡恩，意味着选择了符合欧盟REACH法规和碳中和趋势的供应商，助力您的产品进入更多高端市场。
            </div>

            <h2>🔬 研发实力同步升级</h2>
            <p>扩建后的应用技术实验室面积达到<strong>500平方米</strong>，新增设备包括：</p>
            <ul>
                <li>Anton Paar MCR 302流变仪 —— 精准测量剪切粘度曲线</li>
                <li>Brookfield DV2T粘度计 —— 快速质检，15分钟出结果</li>
                <li>水分活度仪、激光粒度仪 —— 全面表征产品性能</li>
            </ul>
            <p>我们现在能够为客户提供更快速的<a href="/zh/oem" class="product-link">定制化配方开发服务</a>，从需求确认到样品交付最快仅需<strong>7个工作日</strong>。</p>

            <h2>📞 联系我们</h2>
            <p>无论您需要<a href="/zh/products/construction-cms" class="product-link">建筑级CMS</a>、<a href="/zh/products/textile-cms" class="product-link">纺织印染级K6</a>还是<a href="/zh/products/desiccant-gel" class="product-link">干燥剂专用8820-2</a>，我们的销售团队随时准备为您提供报价和技术支持。</p>
            <p>📧 邮箱：karnstarch@gmail.com<br/>📱 手机/WhatsApp：+86 13216156841</p>
        `,
        content_en: `
            <div class="article-hero" style="background: linear-gradient(135deg, #064E3B 0%, #047857 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: white; margin-bottom: 0.5rem;">🏭 Historic Capacity Breakthrough</h2>
                <p style="font-size: 1.25rem; margin: 0;">Annual capacity jumps from 25,000 to <strong>50,000 tons</strong>, ensuring stable supply for global clients</p>
            </div>

            <p>In January 2025, <a href="/en/about" class="product-link">Hangzhou Karn New Materials Co., Ltd.</a> officially launched its new state-of-the-art production facility. This 30,000 m² smart factory marks a major milestone in our <a href="/en/products" class="product-link">Carboxymethyl Starch (CMS)</a> manufacturing capabilities.</p>

            <figure style="margin: 2rem 0;">
                <img src="/images/factory-view.jpg" alt="Karn New Materials Modern Production Base" style="width: 100%; border-radius: 8px;" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem;">Karn's intelligent manufacturing facility panorama</figcaption>
            </figure>

            <h2>📊 Key Figures</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">50,000</div>
                    <div style="color: #065F46;">Tons/Year Capacity</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">40%</div>
                    <div style="color: #065F46;">Better Batch Stability</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #10B981;">
                    <div style="font-size: 2rem; font-weight: bold; color: #047857;">30+</div>
                    <div style="color: #065F46;">Export Countries</div>
                </div>
            </div>

            <h2>🔧 Smart Manufacturing Upgrades</h2>
            <p>The new facility features <strong>Siemens SIMATIC PCS 7 DCS</strong> for end-to-end digital process control.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                <thead>
                    <tr style="background: #064E3B; color: white;">
                        <th style="padding: 12px; text-align: left;">Upgrade</th>
                        <th style="padding: 12px; text-align: left;">Specifications</th>
                        <th style="padding: 12px; text-align: left;">Customer Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px;"><strong>Automated Reactors</strong></td>
                        <td style="padding: 12px;">8 x 10m³, temp control ±0.5℃</td>
                        <td style="padding: 12px;">Batch variance ≤2%</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px;"><strong>Flash Drying</strong></td>
                        <td style="padding: 12px;">5 tons/hr, moisture ≤8%</td>
                        <td style="padding: 12px;">Extended shelf life</td>
                    </tr>
                </tbody>
            </table>

            <h2>📞 Contact Us</h2>
            <p>Whether you need <a href="/en/products/construction-cms" class="product-link">Construction CMS</a>, <a href="/en/products/textile-cms" class="product-link">Textile K6</a>, or <a href="/en/products/desiccant-gel" class="product-link">Desiccant 8820-2</a>, our team is ready to assist.</p>
            <p>📧 Email: karnstarch@gmail.com<br/>📱 WhatsApp: +86 13216156841</p>
        `,
        cover_image: '/images/factory-view.jpg',
        category: 'news',
        author: 'PR Dept',
        view_count: 560,
        published_at: '2025-12-24T09:00:00Z',
        created_at: '2025-12-24T08:00:00Z',
        seo_title_zh: '卡恩新材料5万吨羧甲基淀粉新工厂投产 - 公司新闻',
        seo_description_zh: '2025年杭州卡恩新材料5万吨CMS工厂正式投产，引入西门子DCS系统，批次稳定性提升40%，满足全球30+国家客户需求。',
        seo_keywords_zh: 'CMS生产厂家, 羧甲基淀粉工厂, 5万吨产能, 卡恩新材料, 智能制造, 扩产新闻'
    },
    'green-building-trends-2026': {
        id: 7,
        slug: 'green-building-trends-2026',
        title_zh: '深度解读：2026年建筑添加剂行业绑定环保法规，CMS迎来爆发式增长',
        title_en: 'In-Depth: Construction Additives Industry Bound by Green Regulations in 2026, CMS to See Explosive Growth',
        title_ru: 'Глубокий анализ: строительные добавки и экологические нормы в 2026 году',
        content_zh: `
            <div class="article-hero" style="background: linear-gradient(135deg, #065F46 0%, #10B981 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: white; margin-bottom: 0.5rem;">🌿 绿色建材时代已来</h2>
                <p style="font-size: 1.25rem; margin: 0;">预计2026年生物基建筑添加剂市场规模将增长<strong>30%</strong>，低VOC材料成为刚需</p>
            </div>

            <h2>一、政策背景：环保法规全面收紧</h2>
            <p>2024年起，中国住建部发布的《绿色建筑评价标准》(GB/T 50378-2024)对室内装饰材料的VOC（挥发性有机化合物）排放限值进行了大幅收紧。欧盟的REACH法规也在持续更新，对建材原材料的生态毒性要求愈加严格。</p>

            <figure style="margin: 2rem 0;">
                <img src="/images/eco_friendly_natural_products_collage.jpg" alt="环保生物基建材产品" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem; font-size: 0.9rem;">可持续发展理念正在重塑建材行业</figcaption>
            </figure>

            <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
                <strong>⚠️ 风险预警：</strong> 仍在使用高VOC化学添加剂的建材企业可能面临以下问题：
                <ul style="margin: 0.5rem 0 0 1rem;">
                    <li>产品无法通过绿色建筑认证</li>
                    <li>出口欧美市场受阻</li>
                    <li>政府采购项目失去竞标资格</li>
                </ul>
            </div>

            <h2>二、市场数据：生物基添加剂需求激增</h2>
            <p>根据MarketsandMarkets最新报告，全球建筑添加剂市场规模将从2024年的<strong>520亿美元</strong>增长至2029年的<strong>680亿美元</strong>，其中生物基添加剂增速最快。</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: #047857;">30%</div>
                    <div style="color: #065F46; font-size: 0.9rem;">生物基添加剂年增长率</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: #047857;">65%</div>
                    <div style="color: #065F46; font-size: 0.9rem;">企业计划2026年前转型</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: #047857;">40%</div>
                    <div style="color: #065F46; font-size: 0.9rem;">成本节约潜力（对比HPMC）</div>
                </div>
            </div>

            <h2>三、技术解析：为什么CMS是最佳选择？</h2>
            <p><a href="/zh/products/construction-cms" class="product-link">建筑级羧甲基淀粉(CMS)</a>相较于传统纤维素醚（如HPMC、MC）具有多重优势：</p>

            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="background: #064E3B; color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">对比维度</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">CMS (羧甲基淀粉)</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">HPMC (纤维素醚)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>原料来源</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd; color: #047857;">✅ 天然玉米/木薯淀粉</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">棉短绒/木浆（部分化学处理）</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>碳足迹</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd; color: #047857;">✅ 低（可再生资源）</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">中等</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>VOC释放</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd; color: #047857;">✅ 接近零</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">极低</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>价格（2024Q4）</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd; color: #047857;">✅ ¥8,000-12,000/吨</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">¥18,000-25,000/吨</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>保水性能</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">优秀（需复配）</td>
                        <td style="padding: 12px; border: 1px solid #ddd; color: #047857;">✅ 卓越</td>
                    </tr>
                </tbody>
            </table>

            <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
                <strong>💡 配方建议：</strong> 将<a href="/zh/products/construction-cms" class="product-link">8840型CMS</a>与少量HPMC复配使用（7:3比例），既能保证保水性，又能大幅降低成本，同时满足最严格的环保标准。
            </div>

            <figure style="margin: 2rem 0;">
                <img src="/images/应用领域/腻子粉.jpg" alt="腻子粉施工现场" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem; font-size: 0.9rem;">CMS在腻子粉中的应用可显著改善施工性能</figcaption>
            </figure>

            <h2>四、成功案例：领先企业已在行动</h2>
            <p>某头部腻子粉品牌（年产能50万吨）已于2024年完成配方升级，将<a href="/zh/products/construction-cms" class="product-link">建筑级CMS</a>添加量从0%提升至1.5%，同时减少HPMC用量30%。效果：</p>
            <ul>
                <li>✅ 原材料成本降低<strong>18%</strong></li>
                <li>✅ 顺利通过《绿色建材产品认证》</li>
                <li>✅ 获得多个政府保障房项目订单</li>
            </ul>

            <h2>五、行动建议：抢占先机</h2>
            <p>对于建材生产商，我们建议：</p>
            <ol>
                <li><strong>立即测试：</strong><a href="/zh/contact" class="product-link">联系卡恩技术团队</a>获取免费样品</li>
                <li><strong>小批量试产：</strong>验证CMS在现有配方中的兼容性</li>
                <li><strong>逐步替代：</strong>分阶段将CMS添加量从0.5%提升至1.5%</li>
            </ol>

            <div style="background: linear-gradient(135deg, #064E3B 0%, #047857 100%); color: white; padding: 2rem; border-radius: 12px; margin-top: 2rem; text-align: center;">
                <h3 style="color: white; margin-bottom: 1rem;">🚀 提前布局，赢在2026</h3>
                <p style="margin-bottom: 1rem;">杭州卡恩新材料 —— 您的绿色建材转型合作伙伴</p>
                <p style="font-size: 1.1rem;">📧 karnstarch@gmail.com | 📱 +86 13216156841</p>
            </div>
        `,
        content_en: `
            <div class="article-hero" style="background: linear-gradient(135deg, #065F46 0%, #10B981 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: white; margin-bottom: 0.5rem;">🌿 The Era of Green Construction is Here</h2>
                <p style="font-size: 1.25rem; margin: 0;">Bio-based construction additives market expected to grow <strong>30%</strong> by 2026</p>
            </div>

            <h2>1. Regulatory Background</h2>
            <p>New VOC emission standards from China's Ministry of Housing and the EU's REACH regulations are reshaping the construction additives market.</p>

            <figure style="margin: 2rem 0;">
                <img src="/images/eco_friendly_natural_products_collage.jpg" alt="Eco-friendly bio-based construction materials" style="width: 100%; border-radius: 8px;" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem;">Sustainability is reshaping the building materials industry</figcaption>
            </figure>

            <h2>2. Market Data</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: #047857;">30%</div>
                    <div style="color: #065F46;">Bio-based growth rate</div>
                </div>
                <div style="background: #ECFDF5; padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: #047857;">40%</div>
                    <div style="color: #065F46;">Cost savings vs HPMC</div>
                </div>
            </div>

            <h2>3. Why Choose CMS?</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                <thead>
                    <tr style="background: #064E3B; color: white;">
                        <th style="padding: 12px;">Comparison</th>
                        <th style="padding: 12px;">CMS</th>
                        <th style="padding: 12px;">HPMC</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px;"><strong>Raw Material</strong></td>
                        <td style="padding: 12px; color: #047857;">✅ Natural corn/tapioca starch</td>
                        <td style="padding: 12px;">Cotton linter/wood pulp</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px;"><strong>Price (2024 Q4)</strong></td>
                        <td style="padding: 12px; color: #047857;">✅ $1,100-1,700/ton</td>
                        <td style="padding: 12px;">$2,500-3,500/ton</td>
                    </tr>
                </tbody>
            </table>

            <h2>4. Take Action Now</h2>
            <p>Contact <a href="/en/contact" class="product-link">Karn's technical team</a> for free samples and formulation support.</p>
        `,
        cover_image: '/images/eco_friendly_natural_products_collage.jpg',
        category: 'industry',
        author: 'Market Research',
        view_count: 420,
        published_at: '2025-12-24T10:00:00Z',
        created_at: '2025-12-24T09:00:00Z',
        seo_title_zh: '2026建筑添加剂绿色转型趋势 - 羧甲基淀粉CMS市场分析',
        seo_description_zh: '深度分析环保法规对建筑添加剂行业的影响，对比CMS与HPMC的成本和性能，提供2026年绿色建材转型策略建议。',
        seo_keywords_zh: '绿色建材, 环保添加剂, CMS vs HPMC, 建筑行业趋势, 生物基材料, VOC法规, 低碳建材'
    },
    'guide-mixing-cms-with-putty': {
        id: 8,
        slug: 'guide-mixing-cms-with-putty',
        title_zh: '实战教程：5步掌握CMS在腻子粉中的正确添加方法，解决干裂起粉难题',
        title_en: 'Practical Guide: 5 Steps to Master CMS Addition in Putty Powder',
        title_ru: 'Практическое руководство: 5 шагов по добавлению КМК в шпатлевку',
        content_zh: `
            <div class="article-hero" style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: white; margin-bottom: 0.5rem;">🔧 腻子粉配方优化实战指南</h2>
                <p style="font-size: 1.25rem; margin: 0;">正确使用CMS，让您的腻子粉<strong>保水性提升40%</strong>，干裂问题不再！</p>
            </div>

            <h2>为什么你的腻子总是开裂？</h2>
            <p>很多建材厂商向我们反馈：明明添加了保水剂，腻子粉还是容易干裂、起粉。经过技术分析，我们发现问题往往出在以下几个环节：</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: #FEF2F2; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #EF4444;">
                    <strong style="color: #B91C1C;">❌ 常见错误1</strong>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem;">选用了低粘度型号，无法有效锁水</p>
                </div>
                <div style="background: #FEF2F2; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #EF4444;">
                    <strong style="color: #B91C1C;">❌ 常见错误2</strong>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem;">添加量过低（低于0.3%），效果不明显</p>
                </div>
                <div style="background: #FEF2F2; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #EF4444;">
                    <strong style="color: #B91C1C;">❌ 常见错误3</strong>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem;">混合时间不足，CMS未充分分散</p>
                </div>
            </div>

            <figure style="margin: 2rem 0;">
                <img src="/images/应用领域/腻子粉.jpg" alt="腻子粉批刮施工" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem; font-size: 0.9rem;">正确的配方让腻子批刮更顺滑，干燥后不开裂</figcaption>
            </figure>

            <h2>5步配方优化法</h2>

            <!-- Step 1 -->
            <div style="background: white; border: 2px solid #10B981; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="background: #10B981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 1rem;">1</div>
                    <h3 style="margin: 0; color: #065F46;">选对型号：粘度≥30,000 mPa.s</h3>
                </div>
                <p>腻子粉对保水性要求极高，必须选择<strong>高粘度、高取代度</strong>的CMS。我们推荐使用<a href="/zh/products/construction-cms" class="product-link">8840型建筑级CMS</a>，其粘度可达30,000-50,000 mPa.s。</p>
                <div style="background: #ECFDF5; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <strong>📌 型号选择速查：</strong>
                    <ul style="margin: 0.5rem 0 0 1rem;">
                        <li>内墙腻子 → 8840型（粘度30,000+）</li>
                        <li>外墙腻子 → 8840型 + 抗裂纤维</li>
                        <li>石膏基产品 → 8840型（添加量可稍低）</li>
                    </ul>
                </div>
            </div>

            <!-- Step 2 -->
            <div style="background: white; border: 2px solid #10B981; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="background: #10B981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 1rem;">2</div>
                    <h3 style="margin: 0; color: #065F46;">科学复配：CMS + HPMC黄金比例</h3>
                </div>
                <p>CMS很少单独使用，与HPMC（羟丙基甲基纤维素）复配可发挥最佳效果，且成本更优。</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem;">
                    <thead>
                        <tr style="background: #064E3B; color: white;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">腻子类型</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">HPMC (kg/吨)</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">CMS 8840 (kg/吨)</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">预估成本节约</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;">普通内墙腻子</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">3-4</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">2-3</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #047857;"><strong>15-20%</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">耐水腻子</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">4-5</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">2-3</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #047857;"><strong>12-15%</strong></td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;">粉刷石膏</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">1.5-2</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">1.5-2</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #047857;"><strong>18-22%</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Step 3 -->
            <div style="background: white; border: 2px solid #10B981; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="background: #10B981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 1rem;">3</div>
                    <h3 style="margin: 0; color: #065F46;">投料顺序：先粉料后胶粉</h3>
                </div>
                <p>正确的投料顺序可以避免CMS结块：</p>
                <ol>
                    <li>先投入重钙、灰�ite等大宗粉料</li>
                    <li>开启搅拌机低速运行</li>
                    <li>均匀撒入CMS和HPMC</li>
                    <li>最后添加其他功能助剂</li>
                </ol>
            </div>

            <!-- Step 4 -->
            <div style="background: white; border: 2px solid #10B981; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="background: #10B981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 1rem;">4</div>
                    <h3 style="margin: 0; color: #065F46;">充分混合：15-20分钟是关键</h3>
                </div>
                <p>由于<a href="/zh/products/construction-cms" class="product-link">CMS</a>添加量较小（仅占总配方0.2-0.5%），必须确保充分分散：</p>
                <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem 1.5rem; margin: 1rem 0; border-radius: 0 8px 8px 0;">
                    <strong>⚠️ 重要提示：</strong> 混合时间不足是导致腻子起泡、剥落的主要原因！建议干混时间不少于15分钟，使用双轴桨叶混合机效果最佳。
                </div>
            </div>

            <!-- Step 5 -->
            <div style="background: white; border: 2px solid #10B981; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="background: #10B981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 1rem;">5</div>
                    <h3 style="margin: 0; color: #065F46;">季节调整：夏季增量，冬季减量</h3>
                </div>
                <p>环境温度会影响腻子的开放时间：</p>
                <ul>
                    <li><strong>夏季（>30℃）：</strong>CMS添加量增加0.3-0.5 kg/吨，延长开放时间</li>
                    <li><strong>冬季（<10℃）：</strong>CMS添加量减少0.2 kg/吨，避免凝结过慢</li>
                    <li><strong>高湿度环境：</strong>考虑使用<a href="/zh/products/construction-cms" class="product-link">耐水型CMS</a></li>
                </ul>
            </div>

            <h2>配方效果验证</h2>
            <p>使用以下简易测试验证您的配方是否合格：</p>
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="background: #064E3B; color: white;">
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">测试项目</th>
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">合格标准</th>
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">测试方法</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 10px; border: 1px solid #ddd;">开放时间</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">≥20分钟 (25℃)</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">加水搅拌后计时至表面结皮</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">批刮手感</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">顺滑、不粘刀</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">工人实际批刮反馈</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 10px; border: 1px solid #ddd;">干燥后表面</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">无开裂、不起粉</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">24小时后检查，用手擦拭</td>
                    </tr>
                </tbody>
            </table>

            <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 2rem; border-radius: 12px; margin-top: 2rem; text-align: center;">
                <h3 style="color: white; margin-bottom: 1rem;">🎁 获取免费配方优化服务</h3>
                <p style="margin-bottom: 1rem;">卡恩技术团队可为您提供1对1配方诊断，帮您找到最优添加方案</p>
                <p style="font-size: 1.1rem;">📧 karnstarch@gmail.com | 📱 +86 13216156841</p>
            </div>
        `,
        content_en: `
            <div class="article-hero" style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: white; margin-bottom: 0.5rem;">🔧 Putty Formulation Optimization Guide</h2>
                <p style="font-size: 1.25rem; margin: 0;">Proper CMS usage can <strong>improve water retention by 40%</strong></p>
            </div>

            <h2>Why Does Your Putty Crack?</h2>
            <p>Common issues include using low-viscosity grades, insufficient dosage, and inadequate mixing time.</p>

            <figure style="margin: 2rem 0;">
                <img src="/images/应用领域/腻子粉.jpg" alt="Putty application" style="width: 100%; border-radius: 8px;" />
                <figcaption style="text-align: center; color: #666; margin-top: 0.5rem;">Proper formulation ensures smooth application and crack-free drying</figcaption>
            </figure>

            <h2>5-Step Optimization Method</h2>

            <h3>Step 1: Choose High Viscosity (≥30,000 mPa.s)</h3>
            <p>Use <a href="/en/products/construction-cms" class="product-link">Model 8840 Construction CMS</a> with 30,000-50,000 mPa.s viscosity.</p>

            <h3>Step 2: Golden Ratio with HPMC</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                <thead>
                    <tr style="background: #064E3B; color: white;">
                        <th style="padding: 10px;">Putty Type</th>
                        <th style="padding: 10px;">HPMC (kg/ton)</th>
                        <th style="padding: 10px;">CMS 8840 (kg/ton)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 10px;">Interior Wall</td>
                        <td style="padding: 10px;">3-4</td>
                        <td style="padding: 10px;">2-3</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">Gypsum Plaster</td>
                        <td style="padding: 10px;">1.5-2</td>
                        <td style="padding: 10px;">1.5-2</td>
                    </tr>
                </tbody>
            </table>

            <h3>Step 3: Correct Feeding Sequence</h3>
            <p>Add bulk filite first, then CMS and HPMC while mixer runs at low speed.</p>

            <h3>Step 4: Mix for 15-20 Minutes</h3>
            <p>Insufficient mixing is the main cause of bubbling and peeling.</p>

            <h3>Step 5: Seasonal Adjustments</h3>
            <ul>
                <li><strong>Summer:</strong> Increase CMS by 0.3-0.5 kg/ton</li>
                <li><strong>Winter:</strong> Decrease CMS by 0.2 kg/ton</li>
            </ul>

            <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 2rem; border-radius: 12px; margin-top: 2rem; text-align: center;">
                <h3 style="color: white; margin-bottom: 1rem;">🎁 Get Free Formulation Support</h3>
                <p>📧 karnstarch@gmail.com | 📱 +86 13216156841</p>
            </div>
        `,
        cover_image: '/images/应用领域/腻子粉.jpg',
        category: 'guide',
        author: 'Technical Support',
        view_count: 890,
        published_at: '2025-12-24T11:00:00Z',
        created_at: '2025-12-24T10:00:00Z',
        seo_title_zh: '腻子粉CMS添加配方指南 - 5步解决干裂起粉问题',
        seo_description_zh: '详细实战教程：如何在腻子粉中正确添加羧甲基淀粉(CMS)，包含型号选择、HPMC复配比例、投料顺序、混合时间和季节调整技巧。',
        seo_keywords_zh: '腻子粉配方, CMS使用方法, 保水剂配比, 8840使用指南, HPMC复配, 腻子干裂解决, 建筑施工技巧'
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
