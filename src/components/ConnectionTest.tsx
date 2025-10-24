import { useEffect, useState } from 'react';

import { TempAuth } from '@/lib/temp-auth';

interface ConnectionTestProps {
  show?: boolean;
}

export function ConnectionTest({ show = false }: ConnectionTestProps) {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const runConnectionTest = async () => {
    setIsTesting(true);
    const results = [];

    try {
      // 1. 测试环境变量
      results.push({
        test: '环境变量检查',
        status: 'info',
        message: `API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL ? '✅ 已配置' : '❌ 未配置'}`,
        details: '使用Cloudflare Workers API'
      });

      // 2. 测试基础连接
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          results.push({
            test: '数据库连接',
            status: 'success',
            message: '连接成功',
            details: `找到 ${Array.isArray(data) ? data.length : 0} 个产品`
          });
        } else {
          results.push({
            test: '数据库连接',
            status: 'error',
            message: `HTTP错误: ${response.status}`,
            details: `状态码: ${response.status}`
          });
        }
      } catch (error: any) {
        results.push({
          test: '数据库连接',
          status: 'error',
          message: error.message,
          details: '可能是网络问题或配置错误'
        });
      }

      // 3. 测试权限
      const cloudAuthRaw = localStorage.getItem('admin-auth');
      if (cloudAuthRaw) {
        try {
          const cloudAuth = JSON.parse(cloudAuthRaw);
          const cloudUser = cloudAuth.user || {};
          results.push({
            test: '用户认证',
            status: 'success',
            message: '已登录',
            details: `用户: ${cloudUser.email || '未知'}`
          });
        } catch (error: any) {
          results.push({
            test: '用户认证',
            status: 'error',
            message: error.message
          });
        }
      } else {
        const currentUser = TempAuth.getCurrentUser();
        if (currentUser) {
          results.push({
            test: '用户认证',
            status: 'success',
            message: '已登录(临时模式)',
            details: `用户: ${currentUser.email}`
          });
        } else {
          results.push({
            test: '用户认证',
            status: 'warning',
            message: '未登录',
            details: '需要登录才能管理产品'
          });
        }
      }

      // 4. 测试表结构
      try {
        const response = await fetch('/api/products?limit=3');
        if (response.ok) {
          const data = await response.json();
          results.push({
            test: '产品表结构',
            status: 'success',
            message: '表结构正常',
            details: `找到 ${Array.isArray(data) ? data.length : 0} 条记录`
          });
        } else {
          results.push({
            test: '产品表结构',
            status: 'error',
            message: `HTTP错误: ${response.status}`,
            details: '可能是表不存在或权限不足'
          });
        }
      } catch (error: any) {
        results.push({
          test: '产品表结构',
          status: 'error',
          message: error.message
        });
      }

    } catch (error: any) {
      results.push({
        test: '总体测试',
        status: 'error',
        message: '测试过程中出现错误',
        details: error.message
      });
    }

    setTestResults(results);
    setIsTesting(false);
  };

  useEffect(() => {
    if (show) {
      runConnectionTest();
    }
  }, [show]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (!show) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">数据库连接测试</h3>
        <button
          onClick={runConnectionTest}
          disabled={isTesting}
          className="px-3 py-1 bg-primary text-white rounded text-sm disabled:opacity-50"
        >
          {isTesting ? '测试中...' : '重新测试'}
        </button>
      </div>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className={`p-3 rounded-md ${getStatusColor(result.status)}`}>
            <div className="font-medium">{result.test}</div>
            <div className="text-sm mt-1">{result.message}</div>
            {result.details && (
              <div className="text-xs mt-1 opacity-75">{result.details}</div>
            )}
          </div>
        ))}

        {testResults.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            正在运行连接测试...
          </div>
        )}
      </div>
    </div>
  );
}
