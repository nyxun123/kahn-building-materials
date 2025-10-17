// Cloudflare Worker 文件上传处理 - 支持图片和视频 - 用于生产环境
import { getApiUrl, API_CONFIG } from './config';

export interface WorkerFileUploadRequest {
  file: File;
  folder: string;
}

export interface WorkerFileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  fileTypeCategory?: 'image' | 'video';
  method: 'cloudflare' | 'base64';
}

export class CloudflareWorkerFileUpload {
  private static instance: CloudflareWorkerFileUpload;

  public static getInstance(): CloudflareWorkerFileUpload {
    if (!CloudflareWorkerFileUpload.instance) {
      CloudflareWorkerFileUpload.instance = new CloudflareWorkerFileUpload();
    }
    return CloudflareWorkerFileUpload.instance;
  }

  async uploadFileToWorker(file: File, folder: string): Promise<WorkerFileUploadResponse> {
    try {
      console.log('🚀 开始上传文件到Cloudflare:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // 获取认证token
      const getAuthToken = () => {
        try {
          const adminAuth = localStorage.getItem("admin-auth");
          if (adminAuth) {
            const parsed = JSON.parse(adminAuth);
            return parsed?.token || 'admin-session';
          }
          const tempAuth = localStorage.getItem("temp-admin-auth");
          if (tempAuth) {
            return 'temp-admin';
          }
        } catch (error) {
          console.warn("读取认证信息失败", error);
        }
        return 'admin-token'; // 默认token
      };

      const response = await fetch(getApiUrl(API_CONFIG.PATHS.UPLOAD_FILE), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData,
      });

      console.log('📝 文件上传响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 文件上传失败:', errorText);
        throw new Error(`上传失败 (${response.status}): ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ 文件上传响应数据:', data);

      if (data.code !== 200) {
        throw new Error(data.message || '文件上传失败');
      }

      return {
        success: true,
        url: data.data?.original || data.data?.url,
        fileTypeCategory: data.data?.fileTypeCategory || (file.type.startsWith('image/') ? 'image' : 'video'),
        method: data.data?.uploadMethod || 'cloudflare'
      };
    } catch (error) {
      console.error('❌ Worker文件上传失败:', error);

      return {
        success: false,
        error: `文件上传失败: ${error.message || '未知错误'}`,
        method: 'cloudflare'
      };
    }
  }

  private async uploadToBase64(file: File, folder: string): Promise<WorkerFileUploadResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          success: true,
          url: reader.result as string,
          fileTypeCategory: file.type.startsWith('image/') ? 'image' : 'video',
          method: 'base64'
        });
      };

      reader.onerror = () => reject({
        success: false,
        error: '文件读取失败',
        method: 'base64'
      });

      reader.readAsDataURL(file);
    });
  }
}

export const workerFileUpload = CloudflareWorkerFileUpload.getInstance();