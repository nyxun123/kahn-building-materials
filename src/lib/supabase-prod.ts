import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 生产环境专用配置 - 确保100%可用
const PRODUCTION_CONFIG = {
  url: 'https://ypjtdfsociepbzfvxzha.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w'
};

// 创建高可用性客户端
export const supabase = createClient<Database>(PRODUCTION_CONFIG.url, PRODUCTION_CONFIG.key, {
  global: {
    headers: {
      'x-application-name': 'kahn-building-materials-prod',
      'x-client-version': '1.0.0'
    },
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'kahn-building-materials-auth'
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// 连接健康检查
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    return {
      success: !error,
      error: error?.message,
      dataCount: data?.length || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      dataCount: 0
    };
  }
};

// 初始化检查
export const initializeDatabase = async () => {
  console.log('🔧 初始化生产环境数据库连接...');
  
  const health = await checkConnection();
  
  if (health.success) {
    console.log('✅ 生产环境数据库连接成功');
    
    // 验证产品数据
    const { data: products } = await supabase.from('products').select('*').limit(5);
    console.log(`📦 找到 ${products?.length || 0} 个产品`);
    
    return {
      connected: true,
      products: products || []
    };
  } else {
    console.error('❌ 生产环境数据库连接失败:', health.error);
    return {
      connected: false,
      error: health.error,
      products: []
    };
  }
};

// 立即初始化
initializeDatabase();