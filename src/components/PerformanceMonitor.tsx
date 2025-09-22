import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reportMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      };

      // Web Vitals measurements
      if ('web-vitals' in window || typeof PerformanceObserver !== 'undefined') {
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          metrics.firstContentfulPaint = fcp.startTime;
        }

        // Largest Contentful Paint
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              metrics.largestContentfulPaint = lastEntry.startTime;
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.debug('LCP measurement not supported');
        }

        // Cumulative Layout Shift
        try {
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            metrics.cumulativeLayoutShift = clsValue;
          }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.debug('CLS measurement not supported');
        }

        // First Input Delay
        try {
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
              break; // Only need the first one
            }
          }).observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.debug('FID measurement not supported');
        }
      }

      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚀 Performance Metrics');
        console.log('Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
        console.log('DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`);
        if (metrics.firstContentfulPaint) {
          console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
        }
        if (metrics.largestContentfulPaint) {
          console.log('Largest Contentful Paint:', `${metrics.largestContentfulPaint.toFixed(2)}ms`);
        }
        if (metrics.cumulativeLayoutShift !== undefined) {
          console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift.toFixed(4));
        }
        if (metrics.firstInputDelay !== undefined) {
          console.log('First Input Delay:', `${metrics.firstInputDelay.toFixed(2)}ms`);
        }
        console.groupEnd();
      }

      // In production, you might want to send metrics to an analytics service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to analytics
        // analytics.track('Performance Metrics', metrics);
        
        // Report poor performance
        if (metrics.loadTime > 3000) {
          console.warn('⚠️ Slow page load detected:', `${metrics.loadTime.toFixed(2)}ms`);
        }
        
        if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
          console.warn('⚠️ Poor LCP detected:', `${metrics.largestContentfulPaint.toFixed(2)}ms`);
        }

        if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
          console.warn('⚠️ High CLS detected:', metrics.cumulativeLayoutShift.toFixed(4));
        }

        if (metrics.firstInputDelay && metrics.firstInputDelay > 100) {
          console.warn('⚠️ High FID detected:', `${metrics.firstInputDelay.toFixed(2)}ms`);
        }
      }
    };

    // Wait for page load
    if (document.readyState === 'complete') {
      setTimeout(reportMetrics, 0);
    } else {
      window.addEventListener('load', () => {
        setTimeout(reportMetrics, 0);
      });
    }

    // Memory usage monitoring (development only)
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const logMemory = () => {
        const memory = (performance as any).memory;
        console.group('💾 Memory Usage');
        console.log('Used JS Heap Size:', `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
        console.log('Total JS Heap Size:', `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
        console.log('JS Heap Size Limit:', `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
        console.groupEnd();
      };

      setTimeout(logMemory, 5000); // Log after 5 seconds
    }

  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;