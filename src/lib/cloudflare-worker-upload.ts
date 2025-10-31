// Cloudflare Worker 上传处理 - 用于生产环境
import { getApiUrl, API_CONFIG } from './config';
import { AuthManager } from '@/lib/auth-manager';

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
      console.log('🚀 开始上传图片到Cloudflare:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder
      });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetchWithAuthRetry(
        getApiUrl(API_CONFIG.PATHS.UPLOAD_IMAGE),
        formData,
        file.name
      );

      console.log('📝 上传响应状态:', response.status, response.statusText);
      
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

        console.error('❌ 上传失败:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ 上传响应数据:', data);

      if (data.code !== 200) {
        throw new Error(data.message || '上传失败');
      }

      // 处理不同的响应格式 - 优先使用 url 字段
      let imageUrl = data.data?.url || data.data?.original;
      let uploadMethod = data.data?.uploadMethod || 'cloudflare';

      // 如果是完整的URL对象，提取original URL
      if (data.data?.fullUrls?.original && !data.data?.url) {
        imageUrl = data.data.fullUrls.original;
      }

      console.log('🔗 提取的图片URL:', imageUrl);
      console.log('📤 上传方法:', uploadMethod);

      return {
        success: true,
        url: imageUrl,
        method: uploadMethod === 'cloudflare_r2' ? 'cloudflare' : uploadMethod
      };
    } catch (error) {
      console.error('❌ Worker上传失败:', error);
      
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

async function getAuthToken(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('上传功能仅在浏览器环境下可用');
  }

  try {
    let accessToken = await AuthManager.getValidAccessToken();

    if (!isValidToken(accessToken)) {
      const refreshed = await AuthManager.refreshToken();
      if (refreshed) {
        accessToken = await AuthManager.getValidAccessToken();
      }
    }

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

export const workerUpload = CloudflareWorkerUpload.getInstance();

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
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000; // 1分钟缓冲

function isValidToken(token: string | null | undefined): token is string {
  if (!token || typeof token !== 'string') {
    return false;
  }
  if (PLACEHOLDER_TOKENS.has(token.trim())) {
    return false;
  }
  return isTokenFresh(token);
}

function isTokenFresh(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return false;
    }

    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payload);
    const data = JSON.parse(decoded);

    if (!data?.exp) {
      return true;
    }

    const expiryMs = data.exp * 1000;
    return expiryMs - TOKEN_EXPIRY_BUFFER_MS > Date.now();
  } catch (error) {
    console.warn('解析Token有效期失败:', error);
    return false;
  }
}
