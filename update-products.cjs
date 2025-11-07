const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 定义包装信息常量
const packagingInfo = `
  packaging: {
    bag_weight_zh: '20公斤/袋',
    bag_weight_en: '20 kg/bag',
    bag_weight_ru: '20 кг/мешок',
    bags_per_ton_zh: '50袋/吨',
    bags_per_ton_en: '50 bags/ton',
    bags_per_ton_ru: '50 мешков/тонна',
    material_zh: '牛皮纸袋+内膜袋包装',
    material_en: 'Kraft paper bag + inner film bag packaging',
    material_ru: 'Крафт-бумажный мешок + внутренний пленочный мешок'
  }`;

// 更新所有 image_url 为 IMG_1412.JPG
content = content.replace(/image_url: '\/images\/应用领域\/.*?'/g, "image_url: '/images/IMG_1412.JPG'");
content = content.replace(/image_url: '\/images\/.*?\.jpg'/g, "image_url: '/images/IMG_1412.JPG'");
content = content.replace(/image_url: '\/images\/.*?\.jpeg'/gi, "image_url: '/images/IMG_1412.JPG'");
content = content.replace(/image_url: '\/images\/.*?\.png'/g, "image_url: '/images/IMG_1412.JPG'");
content = content.replace(/image_url: '\/images\/.*?\.JPG'/g, "image_url: '/images/IMG_1412.JPG'");

// 在每个 category 前面添加 packaging 信息（只要该产品还没有packaging）
content = content.replace(/(\s+)(category: '[^']+')(\s+)(\})/g, (match, space1, category, space2, closeBrace) => {
  // 检查前面是否已经有packaging
  const beforeMatch = content.substring(0, content.indexOf(match));
  const lastProductStart = beforeMatch.lastIndexOf("product_code:");
  const productSection = content.substring(lastProductStart, content.indexOf(match) + match.length);
  
  if (productSection.includes('packaging:')) {
    return match; // 已经有packaging，不添加
  }
  
  return `${space1}${packagingInfo},\n${space1}${category}${space2}${closeBrace}`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 产品信息已更新！');
console.log('  - 所有产品图片已更新为 IMG_1412.JPG');
console.log('  - 所有产品已添加包装信息（20kg/袋，50袋/吨，牛皮纸袋+内膜袋）');

