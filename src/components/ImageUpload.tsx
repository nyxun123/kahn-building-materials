import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  RiImageAddLine,
  RiDeleteBin6Line,
  RiUpload2Line,
  RiLoader4Line
} from 'react-icons/ri';
import { uploadService } from '@/lib/upload-service';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  preview?: boolean;
}

interface UploadResponse {
  code: number;
  message: string;
  data?: {
    original: string;
    large: string;
    medium: string;
    small: string;
    thumbnail: string;
    fullUrls: {
      original: string;
      large: string;
      medium: string;
      small: string;
      thumbnail: string;
    };
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'products',
  className = '',
  preview = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      
      console.log('🚀 开始上传图片:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder
      });

      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize: 5,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });

      console.log('✅ 上传成功:', result);
      console.log('🔗 返回的URL:', result.url);
      console.log('📤 上传方法:', result.uploadMethod);

      onChange(result.url);

      // 详细的成功提示
      const uploadMethod = result.uploadMethod === 'cloudflare' ? '云端存储' : '本地存储';
      const fileSize = (result.fileSize / 1024 / 1024).toFixed(2);
      toast.success(`图片上传成功！${uploadMethod} (${fileSize}MB)`);
      
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      toast.error(error instanceof Error ? error.message : '图片上传失败');
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
    // Clear input to allow re-selecting the same file
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    toast.success('图片已移除');
  };

  const getImagePreview = () => {
    if (!value) return null;
    
    // Check if it's a data URL (base64)
    if (value.startsWith('data:')) {
      return value;
    }
    
    // If it's a Cloudflare R2 URL, return as-is
    if (value.startsWith('https://')) {
      return value;
    }
    
    // If it's a relative path (legacy images), try to construct a valid URL
    if (value.startsWith('/')) {
      // 这里可以尝试使用静态资源路径，但通常不可用
      // 可以考虑显示一个占位图像或者提示用户重新上传
      console.warn('检测到旧的相对路径图片:', value);
      return window.location.origin + value; // 尝试构造完整URL
    }
    
    // Return original URL
    return value;
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {value && preview ? (
        <div className="relative group">
          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <img
              src={getImagePreview()}
              alt="预览图片"
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.warn('图片加载失败:', value);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Hover overlay with action buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <RiLoader4Line className="mr-1 animate-spin" />
              ) : (
                <RiUpload2Line className="mr-1" />
              )}
              更换
            </button>
            
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiDeleteBin6Line className="mr-1" />
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-8 
            cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 
            transition-colors duration-200 text-center
            ${dragOver ? 'border-primary bg-primary/5' : ''}
            ${uploading ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <RiLoader4Line size={32} className="text-primary animate-spin" />
            ) : (
              <RiImageAddLine size={32} className="text-gray-400" />
            )}
            
            <div className="text-sm">
              <span className="font-medium text-primary">点击上传</span>
              <span className="text-gray-500"> 或拖拽图片到此处</span>
            </div>
            
            <div className="text-xs text-gray-400">
              支持 JPEG、PNG、WebP、GIF 格式，最大 5MB
            </div>
            
            {uploading && (
              <div className="text-xs text-primary font-medium">
                正在上传...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;