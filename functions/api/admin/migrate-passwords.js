import { hashPassword } from '../../lib/password-hash.js';

/**
 * 密码迁移工具 - 将明文密码转换为哈希密码
 * 
 * ⚠️ 重要提示：
 * 1. 此端点应该只运行一次
 * 2. 运行后应该禁用或删除此端点
 * 3. 建议在维护窗口期间运行
 * 4. 运行前备份数据库
 * 
 * 使用方法：
 * POST /api/admin/migrate-passwords
 * Body: { "confirm": true }
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

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({
        success: false,
        message: '请求格式错误'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 确认操作
    if (body.confirm !== true) {
      return new Response(JSON.stringify({
        success: false,
        message: '请在请求体中设置 "confirm": true 以确认迁移操作',
        warning: '此操作将修改所有管理员的密码哈希，请确保已备份数据库'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('🚀 开始密码迁移...');

    // 获取所有管理员
    const admins = await env.DB.prepare(`
      SELECT id, email, password_hash 
      FROM admins
    `).all();

    if (!admins.results || admins.results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: '没有需要迁移的管理员账户',
        migrated: 0
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log(`📊 找到 ${admins.results.length} 个管理员账户`);

    let migratedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // 迁移每个管理员的密码
    for (const admin of admins.results) {
      try {
        // 检查是否已经是哈希密码（包含 ':' 分隔符）
        if (admin.password_hash && admin.password_hash.includes(':')) {
          console.log(`⏭️ 跳过 ${admin.email} - 已经是哈希密码`);
          skippedCount++;
          continue;
        }

        // 明文密码
        const plaintextPassword = admin.password_hash;
        
        if (!plaintextPassword) {
          console.warn(`⚠️ ${admin.email} - 密码为空，跳过`);
          skippedCount++;
          continue;
        }

        // 生成哈希密码
        const hashedPassword = await hashPassword(plaintextPassword);

        // 更新数据库
        await env.DB.prepare(`
          UPDATE admins 
          SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(hashedPassword, admin.id).run();

        console.log(`✅ 迁移成功: ${admin.email}`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ 迁移失败: ${admin.email}`, error);
        errors.push({
          email: admin.email,
          error: error.message
        });
      }
    }

    console.log('🎉 密码迁移完成');
    console.log(`✅ 成功迁移: ${migratedCount}`);
    console.log(`⏭️ 跳过: ${skippedCount}`);
    console.log(`❌ 失败: ${errors.length}`);

    return new Response(JSON.stringify({
      success: true,
      message: '密码迁移完成',
      stats: {
        total: admins.results.length,
        migrated: migratedCount,
        skipped: skippedCount,
        failed: errors.length
      },
      errors: errors.length > 0 ? errors : undefined,
      recommendation: '建议：\n1. 验证所有管理员可以正常登录\n2. 如果验证成功，删除此迁移端点\n3. 通知所有管理员密码已更新（如果需要）'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ 密码迁移失败:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '密码迁移失败',
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * GET 请求 - 显示迁移状态
 */
export async function onRequestGet(context) {
  const { env } = context;

  try {
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

    // 获取所有管理员
    const admins = await env.DB.prepare(`
      SELECT id, email, password_hash 
      FROM admins
    `).all();

    if (!admins.results || admins.results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: '没有管理员账户',
        stats: {
          total: 0,
          hashed: 0,
          plaintext: 0
        }
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 统计密码类型
    let hashedCount = 0;
    let plaintextCount = 0;

    for (const admin of admins.results) {
      if (admin.password_hash && admin.password_hash.includes(':')) {
        hashedCount++;
      } else {
        plaintextCount++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: '密码迁移状态',
      stats: {
        total: admins.results.length,
        hashed: hashedCount,
        plaintext: plaintextCount
      },
      needsMigration: plaintextCount > 0,
      recommendation: plaintextCount > 0 
        ? '检测到明文密码，建议运行迁移：POST /api/admin/migrate-passwords with {"confirm": true}'
        : '所有密码已哈希，无需迁移'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ 获取迁移状态失败:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '获取迁移状态失败',
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

