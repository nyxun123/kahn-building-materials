import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';

export default function PrivacyPage() {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const lang = (i18n.language || 'en') as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id';
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  return (
    <>
      <SEOHelmet
        title={tr('footer.bottom_links.privacy', 'Privacy Policy')}
        description={tr('privacy.meta_description', 'Privacy policy for Hangzhou Karn New Building Materials website and customer communication.')}
        type="website"
        lang={lang}
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: tr('footer.bottom_links.privacy', 'Privacy Policy'),
          description: tr('privacy.meta_description', 'Privacy policy for Hangzhou Karn New Building Materials website and customer communication.'),
          url: `https://kn-wallpaperglue.com${location.pathname}`,
          inLanguage: i18n.language || 'en',
        }}
      />
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-[#064E3B] mb-6">{tr('footer.bottom_links.privacy', 'Privacy Policy')}</h1>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>{tr('privacy.p1', 'We only collect information that is necessary to reply to inquiries, provide quotations, and deliver requested services.')}</p>
            <p>{tr('privacy.p2', 'Contact form data may include name, email, phone, company, country, and message content.')}</p>
            <p>{tr('privacy.p3', 'We do not sell personal information. Data is used for customer support, order communication, and quality assurance.')}</p>
            <p>{tr('privacy.p4', 'If you need to update or delete your submitted information, please contact us via the contact page.')}</p>
            <p>{tr('privacy.p5', 'By using this website, you agree to this privacy policy and related legal notices.')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
