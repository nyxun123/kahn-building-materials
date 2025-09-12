import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const { lang = 'zh' } = useParams<{ lang: string }>();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                KARN
              </span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {t('footer.company')}
            </p>
            <div className="mt-6 flex space-x-3">
              {/* 社交媒体图标可以在这里添加 */}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t('footer.links.title')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to={`/${lang}/products`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.links.products')}
                </Link>
              </li>
              <li>
                <Link to={`/${lang}/about`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.links.about')}
                </Link>
              </li>
              <li>
                <Link to={`/${lang}/contact`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.links.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t('footer.contact.title')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t('footer.contact.address_value')}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="ml-2 text-sm text-muted-foreground">{t('footer.contact.phone_value')}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="ml-2 text-sm text-muted-foreground">{t('footer.contact.email_value')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-muted pt-8">
          <p className="text-center text-xs text-muted-foreground">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
