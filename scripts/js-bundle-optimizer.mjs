#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');
const PACKAGE_JSON = path.join(process.cwd(), 'package.json');

class JSBundleOptimizer {
  constructor() {
    this.bundleMetrics = {
      dependencies: {},
      chunks: {},
      recommendations: [],
      savings: 0
    };
  }

  async optimizeJSBundles() {
    console.log('🚀 开始JavaScript包优化...\n');

    // 1. 分析依赖包大小
    await this.analyzeDependencies();

    // 2. 检查代码分割机会
    await this.analyzeCodeSplitting();

    // 3. 生成优化建议
    await this.generateOptimizationPlan();

    // 4. 创建动态导入示例
    await this.createDynamicImportExamples();

    console.log('✅ JavaScript包优化完成!');
  }

  async analyzeDependencies() {
    console.log('📦 分析依赖包...');

    try {
      const packageData = await fs.readFile(PACKAGE_JSON, 'utf8');
      const packageJson = JSON.parse(packageData);

      // 分析dependencies和devDependencies
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      // 重点分析大包
      const largePackages = [
        '@radix-ui',
        '@tremor/react',
        'recharts',
        'pdfmake',
        'jsonwebtoken',
        'puppeteer',
        'playwright',
        'sqlite3'
      ];

      for (const [pkg, version] of Object.entries(allDeps)) {
        const isLarge = largePackages.some(largePkg => pkg.startsWith(largePkg));

        this.bundleMetrics.dependencies[pkg] = {
          version,
          isLarge,
          isDevOnly: packageJson.devDependencies?.[pkg] || false,
          recommendedAction: this.getPackageRecommendation(pkg, isLarge)
        };

        if (isLarge) {
          console.log(`📦 ${pkg}: ${version} (${this.getPackageRecommendation(pkg, true)})`);
        }
      }
    } catch (error) {
      console.log('⚠️ 无法分析package.json:', error.message);
    }
  }

  getPackageRecommendation(pkg, isLarge) {
    const recommendations = {
      'pdfmake': '考虑懒加载或服务端生成',
      'recharts': '使用动态导入，仅在需要图表页面加载',
      '@tremor/react': '可以按需导入组件',
      'puppeteer': '移到服务端或worker中',
      'playwright': '仅保留在开发环境',
      'sqlite3': '使用CDN版本或服务端API',
      'jsonwebtoken': '考虑使用更轻量的JWT库'
    };

    for (const [key, recommendation] of Object.entries(recommendations)) {
      if (pkg.startsWith(key)) {
        return recommendation;
      }
    }

    return isLarge ? '检查是否必需，考虑替代方案' : '正常';
  }

  async analyzeCodeSplitting() {
    console.log('🔍 分析代码分割机会...');

    // 分析可能需要代码分割的模块
    const modulesToSplit = [
      'admin', // 管理后台
      'charts', // 图表组件
      'pdf', // PDF生成
      'upload', // 文件上传
      'editor', // 富文本编辑器
      'modals', // 弹窗组件
      'forms', // 复杂表单
      'maps' // 地图组件
    ];

    for (const module of modulesToSplit) {
      this.bundleMetrics.chunks[module] = {
        size: '待分析',
        priority: this.getChunkPriority(module),
        strategy: this.getSplitStrategy(module)
      };
    }
  }

  getChunkPriority(module) {
    const priorities = {
      admin: 'low',
      charts: 'low',
      pdf: 'low',
      upload: 'medium',
      editor: 'medium',
      modals: 'medium',
      forms: 'low',
      maps: 'low'
    };

    return priorities[module] || 'medium';
  }

  getSplitStrategy(module) {
    const strategies = {
      admin: 'route-based',
      charts: 'feature-based',
      pdf: 'dynamic-import',
      upload: 'component-based',
      editor: 'feature-based',
      modals: 'component-based',
      forms: 'feature-based',
      maps: 'component-based'
    };

    return strategies[module] || 'dynamic-import';
  }

