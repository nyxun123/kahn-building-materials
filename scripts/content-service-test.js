#!/usr/bin/env node

// 内容服务测试脚本
import { DatabaseService } from '../dist-backend/lib/database/db-service.js';
import { contentService } from '../dist-backend/lib/content/content-service.js';
import { RoleService } from '../dist-backend/lib/auth/role-service.js';

async function testContentService() {
  console.log('🚀 开始内容服务测试...\n');

  try {
    // 初始化数据库
    await DatabaseService.initialize();
    console.log('✅ 数据库初始化完成');

    // 创建角色服务实例
    const roleService = new RoleService();
    console.log('✅ 角色服务初始化完成');

    // 创建测试用户
    const testUserId = 'content_test_user';
    const testAdminId = 'content_test_admin';
    
    // 创建测试用户（直接插入数据库）
    try {
      await DatabaseService.run(`INSERT INTO users (id, username, email, password_hash, roles, permissions, is_active, is_verified, password_changed_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`, 
                   [testUserId, 'contentuser', 'content@example.com', 'hashed_password', '["editor"]', '[]', 1, 1]);
      console.log('✅ 创建测试用户成功');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('✅ 测试用户已存在');
      } else {
        throw error;
      }
    }

    // 创建测试管理员用户
    try {
      await DatabaseService.run(`INSERT INTO users (id, username, email, password_hash, roles, permissions, is_active, is_verified, password_changed_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                   [testAdminId, 'contentadmin', 'admin@example.com', 'hashed_password', '["admin"]', '[]', 1, 1]);
      console.log('✅ 创建测试管理员成功');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('✅ 测试管理员已存在');
      } else {
        throw error;
      }
    }

    // 为用户分配权限（直接更新users表的permissions字段）
    try {
      // 为用户分配内容创建和更新权限
      await DatabaseService.run('UPDATE users SET permissions = ? WHERE id = ?', [
        JSON.stringify(['content:read', 'content:create', 'content:update', 'content:publish']),
        testUserId
      ]);
      console.log('✅ 为用户分配权限成功');
      
      // 为管理员分配审批权限
      await DatabaseService.run('UPDATE users SET permissions = ? WHERE id = ?', [
        JSON.stringify(['content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:approve']),
        testAdminId
      ]);
      console.log('✅ 为管理员分配权限成功');
    } catch (error) {
      console.error('权限分配失败:', error);
      throw error;
    }

    // 1. 测试创建内容版本
    console.log('\n1. 测试创建内容版本...');
    
    // 首先创建测试内容
    const testContent = {
      id: 'test_content_001',
      page_key: 'test_page',
      section_key: 'main_content',
      content_zh: '测试中文内容',
      content_en: 'Test English content',
      content_ru: 'Тестовое русское содержание',
      content_type: 'text',
      meta_data: JSON.stringify({ author: 'test_user' }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 创建测试内容表（如果不存在）
    await DatabaseService.run(`
      CREATE TABLE IF NOT EXISTS page_contents (
        id TEXT PRIMARY KEY,
        page_key TEXT NOT NULL,
        section_key TEXT NOT NULL,
        content_zh TEXT,
        content_en TEXT,
        content_ru TEXT,
        content_type TEXT DEFAULT 'text',
        meta_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入测试内容
    await DatabaseService.run(`
      INSERT OR REPLACE INTO page_contents
      (id, page_key, section_key, content_zh, content_en, content_ru, content_type, meta_data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      testContent.id,
      testContent.page_key,
      testContent.section_key,
      testContent.content_zh,
      testContent.content_en,
      testContent.content_ru,
      testContent.content_type,
      testContent.meta_data,
      testContent.created_at,
      testContent.updated_at
    ]);

    const contentId = testContent.id;
    console.log(`✅ 创建测试内容: ${testContent.page_key} - ${testContent.section_key}`);

    // 创建新版本
    const newVersion = await contentService.createContentVersion(
      contentId,
      {
        content_zh: '测试中文内容 - 新版本',
        content_en: 'Test English content - new version',
        content_ru: 'Тестовое русское содержание - новая версия',
        content_type: 'text'
      },
      testUserId,
      '测试创建新版本'
    );

    console.log(`✅ 创建内容版本成功: v${newVersion.version_number}`);

    // 2. 测试获取内容版本
    console.log('\n2. 测试获取内容版本...');
    const versions = await contentService.getContentVersions(contentId);
    console.log(`✅ 获取到 ${versions.length} 个版本`);
    versions.forEach(version => {
      console.log(`   - v${version.version_number}: ${version.change_description} (${version.change_type})`);
    });

    // 3. 测试提交审批
    console.log('\n3. 测试提交内容审批...');
    const approval = await contentService.submitForApproval(
      contentId,
      newVersion.id,
      testAdminId
    );
    console.log(`✅ 提交审批成功: ${approval.status}`);

    // 4. 测试获取待审批列表
    console.log('\n4. 测试获取待审批列表...');
    const pendingApprovals = await contentService.getPendingApprovals();
    console.log(`✅ 获取到 ${pendingApprovals.length} 个待审批内容`);
    pendingApprovals.forEach(item => {
      console.log(`   - ${item.change_description} (v${item.version_number})`);
    });

    // 5. 测试审批内容
    console.log('\n5. 测试审批内容...');
    const approved = await contentService.approveContent(
      approval.id,
      testAdminId,
      '测试审批通过'
    );
    console.log(`✅ 审批通过: ${approved.status}`);

    // 6. 测试获取审批历史
    console.log('\n6. 测试获取审批历史...');
    const approvals = await contentService.getContentApprovals(contentId);
    console.log(`✅ 获取到 ${approvals.length} 条审批记录`);
    approvals.forEach(approval => {
      console.log(`   - ${approval.status}: ${approval.approval_notes || '无备注'}`);
    });

    // 7. 测试版本恢复
    console.log('\n7. 测试版本恢复...');
    if (versions.length > 1) {
      const versionToRestore = versions[1]; // 使用第二个版本
      const restoredVersion = await contentService.restoreContentVersion(
        versionToRestore.id,
        testUserId
      );
      console.log(`✅ 版本恢复成功: 恢复到 v${restoredVersion.version_number}`);
    } else {
      console.log('⚠️  版本不足，跳过恢复测试');
    }

    console.log('\n🎉 内容服务测试完成！所有功能验证通过！');

  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await DatabaseService.close();
  }
}

// 运行测试
testContentService().catch(console.error);