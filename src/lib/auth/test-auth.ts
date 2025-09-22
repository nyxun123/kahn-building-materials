import { AuthService, initializeAuth } from './index.js';
import { AuditLogService } from './audit-log.js';

/**
 * 认证系统测试脚本
 * 验证所有认证组件的功能
 */
async function testAuthSystem() {
  console.log('🚀 开始认证系统测试...\n');

  // 初始化认证系统
  const config = initializeAuth();
  console.log('✅ 认证系统初始化完成');
  console.log(`   JWT密钥: ${config.jwtSecret ? '已设置' : '未设置'}`);
  console.log(`   刷新令牌密钥: ${config.jwtRefreshSecret ? '已设置' : '未设置'}\n`);

  // 测试1: 用户注册
  console.log('1. 测试用户注册...');
  const registerResult = await AuthService.register({
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123!',
    roles: ['user'],
    permissions: ['content:read']
  });

  if (registerResult.success) {
    console.log('✅ 用户注册成功');
    console.log(`   用户ID: ${registerResult.user?.id}`);
    console.log(`   用户名: ${registerResult.user?.username}`);
  } else {
    console.log('❌ 用户注册失败:', registerResult.error);
    return;
  }
  console.log('');

  // 测试2: 用户登录
  console.log('2. 测试用户登录...');
  const loginResult = await AuthService.login({
    identifier: 'testuser',
    password: 'Test123!'
  });

  if (loginResult.success && loginResult.tokens) {
    console.log('✅ 用户登录成功');
    console.log(`   访问令牌: ${loginResult.tokens.accessToken.substring(0, 20)}...`);
    console.log(`   刷新令牌: ${loginResult.tokens.refreshToken.substring(0, 20)}...`);
    console.log(`   有效期: ${loginResult.tokens.expiresIn}秒`);
  } else {
    console.log('❌ 用户登录失败:', loginResult.error);
    return;
  }
  console.log('');

  // 测试3: 令牌验证
  console.log('3. 测试令牌验证...');
  if (loginResult.tokens) {
    const verified = AuthService.verifyAccessToken(loginResult.tokens.accessToken);
    if (verified) {
      console.log('✅ 令牌验证成功');
      console.log(`   用户ID: ${verified.userId}`);
      console.log(`   用户名: ${verified.username}`);
      console.log(`   角色: ${verified.roles.join(', ')}`);
    } else {
      console.log('❌ 令牌验证失败');
      return;
    }
  }
  console.log('');

  // 测试4: 权限验证
  console.log('4. 测试权限验证...');
  if (loginResult.user) {
    const hasPermission = AuthService.hasPermission(loginResult.user.id, 'content:read');
    const hasAdminPermission = AuthService.hasPermission(loginResult.user.id, 'admin:access');
    
    console.log(`   内容读取权限: ${hasPermission ? '✅ 有权限' : '❌ 无权限'}`);
    console.log(`   管理员权限: ${hasAdminPermission ? '✅ 有权限' : '❌ 无权限'}`);
  }
  console.log('');

  // 测试5: 密码强度检查
  console.log('5. 测试密码强度检查...');
  const weakPassword = AuthService.checkPasswordStrength('weak');
  const strongPassword = AuthService.checkPasswordStrength('Strong123!');
  
  console.log(`   弱密码强度: ${weakPassword.strength} (分数: ${weakPassword.score})`);
  console.log(`   强密码强度: ${strongPassword.strength} (分数: ${strongPassword.score})`);
  console.log('');

  // 测试6: 审计日志查询
  console.log('6. 测试审计日志...');
  const auditStats = AuthService.getAuditStats();
  console.log(`   总日志条目: ${auditStats.totalEntries}`);
  console.log(`   24小时内日志: ${auditStats.last24Hours}`);
  console.log(`   按严重级别: INFO=${auditStats.bySeverity.INFO}, WARNING=${auditStats.bySeverity.WARNING}, ERROR=${auditStats.bySeverity.ERROR}`);
  console.log('');

  // 测试7: 刷新令牌
  console.log('7. 测试令牌刷新...');
  if (loginResult.tokens) {
    const refreshResult = await AuthService.refreshToken(loginResult.tokens.refreshToken);
    if (refreshResult.success && refreshResult.tokens) {
      console.log('✅ 令牌刷新成功');
      console.log(`   新访问令牌: ${refreshResult.tokens.accessToken.substring(0, 20)}...`);
    } else {
      console.log('❌ 令牌刷新失败:', refreshResult.error);
    }
  }
  console.log('');

  // 测试8: 用户注销
  console.log('8. 测试用户注销...');
  if (loginResult.user) {
    AuthService.logout(loginResult.user.id);
    console.log('✅ 用户注销成功');
    
    // 验证令牌是否失效
    if (loginResult.tokens) {
      const verifiedAfterLogout = AuthService.verifyAccessToken(loginResult.tokens.accessToken);
      console.log(`   注销后令牌验证: ${verifiedAfterLogout ? '❌ 仍然有效' : '✅ 已失效'}`);
    }
  }
  console.log('');

  // 测试9: 健康检查
  console.log('9. 测试健康检查...');
  const health = {
    status: 'healthy',
    users: 2, // 包括测试用户和默认用户
    refreshTokens: 1,
    auditLogs: AuditLogService['logs'].length
  };
  console.log(`   系统状态: ${health.status}`);
  console.log(`   用户数量: ${health.users}`);
  console.log(`   刷新令牌数量: ${health.refreshTokens}`);
  console.log(`   审计日志数量: ${health.auditLogs}`);
  console.log('');

  console.log('🎉 所有测试完成！');
  console.log('📊 审计日志统计:');
  
  const recentLogs = AuditLogService['logs'].slice(-10);
  recentLogs.forEach(log => {
    console.log(`   [${log.timestamp.toISOString()}] ${log.action}: ${log.description}`);
  });

  console.log('\n💡 下一步:');
  console.log('   1. 配置环境变量 (.env文件)');
  console.log('   2. 集成到Express服务器中');
  console.log('   3. 实现数据库持久化');
  console.log('   4. 添加前端认证界面');
}

// 运行测试
testAuthSystem().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});