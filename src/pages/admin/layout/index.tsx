import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Home, Inbox, LogOut, Menu, Package, Settings, X } from 'lucide-react';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminLayout() {
  const { t } = useTranslation(['common', 'admin']);
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // 检查是否已登录
    const userJson = localStorage.getItem('admin_user');
    
    if (!userJson) {
      // 未登录，重定向到登录页面
      navigate('/admin/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userJson);
      // 设置用户信息，使用Supabase用户数据结构
      setUser({
        id: userData.id,
        name: userData.email?.split('@')[0] || 'Admin',
        email: userData.email,
        role: 'admin'
      });
    } catch (error) {
      console.error('Invalid user data:', error);
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  if (!user) {
    return null; // 正在加载或未登录
  }

  const navigation = [
    { name: t('admin:sidebar.dashboard'), href: '/admin/dashboard', icon: BarChart3 },
    { name: t('admin:sidebar.products'), href: '/admin/products', icon: Package },
    { name: t('admin:sidebar.messages'), href: '/admin/messages', icon: Inbox },
    { name: t('admin:sidebar.content'), href: '/admin/content', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      {/* 移动端侧边栏 */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              KARN <span className="text-sm font-normal text-muted-foreground">Admin</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">关闭菜单</span>
            </Button>
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${window.location.pathname === item.href
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">{user.name[0]}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('admin:sidebar.logout')}
              </Button>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 标准大屏幕侧边栏 */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-border bg-background">
          <div className="flex flex-col flex-1 h-0 overflow-y-auto">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-border">
              <Link to="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                KARN <span className="text-sm font-normal text-muted-foreground">Admin</span>
              </Link>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${window.location.pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex-shrink-0 border-t border-border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">{user.name[0]}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('admin:sidebar.logout')}
                </Button>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                  <Button asChild variant="ghost" size="icon">
                    <Link to="/zh">
                      <Home className="h-5 w-5" />
                      <span className="sr-only">{t('admin:sidebar.view_site')}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="lg:hidden border-b border-border h-16 flex items-center bg-background pl-4">
          <Button variant="ghost" onClick={() => setSidebarOpen(true)} size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">打开菜单</span>
          </Button>
          <div className="ml-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            KARN <span className="text-sm font-normal text-muted-foreground">Admin</span>
          </div>
          <div className="ml-auto flex items-center space-x-2 pr-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/zh">
                <Home className="h-5 w-5" />
                <span className="sr-only">{t('admin:sidebar.view_site')}</span>
              </Link>
            </Button>
          </div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
