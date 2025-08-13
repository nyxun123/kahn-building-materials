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
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en', 'ru'],
    load: 'languageOnly',
    ns: ['common', 'home', 'products', 'oem', 'about', 'contact', 'admin'],
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false, // React已经安全处理了字符串
    },
    detection: {
      order: ['path', 'querystring', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage'],
    },
  });

export default i18n;
