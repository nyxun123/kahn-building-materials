import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Factory, FlaskConical, Globe, Truck, Users, Check, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { COMPANY_PROFILE } from '@/lib/company-profile';
import { SOCIAL_LINKS } from '@/lib/social-links';

export default function OemPage() {
  const { t, i18n } = useTranslation(['common', 'oem']);
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
        title={t('nav.oem')}
        description={t('oem:meta_description')}
        keywords="OEM定制,ODM服务,墙纸胶粉代工,小包装定制,品牌代工,wallpaper adhesive OEM,private label,custom packaging, wallpaper glue manufacturer china, 墙纸胶代加工, производство клея для обоев под стм"
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image="/images/oem-home.png"
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: t('nav.oem'),
          description: t('oem:meta_description'),
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
              name: t('nav.oem'),
              item: `/${currentLang}/oem`,
            },
          ],
        }}
      />

      {/* =====================================================================================
          MOBILE VIEW (App-like Style)
         ===================================================================================== */}
      <div className="md:hidden bg-gray-50 min-h-screen pb-24 font-sans">

        {/* Mobile App Header / Hero */}
        <div className="relative h-56 bg-gray-900 overflow-hidden">
          <img
            src="/images/oem-banner-product.png"
            alt="OEM Product Packaging"
            className="w-full h-full object-cover opacity-100"
          />
          {/* Gradient optimized for visibility: Only darkens bottom 75% for text, top is clear */}
          <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-black/90 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-5 z-10">
            <div className="flex items-center space-x-2 text-white/90 text-xs mb-1 font-medium tracking-wider uppercase">
              <span>Source Factory</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span>Customization</span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight shadow-sm">
              {t('oem:hero.title')}
            </h1>
          </div>
        </div>

        {/* Dense Grid Services */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t('oem:services.title')}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mb-2 text-[#047857]">
                <FlaskConical size={16} />
              </div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">{t('oem:services.development.title')}</h3>
              <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">{t('oem:services.development.description')}</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mb-2 text-[#047857]">
                <Factory size={16} />
              </div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">{t('oem:services.manufacturing.title')}</h3>
              <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">{t('oem:services.manufacturing.description')}</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center col-span-2">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#047857]"><Truck size={16} /></div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-gray-900">{t('oem:services.logistics.title')}</h3>
                  <p className="text-[10px] text-gray-500">{t('oem:services.logistics.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature List (Advantages) */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('oem:advantages.title')}</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-4">
            {[
              { icon: Factory, title: t('oem:advantages.items.facilities.title'), desc: t('oem:advantages.items.facilities.description') },
              { icon: Users, title: t('oem:advantages.items.team.title'), desc: t('oem:advantages.items.team.description') },
              { icon: Globe, title: t('oem:advantages.items.experience.title'), desc: t('oem:advantages.items.experience.description') }
            ].map((item, i) => (
              <div key={i} className="flex">
                <div className="mt-0.5 mr-3 text-[#047857] bg-green-50 p-1 rounded-sm">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline (Compact) */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('oem:process.title')}</h2>
          <div className="space-y-3">
            {[
              { step: '01', title: t('oem:process.steps.consultation.title') },
              { step: '02', title: t('oem:process.steps.development.title') },
              { step: '03', title: t('oem:process.steps.production.title') },
              { step: '04', title: t('oem:process.steps.delivery.title') }
            ].map((step, i) => (
              <div key={i} className="bg-white p-3 rounded border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <span className="text-xs font-bold text-gray-300 mr-3">{step.step}</span>
                  <span className="text-sm font-medium text-gray-800">{step.title}</span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 safe-area-pb z-50 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500">Need Customization?</span>
            <span className="text-sm font-bold text-[#047857]">Factory Direct</span>
          </div>
          <Button asChild className="bg-[#047857] hover:bg-[#064E3B] text-white shadow-lg px-8 rounded-full">
            <Link to="/contact">
              {t('oem:cta.button')}
            </Link>
          </Button>
        </div>
      </div>


      {/* =====================================================================================
          DESKTOP VIEW (Original)
         ===================================================================================== */}
      <div className="hidden md:block">

        {/* 英雄区 */}
        <section className="bg-gradient-to-r from-[#064E3B] to-[#047857] py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('oem:hero.title')}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              {t('oem:hero.subtitle')}
            </p>
            <Button asChild size="lg" className="bg-white text-[#047857] hover:bg-green-50">
              <Link to="/contact">
                {t('oem:hero.cta')}
              </Link>
            </Button>
          </div>
        </section>

        {/* 服务介绍 */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t('oem:services.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('oem:services.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {/* 产品开发 */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <FlaskConical className="h-6 w-6 text-[#047857]" />
                </div>
                <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:services.development.title')}</h3>
                <p className="text-gray-600 mb-4">{t('oem:services.development.description')}</p>
              </div>

              {/* 定制生产 */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Factory className="h-6 w-6 text-[#047857]" />
                </div>
                <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:services.manufacturing.title')}</h3>
                <p className="text-gray-600 mb-4">{t('oem:services.manufacturing.description')}</p>
              </div>

              {/* 包装定制 */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="rounded-sm bg-[#047857]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-[#047857]" />
                </div>
                <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:services.logistics.title')}</h3>
                <p className="text-gray-600 mb-4">{t('oem:services.logistics.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* OEM流程 */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t('oem:process.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('oem:process.subtitle')}
              </p>
            </div>

            <div className="relative">
              {/* 连接线 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#10B981]/20 hidden md:block"></div>

              <div className="space-y-12 relative">
                {/* 步骤 1 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] relative">
                      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 rounded-sm bg-[#047857] text-white flex items-center justify-center font-bold z-10 hidden md:flex">1</div>
                      <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:process.steps.consultation.title')}</h3>
                      <p className="text-gray-600">{t('oem:process.steps.consultation.description')}</p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>

                {/* 步骤 2 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div>
                    <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] relative">
                      <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 rounded-sm bg-[#047857] text-white flex items-center justify-center font-bold z-10 hidden md:flex">2</div>
                      <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:process.steps.development.title')}</h3>
                      <p className="text-gray-600">{t('oem:process.steps.development.description')}</p>
                    </div>
                  </div>
                </div>

                {/* 步骤 3 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] relative">
                      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 rounded-sm bg-[#047857] text-white flex items-center justify-center font-bold z-10 hidden md:flex">3</div>
                      <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:process.steps.production.title')}</h3>
                      <p className="text-gray-600">{t('oem:process.steps.production.description')}</p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>

                {/* 步骤 4 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div>
                    <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#047857] relative">
                      <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 rounded-sm bg-[#047857] text-white flex items-center justify-center font-bold z-10 hidden md:flex">4</div>
                      <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:process.steps.delivery.title')}</h3>
                      <p className="text-gray-600">{t('oem:process.steps.delivery.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 优势 */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t('oem:advantages.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('oem:advantages.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 items-start">
              {/* 左侧图片 */}
              <div className="bg-muted rounded-sm overflow-hidden shadow-lg h-[500px]">
                <img
                  src="/images/generated 英文_image.png"
                  alt="OEM定制包装生产"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%' }}
                />
              </div>

              {/* 右侧优势列表 */}
              <div className="space-y-6 h-[500px] flex flex-col justify-between">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-sm bg-[#047857]/10 flex items-center justify-center">
                      <Factory className="h-5 w-5 text-[#047857]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:advantages.items.facilities.title')}</h3>
                    <p className="text-gray-600">{t('oem:advantages.items.facilities.description')}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-sm bg-[#047857]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#047857]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:advantages.items.team.title')}</h3>
                    <p className="text-gray-600">{t('oem:advantages.items.team.description')}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-sm bg-[#047857]/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-[#047857]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#064E3B] mb-2">{t('oem:advantages.items.experience.title')}</h3>
                    <p className="text-gray-600">{t('oem:advantages.items.experience.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 行动召唤区 CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-[#064E3B] to-[#047857] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t('oem:cta.title')}
            </h2>
            <p className="max-w-2xl mx-auto text-white/90 mb-8">
              {t('oem:cta.description')}
            </p>
            <Button asChild size="lg" className="bg-white text-[#047857] hover:bg-green-50">
              <Link to="/contact">
                {t('oem:cta.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
