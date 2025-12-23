import { useTranslation } from 'react-i18next';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { useState, useMemo } from 'react';

// 应用领域数据，包含对应的产品代码
const applications = [
  {
    id: 'textile',
    nameKey: 'applications:textile.title',
    descKey: 'applications:textile.description',
    scenariosKey: 'applications:textile.applications',
    benefitsKey: 'applications:textile.features',
    productCode: 'textile-cms',
    image: '/images/应用领域/纺织印染.jpg',
  },
  {
    id: 'construction',
    nameKey: 'applications:construction.title',
    descKey: 'applications:construction.description',
    scenariosKey: 'applications:construction.applications',
    benefitsKey: 'applications:construction.features',
    productCode: 'construction-cms',
    image: '/images/应用领域/腻子粉.jpg',
  },
  {
    id: 'coating',
    nameKey: 'applications:coating.title',
    descKey: 'applications:coating.description',
    scenariosKey: 'applications:coating.applications',
    benefitsKey: 'applications:coating.features',
    productCode: 'coating-cms',
    image: '/images/应用领域/水性涂料.png',
  },
  {
    id: 'paper',
    nameKey: 'applications:paper.title',
    descKey: 'applications:paper.description',
    scenariosKey: 'applications:paper.applications',
    benefitsKey: 'applications:paper.features',
    productCode: 'paper-dyeing-cms',
    image: '/images/应用领域/造纸.JPG',
  },
  {
    id: 'wallpaper',
    nameKey: 'applications:wallpaper.title',
    descKey: 'applications:wallpaper.description',
    scenariosKey: 'applications:wallpaper.applications',
    benefitsKey: 'applications:wallpaper.features',
    productCode: 'wallpaper-adhesive',
    image: '/images/应用领域/墙纸胶.jpeg',
  },
  {
    id: 'desiccant',
    nameKey: 'applications:desiccant.title',
    descKey: 'applications:desiccant.description',
    scenariosKey: 'applications:desiccant.applications',
    benefitsKey: 'applications:desiccant.features',
    productCode: 'desiccant-gel',
    image: '/images/应用领域/calcium-chloride-gel.jpg',
  },
  {
    id: 'oem',
    nameKey: 'nav.oem', // reusing nav key for brevity, or add specific key
    descKey: 'applications:cta.description', // reusing description
    scenariosKey: 'applications:wallpaper.applications', // placeholder, will use simplified logic if needed
    benefitsKey: 'applications:wallpaper.features',
    productCode: 'oem-service',
    image: '/images/5fbd3f1a-5077-4ecb-8f50-008dab912740.png', // Hero image or specific OEM image
    isService: true, // Flag to handle specific link logic if needed
  },
];

