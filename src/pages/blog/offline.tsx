import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wrench } from 'lucide-react';
import { SEOHelmet } from '@/components/SEOHelmet';
import { Button } from '@/components/ui/button';

const COPY = {
  zh: {
    badge: '公告',
    title: '博客暂时下线',
    subtitle: '我们正在调整内容与排版，稍后恢复更新。',
    body: '如需产品资料或技术支持，请直接联系我们。',
    ctaHome: '返回首页',
    ctaContact: '联系我们',
  },
  en: {
    badge: 'Notice',
    title: 'Blog Temporarily Offline',
    subtitle: 'We are improving the content and layout and will be back soon.',
    body: 'For product information or technical support, please contact us.',
    ctaHome: 'Back to Home',
    ctaContact: 'Contact Us',
  },
};

export default function BlogOfflinePage() {
  const { i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const normalizedLang = (lang || i18n.language || 'en').split('-')[0];
  const copy = COPY[normalizedLang as 'zh' | 'en'] || COPY.en;

  return (
    <>
      <SEOHelmet
        title={copy.title}
        description={copy.subtitle}
        type="website"
        lang={normalizedLang as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        noindex
      />
      <section className="bg-gradient-to-r from-[#064E3B] to-[#047857] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-sm mb-4">
            <Wrench className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium tracking-wider uppercase">
              {copy.badge}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {copy.title}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-700 mb-6">{copy.body}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-[#047857] hover:bg-[#064E3B]">
                <Link to={`/${normalizedLang}`}>
                  {copy.ctaHome}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/${normalizedLang}/contact`}>
                  {copy.ctaContact}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
