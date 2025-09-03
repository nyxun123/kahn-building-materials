import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDk3NTc0NywiZXhwIjoyMDcwNTUxNzQ3fQ.F3cX8j8lO5J8Jl0lJ2L3k5mN6oP7qR8sT9uU0vW1x2y3';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('🚀 开始创建管理员账号...\n');

  try {
    // 1. 检查用户是否已存在
    console.log('1. 检查现有用户...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    const existingUser = users.users.find(u => u.email === 'niexianlei0@gmail.com');
    
    if (existingUser) {
      console.log('⚠️  用户已存在，跳过创建');
      console.log('   用户ID:', existingUser.id);
      console.log('   状态:', existingUser.email_confirmed_at ? '已验证' : '未验证');
    } else {
      // 2. 创建Supabase Auth用户
      console.log('2. 创建管理员用户...');
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: 'niexianlei0@gmail.com',
        password: 'XIANche041758',
        email_confirm: true,
        user_metadata: {
          full_name: '管理员',
          role: 'admin'
        }
      });

      if (userError) throw userError;
      console.log('✅ 管理员用户创建成功:', user.user.email);
    }

    // 3. 创建必要的表
    console.log('3. 创建数据库表...');
    
    // 检查并创建admin_users表
    const { error: tableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL DEFAULT '管理员',
          role TEXT DEFAULT 'admin',
          is_active BOOLEAN DEFAULT true,
          last_login_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        INSERT INTO admin_users (email, name, role, is_active) 
        VALUES ('niexianlei0@gmail.com', '管理员', 'super_admin', true)
        ON CONFLICT (email) DO UPDATE SET 
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          is_active = EXCLUDED.is_active,
          updated_at = NOW();
      `
    });

    if (tableError) {
      console.log('⚠️  表创建警告:', tableError.message);
    } else {
      console.log('✅ 管理员权限表配置完成');
    }

    // 4. 直接通过SQL创建用户（备选方案）
    if (!existingUser) {
      console.log('4. 使用SQL创建用户...');
      const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at
          ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'niexianlei0@gmail.com',
            crypt('XIANche041758', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"管理员","role":"admin"}',
            NOW(),
            NOW()
          ) ON CONFLICT (email) DO NOTHING;
        `
      });

      if (sqlError) {
        console.log('⚠️  SQL创建用户:', sqlError.message);
      } else {
        console.log('✅ SQL用户创建成功');
      }
    }

    // 5. 测试登录
    console.log('5. 测试登录...');
    const supabaseTest = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w');
    
    const { data: loginData, error: loginError } = await supabaseTest.auth.signInWithPassword({
      email: 'niexianlei0@gmail.com',
      password: 'XIANche041758'
    });

    if (loginError) {
      console.log('❌ 登录测试失败:', loginError.message);
    } else {
      console.log('✅ 登录测试成功!');
      console.log('   用户ID:', loginData.user.id);
    }

    console.log('\n🎉 管理员账号配置完成！');
    console.log('现在可以登录后台：');
    console.log('   邮箱：niexianlei0@gmail.com');
    console.log('   密码：XIANche041758');
    console.log('   地址：https://kn-wallpaperglue.com/admin/login');

  } catch (error) {
    console.error('❌ 创建失败:', error.message);
    console.error('请尝试手动创建：');
    console.error('1. 访问 https://app.supabase.com');
    console.error('2. 选择项目 ypjtdfsociepbzfvxzha');
    console.error('3. Authentication → Users → Add user');
    console.error('4. 邮箱：niexianlei0@gmail.com');
    console.error('5. 密码：XIANche041758');
  }
}

// 执行
createAdminUser();