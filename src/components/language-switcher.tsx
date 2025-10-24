import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Languages, Globe, Check } from "lucide-react";
import { cn } from '@/lib/utils';

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文', flag: '🇨🇳', nativeName: '简体中文' },
  { value: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: urlLang } = useParams<{ lang: string }>();
  
  // 使用URL参数中的语言，如果没有则使用i18n当前语言
  const currentLang = urlLang || i18n.language || 'en';

  const handleLanguageChange = (langCode: string) => {
    // 更新i18n语言
    i18n.changeLanguage(langCode);
    localStorage.setItem('userLanguage', langCode);
    
    // 更新 URL 路径以反映当前语言
    const currentPath = location.pathname;
    const currentPathParts = currentPath.split('/');
    
    // 检查当前路径的第一部分是否是语言代码
    if (currentPathParts.length > 1 && ['zh', 'en', 'ru'].includes(currentPathParts[1])) {
      // 如果是，则替换它
      currentPathParts[1] = langCode;
    } else {
      // 如果不是，则添加语言代码
      currentPathParts.splice(1, 0, langCode);
    }
    
    // 构建新路径
    const newPath = currentPathParts.join('/') || '/';
    navigate(newPath);
  };

  const currentLanguage = LANGUAGE_OPTIONS.find(lang => lang.value === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3 bg-white/80 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200" 
          aria-label={t('switch_language')}
        >
          <Globe className="h-4 w-4 mr-2 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage?.flag} {currentLanguage?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white/95 backdrop-blur-lg border-green-100 shadow-lg"
      >
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
            选择语言 / Select Language
          </div>
          {LANGUAGE_OPTIONS.map((lang) => (
            <DropdownMenuItem 
              key={lang.value}
              onClick={() => handleLanguageChange(lang.value)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200",
                currentLang === lang.value 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-700 hover:bg-green-50/50 hover:text-green-600"
              )}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{lang.flag}</span>
                <div>
                  <div className="text-sm font-medium">{lang.label}</div>
                  <div className="text-xs text-gray-500">{lang.nativeName}</div>
                </div>
              </div>
              {currentLang === lang.value && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}