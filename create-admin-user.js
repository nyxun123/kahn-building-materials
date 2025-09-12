// Supabase管理员账号创建脚本
// 运行此脚本前请确保已安装 @supabase/supabase-js
// npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDk3NTc0NywiZXhwIjoyMDcwNTUxNzQ3fQ.F3cX8j8lO5J8Jl0lJ2L3k5mN6oP7qR8sT9uU0vW1x2y3'; // 注意：这是服务角色密钥

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('🚀 开始创建管理员账号...');
    
    // 1. 创建Supabase Auth用户
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
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
      console.log('✅ 用户创建成功:', user.user.email);
    }

    // 2. 获取用户ID
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    if (getUserError) throw getUserError;

    const adminUser = users.find(u => u.email === 'niexianlei0@gmail.com');
    if (!adminUser) {
      throw new Error('无法找到管理员用户');
    }

    // 3. 确保用户资料存在
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      id: adminUser.id,
      email: adminUser.email,
      full_name: '管理员',
      role: 'admin',
      is_admin: true
    });

    if (profileError) throw profileError;
    console.log('✅ 用户资料创建成功');

    // 4. 添加到管理员表
    const { error: adminError } = await supabase.from('admin_users').upsert({
      email: 'niexianlei0@gmail.com',
      name: '管理员',
      role: 'super_admin',
      is_active: true
    });

    if (adminError) throw adminError;
    console.log('✅ 管理员权限设置成功');

    console.log('\n🎉 管理员账号配置完成！');
    console.log('邮箱: niexianlei0@gmail.com');
    console.log('密码: XIANche041758');
    console.log('\n现在可以登录后台了！');

  } catch (error) {
    console.error('❌ 创建管理员账号失败:', error.message);
    process.exit(1);
  }
}

// 执行脚本
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };