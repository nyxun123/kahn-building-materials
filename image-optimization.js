/**
 * 图片优化脚本
 * 自动压缩和转换项目中的图片文件
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🖼️ 开始图片优化处理...\n');

// 检查是否安装了图片处理工具
function checkImageTools() {
  const tools = ['sharp', 'imagemin'];
  const availableTools = [];
  
  for (const tool of tools) {
    try {
      execSync(`npm list ${tool}`, { stdio: 'pipe' });
      availableTools.push(tool);
    } catch (error) {
      console.log(`⚠️ ${tool} 未安装，建议安装以进行图片优化`);
    }
  }
  
  return availableTools;
}

// 分析图片文件
function analyzeImages() {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const largeImages = [];
  const allImages = [];
  
  function scanDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativeItemPath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        // 跳过一些不需要处理的目录
        if (!['node_modules', '.git', 'dist'].includes(item.name)) {
          scanDirectory(fullPath, relativeItemPath);
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          const stats = fs.statSync(fullPath);
          const imageInfo = {
            name: item.name,
            path: fullPath,
            relativePath: relativeItemPath,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024),
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
            ext: ext
          };
          
          allImages.push(imageInfo);
          
          // 标记大于500KB的图片
          if (stats.size > 500 * 1024) {
            largeImages.push(imageInfo);
          }
        }
      }
    }
  }
  
  // 扫描项目目录
  scanDirectory('.');
  
  return { allImages, largeImages };
}

// 生成WebP版本（模拟，实际需要sharp或其他工具）
function generateWebPVersions(images) {
  console.log('📝 生成WebP优化建议...\n');
  
  const suggestions = [];
  
  images.forEach(image => {
    if (['.jpg', '.jpeg', '.png'].includes(image.ext)) {
      const webpPath = image.path.replace(image.ext, '.webp');
      const suggestion = {
        original: image.path,
        webp: webpPath,
        expectedSavings: Math.round(image.size * 0.3), // WebP通常能节省30%左右
        command: `# 使用sharp转换命令:\n# npx sharp -i "${image.path}" -o "${webpPath}" --webp`
      };
      suggestions.push(suggestion);
    }
  });
  
  return suggestions;
}

// 生成图片优化报告
function generateOptimizationReport(allImages, largeImages, webpSuggestions) {
  console.log('📊 图片优化分析报告:');
  console.log('=' .repeat(50));
  
  const totalSize = allImages.reduce((sum, img) => sum + img.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log(`📈 总体统计:`);
  console.log(`  图片总数: ${allImages.length}`);
  console.log(`  总大小: ${totalSizeMB} MB`);
  console.log(`  大文件数量 (>500KB): ${largeImages.length}`);
  
  if (largeImages.length > 0) {
    console.log(`\n🔴 需要优化的大图片文件:`);
    largeImages.slice(0, 10).forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.relativePath}: ${img.sizeKB} KB`);
    });
    
    if (largeImages.length > 10) {
      console.log(`  ... 还有 ${largeImages.length - 10} 个大文件`);
    }
  }
  
  // 分析图片格式分布
  const formatStats = {};
  allImages.forEach(img => {
    const ext = img.ext;
    if (!formatStats[ext]) {
      formatStats[ext] = { count: 0, totalSize: 0 };
    }
    formatStats[ext].count++;
    formatStats[ext].totalSize += img.size;
  });
  
  console.log(`\n📊 图片格式分布:`);
  Object.entries(formatStats).forEach(([ext, stats]) => {
    const avgSize = Math.round(stats.totalSize / stats.count / 1024);
    const totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
    console.log(`  ${ext}: ${stats.count}个文件, 总计${totalSizeMB}MB, 平均${avgSize}KB`);
  });
  
  // WebP优化建议
  if (webpSuggestions.length > 0) {
    console.log(`\n💡 WebP优化建议:`);
    console.log(`  可转换为WebP: ${webpSuggestions.length}个文件`);
    
    const potentialSavings = webpSuggestions.reduce((sum, s) => sum + s.expectedSavings, 0);
    const potentialSavingsMB = (potentialSavings / (1024 * 1024)).toFixed(2);
    console.log(`  预计节省空间: ${potentialSavingsMB} MB`);
    
    console.log(`\n  示例转换命令:`);
    webpSuggestions.slice(0, 3).forEach(s => {
      console.log(`    ${s.command.split('\\n')[1]}`);
    });
  }
}

// 生成优化脚本
function generateOptimizationScript(largeImages, webpSuggestions) {
  const scriptContent = `#!/bin/bash
# 图片优化脚本
# 自动生成于 ${new Date().toISOString()}

echo "🖼️ 开始图片优化..."

# 检查依赖
if ! command -v npx &> /dev/null; then
    echo "❌ npx 未找到，请安装 Node.js"
    exit 1
fi

# 安装 sharp（如果未安装）
if ! npm list sharp &> /dev/null; then
    echo "📦 安装 sharp..."
    npm install sharp
fi

# 创建优化后的目录
mkdir -p optimized-images

${webpSuggestions.slice(0, 10).map(s => `
# 优化: ${s.original}
echo "处理: ${path.basename(s.original)}"
npx sharp -i "${s.original}" -o "optimized-images/${path.basename(s.webp)}" --webp --quality 85
`).join('')}

echo "✅ 图片优化完成！"
echo "📁 优化后的图片保存在 optimized-images/ 目录"
echo "💡 请手动检查质量后替换原文件"
`;

  fs.writeFileSync('optimize-images.sh', scriptContent);
  console.log('\n📝 已生成图片优化脚本: optimize-images.sh');
  console.log('   运行命令: chmod +x optimize-images.sh && ./optimize-images.sh');
}

// 生成现代图片格式的HTML替换建议
function generateHTMLSuggestions(webpSuggestions) {
  console.log('\n🔧 HTML优化建议:');
  console.log('  使用 <picture> 元素支持多种格式:');
  
  const example = webpSuggestions[0];
  if (example) {
    const originalName = path.basename(example.original);
    const webpName = path.basename(example.webp);
    
    console.log(`
  <picture>
    <source srcset="/images/${webpName}" type="image/webp">
    <img src="/images/${originalName}" alt="描述文字" loading="lazy">
  </picture>
    `);
  }
}

// 生成CSS优化建议
function generateCSSOptimizations() {
  console.log('\n🎨 CSS图片优化建议:');
  console.log('  1. 使用 background-image 的现代语法:');
  console.log(`
  .hero-image {
    background-image: 
      url('image.webp'),
      url('image.jpg'); /* fallback */
  }
  `);
  
  console.log('  2. 添加图片加载优化:');
  console.log(`
  img {
    loading: lazy;
    decoding: async;
    content-visibility: auto;
  }
  `);
}

// 主函数
async function optimizeImages() {
  try {
    console.log('🔍 检查图片处理工具...');
    const availableTools = checkImageTools();
    
    console.log('\n📊 分析项目中的图片文件...');
    const { allImages, largeImages } = analyzeImages();
    
    if (allImages.length === 0) {
      console.log('✅ 项目中没有发现图片文件');
      return;
    }
    
    console.log('\n🔄 生成WebP优化建议...');
    const webpSuggestions = generateWebPVersions(largeImages);
    
    generateOptimizationReport(allImages, largeImages, webpSuggestions);
    
    if (largeImages.length > 0) {
      generateOptimizationScript(largeImages, webpSuggestions);
      generateHTMLSuggestions(webpSuggestions);
    }
    
    generateCSSOptimizations();
    
    // 生成图片优化配置
    const optimizationConfig = {
      timestamp: new Date().toISOString(),
      totalImages: allImages.length,
      largeImages: largeImages.length,
      totalSizeMB: (allImages.reduce((sum, img) => sum + img.size, 0) / (1024 * 1024)).toFixed(2),
      optimizationRecommendations: {
        webpConversion: webpSuggestions.length,
        potentialSavingsMB: (webpSuggestions.reduce((sum, s) => sum + s.expectedSavings, 0) / (1024 * 1024)).toFixed(2)
      }
    };
    
    fs.writeFileSync('image-optimization-report.json', JSON.stringify(optimizationConfig, null, 2));
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 图片优化分析完成！');
    console.log('📊 详细报告已保存到 image-optimization-report.json');
    
    if (availableTools.length === 0) {
      console.log('\n💡 建议安装图片处理工具:');
      console.log('   npm install sharp imagemin imagemin-webp');
    }
    
  } catch (error) {
    console.error('❌ 图片优化失败:', error);
  }
}

optimizeImages();