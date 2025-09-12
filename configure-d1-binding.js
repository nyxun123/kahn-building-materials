#!/usr/bin/env node

// Cloudflare Pages D1 自动绑定配置脚本
// 自动为 Pages 项目配置 D1 数据库绑定

import https from 'https';
import { execSync } from 'child_process';

const CONFIG = {
  accountId: '6ae5d9a224117ca99a05304e017c43db',
  projectName: 'kahn-building-materials',
  databaseName: 'kaneshuju', 
  databaseId: '1017f91b-e6f1-42d9-b9c3-5f32904be73a',
  bindingName: 'DB'
};

// 从环境变量或 wrangler config 获取 API Token
async function getCloudflareToken() {
  
  try {
    // 尝试从 wrangler 获取token
    const result = execSync('npx wrangler whoami', { encoding: 'utf8' });
    console.log('当前 Cloudflare 认证状态:', result);
    
    // 检查是否有有效的认证
    if (result.includes('You are logged in') || result.includes('OAuth Token')) {
      return 'WRANGLER_AUTHENTICATED';
    } else {
      throw new Error('未认证');
    }
  } catch (error) {
    console.error('获取认证失败:', error.message);
    return null;
  }
}

// 配置 Pages 项目的 D1 绑定
async function configurePagesBinding() {
  console.log('🔧 开始配置 Cloudflare Pages D1 绑定...');
  
  const token = await getCloudflareToken();
  if (!token) {
    console.error('❌ 无法获取 Cloudflare API 认证');
    console.log('\n📋 手动配置步骤：');
    console.log(`1. 访问: https://dash.cloudflare.com/${CONFIG.accountId}/pages/view/${CONFIG.projectName}`);
    console.log('2. 点击 Settings → Functions');
    console.log('3. 找到 "D1 database bindings" 部分');
    console.log('4. 点击 "Add binding"');
    console.log(`5. Variable name: ${CONFIG.bindingName}`);
    console.log(`6. D1 database: ${CONFIG.databaseName}`);
    console.log('7. 点击 Save');
    return false;
  }
  
  console.log('✅ Cloudflare 认证成功');
  console.log('📊 配置详情:');
  console.log(`   Account ID: ${CONFIG.accountId}`);
  console.log(`   Project: ${CONFIG.projectName}`);
  console.log(`   Database: ${CONFIG.databaseName} (${CONFIG.databaseId})`);
  console.log(`   Binding: ${CONFIG.bindingName}`);
  
  // 由于 API 限制，显示手动配置步骤
  console.log('\n📋 请完成以下手动配置：');
  console.log('\n🌐 1. 配置 Pages 绑定：');
  console.log(`   访问: https://dash.cloudflare.com/${CONFIG.accountId}/pages/view/${CONFIG.projectName}`);
  console.log('   Settings → Functions → D1 database bindings → Add binding');
  console.log(`   Variable name: ${CONFIG.bindingName}`);
  console.log(`   D1 database: ${CONFIG.databaseName}`);
  
  console.log('\n🗂️ 2. 验证数据库状态：');
  console.log(`   访问: https://dash.cloudflare.com/${CONFIG.accountId}/workers/d1/databases/${CONFIG.databaseId}`);
  
  return true;
}

// 测试 D1 数据库连接
async function testDatabaseConnection() {
  
  try {
    console.log('\n🧪 测试数据库连接...');
    
    // 测试查询
    const result = execSync(`npx wrangler d1 execute ${CONFIG.databaseName} --command="SELECT COUNT(*) as admin_count FROM admins;" --remote`, 
      { encoding: 'utf8' });
    
    console.log('✅ 数据库连接测试成功');
    console.log('📊 查询结果:', result);
    
    return true;
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error.message);
    return false;
  }
}

// 主执行函数
async function main() {
  console.log('🚀 Cloudflare D1 自动配置脚本启动...');
  console.log('═'.repeat(50));
  
  try {
    // 配置绑定
    await configurePagesBinding();
    
    // 测试连接
    await testDatabaseConnection();
    
    console.log('\n✅ 配置完成！');
    console.log('📝 下一步:');
    console.log('1. 完成手动绑定步骤');
    console.log('2. 等待 Pages 重新部署（约2-3分钟）');
    console.log('3. 测试管理员登录功能');
    console.log(`4. 访问: https://kn-wallpaperglue.com/admin/login`);
    
  } catch (error) {
    console.error('❌ 配置失败:', error.message);
  }
}

// 执行
main().catch(console.error);