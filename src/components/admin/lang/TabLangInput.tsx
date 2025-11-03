import { useState } from 'react';
import { TextInput, Textarea } from '@tremor/react';
import { Text } from '@tremor/react';
import { FormField } from '../forms/FormField';

interface TabLangInputProps {
  label: string;
  values: {
    zh: string;
    en: string;
    ru: string;
  };
  onChange: (lang: 'zh' | 'en' | 'ru', value: string) => void;
  type?: 'text' | 'textarea';
  required?: boolean;
  error?: {
    zh?: string;
    en?: string;
    ru?: string;
  };
  className?: string;
}

/**
 * 标签页多语言输入组件
 * 用于文本输入（标题、描述等）
 * 顶部标签页切换，节省空间，适合长文本
 */
export function TabLangInput({
  label,
  values,
  onChange,
  type = 'text',
  required = false,
  error,
  className = '',
}: TabLangInputProps) {
  const [activeLang, setActiveLang] = useState<'zh' | 'en' | 'ru'>('zh');

  const languages = [
    { code: 'zh' as const, label: '🇨🇳 中文', name: '中文' },
    { code: 'en' as const, label: '🇬🇧 English', name: 'English' },
    { code: 'ru' as const, label: '🇷🇺 Русский', name: 'Русский' },
  ];

  return (
    <div className={className}>
      <Text className="text-sm font-semibold text-gray-700 mb-3">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Text>

      {/* 标签页 */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActiveLang(lang.code)}
            className={`
              px-4 py-2 text-sm font-medium transition-all duration-200
              border-b-2 -mb-px
              ${
                activeLang === lang.code
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
            `}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="relative">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={activeLang === lang.code ? 'block' : 'hidden'}
          >
            <FormField
              label={lang.name}
              error={error?.[lang.code]}
            >
              {type === 'textarea' ? (
                <Textarea
                  value={values[lang.code]}
                  onChange={(e) => onChange(lang.code, e.target.value)}
                  placeholder={`输入${lang.name}内容`}
                  rows={6}
                  className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              ) : (
                <TextInput
                  type="text"
                  value={values[lang.code]}
                  onChange={(e) => onChange(lang.code, e.target.value)}
                  placeholder={`输入${lang.name}内容`}
                  className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              )}
            </FormField>
          </div>
        ))}
      </div>
    </div>
  );
}

