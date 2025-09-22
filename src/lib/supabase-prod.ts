// Supabase依赖已移除 - 使用Cloudflare D1数据库
// 此文件保留以避免破坏现有导入，但不再提供Supabase客户端

// 导出空对象以保持接口兼容性
export const supabase = {};

// 导出空函数以保持接口兼容性
export const checkConnection = async () => ({
  success: true,
  error: null,
  dataCount: 0
});

export const initializeDatabase = async () => ({
  connected: true,
  products: []
});

// Supabase依赖已完全移除
// 所有数据存储和认证现在使用Cloudflare D1数据库
// 请使用TempAuth或直接调用Cloudflare Worker API进行认证