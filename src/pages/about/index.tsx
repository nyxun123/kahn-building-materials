import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, Factory, Leaf, Microscope, Shield, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { COMPANY_PROFILE } from '@/lib/company-profile';
import { SOCIAL_LINKS } from '@/lib/social-links';

export default function AboutPage() {
  const { t, i18n } = useTranslation(['common', 'about']);
  const location = useLocation();
  const currentLang = i18n.language || 'zh';
  const currentUrl = `https://kn-wallpaperglue.com${location.pathname}`;

  // 构建社交媒体链接数组
  const socialProfileLinks = [
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.tiktok,
  ].filter(Boolean);

  return (
    <>
      <SEOHelmet
        title={t('nav.about')}
        description={t('about:meta_description')}
        keywords={t('about:keywords')}
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image="/images/IMG_1515.JPG"
      />
      <StructuredData
        schema={{
          type: 'Organization',
          name: COMPANY_PROFILE.name,
          alternateName: COMPANY_PROFILE.nameZh,
          description: t('about:meta_description'),
          url: 'https://kn-wallpaperglue.com',
          logo: '/images/logo.png',
          image: '/images/IMG_1515.JPG',
          telephone: COMPANY_PROFILE.phone,
          email: COMPANY_PROFILE.email,
          sameAs: socialProfileLinks,
          address: {
            streetAddress: '沪瑞线王家门1号',
            addressLocality: '杭州市临平区崇贤街道',
            addressRegion: '浙江省',
            addressCountry: 'CN',
          },
          geo: {
            latitude: 30.2741,
            longitude: 120.1551,
          },
          areaServed: ['CN', 'RU', 'VN', 'TH', 'ID', 'Global'],
          hasMap: 'https://maps.google.com/?q=30.2741,120.1551',
          contactPoint: [
            {
              contactType: 'sales',
              telephone: COMPANY_PROFILE.phone,
              email: COMPANY_PROFILE.email,
              areaServed: ['CN', 'RU', 'VN', 'TH', 'ID'],
              availableLanguage: ['zh', 'en', 'ru', 'vi', 'th', 'id'],
            },
          ],
          foundingDate: '2010',
        }}
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: t('nav.about'),
          description: t('about:meta_description'),
          url: currentUrl,
          inLanguage: currentLang,
        }}
      />
      <StructuredData
        schema={{
          type: 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t('nav.home'),
              item: `/${currentLang}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: t('nav.about'),
              item: `/${currentLang}/about`,
            },
          ],
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-4">
        <BreadcrumbNavigation />
      </div>

      {/* Mobile Factory Card Header (App Style) */}
      <section className="lg:hidden bg-white pb-6 pt-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Factory Profile Card */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-sm p-1 flex items-center justify-center shadow-sm">
              <img src="/images/logo.png" alt="Logo" className="w-full h-auto" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#064E3B] leading-tight mb-2">
                {t('about:hero.title')}
              </h1>
              <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-[#047857]" /> Verified
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">Est. 2010</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">Hangzhou, CN</span>
              </div>
            </div>
          </div>

          {/* Mobile Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-[#047857]/5 rounded p-3 text-center border border-[#047857]/10">
              <div className="text-xl font-bold text-[#047857] mb-1">100k</div>
              <div className="text-[10px] text-gray-500">Capacity(T)</div>
            </div>
            <div className="bg-[#047857]/5 rounded p-3 text-center border border-[#047857]/10">
              <div className="text-xl font-bold text-[#047857] mb-1">20+</div>
              <div className="text-[10px] text-gray-500">R&D Team</div>
            </div>
            <div className="bg-[#047857]/5 rounded p-3 text-center border border-[#047857]/10">
              <div className="text-xl font-bold text-[#047857] mb-1">45+</div>
              <div className="text-[10px] text-gray-500">Countries</div>
            </div>
          </div>

          {/* Mobile Factory Photo */}
          <div className="mb-6 rounded-sm overflow-hidden shadow-sm">
            <img src="/images/factory-view.jpg" alt="Factory" className="w-full h-48 object-cover" />
          </div>

          {/* Mobile Introduction */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#064E3B] mb-2 uppercase tracking-wide">Factory Overview</h3>
            <p className="text-xs text-gray-600 leading-relaxed text-justify">
              {t('about:company.paragraph1')}
            </p>
          </div>

          {/* Mobile Certs (Hidden as ISO not applicable yet) */}
          {/* <div className="mb-2">
              <h3 className="text-sm font-bold text-[#064E3B] mb-3 uppercase tracking-wide">Certificates</h3>
              <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                 {[1,2,3].map((i) => (
                    <div key={i} className="flex-shrink-0 w-24 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">
                       Best Quality
                    </div>
                 ))}
              </div>
           </div> */}
        </div>
      </section>

      {/* Mobile History Timeline (Vertical) */}
      <section className="lg:hidden bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-bold text-[#064E3B] mb-6 uppercase tracking-wide text-center">Development Path</h3>
          <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#047857]/20">
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#047857] border-2 border-white shadow-sm z-10"></div>
              <span className="text-xs font-bold text-[#047857] block mb-1">2010</span>
              <p className="text-xs text-gray-600">{t('about:history.events.founding')}</p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#047857] border-2 border-white shadow-sm z-10"></div>
              <span className="text-xs font-bold text-[#047857] block mb-1">2015</span>
              <p className="text-xs text-gray-600">{t('about:history.events.expansion')}</p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#047857] border-2 border-white shadow-sm z-10"></div>
              <span className="text-xs font-bold text-[#047857] block mb-1">2018</span>
              <p className="text-xs text-gray-600">{t('about:history.events.international')}</p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#047857] border-2 border-white shadow-sm z-10"></div>
              <span className="text-xs font-bold text-[#047857] block mb-1">2023</span>
              <p className="text-xs text-gray-600">{t('about:history.events.present')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Specific Sections (Original) */}
      <section className="hidden lg:block bg-gradient-to-r from-[#064E3B] to-[#047857] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('about:hero.title')}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t('about:hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 公司简介 (Desktop) */}
      <section className="hidden lg:block py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#064E3B] mb-6">
                {t('about:company.title')}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>{t('about:company.paragraph1')}</p>
                <p>{t('about:company.paragraph2')}</p>
                <p>{t('about:company.paragraph3')}</p>
              </div>
            </div>
            <div className="rounded-sm overflow-hidden shadow-lg">
              <img
                src="/images/IMG_1515.JPG"
                alt="杭州卡恩新型建材有限公司工厂"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 我们的优势 (Desktop) */}
      <section className="hidden lg:block py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#064E3B] mb-4">
              {t('about:advantages.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about:advantages.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 优势 1 */}
            <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-md transition-all">
              <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6 text-[#047857]" />
              </div>
              <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('about:advantages.quality.title')}</h3>
              <p className="text-gray-600">{t('about:advantages.quality.description')}</p>
            </div>

            {/* 优势 2 */}
            <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-md transition-all">
              <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-[#047857]" />
              </div>
              <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('about:advantages.experience.title')}</h3>
              <p className="text-gray-600">{t('about:advantages.experience.description')}</p>
            </div>

            {/* 优势 3 */}
            <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-md transition-all">
              <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-[#047857]" />
              </div>
              <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('about:advantages.eco.title')}</h3>
              <p className="text-gray-600">{t('about:advantages.eco.description')}</p>
            </div>

            {/* 优势 4 */}
            <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-md transition-all">
              <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#047857]" />
              </div>
              <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('about:advantages.service.title')}</h3>
              <p className="text-gray-600">{t('about:advantages.service.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 我们的历史 (Desktop) */}
      <section className="hidden lg:block py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#064E3B] mb-4">
              {t('about:history.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about:history.subtitle')}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* 时间线连接线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#10B981]/20"></div>

            {/* 历史事件 1 */}
            <div className="mb-12 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-sm bg-[#047857]"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:text-right pr-8">
                  <h3 className="text-lg font-semibold text-[#047857] mb-2">2010</h3>
                  <p className="text-gray-600">{t('about:history.events.founding')}</p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>

            {/* 历史事件 2 */}
            <div className="mb-12 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-sm bg-[#047857]"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:pr-8"></div>
                <div className="md:pl-8">
                  <h3 className="text-lg font-semibold text-[#047857] mb-2">2015</h3>
                  <p className="text-gray-600">{t('about:history.events.expansion')}</p>
                </div>
              </div>
            </div>

            {/* 历史事件 3 */}
            <div className="mb-12 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-sm bg-[#047857]"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:text-right pr-8">
                  <h3 className="text-lg font-semibold text-[#047857] mb-2">2018</h3>
                  <p className="text-gray-600">{t('about:history.events.international')}</p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>

            {/* 历史事件 4 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-sm bg-[#047857]"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:pr-8"></div>
                <div className="md:pl-8">
                  <h3 className="text-lg font-semibold text-[#047857] mb-2">2023</h3>
                  <p className="text-gray-600">{t('about:history.events.present')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心实力 (Desktop) */}
      <section className="hidden lg:block py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
              {t('about:strength.title')}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {t('about:strength.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 max-w-7xl mx-auto">
            {/* 生产能力 */}
            <div className="bg-white p-10 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-xl transition-all duration-300">
              <div className="rounded-sm bg-gradient-to-br from-[#047857] to-[#064E3B] p-4 w-20 h-20 flex items-center justify-center mb-8">
                <Factory className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#064E3B] mb-5">{t('about:strength.production.title')}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">{t('about:strength.production.description')}</p>
              <div className="flex items-center gap-3 text-[#047857] font-semibold pt-4 border-t border-gray-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{t('about:strength.production.capacity')}</span>
              </div>
            </div>

            {/* 品质保障 */}
            <div className="bg-white p-10 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-xl transition-all duration-300">
              <div className="rounded-sm bg-gradient-to-br from-[#047857] to-[#064E3B] p-4 w-20 h-20 flex items-center justify-center mb-8">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#064E3B] mb-5">{t('about:strength.quality.title')}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">{t('about:strength.quality.description')}</p>
              <div className="flex items-center gap-3 text-[#047857] font-semibold pt-4 border-t border-gray-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{t('about:strength.quality.assurance')}</span>
              </div>
            </div>

            {/* 快速交付 */}
            <div className="bg-white p-10 rounded-sm shadow-sm border-l-4 border-[#047857] hover:shadow-xl transition-all duration-300">
              <div className="rounded-sm bg-gradient-to-br from-[#047857] to-[#064E3B] p-4 w-20 h-20 flex items-center justify-center mb-8">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#064E3B] mb-5">{t('about:strength.delivery.title')}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">{t('about:strength.delivery.description')}</p>
              <div className="flex items-center gap-3 text-[#047857] font-semibold pt-4 border-t border-gray-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{t('about:strength.delivery.speed')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#064E3B] to-[#047857] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('about:cta.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-white/90 mb-8">
            {t('about:cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#047857] hover:bg-green-50">
              <Link to="/contact">
                {t('about:cta.contact')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
