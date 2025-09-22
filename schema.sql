-- 外贸获客网站数据库设计
-- 适用于 Cloudflare D1

-- 联系表单表
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
  is_read BOOLEAN DEFAULT 0,
  admin_notes TEXT
);

-- 产品表（如果需要）
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_code TEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT,
  description_zh TEXT,
  description_en TEXT,
  description_ru TEXT,
  specifications_zh TEXT,
  specifications_en TEXT,
  specifications_ru TEXT,
  applications_zh TEXT,
  applications_en TEXT,
  applications_ru TEXT,
  features_zh TEXT,
  features_en TEXT,
  features_ru TEXT,
  image_url TEXT,
  gallery_images TEXT,
  price DECIMAL(10,2),
  price_range TEXT,
  packaging_options_zh TEXT,
  packaging_options_en TEXT,
  packaging_options_ru TEXT,
  category TEXT,
  tags TEXT,
  is_active BOOLEAN DEFAULT 1,
  is_featured BOOLEAN DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  meta_title_zh TEXT,
  meta_title_en TEXT,
  meta_title_ru TEXT,
  meta_description_zh TEXT,
  meta_description_en TEXT,
  meta_description_ru TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- 页面内容表
CREATE TABLE IF NOT EXISTS page_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content_zh TEXT,
  content_en TEXT,
  content_ru TEXT,
  content_type TEXT DEFAULT 'text',
  meta_data TEXT,
  category TEXT,
  tags TEXT,
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  meta_title_zh TEXT,
  meta_title_en TEXT,
  meta_title_ru TEXT,
  meta_description_zh TEXT,
  meta_description_en TEXT,
  meta_description_ru TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 公司信息表
CREATE TABLE IF NOT EXISTS company_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_type TEXT NOT NULL,
  title_zh TEXT,
  title_en TEXT,
  title_ru TEXT,
  content_zh TEXT,
  content_en TEXT,
  content_ru TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  language TEXT DEFAULT 'zh',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 公司内容表
CREATE TABLE IF NOT EXISTS company_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  title_zh TEXT,
  title_en TEXT,
  title_ru TEXT,
  content_zh TEXT,
  content_en TEXT,
  content_ru TEXT,
  image_url TEXT,
  gallery_images TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  language TEXT DEFAULT 'zh',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_page_contents_page_key ON page_contents(page_key);
CREATE INDEX IF NOT EXISTS idx_page_contents_section_key ON page_contents(section_key);
CREATE INDEX IF NOT EXISTS idx_company_info_section_type ON company_info(section_type);
CREATE INDEX IF NOT EXISTS idx_company_content_type ON company_content(content_type);

-- 插入默认管理员账户
INSERT OR REPLACE INTO admins (email, password_hash, name, role) 
VALUES ('niexianlei0@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', '管理员', 'super_admin');