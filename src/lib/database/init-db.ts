import { DatabaseService } from './db-service.js';
import { UserServiceDB } from '../auth/user-service-db.js';
import { AuditLogService } from '../auth/audit-log.js';

/**
 * 数据库初始化脚本
 * 测试数据库连接和基本功能
 */
async function initializeDatabase() {
  console.log('🚀 开始初始化数据库...\n');

  try {
    // 初始化数据库服务
    await DatabaseService.initialize();
    console.log('✅ 数据库服务初始化完成');

    // 测试数据库健康检查
    const health = await DatabaseService.healthCheck();
    console.log('📊 数据库健康状态:', health.status);
    console.log('💾 数据库大小:', health.size, 'MB');
    console.log('📋 数据表信息:');
    health.tables.forEach(table => {
      console.log(`   ${table.name}: ${table.count} 条记录`);
    });
    console.log('');

    // 创建测试用户
    console.log('👤 创建测试用户...');
    const registerResult = await UserServiceDB.register({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      roles: ['admin', 'superadmin'],
      permissions: ['users:manage', 'content:manage', 'system:settings:update']
    });

    if (registerResult.success) {
      console.log('✅ 测试用户创建成功');
      console.log(`   用户ID: ${registerResult.user?.id}`);
      console.log(`   用户名: ${registerResult.user?.username}`);
    } else {
      console.log('❌ 测试用户创建失败:', registerResult.error);
      return;
    }
    console.log('');

    // 测试用户登录
    console.log('🔐 测试用户登录...');
    const loginResult = await UserServiceDB.login({
      identifier: 'admin',
      password: 'Admin123!'
    });

    if (loginResult.success && loginResult.tokens) {
      console.log('✅ 用户登录成功');
      console.log(`   访问令牌: ${loginResult.tokens.accessToken.substring(0, 20)}...`);
      console.log(`   刷新令牌: ${loginResult.tokens.refreshToken.substring(0, 20)}...`);
    } else {
      console.log('❌ 用户登录失败:', loginResult.error);
      return;
    }
    console.log('');

    // 测试获取所有用户
    console.log('👥 获取所有用户...');
    const allUsers = await UserServiceDB.getAllUsers();
    console.log(`   用户数量: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
    });
    console.log('');

    // 测试权限验证
    console.log('🔐 测试权限验证...');
    if (loginResult.user) {
      const hasUserManage = await UserServiceDB.hasPermission(loginResult.user.id, 'users:manage');
      const hasContentManage = await UserServiceDB.hasPermission(loginResult.user.id, 'content:manage');
      const hasAdminAccess = await UserServiceDB.hasPermission(loginResult.user.id, 'admin:access');
      
      console.log(`   用户管理权限: ${hasUserManage ? '✅' : '❌'}`);
      console.log(`   内容管理权限: ${hasContentManage ? '✅' : '❌'}`);
      console.log(`   管理员访问权限: ${hasAdminAccess ? '✅' : '❌'}`);
    }
    console.log('');

    // 测试审计日志
    console.log('📝 测试审计日志...');
    const auditStats = AuditLogService.getStats();
    console.log(`   审计日志总数: ${auditStats.totalEntries}`);
    console.log(`   24小时内日志: ${auditStats.last24Hours}`);
    console.log('');

    // 显示最近的审计日志
    const recentLogs = AuditLogService.queryLogs({ limit: 5 });
    console.log('📋 最近的审计日志:');
    recentLogs.forEach(log => {
      console.log(`   [${log.timestamp.toISOString()}] ${log.action}: ${log.description}`);
    });
    console.log('');

    console.log('🎉 数据库初始化测试完成！');
    console.log('💡 所有功能正常，可以开始使用数据库持久化存储。');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initializeDatabase().catch(error => {
  console.error('❌ 初始化脚本执行失败:', error);
  process.exit(1);
});