
// 动态导入示例 - 按需加载大组件

// 1. 管理后台懒加载
const AdminDashboard = lazy(() => import('./pages/admin/dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/products'));

// 2. 图表组件懒加载
const ChartComponent = lazy(() => import('./components/Chart'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));

// 3. PDF生成懒加载
const PDFGenerator = lazy(() =>
  import('./utils/pdf-generator').then(module => ({
    default: module.PDFGenerator
  }))
);

// 4. 富文本编辑器懒加载
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

// 5. 地图组件懒加载
const MapComponent = lazy(() => import('./components/Map'));

// 使用示例
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      {/* 条件加载管理后台 */}
      {isAdmin && (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminDashboard />
        </Suspense>
      )}

      {/* 用户交互后加载图表 */}
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <ChartComponent />
        </Suspense>
      )}

      <button onClick={() => setShowChart(true)}>
        显示图表
      </button>
    </div>
  );
}

// 6. 预加载策略
const preloadAdmin = () => {
  import('./pages/admin/dashboard');
};

// 7. 路由级别的懒加载 (React Router)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/admin/*',
    lazy: () => import('./pages/admin').then(module => ({
      Component: module.AdminLayout
    }))
  },
  {
    path: '/products/:id',
    lazy: () => import('./pages/product-detail').then(module => ({
      Component: module.ProductDetail
    }))
  }
]);

// 8. 第三方库懒加载
const loadRecharts = () => {
  return import('recharts').then(module => ({
    LineChart: module.LineChart,
    BarChart: module.BarChart,
    PieChart: module.PieChart
  }));
};

// 9. 条件加载语言包
const loadLanguage = async (lang) => {
  const messages = await import(`./locales/${lang}.json`);
  return messages.default;
};

// 10. 特性检测后加载
const loadModernFeatures = async () => {
  if ('IntersectionObserver' in window) {
    return import('./hooks/useIntersectionObserver');
  }
  return null;
};
