import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp'; // 需要安装: npm install sharp

class ImageOptimizationPlugin {
  constructor(options = {}) {
    this.options = {
      inputDir: 'public/images',
      outputDir: 'public/images-optimized',
      formats: ['webp', 'avif'],
      sizes: [400, 800, 1200, 1600],
      quality: 80,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'ImageOptimizationPlugin';

    compiler.hooks.beforeCompile.tapAsync(pluginName async (params, callback) => {
      console.log('🖼️ 开始图片优化...');
      await this.optimizeImages();
      callback();
    });
  }

  async optimizeImages() {
    const inputDir = path.resolve(this.options.inputDir);
    const outputDir = path.resolve(this.options.outputDir);

    try {
      // 检查sharp是否可用
      await this.checkSharp();

      // 确保输出目录存在
      await fs.mkdir(outputDir, { recursive: true });

      // 获取所有图片
      const images = await this.getAllImages(inputDir);
      console.log(`📊 找到 ${images.length} 张图片`);

      let totalOriginal = 0;
      let totalOptimized = 0;

      for (const imagePath of images) {
        const result = await this.processImage(imagePath, inputDir, outputDir);
        if (result) {
          totalOriginal += result.originalSize;
          totalOptimized += result.optimizedSize;
        }
      }

      const savings = totalOriginal - totalOptimized;
      const savingsPercent = ((savings / totalOriginal) * 100).toFixed(1);

      console.log('🎉 图片优化完成!');
      console.log(`原始大小: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
      console.log(`优化后大小: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
      console.log(`节省空间: ${(savings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`);

    } catch (error) {
      console.warn('⚠️ 图片优化失败:', error.message);
    }
  }

  async checkSharp() {
    try {
      const sharpInstance = await import('sharp');
      console.log('✅ Sharp 已安装，图片优化功能可用');
      return sharpInstance;
    } catch {
      console.warn('⚠️ Sharp 未安装，跳过图片优化');
      console.log('安装命令: npm install sharp');
      return null;
    }
  }

  async getAllImages(dir) {
    const files = [];

    async function scanDir(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }

    await scanDir(dir);
    return files;
  }

  async processImage(imagePath, inputDir, outputDir) {
    try {
      const sharpInstance = await import('sharp');
      if (!sharpInstance) return null;

      const relativePath = path.relative(inputDir, imagePath);
      const imageInfo = await sharpInstance.default(imagePath).metadata();
      const originalSize = (await fs.stat(imagePath)).size;

      // 创建输出目录
      const outputPath = path.join(outputDir, path.dirname(relativePath));
      await fs.mkdir(outputPath, { recursive: true });

      let totalOptimizedSize = 0;
      const baseName = path.basename(imagePath, path.extname(imagePath));

      // 生成不同尺寸的WebP图片
      for (const format of this.options.formats) {
        // 生成响应式尺寸
        for (const size of this.options.sizes) {
          // 跳过比原图更大的尺寸
          if (imageInfo.width && size > imageInfo.width) continue;

          const outputFileName = `${baseName}-${size}.${format}`;
          const outputFilePath = path.join(outputPath, outputFileName);

          await sharpInstance.default(imagePath)
            .resize(size, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .toFormat(format, {
              quality: this.options.quality,
              effort: 6 // 优化级别
            })
            .toFile(outputFilePath);

          const optimizedSize = (await fs.stat(outputFilePath)).size;
          totalOptimizedSize += optimizedSize;

          console.log(`✅ ${relativePath} -> ${outputFileName} (${this.formatSize(optimizedSize)})`);
        }

        // 生成原始大小的转换格式
        const outputFileName = `${baseName}.${format}`;
        const outputFilePath = path.join(outputPath, outputFileName);

        await sharpInstance.default(imagePath)
          .toFormat(format, {
            quality: this.options.quality,
            effort: 6
          })
          .toFile(outputFilePath);

        const optimizedSize = (await fs.stat(outputFilePath)).size;
        totalOptimizedSize += optimizedSize;

        console.log(`✅ ${relativePath} -> ${outputFileName} (${this.formatSize(optimizedSize)})`);
      }

      return {
        originalSize,
        optimizedSize: totalOptimizedSize / this.options.formats.length // 平均大小
      };

    } catch (error) {
      console.warn(`⚠️ 处理图片失败 ${imagePath}:`, error.message);
      return null;
    }
  }

  formatSize(bytes) {
    return bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`;
  }
}

export default ImageOptimizationPlugin;