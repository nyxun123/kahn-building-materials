import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w';

const supabase = createClient(supabaseUrl, supabaseKey);

// 产品图片映射关系
const productImageMap = [
  {
    product_code: 'KARN-100',
    image_url: '/images/wallpaper_glue_powder_product_packaging.jpg',
    name: '标准型墙纸胶粉'
  },
  {
    product_code: 'KARN-200',
    image_url: '/images/bison_universal_wallpaper_paste_packaging.jpg',
    name: '高级型墙纸胶粉'
  },
  {
    product_code: 'KARN-300',
    image_url: '/images/white_powder_building_material_samples.jpg',
    name: '环保型墙纸胶粉'
  },
  {
    product_code: 'KARN-OEM',
    image_url: '/images/OEM_custom_donut_packaging_branding.jpg',
    name: 'OEM贴牌定制'
  },
  {
    product_code: 'KARN-PRO',
    image_url: '/images/schoener_wohnen_wallpaper_glue_packaging_box.jpg',
    name: '专业装修型墙纸胶粉'
  },
  {
    product_code: 'KARN-SEMI',
    image_url: '/images/silver_aluminum_foil_small_packaging_pouches.jpg',
    name: '半成品墙纸胶（小包装）'
  }
];

async function updateProductImages() {
  console.log('开始更新产品图片...');

  for (const product of productImageMap) {
    try {
      // 先检查产品是否存在
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('product_code', product.product_code)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          console.log(`创建新产品: ${product.name} (${product.product_code})`);
          
          // 如果产品不存在，创建新产品
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              product_code: product.product_code,
              name_zh: product.name,
              name_en: product.name + ' (English)',
              name_ru: product.name + ' (Russian)',
              image_url: product.image_url,
              is_active: true,
              sort_order: parseInt(product.product_code.split('-')[1]) || 999
            });

          if (insertError) {
            console.error(`创建产品 ${product.product_code} 失败:`, insertError);
          } else {
            console.log(`产品 ${product.product_code} 创建成功`);
          }
        } else {
          console.error(`检查产品 ${product.product_code} 失败:`, checkError);
        }
      } else if (existingProduct) {
        // 如果产品存在，更新图片
        console.log(`更新产品图片: ${product.product_code}`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: product.image_url })
          .eq('id', existingProduct.id);

        if (updateError) {
          console.error(`更新产品 ${product.product_code} 图片失败:`, updateError);
        } else {
          console.log(`产品 ${product.product_code} 图片更新成功`);
        }
      }
    } catch (error) {
      console.error(`处理产品 ${product.product_code} 时出错:`, error);
    }
  }

  console.log('产品图片更新完成');
}

updateProductImages();
