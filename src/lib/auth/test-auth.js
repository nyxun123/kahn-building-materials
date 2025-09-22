// 简单的认证系统测试脚本
import { AuthService, initializeAuth } from './index.js';
import { AuditLogService } from './audit-log.js';

/**
 * 认证系统测试
 */
async function testAuthSystem() {
  console.log('🚀 开始认证系统测试...\n');

  try {
    // 初始化认证系统
    const config = initializeAuth();
    console.log('✅ 认证系统初始化完成');

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

    if (loginResult.success) {
      console.log('✅ 用户登录成功');
    } else {
      console.log('❌ 用户登录失败:', loginResult.error);
      return;
    }
    console.log('');

    // 测试3: 权限验证
    console.log('3. 测试权限验证...');
    if (loginResult.user) {
      const hasPermission = AuthService.hasPermission(loginResult.user.id, 'content:read');
      console.log(`   内容读取权限: ${hasPermission ? '✅ 有权限' : '❌ 无权限'}`);
    }
    console.log('');

    // 测试4: 审计日志
    console.log('4. 测试审计日志...');
    const auditStats = AuthService.getAuditStats();
    console.log(`   总日志条目: ${auditStats.totalEntries}`);
    console.log('');

    console.log('🎉 基本测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAuthSystem();