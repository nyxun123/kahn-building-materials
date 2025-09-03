import { supabase } from './supabase';
import type { Database } from './database.types';

// 类型定义
type Product = Database['public']['Tables']['products']['Row'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type PageContent = Database['public']['Tables']['page_contents']['Row'];

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 产品API
export const productAPI = {
  // 获取产品列表
  async getProducts(filters?: Record<string, any>) {
    let query = supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // 获取单个产品
  async getProduct(id: number) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 创建产品
  async createProduct(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新产品
  async updateProduct(id: number, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 删除产品
  async deleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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
    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createMessage(message: Partial<ContactMessage>) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        ...message,
        status: 'new',
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMessageStatus(id: number, status: string) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// 页面内容API
export const contentAPI = {
  async getContents(filters?: Record<string, any>) {
    let query = supabase
      .from('page_contents')
      .select('*')
      .order('page_key', { ascending: true })
      .order('section_key', { ascending: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateContent(id: number, updates: Partial<PageContent>) {
    const { data, error } = await supabase
      .from('page_contents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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

// 实时订阅工具
export const subscribeToChanges = (tableName: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`${tableName}_changes`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: tableName },
      callback
    )
    .subscribe();
};