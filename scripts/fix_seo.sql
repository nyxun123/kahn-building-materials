
INSERT OR REPLACE INTO seo_configs (
  page_key, page_name, 
  title_zh, title_en, title_ru,
  description_zh, description_en, description_ru,
  keywords_zh, keywords_en, keywords_ru,
  geo_region, geo_placename, geo_position,
  og_title_zh, og_title_en, og_title_ru,
  og_description_zh, og_description_en, og_description_ru,
  og_image_url, schema_type, schema_data,
  is_active, priority, last_updated
) VALUES (
  'home', '首页',
  '杭州卡恩 - 专业羧甲基淀粉(CMS)与墙纸胶粉生产商', 
  'Karn - CMS & Wallpaper Adhesive Manufacturer', 
  'Karn - Производитель КМК и обойного клея',
  
  '杭州卡恩专业生产羧甲基淀粉(CMS)与墙纸胶粉。23年经验，环保无毒，服务全球。提供建筑级、印染级CMS及OEM代工服务。',
  'Professional manufacturer of Carboxymethyl Starch (CMS) and wallpaper adhesive since 2000. High quality, eco-friendly building materials.',
  'Профессиональный производитель карбоксиметилкрахмала (КМК) и обойного клея с 2000 года. Экологически чистые строительные материалы.',
  
  '羧甲基淀粉,CMS,墙纸胶粉,杭州卡恩,建筑辅料',
  'CMS,carboxymethyl starch,wallpaper adhesive,Karn,building materials',
  'КМК,карбоксиметилкрахмал,обойный клей,Karn,строительные материалы',
  
  'CN-ZJ', '杭州市', '30.2741,120.1551',
  
  '杭州卡恩 - 专业羧甲基淀粉(CMS)生产商',
  'Hangzhou Karn - CMS Manufacturer',
  'Hangzhou Karn - Производитель КМК',
  
  '23年专注羧甲基淀粉研发生产，提供与墙纸胶粉一站式解决方案。',
  '23 years focus on CMS production. One-stop solution for wallpaper adhesive.',
  '23 года специализируется на производстве КМК.',
  
  '/images/logo.png', 'Organization', '{"@context":"https://schema.org","@type":"Organization","name":"Hangzhou Karn","url":"https://kn-wallpaperglue.com","logo":"https://kn-wallpaperglue.com/images/logo.png"}',
  1, 10, '2025-12-08T03:30:00.000Z'
);
