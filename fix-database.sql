-- 立即修复产品管理页面加载问题
-- 创建所有必要的数据库表和权限

-- 1. 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255) NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  description_ru TEXT,
  specifications_zh TEXT,
  specifications_en TEXT,
  specifications_ru TEXT,
  applications_zh TEXT,
  applications_en TEXT,
  applications_ru TEXT,
  features_zh TEXT[],
  features_en TEXT[],
  features_ru TEXT[],
  image_url TEXT,
  price_range VARCHAR(100),
  packaging_options_zh VARCHAR(255),
  packaging_options_en VARCHAR(255),
  packaging_options_ru VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建联系消息表
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'zh',
  status VARCHAR(20) DEFAULT 'new',
  is_read BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建页面内容表
CREATE TABLE IF NOT EXISTS page_contents (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(50) NOT NULL,
  section_key VARCHAR(50) NOT NULL,
  content_zh TEXT,
  content_en TEXT,
  content_ru TEXT,
  content_type VARCHAR(20) DEFAULT 'text',
  meta_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建站点设置表
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value_zh TEXT,
  setting_value_en TEXT,
  setting_value_ru TEXT,
  setting_type VARCHAR(20) DEFAULT 'text',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 启用RLS权限
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. 创建管理员权限策略
CREATE POLICY "管理员可管理产品" ON products FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

CREATE POLICY "管理员可管理留言" ON contact_messages FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

CREATE POLICY "管理员可管理内容" ON page_contents FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

CREATE POLICY "管理员可管理设置" ON site_settings FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

-- 7. 创建公共读取权限
CREATE POLICY "公开可查看产品" ON products FOR SELECT 
  USING (is_active = true);

CREATE POLICY "公开可查看内容" ON page_contents FOR SELECT 
  USING (is_active = true);

CREATE POLICY "公开可查看设置" ON site_settings FOR SELECT 
  USING (is_active = true);

-- 8. 启用实时订阅
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE contact_messages REPLICA IDENTITY FULL;
ALTER TABLE page_contents REPLICA IDENTITY FULL;
ALTER TABLE site_settings REPLICA IDENTITY FULL;

-- 9. 插入测试数据
INSERT INTO products (product_code, name_zh, name_en, name_ru, description_zh, description_en, description_ru, price_range, is_active, sort_order) VALUES 
('KARN-001', '环保墙纸胶', 'Eco Wallpaper Adhesive', 'Экологический клей для обоев', '环保无毒，强力粘贴，适用于各种墙纸', 'Eco-friendly and non-toxic wallpaper adhesive with strong bonding power', 'Экологичный и нетоксичный клей для обоев с высокой силой сцепления', '¥15-¥25/包', true, 1),
('KARN-002', '强力瓷砖胶', 'Strong Tile Adhesive', 'Мощный клей для плитки', '超强粘性，防水防潮，适用于瓷砖粘贴', 'Super strong adhesion, waterproof and moisture-proof tile adhesive', 'Сверхпрочное сцепление, водонепроницаемый и влагозащитный клей для плитки', '¥20-¥35/包', true, 2),
('KARN-003', '多功能建筑胶', 'Multi-purpose Construction Adhesive', 'Многофункциональный строительный клей', '多用途，高强度，适用于各种建筑材料', 'Multi-purpose, high-strength adhesive for various construction materials', 'Многофункциональный, высокопрочный клей для различных строительных материалов', '¥25-¥40/包', true, 3)
ON CONFLICT (product_code) DO NOTHING;

-- 10. 插入默认页面内容
INSERT INTO page_contents (page_key, section_key, content_zh, content_en, content_ru, content_type) VALUES 
('home', 'hero_title', '杭州卡恩新型建材有限公司', 'Hangzhou Kahn New Building Materials Co., Ltd.', 'ООО «Ханчжоу Кан новые строительные материалы»', 'text'),
('about', 'company_intro', '我们专注于高品质建筑材料的研发和生产', 'We focus on R&D and production of high-quality building materials', 'Мы специализируемся на исследованиях и производстве высококачественных строительных материалов', 'text')
ON CONFLICT (page_key, section_key) DO NOTHING;

-- 11. 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_contents_active ON page_contents(is_active);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);