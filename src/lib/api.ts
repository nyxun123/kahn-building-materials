// API配置
import { AuthManager } from './auth-manager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * 获取带有认证 headers 的 fetch 选项
 */
async function getAuthenticatedFetchOptions(options: RequestInit = {}): Promise<RequestInit> {
  const token = await AuthManager.getValidAccessToken();

  if (!token) {
    // Token 无效，清除认证信息并重定向到登录页
    AuthManager.clearTokens();
    window.location.href = '/admin/login';
    throw new Error('认证失败，请重新登录');
  }

  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  };
}

// 产品API
export const productAPI = {
  // 获取产品列表
  async getProducts(filters?: Record<string, any>) {
    let url = '/api/admin/products';

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const options = await getAuthenticatedFetchOptions();
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 获取单个产品
  async getProduct(id: number) {
    const options = await getAuthenticatedFetchOptions();
    const response = await fetch(`/api/admin/products/${id}`, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 创建产品
  async createProduct(product: any) {
    const options = await getAuthenticatedFetchOptions({
      method: 'POST',
      body: JSON.stringify(product)
    });
    const response = await fetch('/api/admin/products', options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 更新产品
  async updateProduct(id: number, updates: any) {
    const options = await getAuthenticatedFetchOptions({
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    const response = await fetch(`/api/admin/products/${id}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 删除产品
  async deleteProduct(id: number) {
    const options = await getAuthenticatedFetchOptions({
      method: 'DELETE'
    });
    const response = await fetch(`/api/admin/products/${id}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return true;
  },

  // 更新产品图片
  async updateProductImage(id: number, imageUrl: string) {
    return this.updateProduct(id, { image_url: imageUrl });
  },

  // 切换产品状态
  async toggleProductStatus(id: number) {
    const product = await this.getProduct(id);
    return this.updateProduct(id, { is_active: !product.is_active });
  }
};

// 联系消息API
export const contactAPI = {
  async getMessages(filters?: Record<string, any>) {
    let url = '/api/admin/contacts';

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const options = await getAuthenticatedFetchOptions();
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  async createMessage(message: any) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: message })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  async updateMessageStatus(id: number, status: string) {
    const options = await getAuthenticatedFetchOptions({
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    const response = await fetch(`/api/admin/contacts/${id}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  }
};

// 页面内容API
export const contentAPI = {
  async getContents(filters?: Record<string, any>) {
    let url = '/api/admin/contents';

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const options = await getAuthenticatedFetchOptions();
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  async updateContent(id: number, updates: any) {
    const options = await getAuthenticatedFetchOptions({
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    const response = await fetch(`/api/admin/contents/${id}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  }
};

// 图片上传API
export const imageAPI = {
  async uploadImage(file: File, folder: string = 'products') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // 获取认证 token
    const token = await AuthManager.getValidAccessToken();
    if (!token) {
      AuthManager.clearTokens();
      window.location.href = '/admin/login';
      throw new Error('认证失败，请重新登录');
    }

    // 使用云函数上传
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async uploadBase64Image(base64: string, fileName: string, folder: string = 'products') {
    const options = await getAuthenticatedFetchOptions({
      method: 'POST',
      body: JSON.stringify({
        file: base64,
        fileName,
        folder
      })
    });

    const response = await fetch('/api/upload-image', options);

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error(result.message);
    }

    return result.data;
  }
};

// 错误处理工具
export class APIError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// 统一的错误处理
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  // 错误信息将传递给调用方处理
  throw error;
};

// 实时订阅工具（使用轮询替代）
export const subscribeToChanges = (tableName: string, callback: (payload: any) => void) => {
  // 每30秒轮询一次数据更新
  const interval = setInterval(async () => {
    try {
      const options = await getAuthenticatedFetchOptions();
      const response = await fetch(`/api/admin/${tableName}`, options);
      if (response.ok) {
        const data = await response.json();
        // 模拟Supabase的payload格式
        callback({
          eventType: 'REFRESH',
          new: data,
          old: null
        });
      }
    } catch (error) {
      console.error(`轮询${tableName}失败:`, error);
    }
  }, 30000);

  // 返回清理函数
  return () => clearInterval(interval);
};