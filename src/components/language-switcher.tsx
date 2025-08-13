import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'zh';

  const handleLanguageChange = (langCode: string) => {
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
    const newPath = currentPathParts.join('/');
    navigate(newPath);
  };

  const currentLanguageLabel = LANGUAGE_OPTIONS.find(lang => lang.value === currentLang)?.label || '中文';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 px-0" aria-label={t('switch_language')}>
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t('switch_language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map((lang) => (
          <DropdownMenuItem 
            key={lang.value}
            onClick={() => handleLanguageChange(lang.value)}
            className={currentLang === lang.value ? "bg-primary/10" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
