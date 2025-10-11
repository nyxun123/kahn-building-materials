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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-green-700 shadow-lg"
        : "bg-green-700"
    )}>
      {/* 主导航栏 - 符合设计图片的深绿色背景 */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label={t('nav.main_navigation')}>
        <div className="flex items-center justify-between">
          {/* 品牌标识 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-white font-bold text-xl">
                KARN
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="text-white text-sm">杭州卡恩新型建材有限公司</div>
              </div>
            </Link>
          </div>

          {/* 桌面端导航菜单 */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to={`/${lang}`}
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
            >
              首页
            </Link>
            <Link
              to={`/${lang}/products`}
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
            >
              产品中心
            </Link>
            <Link
              to={`/${lang}/about`}
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
            >
              关于我们
            </Link>
            <Link
              to={`/${lang}/contact`}
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
            >
              联系我们
            </Link>
          </div>

          {/* 右侧联系信息 */}
          <div className="hidden lg:flex items-center space-x-6 text-white">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-medium">+86 571-8888-8888</span>
            </div>

            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={t('nav.toggle_menu')}
              className="text-white hover:bg-green-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 - 简化版 */}
      <div className={cn(
        'lg:hidden transition-all duration-300 ease-out',
        isMenuOpen
          ? 'max-h-screen opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
      )}>
        <div className="bg-green-600">
          <div className="px-4 py-4 space-y-3">
            <Link
              to={`/${lang}`}
              className="block text-white hover:text-green-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              to={`/${lang}/products`}
              className="block text-white hover:text-green-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              产品中心
            </Link>
            <Link
              to={`/${lang}/about`}
              className="block text-white hover:text-green-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              关于我们
            </Link>
            <Link
              to={`/${lang}/contact`}
              className="block text-white hover:text-green-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              联系我们
            </Link>

            <div className="flex items-center text-white pt-4 border-t border-green-500">
              <Phone className="h-4 w-4 mr-2" />
              <span>+86 571-8888-8888</span>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
