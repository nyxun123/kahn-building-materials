import { DatabaseService } from './dist/src/lib/database/db-service.js';
import { UserServiceDB } from './dist/src/lib/auth/user-service-db.js';
import { AuditLogService } from './dist/src/lib/auth/audit-log.js';

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

    console.log('🎉 数据库初始化完成！');

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