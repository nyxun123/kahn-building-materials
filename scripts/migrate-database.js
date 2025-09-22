#!/usr/bin/env node

/**
 * 数据库迁移脚本
 * 执行产品表结构升级
 */

const fs = require('fs');
const path = require('path');

// 读取迁移文件
const migrationPath = path.join(__dirname, '..', 'worker', 'migrations', '002_enhanced_products.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📊 开始执行数据库迁移...');
console.log('📁 迁移文件:', migrationPath);

// 分割SQL语句
const statements = migrationSQL
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

console.log(`🔍 找到 ${statements.length} 个SQL语句`);

// 生成执行脚本
const executionScript = `
-- 产品表增强迁移脚本
-- 执行时间: ${new Date().toISOString()}

-- 开始事务
BEGIN TRANSACTION;

${statements.join(';\n\n')}

-- 提交事务
COMMIT;

-- 验证迁移结果
SELECT 
  '迁移完成' as status,
  COUNT(*) as total_products,
  COUNT(CASE WHEN features IS NOT NULL THEN 1 END) as enhanced_products
FROM products;
`;

// 保存执行脚本
const outputPath = path.join(__dirname, 'execute-migration.sql');
fs.writeFileSync(outputPath, executionScript);

console.log('✅ 迁移脚本已生成:', outputPath);
console.log('');
console.log('📋 执行步骤:');
console.log('1. 登录 Cloudflare Dashboard');
console.log('2. 进入 D1 数据库管理');
console.log('3. 选择数据库: kaneshuju');
console.log('4. 执行 execute-migration.sql 中的SQL语句');
console.log('');
console.log('🔄 或者使用 Wrangler CLI:');
console.log('   wrangler d1 execute kaneshuju --file=scripts/execute-migration.sql');

// 生成回滚脚本
const rollbackScript = `
-- 回滚脚本
-- 执行时间: ${new Date().toISOString()}

-- 备份数据
CREATE TABLE products_backup AS SELECT * FROM products;

-- 删除新增字段
ALTER TABLE products DROP COLUMN IF EXISTS features;
ALTER TABLE products DROP COLUMN IF EXISTS specifications;
ALTER TABLE products DROP COLUMN IF EXISTS seo_title;
ALTER TABLE products DROP COLUMN IF EXISTS seo_description;
ALTER TABLE products DROP COLUMN IF EXISTS seo_keywords;
ALTER TABLE products DROP COLUMN IF EXISTS category;
ALTER TABLE products DROP COLUMN IF EXISTS price_range;
ALTER TABLE products DROP COLUMN IF EXISTS images;
ALTER TABLE products DROP COLUMN IF EXISTS status;
ALTER TABLE products DROP COLUMN IF EXISTS version;

-- 删除新表
DROP TABLE IF EXISTS product_versions;
DROP TABLE IF EXISTS product_images;

-- 验证回滚
SELECT '回滚完成' as status, COUNT(*) as total_products FROM products;
`;

const rollbackPath = path.join(__dirname, 'rollback-migration.sql');
fs.writeFileSync(rollbackPath, rollbackScript);

console.log('🔄 回滚脚本已生成:', rollbackPath);