import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LanguageDetection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查 URL 中是否已经有语言代码
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const firstPart = pathParts[0];
    
    const supportedLanguages = ['zh', 'en', 'ru'];
    
    if (supportedLanguages.includes(firstPart)) {
      // 如果 URL 中已有语言代码，不进行任何操作
      return;
    }
    
    // 如果 URL 中没有语言代码，直接重定向到英文首页
    navigate('/en', { replace: true });
  }, [navigate, location]);

  return null; // 不渲染任何内容，只是执行重定向逻辑
};

export default LanguageDetection;