import { useState } from 'react';
import { TextInput, Textarea } from '@tremor/react';
import { Text } from '@tremor/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FormField } from '../forms/FormField';

interface AccordionLangInputProps {
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
 * 折叠面板多语言输入组件
 * 用于复杂表单的多语言字段
 * 可折叠的语言面板，减少视觉干扰
 */
export function AccordionLangInput({
  label,
  values,
  onChange,
  type = 'text',
  required = false,
  error,
  className = '',
}: AccordionLangInputProps) {
  const [expanded, setExpanded] = useState<'zh' | 'en' | 'ru' | null>('zh');

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

      <div className="space-y-2 border border-gray-200 rounded-xl overflow-hidden">
        {languages.map((lang) => {
          const isExpanded = expanded === lang.code;

          return (
            <div
              key={lang.code}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : lang.code)}
                className={`
                  w-full flex items-center justify-between px-4 py-3
                  text-left transition-all duration-200
                  ${isExpanded 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="font-medium">{lang.label}</span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-indigo-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 py-4 bg-white border-t border-gray-200">
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}



