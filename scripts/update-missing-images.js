// 更新所有缺失图片的产品
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('缺少 Supabase 凭证。请确保已设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 缺失图片的产品更新映射
const missingImageProducts = [
  { code: 'KARN999PLUS', image: '/images/white_powder_building_material_samples.jpg' },
  { code: 'KARNK6', image: '/images/white_powder_building_materials_display.jpg' },
  { code: 'TEST001', image: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg' }
];

async function main() {
  console.log('开始更新缺失图片的产品...');
  
  for (const product of missingImageProducts) {
    const { code, image } = product;
    try {
      const { error } = await supabase
        .from('products')
        .update({ image_url: image })
        .eq('product_code', code);
      
      if (error) {
        console.error(`更新产品 ${code} 图片失败:`, error.message);
      } else {
        console.log(`已更新产品 ${code} 的图片 URL 为 ${image}`);
      }
    } catch (error) {
      console.error(`更新产品 ${code} 时发生错误:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  console.log('产品图片更新完成!');
}

main().catch(error => {
  console.error('脚本执行失败:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