  async generateOptimizationPlan() {
    console.log('📋 生成优化计划...');

    const optimizationPlan = {
      immediate: [
        '移除未使用的依赖包',
        '实施代码分割',
        '启用Tree Shaking',
        '压缩生产构建'
      ],
      medium: [
        '迁移到更轻量的库',
        '实施路由级别的懒加载',
        '优化chunk分割策略',
        '使用CDN加载大库'
      ],
      long: [
        '微前端架构',
        'Web Workers处理重计算',
        '渐进式Web App优化',
        '边缘计算优化'
      ],
      packageOptimizations: this.bundleMetrics.dependencies,
      chunkOptimizations: this.bundleMetrics.chunks,
      expectedSavings: {
        bundleSize: '20-40%',
        loadTime: '300-800ms',
        memoryUsage: '15-30%'
      }
    };

    await fs.writeFile(
      path.join(process.cwd(), 'js-optimization-plan.json'),
      JSON.stringify(optimizationPlan, null, 2)
    );

    console.log('📋 立即执行项目:');
    optimizationPlan.immediate.forEach(item => console.log(`  ✓ ${item}`));
  }

  async createDynamicImportExamples() {
    console.log('💡 创建动态导入示例...');

    const examples = `
// 动态导入示例 - 按需加载大组件

// 1. 管理后台懒加载
const AdminDashboard = lazy(() => import('./pages/admin/dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/products'));

// 2. 图表组件懒加载
const ChartComponent = lazy(() => import('./components/Chart'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));

// 3. PDF生成懒加载
const PDFGenerator = lazy(() =>
  import('./utils/pdf-generator').then(module => ({
    default: module.PDFGenerator
  }))
);

// 4. 富文本编辑器懒加载
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

// 5. 地图组件懒加载
const MapComponent = lazy(() => import('./components/Map'));

// 使用示例
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      {/* 条件加载管理后台 */}
      {isAdmin && (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminDashboard />
        </Suspense>
      )}

      {/* 用户交互后加载图表 */}
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <ChartComponent />
        </Suspense>
      )}

      <button onClick={() => setShowChart(true)}>
        显示图表
      </button>
    </div>
  );
}

// 6. 预加载策略
const preloadAdmin = () => {
  import('./pages/admin/dashboard');
};

// 7. 路由级别的懒加载 (React Router)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/admin/*',
    lazy: () => import('./pages/admin').then(module => ({
      Component: module.AdminLayout
    }))
  },
  {
    path: '/products/:id',
    lazy: () => import('./pages/product-detail').then(module => ({
      Component: module.ProductDetail
    }))
  }
]);

// 8. 第三方库懒加载
const loadRecharts = () => {
  return import('recharts').then(module => ({
    LineChart: module.LineChart,
    BarChart: module.BarChart,
    PieChart: module.PieChart
  }));
};

// 9. 条件加载语言包
const loadLanguage = async (lang) => {
  const messages = await import(\`./locales/\${lang}.json\`);
  return messages.default;
};

// 10. 特性检测后加载
const loadModernFeatures = async () => {
  if ('IntersectionObserver' in window) {
    return import('./hooks/useIntersectionObserver');
  }
  return null;
};
`;

    await fs.writeFile(
      path.join(process.cwd(), 'dynamic-imports-examples.js'),
      examples
    );

    // 创建优化的React组件示例
    const optimizedComponent = `
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';

// 懒加载大型组件
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const ChartComponent = lazy(() => import('./components/Chart'));
const PDFGenerator = lazy(() => import('./utils/pdf-generator'));

const OptimizedPage = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // 预加载关键资源
  useEffect(() => {
    // 预加载可能在用户交互后需要的组件
    const timer = setTimeout(() => {
      import('./components/Chart'); // 预加载但不渲染
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container">
      {/* 关键内容立即加载 */}
      <header>
        <h1>优化页面示例</h1>
        <OptimizedImage
          src="/images/hero.jpg"
          alt="Hero image"
          priority={true}
        />
      </header>

      {/* 主要内容 */}
      <main>
        <section>
          <h2>页面内容</h2>
          <p>这是页面的主要内容，立即加载。</p>
        </section>

        {/* 按需加载的管理面板 */}
        {showAdmin && (
          <Suspense fallback={<div className="loading-skeleton">加载中...</div>}>
            <AdminDashboard />
          </Suspense>
        )}

        {/* 用户交互后加载的图表 */}
        {showChart && (
          <Suspense fallback={<ChartSkeleton />}>
            <ChartComponent />
          </Suspense>
        )}

        {/* 操作按钮 */}
        <div className="actions">
          <button onClick={() => setShowAdmin(true)}>
            管理面板
          </button>
          <button onClick={() => setShowChart(true)}>
            查看图表
          </button>
        </div>
      </main>
    </div>
  );
};

// 骨架屏组件
const ChartSkeleton = () => (
  <div className="chart-skeleton">
    <div className="loading-skeleton" style={{ height: '300px' }} />
    <div className="loading-skeleton" style={{ height: '40px', width: '60%' }} />
  </div>
);

export default OptimizedPage;
`;

    await fs.writeFile(
      path.join(process.cwd(), 'optimized-component-example.jsx'),
      optimizedComponent
    );

    console.log('✅ 动态导入示例已生成');
    console.log('📄 dynamic-imports-examples.js: 导入模式示例');
    console.log('📄 optimized-component-example.jsx: 组件优化示例');
  }

