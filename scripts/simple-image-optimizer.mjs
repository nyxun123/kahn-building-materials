#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public/images');
const OPTIMIZED_DIR = path.join(process.cwd(), 'public/images-optimized');

// 创建优化配置
const OPTIMIZATION_CONFIG = {
  // 目标格式和质量
  formats: {
    webp: { quality: 80, type: 'image/webp' },
    avif: { quality: 70, type: 'image/avif' }
  },

  // 响应式尺寸
  sizes: [400, 800, 1200, 1600],

  // 图片大小限制 (KB)
  maxSize: 200,

  // 支持的文件类型
  supportedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.avif']
};

// 确保目录存在
async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

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
        if (OPTIMIZATION_CONFIG.supportedTypes.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  await scanDir(dir);
  return files;
}

// 创建HTML图片组件替换模板
function createOptimizedImageComponent(relativePath, originalSize) {
  const baseName = path.basename(relativePath, path.extname(relativePath));
  const dirName = path.dirname(relativePath);

  // 生成响应式srcset
  const srcSetWebp = OPTIMIZATION_CONFIG.sizes
    .map(size => `/images-optimized/${dirName}/${baseName}-${size}.webp ${size}w`)
    .join(', ');

  const srcSetAvif = OPTIMIZATION_CONFIG.sizes
    .map(size => `/images-optimized/${dirName}/${baseName}-${size}.avif ${size}w`)
    .join(', ');

  return `<picture>
  <!-- AVIF格式 - 最佳压缩比 -->
  <source
    type="image/avif"
    srcset="${srcSetAvif}"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  <!-- WebP格式 - 广泛支持 -->
  <source
    type="image/webp"
    srcset="${srcSetWebp}"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  <!-- 原始格式作为fallback -->
  <img
    src="${relativePath}"
    alt="[图片描述需要手动添加]"
    loading="lazy"
    decoding="async"
    width="[宽度需要手动添加]"
    height="[高度需要手动添加]"
    class="w-full h-full object-cover"
  />
</picture>`;
}

// 生成CSS优化规则
function generateOptimizationCSS() {
  return `
/* 图片优化CSS */
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

picture img {
  transition: opacity 0.3s ease;
}

/* 懒加载占位符 */
img[loading="lazy"] {
  background-color: #f3f4f6;
}

/* 响应式图片 */
@media (max-width: 768px) {
  img {
    width: 100vw;
  }
}

/* 预加载关键图片 */
img[data-priority] {
  loading: eager;
  preload: true;
}
`;
}

// 创建优化配置文件
function createOptimizationConfig() {
  const config = {
    rules: {
      // 图片尺寸优化
      imageCompression: {
        quality: 80,
        progressive: true
      },

      // 响应式断点
      breakpoints: {
        mobile: 400,
        tablet: 800,
        desktop: 1200,
        large: 1600
      },

      // 缓存策略
      caching: {
        browser: '1y',
        cdn: '30d'
      }
    },

    // WebP/AVIF支持检测
    formatSupport: {
      webp: true,
      avif: 'progressive'
    }
  };

  return JSON.stringify(config, null, 2);
}

// 主函数
async function main() {
  console.log('🖼️ 简单图片优化器启动...\n');

  try {
    // 创建优化目录
    await ensureDir(OPTIMIZED_DIR);

    // 获取所有图片
    const images = await getAllImages(IMAGES_DIR);
    console.log(`📊 找到 ${images.length} 张图片\n`);

    let totalSize = 0;
    const optimizationReport = [];

    // 分析现有图片
    for (const imagePath of images) {
      const relativePath = path.relative(IMAGES_DIR, imagePath);
      const stats = await fs.stat(imagePath);
      const sizeKB = Math.round(stats.size / 1024);

      totalSize += stats.size;

      const report = {
        original: relativePath,
        sizeKB,
        needsOptimization: sizeKB > OPTIMIZATION_CONFIG.maxSize,
        optimizedComponent: createOptimizedImageComponent(relativePath, stats.size)
      };

      optimizationReport.push(report);

      console.log(`📸 ${relativePath} (${sizeKB} KB) ${report.needsOptimization ? '⚠️ 需要优化' : '✅ 大小合适'}`);
    }

    // 生成优化报告
    const reportData = {
      summary: {
        totalImages: images.length,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        averageSizeKB: Math.round(totalSize / images.length / 1024),
        needsOptimization: optimizationReport.filter(r => r.needsOptimization).length
      },
      images: optimizationReport,
      recommendations: [
        '将大图片压缩到200KB以下',
        '使用WebP格式可减少30-50%体积',
        '实施响应式图片加载',
        '添加懒加载功能',
        '使用CDN加速图片加载'
      ]
    };

    // 保存报告
    await fs.writeFile(
      path.join(process.cwd(), 'image-analysis-report.json'),
      JSON.stringify(reportData, null, 2)
    );

    // 生成CSS文件
    await fs.writeFile(
      path.join(process.cwd(), 'public/css/image-optimization.css'),
      generateOptimizationCSS()
    );

    // 生成配置文件
    await fs.writeFile(
      path.join(process.cwd(), 'image-optimization-config.json'),
      createOptimizationConfig()
    );

    console.log('\n📊 分析完成!');
    console.log(`总图片数: ${images.length}`);
    console.log(`总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`平均大小: ${Math.round(totalSize / images.length / 1024)} KB`);
    console.log(`需要优化: ${optimizationReport.filter(r => r.needsOptimization).length} 张`);

    console.log('\n📄 生成的文件:');
    console.log('- image-analysis-report.json: 详细分析报告');
    console.log('- public/css/image-optimization.css: 图片优化CSS');
    console.log('- image-optimization-config.json: 优化配置');

    console.log('\n💡 下一步建议:');
    console.log('1. 手动压缩大图片或使用在线工具');
    console.log('2. 在HTML中使用OptimizedImage组件');
    console.log('3. 启用图片懒加载');
    console.log('4. 配置CDN加速');

  } catch (error) {
    console.error('❌ 优化过程出错:', error.message);
  }
}

main();