export default function ApplicationsPage() {
  const { t, i18n } = useTranslation(['common', 'applications']);
  const { lang = 'en' } = useParams<{ lang: string }>();
  const location = useLocation();
  const currentLang = lang || i18n.language || 'en';
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // 构建当前页面URL
  const currentUrl = `https://kn-wallpaperglue.com${location.pathname}`;

  // 生成应用领域的 ItemList 结构化数据
  const itemListSchema = useMemo(() => {
    return {
      type: 'ItemList' as const,
      name: t('applications:hero.title'),
      description: t('applications:meta_description'),
      numberOfItems: applications.length,
      itemListElement: applications.map((app, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        item: {
          '@type': 'WebPage' as const,
          name: t(app.nameKey),
          description: t(app.descKey),
          url: `https://kn-wallpaperglue.com/${currentLang}/applications#${app.id}`,
        },
      })),
    };
  }, [currentLang, t]);

  return (
    <>
      <SEOHelmet
        title={t('nav.applications')}
        description={t('applications:meta_description')}
        keywords={t('applications:keywords') + ", textile sizing agent, construction putty additive, paper coating adhesive, 纺织上浆剂, 建筑腻子添加剂, 造纸涂布胶, шлихтующий агент для текстиля, добавка для шпатлевки"}
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image="/images/应用领域/纺织印染.jpg"
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: t('applications:hero.title'),
          description: t('applications:meta_description'),
          url: currentUrl,
          inLanguage: i18n.language || 'zh',
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
              name: t('nav.applications'),
              item: `/${currentLang}/applications`,
            },
          ],
        }}
      />
      <StructuredData schema={itemListSchema} />

      {/* Hero Section (Responsive) */}
      <section id="top" className="relative py-0 h-[150px] lg:h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/5fbd3f1a-5077-4ecb-8f50-008dab912740.png"
            alt={t('applications:hero.alt')}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 via-[#047857]/85 to-[#064E3B]/80 z-10"></div>
        <div className="container mx-auto px-4 relative z-30">
          <div className="max-w-3xl">
            {/* Simplified Mobile Hero Content */}
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-white leading-tight mb-1">
                {t('applications:hero.title')}
              </h1>
              <p className="text-green-100 text-xs opacity-90">Professional Manufacturer since 2010</p>
            </div>

            {/* Desktop Content */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-sm mb-2 border border-white/20">
                <span className="text-white text-[10px] uppercase tracking-wider font-bold">Product Catalog</span>
              </div>
              <h1 className="text-2xl lg:text-5xl font-bold text-white leading-tight mb-2 lg:mb-6">
                {t('applications:hero.title')}
              </h1>
              <p className="text-green-100 text-xl leading-relaxed max-w-2xl mb-8">
                {t('applications:hero.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Style Header & Filters (Sticky BELOW Hero) */}
      <div className="lg:hidden sticky top-[56px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const el = document.getElementById('top');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="whitespace-nowrap px-4 py-1.5 bg-[#047857] text-white text-xs font-medium rounded-full shadow-sm"
            >
              All
            </button>
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  const el = document.getElementById(app.id);
                  const offset = 120; // Adjust for sticky headers
                  if (el) {
                    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
                  }
                }}
                className="whitespace-nowrap px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-[#047857]/10 hover:text-[#047857] transition-colors"
              >
                {t(app.nameKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Product List (Original List Style) */}
      <section className="lg:hidden bg-gray-50 pb-20 pt-4">
        <div className="container mx-auto px-4 space-y-4">
          {applications.map((app) => (
            <div key={app.id} id={app.id} className="bg-white rounded p-4 shadow-sm border border-gray-100 flex gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img src={app.image} className="w-full h-full object-cover" alt={t(app.nameKey)} />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#064E3B] mb-1 leading-tight">{t(app.nameKey)}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{t(app.descKey)}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-[#047857] bg-[#047857]/5 px-2 py-0.5 rounded font-medium">
                    {app.id === 'oem' ? 'Service' : 'In Stock'}
                  </span>
                  <Link to={app.id === 'oem' ? `/${currentLang}/oem` : `/${currentLang}/contact`}>
                    <button className="bg-[#047857] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm flex items-center shadow-sm active:scale-95 transition-transform">
                      {app.id === 'oem' ? 'View Details' : 'Inquire'}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop Product Grid (Compact Style) */}
      <section className="hidden lg:block py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.filter(app => app.id !== 'oem').map((app) => (
              <div
                key={app.id}
                className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Compact Image Area */}
                <div className="relative h-72 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      app.id === 'paper' ? '/images/应用领域/paper_roll.jpg' :
                        app.id === 'desiccant' ? '/images/应用领域/desiccant_bag.jpg' :
                          app.image
                    }
                    alt={t(app.nameKey)}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Compact Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#047857] transition-colors">
                    {t(app.nameKey)}
                  </h2>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {t(app.descKey)}
                  </p>

                  <div className="mt-auto space-y-3">
                    {/* Simplified Features List (Max 3 items) */}
                    <ul className="space-y-1">
                      {(t(app.benefitsKey, { returnObjects: true }) as string[]).slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-xs text-gray-600">
                          <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/${currentLang}/products/${app.productCode}`} className="block pt-2">
                      <Button variant="outline" className="w-full border-[#047857] text-[#047857] hover:bg-[#047857] hover:text-white h-9 text-sm font-medium transition-colors">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区 - 行动召唤 */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#064E3B] to-[#047857]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('applications:cta.title')}
          </h2>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
            {t('applications:cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to={`/${currentLang}/contact`}>
              <Button size="lg" className="bg-white text-[#047857] hover:bg-green-50 px-8 py-6 text-lg rounded-sm">
                {t('cta.contact')}
              </Button>
            </Link>
            <Link to={`/${currentLang}/oem`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-sm">
                OEM定制服务
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}







