import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, Clock, Building2 } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const { lang = 'zh' } = useParams<{ lang: string }>();

  const quickLinks = [
    { name: t('nav.home'), href: `/${lang}` },
    { name: t('nav.products'), href: `/${lang}/products` },
    { name: t('nav.oem'), href: `/${lang}/oem` },
    { name: t('nav.about'), href: `/${lang}/about` },
    { name: t('nav.contact'), href: `/${lang}/contact` },
  ];

  const certifications = [
    { name: 'ISO 9001', year: '2023' },
    { name: '环保认证', year: '2024' },
    { name: '质量认证', year: '2023' },
  ];

  return (
    <footer className="bg-background border-t border-border">
      {/* 主要内容区 */}
      <div className="bg-muted/20 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 公司信息 */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
                  KARN
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground max-w-md">
                {t('footer.company')} - {t('title')}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">{t('footer.contact.phone_value')}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">{t('footer.contact.email_value')}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span className="text-sm">{t('footer.contact.address_value')}</span>
                </div>
              </div>
            </div>
            
            {/* 快捷链接 */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                {t('footer.links.title')}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 认证信息 */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                质量认证
              </h3>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-foreground">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部版权信息 */}
      <div className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              {t('footer.rights')}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Globe className="h-4 w-4 mr-1" />
              <span>支持多语言 | </span>
              <Clock className="h-4 w-4 mx-1" />
              <span>全天候服务 | </span>
              <Building2 className="h-4 w-4 mx-1" />
              <span>专业制造</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
