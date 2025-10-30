import { hashPassword } from '../../lib/password-hash.js';

/**
 * 创建管理员表和默认账户
 *
 * ⚠️ 安全警告：此端点应该受到保护！
 * 建议：
 * 1. 仅在初始化时调用一次
 * 2. 添加认证保护（需要超级管理员权限）
 * 3. 或者完全禁用此端点，改用命令行工具
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 数据库检查
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'D1数据库未配置'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('🚀 开始创建管理员表和默认账户...');

    // 创建管理员表
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

    // 检查默认管理员是否已存在
    const existingAdmin = await env.DB.prepare(
      'SELECT id FROM admins WHERE email = ?'
    ).bind('admin@kn-wallpaperglue.com').first();

    if (!existingAdmin) {
      // 生成安全的密码哈希
      const defaultPassword = 'Admin@123456';  // 强密码
      const passwordHash = await hashPassword(defaultPassword);

      // 创建默认管理员账户
      await env.DB.prepare(`
        INSERT INTO admins (email, password_hash, name, role)
        VALUES (?, ?, ?, ?)
      `).bind(
        'admin@kn-wallpaperglue.com',
        passwordHash,  // ✅ 使用哈希密码
        '系统管理员',
        'super_admin'
      ).run();

      console.log('✅ 默认管理员账户创建成功');
      console.log('📧 Email: admin@kn-wallpaperglue.com');
      console.log('🔑 Password:', defaultPassword);
      console.log('⚠️ 请立即修改默认密码！');
    } else {
      console.log('ℹ️ 默认管理员账户已存在');
    }

    // 列出所有管理员（不包含密码哈希）
    const admins = await env.DB.prepare(
      'SELECT id, email, name, role, is_active, created_at FROM admins ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify({
      success: true,
      message: '管理员表和默认账户创建成功',
      admins: admins.results,
      defaultCredentials: existingAdmin ? null : {
        email: 'admin@kn-wallpaperglue.com',
        password: defaultPassword,
        warning: '请立即修改默认密码！'
      }
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
      message: '创建管理员失败，请查看日志'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
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