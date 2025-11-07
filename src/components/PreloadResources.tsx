import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 预加载关键资源组件
 * 根据当前路由预加载下一个可能访问的页面
 */
export const PreloadResources = () => {
  const location = useLocation();

  useEffect(() => {
    // 根据当前页面预加载可能的下一页
    const preloadMap: Record<string, string[]> = {
      '/': [
        '/products', 
        '/applications',
        '/oem'
      ],
      '/products': [
        '/products/:id',
        '/applications'
      ],
      '/applications': [
        '/products',
        '/contact'
      ],
      '/oem': [
        '/contact'
      ],
      '/about': [
        '/contact'
      ],
    };

    // 获取当前路径（移除语言前缀）
    const pathWithoutLang = location.pathname.replace(/^\/(zh|en|ru|vi|th|id)/, '');
    const nextPages = preloadMap[pathWithoutLang] || [];

    // 预加载页面（动态导入）
    nextPages.forEach((page) => {
      if (page === '/products/:id') {
        // 预加载产品详情页组件
        import('@/pages/product-detail');
      } else if (page === '/products') {
        import('@/pages/products');
      } else if (page === '/applications') {
        import('@/pages/applications');
      } else if (page === '/oem') {
        import('@/pages/oem');
      } else if (page === '/contact') {
        import('@/pages/contact');
      }
    });

    // 预加载关键图片（首屏外的图片）
    const preloadImages = () => {
      const imagesToPreload: string[] = [];
      
      // 根据当前页面确定要预加载的图片
      if (pathWithoutLang === '/') {
        // 首页预加载产品列表的第一张图
        imagesToPreload.push('/images/professional_wallpaper_installation_worker.webp');
      }

      imagesToPreload.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // 延迟预加载（避免影响首屏）
    const timer = setTimeout(preloadImages, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default PreloadResources;

