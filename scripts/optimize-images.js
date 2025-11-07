#!/usr/bin/env node

/**
 * 图片优化脚本
 * 使用 sharp 库压缩和转换图片为 WebP 格式
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/images-optimized'),
  webpQuality: 80,
  jpegQuality: 85,
  pngQuality: 85,
  maxWidth: 1920, // 最大宽度
  extensions: ['.jpg', '.jpeg', '.png'],
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 递归获取所有图片文件
async function getAllImages(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (CONFIG.extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  await scan(dir);
  return files;
}

// 优化单个图片
async function optimizeImage(inputPath) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const outputDir = path.dirname(path.join(CONFIG.outputDir, relativePath));
  const fileName = path.basename(inputPath, path.extname(inputPath));
  
  // 确保输出目录存在
  await fs.mkdir(outputDir, { recursive: true });
  
  try {
    // 读取原始图片信息
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    const originalSize = (await fs.stat(inputPath)).size;
    log(`\n处理: ${relativePath}`, 'blue');
    log(`  原始大小: ${(originalSize / 1024).toFixed(2)} KB`, 'yellow');
    log(`  尺寸: ${metadata.width}x${metadata.height}`, 'yellow');
    
    // 计算新尺寸（如果超过最大宽度）
    let width = metadata.width;
    let height = metadata.height;
    if (width > CONFIG.maxWidth) {
      width = CONFIG.maxWidth;
      height = Math.round((metadata.height / metadata.width) * CONFIG.maxWidth);
      log(`  调整尺寸: ${width}x${height}`, 'yellow');
    }
    
    // 转换为 WebP
    const webpPath = path.join(outputDir, `${fileName}.webp`);
    await sharp(inputPath)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: CONFIG.webpQuality })
      .toFile(webpPath);
    
    const webpSize = (await fs.stat(webpPath)).size;
    const savedPercent = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    log(`  ✅ WebP: ${(webpSize / 1024).toFixed(2)} KB (节省 ${savedPercent}%)`, 'green');
    
    // 也保存优化后的原格式（作为备用）
    const ext = path.extname(inputPath).toLowerCase();
    const optimizedPath = path.join(outputDir, `${fileName}${ext}`);
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: CONFIG.jpegQuality, progressive: true })
        .toFile(optimizedPath);
    } else if (ext === '.png') {
      await sharp(inputPath)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: CONFIG.pngQuality, compressionLevel: 9 })
        .toFile(optimizedPath);
    }
    
    const optimizedSize = (await fs.stat(optimizedPath)).size;
    const optimizedSavedPercent = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    log(`  ✅ 优化${ext}: ${(optimizedSize / 1024).toFixed(2)} KB (节省 ${optimizedSavedPercent}%)`, 'green');
    
    return {
      original: originalSize,
      webp: webpSize,
      optimized: optimizedSize,
      saved: originalSize - Math.min(webpSize, optimizedSize),
    };
    
  } catch (error) {
    log(`  ❌ 错误: ${error.message}`, 'red');
    return null;
  }
}

// 主函数
async function main() {
  log('\n🚀 开始图片优化...\n', 'blue');
  
  try {
    // 检查输入目录
    try {
      await fs.access(CONFIG.inputDir);
    } catch {
      log(`❌ 输入目录不存在: ${CONFIG.inputDir}`, 'red');
      process.exit(1);
    }
    
    // 清理输出目录
    try {
      await fs.rm(CONFIG.outputDir, { recursive: true, force: true });
    } catch {}
    
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // 获取所有图片
    const images = await getAllImages(CONFIG.inputDir);
    log(`找到 ${images.length} 张图片\n`, 'blue');
    
    if (images.length === 0) {
      log('没有找到需要优化的图片', 'yellow');
      return;
    }
    
    // 优化所有图片
    const results = [];
    for (const imagePath of images) {
      const result = await optimizeImage(imagePath);
      if (result) {
        results.push(result);
      }
    }
    
    // 统计
    const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
    const totalOptimized = results.reduce((sum, r) => sum + Math.min(r.webp, r.optimized), 0);
    const totalSaved = totalOriginal - totalOptimized;
    const savedPercent = ((totalSaved / totalOriginal) * 100).toFixed(1);
    
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('📊 优化统计', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log(`处理图片: ${results.length} 张`, 'green');
    log(`原始大小: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`, 'yellow');
    log(`优化后: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`, 'green');
    log(`节省: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${savedPercent}%)`, 'green');
    log('\n✅ 优化完成！', 'green');
    log(`\n📁 优化后的图片位置: ${CONFIG.outputDir}`, 'blue');
    
  } catch (error) {
    log(`\n❌ 发生错误: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();

