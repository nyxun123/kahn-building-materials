// 临时修复图片URL
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 使用一个通用的产品图片占位符或在线图片
    const imageUrl = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format';

    const result = await env.DB.prepare(`
      UPDATE products
      SET image_url = ?
      WHERE product_code = 'WPG-001'
    `).bind(imageUrl).run();

    return new Response(JSON.stringify({
      success: true,
      message: '图片URL更新成功',
      changes: result.changes,
      imageUrl: imageUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: `更新失败: ${error.message}`
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理OPTIONS请求
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}