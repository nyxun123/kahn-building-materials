/**
 * 资源提示 Hook
 * 用于动态添加 preload、prefetch、dns-prefetch 等资源提示
 */

import { useEffect } from 'react';

interface ResourceHint {
  href: string;
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document';
  type?: string;
  crossorigin?: boolean;
}

/**
 * 添加资源预加载提示
 */
export function useResourceHints(hints: ResourceHint[]) {
  useEffect(() => {
    hints.forEach((hint) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = hint.href;
      
      if (hint.as) {
        link.setAttribute('as', hint.as);
      }
      
      if (hint.type) {
        link.type = hint.type;
      }
      
      if (hint.crossorigin) {
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
    });

    return () => {
      // 清理：移除添加的 link 标签
      hints.forEach((hint) => {
        const existingLink = document.querySelector(
          `link[rel="preload"][href="${hint.href}"]`
        );
        if (existingLink) {
          existingLink.remove();
        }
      });
    };
  }, [hints]);
}

/**
 * 添加 DNS 预解析提示
 */
export function useDNSPrefetch(domains: string[]) {
  useEffect(() => {
    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain.startsWith('//') ? domain : `//${domain}`;
      document.head.appendChild(link);
    });

    return () => {
      domains.forEach((domain) => {
        const existingLink = document.querySelector(
          `link[rel="dns-prefetch"][href="${domain.startsWith('//') ? domain : `//${domain}`}"]`
        );
        if (existingLink) {
          existingLink.remove();
        }
      });
    };
  }, [domains]);
}

/**
 * 预获取下一页资源
 */
export function usePrefetchNextPage(paths: string[]) {
  useEffect(() => {
    // 延迟执行，避免影响首屏加载
    const timer = setTimeout(() => {
      paths.forEach((path) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
    }, 2000); // 2秒后开始预获取

    return () => {
      clearTimeout(timer);
      paths.forEach((path) => {
        const existingLink = document.querySelector(
          `link[rel="prefetch"][href="${path}"]`
        );
        if (existingLink) {
          existingLink.remove();
        }
      });
    };
  }, [paths]);
}



