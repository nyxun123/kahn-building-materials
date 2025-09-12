-- 完全重建数据库 - 解决产品信息无法显示问题
-- 执行此SQL确保所有表和权限正确配置

-- 1. 删除并重建产品表（确保结构正确）
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
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

-- 2. 删除并重建联系消息表
DROP TABLE IF EXISTS contact_messages CASCADE;

CREATE TABLE contact_messages (
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

-- 3. 删除并重建页面内容表
DROP TABLE IF EXISTS page_contents CASCADE;

CREATE TABLE page_contents (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_key, section_key)
);

-- 4. 删除并重建站点设置表
DROP TABLE IF EXISTS site_settings CASCADE;

CREATE TABLE site_settings (
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

-- 5. 强制启用RLS权限（针对所有表）
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. 创建管理员权限策略（基于邮箱）
CREATE OR REPLACE POLICY "管理员可管理产品" ON products FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

CREATE OR REPLACE POLICY "管理员可管理留言" ON contact_messages FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

CREATE OR REPLACE POLICY "管理员可管理内容" ON page_contents FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

CREATE OR REPLACE POLICY "管理员可管理设置" ON site_settings FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

-- 7. 创建公共读取权限
CREATE OR REPLACE POLICY "公开可查看产品" ON products FOR SELECT 
  USING (is_active = true);

CREATE OR REPLACE POLICY "公开可查看内容" ON page_contents FOR SELECT 
  USING (is_active = true);

CREATE OR REPLACE POLICY "公开可查看设置" ON site_settings FOR SELECT 
  USING (is_active = true);

-- 8. 启用实时订阅
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE contact_messages REPLICA IDENTITY FULL;
ALTER TABLE page_contents REPLICA IDENTITY FULL;
ALTER TABLE site_settings REPLICA IDENTITY FULL;

-- 9. 插入真实产品数据（确保有数据可显示）
INSERT INTO products (product_code, name_zh, name_en, name_ru, description_zh, description_en, description_ru, price_range, is_active, sort_order) VALUES 
('KARN-001', '环保墙纸胶粉', 'Eco-Friendly Wallpaper Adhesive Powder', 'Экологичный клей для обоев в порошке', '环保无毒配方，适用于各种墙纸粘贴，强力持久', 'Eco-friendly non-toxic formula suitable for all wallpaper types, strong and durable adhesion', 'Экологичная нетоксичная формула, подходит для всех типов обоев, прочное сцепление', '¥15-25/包', true, 1),
('KARN-002', '强力瓷砖胶', 'High-Strength Tile Adhesive', 'Высокопрочный клей для плитки', '超强粘性，防水防潮，适用于室内外瓷砖粘贴', 'Super strong adhesion, waterproof and moisture-proof, suitable for indoor and outdoor tile installation', 'Сверхпрочное сцепление, водонепроницаемый и влагозащитный, подходит для внутренней и наружной установки плитки', '¥20-35/包', true, 2),
('KARN-003', '多功能建筑胶', 'Multi-Purpose Construction Adhesive', 'Многофункциональный строительный клей', '多用途高强度建筑胶，适用于各种建筑材料粘贴', 'Multi-purpose high-strength construction adhesive, suitable for bonding various building materials', 'Многофункциональный высокопрочный строительный клей, подходит для склеивания различных строительных материалов', '¥25-40/包', true, 3),
('KARN-004', '快干白乳胶', 'Quick-Dry White Latex Adhesive', 'Быстросохнущий белый латексный клей', '快干配方，适用于木材、纸张、布料等材料', 'Quick-dry formula, suitable for wood, paper, fabric and other materials', 'Быстросохнущая формула, подходит для дерева, бумаги, ткани и других материалов', '¥18-28/包', true, 4),
('KARN-005', '防水密封胶', 'Waterproof Sealant Adhesive', 'Водонепроницаемый клей-герметик', '专业级防水密封，适用于浴室、厨房等潮湿环境', 'Professional-grade waterproof sealing, suitable for bathrooms, kitchens and other humid environments', 'Профессиональный водонепроницаемый герметик, подходит для ванных комнат, кухонь и других влажных помещений', '¥30-45/支', true, 5);

-- 10. 插入默认页面内容
INSERT INTO page_contents (page_key, section_key, content_zh, content_en, content_ru, content_type) VALUES 
('home', 'hero_title', '杭州卡恩新型建材有限公司', 'Hangzhou Kahn New Building Materials Co., Ltd.', 'ООО «Ханчжоу Кан новые строительные материалы»', 'text'),
('home', 'hero_subtitle', '专业建筑胶粘剂制造商', 'Professional Building Adhesive Manufacturer', 'Профессиональный производитель строительных клеев', 'text'),
('about', 'company_intro', '杭州卡恩新型建材有限公司是一家专业从事建筑胶粘剂研发、生产和销售的高新技术企业。我们拥有先进的生产设备和专业的技术团队，致力于为客户提供高品质、环保、安全的建筑胶粘剂产品。', 'Hangzhou Kahn New Building Materials Co., Ltd. is a high-tech enterprise specializing in the research, development, production and sales of building adhesives. We have advanced production equipment and a professional technical team, committed to providing customers with high-quality, environmentally friendly and safe building adhesive products.', 'ООО «Ханчжоу Кан новые строительные материалы» — высокотехнологичное предприятие, специализирующееся на исследованиях, разработке, производстве и продаже строительных клеев. У нас есть передовое производственное оборудование и профессиональная техническая команда, стремящаяся предоставлять клиентам высококачественные, экологичные и безопасные строительные клеевые продукты.', 'text'),
('contact', 'company_name', '杭州卡恩新型建材有限公司', 'Hangzhou Kahn New Building Materials Co., Ltd.', 'ООО «Ханчжоу Кан новые строительные материалы»', 'text'),
('contact', 'company_address', '中国浙江省杭州市萧山区经济技术开发区', 'Xiaoshan Economic and Technological Development Zone, Hangzhou, Zhejiang, China', 'Экономико-технологическая зона Сяошань, г. Ханчжоу, провинция Чжэцзян, Китай', 'text');

-- 11. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_contents_key ON page_contents(page_key, section_key);

-- 12. 验证数据插入成功
SELECT 
  'products' as table_name, 
  COUNT(*) as record_count 
FROM products
UNION ALL
SELECT 
  'page_contents' as table_name, 
  COUNT(*) as record_count 
FROM page_contents;