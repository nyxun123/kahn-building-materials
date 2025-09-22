// 简单的数据库测试脚本
const { DatabaseService } = require('../dist-backend/lib/database/db-service');
const { UserServiceDB } = require('../dist-backend/lib/auth/user-service-db');
const { AuditLogService } = require('../dist-backend/lib/auth/audit-log');

async function testDatabase() {
  console.log('🚀 开始数据库测试...\n');

  try {
    // 初始化数据库
    await DatabaseService.initialize();
    console.log('✅ 数据库初始化完成');

    // 健康检查
    const health = await DatabaseService.healthCheck();
    console.log('📊 数据库状态:', health.status);
    console.log('💾 数据库大小:', health.size, 'MB');
    console.log('');

    // 创建测试用户
    console.log('👤 创建测试用户...');
    const result = await UserServiceDB.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      roles: ['user'],
      permissions: ['content:read']
    });

    if (result.success) {
      console.log('✅ 用户创建成功:', result.user.username);
    } else {
      console.log('❌ 用户创建失败:', result.error);
    }
    console.log('');

    // 测试登录
    console.log('🔐 测试登录...');
    const loginResult = await UserServiceDB.login({
      identifier: 'testuser',
      password: 'Test123!'
    });

    if (loginResult.success) {
      console.log('✅ 登录成功');
    } else {
      console.log('❌ 登录失败:', loginResult.error);
    }
    console.log('');

    // 审计日志
    const stats = AuditLogService.getStats();
    console.log('📝 审计日志统计:');
    console.log('   总条目:', stats.totalEntries);
    console.log('   24小时内:', stats.last24Hours);
    console.log('');

    console.log('🎉 数据库测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testDatabase();