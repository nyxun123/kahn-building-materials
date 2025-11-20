#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const IMAGES_DIR = path.join(process.cwd(), 'public/images');
const OUTPUT_DIR = path.join(process.cwd(), 'public/images-optimized');

// 创建输出目录
await fs.mkdir(OUTPUT_DIR, { recursive: true });

// 获取所有图片文件
async function getAllImages(dir) {
  const files = [];

  async function scanDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  await scanDir(dir);
  return files;
}

// 检查是否安装了必要的工具
async function checkTools() {
  try {
    await execAsync('which cwebp');
    console.log('✅ cwebp 已安装');
    return true;
  } catch {
    console.log('❌ cwebp 未安装，尝试使用 ffmpeg...');
    try {
      await execAsync('which ffmpeg');
      console.log('✅ ffmpeg 已安装，将用于图片转换');
      return 'ffmpeg';
    } catch {
      console.log('❌ 需要安装图片处理工具');
      console.log('请安装: brew install webp 或 apt-get install webp');
      return false;
    }
  }
}

// 转换图片为WebP
async function convertToWebp(inputPath, outputPath, quality = 80) {
  const tool = await checkTools();

  if (!tool) {
    console.log('跳过图片转换:', inputPath);
    return false;
  }

  try {
    if (tool === 'ffmpeg') {
      await execAsync(`ffmpeg -i "${inputPath}" -quality ${quality} "${outputPath}" -y`);
    } else {
      await execAsync(`cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`);
    }

    const stats = await fs.stat(outputPath);
    const originalStats = await fs.stat(inputPath);
    const savings = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(outputPath)} (节省 ${savings}%)`);
    return true;
  } catch (error) {
    console.log(`❌ 转换失败 ${inputPath}:`, error.message);
    return false;
  }
}

// 创建响应式图片
async function createResponsiveImages(inputPath, relativePath) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outputBaseDir = path.join(OUTPUT_DIR, path.dirname(relativePath));

  // 确保输出目录存在
  await fs.mkdir(outputBaseDir, { recursive: true });

  const sizes = [400, 800, 1200, 1600];
  const results = [];

  for (const size of sizes) {
    const outputPath = path.join(outputBaseDir, `${baseName}-${size}.webp`);

    const tool = await checkTools();
    if (!tool) {
      continue;
    }

    try {
      if (tool === 'ffmpeg') {
        await execAsync(`ffmpeg -i "${inputPath}" -vf "scale=${size}:${size}:force_original_aspect_ratio=decrease" -quality 80 "${outputPath}" -y`);
      } else {
        await execAsync(`cwebp -q 80 -resize ${size} 0 "${inputPath}" -o "${outputPath}"`);
      }

      const stats = await fs.stat(outputPath);
      results.push({
        path: outputPath,
        size: stats.size,
        width: size
      });

      console.log(`✅ 创建响应式图片: ${baseName}-${size}.webp`);
    } catch (error) {
      console.log(`❌ 创建响应式图片失败 ${size}:`, error.message);
    }
  }

  return results;
}

// 主函数
async function main() {
  console.log('🚀 开始图片优化...\n');

  const tool = await checkTools();
  if (!tool) {
    console.log('请先安装图片处理工具后重试');
    process.exit(1);
  }

  const images = await getAllImages(IMAGES_DIR);
  console.log(`📊 找到 ${images.length} 张图片\n`);

  // 创建优化报告
  const report = {
    original: 0,
    optimized: 0,
    savings: 0,
    images: []
  };

  for (const imagePath of images) {
    const relativePath = path.relative(IMAGES_DIR, imagePath);
    console.log(`处理: ${relativePath}`);

    // 创建响应式图片
    const responsiveImages = await createResponsiveImages(imagePath, relativePath);

    // 创建原始大小的WebP版本
    const webpPath = path.join(OUTPUT_DIR, relativePath.replace(/\.[^/.]+$/, '.webp'));
    const webpDir = path.dirname(webpPath);
    await fs.mkdir(webpDir, { recursive: true });

    const success = await convertToWebp(imagePath, webpPath);

    if (success) {
      const originalStats = await fs.stat(imagePath);
      const optimizedStats = await fs.stat(webpPath);
      const savings = originalStats.size - optimizedStats.size;

      report.original += originalStats.size;
      report.optimized += optimizedStats.size;
      report.savings += savings;

      report.images.push({
        original: relativePath,
        optimized: relativePath.replace(/\.[^/.]+$/, '.webp'),
        responsive: responsiveImages.map(r => ({
          path: path.relative(OUTPUT_DIR, r.path),
          width: r.width,
          size: r.size
        })),
        originalSize: originalStats.size,
        optimizedSize: optimizedStats.size,
        savings: savings
      });
    }

    console.log('');
  }

  // 保存优化报告
  await fs.writeFile(
    path.join(process.cwd(), 'image-optimization-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('📊 优化完成！');
  console.log(`原始大小: ${(report.original / 1024 / 1024).toFixed(2)} MB`);
  console.log(`优化后大小: ${(report.optimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`节省空间: ${(report.savings / 1024 / 1024).toFixed(2)} MB (${((report.savings / report.original) * 100).toFixed(1)}%)`);
  console.log(`\n📄 详细报告已保存到: image-optimization-report.json`);
  console.log(`📁 优化后的图片位于: public/images-optimized/`);
}

main().catch(console.error);