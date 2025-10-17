import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { RiUploadCloudLine, RiCloseLine, RiImageLine, RiVideoLine, RiFileLine } from 'react-icons/ri';
import { uploadService } from '@/lib/upload-service';

interface FileUploaderProps {
  onFileUpload: (url: string, fileType: 'image' | 'video') => void;
  currentFile?: string | null;
  folder?: string;
  maxSize?: number; // MB
  accept?: string;
  allowVideo?: boolean;
  title?: string;
  description?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  currentFile,
  folder = 'general',
  maxSize = 10,
  accept = 'image/*,video/*',
  allowVideo = true,
  title = '文件上传',
  description = '支持图片和视频文件上传'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(
    currentFile ? { url: currentFile, type: currentFile.startsWith('data:image') ? 'image' : 'video' } : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && (!allowVideo || !isVideo)) {
      toast.error(`不支持的文件类型: ${file.type}`);
      return;
    }

    // 验证文件大小
    const actualMaxSize = isVideo ? 100 : maxSize; // 视频文件最大100MB
    if (file.size > actualMaxSize * 1024 * 1024) {
      toast.error(`文件大小不能超过 ${actualMaxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      const fileType = isImage ? 'image' : 'video';
      setPreview({ url: previewUrl, type: fileType });

      // 使用统一的上传服务
      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize: actualMaxSize,
        acceptVideo: allowVideo,
        allowedTypes: isImage
          ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
          : ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv']
      });

      console.log('✅ 文件上传成功:', result);
      onFileUpload(result.url, result.fileTypeCategory);
      toast.success(`${fileType === 'image' ? '图片' : '视频'}上传成功`);

      // 清理预览URL以释放内存
      if (previewUrl && previewUrl !== result.url) {
        URL.revokeObjectURL(previewUrl);
      }

    } catch (error) {
      console.error('❌ 文件上传失败:', error);
      toast.error(error instanceof Error ? error.message : '文件上传失败');

      // 清理预览URL
      if (preview && preview.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url);
      }
      setPreview(null);
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

  const handleRemoveFile = () => {
    if (preview?.url.startsWith('blob:')) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    onFileUpload('', 'image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: 'image' | 'video') => {
    return type === 'image' ? <RiImageLine className="w-16 h-16" /> : <RiVideoLine className="w-16 h-16" />;
  };

  const getFileTypeDisplay = (url: string, type: 'image' | 'video') => {
    if (url.includes('data:')) return `Base64 ${type === 'image' ? '图片' : '视频'}`;
    if (url.includes('r2.dev')) return `R2 存储 ${type === 'image' ? '图片' : '视频'}`;
    return `外部${type === 'image' ? '图片' : '视频'}`;
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
          <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
            {preview.type === 'image' ? (
              <img
                src={preview.url}
                alt="预览"
                className="w-full h-64 object-contain"
              />
            ) : (
              <video
                src={preview.url}
                controls
                className="w-full h-64 object-contain"
                preload="metadata"
              >
                您的浏览器不支持视频播放
              </video>
            )}

            {/* 文件类型标签 */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              <div className="flex items-center space-x-1">
                {preview.type === 'image' ? <RiImageLine className="w-3 h-3" /> : <RiVideoLine className="w-3 h-3" />}
                <span>{getFileTypeDisplay(preview.url, preview.type)}</span>
              </div>
            </div>

            {/* 删除按钮 */}
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              title="删除文件"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>

            {/* 上传中的覆盖层 */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">正在上传文件...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <RiFileLine className="w-16 h-16 text-gray-400" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                {uploading ? '上传中...' : title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                图片最大 {maxSize}MB {allowVideo ? '，视频最大 100MB' : ''}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                disabled={uploading}
              >
                <RiUploadCloudLine className="w-4 h-4 mr-2" />
                选择文件
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && !preview && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
            <span>正在处理文件...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;