-- 创建单文档模式的首页内容表
CREATE TABLE IF NOT EXISTS page_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key TEXT UNIQUE NOT NULL,
  content_data TEXT, -- JSON格式存储所有内容
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 如果之前存在多条记录的模式，先备份
-- CREATE TABLE IF NOT EXISTS page_contents_backup AS SELECT * FROM page_contents;

-- 删除旧的多条记录数据（谨慎操作！）
-- DELETE FROM page_contents WHERE page_key = 'home';

-- 插入默认的首页内容
INSERT OR REPLACE INTO page_contents (page_key, content_data, is_active) VALUES
('home', '{
  "video": {
    "title": {"zh": "", "en": "", "ru": ""},
    "subtitle": {"zh": "", "en": "", "ru": ""},
    "video_url": "",
    "description": {"zh": "", "en": "", "ru": ""}
  },
  "oem": {
    "title": {"zh": "", "en": "", "ru": ""},
    "image_url": "",
    "description": {"zh": "", "en": "", "ru": ""}
  },
  "semi": {
    "title": {"zh": "", "en": "", "ru": ""},
    "image_url": "",
    "description": {"zh": "", "en": "", "ru": ""}
  }
}', 1);