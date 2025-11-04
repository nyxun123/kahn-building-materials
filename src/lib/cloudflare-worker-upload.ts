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
        let errorText = '';
        let errorMessage = response.statusText;

        try {
          errorText = await response.text();
          console.log('📋 错误响应内容:', errorText);
          
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText);
              console.log('📋 解析后的错误JSON:', errorJson);
              
              // 尝试多种可能的错误消息字段
              errorMessage =
                errorJson?.message ||
                errorJson?.error?.message ||
                errorJson?.error?.details ||
                (typeof errorJson?.error === 'string' ? errorJson.error : null) ||
                errorText;
              
              // 如果没有找到消息，使用状态码构造
              if (!errorMessage || errorMessage === response.statusText) {
                if (response.status === 401) {
                  errorMessage = errorJson?.message || '未登录或登录已过期，请重新登录后再试';
                } else {
                  errorMessage = errorJson?.message || `上传失败 (${response.status})`;
                }
              }
            } catch (parseError) {
              console.warn('⚠️ 解析错误响应失败:', parseError);
              // 如果不是JSON，直接使用文本
              errorMessage = errorText || response.statusText;
            }
          }
        } catch (readError) {
          console.error('❌ 读取错误响应失败:', readError);
          errorMessage = response.statusText || '上传失败';
        }

        if (response.status === 401) {
          errorMessage = errorMessage || '未登录或登录已过期，请重新登录后再试';
        }

        console.error('❌ 上传失败:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage: errorMessage,
          errorText: errorText.substring(0, 200) // 只记录前200字符
        });
        
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

  console.log('🔍 开始获取认证Token...');
  
  // 🔧 修复: 首先检查 localStorage 中的所有可能的 token 位置
  const adminAccessToken = localStorage.getItem('admin_access_token');
  const adminAuthRaw = localStorage.getItem('admin-auth');
  const tempAuthRaw = localStorage.getItem('temp-admin-auth');
  
  console.log('📦 localStorage 状态:', {
    hasAdminAccessToken: !!adminAccessToken,
    adminAccessTokenLength: adminAccessToken?.length || 0,
    hasAdminAuth: !!adminAuthRaw,
    hasTempAuth: !!tempAuthRaw,
    adminTokenExpiry: localStorage.getItem('admin_token_expiry'),
    adminUserInfo: !!localStorage.getItem('admin_user_info'),
    allKeys: Object.keys(localStorage).filter(k => k.includes('admin') || k.includes('token') || k.includes('auth'))
  });

  // 🔧 修复: 方式1 - 优先直接从localStorage读取token（如果存在）
  if (adminAccessToken && isTokenValid(adminAccessToken)) {
    console.log('✅ 方式1: 直接从localStorage读取token');
    // 检查token是否过期
    const expiryStr = localStorage.getItem('admin_token_expiry');
    if (expiryStr) {
      const expiry = parseInt(expiryStr);
      const now = Date.now();
      if (now < expiry) {
        console.log('✅ Token未过期，直接使用');
        return adminAccessToken;
      } else {
        console.warn('⚠️ Token已过期，尝试刷新...');
        // 继续执行后续逻辑，尝试刷新
      }
    } else {
      // 没有过期时间，直接使用
      console.log('✅ Token无过期时间，直接使用');
      return adminAccessToken;
    }
  }

  // 🔧 修复: 方式2 - 尝试从admin-auth读取token（旧格式）
  if (adminAuthRaw) {
    try {
      const parsed = JSON.parse(adminAuthRaw);
      const oldToken = parsed?.accessToken;
      if (oldToken && isTokenValid(oldToken)) {
        console.log('✅ 方式2: 从admin-auth读取token');
        // 检查过期时间
        const loginTime = parsed?.loginTime ? new Date(parsed.loginTime).getTime() : null;
        const expiresIn = parsed?.expiresIn || 900; // 默认15分钟
        if (loginTime) {
          const expiry = loginTime + (expiresIn * 1000);
          const now = Date.now();
          if (now < expiry) {
            console.log('✅ 旧格式Token未过期，直接使用');
            return oldToken;
          } else {
            console.warn('⚠️ 旧格式Token已过期');
          }
        } else {
          // 没有过期时间，直接使用
          console.log('✅ 旧格式Token无过期时间，直接使用');
          return oldToken;
        }
      }
    } catch (e) {
      console.error('解析 admin-auth 失败:', e);
    }
  }

  // 方式3: 使用 AuthManager 获取有效的 JWT Token
  try {
    let accessToken = await AuthManager.getValidAccessToken();
    console.log('🔑 方式3: AuthManager.getValidAccessToken() 结果:', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length || 0
    });

    if (accessToken && isTokenValid(accessToken)) {
      console.log('✅ 使用 JWT Access Token (AuthManager)');
      return accessToken;
    }

    // 如果 AuthManager 返回 null，尝试刷新 token
    if (!accessToken) {
      console.log('🔄 AuthManager 未返回 token，尝试刷新...');
      try {
        const refreshed = await AuthManager.refreshToken();
        console.log('🔄 Token 刷新结果:', refreshed ? '成功' : '失败');
        if (refreshed) {
          accessToken = await AuthManager.getValidAccessToken();
          if (accessToken && isTokenValid(accessToken)) {
            console.log('✅ Token 刷新成功，使用新token');
            return accessToken;
          }
        }
      } catch (refreshError) {
        console.warn('⚠️ Token 刷新异常:', refreshError);
      }
    }
  } catch (error) {
    console.error('❌ AuthManager 获取token异常:', error);
  }

  // 方式4: 回退到直接读取（如果token格式正确且未过期）
  if (adminAccessToken && isTokenValid(adminAccessToken)) {
    if (isTokenFresh(adminAccessToken)) {
      console.log('⚠️ 方式4: 使用直接读取的 Access Token（AuthManager 失败的回退）');
      return adminAccessToken;
    } else {
      console.warn('⚠️ admin_access_token 已过期，无法使用');
    }
  }

  // 如果所有方式都失败，输出详细的调试信息
  console.error('❌ 所有认证方式都失败');
  
  // 检查 token 是否存在但过期
  const expiryStr = localStorage.getItem('admin_token_expiry');
  const expiry = expiryStr ? parseInt(expiryStr) : null;
  const now = Date.now();
  const isExpired = expiry ? now >= expiry : null;
  
  console.error('📋 详细调试信息:', {
    adminAccessToken: adminAccessToken ? `${adminAccessToken.substring(0, 20)}...` : 'null',
    adminAuthRaw: adminAuthRaw ? '存在' : 'null',
    tempAuthRaw: tempAuthRaw ? '存在' : 'null',
    tokenValid: adminAccessToken ? isTokenValid(adminAccessToken) : false,
    tokenFresh: adminAccessToken ? isTokenFresh(adminAccessToken) : false,
    hasExpiry: !!expiry,
    isExpired: isExpired,
    expiryTime: expiry ? new Date(expiry).toLocaleString() : 'null',
    currentTime: new Date(now).toLocaleString(),
    timeDiff: expiry && isExpired ? `${Math.round((now - expiry) / 1000)}秒前过期` : expiry ? `${Math.round((expiry - now) / 1000)}秒后过期` : '未知',
    allLocalStorageKeys: Object.keys(localStorage).filter(k => k.includes('admin') || k.includes('token') || k.includes('auth'))
  });
  
  // 根据情况给出更具体的错误信息
  let errorMessage = '未登录或登录已过期，请重新登录后再试';
  if (!adminAccessToken && !adminAuthRaw && !tempAuthRaw) {
    errorMessage = '未登录，请先登录';
  } else if (isExpired === true) {
    errorMessage = '登录已过期，请重新登录';
  } else if (adminAccessToken && !isTokenValid(adminAccessToken)) {
    errorMessage = '认证信息格式错误，请重新登录';
  }
  
  throw new Error(errorMessage);
}

