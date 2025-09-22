import { useEffect, useState, useCallback } from 'react';
import { d1Api, type Product, type ContactMessage, type ApiResponse } from '@/lib/d1-api';

interface UseD1DataOptions {
  page?: number;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useD1Products(options: UseD1DataOptions = {}) {
  const { page = 1, limit = 20, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 更新认证token（防止过期）
      d1Api.updateAuthToken();

      const response = await d1Api.getProducts(page, limit);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      setData(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      
      console.log(`✅ D1 产品数据加载成功: ${response.data?.length || 0} 条记录`);
      
    } catch (err) {
      console.error('❌ 获取D1产品数据失败:', err);
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();

    // 自动刷新
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    pagination,
    refetch,
    connectionStatus: error ? `错误: ${error.message}` : `已加载 ${data.length} 条记录`
  };
}

export function useD1Contacts(options: UseD1DataOptions = {}) {
  const { page = 1, limit = 20, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      d1Api.updateAuthToken();

      const response = await d1Api.getContacts(page, limit);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      setData(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      
      console.log(`✅ D1 联系数据加载成功: ${response.data?.length || 0} 条记录`);
      
    } catch (err) {
      console.error('❌ 获取D1联系数据失败:', err);
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();

    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    pagination,
    refetch,
    connectionStatus: error ? `错误: ${error.message}` : `已加载 ${data.length} 条记录`
  };
}