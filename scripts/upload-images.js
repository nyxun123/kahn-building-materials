// 上传产品图片到 Supabase Storage 并更新数据库
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 中获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取 Supabase 凭证
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('缺少 Supabase 凭证。请确保已设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 产品图片映射关系 - 根据实际情况调整
const productImageMapping = [
  { code: 'KARN-STD', image: 'wallpaper_glue_powder_product_packaging.jpg' },
  { code: 'KARN-PRO', image: 'premium_wallpaper_adhesive_packaging_green.jpg' },
  { code: 'KARN-ECO', image: 'eco_friendly_natural_products_collage.jpg' },
  { code: 'KARN-SEMI', image: 'silver_aluminum_foil_small_packaging_pouches.jpg' },
  { code: 'KARN-OEM', image: 'OEM_custom_donut_packaging_branding.jpg' },
];

// 上传图片到 Supabase Storage
async function uploadImage(filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(fileName);
    const contentType = fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png';
    
    // 使用已存在的 'images' 存储桶
    // 上传文件到 images 存储桶
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`products/${fileName}`, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      throw new Error(`上传图片失败: ${error.message}`);
    }

    // 获取图片的公共 URL
    const { data: publicURL } = supabase
      .storage
      .from('images')
      .getPublicUrl(`products/${fileName}`);

    console.log(`图片 ${fileName} 上传成功: ${publicURL.publicUrl}`);
    return publicURL.publicUrl;
  } catch (error) {
    console.error(`上传图片 ${fileName} 失败:`, error);
    return null;
  }
}

// 更新数据库中的产品图片 URL
async function updateProductImageUrl(productCode, imageUrl) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('product_code', productCode);

    if (error) {
      throw new Error(`更新产品图片 URL 失败: ${error.message}`);
    }

    console.log(`产品 ${productCode} 的图片 URL 已更新`);
    return true;
  } catch (error) {
    console.error(`更新产品 ${productCode} 的图片 URL 失败:`, error);
    return false;
  }
}

// 主函数 - 上传所有产品图片并更新数据库
async function main() {
  console.log('开始上传产品图片并更新数据库...');
  
  // 先创建 products 目录
  try {
    await supabase.storage.from('images').list('products');
  } catch (error) {
    console.log('创建 products 目录...');
  }
  
  // 遍历产品图片映射关系
  for (const product of productImageMapping) {
    const { code, image } = product;
    const imagePath = path.join(__dirname, '../public/images', image);
    
    // 检查图片文件是否存在
    if (!fs.existsSync(imagePath)) {
      console.warn(`图片文件 ${imagePath} 不存在，跳过...`);
      continue;
    }
    
    // 上传图片到 Supabase Storage
    console.log(`正在上传图片 ${image} 到 Supabase Storage...`);
    const imageUrl = await uploadImage(imagePath, image);
    
    if (imageUrl) {
      // 更新数据库中的产品图片 URL
      console.log(`正在更新产品 ${code} 的图片 URL...`);
      await updateProductImageUrl(code, imageUrl);
    }
  }
  
  console.log('所有产品图片上传和数据库更新已完成！');
}

// 执行主函数
main().catch(error => {
  console.error('脚本执行失败:', error);
  process.exit(1);
});
