// 数据库迁移 - 创建 media_files 表
// 用于存储上传的图片和视频文件信息

export async function onRequestGet(context) {
  const { env } = context;

  try {
    console.log('🚀 开始创建 media_files 表...');

    // 创建 media_files 表
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS media_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        folder TEXT DEFAULT 'general',
        title_zh TEXT,
        title_en TEXT,
        title_ru TEXT,
        description_zh TEXT,
        description_en TEXT,
        description_ru TEXT,
        alt_text_zh TEXT,
        alt_text_en TEXT,
        alt_text_ru TEXT,
        usage_location TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await env.DB.prepare(createTableSQL).run();
    console.log('✅ media_files 表创建成功');

    // 创建索引以提高查询性能
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_media_file_type ON media_files(file_type)',
      'CREATE INDEX IF NOT EXISTS idx_media_folder ON media_files(folder)',
      'CREATE INDEX IF NOT EXISTS idx_media_active ON media_files(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_media_usage ON media_files(usage_location)',
      'CREATE INDEX IF NOT EXISTS idx_media_created ON media_files(created_at DESC)'
    ];

    for (const indexSQL of createIndexes) {
      await env.DB.prepare(indexSQL).run();
    }
    console.log('✅ 索引创建成功');

    // 插入示例数据（可选）
    const insertSampleData = `
      INSERT OR IGNORE INTO media_files (
        id, file_name, file_url, file_type, file_size, mime_type, folder,
        title_zh, title_en, title_ru,
        description_zh, description_en, description_ru,
        usage_location
      ) VALUES 
      (
        1,
        'sample_video.mp4',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'video',
        0,
        'video/mp4',
        'home',
        '产品演示视频',
        'Product Demo Video',
        'Демонстрационное видео продукта',
        '通过视频了解我们的产品特点和使用方法',
        'Learn about our product features and usage through video',
        'Узнайте о характеристиках и использовании нашего продукта через видео',
        'home_video'
      )
    `;

    await env.DB.prepare(insertSampleData).run();
    console.log('✅ 示例数据插入成功');

    // 验证表结构
    const tableInfo = await env.DB.prepare(
      "PRAGMA table_info(media_files)"
    ).all();

    console.log('📋 media_files 表结构:', tableInfo);

    return new Response(JSON.stringify({
      success: true,
      message: 'media_files 表创建成功',
      tableInfo: tableInfo.results
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ 数据库迁移失败:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理 OPTIONS 请求 (CORS)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

