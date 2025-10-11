import type {
  DataProvider,
  HttpError,
  BaseRecord,
  CrudFilters,
  LogicalFilter,
  CrudSorting,
} from "@refinedev/core";

const API_BASE = "/api/admin";

type ResourceMap = Record<string, string>;

const resourceMap: ResourceMap = {
  products: "products",
  messages: "contacts",
  contents: "contents",
  "company-info": "company/info",
  "company-content": "company/content",
};

const resolveEndpoint = (resource: string): string => {
  const mapped = resourceMap[resource] ?? resource;
  return `${API_BASE}/${mapped}`;
};

const getAuthHeader = () => {
  if (typeof window === "undefined") return {};
  try {
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth) {
      const parsed = JSON.parse(adminAuth);
      return parsed?.token
        ? { Authorization: `Bearer ${parsed.token}` }
        : { Authorization: "Bearer admin-session" };
    }
    const tempAuth = localStorage.getItem("temp-admin-auth");
    if (tempAuth) {
      return { Authorization: "Bearer temp-admin" };
    }
  } catch (error) {
    console.warn("读取本地认证信息失败", error);
  }
  return {};
};

const buildUrl = (resource: string, id?: string | number, query?: Record<string, unknown>) => {
  const endpoint = resolveEndpoint(resource);
  const url = new URL(endpoint, window.location.origin);
  if (id !== undefined) {
    url.pathname += `/${id}`;
  }
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error: HttpError = {
      message: data?.error?.message || data?.message || response.statusText,
      statusCode: response.status,
    };
    throw error;
  }

  return data as T;
}

interface APIListResponse<TData extends BaseRecord> {
  data: TData[];
  pagination?: {
    total?: number;
    totalPages?: number;
  };
}

export const adminDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 20;

    const params: Record<string, unknown> = {
      page: current,
      limit: pageSize,
      ...(meta?.query ?? {}),
    };

    if (filters) {
      (filters as CrudFilters).forEach((filter) => {
        if ("field" in filter) {
          const logicalFilter = filter as LogicalFilter;
          if (Array.isArray(logicalFilter.value)) {
            params[logicalFilter.field] = logicalFilter.value.join(",");
          } else if (logicalFilter.value !== undefined) {
            params[logicalFilter.field] = logicalFilter.value;
          }
        }
      });
    }

    if (sorters && sorters.length > 0) {
      const sorter = (sorters as CrudSorting)[0];
      params.sort = sorter.field;
      params.order = sorter.order;
    }

    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, undefined, params);
    const response = await fetch(url, { headers, method: "GET" });
    const payload = await parseResponse<APIListResponse<BaseRecord>>(response);

    return {
      data: (payload.data as BaseRecord[]) as BaseRecord[],
      total:
        payload.pagination?.total ??
        (payload.data ? (payload.data as BaseRecord[]).length : 0),
    } as any;
  },

  getOne: async ({ resource, id }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, id);
    console.log('🔍 Refine getOne 请求:', { resource, id, url });
    
    try {
      const response = await fetch(url, { 
        headers, 
        method: "GET",
        cache: 'no-cache' // 禁用缓存确保获取最新数据
      });
      
      if (!response.ok) {
        console.error('❌ API响应错误:', response.status, response.statusText);
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      
      const payload = await parseResponse<{ success?: boolean; data: BaseRecord[] | BaseRecord; error?: any }>(response);
      console.log('📦 Refine getOne 响应:', payload);
      
      // 检查API响应是否成功
      if (payload.success === false || payload.error) {
        console.error('❌ API返回错误:', payload.error);
        throw new Error(payload.error?.message || 'API返回错误响应');
      }
      
      // 处理响应数据格式 - 支持多种格式
      let data: BaseRecord;
      if (Array.isArray(payload.data)) {
        data = payload.data[0]; // 取数组的第一个元素
        console.log('📋 处理数组格式响应，取第一个元素');
      } else if (payload.data && typeof payload.data === 'object') {
        data = payload.data;
        console.log('📋 处理对象格式响应');
      } else {
        // 处理直接返回数据的情况
        data = payload as unknown as BaseRecord;
        console.log('📋 处理直接数据格式');
      }
      
      console.log('📝 Refine getOne 最终数据:', data);
      
      // 验证数据完整性
      if (!data || typeof data !== 'object') {
        console.error('❌ 获取的数据格式无效:', data);
        throw new Error('产品数据格式无效或为空');
      }
      
      // 验证关键字段
      if (!data.id && !data.product_code) {
        console.error('❌ 产品数据缺少关键字段:', data);
        throw new Error('产品数据缺少关键标识字段');
      }
      
      return {
        data: data as BaseRecord,
      } as any;
      
    } catch (error) {
      console.error('💥 Refine getOne 异常:', error);
      
      // 如果是网络错误，尝试重试一次
      if (error.message.includes('fetch') || error.message.includes('网络')) {
        console.log('🔄 网络错误，尝试重试...');
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
          const retryResponse = await fetch(url, { 
            headers, 
            method: "GET",
            cache: 'no-cache'
          });
          
          if (retryResponse.ok) {
            const retryPayload = await parseResponse<{ data: BaseRecord[] | BaseRecord }>(retryResponse);
            console.log('✅ 重试成功:', retryPayload);
            
            let retryData: BaseRecord;
            if (Array.isArray(retryPayload.data)) {
              retryData = retryPayload.data[0];
            } else {
              retryData = retryPayload.data;
            }
            
            return {
              data: retryData as BaseRecord,
            } as any;
          }
        } catch (retryError) {
          console.error('💥 重试也失败了:', retryError);
        }
      }
      
      // 重新抛出错误
      throw error;
    }
  },

  create: async ({ resource, variables }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource);
    console.log('🔍 Refine create 请求:', { resource, url, variables });
    
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(variables),
    });
    const payload = await parseResponse<{ data: BaseRecord[] | BaseRecord }>(response);
    
    console.log('📦 Refine create 响应:', payload);
    
    // 处理响应数据格式
    let data: BaseRecord;
    if (Array.isArray(payload.data)) {
      data = payload.data[0];
    } else if (payload.data) {
      data = payload.data;
    } else {
      data = payload as unknown as BaseRecord;
    }
    
    console.log('📝 Refine create 最终数据:', data);

    return {
      data: data as BaseRecord,
    } as any;
  },

  update: async ({ resource, id, variables }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, id);
    console.log('🔍 Refine update 请求:', { resource, id, url, variables });
    
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(variables),
    });

    const payload = await parseResponse<{ data: BaseRecord[] | BaseRecord }>(response);
    console.log('📦 Refine update 响应:', payload);
    
    // 处理响应数据格式
    let data: BaseRecord;
    if (Array.isArray(payload.data)) {
      data = payload.data[0];
    } else if (payload.data) {
      data = payload.data;
    } else {
      data = payload as unknown as BaseRecord;
    }
    
    console.log('📝 Refine update 最终数据:', data);
    
    return {
      data: data as BaseRecord,
    } as any;
  },

  deleteOne: async ({ resource, id }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, id);
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const payload = await parseResponse<{ data: BaseRecord }>(response);
    return {
      data: (payload.data ?? (payload as unknown as BaseRecord)) as BaseRecord,
    } as any;
  },

  getApiUrl: () => API_BASE,
};
