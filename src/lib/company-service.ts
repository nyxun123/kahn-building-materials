/**
 * 公司信息服务
 * 提供公司信息和内容的管理功能
 */

import { useState, useEffect, useCallback } from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { 
  getCompanyInfo, 
  getCompanyContent, 
  getAllCompanyInfo, 
  getAllCompanyContent,
  createCompanyInfo,
  updateCompanyInfo,
  deleteCompanyInfo,
  createCompanyContent,
  updateCompanyContent,
  deleteCompanyContent,
  getCompanyInfoByLanguage,
  formatCompanyInfo,
  formatCompanyContent
} from '@/lib/api/company-info';

interface CompanyInfoState {
  // 公司信息数据
  companyInfo: Record<string, any>;
  companyContent: Record<string, any>;
  
  // 加载状态
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  // 操作函数
  fetchCompanyData: (language?: string) => Promise<void>;
  refresh: () => void;
}

// 简单的状态管理替代zustand
export const useCompanyStore = () => {
  const [state, setState] = useState<CompanyInfoState>({
    companyInfo: {},
    companyContent: {},
    isLoading: false,
    isError: false,
    error: null,
    fetchCompanyData: async () => {},
    refresh: () => {}
  });

  const fetchCompanyData = useCallback(async (language = 'zh') => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    
    try {
      const data = await getCompanyInfoByLanguage(language);
      setState(prev => ({
        ...prev,
        companyInfo: data.info,
        companyContent: data.content,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error.message : 'Failed to fetch company data',
        isLoading: false
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  return {
    ...state,
    fetchCompanyData,
    refresh
  };
};

// 获取公司信息
export function useCompanyInfo(section: string, language: string = 'zh') {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCompanyInfo(section, language);
        setData(formatCompanyInfo(result));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company info');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section, language]);

  return { data, loading, error };
}

// 获取公司内容
export function useCompanyContent(type: string, language: string = 'zh') {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCompanyContent(type, language);
        setData(formatCompanyContent(result));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, language]);

  return { data, loading, error };
}

// 获取所有公司信息（管理员用）
export function useAllCompanyInfo() {
  return useRealtimeData({
    tableName: 'company_info',
    orderBy: { column: 'section_type', ascending: true }
  });
}

// 获取所有公司内容（管理员用）
export function useAllCompanyContent() {
  return useRealtimeData({
    tableName: 'company_content',
    orderBy: { column: 'content_type', ascending: true }
  });
}

// 创建公司信息
export function useCreateCompanyInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (infoData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createCompanyInfo(infoData);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// 更新公司信息
export function useUpdateCompanyInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateCompanyInfo(id, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// 删除公司信息
export function useDeleteCompanyInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteCompanyInfo(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// 创建公司内容
export function useCreateCompanyContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (contentData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createCompanyContent(contentData);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// 更新公司内容
export function useUpdateCompanyContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateCompanyContent(id, data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// 删除公司内容
export function useDeleteCompanyContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteCompanyContent(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// 工具函数：获取特定字段的值
export function getCompanyField(info: any, section: string, field: string, defaultValue: string = ''): string {
  if (!info || !info[section]) return defaultValue;
  return info[section][field] || defaultValue;
}

// 工具函数：获取特定内容的值
export function getCompanyContentValue(content: any, type: string, key: string, defaultValue: string = ''): string {
  if (!content || !content[type]) return defaultValue;
  return content[type][key] || defaultValue;
}

// 工具函数：获取联系信息
export function getContactInfo(info: any) {
  return {
    address: getCompanyField(info, 'contact', 'address', '地址信息'),
    phone: getCompanyField(info, 'contact', 'phone', '+86 000-00000000'),
    email: getCompanyField(info, 'contact', 'email', 'info@example.com'),
    businessHours: {
      weekdays: getCompanyField(info, 'contact', 'business_hours_weekdays', '周一至周五 9:00-18:00'),
      saturday: getCompanyField(info, 'contact', 'business_hours_saturday', '周六 9:00-16:00'),
      sunday: getCompanyField(info, 'contact', 'business_hours_sunday', '周日 休息'),
    }
  };
}

// 工具函数：获取关于我们内容
export function getAboutContent(content: any) {
  return {
    title: getCompanyContentValue(content, 'about', 'hero_title', '关于我们'),
    paragraphs: [
      getCompanyContentValue(content, 'about', 'company_paragraph1', '公司简介第一段'),
      getCompanyContentValue(content, 'about', 'company_paragraph2', '公司简介第二段'),
      getCompanyContentValue(content, 'about', 'company_paragraph3', '公司简介第三段'),
    ],
    advantages: {
      quality: {
        title: getCompanyContentValue(content, 'about', 'quality_title', '品质保证'),
        description: getCompanyContentValue(content, 'about', 'quality_desc', '品质保证描述')
      }
    },
    history: {
      founding: getCompanyContentValue(content, 'about', 'history_founding', '公司成立历史'),
      expansion: getCompanyContentValue(content, 'about', 'history_expansion', '公司扩展历史'),
      international: getCompanyContentValue(content, 'about', 'history_international', '国际化发展'),
      present: getCompanyContentValue(content, 'about', 'history_present', '当前发展状况')
    }
  };
}

// 预加载公司数据
export async function prefetchCompanyData(language: string = 'zh') {
  try {
    await Promise.all([
      getCompanyInfo('contact', language),
      getCompanyContent('about', language),
    ]);
  } catch (error) {
    console.error('Prefetch company data failed:', error);
  }
}