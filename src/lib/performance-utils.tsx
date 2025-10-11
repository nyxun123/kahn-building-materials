/**
 * React组件性能优化工具
 * 提供memo、useMemo、useCallback等优化策略
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// 防抖 Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 节流 Hook
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

// 优化的事件处理器 Hook
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

// 复杂计算的 memo Hook
export function useComputedValue<T>(
  compute: () => T,
  deps: React.DependencyList
): T {
  return useMemo(compute, deps);
}

// 前一个值的 Hook（用于对比）
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 组件更新原因调试 Hook
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previous = useRef<Record<string, any>>();

  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previous.current![key] !== props[key]) {
          changedProps[key] = {
            from: previous.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('🔄 组件重新渲染:', name, changedProps);
      }
    }

    previous.current = props;
  });
}

// 渲染次数统计 Hook
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`📊 ${componentName} 渲染次数:`, renderCount.current);
  });

  return renderCount.current;
}

// 虚拟滚动 Hook
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []),
  };
}

// 图片懒加载 Hook
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// 窗口大小 Hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// 媒体查询 Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// 本地存储 Hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('从localStorage读取数据失败:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('保存到localStorage失败:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// 性能监控 Hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>();
  const renderCount = useRef(0);

  // 组件挂载时开始计时
  useEffect(() => {
    startTime.current = performance.now();
    return () => {
      if (startTime.current) {
        const endTime = performance.now();
        const duration = endTime - startTime.current;
        console.log(`⏱️ ${componentName} 生命周期耗时: ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  // 每次渲染计数
  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now();
    console.log(`🔄 ${componentName} 第${renderCount.current}次渲染 (${renderTime.toFixed(2)}ms)`);
  });

  return {
    renderCount: renderCount.current,
    startTime: startTime.current,
  };
}

// 高阶组件：性能监控
export function withPerformanceMonitor<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  const WithPerformanceMonitor = React.memo((props: P) => {
    usePerformanceMonitor(displayName);
    return <WrappedComponent {...props} />;
  });

  WithPerformanceMonitor.displayName = `withPerformanceMonitor(${displayName})`;
  return WithPerformanceMonitor;
}

// 高阶组件：防止不必要的重渲染
export function withMemoization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = React.memo(WrappedComponent, areEqual);
  MemoizedComponent.displayName = `Memoized(${WrappedComponent.displayName || WrappedComponent.name})`;
  return MemoizedComponent;
}

// 错误边界组件
export class PerformanceErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('性能错误边界捕获到错误:', error, errorInfo);
    
    // 可以在这里报告错误到监控服务
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('error-boundary-catch');
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return React.createElement(this.props.fallback, { error: this.state.error! });
      }
      
      return (
        <div className="error-boundary p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold">出现了一个错误</h2>
          <p className="text-red-600 mt-2">组件渲染失败，请刷新页面重试。</p>
        </div>
      );
    }

    return this.props.children;
  }
}