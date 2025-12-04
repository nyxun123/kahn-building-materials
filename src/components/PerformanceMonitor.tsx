/**
 * 性能监控组件
 * 用于收集和上报网站性能指标
 */

import { useEffect } from 'react';

interface PerformanceMetrics {
  // 核心 Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  // 自定义指标
  pageLoadTime?: number;
  domContentLoaded?: number;
  resourceLoadTime?: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // 收集 LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // 收集 FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // 收集 CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // 收集 FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observer not supported');
    }

    // 收集页面加载时间
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        metrics.pageLoadTime = perfData.loadEventEnd - perfData.fetchStart;
        metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
        metrics.ttfb = perfData.responseStart - perfData.requestStart;
      }

      // 收集资源加载时间
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      if (resources.length > 0) {
        const totalResourceTime = resources.reduce((sum, resource) => {
          return sum + (resource.responseEnd - resource.startTime);
        }, 0);
        metrics.resourceLoadTime = totalResourceTime / resources.length;
      }

      // 在开发环境输出性能指标
      if (process.env.NODE_ENV === 'development') {
        console.group('📊 性能指标');
        console.log('LCP (最大内容绘制):', metrics.lcp?.toFixed(2), 'ms');
        console.log('FID (首次输入延迟):', metrics.fid?.toFixed(2), 'ms');
        console.log('CLS (累积布局偏移):', metrics.cls?.toFixed(4));
        console.log('FCP (首次内容绘制):', metrics.fcp?.toFixed(2), 'ms');
        console.log('TTFB (首字节时间):', metrics.ttfb?.toFixed(2), 'ms');
        console.log('页面加载时间:', metrics.pageLoadTime?.toFixed(2), 'ms');
        console.log('DOM 内容加载:', metrics.domContentLoaded?.toFixed(2), 'ms');
        console.log('平均资源加载:', metrics.resourceLoadTime?.toFixed(2), 'ms');
        console.groupEnd();
      }

      // 可以在这里发送到分析服务
      // sendToAnalytics(metrics);
    });

    // 清理函数
    return () => {
      // PerformanceObserver 会自动清理
    };
  }, []);

  return null; // 此组件不渲染任何内容
}

/**
 * 性能评分计算
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;

  // LCP 评分 (目标: < 2.5s)
  if (metrics.lcp) {
    if (metrics.lcp > 4000) score -= 30;
    else if (metrics.lcp > 2500) score -= 20;
    else if (metrics.lcp > 2000) score -= 10;
  }

  // FID 评分 (目标: < 100ms)
  if (metrics.fid) {
    if (metrics.fid > 300) score -= 20;
    else if (metrics.fid > 100) score -= 10;
  }

  // CLS 评分 (目标: < 0.1)
  if (metrics.cls) {
    if (metrics.cls > 0.25) score -= 20;
    else if (metrics.cls > 0.1) score -= 10;
  }

  // FCP 评分 (目标: < 1.8s)
  if (metrics.fcp) {
    if (metrics.fcp > 3000) score -= 15;
    else if (metrics.fcp > 1800) score -= 10;
  }

  return Math.max(0, score);
}
