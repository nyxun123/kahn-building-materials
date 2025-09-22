// D1 数据库 API 客户端
// 直接与 Cloudflare Worker API 通信

interface ApiResponse<T> {
  data?: T[];
  error?: { message: string };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Product {
  id: number;
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh?: string;
  description_en?: string;
  description_ru?: string;
  specifications_zh?: string;
  specifications_en?: string;
  specifications_ru?: string;
  applications_zh?: string;
  applications_en?: string;
  applications_ru?: string;
  features_zh?: string; // JSON array
  features_en?: string; // JSON array
  features_ru?: string; // JSON array
  image_url?: string;
  gallery_images?: string; // JSON array
  price?: number;
  price_range?: string;
  packaging_options_zh?: string;
  packaging_options_en?: string;
  packaging_options_ru?: string;
  category: string;
  tags?: string; // JSON array
  is_active: boolean;
  is_featured?: boolean;
  sort_order?: number;
  stock_quantity?: number;
  min_order_quantity?: number;
  meta_title_zh?: string;
  meta_title_en?: string;
  meta_title_ru?: string;
  meta_description_zh?: string;
  meta_description_en?: string;
  meta_description_ru?: string;
  created_at: string;
  updated_at: string;
  // 兼容字段
  name?: string;
  description?: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  ip_address: string;
  user_agent: string;
  status: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface PageContent {
  id: number;
  page_key: string;
  section_key: string;
  content_zh?: string;
  content_en?: string;
  content_ru?: string;
  content_type: string;
  meta_data?: string;
  category?: string;
  tags?: string;
  is_active: boolean;
  sort_order?: number;
  meta_title_zh?: string;
  meta_title_en?: string;
  meta_title_ru?: string;
  meta_description_zh?: string;
  meta_description_en?: string;
  meta_description_ru?: string;
  created_at: string;
  updated_at: string;
}

class D1ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = window.location.origin;
    this.loadAuthToken();
  }

  private loadAuthToken() {
    try {
      const cloudAuth = localStorage.getItem('admin-auth');
      if (cloudAuth) {
        const authData = JSON.parse(cloudAuth);
        this.authToken = authData?.token || 'admin-session';
        return;
      }

      if (localStorage.getItem('temp-admin-auth')) {
        this.authToken = 'temp-admin-token';
        return;
      }

      this.authToken = null;
    } catch (error) {
      console.warn('读取 admin-auth 失败:', error);
      this.authToken = null;
    }
  }

  private buildHeaders(initialHeaders: HeadersInit = {}): Headers {
    this.loadAuthToken();

    const headers = new Headers(initialHeaders);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.authToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    return headers;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = this.buildHeaders(options.headers);

    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API请求失败 ${endpoint}:`, error);
      return {
        error: { message: error instanceof Error ? error.message : '网络请求失败' }
      };
    }
  }

  // 产品相关API
  async getProducts(page = 1, limit = 20): Promise<ApiResponse<Product>> {
    return this.makeRequest<Product>(`/admin/products?page=${page}&limit=${limit}`);
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.makeRequest<Product>(`/admin/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.makeRequest<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.makeRequest<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id: number, isActive: boolean): Promise<ApiResponse<Product>> {
    return this.updateProduct(id, { is_active: isActive });
  }

  // 联系消息相关API  
  async getContacts(page = 1, limit = 20): Promise<ApiResponse<ContactMessage>> {
    return this.makeRequest<ContactMessage>(`/admin/contacts?page=${page}&limit=${limit}`);
  }

  async updateContactStatus(id: number, status: string, isRead: boolean): Promise<ApiResponse<ContactMessage>> {
    return this.makeRequest<ContactMessage>(`/admin/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, is_read: isRead }),
    });
  }

  async deleteContact(id: number): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/admin/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // 页面内容相关API
  async getContents(page = 1, limit = 20, pageKey?: string): Promise<ApiResponse<PageContent>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (pageKey) {
      params.set('page_key', pageKey);
    }
    return this.makeRequest<PageContent>(`/admin/contents?${params.toString()}`);
  }

  async updateContent(id: number, contentData: Partial<PageContent>): Promise<ApiResponse<PageContent>> {
    return this.makeRequest<PageContent>(`/admin/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  }

  // 认证相关
  async login(email: string, password: string) {
    return this.makeRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // 更新认证token
  updateAuthToken() {
    this.loadAuthToken();
  }
}

// 单例实例
export const d1Api = new D1ApiClient();

// 导出类型
export type { Product, ContactMessage, PageContent, ApiResponse };
