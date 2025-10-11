/**
 * API请求缓存和优化工具
 * 实现请求去重、缓存、预加载等性能优化
 */

import { QueryClient } from '@tanstack/react-query';

// 创建全局查询客户端
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 缓存时间 5 分钟
      staleTime: 5 * 60 * 1000,
      // 垃圾回收时间 10 分钟 (React Query v4 使用 cacheTime)
      cacheTime: 10 * 60 * 1000,
      // 重试配置
      retry: (failureCount, error: any) => {
        // 4xx 错误不重试
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 最多重试 2 次
        return failureCount < 2;
      },
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 网络恢复时重新获取
      refetchOnReconnect: true,
      // 窗口聚焦时不自动重新获取（性能优化）
      refetchOnWindowFocus: false,
    },
    mutations: {
      // 变更重试配置
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// API 请求缓存管理
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private pendingRequests = new Map<string, Promise<any>>();

  // 设置缓存
  set(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
      ttl: ttl
    });
    
    // 定时清理过期缓存
    setTimeout(() => {
      this.delete(key);
    }, ttl);
  }

  // 获取缓存
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // 删除缓存
  delete(key: string) {
    this.cache.delete(key);
  }

  // 清空所有缓存
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // 请求去重 - 防止相同请求并发执行
  async dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // 检查是否有相同的请求正在进行
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // 创建新的请求
    const promise = fn()
      .finally(() => {
        // 请求完成后清理
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // 获取缓存统计
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

export const apiCache = new ApiCache();

// 优化的 fetch 函数
export async function optimizedFetch(
  url: string, 
  options: RequestInit = {},
  cacheOptions: { ttl?: number; useCache?: boolean } = {}
): Promise<any> {
  const { ttl = 5 * 60 * 1000, useCache = true } = cacheOptions;
  const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`;

  // 对于 GET 请求，检查缓存
  if (useCache && (!options.method || options.method === 'GET')) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log('📦 使用缓存数据:', url);
      return cached;
    }
  }

  // 使用请求去重
  return apiCache.dedupe(cacheKey, async () => {
    try {
      console.log('🌐 发起网络请求:', url);
      
      // 添加默认头部
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // 缓存成功的 GET 请求结果
      if (useCache && (!options.method || options.method === 'GET')) {
        apiCache.set(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      console.error('❌ API请求失败:', url, error);
      throw error;
    }
  });
}

// 预加载关键数据
export class DataPreloader {
  private preloadQueue: Array<{ url: string; priority: number }> = [];
  private isPreloading = false;

  // 添加预加载任务
  add(url: string, priority: number = 1) {
    this.preloadQueue.push({ url, priority });
    this.preloadQueue.sort((a, b) => b.priority - a.priority);
  }

  // 开始预加载
  async start() {
    if (this.isPreloading || this.preloadQueue.length === 0) return;
    
    this.isPreloading = true;
    console.log('🚀 开始数据预加载...');

    while (this.preloadQueue.length > 0) {
      const { url } = this.preloadQueue.shift()!;
      
      try {
        await optimizedFetch(url, {}, { ttl: 10 * 60 * 1000 });
        console.log('✅ 预加载完成:', url);
        
        // 避免阻塞主线程
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('⚠️ 预加载失败:', url, error);
      }
    }

    this.isPreloading = false;
    console.log('🎉 所有数据预加载完成');
  }

  // 清空预加载队列
  clear() {
    this.preloadQueue = [];
    this.isPreloading = false;
  }
}

export const dataPreloader = new DataPreloader();

// 智能预加载策略
export function setupIntelligentPreloading() {
  // 页面加载完成后开始预加载
  if (document.readyState === 'complete') {
    startPreloading();
  } else {
    window.addEventListener('load', startPreloading);
  }

  // 用户交互时预加载相关数据
  setupInteractionPreloading();
}

function startPreloading() {
  // 根据当前页面预加载相关数据
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/products')) {
    // 产品页面预加载
    dataPreloader.add('/api/products', 3);
    dataPreloader.add('/api/content/products', 2);
  } else if (currentPath.includes('/admin')) {
    // 管理后台预加载
    dataPreloader.add('/api/admin/dashboard', 3);
    dataPreloader.add('/api/admin/analytics', 1);
  } else {
    // 首页预加载
    dataPreloader.add('/api/products?limit=5', 3);
    dataPreloader.add('/api/content/home', 2);
    dataPreloader.add('/api/company/info', 1);
  }

  // 开始预加载
  dataPreloader.start();
}

function setupInteractionPreloading() {
  // 鼠标悬停时预加载
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href) {
      const url = new URL(link.href);
      if (url.origin === window.location.origin) {
        // 预加载链接对应的数据
        preloadForRoute(url.pathname);
      }
    }
  });

  // 触摸设备的预加载
  document.addEventListener('touchstart', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href) {
      const url = new URL(link.href);
      if (url.origin === window.location.origin) {
        preloadForRoute(url.pathname);
      }
    }
  }, { passive: true });
}

function preloadForRoute(pathname: string) {
  if (pathname.includes('/products/')) {
    const productCode = pathname.split('/').pop();
    if (productCode) {
      dataPreloader.add(`/api/products/${productCode}`, 2);
    }
  } else if (pathname.includes('/products')) {
    dataPreloader.add('/api/products', 2);
  } else if (pathname.includes('/about')) {
    dataPreloader.add('/api/content/about', 2);
  }
}

// 网络状态监控
export class NetworkMonitor {
  private isOnline = navigator.onLine;
  private connectionType = this.getConnectionType();
  private listeners: Array<(status: boolean) => void> = [];

  constructor() {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
      this.handleOffline();
    });

    // 监听连接类型变化
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', () => {
        this.connectionType = this.getConnectionType();
        this.adjustCacheStrategy();
      });
    }
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private notifyListeners(status: boolean) {
    this.listeners.forEach(listener => listener(status));
  }

  private handleOnline() {
    console.log('🌐 网络连接恢复');
    // 重新验证缓存数据
    queryClient.refetchQueries();
  }

  private handleOffline() {
    console.log('📱 网络连接断开，切换到离线模式');
    // 可以在这里实现离线提示逻辑
  }

  private adjustCacheStrategy() {
    // 根据网络类型调整缓存策略
    if (this.connectionType === 'slow-2g' || this.connectionType === '2g') {
      // 慢网络，增加缓存时间
      console.log('🐌 检测到慢网络，调整缓存策略');
    } else if (this.connectionType === '4g') {
      // 快网络，可以更频繁地更新
      console.log('🚀 检测到快网络，优化更新频率');
    }
  }

  onStatusChange(listener: (status: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      connectionType: this.connectionType
    };
  }
}

export const networkMonitor = new NetworkMonitor();

// 初始化 API 优化
export function initializeApiOptimization() {
  console.log('🔧 初始化 API 优化...');
  
  // 设置智能预加载
  setupIntelligentPreloading();
  
  // 定期清理缓存
  setInterval(() => {
    const stats = apiCache.getStats();
    console.log('📊 API缓存统计:', stats);
    
    // 如果缓存过大，清理一部分
    if (stats.cacheSize > 100) {
      console.log('🧹 清理部分缓存...');
      // 可以实现 LRU 清理策略
    }
  }, 5 * 60 * 1000); // 每5分钟检查一次

  console.log('✅ API 优化初始化完成');
}