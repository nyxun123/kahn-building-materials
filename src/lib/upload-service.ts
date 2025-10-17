// 统一的上传服务 - 支持多种存储后端
import { toast } from 'react-hot-toast';
import { storageValidator } from './storage-validator';

interface UploadOptions {
  folder?: string;
  maxSize?: number; // MB
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  acceptVideo?: boolean; // 是否支持视频
}

interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileTypeCategory: 'image' | 'video';
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
      maxSize = 10,
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    } = options;

    // 验证文件
    this.validateFile(file, maxSize, allowedTypes);

    // 直接上传到Cloudflare Worker，不使用base64回退
    return await this.uploadToCloudflare(file, folder);
  }

  async uploadVideo(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const {
      folder = 'videos',
      maxSize = 100,
      allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv']
    } = options;

    // 验证文件
    this.validateFile(file, maxSize, allowedTypes);

    // 上传视频到Cloudflare Worker
    return await this.uploadFileToCloudflare(file, folder);
  }

  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const { folder = 'general', acceptVideo = false } = options;

    // 根据文件类型自动选择上传方法
    if (file.type.startsWith('image/')) {
      return await this.uploadImage(file, { ...options, folder });
    } else if (file.type.startsWith('video/') && acceptVideo) {
      return await this.uploadVideo(file, { ...options, folder });
    } else {
      throw new Error(`不支持的文件类型: ${file.type}`);
    }
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
        fileType: file.type,
        fileTypeCategory: file.type.startsWith('image/') ? 'image' : 'video',
        uploadMethod: 'cloudflare'
      };
    } catch (error) {
      console.error('Cloudflare上传失败:', error);
      throw new Error(`文件上传失败: ${error.message || '未知错误'}`);
    }
  }

  private async uploadFileToCloudflare(file: File, folder: string): Promise<UploadResult> {
    try {
      const { CloudflareWorkerFileUpload } = await import('./cloudflare-worker-file-upload');
      const uploader = CloudflareWorkerFileUpload.getInstance();
      const result = await uploader.uploadFileToWorker(file, folder);

      if (!result.success || !result.url) {
        throw new Error(result.error || '文件上传失败');
      }

      return {
        url: result.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileTypeCategory: file.type.startsWith('image/') ? 'image' : 'video',
        uploadMethod: 'cloudflare'
      };
    } catch (error) {
      console.error('文件上传失败:', error);
      throw new Error(`文件上传失败: ${error.message || '未知错误'}`);
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
          fileType: file.type,
          fileTypeCategory: file.type.startsWith('image/') ? 'image' : 'video',
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