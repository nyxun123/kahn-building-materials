import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from '@/lib/i18n';

const LanguageDetection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查 URL 中是否已经有语言代码
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const firstPart = pathParts[0];
    
    const supportedLanguages = ['zh', 'en', 'ru'];

    // 如果主域名，强制跳转英文
    const host = window.location.hostname.toLowerCase();
    const EN_HOSTS = ['kn-wallpaperglue.com', 'www.kn-wallpaperglue.com'];
    if (EN_HOSTS.includes(host)) {
      if (!supportedLanguages.includes(firstPart)) {
        navigate(`/en${location.pathname}`, { replace: true });
      }
      return;
    }
    
    if (supportedLanguages.includes(firstPart)) {
      // 如果 URL 中已有语言代码，不进行任何操作
      return;
    }
    
    // 检查 localStorage 中是否有用户语言偏好
    const storedLanguage = localStorage.getItem('userLanguage');
    if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
      navigate(`/${storedLanguage}${location.pathname}`, { replace: true });
      return;
    }
    
    // 检查浏览器语言设置
    const browserLanguage = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLanguage)) {
      navigate(`/${browserLanguage}${location.pathname}`, { replace: true });
      return;
    }
    
    // 如果没有检测到语言偏好，重定向到英文首页
    navigate('/en', { replace: true });
  }, [navigate, location]);

  return null; // 不渲染任何内容，只是执行重定向逻辑
};

export default LanguageDetection;