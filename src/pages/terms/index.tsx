import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';

export default function TermsPage() {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const lang = (i18n.language || 'en') as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id';
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  return (
    <>
      <SEOHelmet
        title={tr('footer.bottom_links.terms', 'Terms of Service')}
        description={tr('terms.meta_description', 'Terms of service for using Hangzhou Karn New Building Materials website and inquiry channels.')}
        type="website"
        lang={lang}
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: tr('footer.bottom_links.terms', 'Terms of Service'),
          description: tr('terms.meta_description', 'Terms of service for using Hangzhou Karn New Building Materials website and inquiry channels.'),
          url: `https://kn-wallpaperglue.com${location.pathname}`,
          inLanguage: i18n.language || 'en',
        }}
      />
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-[#064E3B] mb-6">{tr('footer.bottom_links.terms', 'Terms of Service')}</h1>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>{tr('terms.p1', 'All product information on this site is for business communication and reference. Final specs are subject to confirmed quotation and contract.')}</p>
            <p>{tr('terms.p2', 'You agree not to use this website for unlawful purposes or actions that may interfere with site operations.')}</p>
            <p>{tr('terms.p3', 'Content, trademarks, and materials on this site belong to their respective owners and may not be copied without permission.')}</p>
            <p>{tr('terms.p4', 'For OEM/custom orders, quality standards, lead times, and acceptance criteria are governed by signed documents.')}</p>
            <p>{tr('terms.p5', 'We may update these terms when needed. Continued use of the site indicates acceptance of updates.')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
