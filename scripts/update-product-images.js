// 更新产品图片URL
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('缺少 Supabase 凭证。请确保已设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const productImageMapping = [
  { code: 'KARN999', image: '/images/wallpaper_glue_powder_product_packaging.jpg' },
  { code: 'KARN-STD', image: '/images/wallpaper_glue_powder_product_packaging.jpg' },
  { code: 'KARN-PRO', image: '/images/premium_wallpaper_adhesive_packaging_green.jpg' },
  { code: 'KARN-ECO', image: '/images/eco_friendly_natural_products_collage.jpg' },
  { code: 'KARN-SEMI', image: '/images/silver_aluminum_foil_small_packaging_pouches.jpg' },
  { code: 'KARN-OEM', image: '/images/OEM_custom_donut_packaging_branding.jpg' },
];

async function main() {
  console.log('开始更新产品图片...');
  
  for (const product of productImageMapping) {
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
