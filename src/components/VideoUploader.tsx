import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { RiUploadCloudLine, RiCloseLine, RiVideoLine, RiPlayCircleLine } from 'react-icons/ri';
import { uploadService } from '@/lib/upload-service';
import { uploadNotification } from '@/lib/upload-notification';

interface VideoUploaderProps {
  onVideoUpload: (url: string) => void;
  currentVideo?: string | null;
  folder?: string;
  maxSize?: number; // MB
  accept?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoUpload,
  currentVideo,
  folder = 'videos',
  maxSize = 100,
  accept = 'video/*'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentVideo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`视频大小不能超过 ${maxSize}MB`);
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      toast.error('请选择视频文件');
      return;
    }

    setUploading(true);

    // 显示上传开始通知
    uploadNotification.showUploadStart(file.name, 'video');

    try {
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // 使用统一的上传服务上传视频
      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize,
        acceptVideo: true,
        allowedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv']
      });

      console.log('✅ 视频上传成功:', result);
      onVideoUpload(result.url);

      // 显示详细的成功通知
      const uploadMethod = result.uploadMethod === 'cloudflare' || result.uploadMethod === 'cloudflare_r2' || result.uploadMethod === 'base64_fallback' ? '云端存储' : '本地存储';
      uploadNotification.showUploadSuccess({
        fileName: file.name,
        fileSize: result.fileSize,
        fileType: result.fileType,
        fileTypeCategory: result.fileTypeCategory,
        uploadMethod: uploadMethod,
        uploadTime: Date.now() // 简化处理，实际应该从后端获取
      });

      // 清理预览URL以释放内存
      if (previewUrl && previewUrl !== result.url) {
        URL.revokeObjectURL(previewUrl);
      }

    } catch (error) {
      console.error('❌ 视频上传失败:', error);

      // 显示详细的错误通知
      uploadNotification.showUploadError(
        file.name,
        error instanceof Error ? error.message : '视频上传失败',
        'video'
      );

      // 清理预览URL
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
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

  const handleRemoveVideo = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onVideoUpload('');

    // 显示删除成功通知
    uploadNotification.showDeleteSuccess('视频文件', 'video');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getVideoTypeDisplay = (url: string) => {
    if (url.includes('data:video')) return 'Base64 视频';
    if (url.includes('r2.dev')) return 'R2 存储';
    return '外部视频';
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
          <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-black">
            <video
              src={preview}
              controls
              className="w-full h-64 object-contain"
              preload="metadata"
            >
              您的浏览器不支持视频播放
            </video>

            {/* 视频信息覆盖层 */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              <div className="flex items-center space-x-1">
                <RiVideoLine className="w-3 h-3" />
                <span>{getVideoTypeDisplay(preview)}</span>
              </div>
            </div>

            {/* 删除按钮 */}
            <button
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              title="删除视频"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>

            {/* 上传中的覆盖层 */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">正在上传视频...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <RiVideoLine className="w-16 h-16 text-gray-400" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-600 mb-2">
                {uploading ? '上传中...' : '点击或拖拽上传视频'}
              </p>
              <p className="text-sm text-gray-500">
                支持 MP4, MOV, AVI, WebM 格式，最大 {maxSize}MB
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                disabled={uploading}
              >
                <RiUploadCloudLine className="w-4 h-4 mr-2" />
                选择视频文件
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && !preview && (
        <div className="text-center text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
            <span>正在处理视频文件...</span>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <RiPlayCircleLine className="w-5 h-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              视频上传提示
            </h3>
            <div className="mt-1 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>支持主流视频格式，建议使用 MP4 格式以获得最佳兼容性</li>
                <li>视频文件较大时上传可能需要较长时间，请耐心等待</li>
                <li>上传成功后会自动生成预览，您可以检查视频内容</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;