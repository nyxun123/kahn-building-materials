import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { BiMenu, BiX } from 'react-icons/bi';
import { Toaster } from 'react-hot-toast';
import {
  RiDashboardLine,
  RiProductHuntLine,
  RiMessage2Line,
  RiFileTextLine,
  RiLogoutBoxLine,
  RiGlobalLine
} from 'react-icons/ri';

const AdminLayout = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查Supabase认证状态
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          navigate('/admin/login');
        } else {
          // 验证是否为管理员权限
          const { data: profile } = await supabase
            .from('admin_users')
            .select('is_active')
            .eq('email', session.user.email)
            .single();
            
          if (!profile?.is_active) {
            await supabase.auth.signOut();
            navigate('/admin/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate('/admin/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 检查当前路由是否激活
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: <RiDashboardLine size={20} />, label: t('sidebar.dashboard') },
    { path: '/admin/products', icon: <RiProductHuntLine size={20} />, label: t('sidebar.products') },
    { path: '/admin/messages', icon: <RiMessage2Line size={20} />, label: t('sidebar.messages') },
    { path: '/admin/content', icon: <RiFileTextLine size={20} />, label: t('sidebar.content') },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* 移动端侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">管理后台</h1>
            <button 
              className="p-1 lg:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <BiX size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive(item.path) ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-foreground font-medium' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              target="_blank"
            >
              <span className="mr-3"><RiGlobalLine size={20} /></span>
              <span>{t('sidebar.view_site')}</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="mr-3"><RiLogoutBoxLine size={20} /></span>
              <span>{t('sidebar.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* 顶部导航栏 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="p-1" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <BiMenu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">管理后台</h1>
            <div className="w-6"></div> {/* 占位元素保持布局对称 */}
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Toaster position="top-center" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;