// Supabase认证调试脚本
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDk3NTc0NywiZXhwIjoyMDcwNTUxNzQ3fQ.F3cX8j8lO5J8Jl0lJ2L3k5mN6oP7qR8sT9uU0vW1x2y3';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function debugAuth() {
  console.log('🔍 Supabase认证调试开始...\n');

  try {
    // 1. 检查项目连接
    console.log('1. 测试Supabase连接...');
    const { data: health, error: healthError } = await supabaseAdmin.auth.admin.listUsers();
    if (healthError) {
      console.log('❌ 连接失败:', healthError.message);
      return;
    }
    console.log('✅ 连接成功');

    // 2. 检查用户列表
    console.log('\n2. 检查现有用户...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) {
      console.log('❌ 获取用户列表失败:', usersError.message);
    } else {
      console.log(`找到 ${users.users.length} 个用户`);
      const adminUser = users.users.find(u => u.email === 'niexianlei0@gmail.com');
      if (adminUser) {
        console.log('✅ 找到管理员用户:', adminUser.email);
        console.log('   状态:', adminUser.email_confirmed_at ? '已验证' : '未验证');
        console.log('   创建时间:', adminUser.created_at);
      } else {
        console.log('⚠️  未找到管理员用户 niexianlei0@gmail.com');
      }
    }

    // 3. 检查数据库表
    console.log('\n3. 检查数据库表...');
    const tables = ['admin_users', 'user_profiles', 'products', 'contact_messages'];
    for (const table of tables) {
      try {
        const { count, error } = await supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          console.log(`⚠️  表 ${table}: 不存在或错误 - ${error.message}`);
        } else {
          console.log(`✅ 表 ${table}: 存在，${count} 条记录`);
        }
      } catch (e) {
        console.log(`⚠️  表 ${table}: 检查失败`);
      }
    }

    // 4. 测试登录
    console.log('\n4. 测试管理员登录...');
    try {
      const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
        email: 'niexianlei0@gmail.com',
        password: 'XIANche041758'
      });

      if (loginError) {
        console.log('❌ 登录失败:', loginError.message);
      } else {
        console.log('✅ 登录成功!');
        console.log('   用户ID:', loginData.user.id);
        console.log('   邮箱:', loginData.user.email);
      }
    } catch (e) {
      console.log('❌ 登录测试异常:', e.message);
    }

    // 5. 检查权限
    console.log('\n5. 检查管理员权限...');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', 'niexianlei0@gmail.com')
      .single();

    if (adminError) {
      console.log('⚠️  管理员记录不存在或错误:', adminError.message);
    } else {
      console.log('✅ 管理员记录:', adminData);
    }

    console.log('\n🔍 调试完成！');

  } catch (error) {
    console.error('调试过程出错:', error.message);
  }
}

// 创建管理员用户的快捷方法
async function createAdminUserQuick() {
  console.log('🚀 快速创建管理员账号...\n');

  try {
    // 1. 创建Auth用户
    console.log('1. 创建Auth用户...');
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'niexianlei0@gmail.com',
      password: 'XIANche041758',
      email_confirm: true,
      user_metadata: {
        full_name: '管理员',
        role: 'admin'
      }
    });

    if (userError) {
      if (userError.message.includes('already registered')) {
        console.log('⚠️  用户已存在，跳过创建');
      } else {
        throw userError;
      }
    } else {
      console.log('✅ Auth用户创建成功');
    }

    // 2. 获取用户ID
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = users.find(u => u.email === 'niexianlei0@gmail.com');

    if (!adminUser) {
      throw new Error('无法找到管理员用户');
    }

    // 3. 创建必要的表
    console.log('2. 创建数据库表...');
    
    // 创建admin_users表
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          is_active BOOLEAN DEFAULT true,
          last_login_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        INSERT INTO admin_users (email, name, role, is_active) 
        VALUES ('niexianlei0@gmail.com', '管理员', 'super_admin', true)
        ON CONFLICT (email) DO NOTHING;
      `
    });

    console.log('✅ 管理员账号配置完成！');
    console.log('现在可以尝试登录了');

  } catch (error) {
    console.error('❌ 创建失败:', error.message);
  }
}

// 执行调试
if (require.main === module) {
  const action = process.argv[2];
  if (action === 'create') {
    createAdminUserQuick();
  } else {
    debugAuth();
  }
}

module.exports = { debugAuth, createAdminUserQuick };