import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function Layout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  // 当URL中的语言参数变化时切换语言
  useEffect(() => {
    if (lang && ['zh', 'en', 'ru'].includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem('userLanguage', lang);
    }
  }, [lang, i18n]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16"> {/* pt-16 给导航栏留出空间 */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
