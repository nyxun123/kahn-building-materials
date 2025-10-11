import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Building2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { lang = 'zh' } = useParams<{ lang: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const navigation = [
    { name: t('nav.home'), href: `/${lang}` },
    { 
      name: t('nav.products'), 
      href: `/${lang}/products`,
      hasDropdown: true,
      children: [
        { name: '墙纸胶粉', href: `/${lang}/products/wallpaper-glue` },
        { name: '植物淀粉', href: `/${lang}/products/plant-starch` },
        { name: 'OEM定制', href: `/${lang}/oem` }
      ]
    },
    { name: t('nav.oem'), href: `/${lang}/oem` },
    { name: t('nav.about'), href: `/${lang}/about` },
    { name: t('nav.contact'), href: `/${lang}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
      isScrolled 
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-green-100 dark:border-green-800/30" 
        : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-green-50 dark:border-green-900/20"
    )}>
      {/* 企业信息栏 - 工业风格 */}
      <div className="hidden lg:flex bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-2 text-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center group hover:text-green-100 transition-colors duration-200">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="font-medium">杭州卡恩新型建材有限公司</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center group hover:text-green-100 transition-colors duration-200">
                <Phone className="h-4 w-4 mr-2" />
                <span>+86 571-88888888</span>
              </div>
              <div className="flex items-center group hover:text-green-100 transition-colors duration-200">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@karn-materials.com</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>浙江省杭州市余杭区东湖街道星光街15号星光大厦A座</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主导航栏 - 专业工业设计 */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label={t('nav.main_navigation')}>
        <div className="flex items-center justify-between">
          {/* 品牌标识 - 工业级设计 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
                  KARN
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">卡恩建材</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">新型建材供应商</div>
              </div>
            </Link>
            
            {/* 桂面端导航菜单 */}
            <div className="hidden lg:ml-12 lg:block">
              <div className="flex items-center space-x-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/' && location.pathname.startsWith(item.href));
                  
                  return (
                    <div key={item.name} className="relative group">
                      {item.hasDropdown ? (
                        <>
                          <button
                            className={cn(
                              "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                              isActive
                                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 shadow-sm"
                                : "text-gray-700 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/10"
                            )}
                            onMouseEnter={() => setShowDropdown(item.name)}
                            onMouseLeave={() => setShowDropdown(null)}
                          >
                            {item.name}
                            <ChevronDown className={cn(
                              "ml-1 h-4 w-4 transition-transform duration-200",
                              showDropdown === item.name ? "rotate-180" : ""
                            )} />
                          </button>
                          
                          {/* 下拉菜单 */}
                          <div className={cn(
                            "absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-200 transform origin-top",
                            showDropdown === item.name 
                              ? "opacity-100 scale-100 translate-y-0" 
                              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                          )}
                          onMouseEnter={() => setShowDropdown(item.name)}
                          onMouseLeave={() => setShowDropdown(null)}
                          >
                            <div className="py-2">
                              {item.children?.map((child) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className="block px-4 py-2.5 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/10 transition-colors duration-150"
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                            isActive
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 shadow-sm"
                              : "text-gray-700 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/10"
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.name}
                          {isActive && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-green-500 rounded-full"></div>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-3">
            {/* CTA 按钮 */}
            <div className="hidden md:block">
              <Link
                to={`/${lang}/contact`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
              >
                立即咨询
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <ThemeToggle />
              
              {/* 移动端菜单按钮 */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                  aria-label={t('nav.toggle_menu')}
                  className="hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 - 优化设计 */}
      <div className={cn(
        'lg:hidden transition-all duration-300 ease-out',
        isMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      )}>
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-green-100 dark:border-green-800/30">
          {/* 移动端联系信息 */}
          <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 border-b border-green-100 dark:border-green-800/20">
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-green-700 dark:text-green-300">
                <Building2 className="h-4 w-4 mr-3 text-green-600" />
                <span className="font-medium">杭州卡恩新型建材有限公司</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-3 text-green-600" />
                <span>+86 571-88888888</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-3 text-green-600" />
                <span>info@karn-materials.com</span>
              </div>
            </div>
          </div>
          
          {/* 移动端导航菜单 */}
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                      isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/10"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    {isActive && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </Link>
                  
                  {/* 移动端下拉菜单 */}
                  {item.hasDropdown && item.children && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50/50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/10 rounded-md transition-colors duration-150"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 移动端底部 */}
          <div className="px-4 py-4 border-t border-green-100 dark:border-green-800/20">
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <Link
                to={`/${lang}/contact`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-medium rounded-lg shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                立即咨询
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
