// Cloudflare Worker 文件上传处理 - 支持图片和视频 - 用于生产环境
import { getApiUrl, API_CONFIG } from './config';
import { AuthManager } from '@/lib/auth-manager';

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

      const response = await fetchWithAuthRetry(
        getApiUrl(API_CONFIG.PATHS.UPLOAD_FILE),
        formData,
        file.name
      );

      console.log('📝 文件上传响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = response.statusText;

        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage =
              errorJson?.message ||
              errorJson?.error?.message ||
              errorJson?.error?.details ||
              errorText;
          } catch {
            errorMessage = errorText;
          }
        }

        if (response.status === 401) {
          errorMessage = '登录已过期，请重新登录后再试';
        }

        console.error('❌ 文件上传失败:', errorMessage);
        throw new Error(errorMessage);
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

async function getAuthToken(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('上传功能仅在浏览器环境下可用');
  }

  try {
    const accessToken = await AuthManager.getValidAccessToken();
    if (isValidToken(accessToken)) {
      console.log('✅ 使用 JWT Access Token');
      return accessToken as string;
    }

    const adminAuthRaw = localStorage.getItem('admin-auth');
    if (adminAuthRaw) {
      try {
        const adminAuth = JSON.parse(adminAuthRaw);
        if (isValidToken(adminAuth?.accessToken)) {
          console.log('⚠️ 使用兼容模式 accessToken');
          return adminAuth.accessToken;
        }
        if (isValidToken(adminAuth?.token)) {
          console.log('⚠️ 使用兼容模式 token');
          return adminAuth.token;
        }
      } catch (error) {
        console.warn('解析 admin-auth 失败', error);
      }
    }

    const tempAuthRaw = localStorage.getItem('temp-admin-auth');
    if (tempAuthRaw) {
      try {
        const tempAuth = JSON.parse(tempAuthRaw);
        if (isValidToken(tempAuth?.accessToken)) {
          console.log('⚠️ 使用临时 accessToken');
          return tempAuth.accessToken;
        }
        if (isValidToken(tempAuth?.token)) {
          console.log('⚠️ 使用临时 token');
          return tempAuth.token;
        }
      } catch (error) {
        console.warn('解析 temp-admin-auth 失败', error);
      }
    }
  } catch (error) {
    console.warn('读取认证信息失败', error);
  }

  AuthManager.clearTokens();
  throw new Error('未登录或登录已过期，请重新登录后再试');
}

export const workerFileUpload = CloudflareWorkerFileUpload.getInstance();

async function fetchWithAuthRetry(url: string, body: FormData, fileName: string): Promise<Response> {
  let authToken = await getAuthToken();

  const doFetch = async (token: string) => {
    console.log('🔑 使用Token上传文件:', {
      fileName,
      tokenPreview: token.substring(0, 16) + '...'
    });

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body
    });
  };

  let response = await doFetch(authToken);

  if (response.status === 401) {
    console.warn('⚠️ Token 可能过期，尝试刷新...');
    const refreshed = await AuthManager.refreshToken();
    if (refreshed) {
      authToken = await getAuthToken();
      response = await doFetch(authToken);
    } else {
      AuthManager.clearTokens();
    }
  }

  if (response.status === 401) {
    throw new Error('登录已过期，请重新登录后重试');
  }

  return response;
}

const PLACEHOLDER_TOKENS = new Set(['admin-session', 'temp-admin', 'admin-token', '']);

function isValidToken(token: string | null | undefined): token is string {
  if (!token || typeof token !== 'string') {
    return false;
  }
  return !PLACEHOLDER_TOKENS.has(token.trim());
}
