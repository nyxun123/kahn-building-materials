import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { FloatingContactButtons } from './FloatingContactButtons';
import { BottomNav } from './BottomNav';
import { prefetchBlogList } from '@/lib/blog-prefetch';

export function Layout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [navHeight, setNavHeight] = useState(96);

  // 当URL中的语言参数变化时切换语言（URL是唯一来源）
  useEffect(() => {
    if (!lang) {
      return; // 如果没有语言参数，LanguageDetection会处理重定向
    }

    // 验证语言代码是否有效
    if (!['zh', 'en', 'ru', 'vi', 'th', 'id'].includes(lang)) {
      // 无效语言代码，重定向到英文
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(part => part !== '');
      pathParts[0] = 'en';
      window.location.href = '/' + pathParts.join('/');
      return;
    }

    // 确定目标语言（直接使用 URL 中的语言）
    const targetLang = lang;

    // 获取当前i18n语言（去掉可能的区域代码，如 'en-US' -> 'en'）
    const currentLang = (i18n.language || 'en').split('-')[0];

    // 统一更新 i18n（每次 URL 变化都强制更新，确保同步）
    // 如果语言不同，立即切换
    if (currentLang !== targetLang) {
      i18n.changeLanguage(targetLang).then(() => {
        try {
          localStorage.setItem('userLanguage', targetLang);
        } catch (e) {
          console.error('无法保存语言偏好:', e);
        }
        // 强制重新渲染所有组件
        setForceUpdate(prev => prev + 1);
      }).catch((err) => {
        console.error('❌ 语言切换失败:', err);
      });
    } else {
      // 即使语言相同，也强制更新一次（确保组件使用最新语言）
      setForceUpdate(prev => prev + 1);
    }
  }, [lang]); // 只依赖 lang，URL 变化时触发

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    if (!header) {
      return;
    }

    const updateHeight = () => {
      const nextHeight = Math.ceil(header.getBoundingClientRect().height);
      if (nextHeight) {
        setNavHeight(nextHeight);
        document.documentElement.style.setProperty('--site-header-height', `${nextHeight}px`);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(header);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (!lang || location.pathname.startsWith('/admin')) {
      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const runPrefetch = () => {
      void prefetchBlogList(lang);
    };

    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(runPrefetch, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(runPrefetch, 1200);
    }

    return () => {
      if (typeof idleId === 'number' && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lang, location.pathname]);

  return (
    <div key={forceUpdate} className="flex flex-col min-h-screen">
      <Navbar forceUpdate={forceUpdate} />
      <main className="flex-1" style={{ paddingTop: navHeight }}>
        <Outlet />
      </main>
      <Footer forceUpdate={forceUpdate} />
      <BottomNav />
      {/* 右侧漂浮联络按钮 - 仅在前端页面显示，不在管理后台显示 - 移动端隐藏 (使用底部导航) */}
      {!location.pathname.startsWith('/admin') && <div className="hidden md:block"><FloatingContactButtons /></div>}
    </div>
  );
}
