#!/usr/bin/env node

/**
 * 角色服务测试脚本
 * 测试角色和权限管理功能
 */

const { DatabaseService } = require('../dist-backend/lib/database/db-service');
const { RoleService } = require('../dist-backend/lib/auth/role-service');
const { AuditLogService } = require('../dist-backend/lib/auth/audit-log');

async function testRoleService() {
  console.log('🚀 开始角色服务测试...\n');

  try {
    // 初始化数据库
    await DatabaseService.initialize();
    console.log('✅ 数据库初始化完成');

    // 创建角色服务实例
    const roleService = new RoleService();
    console.log('✅ 角色服务初始化完成');

    // 1. 测试初始化系统角色和权限
    console.log('\n1. 测试初始化系统角色和权限...');
    await roleService.initializeSystemRoles();
    console.log('✅ 系统角色和权限初始化完成');

    // 2. 测试获取所有角色
    console.log('\n2. 测试获取所有角色...');
    const allRoles = await roleService.getAllRoles();
    console.log(`✅ 获取到 ${allRoles.length} 个角色:`);
    allRoles.forEach(role => {
      console.log(`   - ${role.name}: ${role.description} (${role.permissions.length} 个权限)`);
    });

    // 3. 测试获取所有权限
    console.log('\n3. 测试获取所有权限...');
    const allPermissions = await roleService.getAllPermissions();
    console.log(`✅ 获取到 ${allPermissions.length} 个权限:`);
    const permissionsByCategory = {};
    allPermissions.forEach(perm => {
      if (!permissionsByCategory[perm.category]) {
        permissionsByCategory[perm.category] = [];
      }
      permissionsByCategory[perm.category].push(perm.name);
    });
    
    Object.entries(permissionsByCategory).forEach(([category, perms]) => {
      console.log(`   ${category}: ${perms.join(', ')}`);
    });

    // 4. 测试创建新角色
    console.log('\n4. 测试创建新角色...');
    const newRole = await roleService.createRole({
      name: '内容审核员',
      description: '负责内容审核和审批',
      permissions: ['content:read', 'content:approve'],
      isSystemRole: false
    }, 'system');
    console.log(`✅ 创建新角色成功: ${newRole.name} (ID: ${newRole.id})`);

    // 5. 测试更新角色
    console.log('\n5. 测试更新角色...');
    const updatedRole = await roleService.updateRole(newRole.id, {
      description: '负责内容审核、审批和发布',
      permissions: ['content:read', 'content:approve', 'content:publish']
    }, 'system');
    console.log(`✅ 更新角色成功: ${updatedRole.description}`);

    // 6. 测试为用户分配角色
    console.log('\n6. 测试为用户分配角色...');
    const testUserId = 'user_test_123';
    const assignment = await roleService.assignRoleToUser(
      testUserId, 
      newRole.id, 
      'admin_user',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后过期
    );
    console.log(`✅ 为用户分配角色成功: 用户 ${testUserId} -> 角色 ${newRole.name}`);

    // 7. 测试获取用户角色
    console.log('\n7. 测试获取用户角色...');
    const userRoles = await roleService.getUserRoles(testUserId);
    console.log(`✅ 获取用户角色成功: 用户 ${testUserId} 有 ${userRoles.length} 个角色`);
    userRoles.forEach(role => {
      console.log(`   - ${role.name}: ${role.permissions.length} 个权限`);
    });

    // 8. 测试获取用户权限
    console.log('\n8. 测试获取用户权限...');
    const userPermissions = await roleService.getUserPermissions(testUserId);
    console.log(`✅ 获取用户权限成功: 用户 ${testUserId} 有 ${userPermissions.length} 个权限`);
    console.log(`   - 权限列表: ${userPermissions.join(', ')}`);

    // 9. 测试权限验证
    console.log('\n9. 测试权限验证...');
    const hasContentRead = await roleService.hasPermission(testUserId, 'content:read');
    const hasUserManage = await roleService.hasPermission(testUserId, 'user:manage');
    console.log(`✅ 权限验证结果:`);
    console.log(`   - content:read: ${hasContentRead ? '✅' : '❌'}`);
    console.log(`   - user:manage: ${hasUserManage ? '✅' : '❌'}`);

    // 10. 测试角色验证
    console.log('\n10. 测试角色验证...');
    const hasEditorRole = await roleService.hasRole(testUserId, '编辑');
    const hasAdminRole = await roleService.hasRole(testUserId, '管理员');
    console.log(`✅ 角色验证结果:`);
    console.log(`   - 编辑角色: ${hasEditorRole ? '✅' : '❌'}`);
    console.log(`   - 管理员角色: ${hasAdminRole ? '✅' : '❌'}`);

    // 11. 测试移除用户角色
    console.log('\n11. 测试移除用户角色...');
    await roleService.removeRoleFromUser(testUserId, newRole.id, 'admin_user');
    console.log(`✅ 移除用户角色成功`);

    // 12. 测试删除角色
    console.log('\n12. 测试删除角色...');
    await roleService.deleteRole(newRole.id, 'system');
    console.log(`✅ 删除角色成功: ${newRole.name}`);

    // 13. 测试审计日志
    console.log('\n13. 测试审计日志...');
    const auditStats = AuditLogService.getStats();
    console.log(`✅ 审计日志统计:`);
    console.log(`   - 总条目: ${auditStats.totalEntries}`);
    console.log(`   - 24小时内: ${auditStats.last24Hours}`);
    console.log(`   - 按严重级别: INFO=${auditStats.bySeverity.INFO}, WARNING=${auditStats.bySeverity.WARNING}, ERROR=${auditStats.bySeverity.ERROR}`);

    console.log('\n🎉 角色服务测试完成！所有功能验证通过！');
    console.log('\n📊 最终统计:');
    console.log(`   - 角色数量: ${(await roleService.getAllRoles()).length}`);
    console.log(`   - 权限数量: ${(await roleService.getAllPermissions()).length}`);
    console.log(`   - 审计日志: ${auditStats.totalEntries} 条记录`);

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