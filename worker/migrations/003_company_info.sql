-- 公司信息表
CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_type TEXT NOT NULL, -- 'contact', 'about', 'certifications', etc.
    field_key TEXT NOT NULL,    -- 'address', 'phone', 'email', etc.
    field_value TEXT,           -- 字段值
    language TEXT DEFAULT 'zh', -- 语言: zh, en, ru
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_type, field_key, language)
);

-- 公司内容表
CREATE TABLE IF NOT EXISTS company_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type TEXT NOT NULL, -- 'about', 'history', 'advantages', etc.
    content_key TEXT NOT NULL,  -- 'title', 'description', 'paragraph1', etc.
    content_value TEXT,         -- 内容值
    language TEXT DEFAULT 'zh', -- 语言: zh, en, ru
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_key, language)
);

-- 插入默认公司信息数据
INSERT OR IGNORE INTO company_info (section_type, field_key, field_value, language) VALUES
-- 联系信息
('contact', 'address_zh', '浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场', 'zh'),
('contact', 'address_en', 'Xingshang International Plaza, No.18 Xingqiao Road, Donghu Street, Yuhang District, Hangzhou, Zhejiang, China', 'en'),
('contact', 'phone', '+86 571-88888888', 'zh'),
('contact', 'phone', '+86 571-88888888', 'en'),
('contact', 'email', 'info@karn-materials.com', 'zh'),
('contact', 'email', 'info@karn-materials.com', 'en'),
('contact', 'business_hours_weekdays', '周一至周五 9:00-18:00', 'zh'),
('contact', 'business_hours_weekdays', 'Monday to Friday 9:00-18:00', 'en'),
('contact', 'business_hours_saturday', '周六 9:00-16:00', 'zh'),
('contact', 'business_hours_saturday', 'Saturday 9:00-16:00', 'en'),
('contact', 'business_hours_sunday', '周日 休息', 'zh'),
('contact', 'business_hours_sunday', 'Sunday Closed', 'en');

-- 插入默认公司内容数据
INSERT OR IGNORE INTO company_content (content_type, content_key, content_value, language) VALUES
-- 关于我们
('about', 'hero_title_zh', '关于浙江卡恩新型建材有限公司', 'zh'),
('about', 'hero_title_en', 'About Hangzhou Karn New Building Materials Co., Ltd.', 'en'),
('about', 'company_paragraph1_zh', '浙江卡恩新型建材有限公司成立于2010年，是一家专业从事壁纸胶粉研发、生产、销售的企业。经过多年的发展，我们已成为行业内知名的高品质壁纸胶供应商。', 'zh'),
('about', 'company_paragraph1_en', 'Established in 2010, Hangzhou Karn New Building Materials Co., Ltd. is a company specializing in the research, development, production, and sales of wallpaper adhesive powder.', 'en'),
('about', 'company_paragraph2_zh', '我们拥有现代化的生产设备和专业的研发团队，为全球客户提供高性能、环保的壁纸胶产品。', 'zh'),
('about', 'company_paragraph2_en', 'We have modern production equipment and a professional R&D team, providing high-performance, environmentally friendly wallpaper adhesive products to global customers.', 'en'),
('about', 'company_paragraph3_zh', '除了标准产品系列外，我们还提供全面的OEM/ODM服务，根据客户具体要求定制产品配方、包装和品牌。', 'zh'),
('about', 'company_paragraph3_en', 'In addition to our standard product series, we also provide comprehensive OEM/ODM services, customizing product formulations, packaging, and branding according to specific customer requirements.', 'en'),
-- 公司优势
('about', 'advantages_title_zh', '我们的优势', 'zh'),
('about', 'advantages_title_en', 'Our Advantages', 'en'),
('about', 'quality_title_zh', '品质保证', 'zh'),
('about', 'quality_title_en', 'Quality Assurance', 'en'),
('about', 'quality_desc_zh', '我们采用严格的质量控制体系，每批产品都经过多道检测工序，确保符合国际质量标准。', 'zh'),
('about', 'quality_desc_en', 'We employ a rigorous quality control system with each batch of products undergoing multi-stage testing to ensure compliance with international quality standards.', 'en'),
-- 发展历程
('about', 'history_founding_zh', '公司在浙江杭州成立，专注于壁纸胶粉的研发和生产。', 'zh'),
('about', 'history_founding_en', 'Company established in Hangzhou, Zhejiang, focusing on the development and production of wallpaper adhesive powder.', 'en'),
('about', 'history_expansion_zh', '扩大生产设施，引进先进自动化生产线，大幅提升产能。', 'zh'),
('about', 'history_expansion_en', 'Expanded production facilities and introduced advanced automated production lines, significantly increasing production capacity.', 'en'),
('about', 'history_international_zh', '开始拓展国际市场，产品出口到亚洲、欧洲、北美等国家。', 'zh'),
('about', 'history_international_en', 'Began expanding into international markets with products exported to countries in Asia, Europe, and North America.', 'en'),
('about', 'history_present_zh', '开发新一代环保壁纸胶产品，加强全球市场布局和品牌建设。', 'zh'),
('about', 'history_present_en', 'Developed a new generation of environmentally friendly wallpaper adhesive products, strengthening global market presence and brand building.', 'en');

-- 创建触发器自动更新updated_at
CREATE TRIGGER IF NOT EXISTS update_company_info_timestamp 
AFTER UPDATE ON company_info
BEGIN
    UPDATE company_info SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_company_content_timestamp 
AFTER UPDATE ON company_content
BEGIN
    UPDATE company_content SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;