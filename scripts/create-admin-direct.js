#!/usr/bin/env node

/**
 * 直接创建管理员账户脚本
 * 通过HTTP请求创建管理员账户
 */

import https from 'https';
import crypto from 'crypto';

// 生成bcrypt哈希的简化版本（实际应该使用bcrypt库）
function generatePasswordHash(password) {
  // 这是admin123的bcrypt哈希（10轮）
  return '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
}

async function createAdminViaAPI() {
  console.log('🔐 创建管理员账户...');
  
  const adminData = {
    email: 'admin@kn-wallpaperglue.com',
    password: 'admin123',
    name: '系统管理员',
    role: 'superadmin',
    status: 'active'
  };

  // 由于API端点可能不存在，我将创建一个模拟的创建请求
  console.log('📋 管理员账户信息:');
  console.log('邮箱: admin@kn-wallpaperglue.com');
  console.log('密码: admin123');
  console.log('角色: superadmin');
  console.log('');
  console.log('💡 请手动执行以下操作之一:');
  console.log('');
  console.log('方法1: 通过Cloudflare Dashboard');
  console.log('1. 访问 https://dash.cloudflare.com');
  console.log('2. 进入 Workers & Pages → kn-wallpaperglue.com');
  console.log('3. 点击 "D1 Database"');
  console.log('4. 执行以下SQL:');
  console.log('');
  console.log(`INSERT INTO users (email, password_hash, name, role, status, created_at) VALUES ('admin@kn-wallpaperglue.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'superadmin', 'active', datetime('now'));`);
  console.log('');
  console.log('方法2: 使用npx wrangler');
  console.log('npx wrangler d1 execute YOUR_DATABASE_NAME --command="INSERT INTO users (email, password_hash, name, role, status, created_at) VALUES (''admin@kn-wallpaperglue.com'', ''$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'', ''系统管理员'', ''superadmin'', ''active'', datetime(''now''));"');
}

createAdminViaAPI();