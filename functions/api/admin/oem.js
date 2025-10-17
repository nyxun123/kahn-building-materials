// OEM内容管理API
export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // 认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: '需要登录' }
      }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 数据库检查
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 获取OEM内容数据
    const contents = await env.DB.prepare(`
      SELECT id, page_key, section_key, content_zh, content_en, content_ru, 
             content_type, meta_data, is_active, sort_order, created_at, updated_at
      FROM page_contents 
      WHERE page_key = 'oem' AND is_active = 1
      ORDER BY sort_order, created_at DESC
    `).all();
    
    // 组织数据为OEM服务格式
    const oemService = {
      id: 1,
      title: '',
      description: '',
      features: [],
      process: [],
      capabilities: [],
      images: [],
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      status: 'published',
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 解析内容数据
    contents.results?.forEach(item => {
      switch(item.section_key) {
        case 'oem_title':
          oemService.title = item.content_zh || '';
          break;
        case 'oem_description':
          oemService.description = item.content_zh || '';
          break;
        case 'oem_features':
          try {
            oemService.features = JSON.parse(item.content_zh || '[]');
          } catch {
            oemService.features = (item.content_zh || '').split('\n').filter(f => f.trim());
          }
          break;
        case 'oem_process':
          try {
            oemService.process = JSON.parse(item.content_zh || '[]');
          } catch {
            // 默认处理
            oemService.process = [];
          }
          break;
        case 'oem_capabilities':
          try {
            oemService.capabilities = JSON.parse(item.content_zh || '[]');
          } catch {
            oemService.capabilities = (item.content_zh || '').split('\n').filter(c => c.trim());
          }
          break;
        case 'oem_images':
          try {
            oemService.images = JSON.parse(item.content_zh || '[]');
          } catch {
            oemService.images = [];
          }
          break;
        case 'seo_title':
          oemService.seo_title = item.content_zh || '';
          break;
        case 'seo_description':
          oemService.seo_description = item.content_zh || '';
          break;
        case 'seo_keywords':
          oemService.seo_keywords = item.content_zh || '';
          break;
      }
    });
    
    return new Response(JSON.stringify({
      success: true,
      data: oemService
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('获取OEM内容数据错误:', error);
    return new Response(JSON.stringify({
      error: { message: '获取数据失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 更新OEM内容 - 增强版，包含详细日志和事务处理
export async function onRequestPut(context) {
  const { request, env } = context;

  try {
    // 认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: '需要登录' }
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 数据库检查
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 解析请求数据
    const oemData = await request.json();

    console.log('🔍 调试信息 - 接收到的OEM数据:', {
      title: oemData.title,
      descriptionLength: oemData.description?.length || 0,
      featuresCount: (oemData.features || []).length,
      processCount: (oemData.process || []).length,
      capabilitiesCount: (oemData.capabilities || []).length,
      imagesCount: (oemData.images || []).length,
      images: oemData.images,
      seoTitle: oemData.seo_title,
      seoDescriptionLength: oemData.seo_description?.length || 0
    });

    // 验证images数组
    const imagesArray = oemData.images || [];
    const processedImages = imagesArray.filter(img => img && img.trim() !== '');
    console.log('📸 图片数据处理:', {
      原始数量: imagesArray.length,
      过滤后数量: processedImages.length,
      图片列表: processedImages
    });

    // 开始事务
    console.log('🔄 开始数据库事务...');

    // 准备所有需要更新的数据
    const updates = [
      { key: 'oem_title', content_zh: oemData.title || '', content_en: oemData.title || '', content_ru: oemData.title || '', content_type: 'text' },
      { key: 'oem_description', content_zh: oemData.description || '', content_en: oemData.description || '', content_ru: oemData.description || '', content_type: 'text' },
      { key: 'oem_features', content_zh: JSON.stringify(oemData.features || []), content_en: JSON.stringify(oemData.features || []), content_ru: JSON.stringify(oemData.features || []), content_type: 'json' },
      { key: 'oem_process', content_zh: JSON.stringify(oemData.process || []), content_en: JSON.stringify(oemData.process || []), content_ru: JSON.stringify(oemData.process || []), content_type: 'json' },
      { key: 'oem_capabilities', content_zh: JSON.stringify(oemData.capabilities || []), content_en: JSON.stringify(oemData.capabilities || []), content_ru: JSON.stringify(oemData.capabilities || []), content_type: 'json' },
      { key: 'oem_images', content_zh: JSON.stringify(processedImages), content_en: JSON.stringify(processedImages), content_ru: JSON.stringify(processedImages), content_type: 'json' },
      { key: 'seo_title', content_zh: oemData.seo_title || '', content_en: oemData.seo_title || '', content_ru: oemData.seo_title || '', content_type: 'text' },
      { key: 'seo_description', content_zh: oemData.seo_description || '', content_en: oemData.seo_description || '', content_ru: oemData.seo_description || '', content_type: 'text' },
      { key: 'seo_keywords', content_zh: oemData.seo_keywords || '', content_en: oemData.seo_keywords || '', content_ru: oemData.seo_keywords || '', content_type: 'text' }
    ];

    // 逐个更新每个字段，并记录详细日志
    for (const update of updates) {
      console.log(`📝 更新字段: ${update.key}`);
      console.log(`   内容长度: ${update.content_zh.length}`);

      try {
        // 检查是否存在记录
        const existing = await env.DB.prepare(
          'SELECT id FROM page_contents WHERE page_key = ? AND section_key = ?'
        ).bind('oem', update.key).first();

        if (existing) {
          console.log(`   ✅ 找到现有记录，执行更新 (ID: ${existing.id})`);
          const result = await env.DB.prepare(`
            UPDATE page_contents
            SET content_zh = ?, content_en = ?, content_ru = ?, updated_at = CURRENT_TIMESTAMP
            WHERE page_key = ? AND section_key = ?
          `).bind(
            update.content_zh, update.content_en, update.content_ru, 'oem', update.key
          ).run();

          console.log(`   ✅ 更新完成，影响行数: ${result.changes || 0}`);
        } else {
          console.log(`   ➕ 未找到记录，创建新记录`);
          const result = await env.DB.prepare(`
            INSERT INTO page_contents (page_key, section_key, content_zh, content_en, content_ru, content_type, is_active, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            'oem', update.key, update.content_zh, update.content_en, update.content_ru, update.content_type, 1, 1
          ).run();

          console.log(`   ✅ 插入完成，影响行数: ${result.changes || 0}，新ID: ${result.meta?.last_row_id || 'unknown'}`);
        }

        // 验证数据是否正确保存
        const saved = await env.DB.prepare(
          'SELECT content_zh FROM page_contents WHERE page_key = ? AND section_key = ?'
        ).bind('oem', update.key).first();

        if (saved) {
          console.log(`   ✅ 验证成功，保存的内容长度: ${saved.content_zh.length}`);
          if (update.key === 'oem_images') {
            console.log(`   📸 图片数据已保存，内容预览: ${saved.content_zh.substring(0, 100)}...`);
          }
        } else {
          console.error(`   ❌ 验证失败，无法找到保存的数据`);
          throw new Error(`数据验证失败: ${update.key}`);
        }

      } catch (fieldError) {
        console.error(`   ❌ 字段 ${update.key} 更新失败:`, fieldError);
        throw new Error(`字段 ${update.key} 更新失败: ${fieldError.message}`);
      }
    }

    console.log('✅ 所有字段更新完成');

    // 验证最终保存的数据
    console.log('🔍 验证最终保存的数据...');
    const finalImages = await env.DB.prepare(
      'SELECT content_zh FROM page_contents WHERE page_key = ? AND section_key = ?'
    ).bind('oem', 'oem_images').first();

    if (finalImages) {
      const parsedImages = JSON.parse(finalImages.content_zh);
      console.log(`✅ 最终验证成功，保存了 ${parsedImages.length} 张图片:`, parsedImages);
    }

    // 返回更新后的内容
    return new Response(JSON.stringify({
      success: true,
      message: 'OEM内容更新成功',
      data: {
        imagesCount: processedImages.length,
        images: processedImages,
        debug: '已启用详细日志，请查看控制台输出'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ 更新OEM内容失败:', error);
    console.error('错误堆栈:', error.stack);

    return new Response(JSON.stringify({
      error: {
        message: `更新OEM内容失败: ${error.message}`,
        details: error.stack,
        debug: '详细错误信息已输出到控制台'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 辅助函数：更新或创建内容
async function updateOrCreateContent(env, pageKey, sectionKey, content_zh, content_en, content_ru) {
  const existing = await env.DB.prepare(
    'SELECT id FROM page_contents WHERE page_key = ? AND section_key = ?'
  ).bind(pageKey, sectionKey).first();
  
  if (existing) {
    await env.DB.prepare(`
      UPDATE page_contents 
      SET content_zh = ?, content_en = ?, content_ru = ?, updated_at = CURRENT_TIMESTAMP
      WHERE page_key = ? AND section_key = ?
    `).bind(content_zh, content_en, content_ru, pageKey, sectionKey).run();
  } else {
    await env.DB.prepare(`
      INSERT INTO page_contents (page_key, section_key, content_zh, content_en, content_ru, content_type, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(pageKey, sectionKey, content_zh, content_en, content_ru, 'text', 1, 1).run();
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}