export const workerUpload = CloudflareWorkerUpload.getInstance();

async function fetchWithAuthRetry(url: string, body: FormData, fileName: string): Promise<Response> {
  console.log('🔍 开始准备上传请求:', {
    url,
    fileName,
    bodyType: body instanceof FormData ? 'FormData' : typeof body
  });

  let authToken: string;
  try {
    authToken = await getAuthToken();
    console.log('✅ 获取Token成功:', {
      tokenLength: authToken?.length || 0,
      tokenPreview: authToken?.substring(0, 20) + '...'
    });
  } catch (error) {
    console.error('❌ 获取Token失败:', error);
    throw new Error(`获取认证Token失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }

  if (!authToken) {
    console.error('❌ Token为空，无法上传');
    throw new Error('未登录，请先登录');
  }

  const doFetch = async (token: string) => {
    console.log('🔑 使用Token上传文件:', {
      fileName,
      url,
      tokenLength: token?.length || 0,
      tokenPreview: token.substring(0, 20) + '...',
      headers: {
        Authorization: `Bearer ${token.substring(0, 20)}...`,
        'Content-Type': 'multipart/form-data' // 浏览器会自动设置，这里只是日志
      }
    });

    // 🔧 修复: 使用FormData时，不要手动设置Content-Type
    // 浏览器会自动设置 Content-Type: multipart/form-data; boundary=...
    // 手动设置会覆盖boundary，导致后端无法解析
    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
        // 注意：不设置 Content-Type，让浏览器自动设置
      },
      body
    });
  };

  let response = await doFetch(authToken);
  
  console.log('📝 上传响应状态:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries())
  });

  if (response.status === 401) {
    console.warn('⚠️ Token 可能过期，尝试刷新...');
    try {
      const refreshed = await AuthManager.refreshToken();
      if (refreshed) {
        authToken = await getAuthToken();
        console.log('✅ Token刷新成功，重新上传');
        response = await doFetch(authToken);
        
        if (response.status === 401) {
          console.error('❌ Token刷新后仍然401，认证失败');
          throw new Error('登录已过期，请重新登录后重试');
        }
      } else {
        console.error('❌ Token刷新失败');
        AuthManager.clearTokens();
        throw new Error('登录已过期，请重新登录后重试');
      }
    } catch (refreshError) {
      console.error('❌ Token刷新异常:', refreshError);
      AuthManager.clearTokens();
      throw new Error('登录已过期，请重新登录后重试');
    }
  }

  if (response.status === 401) {
    console.error('❌ 最终认证失败，返回401');
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
