-- 产品表增强 - 支持完整内容管理
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT '墙纸胶';
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_range VARCHAR(50) DEFAULT '¥0-0';
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT; -- JSON数组格式
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
ALTER TABLE products ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- 创建产品版本历史表
CREATE TABLE IF NOT EXISTS product_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    version INTEGER NOT NULL,
    content TEXT NOT NULL, -- JSON格式存储完整产品数据
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    action VARCHAR(20) CHECK (action IN ('created', 'updated', 'published', 'deleted')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 创建产品图片表
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_versions_product_id ON product_versions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- 更新现有数据，设置默认值
UPDATE products SET 
    status = CASE WHEN is_active = 1 THEN 'published' ELSE 'draft' END,
    version = 1,
    features = '[]',
    specifications = '[]',
    images = json_array(image_url),
    seo_title = name_zh,
    seo_description = substr(description_zh, 1, 150),
    seo_keywords = name_zh,
    category = '墙纸胶',
    price_range = '¥0-0'
WHERE features IS NULL;

-- 插入版本历史记录
INSERT INTO product_versions (product_id, version, content, created_by, action)
SELECT 
    id,
    1,
    json_object(
        'id', id,
        'product_code', product_code,
        'name_zh', name_zh,
        'name_en', name_en,
        'name_ru', name_ru,
        'description_zh', description_zh,
        'description_en', description_en,
        'description_ru', description_ru,
        'image_url', image_url,
        'is_active', is_active,
        'sort_order', sort_order,
        'created_at', created_at,
        'updated_at', updated_at
    ),
    'system',
    'created'
FROM products;