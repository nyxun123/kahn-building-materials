import { useState, useRef } from 'react';
import { Card, Text } from '@tremor/react';
import { RiImageAddLine, RiDeleteBin6Line, RiUpload2Line, RiLoader4Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { uploadService } from '@/lib/upload-service';

interface MediaUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  type?: 'image' | 'video';
  preview?: boolean;
  className?: string;
}

/**
 * 媒体上传组件
 * 用于媒体库、独立上传区域
 * 支持拖拽、点击上传、预览、删除
 */
export function MediaUpload({
  value,
  onChange,
  folder = 'products',
  type = 'image',
  preview = true,
  className = '',
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);

      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize: type === 'video' ? 100 : 5,
        allowedTypes: type === 'image'
          ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
          : ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
      });

      onChange(result.url);
      toast.success(`${type === 'image' ? '图片' : '视频'}上传成功！`);

    } catch (error) {
      console.error(`❌ ${type === 'image' ? '图片' : '视频'}上传失败:`, error);
      toast.error(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {value && preview ? (
        // 预览模式
        <Card className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-all duration-300">
          <div className="relative">
            {type === 'image' ? (
              <img
                src={value}
                alt="预览"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  console.warn('图片加载失败:', value);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <video
                src={value}
                className="w-full h-64 object-cover"
                controls
              />
            )}

            {/* 悬停覆盖层 */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClick}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {uploading ? (
                  <>
                    <RiLoader4Line className="animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <RiUpload2Line />
                    更换
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <RiDeleteBin6Line />
                删除
              </button>
            </div>
          </div>
        </Card>
      ) : (
        // 上传区域
        <Card
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12
            cursor-pointer transition-all duration-300
            ${dragOver 
              ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {uploading ? (
              <>
                <RiLoader4Line className="h-16 w-16 text-indigo-500 animate-spin" />
                <Text className="text-lg font-medium text-gray-700">上传中...</Text>
              </>
            ) : (
              <>
                <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                  <RiImageAddLine className="h-12 w-12 text-indigo-600" />
                </div>
                <div>
                  <Text className="text-lg font-semibold text-gray-900">
                    点击上传 {type === 'image' ? '图片' : '视频'}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    或拖拽文件到此处
                  </Text>
                  <Text className="text-xs text-gray-400 mt-2">
                    {type === 'image' 
                      ? '支持 JPEG、PNG、WebP、GIF 格式，最大 5MB'
                      : '支持 MP4、WebM、OGG 格式，最大 100MB'
                    }
                  </Text>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

