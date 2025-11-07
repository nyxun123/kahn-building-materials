import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文', flag: '🇨🇳', nativeName: '简体中文' },
  { value: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { value: 'th', label: 'ไทย', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
  { value: 'id', label: 'Indonesia', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: urlLang } = useParams<{ lang: string }>();
  
  // 使用URL参数中的语言，如果没有则使用i18n当前语言
  const currentLang = urlLang || i18n.language || 'en';

  const handleLanguageChange = (langCode: string) => {
    console.log('🌐 用户切换语言:', langCode);
    
    // 保存到localStorage（作为偏好设置）
    try {
      localStorage.setItem('userLanguage', langCode);
    } catch (e) {
      console.warn('无法保存语言偏好到localStorage:', e);
    }
    
    // 立即更新 i18n（确保 UI 立即响应）
    i18n.changeLanguage(langCode).catch(err => {
      console.error('i18n 切换失败:', err);
    });
    
    // 更新URL路径
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(part => part !== '');
    
    // 检查第一个部分是否是语言代码
    const supportedLanguages = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
    let newPathParts: string[] = [];
    
    if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
      // 如果第一个部分是语言代码，替换它
      newPathParts = [langCode, ...pathParts.slice(1)];
    } else {
      // 如果没有语言代码，添加它
      newPathParts = [langCode, ...pathParts];
    }
    
    // 构建新路径
    const newPath = '/' + newPathParts.join('/');
    
    console.log('📍 导航到:', newPath, '当前路径:', currentPath);
    
    // 使用 replace: true 确保替换当前历史记录，避免后退问题
    navigate(newPath, { replace: true });
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/90 rounded-lg p-1 border border-green-200 shadow-sm">
      {LANGUAGE_OPTIONS.map((lang) => (
        <button
          key={lang.value}
          onClick={() => handleLanguageChange(lang.value)}
          className={cn(
            "relative text-2xl transition-all duration-200 rounded-md px-1.5 py-1",
            "hover:bg-green-50 hover:scale-110",
            currentLang === lang.value 
              ? "bg-green-100 ring-2 ring-green-500 scale-105 shadow-md" 
              : "hover:shadow-sm"
          )}
          title={lang.nativeName}
          aria-label={`切换到${lang.nativeName}`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}