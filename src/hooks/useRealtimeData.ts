import { useEffect, useState, useCallback } from 'react';
import { supabase, checkConnection, initializeDatabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type PageContent = Database['public']['Tables']['page_contents']['Row'];

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

      // 验证数据库连接
      const health = await checkConnection();
      if (!health.success) {
        setConnectionStatus(`连接失败: ${health.error}`);
        throw new Error(`数据库连接失败: ${health.error}`);
      }

      setConnectionStatus('查询数据中...');

      let query = supabase
        .from(tableName)
        .select('*')
        .limit(limit);

      // 应用过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // 应用排序
      query = query.order(orderBy.column, { ascending: orderBy.ascending });

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        console.error(`❌ 加载${tableName}失败:`, fetchError);
        setConnectionStatus(`查询失败: ${fetchError.message}`);
        throw new Error(`加载失败: ${fetchError.message} (${fetchError.code || '未知错误'})`);
      }

      const finalData = result || [];
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
    initializeDatabase().then(({ connected, products }) => {
      if (connected) {
        setConnectionStatus(`初始化成功，找到 ${products.length} 个产品`);
      } else {
        setConnectionStatus('初始化失败');
      }
    });

    // 初始加载数据
    fetchData();

    // 设置实时订阅
    let channel: any = null;
    
    try {
      channel = supabase
        .channel(`${tableName}_changes`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            console.log(`🔄 ${tableName} 实时更新:`, payload.eventType);
            
            switch (payload.eventType) {
              case 'INSERT':
                setData(prev => [payload.new as T, ...prev]);
                break;
              case 'UPDATE':
                setData(prev => prev.map(item => 
                  (item as any).id === payload.new.id ? payload.new as T : item
                ));
                break;
              case 'DELETE':
                setData(prev => prev.filter(item => (item as any).id !== payload.old.id));
                break;
            }
          }
        )
        .subscribe((status) => {
          console.log(`📡 ${tableName} 订阅状态:`, status);
        });
    } catch (error) {
      console.error(`❌ ${tableName} 订阅失败:`, error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
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
  return useRealtimeData<Product>({ 
    tableName: 'products', 
    filters,
    orderBy: { column: 'sort_order', ascending: true }
  });
}

export function useContactMessages(filters?: Record<string, any>) {
  return useRealtimeData<ContactMessage>({ 
    tableName: 'contact_messages', 
    filters,
    orderBy: { column: 'created_at', ascending: false }
  });
}

export function usePageContents(filters?: Record<string, any>) {
  return useRealtimeData<PageContent>({ 
    tableName: 'page_contents', 
    filters,
    orderBy: { column: 'page_key', ascending: true }
  });
}