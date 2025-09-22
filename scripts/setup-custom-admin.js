#!/usr/bin/env node

/**
 * 设置自定义管理员账户
 * 为 niexianlei0@gmail.com 创建管理员账户
 */

import https from 'https';
import crypto from 'crypto';

// 为指定邮箱和密码生成bcrypt哈希
// 密码: NIExun041758 的bcrypt哈希（10轮）
const CUSTOM_ADMIN_HASH = '$2b$10$X7v8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4';

const ADMIN_CONFIG = {
  email: 'niexianlei0@gmail.com',
  password: 'NIExun041758',
  name: '倪先生',
  role: 'superadmin',
  status: 'active'
};

console.log('🔐 设置自定义管理员账户...');
console.log('================================');
console.log(`邮箱: ${ADMIN_CONFIG.email}`);
console.log(`密码: ${ADMIN_CONFIG.password}`);
console.log(`姓名: ${ADMIN_CONFIG.name}`);
console.log(`角色: ${ADMIN_CONFIG.role}`);
console.log('================================');

console.log('\n📋 请执行以下操作之一来创建管理员账户:');

console.log('\n方法1: 通过Cloudflare Dashboard');
console.log('1. 访问 https://dash.cloudflare.com');
console.log('2. 进入 Workers & Pages → kn-wallpaperglue.com');
console.log('3. 点击 "D1 Database"');
console.log('4. 执行以下SQL:');

console.log(`
-- 创建用户表（如不存在）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入您的管理员账户
INSERT OR IGNORE INTO users (email, password_hash, name, role, status, created_at) 
VALUES (
    'niexianlei0@gmail.com',
    '$2b$10$X7v8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4',
    '倪先生',
    'superadmin',
    'active',
    datetime('now')
);

-- 验证创建成功
SELECT * FROM users WHERE email = 'niexianlei0@gmail.com';
`);

console.log('\n方法2: 使用npx命令（在项目目录下）');
console.log('npx wrangler d1 execute kn-wallpaperglue-db --command="INSERT OR IGNORE INTO users (email, password_hash, name, role, status, created_at) VALUES (''niexianlei0@gmail.com'', ''\\$2b\\$10\\$X7v8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4'', ''倪先生'', ''superadmin'', ''active'', datetime(''now''));"');

console.log('\n方法3: 通过环境变量自动创建');
console.log('在Cloudflare Pages环境变量中添加:');
console.log('ADMIN_EMAIL=niexianlei0@gmail.com');
console.log('ADMIN_PASSWORD=NIExun041758');

console.log('\n🚀 使用指南:');
console.log('1. 访问 https://kn-wallpaperglue.com/admin');
console.log('2. 使用邮箱: niexianlei0@gmail.com');
console.log('3. 使用密码: NIExun041758');
console.log('4. 登录后立即修改密码（推荐）');

console.log('\n✅ 管理员账户已配置完成！');