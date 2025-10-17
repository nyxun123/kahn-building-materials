// 上传通知工具 - 提供详细的上传反馈
import { toast } from 'react-hot-toast';

export interface UploadNotificationOptions {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileTypeCategory: 'image' | 'video';
  uploadMethod: string;
  uploadTime: number;
}

export class UploadNotificationService {
  private static instance: UploadNotificationService;

  public static getInstance(): UploadNotificationService {
    if (!UploadNotificationService.instance) {
      UploadNotificationService.instance = new UploadNotificationService();
    }
    return UploadNotificationService.instance;
  }

  // 显示上传开始通知
  showUploadStart(fileName: string, fileTypeCategory: 'image' | 'video') {
    const typeText = fileTypeCategory === 'image' ? '图片' : '视频';
    toast.loading(`正在上传${typeText}: ${fileName}`, {
      id: 'upload-progress',
      duration: 0
    });
  }

  // 显示上传成功通知
  showUploadSuccess(options: UploadNotificationOptions) {
    const { fileName, fileSize, fileTypeCategory, uploadMethod, uploadTime } = options;
    const typeText = fileTypeCategory === 'image' ? '图片' : '视频';
    const methodText = uploadMethod === 'cloudflare_r2' ? '云端存储' : '本地存储';
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
    const uploadTimeMs = uploadTime.toFixed(0);

    toast.success(
      `${typeText}上传成功！`,
      {
        id: 'upload-progress',
        duration: 4000,
        icon: '✅',
        position: 'top-right'
      }
    );

    // 显示详细信息
    setTimeout(() => {
      toast(
        (
          <div className="text-left">
            <div className="font-medium">{fileName}</div>
            <div className="text-xs opacity-80">
              📁 {methodText} • 💾 {fileSizeMB}MB • ⏱️ {uploadTimeMs}ms
            </div>
          </div>
        ),
        {
          duration: 6000,
          icon: fileTypeCategory === 'image' ? '🖼️' : '🎬',
          position: 'top-right'
        }
      );
    }, 500);
  }

  // 显示上传失败通知
  showUploadError(fileName: string, error: string, fileTypeCategory: 'image' | 'video') {
    const typeText = fileTypeCategory === 'image' ? '图片' : '视频';

    toast.error(
      `${typeText}上传失败`,
      {
        id: 'upload-progress',
        duration: 5000,
        position: 'top-right'
      }
    );

    setTimeout(() => {
      toast.error(
        (
          <div className="text-left">
            <div className="font-medium">{fileName}</div>
            <div className="text-xs opacity-80">{error}</div>
          </div>
        ),
        {
          duration: 8000,
          position: 'top-right'
        }
      );
    }, 500);
  }

  // 显示上传进度通知
  showUploadProgress(fileName: string, progress: number, fileTypeCategory: 'image' | 'video') {
    const typeText = fileTypeCategory === 'image' ? '图片' : '视频';

    toast.loading(
      (
        <div className="text-left">
          <div className="font-medium">正在上传{typeText}</div>
          <div className="text-xs opacity-80">{fileName}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ),
      {
        id: 'upload-progress',
        duration: 0,
        position: 'top-right'
      }
    );
  }

  // 清除所有上传通知
  clearUploadNotifications() {
    toast.dismiss('upload-progress');
  }

  // 显示文件删除成功通知
  showDeleteSuccess(fileName: string, fileTypeCategory: 'image' | 'video') {
    const typeText = fileTypeCategory === 'image' ? '图片' : '视频';
    const icon = fileTypeCategory === 'image' ? '🖼️' : '🎬';

    toast.success(`${typeText}已删除: ${fileName}`, {
      icon,
      duration: 3000
    });
  }
}

export const uploadNotification = UploadNotificationService.getInstance();

// 便捷函数
export const showUploadSuccess = (options: UploadNotificationOptions) => {
  uploadNotification.showUploadSuccess(options);
};

export const showUploadError = (fileName: string, error: string, fileTypeCategory: 'image' | 'video') => {
  uploadNotification.showUploadError(fileName, error, fileTypeCategory);
};

export const showUploadStart = (fileName: string, fileTypeCategory: 'image' | 'video') => {
  uploadNotification.showUploadStart(fileName, fileTypeCategory);
};

export const showDeleteSuccess = (fileName: string, fileTypeCategory: 'image' | 'video') => {
  uploadNotification.showDeleteSuccess(fileName, fileTypeCategory);
};