import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageDetection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0]; // 获取主要语言代码，如 'zh', 'en', 'ru'
    const supportedLanguages = ['zh', 'en', 'ru'];
    
    // 检查是否支持该语言，否则使用默认语言
    const detectedLang = supportedLanguages.includes(browserLang) ? browserLang : 'zh';
    
    // 重定向到检测到的语言
    navigate(`/${detectedLang}`, { replace: true });
  }, [navigate]);

  return null; // 不渲染任何内容，只是执行重定向
};

export default LanguageDetection;