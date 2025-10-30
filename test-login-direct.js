/**
 * 直接测试登录功能
 */

async function testLogin() {
  const testCases = [
    {
      email: 'niexianlei0@gmail.com',
      password: 'XIANche041758'
    },
    {
      email: 'admin@kahn.com',
      password: 'Admin#2025'
    },
    {
      email: 'admin@kn-wallpaperglue.com',
      password: 'admin123'
    }
  ];

  console.log('🧪 开始测试登录功能...\n');

  for (const testCase of testCases) {
    console.log(`\n📧 测试账户: ${testCase.email}`);
    console.log(`🔑 密码: ${testCase.password}`);
    
    try {
      const response = await fetch('https://kn-wallpaperglue.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase)
      });

      const data = await response.json();
      
      console.log(`📊 状态码: ${response.status}`);
      
      if (response.ok) {
        console.log('✅ 登录成功!');
        console.log('👤 用户信息:', data.user);
        console.log('🎫 Access Token:', data.accessToken ? '已生成' : '未生成');
        console.log('🔄 Refresh Token:', data.refreshToken ? '已生成' : '未生成');
      } else {
        console.log('❌ 登录失败');
        console.log('错误信息:', data.message || data.error);
      }
    } catch (error) {
      console.log('❌ 请求失败:', error.message);
    }
    
    console.log('─'.repeat(60));
  }
}

testLogin().catch(console.error);

