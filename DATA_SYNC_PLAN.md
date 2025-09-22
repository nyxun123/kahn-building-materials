# 数据同步方案

## 数据模型差异分析

### 1. 字段映射关系

| 管理后台字段 | 公共页面字段 | 说明 |
|-------------|-------------|------|
| `name` | `name_zh` | 默认使用中文名称 |
| `description` | `description_zh` | 默认使用中文描述 |
| `features` | `description_zh` | 特色功能合并到描述中 |
| `specifications` | `description_zh` | 技术规格合并到描述中 |
| `images[0]` | `image_url` | 使用第一张图片 |
| `category` | - | 新增字段，需要添加到公共页面 |
| `seo_title` | - | SEO字段，需要添加到公共页面 |
| `seo_description` | - | SEO字段，需要添加到公共页面 |
| `seo_keywords` | - | SEO字段，需要添加到公共页面 |
| `status` | `is_active` | 状态映射 |

### 2. 数据转换规则

#### 产品数据转换
```typescript
// 管理后台 -> 公共页面
function transformToPublic(product: AdminProduct): PublicProduct {
  return {
    id: product.id,
    product_code: generateProductCode(product.name),
    name_zh: product.name,
    name_en: product.name, // 需要翻译
    name_ru: product.name, // 需要翻译
    description_zh: formatDescription(product),
    description_en: formatDescription(product), // 需要翻译
    description_ru: formatDescription(product), // 需要翻译
    image_url: product.images[0] || '',
    is_active: product.status === 'published',
    sort_order: product.id,
    created_at: product.created_at,
    updated_at: product.updated_at
  };
}

// 公共页面 -> 管理后台
function transformToAdmin(product: PublicProduct): AdminProduct {
  return {
    id: product.id,
    name: product.name_zh,
    description: product.description_zh,
    features: extractFeatures(product.description_zh),
    specifications: extractSpecifications(product.description_zh),
    images: [product.image_url],
    category: '墙纸胶', // 默认分类
    price_range: '¥0-0', // 默认价格
    seo_title: product.name_zh,
    seo_description: product.description_zh.substring(0, 150),
    seo_keywords: product.name_zh,
    status: product.is_active ? 'published' : 'draft',
    version: 1,
    created_at: product.created_at,
    updated_at: product.updated_at
  };
}
```

### 3. 数据库结构更新

#### 需要添加到D1数据库的字段
```sql
-- 产品表增强
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_range VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT; -- JSON数组

-- 创建产品版本表
CREATE TABLE IF NOT EXISTS product_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    version INTEGER NOT NULL,
    content TEXT NOT NULL, -- JSON格式
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    action VARCHAR(20),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 创建产品图片表
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 4. API端点更新

#### 新增API端点
```
GET    /api/admin/products          - 管理后台产品列表
POST   /api/admin/products          - 创建产品
PUT    /api/admin/products/:id      - 更新产品
DELETE /api/admin/products/:id      - 删除产品
GET    /api/admin/products/:id/versions - 获取版本历史
POST   /api/admin/products/:id/restore - 恢复到指定版本
```

#### 现有API端点更新
```
GET    /api/products               - 支持新字段
GET    /api/products/:id           - 支持新字段
```

### 5. 同步策略

#### 实时同步
- 管理后台更新后立即同步到公共页面
- 使用数据库触发器或应用层事件

#### 批量同步
- 定时任务检查更新
- 支持手动触发同步

#### 冲突解决
- 以管理后台数据为准
- 保留版本历史用于回滚

### 6. 实施步骤

1. **数据库迁移** - 更新D1数据库结构
2. **API更新** - 扩展现有API支持新字段
3. **管理后台更新** - 集成新的数据模型
4. **公共页面更新** - 使用新的数据结构
5. **数据迁移** - 将现有数据转换为新格式
6. **测试验证** - 确保数据一致性

### 7. 回滚策略

- 保留原始数据表作为备份
- 版本控制系统支持快速回滚
- 分阶段部署，先测试后生产