// 统一的上传服务 - 支持多种存储后端
import { toast } from 'react-hot-toast';
import { storageValidator } from './storage-validator';

interface UploadOptions {
  folder?: string;
  maxSize?: number; // MB
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  uploadMethod: 'cloudflare' | 'base64';
}

class UploadService {
  private static instance: UploadService;

  public static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  async uploadImage(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const {
      folder = 'products',
      maxSize = 5,
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    } = options;

    // 验证文件
    this.validateFile(file, maxSize, allowedTypes);

    // 直接上传到Cloudflare Worker，不使用base64回退
    return await this.uploadToCloudflare(file, folder);
  }

  private validateFile(file: File, maxSize: number, allowedTypes: string[]) {
    const validation = storageValidator.validateFile(file, {
      maxSize,
      allowedTypes
    });

    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
  }

  private async uploadToCloudflare(file: File, folder: string): Promise<UploadResult> {
    try {
      const { CloudflareWorkerUpload } = await import('./cloudflare-worker-upload');
      const uploader = CloudflareWorkerUpload.getInstance();
      const result = await uploader.uploadToWorker(file, folder);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Cloudflare上传失败');
      }

      return {
        url: result.url,
        fileName: file.name,
        fileSize: file.size,
        uploadMethod: 'cloudflare'
      };
    } catch (error) {
      console.error('Cloudflare上传失败:', error);
      throw new Error(`图片上传失败: ${error.message || '未知错误'}`);
    }
  }

  private async uploadToBase64(file: File, folder: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        const fileName = `${folder}/${Date.now()}_${file.name}`;
        
        resolve({
          url: base64,
          fileName,
          fileSize: file.size,
          uploadMethod: 'base64'
        });
      };
      
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  async uploadWithRetry(file: File, options: UploadOptions = {}, maxRetries = 3): Promise<UploadResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`上传尝试 ${attempt}/${maxRetries}`);
        const result = await this.uploadImage(file, options);
        console.log('上传成功:', result);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`上传失败 (尝试 ${attempt}):`, error);
        
        if (attempt < maxRetries) {
          // 指数退避重试
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('上传失败，已重试多次');
  }
}

export const uploadService = UploadService.getInstance();