import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 创建Supabase客户端
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少Supabase环境变量配置');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
