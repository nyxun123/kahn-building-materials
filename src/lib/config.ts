// API配置 - 统一管理所有API调用
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // API路径
  PATHS: {
    // 公开API
    PRODUCTS: '/api/products',
    PRODUCT_DETAIL: (code: string) => `/api/products/${code}`,
    CONTACT: '/api/contact',
    UPLOAD_IMAGE: '/api/upload-image',
    UPLOAD_FILE: '/api/upload-file',
    COMPANY_INFO: (section: string) => `/api/company/info/${section}`,
    COMPANY_CONTENT: (type: string) => `/api/company/content/${type}`,
    
    // 管理API
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_PRODUCTS: '/api/admin/products',
    ADMIN_PRODUCT: (id: number) => `/api/admin/products/${id}`,
    ADMIN_PRODUCT_VERSIONS: (id: number) => `/api/admin/products/${id}/versions`,
    ADMIN_PRODUCT_RESTORE: (id: number) => `/api/admin/products/${id}/restore`,
    ADMIN_CONTACTS: '/api/admin/contacts',
    ADMIN_CONTENTS: '/api/admin/contents',
    ADMIN_DASHBOARD_STATS: '/api/admin/dashboard/stats',
    ADMIN_DASHBOARD_ACTIVITIES: '/api/admin/dashboard/activities',
    ADMIN_DASHBOARD_HEALTH: '/api/admin/dashboard/health',
    ADMIN_DASHBOARD_UPDATES: '/api/admin/dashboard/updates',
    ADMIN_COMPANY_INFO: '/api/admin/company/info',
    ADMIN_COMPANY_INFO_ITEM: (id: number) => `/api/admin/company/info/${id}`,
    ADMIN_COMPANY_CONTENT: '/api/admin/company/content',
    ADMIN_COMPANY_CONTENT_ITEM: (id: number) => `/api/admin/company/content/${id}`
  },
  
  // 完整URL生成函数
  getUrl: (path: string) => `${API_CONFIG.BASE_URL}${path}`,
  
  // 常用请求头
  HEADERS: {
    JSON: {
      'Content-Type': 'application/json'
    },
    AUTH: (token: string = 'admin-token') => ({
      'Authorization': `Bearer ${token}`
    }),
    JSON_AUTH: (token: string = 'admin-token') => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  }
};

// 导出便捷使用的函数
export const getApiUrl = (path: string) => API_CONFIG.getUrl(path);
export const getAuthHeaders = (token: string = 'admin-token') => API_CONFIG.HEADERS.AUTH(token);
export const getJsonAuthHeaders = (token: string = 'admin-token') => API_CONFIG.HEADERS.JSON_AUTH(token);