import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { RiUploadCloudLine, RiCloseLine, RiImageLine } from 'react-icons/ri';
import { uploadService } from '@/lib/upload-service';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string | null;
  folder?: string;
  maxSize?: number; // MB
  accept?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  folder = 'products',
  maxSize = 5,
  accept = 'image/*'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`图片大小不能超过 ${maxSize}MB`);
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    setUploading(true);

    try {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 使用统一的上传服务
      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });
      
      console.log('✅ 上传成功:', result);
      onImageUpload(result.url);
      toast.success('图片上传成功');
      
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      toast.error(error instanceof Error ? error.message : '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="预览"
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
          
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-2">
            <RiUploadCloudLine className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {uploading ? '上传中...' : '点击或拖拽上传图片'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              支持 JPG, PNG, WebP 格式，最大 {maxSize}MB
            </p>
          </div>
        </div>
      )}

      {uploading && !preview && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          正在上传图片...
        </div>
      )}
    </div>
  );
};

export default ImageUploader;