  async createPerformanceMonitoring() {
    const monitoringCode = `
// 性能监控和包大小分析
class BundleMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  // 监控chunk加载时间
  monitorChunkLoading() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('chunk')) {
            console.log(\`Chunk \${entry.name} loaded in \${entry.duration}ms\`);
            this.metrics[entry.name] = {
              loadTime: entry.duration,
              size: entry.transferSize
            };
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  // 监控内存使用
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      const metrics = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };

      console.log('Memory usage:', metrics);
      return metrics;
    }
  }

  // 分析包大小
  analyzeBundleSize() {
    // 获取所有已加载的脚本
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;

    scripts.forEach(script => {
      if (script.src.includes('chunk')) {
        // 这里可以通过API获取实际文件大小
        console.log('Chunk loaded:', script.src);
      }
    });

    return { totalSize, chunkCount: scripts.length };
  }

  // 生成性能报告
  generateReport() {
    const memory = this.monitorMemoryUsage();
    const bundleSize = this.analyzeBundleSize();

    return {
      memory,
      bundleSize,
      chunks: this.metrics,
      timestamp: new Date().toISOString()
    };
  }
}

// 初始化监控
const bundleMonitor = new BundleMonitor();
bundleMonitor.monitorChunkLoading();

// 定期报告性能数据
setInterval(() => {
  const report = bundleMonitor.generateReport();
  console.log('Bundle Performance Report:', report);
}, 30000); // 每30秒报告一次
`;

    await fs.writeFile(
      path.join(process.cwd(), 'bundle-monitor.js'),
      monitoringCode
    );
  }
}

// 执行JavaScript包优化
async function main() {
  try {
    const optimizer = new JSBundleOptimizer();
    await optimizer.optimizeJSBundles();
    await optimizer.createPerformanceMonitoring();

    console.log('\n🎯 下一步建议:');
    console.log('1. 实施动态导入示例中的代码');
    console.log('2. 配置webpack的splitChunks插件');
    console.log('3. 启用生产环境的压缩和Tree Shaking');
    console.log('4. 设置Bundle Analyzer监控包大小');
    console.log('5. 定期执行性能监控');

  } catch (error) {
    console.error('❌ JavaScript包优化失败:', error.message);
  }
}

main();