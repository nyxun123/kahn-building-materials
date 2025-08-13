// 检查产品图片URL
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('缺少 Supabase 凭证。请确保已设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  // 获取所有产品
  const { data, error } = await supabase
    .from('products')
    .select('id, product_code, name_zh, image_url')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  
  console.log('Products:');
  data.forEach(p => {
    console.log(`ID: ${p.id}, Code: ${p.product_code}, Name: ${p.name_zh}, Image: ${p.image_url || 'NULL'}`);
  });
}

main().catch(error => {
  console.error('脚本执行失败:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
