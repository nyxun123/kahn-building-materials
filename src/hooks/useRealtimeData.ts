import { useEffect, useState, useCallback } from 'react';

interface UseRealtimeDataOptions {
  tableName: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useRealtimeData<T>({ 
  tableName, 
  filters = {}, 
  orderBy = { column: 'created_at', ascending: false },
  limit = 100 
}: UseRealtimeDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('初始化...');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionStatus('连接数据库...');

      // 构建API URL
      let apiUrl = `/api/${tableName}`;
      
      // 添加查询参数
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      
      // 应用过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      // 应用排序
      if (orderBy.column) {
        queryParams.append('order', `${orderBy.column}.${orderBy.ascending ? 'asc' : 'desc'}`);
      }
      
      if (queryParams.toString()) {
        apiUrl += `?${queryParams.toString()}`;
      }

      setConnectionStatus('查询数据中...');

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const result = await response.json();
      
      const finalData = Array.isArray(result) ? result : (result.data || []);
      setData(finalData);
      setError(null);
      setConnectionStatus(`成功加载 ${finalData.length} 条记录`);
      
      console.log(`✅ ${tableName} 数据加载成功: ${finalData.length} 条记录`);
      
    } catch (err) {
      console.error(`❌ 获取${tableName}数据失败:`, err);
      setError(err as Error);
      setConnectionStatus(`错误: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [tableName, filters, orderBy, limit]);

  useEffect(() => {
    // 初始化数据库连接
    setConnectionStatus('初始化成功，使用Cloudflare API');
    
    // 初始加载数据
    fetchData();

    // 模拟实时更新（每30秒轮询一次）
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [tableName, fetchData]);

  const refetch = useCallback(() => {
    setConnectionStatus('重新加载...');
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch, connectionStatus };
}

// 专用hooks
export function useProducts(filters?: Record<string, any>) {
  return useRealtimeData<any>({ 
    tableName: 'products', 
    filters,
    orderBy: { column: 'sort_order', ascending: true }
  });
}

export function useContactMessages(filters?: Record<string, any>) {
  return useRealtimeData<any>({ 
    tableName: 'contact_messages', 
    filters,
    orderBy: { column: 'created_at', ascending: false }
  });
}

export function usePageContents(filters?: Record<string, any>) {
  return useRealtimeData<any>({ 
    tableName: 'page_contents', 
    filters,
    orderBy: { column: 'page_key', ascending: true }
  });
}