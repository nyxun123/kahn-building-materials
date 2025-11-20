
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';

// 懒加载大型组件
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const ChartComponent = lazy(() => import('./components/Chart'));
const PDFGenerator = lazy(() => import('./utils/pdf-generator'));

const OptimizedPage = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // 预加载关键资源
  useEffect(() => {
    // 预加载可能在用户交互后需要的组件
    const timer = setTimeout(() => {
      import('./components/Chart'); // 预加载但不渲染
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container">
      {/* 关键内容立即加载 */}
      <header>
        <h1>优化页面示例</h1>
        <OptimizedImage
          src="/images/hero.jpg"
          alt="Hero image"
          priority={true}
        />
      </header>

      {/* 主要内容 */}
      <main>
        <section>
          <h2>页面内容</h2>
          <p>这是页面的主要内容，立即加载。</p>
        </section>

        {/* 按需加载的管理面板 */}
        {showAdmin && (
          <Suspense fallback={<div className="loading-skeleton">加载中...</div>}>
            <AdminDashboard />
          </Suspense>
        )}

        {/* 用户交互后加载的图表 */}
        {showChart && (
          <Suspense fallback={<ChartSkeleton />}>
            <ChartComponent />
          </Suspense>
        )}

        {/* 操作按钮 */}
        <div className="actions">
          <button onClick={() => setShowAdmin(true)}>
            管理面板
          </button>
          <button onClick={() => setShowChart(true)}>
            查看图表
          </button>
        </div>
      </main>
    </div>
  );
};

// 骨架屏组件
const ChartSkeleton = () => (
  <div className="chart-skeleton">
    <div className="loading-skeleton" style={{ height: '300px' }} />
    <div className="loading-skeleton" style={{ height: '40px', width: '60%' }} />
  </div>
);

export default OptimizedPage;
