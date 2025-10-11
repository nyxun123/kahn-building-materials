import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [swState, setSwState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    updateAvailable: false
  });

  useEffect(() => {
    // 检查 Service Worker 支持
    if ('serviceWorker' in navigator) {
      setSwState(prev => ({ ...prev, isSupported: true }));
      registerServiceWorker();
    }

    // 监听在线状态
    const updateOnlineStatus = () => {
      setSwState(prev => ({ ...prev, isOnline: navigator.onLine }));
      
      if (!navigator.onLine) {
        toast.error('网络连接已断开，正在切换到离线模式', {
          duration: 3000,
          icon: '📱'
        });
      } else {
        toast.success('网络连接已恢复', {
          duration: 2000,
          icon: '🌐'
        });
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'imports'
      });

      console.log('✅ Service Worker 注册成功:', registration.scope);
      setSwState(prev => ({ ...prev, isRegistered: true }));

      // 检查更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              setSwState(prev => ({ ...prev, updateAvailable: true }));
              showUpdateAvailableNotification(registration);
            }
          });
        }
      });

      // 监听 Service Worker 消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_COMPLETE') {
          console.log('📦 资源缓存完成');
        }
      });

      // 预缓存关键资源
      await preCacheResources();

    } catch (error) {
      console.error('❌ Service Worker 注册失败:', error);
    }
  };

  const showUpdateAvailableNotification = (registration: ServiceWorkerRegistration) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <div className="font-medium">新版本可用</div>
        <div className="text-sm text-gray-600">
          发现应用更新，点击刷新获取最新版本
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            onClick={() => {
              updateServiceWorker(registration);
              toast.dismiss(t.id);
            }}
          >
            立即更新
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            稍后提醒
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      icon: '🔄'
    });
  };

  const updateServiceWorker = (registration: ServiceWorkerRegistration) => {
    if (registration.waiting) {
      // 通知 Service Worker 跳过等待
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // 监听控制器变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // 重新加载页面以使用新的 Service Worker
        window.location.reload();
      });
    }
  };

  const preCacheResources = async () => {
    // 发送需要预缓存的资源列表给 Service Worker
    const criticalResources = [
      '/zh/products',
      '/zh/about',
      '/zh/contact'
    ];

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls: criticalResources
      });
    }
  };

  // 添加性能监控
  useEffect(() => {
    if (swState.isRegistered) {
      // 监控缓存性能
      if ('performance' in window && 'getEntriesByType' in performance) {
        const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (entries.length > 0) {
          const entry = entries[0];
          const loadTime = entry.loadEventEnd - entry.fetchStart;
          
          console.log('📊 页面加载性能:', {
            总加载时间: `${Math.round(loadTime)}ms`,
            DNS查询: `${Math.round(entry.domainLookupEnd - entry.domainLookupStart)}ms`,
            TCP连接: `${Math.round(entry.connectEnd - entry.connectStart)}ms`,
            请求响应: `${Math.round(entry.responseEnd - entry.requestStart)}ms`,
            DOM解析: `${Math.round(entry.domContentLoadedEventEnd - entry.responseEnd)}ms`
          });
        }
      }
    }
  }, [swState.isRegistered]);

  return (
    <>
      {children}
      
      {/* 离线状态指示器 */}
      {!swState.isOnline && (
        <div className="fixed bottom-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm">离线模式</span>
        </div>
      )}

      {/* Service Worker 状态指示器（仅开发环境） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded text-xs z-50">
          SW: {swState.isRegistered ? '✅' : '❌'} | 
          在线: {swState.isOnline ? '🌐' : '📱'} |
          更新: {swState.updateAvailable ? '🔄' : '✅'}
        </div>
      )}
    </>
  );
}

// Hook for using Service Worker state
export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      toast.success('缓存已清理');
    }
  };

  const checkForUpdates = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  };

  return {
    isOnline,
    clearCache,
    checkForUpdates
  };
}