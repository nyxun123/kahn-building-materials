-- 博客文章表
-- 用于存储网站博客/新闻内容

CREATE TABLE IF NOT EXISTS blog_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,           -- URL 友好的标识符
  
  -- 多语言标题
  title_zh TEXT NOT NULL,
  title_en TEXT,
  title_ru TEXT,
  
  -- 多语言内容 (Markdown 格式)
  content_zh TEXT,
  content_en TEXT,
  content_ru TEXT,
  
  -- 多语言摘要
  excerpt_zh TEXT,
  excerpt_en TEXT,
  excerpt_ru TEXT,
  
  -- 媒体和分类
  cover_image TEXT,                     -- 封面图片 URL
  category TEXT DEFAULT 'news',         -- 分类：news, industry, guide
  tags TEXT,                            -- JSON 数组格式的标签
  
  -- 作者和状态
  author TEXT DEFAULT 'Kahn Team',
  is_published INTEGER DEFAULT 0,       -- 发布状态: 0=草稿, 1=已发布
  is_featured INTEGER DEFAULT 0,        -- 是否推荐
  
  -- 统计
  view_count INTEGER DEFAULT 0,
  
  -- SEO 相关
  meta_title_zh TEXT,
  meta_title_en TEXT,
  meta_title_ru TEXT,
  meta_description_zh TEXT,
  meta_description_en TEXT,
  meta_description_ru TEXT,
  
  -- 时间戳
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_articles(published_at);
