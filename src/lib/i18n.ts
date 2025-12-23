import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-resources-to-backend';

i18n
  .use(Backend(
    (language: string, namespace: string) =>
      import(`../locales/${language}/${namespace}.json`)
  ))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['zh', 'en', 'ru', 'vi', 'th', 'id'],
    load: 'languageOnly',
    ns: ['common', 'home', 'products', 'applications', 'oem', 'about', 'contact', 'admin', 'blog'],
    defaultNS: 'common',
    debug: false,
    react: {
      useSuspense: false, // 禁用 Suspense，避免加载问题
    },
    interpolation: {
      escapeValue: false, // React已经安全处理了字符串
    },
    detection: {
      // 禁用自动检测，我们手动控制语言切换
      order: [],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'userLanguage',
      caches: [], // 不缓存，每次都从URL读取
    },
  });

// 导出一个函数来强制设置主域名语言（只在生产环境的主域名执行）
export const enforceMainDomainLanguage = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const EN_HOSTS = ['kn-wallpaperglue.com', 'www.kn-wallpaperglue.com'];
    // 只在生产环境的主域名执行
    if (EN_HOSTS.includes(host)) {
      const current = i18n.language?.split('-')[0] || 'en';
      if (current !== 'en') {
        i18n.changeLanguage('en');
        try { localStorage.setItem('userLanguage', 'en'); } catch { }
      }
      return true;
    }
  }
  return false;
};

// 不在初始化时执行，由组件按需调用
// enforceMainDomainLanguage();

export default i18n;