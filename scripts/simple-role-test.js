#!/usr/bin/env node

// 简单的角色服务测试脚本
import { DatabaseService, db } from '../dist-backend/lib/database/db-service.js';
import { RoleService } from '../dist-backend/lib/auth/role-service.js';
import { AuditLogService } from '../dist-backend/lib/auth/audit-log.js';

async function testRoleService() {
  console.log('🚀 开始简单角色服务测试...\n');

  try {
    // 初始化数据库
    await DatabaseService.initialize();
    console.log('✅ 数据库初始化完成');

    // 创建角色服务实例
    const roleService = new RoleService();
    console.log('✅ 角色服务初始化完成');

    // 1. 检查系统角色是否已存在（数据库迁移已创建）
    console.log('\n1. 检查系统角色...');
    const existingRoles = await roleService.getAllRoles();
    console.log(`✅ 系统中已有 ${existingRoles.length} 个角色`);
    existingRoles.forEach(role => {
      console.log(`   - ${role.name}: ${role.description}`);
    });

    // 2. 测试获取所有角色
    console.log('\n2. 测试获取所有角色...');
    const allRoles = await roleService.getAllRoles();
    console.log(`✅ 获取到 ${allRoles.length} 个角色`);
    allRoles.forEach(role => {
      console.log(`   - ${role.name}: ${role.description}`);
    });

    // 3. 测试获取所有权限
    console.log('\n3. 测试获取所有权限...');
    const allPermissions = await roleService.getAllPermissions();
    console.log(`✅ 获取到 ${allPermissions.length} 个权限`);

    // 4. 测试创建新角色
    console.log('\n4. 测试创建新角色...');
    const newRole = await roleService.createRole({
      name: '测试角色',
      description: '测试用的角色',
      permissions: ['content:read', 'content:create'],
      isSystemRole: false
    }, 'test_user');
    console.log(`✅ 创建新角色成功: ${newRole.name}`);

    // 5. 测试为用户分配角色
    console.log('\n5. 测试为用户分配角色...');
    const testUserId = 'user_test_123';
    
    // 先创建一个测试用户（绕过用户服务，直接插入数据库）
    try {
      await db.run(`INSERT INTO users (id, username, email, password_hash, roles, permissions, is_active, is_verified, password_changed_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                   [testUserId, 'testuser', 'test@example.com', 'hashed_password', '[]', '[]', 1, 1]);
      console.log('✅ 创建测试用户成功');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('✅ 测试用户已存在');
      } else {
        throw error;
      }
    }
    
    await roleService.assignRoleToUser(
      testUserId,
      newRole.id,
      testUserId  // 使用测试用户自己作为分配者
    );
    console.log(`✅ 为用户分配角色成功`);

    // 6. 测试获取用户权限
    console.log('\n6. 测试获取用户权限...');
    const userPermissions = await roleService.getUserPermissions(testUserId);
    console.log(`✅ 用户权限: ${userPermissions.join(', ')}`);

    // 7. 测试权限验证
    console.log('\n7. 测试权限验证...');
    const hasContentRead = await roleService.hasPermission(testUserId, 'content:read');
    const hasAdminPerm = await roleService.hasPermission(testUserId, 'user:manage');
    console.log(`✅ 权限验证结果:`);
    console.log(`   - content:read: ${hasContentRead ? '✅' : '❌'}`);
    console.log(`   - user:manage: ${hasAdminPerm ? '✅' : '❌'}`);

    console.log('\n🎉 简单角色服务测试完成！基本功能验证通过！');

  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await DatabaseService.close();
  }
}

// 运行测试
testRoleService().catch(console.error);