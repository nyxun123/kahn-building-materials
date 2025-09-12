import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 根据当前语言从多语言对象中获取相应的文本
export function getLocalizedContent<T extends Record<string, any>>(obj: T, lang: string): string {
  if (!obj) return '';
  
  const langKey = `name_${lang}` as keyof T;
  const fallbackKey = 'name_zh' as keyof T;
  
  return (obj[langKey] as string) || (obj[fallbackKey] as string) || '';
}

// 格式化日期
export function formatDate(date: string | Date, locale: string = 'zh'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
