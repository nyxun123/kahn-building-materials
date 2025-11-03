import { TextInput } from '@tremor/react';
import { Text } from '@tremor/react';
import { StandardUploadButton } from '../upload/StandardUploadButton';
import { FormField } from '../forms/FormField';

interface InlineLangInputProps {
  label: string;
  values: {
    zh: string;
    en: string;
    ru: string;
  };
  onChange: (lang: 'zh' | 'en' | 'ru', value: string) => void;
  type?: 'text' | 'url';
  showUploadButton?: boolean;
  uploadFolder?: string;
  uploadAccept?: string;
  required?: boolean;
  error?: {
    zh?: string;
    en?: string;
    ru?: string;
  };
  className?: string;
}

/**
 * 并排多语言输入组件
 * 用于短文本输入（URL、链接等）
 * 三个输入框并排显示，便于对比
 */
export function InlineLangInput({
  label,
  values,
  onChange,
  type = 'text',
  showUploadButton = false,
  uploadFolder = 'products',
  uploadAccept = 'image/*',
  required = false,
  error,
  className = '',
}: InlineLangInputProps) {
  return (
    <div className={className}>
      <Text className="text-sm font-semibold text-gray-700 mb-3">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 中文输入 */}
        <div>
          <FormField
            label="🇨🇳 中文"
            error={error?.zh}
          >
            <div className="flex gap-2">
              <TextInput
                type={type}
                value={values.zh}
                onChange={(e) => onChange('zh', e.target.value)}
                placeholder="中文内容"
                className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
              {showUploadButton && (
                <StandardUploadButton
                  onUpload={(url) => onChange('zh', url)}
                  folder={`${uploadFolder}/zh`}
                  accept={uploadAccept}
                  size="sm"
                />
              )}
            </div>
          </FormField>
        </div>

        {/* 英文输入 */}
        <div>
          <FormField
            label="🇬🇧 English"
            error={error?.en}
          >
            <div className="flex gap-2">
              <TextInput
                type={type}
                value={values.en}
                onChange={(e) => onChange('en', e.target.value)}
                placeholder="English content"
                className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
              {showUploadButton && (
                <StandardUploadButton
                  onUpload={(url) => onChange('en', url)}
                  folder={`${uploadFolder}/en`}
                  accept={uploadAccept}
                  size="sm"
                />
              )}
            </div>
          </FormField>
        </div>

        {/* 俄文输入 */}
        <div>
          <FormField
            label="🇷🇺 Русский"
            error={error?.ru}
          >
            <div className="flex gap-2">
              <TextInput
                type={type}
                value={values.ru}
                onChange={(e) => onChange('ru', e.target.value)}
                placeholder="Русский контент"
                className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
              {showUploadButton && (
                <StandardUploadButton
                  onUpload={(url) => onChange('ru', url)}
                  folder={`${uploadFolder}/ru`}
                  accept={uploadAccept}
                  size="sm"
                />
              )}
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}

