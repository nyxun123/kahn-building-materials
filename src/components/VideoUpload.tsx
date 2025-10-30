import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  RiVideoAddLine,
  RiDeleteBin6Line,
  RiUpload2Line,
  RiLoader4Line,
  RiPlayCircleLine
} from 'react-icons/ri';
import { uploadService } from '@/lib/upload-service';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  preview?: boolean;
  maxSizeMB?: number;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  onChange,
  folder = 'videos',
  className = '',
  preview = true,
  maxSizeMB = 100
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      console.log('🎬 开始上传视频:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder
      });

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize: maxSizeMB,
        allowedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/webm', 'video/mkv']
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('✅ 视频上传成功:', result);
      console.log('🔗 返回的URL:', result.url);

      onChange(result.url);

      const fileSize = (result.fileSize / 1024 / 1024).toFixed(2);
      toast.success(`视频上传成功！(${fileSize}MB)`);
      
    } catch (error) {
      console.error('❌ 视频上传失败:', error);
      
      let errorMessage = '视频上传失败';
      if (error instanceof Error) {
        if (error.message.includes('大小超过限制')) {
          errorMessage = `视频文件过大，请选择小于 ${maxSizeMB}MB 的文件`;
        } else if (error.message.includes('不支持')) {
          errorMessage = '不支持的视频格式，请使用 MP4, MOV, AVI, WMV, WebM 或 MKV 格式';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // 验证是否为视频文件
      if (!file.type.startsWith('video/')) {
        toast.error('请上传视频文件');
        return;
      }
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('视频已移除');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/mov,video/avi,video/wmv,video/webm,video/mkv"
        onChange={handleChange}
        className="hidden"
      />

      {value && preview ? (
        <div className="relative group">
          {/* 视频预览 */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <video
              src={value}
              controls
              className="w-full h-64 object-contain"
              preload="metadata"
            >
              您的浏览器不支持视频播放
            </video>
            
            {/* 悬浮操作按钮 */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleClick}
                disabled={uploading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                title="更换视频"
              >
                <RiUpload2Line className="w-5 h-5" />
              </button>
              <button
                onClick={handleRemove}
                disabled={uploading}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                title="删除视频"
              >
                <RiDeleteBin6Line className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 视频信息 */}
          <div className="mt-2 text-sm text-gray-600">
            <p className="truncate">{value.split('/').pop()}</p>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-all duration-200 cursor-pointer
            ${dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center text-center">
            {uploading ? (
              <>
                <RiLoader4Line className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  正在上传视频...
                </p>
                {uploadProgress > 0 && (
                  <div className="w-full max-w-xs">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{uploadProgress}%</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <RiVideoAddLine className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  点击上传或拖拽视频文件到此处
                </p>
                <p className="text-xs text-gray-500">
                  支持 MP4, MOV, AVI, WMV, WebM, MKV 格式，最大 {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;

