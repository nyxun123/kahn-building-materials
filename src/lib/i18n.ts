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
    supportedLngs: ['zh', 'en', 'ru'],
    load: 'languageOnly',
    ns: ['common', 'home', 'products', 'oem', 'about', 'contact', 'admin'],
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false, // React已经安全处理了字符串
    },
    detection: {
      // 优先使用 URL 路径和查询参数，其次本地存储，最后才看浏览器语言
      order: ['path', 'querystring', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'userLanguage',
      caches: [],
    },
  });

// 导出一个函数来强制设置主域名语言
export const enforceMainDomainLanguage = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const EN_HOSTS = ['kn-wallpaperglue.com', 'www.kn-wallpaperglue.com'];
    if (EN_HOSTS.includes(host)) {
      const current = i18n.language;
      if (current !== 'en') {
        i18n.changeLanguage('en');
        try { localStorage.setItem('userLanguage', 'en'); } catch {}
      }
      return true;
    }
  }
  return false;
};

// 初始化时执行一次
enforceMainDomainLanguage();

export default i18n;