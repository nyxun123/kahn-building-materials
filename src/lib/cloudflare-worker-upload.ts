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
    // 优先使用 AuthManager 获取有效的 JWT Token
    let accessToken = await AuthManager.getValidAccessToken();

    if (accessToken && isTokenValid(accessToken)) {
      console.log('✅ 使用 JWT Access Token (AuthManager)');
      return accessToken;
    }

    // 如果 AuthManager 返回 null，尝试刷新 token
    if (!accessToken) {
      console.log('🔄 AuthManager 未返回 token，尝试刷新...');
      const refreshed = await AuthManager.refreshToken();
      if (refreshed) {
        accessToken = await AuthManager.getValidAccessToken();
        if (accessToken && isTokenValid(accessToken)) {
          console.log('✅ Token 刷新成功');
          return accessToken;
        }
      }
    }

    // 回退到直接从 localStorage 读取（不检查过期，因为 AuthManager 已经检查过了）
    const directToken = localStorage.getItem('admin_access_token');
    if (directToken && isTokenValid(directToken)) {
      console.log('✅ 使用直接读取的 Access Token');
      return directToken;
    }

    // 兼容旧的存储方式
    const adminAuthRaw = localStorage.getItem('admin-auth');
    if (adminAuthRaw) {
      try {
        const adminAuth = JSON.parse(adminAuthRaw);
        if (adminAuth?.accessToken && isTokenValid(adminAuth.accessToken)) {
          console.log('⚠️ 使用兼容模式 accessToken');
          return adminAuth.accessToken;
        }
        if (adminAuth?.token && isTokenValid(adminAuth.token)) {
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
        if (tempAuth?.accessToken && isTokenValid(tempAuth.accessToken)) {
          console.log('⚠️ 使用临时 accessToken');
          return tempAuth.accessToken;
        }
        if (tempAuth?.token && isTokenValid(tempAuth.token)) {
          console.log('⚠️ 使用临时 token');
          return tempAuth.token;
        }
      } catch (error) {
        console.warn('解析 temp-admin-auth 失败', error);
      }
    }
  } catch (error) {
    console.error('❌ 获取认证Token失败:', error);
  }

  // 最后尝试：如果所有方式都失败，清除token并抛出错误
  console.error('❌ 所有认证方式都失败，清除token');
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

/**
 * 检查 token 是否有效（格式和占位符检查）
 * 不检查过期时间，因为 AuthManager 已经处理了过期检查
 */
function isTokenValid(token: string | null | undefined): token is string {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // 检查是否是占位符 token
  if (PLACEHOLDER_TOKENS.has(token.trim())) {
    return false;
  }
  
  // 检查是否是有效的 JWT 格式（至少3部分，用.分隔）
  const parts = token.split('.');
  if (parts.length < 3) {
    console.warn('⚠️ Token 格式无效（不是有效的JWT）');
    return false;
  }
  
  // 基本格式检查通过
  return true;
}

/**
 * 检查 token 是否即将过期（用于警告，但不阻止使用）
 */
function isTokenFresh(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return false;
    }

    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // 补全 base64 padding
    while (payload.length % 4) {
      payload += '=';
    }
    const decoded = atob(payload);
    const data = JSON.parse(decoded);

    if (!data?.exp) {
      // 没有过期时间，认为有效
      return true;
    }

    // 检查是否已过期（而不是即将过期）
    const expiryMs = data.exp * 1000;
    const now = Date.now();
    
    if (expiryMs <= now) {
      console.warn('⚠️ Token 已过期', {
        expiry: new Date(expiryMs).toLocaleString(),
        now: new Date(now).toLocaleString()
      });
      return false;
    }
    
    // Token 还未过期
    return true;
  } catch (error) {
    console.warn('⚠️ 解析Token有效期失败:', error);
    // 解析失败时，认为格式可能有问题，但不阻止使用（可能格式不同）
    return true;
  }
}
