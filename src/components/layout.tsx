import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { enforceMainDomainLanguage } from '@/lib/i18n';

export function Layout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const [forceUpdate, setForceUpdate] = useState(0);

  // 当URL中的语言参数变化时切换语言
  useEffect(() => {
    // 首先检查是否为主域名并强制英文
    const isMainDomainEnforced = enforceMainDomainLanguage();
    
    // 确定目标语言
    let targetLang = lang || 'en';
    
    // 如果主域名强制英文，则忽略URL参数
    if (isMainDomainEnforced) {
      targetLang = 'en';
    }
    
    if (['zh', 'en', 'ru'].includes(targetLang)) {
      // 强制切换语言，不管 localStorage 中是什么
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
        localStorage.setItem('userLanguage', targetLang);
        // 强制重新渲染所有组件
        setForceUpdate(prev => prev + 1);
      }
    }
  }, [lang, i18n]);

  return (
    <div key={forceUpdate} className="flex flex-col min-h-screen">
      <Navbar forceUpdate={forceUpdate} />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer forceUpdate={forceUpdate} />
    </div>
  );
}