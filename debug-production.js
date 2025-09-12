// 生产环境诊断脚本
import { createClient } from '@supabase/supabase-js';

// 硬编码配置（避免环境变量问题）
const SUPABASE_URL = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnoseProduction() {
  console.log('🔍 生产环境诊断开始...\n');

  const results = {
    connection: false,
    auth: false,
    data: false,
    permissions: false,
    rls: false
  };

  try {
    // 1. 基础连接测试
    console.log('1. 测试基础连接...');
    const { data: health, error: connError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    if (connError) {
      console.error('❌ 连接失败:', connError);
      results.connection = false;
    } else {
      console.log('✅ 连接成功，找到', health.count, '个产品');
      results.connection = true;
    }

    // 2. 直接测试产品数据
    console.log('\n2. 测试产品数据查询...');
    const { data: products, error: dataError } = await supabase
      .from('products')
      .select('*')
      .limit(10);

    if (dataError) {
      console.error('❌ 数据查询失败:', dataError);
      results.data = false;
    } else {
      console.log('✅ 找到产品:', products?.length || 0);
      if (products && products.length > 0) {
        console.log('📦 产品示例:', products[0]);
      }
      results.data = true;
    }

    // 3. 测试RLS权限
    console.log('\n3. 测试RLS权限...');
    try {
      // 测试匿名访问
      const { data: publicData, error: publicError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (publicError) {
        console.error('❌ 匿名访问失败:', publicError);
        results.rls = false;
      } else {
        console.log('✅ 匿名访问成功:', publicData?.length || 0, '个活跃产品');
        results.rls = true;
      }
    } catch (e) {
      console.error('❌ RLS权限错误:', e);
    }

    // 4. 测试表结构
    console.log('\n4. 检查表结构...');
    try {
      const { data: schema, error: schemaError } = await supabase
        .from('products')
        .select('id, product_code, name_zh, name_en, name_ru, description_zh, is_active, sort_order')
        .limit(1);

      if (schemaError) {
        console.error('❌ 表结构错误:', schemaError);
      } else {
        console.log('✅ 表结构正常');
        console.log('📊 字段:', schema && schema.length > 0 ? Object.keys(schema[0]) : '无数据');
      }
    } catch (e) {
      console.error('❌ 表结构检查失败:', e);
    }

    // 5. 检查认证状态
    console.log('\n5. 检查认证状态...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('✅ 已登录:', session.user.email);
        results.auth = true;
      } else {
        console.log('⚠️ 未登录，将使用匿名访问');
        results.auth = false;
      }
    } catch (e) {
      console.error('❌ 认证检查失败:', e);
    }

    // 6. 检查网络请求
    console.log('\n6. 检查网络请求...');
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&limit=1`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      console.log('🌐 网络状态:', response.status, response.statusText);
      const data = await response.json();
      console.log('📄 返回数据:', data);
    } catch (e) {
      console.error('❌ 网络请求失败:', e);
    }

    // 7. 检查实时订阅
    console.log('\n7. 检查实时订阅...');
    try {
      const channel = supabase
        .channel('test_channel')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'products' },
          (payload) => console.log('🔄 实时更新:', payload)
        )
        .subscribe((status) => {
          console.log('📡 订阅状态:', status);
        });

      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 3000);
    } catch (e) {
      console.error('❌ 实时订阅失败:', e);
    }

    // 总结报告
    console.log('\n📋 诊断总结:');
    console.log('连接状态:', results.connection ? '✅' : '❌');
    console.log('数据状态:', results.data ? '✅' : '❌');
    console.log('权限状态:', results.rls ? '✅' : '❌');
    console.log('认证状态:', results.auth ? '✅' : '❌');

    return results;

  } catch (error) {
    console.error('🚨 诊断过程中出现错误:', error);
    return { connection: false, auth: false, data: false, permissions: false, rls: false };
  }
}

// 执行诊断
console.log('🚀 开始生产环境诊断...\n');
diagnoseProduction().then(results => {
  console.log('\n🔧 建议修复方案:');
  
  if (!results.connection) {
    console.log('1. 检查网络连接');
    console.log('2. 验证Supabase URL和KEY');
    console.log('3. 检查浏览器控制台错误');
  }
  
  if (!results.data) {
    console.log('4. 执行数据库修复SQL');
    console.log('5. 检查表是否存在');
  }
  
  if (!results.rls) {
    console.log('6. 检查RLS权限设置');
    console.log('7. 验证匿名访问权限');
  }
});