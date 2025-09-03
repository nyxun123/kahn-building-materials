// 深度诊断脚本 - 解决产品管理加载问题
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepDebug() {
  console.log('🔍 深度诊断开始...\n');

  try {
    // 1. 测试基本连接
    console.log('1. 测试Supabase连接...');
    const { data: health, error: healthError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (healthError) {
      console.log('❌ 连接失败:', healthError.code, healthError.message);
      console.log('🔍 错误详情:');
      console.log('   - 错误代码:', healthError.code);
      console.log('   - 错误信息:', healthError.message);
      console.log('   - 错误详情:', healthError.details);
      return;
    }
    console.log('✅ 连接成功 - 找到', health.count, '个产品');

    // 2. 测试管理员用户权限
    console.log('\n2. 测试管理员权限...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'niexianlei0@gmail.com',
      password: 'XIANche041758'
    });

    if (loginError) {
      console.log('❌ 管理员登录失败:', loginError.message);
      return;
    }
    console.log('✅ 管理员登录成功');

    // 3. 检查表结构
    console.log('\n3. 检查表结构...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    if (productsError) {
      console.log('❌ 查询产品表失败:', productsError.message);
    } else {
      console.log('✅ 产品表查询成功');
      console.log('   找到产品数量:', products?.length || 0);
      if (products && products.length > 0) {
        console.log('   示例产品:', products[0].name_zh);
      }
    }

    // 4. 检查表权限
    console.log('\n4. 检查表权限...');
    try {
      const { data: permissions } = await supabase.rpc('get_table_privileges', {
        table_name: 'products'
      });
      console.log('✅ 权限检查:', permissions);
    } catch (e) {
      console.log('⚠️ 权限检查失败:', e.message);
    }

    // 5. 检查实时订阅
    console.log('\n5. 检查实时订阅...');
    try {
      const { data: replication } = await supabase
        .from('products')
        .select('*')
        .limit(1);
      console.log('✅ 实时查询可用');
    } catch (e) {
      console.log('❌ 实时查询失败:', e.message);
    }

    // 6. 完整数据库检查
    console.log('\n6. 完整数据库检查...');
    const tables = ['products', 'contact_messages', 'page_contents', 'site_settings'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: 存在 ${data?.length || 0} 条记录`);
        }
      } catch (e) {
        console.log(`❌ ${table}: 表不存在或错误`);
      }
    }

    // 7. 提供完整SQL修复方案
    console.log('\n🔧 提供完整SQL修复方案...');
    console.log('请执行以下SQL命令：');
    console.log(`
-- 立即修复SQL命令
-- 1. 确保表存在
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255) NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  description_ru TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 启用RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. 创建权限策略
CREATE POLICY "公开可查看产品" ON products FOR SELECT 
  USING (is_active = true);

CREATE POLICY "管理员可管理产品" ON products FOR ALL 
  USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

-- 4. 插入测试数据
INSERT INTO products (product_code, name_zh, name_en, name_ru, description_zh, is_active, sort_order) VALUES 
('KARN-TEST', '测试产品', 'Test Product', 'Тестовый продукт', '这是测试产品', true, 1)
ON CONFLICT DO NOTHING;

-- 5. 验证数据
SELECT * FROM products LIMIT 5;
    `);

  } catch (error) {
    console.error('🚨 深度诊断错误:', error);
  }
}

// 执行诊断
deepDebug();