import { Text } from '@tremor/react';
import { StandardUploadButton } from './StandardUploadButton';
import { FormField } from '../forms/FormField';
import { TextInput } from '@tremor/react';

interface MultiLangMediaUploadProps {
  values: {
    zh: string;
    en: string;
    ru: string;
  };
  onChange: (lang: 'zh' | 'en' | 'ru', url: string) => void;
  folder: string;
  type?: 'image' | 'video';
  label?: string;
  className?: string;
}

/**
 * 多语言媒体上传组件
 * 用于需要为每个语言上传不同文件的场景
 * 每个语言独立的上传区域
 */
export function MultiLangMediaUpload({
  values,
  onChange,
  folder,
  type = 'image',
  label = '媒体文件',
  className = '',
}: MultiLangMediaUploadProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Text className="text-sm font-semibold text-gray-700 mb-4">
        {label}
      </Text>

      {/* 中文上传 */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300 transition-all duration-300">
        <FormField label="🇨🇳 中文">
          <div className="flex gap-3">
            <TextInput
              type="url"
              value={values.zh}
              onChange={(e) => onChange('zh', e.target.value)}
              placeholder={`输入${type === 'image' ? '图片' : '视频'}URL或点击右侧按钮上传`}
              className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
            />
            <StandardUploadButton
              onUpload={(url) => onChange('zh', url)}
              folder={`${folder}/zh`}
              accept={type === 'image' ? 'image/*' : 'video/*'}
              maxSize={type === 'image' ? 5 : 100}
              size="sm"
            />
          </div>
          {values.zh && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
              {type === 'image' ? (
                <img
                  src={values.zh}
                  alt="中文预览"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <video
                  src={values.zh}
                  className="w-full h-32 object-cover"
                  controls
                />
              )}
            </div>
          )}
        </FormField>
      </div>

      {/* 英文上传 */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300 transition-all duration-300">
        <FormField label="🇬🇧 English">
          <div className="flex gap-3">
            <TextInput
              type="url"
              value={values.en}
              onChange={(e) => onChange('en', e.target.value)}
              placeholder={`Enter ${type === 'image' ? 'image' : 'video'} URL or click button to upload`}
              className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
            />
            <StandardUploadButton
              onUpload={(url) => onChange('en', url)}
              folder={`${folder}/en`}
              accept={type === 'image' ? 'image/*' : 'video/*'}
              maxSize={type === 'image' ? 5 : 100}
              size="sm"
            />
          </div>
          {values.en && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
              {type === 'image' ? (
                <img
                  src={values.en}
                  alt="English preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <video
                  src={values.en}
                  className="w-full h-32 object-cover"
                  controls
                />
              )}
            </div>
          )}
        </FormField>
      </div>

      {/* 俄文上传 */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300 transition-all duration-300">
        <FormField label="🇷🇺 Русский">
          <div className="flex gap-3">
            <TextInput
              type="url"
              value={values.ru}
              onChange={(e) => onChange('ru', e.target.value)}
              placeholder={`Введите URL ${type === 'image' ? 'изображения' : 'видео'} или нажмите кнопку для загрузки`}
              className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
            />
            <StandardUploadButton
              onUpload={(url) => onChange('ru', url)}
              folder={`${folder}/ru`}
              accept={type === 'image' ? 'image/*' : 'video/*'}
              maxSize={type === 'image' ? 5 : 100}
              size="sm"
            />
          </div>
          {values.ru && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
              {type === 'image' ? (
                <img
                  src={values.ru}
                  alt="Русский preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <video
                  src={values.ru}
                  className="w-full h-32 object-cover"
                  controls
                />
              )}
            </div>
          )}
        </FormField>
      </div>
    </div>
  );
}

