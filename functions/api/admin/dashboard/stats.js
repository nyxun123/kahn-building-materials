export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // 简单的认证检查
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
    
    if (!env.DB) {
      return new Response(JSON.stringify({
        code: 500,
        message: 'D1数据库未配置'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 并行获取所有统计数据
      const [
        totalProducts,
        totalContacts,
        unreadContacts,
        activeProducts,
        recentActivities
      ] = await Promise.all([
        // 产品总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products`).first(),
        // 联系消息总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts`).first(),
        // 未读联系消息
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts WHERE is_read = 0`).first(),
        // 活跃产品数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products WHERE is_active = 1`).first(),
        // 最近7天活动数
        env.DB.prepare(`
          SELECT COUNT(*) as count FROM contacts
          WHERE created_at >= datetime('now', '-7 days')
        `).first()
      ]);

      // 获取最近30天的每日联系消息统计
      const dailyContacts = await env.DB.prepare(`
        SELECT
          date(created_at) as date,
          COUNT(*) as count
        FROM contacts
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY date(created_at)
        ORDER BY date
      `).all();

      // 获取产品分类统计
      const categoryStats = await env.DB.prepare(`
        SELECT
          category,
          COUNT(*) as count
        FROM products
        WHERE is_active = 1
        GROUP BY category
        ORDER BY count DESC
      `).all();

      return new Response(JSON.stringify({
        data: {
          totalProducts: totalProducts?.count || 0,
          totalContacts: totalContacts?.count || 0,
          unreadContacts: unreadContacts?.count || 0,
          activeProducts: activeProducts?.count || 0,
          recentActivities: recentActivities?.count || 0,
          dailyContacts: dailyContacts.results || [],
          categoryStats: categoryStats.results || []
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error('仪表板统计查询失败:', dbError);
      return new Response(JSON.stringify({
        code: 500,
        message: `数据库查询失败: ${dbError.message}`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('仪表板统计API错误:', error);
    return new Response(JSON.stringify({
      code: 500,
      message: '获取仪表板统计失败'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}