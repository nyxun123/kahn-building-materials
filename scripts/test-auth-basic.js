// 简单的认证系统测试脚本
import { AuthService, initializeAuth } from '../dist-backend/lib/auth/index.js';
import { AuditLogService } from '../dist-backend/lib/auth/audit-log.js';

async function testAuthBasic() {
  console.log('🚀 开始基础认证系统测试...\n');

  try {
    // 初始化认证系统
    const config = initializeAuth();
    console.log('✅ 认证系统初始化完成');
    console.log(`   JWT密钥: ${config.jwtSecret ? '已设置' : '未设置'}`);
    console.log(`   刷新令牌密钥: ${config.jwtRefreshSecret ? '已设置' : '未设置'}\n`);

    // 测试1: 密码强度检查
    console.log('1. 测试密码强度检查...');
    const weakPassword = AuthService.checkPasswordStrength('weak');
    const strongPassword = AuthService.checkPasswordStrength('Strong123!');
    
    console.log(`   弱密码强度: ${weakPassword.strength} (分数: ${weakPassword.score})`);
    console.log(`   强密码强度: ${strongPassword.strength} (分数: ${strongPassword.score})`);
    console.log('');

    // 测试2: JWT令牌验证
    console.log('2. 测试JWT令牌验证...');
    
    // 创建一个测试令牌进行验证
    const testPayload = {
      userId: 'test-user-123',
      username: 'testuser',
      roles: ['user'],
      permissions: ['content:read']
    };
    
    // 使用JWTService直接生成令牌（仅用于测试）
    const { JWTService } = await import('../dist-backend/lib/auth/jwt.js');
    const testToken = JWTService.generateAccessToken(testPayload);
    
    console.log('✅ 测试令牌生成成功');
    console.log(`   测试令牌: ${testToken.substring(0, 20)}...`);

    // 验证令牌
    const verified = AuthService.verifyAccessToken(testToken);
    if (verified) {
      console.log('✅ 令牌验证成功');
      console.log(`   用户ID: ${verified.userId}`);
      console.log(`   用户名: ${verified.username}`);
    } else {
      console.log('❌ 令牌验证失败');
    }
    console.log('');

    // 测试3: 审计日志
    console.log('3. 测试审计日志...');
    AuditLogService.logLogin('test-user-123', 'testuser', true, '127.0.0.1', 'Test Browser');
    AuditLogService.logLogout('test-user-123', 'testuser', '127.0.0.1');

    const stats = AuditLogService.getStats();
    console.log('📊 审计日志统计:');
    console.log(`   总条目: ${stats.totalEntries}`);
    console.log(`   24小时内: ${stats.last24Hours}`);
    console.log(`   按严重级别: INFO=${stats.bySeverity.INFO}, WARNING=${stats.bySeverity.WARNING}, ERROR=${stats.bySeverity.ERROR}`);
    console.log('');

    // 测试4: 密码哈希和验证
    console.log('4. 测试密码哈希...');
    const password = 'Test123!';
    
    // 直接使用PasswordService
    const { PasswordService } = await import('../dist-backend/lib/auth/password.js');
    const hashedPassword = await PasswordService.hashPassword(password);
    const isValid = await PasswordService.verifyPassword(password, hashedPassword);
    
    console.log(`   原始密码: ${password}`);
    console.log(`   哈希密码: ${hashedPassword.substring(0, 20)}...`);
    console.log(`   验证结果: ${isValid ? '✅ 验证成功' : '❌ 验证失败'}`);
    console.log('');

    console.log('🎉 基础认证测试完成！');
    console.log('\n💡 下一步:');
    console.log('   1. 配置环境变量 (.env文件)');
    console.log('   2. 集成到Express服务器中');
    console.log('   3. 实现数据库持久化');
    console.log('   4. 添加前端认证界面');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testAuthBasic().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});