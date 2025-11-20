#!/usr/bin/env node

/**
 * Favicon 设置脚本
 * 
 * 此脚本帮助设置网站的 favicon 和站点 logo
 * 
 * 使用方法：
 * 1. 将您的 logo 文件（PNG 或 SVG）放到 public/images/logo-source.png
 * 2. 运行：node scripts/setup-favicon.js
 * 3. 脚本会自动创建所有需要的 favicon 文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const imagesDir = path.join(publicDir, 'images');

// 需要的 favicon 尺寸
const FAVICON_SIZES = [
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-144x144.png', size: 144 },
  { name: 'apple-touch-icon.png', size: 180 },
];

// 检查源文件
function checkSourceFile() {
  const possibleSources = [
    'logo-source.png',
    'logo-source.svg',
    'logo.png',
    'karn-logo.png',
  ];

  for (const source of possibleSources) {
    const sourcePath = path.join(imagesDir, source);
    if (fs.existsSync(sourcePath)) {
      return { path: sourcePath, name: source };
    }
  }

  return null;
}

// 主函数
async function main() {
  console.log('🎨 Favicon 设置工具');
  console.log('═══════════════════════════════════════\n');

  // 检查源文件
  const source = checkSourceFile();
  
  if (!source) {
    console.log('❌ 未找到 logo 源文件\n');
    console.log('📋 请执行以下步骤：');
    console.log('1. 将您的 Karn logo 文件放到以下位置之一：');
    FAVICON_SIZES.forEach(({ name }) => {
      console.log(`   - public/images/logo-source.png`);
      console.log(`   - public/images/logo-source.svg`);
      console.log(`   - public/images/logo.png`);
    });
    console.log('\n2. 然后重新运行此脚本');
    console.log('\n💡 或者使用在线工具：');
    console.log('   - https://realfavicongenerator.net/');
    console.log('   - https://favicon.io/favicon-converter/');
    console.log('\n   上传您的 logo，下载生成的文件包，解压到 public/ 目录\n');
    process.exit(1);
  }

  console.log(`✅ 找到源文件: ${source.name}\n`);

  // 检查是否需要图片处理库
  try {
    // 尝试导入 sharp（如果已安装）
    const sharp = await import('sharp');
    console.log('✅ 检测到 sharp 图片处理库\n');
    console.log('📝 开始创建 favicon 文件...\n');

    // 读取源图片
    const image = sharp(source.path);
    const metadata = await image.metadata();
    console.log(`   源图片尺寸: ${metadata.width}x${metadata.height}`);

    // 创建各个尺寸的 favicon
    for (const { name, size } of FAVICON_SIZES) {
      const outputPath = path.join(publicDir, name);
      await image
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // 透明背景
        })
        .png()
        .toFile(outputPath);
      console.log(`   ✅ 创建: ${name} (${size}x${size})`);
    }

    // 创建 favicon.ico（需要多个尺寸）
    console.log('\n   📝 创建 favicon.ico...');
    console.log('   ⚠️  注意：favicon.ico 需要特殊工具创建');
    console.log('   💡 建议使用在线工具：https://favicon.io/favicon-converter/');
    console.log('      上传您的 logo，选择 ICO 格式下载\n');

    console.log('✅ Favicon 文件创建完成！\n');
    console.log('📋 下一步：');
    console.log('1. 使用在线工具创建 favicon.ico：');
    console.log('   https://favicon.io/favicon-converter/');
    console.log('2. 将下载的 favicon.ico 放到 public/ 目录');
    console.log('3. 运行构建和部署：');
    console.log('   pnpm build && bash deploy.sh --skip-build\n');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.log('⚠️  未安装图片处理库\n');
      console.log('📋 请使用以下方法之一：\n');
      console.log('方法 1：安装 sharp 库（推荐）');
      console.log('   pnpm add -D sharp\n');
      console.log('方法 2：使用在线工具（最简单）');
      console.log('   1. 访问 https://realfavicongenerator.net/');
      console.log('   2. 上传您的 logo 文件');
      console.log('   3. 下载生成的文件包');
      console.log('   4. 解压到 public/ 目录');
      console.log('   5. 运行构建和部署\n');
      process.exit(1);
    } else {
      console.error('❌ 处理图片时出错:', error.message);
      process.exit(1);
    }
  }
}

main();

