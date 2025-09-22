// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 获取单个产品
  async getProduct(id: number) {
    const response = await fetch(`/api/admin/products/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 创建产品
  async createProduct(product: any) {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 更新产品
  async updateProduct(id: number, updates: any) {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  // 删除产品
  async deleteProduct(id: number) {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
    
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

    const response = await fetch(url);
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
    const response = await fetch(`/api/admin/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });
    
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

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }
    return await response.json();
  },

  async updateContent(id: number, updates: any) {
    const response = await fetch(`/api/admin/contents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
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

    // 使用云函数上传
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.code !== 200) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async uploadBase64Image(base64: string, fileName: string, folder: string = 'products') {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64,
        fileName,
        folder
      })
    });

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
      const response = await fetch(`/api/admin/${tableName}`);
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