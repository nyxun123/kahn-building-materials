// Create admin table and default admin account
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'D1数据库未配置'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🚀 开始创建管理员表和默认账户...');

    // Create admins table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `).run();

    console.log('✅ 管理员表创建成功');

    // Check if default admin already exists
    const existingAdmin = await env.DB.prepare(
      'SELECT id FROM admins WHERE email = ?'
    ).bind('admin@kn-wallpaperglue.com').first();

    if (!existingAdmin) {
      // Create default admin account (password: admin123)
      await env.DB.prepare(`
        INSERT INTO admins (email, password_hash, name, role)
        VALUES (?, ?, ?, ?)
      `).bind(
        'admin@kn-wallpaperglue.com',
        'admin123', // Note: This is plaintext - should be hashed in production
        '系统管理员',
        'super_admin'
      ).run();

      console.log('✅ 默认管理员账户创建成功');
    } else {
      console.log('ℹ️ 默认管理员账户已存在');
    }

    // List all admins
    const admins = await env.DB.prepare(
      'SELECT id, email, name, role, is_active, created_at FROM admins ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify({
      success: true,
      message: '管理员表和默认账户创建成功',
      admins: admins.results
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ 创建管理员失败:', error);
    return new Response(JSON.stringify({
      success: false,
      message: `创建管理员失败: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}