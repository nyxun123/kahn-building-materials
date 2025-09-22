-- 生产环境数据库初始化
-- 产品表
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

-- 插入示例产品数据
INSERT OR IGNORE INTO products (
  product_code, name_zh, name_en, name_ru,
  description_zh, description_en, description_ru,
  image_url, price_range, category, is_active, sort_order
) VALUES 
(
  'WPG-001', 
  '通用壁纸胶粉', 
  'Universal Wallpaper Glue Powder', 
  'Универсальный клей для обоев в порошке',
  '高品质通用型壁纸胶粉，适用于各种类型的壁纸粘贴',
  'High-quality universal wallpaper glue powder suitable for all types of wallpaper application',
  'Высококачественный универсальный клей для обоев в порошке, подходящий для всех типов обоев',
  '/images/wallpaper_glue_powder_product_packaging.jpg',
  '$2-5/包',
  'adhesive',
  1,
  1
),
(
  'WPG-002',
  '环保壁纸胶粉',
  'Eco-friendly Wallpaper Glue Powder',
  'Экологичный клей для обоев в порошке',
  '采用天然植物淀粉制成的环保型壁纸胶粉，无毒无害',
  'Eco-friendly wallpaper glue powder made from natural plant starch, non-toxic and harmless',
  'Экологичный клей для обоев из натурального растительного крахмала, нетоксичный и безвредный',
  '/images/eco_friendly_natural_products_collage.jpg',
  '$3-6/包',
  'adhesive',
  1,
  2
);

