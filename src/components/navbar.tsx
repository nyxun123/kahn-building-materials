import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Building2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { Button } from './ui/button';

interface NavbarProps {
  forceUpdate?: number;
}

export function Navbar({ forceUpdate }: NavbarProps = {}) {
  const { t, i18n } = useTranslation("common");
  const location = useLocation();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // Navbar只负责显示，语言同步由Layout组件处理
  // 使用URL中的语言代码（如果存在），否则使用i18n当前语言
  const currentLang = lang || i18n.language || 'en';

  const navigation = [
    { name: t('nav.home'), href: `/${currentLang}` },
    {
      name: t('nav.applications'),
      href: `/${currentLang}/applications`,
    },
    { name: t('nav.oem'), href: `/${currentLang}/oem` },
    { name: t('nav.about'), href: `/${currentLang}/about` },
    { name: t('nav.contact'), href: `/${currentLang}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header key={`navbar-${currentLang}-${forceUpdate}`} className="fixed top-0 left-0 right-0 z-50 bg-white w-full">
      {/* 顶部信息条 - 深绿色工业风格 */}
      <div className="bg-[#064E3B] text-white py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="mr-4">{t('header.company_name')}</span>
            <div className="flex items-center mr-4">
              <Phone className="h-4 w-4 mr-1" />
              <span>{t('header.phone')}</span>
            </div>
            <div className="hidden sm:flex items-center mr-4">
              <Mail className="h-4 w-4 mr-1" />
              <span>{t('header.email')}</span>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{t('header.address')}</span>
          </div>
        </div>
      </div>
      
      {/* 主导航栏 - 白色工业风格，始终保持在顶部 */}
      <nav className={cn(
        "bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 transition-all duration-300",
        isScrolled ? "shadow-md" : ""
      )} aria-label={t('nav.main_navigation')}>
        <div className="flex items-center justify-between">
          {/* 品牌标识 - 工业级专业感 */}
          <div className="flex items-center">
            <Link to={`/${currentLang}`} className="flex items-center group">
              <div className="text-[#047857] font-bold text-xl group-hover:text-[#064E3B] transition-colors">
                KARN
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="text-gray-700 text-sm font-medium group-hover:text-[#047857] transition-colors">
                  {t('header.brand_name')}
                </div>
              </div>
            </Link>
          </div>

          {/* 桌面端导航菜单 - 统一绿色色调 */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to={`/${currentLang}`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('nav.home')}
            </Link>
            <Link
              to={`/${currentLang}/applications`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('nav.applications')}
            </Link>
            <Link
              to={`/${currentLang}/oem`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('nav.oem')}
            </Link>
            <Link
              to={`/${currentLang}/about`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('nav.about')}
            </Link>
            <Link
              to={`/${currentLang}/contact`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* 右侧导航元素 - 工业风格按钮 */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to={`/${lang}/contact`}>
              <Button className="bg-[#047857] hover:bg-[#064E3B] text-white px-6 py-2 text-sm rounded-sm transition-colors duration-200">
                <Phone className="h-4 w-4 mr-2" />
                {t('header.consult_now')}
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>

          {/* 移动端菜单按钮 */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={t('nav.toggle_menu')}
              className="text-gray-700 hover:bg-gray-100 hover:text-[#047857]"
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

      {/* 移动端菜单 - 工业风格 */}
      <div className={cn(
        'lg:hidden transition-all duration-300 ease-out bg-white border-b border-gray-100',
        isMenuOpen
          ? 'max-h-screen opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
      )}>
        <div className="px-4 py-6 space-y-6">
          <div className="flex flex-col space-y-6">
            <Link to={`/${lang}/contact`}>
              <Button className="w-full bg-[#047857] hover:bg-[#064E3B] text-white px-6 py-3 rounded-sm transition-colors">
                <Phone className="h-4 w-4 mr-2" />
                {t('header.consult_now')}
              </Button>
            </Link>

            <div className="space-y-4">
              <Link
                to={`/${currentLang}`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to={`/${currentLang}/applications`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.applications')}
              </Link>
              <Link
                to={`/${currentLang}/oem`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.oem')}
              </Link>
              <Link
                to={`/${currentLang}/about`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to={`/${currentLang}/contact`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
