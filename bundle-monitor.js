
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
            console.log(`Chunk ${entry.name} loaded in ${entry.duration}ms`);
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
