import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

interface NavbarProps {
  forceUpdate?: number;
}

export function Navbar({ forceUpdate }: NavbarProps = {}) {
  const location = useLocation();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white w-full">
      {/* Top info bar */}
      <div className="bg-[#064E3B] text-white py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="mr-4">Hangzhou Karn New Building Materials Co., Ltd.</span>
            <div className="flex items-center mr-4">
              <Phone className="h-4 w-4 mr-1" />
              <span>+86 571-88888888</span>
            </div>
            <div className="hidden sm:flex items-center mr-4">
              <Mail className="h-4 w-4 mr-1" />
              <span>info@karn-materials.com</span>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>No. 18, Xingqiao Road, Donghu Street, Yuhang District, Hangzhou, China</span>
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <nav className={cn(
        "bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 transition-all duration-300",
        isScrolled ? "shadow-md" : ""
      )} aria-label="Main Navigation">
        <div className="flex items-center justify-between">
          {/* Brand logo */}
          <div className="flex items-center">
            <Link to={`/${lang}`} className="flex items-center group">
              <div className="text-[#047857] font-bold text-xl group-hover:text-[#064E3B] transition-colors">
                KARN
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="text-gray-700 text-sm font-medium group-hover:text-[#047857] transition-colors">
                  Hangzhou Karn New Building Materials Co., Ltd.
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link
              to={`/${lang}`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to={`/${lang}/products`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              Products
            </Link>
            <Link
              to={`/${lang}/about`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              About Us
            </Link>
            <Link
              to={`/${lang}/contact`}
              className="text-gray-700 hover:text-[#047857] transition-colors duration-200 font-medium relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to={`/${lang}/contact`}>
              <Button className="bg-[#047857] hover:bg-[#064E3B] text-white px-6 py-2 text-sm rounded-sm transition-colors duration-200">
                <Phone className="h-4 w-4 mr-2" />
                Contact Now
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle Menu"
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

      {/* Mobile menu */}
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
                Contact Now
              </Button>
            </Link>

            <div className="space-y-4">
              <Link
                to={`/${lang}`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={`/${lang}/products`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to={`/${lang}/about`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to={`/${lang}/contact`}
                className="block text-gray-700 hover:text-[#047857] py-3 font-medium border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}