import { useState, useRef } from 'react';
import { Button } from '@tremor/react';
import { RiUpload2Line, RiLoader4Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { uploadService } from '@/lib/upload-service';

interface StandardUploadButtonProps {
  onUpload: (url: string) => void;
  folder: string;
  accept?: string;
  maxSize?: number; // MB
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

/**
 * 标准上传按钮组件
 * 用于URL输入框旁边的上传按钮
 * 
 * @example
 * <StandardUploadButton
 *   onUpload={(url) => setImageUrl(url)}
 *   folder="products"
 *   size="sm"
 * />
 */
export function StandardUploadButton({
  onUpload,
  folder,
  accept = 'image/*',
  maxSize = 5,
  size = 'sm',
  className = '',
  disabled = false,
}: StandardUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 重置input值，允许重复选择同一文件
    e.target.value = '';

    try {
      setUploading(true);

      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize,
        allowedTypes: accept === 'image/*' 
          ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
          : accept === 'video/*'
          ? ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
          : undefined,
      });

      onUpload(result.url);
      toast.success('上传成功！');

    } catch (error) {
      console.error('❌ 文件上传失败:', error);
      toast.error(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled || uploading}
        size={size}
        variant="light"
        className={`
          min-w-[100px] 
          bg-gradient-to-r from-indigo-500 to-purple-600 
          text-white 
          font-medium
          hover:from-indigo-600 hover:to-purple-700 
          hover:shadow-lg
          active:scale-95
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {uploading ? (
          <>
            <RiLoader4Line className="mr-1 animate-spin" />
            上传中...
          </>
        ) : (
          <>
            <RiUpload2Line className="mr-1" />
            上传
          </>
        )}
      </Button>
    </div>
  );
}



