/**
 * 数据库迁移 - 添加账户锁定字段
 * 
 * 功能：
 * - 为 admins 表添加 failed_login_attempts 字段
 * - 为 admins 表添加 locked_until 字段
 * - 检查字段是否已存在，避免重复添加
 * 
 * ⚠️ 重要提示：
 * 1. 此端点应该只运行一次
 * 2. 运行后应该禁用或删除此端点
 * 3. 建议在维护窗口期间运行
 * 4. 运行前备份数据库
 * 
 * 使用方法：
 * POST /api/admin/migrate-account-lockout
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
        warning: '此操作将修改 admins 表结构，请确保已备份数据库'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('🚀 开始数据库迁移 - 添加账户锁定字段...');

    const migrations = [];
    const errors = [];

    // 迁移 1: 添加 failed_login_attempts 字段
    try {
      await env.DB.prepare(`
        ALTER TABLE admins 
        ADD COLUMN failed_login_attempts INTEGER DEFAULT 0
      `).run();
      
      console.log('✅ 添加字段: failed_login_attempts');
      migrations.push('failed_login_attempts');
    } catch (error) {
      // 字段可能已存在
      if (error.message.includes('duplicate column name')) {
        console.log('⏭️ 字段已存在: failed_login_attempts');
        migrations.push('failed_login_attempts (已存在)');
      } else {
        console.error('❌ 添加字段失败: failed_login_attempts', error);
        errors.push({
          field: 'failed_login_attempts',
          error: error.message
        });
      }
    }

    // 迁移 2: 添加 locked_until 字段
    try {
      await env.DB.prepare(`
        ALTER TABLE admins 
        ADD COLUMN locked_until DATETIME
      `).run();
      
      console.log('✅ 添加字段: locked_until');
      migrations.push('locked_until');
    } catch (error) {
      // 字段可能已存在
      if (error.message.includes('duplicate column name')) {
        console.log('⏭️ 字段已存在: locked_until');
        migrations.push('locked_until (已存在)');
      } else {
        console.error('❌ 添加字段失败: locked_until', error);
        errors.push({
          field: 'locked_until',
          error: error.message
        });
      }
    }

    // 迁移 3: 初始化现有记录的值
    try {
      await env.DB.prepare(`
        UPDATE admins 
        SET failed_login_attempts = 0 
        WHERE failed_login_attempts IS NULL
      `).run();
      
      console.log('✅ 初始化现有记录的 failed_login_attempts 为 0');
    } catch (error) {
      console.warn('⚠️ 初始化字段值失败（可能字段不存在）:', error.message);
    }

    console.log('🎉 数据库迁移完成');

    return new Response(JSON.stringify({
      success: true,
      message: '数据库迁移完成',
      migrations: migrations,
      errors: errors.length > 0 ? errors : undefined,
      recommendation: errors.length === 0 
        ? '建议：\n1. 验证账户锁定功能正常工作\n2. 如果验证成功，删除此迁移端点\n3. 更新登录 API 以使用新字段'
        : '警告：部分迁移失败，请检查错误信息'
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
      message: '数据库迁移失败',
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

    // 检查字段是否存在
    const tableInfo = await env.DB.prepare(`
      PRAGMA table_info(admins)
    `).all();

    const columns = tableInfo.results.map(col => col.name);
    const hasFailedAttempts = columns.includes('failed_login_attempts');
    const hasLockedUntil = columns.includes('locked_until');

    return new Response(JSON.stringify({
      success: true,
      message: '数据库迁移状态',
      status: {
        failed_login_attempts: hasFailedAttempts ? '✅ 已存在' : '❌ 不存在',
        locked_until: hasLockedUntil ? '✅ 已存在' : '❌ 不存在'
      },
      needsMigration: !hasFailedAttempts || !hasLockedUntil,
      recommendation: (!hasFailedAttempts || !hasLockedUntil)
        ? '检测到缺少字段，建议运行迁移：POST /api/admin/migrate-account-lockout with {"confirm": true}'
        : '所有字段已存在，无需迁移',
      allColumns: columns
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

