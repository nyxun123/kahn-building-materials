// Cloudflare Worker 上传处理 - 用于生产环境
import { getApiUrl, API_CONFIG } from './config';

export interface WorkerUploadRequest {
  file: File;
  folder: string;
}

export interface WorkerUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  method: 'cloudflare' | 'base64';
}

export class CloudflareWorkerUpload {
  private static instance: CloudflareWorkerUpload;

  public static getInstance(): CloudflareWorkerUpload {
    if (!CloudflareWorkerUpload.instance) {
      CloudflareWorkerUpload.instance = new CloudflareWorkerUpload();
    }
    return CloudflareWorkerUpload.instance;
  }

  async uploadToWorker(file: File, folder: string): Promise<WorkerUploadResponse> {
    try {
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

      const response = await fetch(getApiUrl(API_CONFIG.PATHS.UPLOAD_IMAGE), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Worker上传失败: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        url: data.data?.original || data.data?.url,
        method: data.data?.uploadMethod || 'cloudflare'
      };
    } catch (error) {
      console.error('Worker上传失败:', error);
      
      return {
        success: false,
        error: `图片上传失败: ${error.message || '未知错误'}`,
        method: 'cloudflare'
      };
    }
  }

  private async uploadToBase64(file: File, folder: string): Promise<WorkerUploadResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve({
          success: true,
          url: reader.result as string,
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

export const workerUpload = CloudflareWorkerUpload.getInstance();