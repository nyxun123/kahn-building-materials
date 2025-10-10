import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

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

  const navigation = [
    { name: t('nav.home'), href: `/${lang}` },
    { name: t('nav.products'), href: `/${lang}/products` },
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
        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm" 
        : "bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
    )}>
      {/* 联系信息栏 */}
      <div className="hidden md:flex bg-muted/30 border-b border-border py-2 text-xs text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{t('footer.contact.phone_value')}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>{t('footer.contact.email_value')}</span>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{t('footer.contact.address_value')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3" aria-label={t('nav.main_navigation')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
                KARN
              </span>
            </Link>
            <div className="hidden md:ml-10 md:block">
              <div className="flex space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/' && location.pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                        'px-4 py-2 rounded-md text-sm font-medium transition-colors'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={t('nav.toggle_menu')}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <div className={cn(
        'md:hidden',
        isMenuOpen ? 'block' : 'hidden'
      )}>
        <div className="pb-3 pt-2 space-y-1">
          <div className="px-4 pb-3 border-b border-border">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{t('footer.contact.phone_value')}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{t('footer.contact.email_value')}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                <span>{t('footer.contact.address_value')}</span>
              </div>
            </div>
          </div>
          
          <div className="px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="px-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
