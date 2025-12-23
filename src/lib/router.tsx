import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ProductDetailRedirect } from '@/components/ProductDetailRedirect';

// 延迟加载组件
const HomePage = lazy(() => import('@/pages/home'));
const ProductsPage = lazy(() => import('@/pages/products'));
const ProductDetailPage = lazy(() => import('@/pages/product-detail'));
const ApplicationsPage = lazy(() => import('@/pages/applications'));
const OemPage = lazy(() => import('@/pages/oem'));
const AboutPage = lazy(() => import('@/pages/about'));
const ContactPage = lazy(() => import('@/pages/contact'));
const SolutionsHubPage = lazy(() => import('@/pages/solutions/hub'));
const SolutionsDetailPage = lazy(() => import('@/pages/solutions'));
const BlogPage = lazy(() => import('@/pages/blog'));
const BlogDetailPage = lazy(() => import('@/pages/blog/[slug]'));

// Admin页面
const AdminLoginPage = lazy(() => import('@/pages/admin/login'));
const AdminLayout = lazy(() => import('@/pages/admin/layout'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'));
const AdminProductsPage = lazy(() => import('@/pages/admin/products'));
const AdminProductEditPage = lazy(() => import('@/pages/admin/product-edit'));
const AdminMessagesPage = lazy(() => import('@/pages/admin/messages'));
const AdminContentPage = lazy(() => import('@/pages/admin/content'));
const AdminHomeContentPage = lazy(() => import('@/pages/admin/home-content'));
const AdminMediaLibraryPage = lazy(() => import('@/pages/admin/media-library'));
const AdminCompanyInfoPage = lazy(() => import('@/pages/admin/company-info'));
const AdminSEOPage = lazy(() => import('@/pages/admin/seo'));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/analytics'));
const AdminSitemapPage = lazy(() => import('@/pages/admin/sitemap'));
const AdminBlogPage = lazy(() => import('@/pages/admin/blog'));
const AdminBlogEditPage = lazy(() => import('@/pages/admin/blog/[id]'));

// 加载中组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export const router = createBrowserRouter([
  // 管理员登录路由 - 独立路由，不使用前端Layout
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/:lang/admin/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  // 管理员页面路由 - 独立路由，不使用前端Layout
  {
    path: '/admin',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminProductEditPage />
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminMessagesPage />
          </Suspense>
        ),
      },
      {
        path: 'content',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminContentPage />
          </Suspense>
        ),
      },
      {
        path: 'home-content',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminHomeContentPage />
          </Suspense>
        ),
      },
      {
        path: 'media-library',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminMediaLibraryPage />
          </Suspense>
        ),
      },
      {
        path: 'company-info',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminCompanyInfoPage />
          </Suspense>
        ),
      },
      {
        path: 'seo',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSEOPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'sitemap',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSitemapPage />
          </Suspense>
        ),
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminBlogPage />
          </Suspense>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminBlogEditPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/:lang/admin',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminProductEditPage />
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminMessagesPage />
          </Suspense>
        ),
      },
      {
        path: 'content',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminContentPage />
          </Suspense>
        ),
      },
      {
        path: 'home-content',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminHomeContentPage />
          </Suspense>
        ),
      },
      {
        path: 'media-library',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminMediaLibraryPage />
          </Suspense>
        ),
      },
      {
        path: 'company-info',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminCompanyInfoPage />
          </Suspense>
        ),
      },
    ],
  },
  // 前端页面路由
  {
    path: '/:lang',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:productCode',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'applications',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ApplicationsPage />
          </Suspense>
        ),
      },
      {
        path: 'oem',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OemPage />
          </Suspense>
        ),
      },
      {
        path: 'solutions',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SolutionsHubPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'solutions/:slug',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SolutionsDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogPage />
          </Suspense>
        ),
      },
      {
        path: 'blog/:slug',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogDetailPage />
          </Suspense>
        ),
      },
    ],
  },
  // 重定向路由
  {
    path: '/',
    element: <Navigate to="/en" replace />,
  },
  {
    path: '/products/:productCode',
    element: <ProductDetailRedirect />,
  },
  {
    path: '/applications',
    element: <Navigate to="/en/applications" replace />,
  },
  {
    path: '/oem',
    element: <Navigate to="/en/oem" replace />,
  },
  {
    path: '/about',
    element: <Navigate to="/en/about" replace />,
  },
  {
    path: '/contact',
    element: <Navigate to="/en/contact" replace />,
  },
  {
    path: '/blog',
    element: <Navigate to="/en/blog" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/en" replace />,
  },
]);
