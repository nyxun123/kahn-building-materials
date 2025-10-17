/**
 * 前端性能分析脚本
 * 全面分析当前前端应用的性能瓶颈
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 开始前端性能全面分析...\n');

// 1. 分析打包大小和bundle结构
function analyzeBundleSize() {
  console.log('📦 分析打包大小...');
  
  try {
    // 检查当前构建文件
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      console.log('📦 执行构建以分析打包大小...');
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    // 分析dist目录结构和文件大小
    function analyzeDirectory(dirPath, prefix = '') {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      let totalSize = 0;
      const results = [];
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          const subResults = analyzeDirectory(itemPath, prefix + '  ');
          results.push(...subResults.files);
          totalSize += subResults.totalSize;
        } else {
          const stats = fs.statSync(itemPath);
          const size = stats.size;
          totalSize += size;
          
          results.push({
            name: prefix + item.name,
            size: size,
            sizeKB: (size / 1024).toFixed(2),
            sizeMB: (size / 1024 / 1024).toFixed(2)
          });
        }
      }
      
      return { files: results, totalSize };
    }
    
    const analysis = analyzeDirectory(distPath);
    
    console.log('\n📊 构建产物分析:');
    console.log(`总大小: ${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // 按大小排序显示最大的文件
    const largeFiles = analysis.files
      .filter(f => f.size > 50 * 1024) // 大于50KB的文件
      .sort((a, b) => b.size - a.size)
      .slice(0, 20);
    
    console.log('\n🔴 大文件列表 (>50KB):');
    largeFiles.forEach(file => {
      console.log(`  ${file.name}: ${file.sizeKB} KB`);
    });
    
    return analysis;
    
  } catch (error) {
    console.error('❌ 打包分析失败:', error.message);
    return null;
  }
}

// 2. 分析依赖包大小
function analyzeDependencies() {
  console.log('\n📚 分析依赖包大小...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    console.log('\n🔍 主要依赖包:');
    
    // 分析一些关键依赖
    const keyDeps = [
      'react', 'react-dom', 'react-router-dom', 
      '@refinedev/core', '@radix-ui/react-dialog',
      '@tanstack/react-query', 'framer-motion',
      'react-i18next', 'lucide-react', 'react-icons'
    ];
    
    keyDeps.forEach(dep => {
      if (dependencies[dep]) {
        console.log(`  ${dep}: ${dependencies[dep]}`);
      }
    });
    
    console.log(`\n总依赖数量: ${Object.keys(dependencies).length}`);
    
  } catch (error) {
    console.error('❌ 依赖分析失败:', error.message);
  }
}

// 3. 分析代码分割情况
function analyzeCodeSplitting() {
  console.log('\n✂️ 分析代码分割...');
  
  try {
    // 检查路由配置中的懒加载
    const routerFile = fs.readFileSync('src/lib/router.tsx', 'utf-8');
    const lazyImports = routerFile.match(/lazy\(\(\) => import\([^)]+\)/g) || [];
    
    console.log(`✅ 发现 ${lazyImports.length} 个懒加载路由组件`);
    lazyImports.forEach((imp, index) => {
      console.log(`  ${index + 1}. ${imp}`);
    });
    
    // 检查vite配置中的manualChunks
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf-8');
    const hasManualChunks = viteConfig.includes('manualChunks');
    
    console.log(`${hasManualChunks ? '✅' : '❌'} Vite手动分包配置: ${hasManualChunks ? '已配置' : '未配置'}`);
    
    if (hasManualChunks) {
      const chunksMatch = viteConfig.match(/manualChunks:\s*{([^}]+)}/s);
      if (chunksMatch) {
        console.log('📦 当前分包配置:');
        const chunks = chunksMatch[1].split(',').map(chunk => chunk.trim()).filter(Boolean);
        chunks.forEach(chunk => {
          console.log(`  ${chunk}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ 代码分割分析失败:', error.message);
  }
}

// 4. 分析API请求性能
function analyzeAPIPerformance() {
  console.log('\n🌐 分析API请求模式...');
  
  try {
    // 检查页面组件中的API调用
    const pagesDir = 'src/pages';
    const apiPatterns = [];
    
    function scanDirectory(dirPath) {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
          const content = fs.readFileSync(itemPath, 'utf-8');
          
          // 查找fetch调用
          const fetchCalls = content.match(/fetch\([^)]+\)/g) || [];
          const useEffectCount = (content.match(/useEffect/g) || []).length;
          const useStateCount = (content.match(/useState/g) || []).length;
          
          if (fetchCalls.length > 0 || useEffectCount > 2) {
            apiPatterns.push({
              file: itemPath,
              fetchCalls: fetchCalls.length,
              useEffects: useEffectCount,
              useStates: useStateCount,
              hasLoadingState: content.includes('setLoading') || content.includes('isLoading'),
              hasErrorHandling: content.includes('catch') || content.includes('setError')
            });
          }
        }
      }
    }
    
    scanDirectory(pagesDir);
    
    console.log('📊 页面API调用分析:');
    apiPatterns.forEach(pattern => {
      const fileName = pattern.file.replace('src/pages/', '');
      console.log(`\n  📄 ${fileName}:`);
      console.log(`    - API调用: ${pattern.fetchCalls}次`);
      console.log(`    - useEffect: ${pattern.useEffects}个`);
      console.log(`    - useState: ${pattern.useStates}个`);
      console.log(`    - 加载状态: ${pattern.hasLoadingState ? '✅' : '❌'}`);
      console.log(`    - 错误处理: ${pattern.hasErrorHandling ? '✅' : '❌'}`);
    });
    
    // 潜在问题识别
    console.log('\n⚠️ 潜在性能问题:');
    
    const highAPIUsage = apiPatterns.filter(p => p.fetchCalls > 2);
    if (highAPIUsage.length > 0) {
      console.log(`  🔴 高API调用页面 (>2次): ${highAPIUsage.length}个`);
      highAPIUsage.forEach(p => {
        console.log(`    - ${p.file}: ${p.fetchCalls}次API调用`);
      });
    }
    
    const manyEffects = apiPatterns.filter(p => p.useEffects > 3);
    if (manyEffects.length > 0) {
      console.log(`  🔴 复杂副作用页面 (>3个useEffect): ${manyEffects.length}个`);
    }
    
    const noLoadingState = apiPatterns.filter(p => !p.hasLoadingState && p.fetchCalls > 0);
    if (noLoadingState.length > 0) {
      console.log(`  🔴 缺少加载状态的页面: ${noLoadingState.length}个`);
    }
    
  } catch (error) {
    console.error('❌ API性能分析失败:', error.message);
  }
}

// 5. 分析图片和静态资源
function analyzeStaticAssets() {
  console.log('\n🖼️ 分析静态资源...');
  
  try {
    const publicDir = 'public';
    const srcAssets = 'src/assets';
    
    function analyzeAssetDir(dirPath, dirName) {
      if (!fs.existsSync(dirPath)) {
        console.log(`  ⚠️ ${dirName} 目录不存在`);
        return;
      }
      
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      let totalSize = 0;
      const imageFiles = [];
      
      files.forEach(file => {
        if (file.isFile()) {
          const filePath = path.join(dirPath, file.name);
          const stats = fs.statSync(filePath);
          const ext = path.extname(file.name).toLowerCase();
          
          if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'].includes(ext)) {
            imageFiles.push({
              name: file.name,
              size: stats.size,
              sizeKB: (stats.size / 1024).toFixed(2),
              ext: ext
            });
            totalSize += stats.size;
          }
        }
      });
      
      console.log(`\n  📁 ${dirName}:`);
      console.log(`    总大小: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`    图片数量: ${imageFiles.length}`);
      
      // 显示较大的图片文件
      const largeImages = imageFiles.filter(f => f.size > 100 * 1024); // >100KB
      if (largeImages.length > 0) {
        console.log(`    🔴 大图片文件 (>100KB): ${largeImages.length}个`);
        largeImages.forEach(img => {
          console.log(`      - ${img.name}: ${img.sizeKB} KB`);
        });
      }
      
      // 建议优化的图片格式
      const jpgPngFiles = imageFiles.filter(f => ['.jpg', '.jpeg', '.png'].includes(f.ext));
      if (jpgPngFiles.length > 0) {
        console.log(`    💡 可优化为WebP格式: ${jpgPngFiles.length}个文件`);
      }
    }
    
    analyzeAssetDir(publicDir, 'public');
    analyzeAssetDir(srcAssets, 'src/assets');
    
  } catch (error) {
    console.error('❌ 静态资源分析失败:', error.message);
  }
}

// 6. 检查性能监控和缓存策略
function analyzePerformanceConfig() {
  console.log('\n⚡ 分析性能配置...');
  
  try {
    // 检查是否有性能监控组件
    const hasPerformanceMonitor = fs.existsSync('src/components/PerformanceMonitor.tsx');
    console.log(`${hasPerformanceMonitor ? '✅' : '❌'} 性能监控组件: ${hasPerformanceMonitor ? '已配置' : '未配置'}`);
    
    // 检查懒加载组件
    const hasLazyImage = fs.existsSync('src/components/LazyImage.tsx');
    console.log(`${hasLazyImage ? '✅' : '❌'} 图片懒加载组件: ${hasLazyImage ? '已配置' : '未配置'}`);
    
    // 检查缓存配置
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf-8');
    const hasCacheConfig = viteConfig.includes('cache') || viteConfig.includes('chunkFileNames');
    console.log(`${hasCacheConfig ? '✅' : '❌'} 构建缓存配置: ${hasCacheConfig ? '已配置' : '未配置'}`);
    
    // 检查预构建优化
    const hasOptimizeDeps = viteConfig.includes('optimizeDeps');
    console.log(`${hasOptimizeDeps ? '✅' : '❌'} 依赖预构建: ${hasOptimizeDeps ? '已配置' : '未配置'}`);
    
    // 检查PWA或Service Worker
    const hasServiceWorker = fs.existsSync('public/sw.js') || 
                           fs.existsSync('src/sw.js') ||
                           viteConfig.includes('workbox') ||
                           viteConfig.includes('VitePWA');
    console.log(`${hasServiceWorker ? '✅' : '❌'} Service Worker/PWA: ${hasServiceWorker ? '已配置' : '未配置'}`);
    
    // 检查gzip/brotli压缩
    const hasCompression = viteConfig.includes('compression') || viteConfig.includes('gzip');
    console.log(`${hasCompression ? '✅' : '❌'} 静态资源压缩: ${hasCompression ? '已配置' : '未配置'}`);
    
  } catch (error) {
    console.error('❌ 性能配置分析失败:', error.message);
  }
}

// 7. 生成性能优化建议
function generateOptimizationRecommendations() {
  console.log('\n\n🎯 性能优化建议:');
  
  console.log('\n1. 🚀 立即可实施的优化:');
  console.log('   - 添加更多的代码分割点，特别是admin页面');
  console.log('   - 实施图片压缩和WebP格式转换');
  console.log('   - 添加Service Worker进行资源缓存');
  console.log('   - 优化第三方依赖包的体积');
  
  console.log('\n2. 📦 构建优化:');
  console.log('   - 配置更细粒度的chunk分割');
  console.log('   - 启用tree-shaking和dead code elimination');
  console.log('   - 添加资源压缩插件(gzip/brotli)');
  console.log('   - 配置长期缓存策略');
  
  console.log('\n3. 🌐 运行时优化:');
  console.log('   - 实施API请求去重和缓存');
  console.log('   - 添加组件级的memo和useMemo');
  console.log('   - 实施虚拟滚动(如果有长列表)');
  console.log('   - 优化重渲染性能');
  
  console.log('\n4. 📊 监控和分析:');
  console.log('   - 集成Web Vitals监控');
  console.log('   - 添加性能预算配置');
  console.log('   - 配置lighthouse CI');
  console.log('   - 实施错误监控和性能追踪');
}

// 执行所有分析
async function runFullAnalysis() {
  try {
    console.log('📈 前端性能全面分析报告');
    console.log('=' .repeat(50));
    
    const bundleAnalysis = analyzeBundleSize();
    analyzeDependencies();
    analyzeCodeSplitting();
    analyzeAPIPerformance();
    analyzeStaticAssets();
    analyzePerformanceConfig();
    generateOptimizationRecommendations();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 性能分析完成！');
    
    // 生成报告文件
    const report = {
      timestamp: new Date().toISOString(),
      bundleSize: bundleAnalysis ? `${(bundleAnalysis.totalSize / 1024 / 1024).toFixed(2)} MB` : 'N/A',
      recommendations: [
        'Code splitting optimization',
        'Image compression and WebP conversion',
        'Service Worker implementation',
        'API request optimization',
        'Bundle size reduction'
      ]
    };
    
    fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
    console.log('📊 性能报告已保存到 performance-report.json');
    
  } catch (error) {
    console.error('❌ 性能分析失败:', error);
  }
}

runFullAnalysis();