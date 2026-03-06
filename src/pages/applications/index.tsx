import { useTranslation } from 'react-i18next';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
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
    image: '/images/应用领域/纺织印染.webp',
  },
  {
    id: 'construction',
    nameKey: 'applications:construction.title',
    descKey: 'applications:construction.description',
    scenariosKey: 'applications:construction.applications',
    benefitsKey: 'applications:construction.features',
    productCode: 'construction-cms',
    image: '/images/应用领域/腻子粉.webp',
  },
  {
    id: 'coating',
    nameKey: 'applications:coating.title',
    descKey: 'applications:coating.description',
    scenariosKey: 'applications:coating.applications',
    benefitsKey: 'applications:coating.features',
    productCode: 'coating-cms',
    image: '/images/应用领域/水性涂料.webp',
  },
  {
    id: 'paper',
    nameKey: 'applications:paper.title',
    descKey: 'applications:paper.description',
    scenariosKey: 'applications:paper.applications',
    benefitsKey: 'applications:paper.features',
    productCode: 'paper-dyeing-cms',
    image: '/images/应用领域/paper_roll_v2.webp',
  },
  {
    id: 'wallpaper',
    nameKey: 'applications:wallpaper.title',
    descKey: 'applications:wallpaper.description',
    scenariosKey: 'applications:wallpaper.applications',
    benefitsKey: 'applications:wallpaper.features',
    productCode: 'wallpaper-adhesive',
    image: '/images/应用领域/墙纸胶.webp',
  },
  {
    id: 'desiccant',
    nameKey: 'applications:desiccant.title',
    descKey: 'applications:desiccant.description',
    scenariosKey: 'applications:desiccant.applications',
    benefitsKey: 'applications:desiccant.features',
    productCode: 'desiccant-gel',
    image: '/images/应用领域/desiccant_bag_v2.webp',
  },
  {
    id: 'oem',
    nameKey: 'nav.oem', // reusing nav key for brevity, or add specific key
    descKey: 'applications:cta.description', // reusing description
    scenariosKey: 'applications:wallpaper.applications', // placeholder, will use simplified logic if needed
    benefitsKey: 'applications:wallpaper.features',
    productCode: 'oem-service',
    image: '/images/5fbd3f1a-5077-4ecb-8f50-008dab912740.webp', // Hero image or specific OEM image
    isService: true, // Flag to handle specific link logic if needed
  },
];

const getAppImageSrcSet = (src: string) => {
  if (!src.endsWith('.webp')) return undefined;
  return `${src.replace('.webp', '-480.webp')} 480w, ${src.replace('.webp', '-640.webp')} 640w, ${src} 1200w`;
};

const getAppHighlights = (items: string[], description: string, limit: number): string[] => {
  const normalizedItems = (items || []).filter(Boolean);
  if (normalizedItems.length > 0) {
    return normalizedItems.slice(0, limit);
  }

  return (description || '')
    .split(/[。；;，,\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 4)
    .slice(0, limit);
};

export default function ApplicationsPage() {
  const { t, i18n } = useTranslation(['common', 'applications', 'home']);
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

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-4">
        <BreadcrumbNavigation />
      </div>

      {/* Hero Section (Responsive) */}
      <section id="top" className="relative py-0 h-[150px] lg:h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/images/5fbd3f1a-5077-4ecb-8f50-008dab912740-768.webp"
              type="image/webp"
            />
            <source
              srcSet="/images/5fbd3f1a-5077-4ecb-8f50-008dab912740-1200.webp"
              type="image/webp"
            />
            <img
              src="/images/5fbd3f1a-5077-4ecb-8f50-008dab912740-1200.webp"
              alt={t('applications:hero.alt')}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="100vw"
              width={1440}
              height={1080}
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 via-[#047857]/85 to-[#064E3B]/80 z-10"></div>
        <div className="container mx-auto px-4 relative z-30">
          <div className="max-w-3xl">
            {/* Simplified Mobile Hero Content */}
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-white leading-tight mb-1">
                {t('applications:hero.title')}
              </h1>
              <p className="text-green-100 text-xs opacity-90">
                {t('home:stats.years.description', { defaultValue: 'Since 2010' })}
              </p>
            </div>

            {/* Desktop Content */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-sm mb-2 border border-white/20">
                <span className="text-white text-xs uppercase tracking-wider font-bold">{t('nav.applications')}</span>
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
              {t('nav.applications')}
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
          {applications.map((app) => {
            const benefitList = t(app.benefitsKey, { returnObjects: true }) as string[];
            const mobileHighlights = getAppHighlights(benefitList, t(app.descKey), 2);

            return (
              <div key={app.id} id={app.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex gap-2.5">
                {/* Thumbnail */}
                <div className="w-[4.5rem] h-[4.5rem] bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                  <img
                    src={app.image}
                    srcSet={app.id !== 'oem' ? getAppImageSrcSet(app.image) : undefined}
                    sizes="72px"
                    className="w-full h-full object-contain p-1.5"
                    alt={t(app.nameKey)}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-sm font-bold text-[#064E3B] mb-1 leading-tight line-clamp-2">{t(app.nameKey)}</h3>
                    {app.id !== 'oem' && mobileHighlights.length > 0 ? (
                      <ul className="space-y-0.5 mt-1">
                        {mobileHighlights.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <CheckCircle2 className="w-3 h-3 text-[#10B981] mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{t(app.descKey)}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#047857] bg-[#047857]/5 px-2 py-0.5 rounded font-medium">
                      {app.id === 'oem' ? t('nav.oem') : t('nav.applications')}
                    </span>
                    <Link to={app.id === 'oem' ? `/${currentLang}/oem` : `/${currentLang}/products/${app.productCode}`}>
                      <button
                        className="bg-[#047857] text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center shadow-sm active:scale-95 transition-transform"
                        aria-label={`${t('cta.learn_more')} ${t(app.nameKey)}`}
                        title={`${t('cta.learn_more')} ${t(app.nameKey)}`}
                      >
                        {t('cta.learn_more')}
                        <span className="sr-only"> {t(app.nameKey)}</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden border-b border-gray-100">
                  <img
                    src={app.image}
                    srcSet={getAppImageSrcSet(app.image)}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                    alt={t(app.nameKey)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-2 transition-transform duration-300"
                  />
                </div>

                {/* Compact Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2 inline-flex w-fit items-center rounded bg-[#047857]/10 px-2 py-1 text-xs font-semibold text-[#047857]">
                    {t('nav.applications')}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#047857] transition-colors line-clamp-2 min-h-[3.5rem]">
                    {t(app.nameKey)}
                  </h2>

                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] mb-4">
                    {t(app.descKey)}
                  </p>

                  <div className="mt-auto space-y-3">
                    {/* Simplified Features List (Max 3 items) */}
                    <ul className="space-y-1 min-h-[4.25rem]">
                      {getAppHighlights(t(app.benefitsKey, { returnObjects: true }) as string[], t(app.descKey), 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-xs text-gray-700">
                          <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/${currentLang}/products/${app.productCode}`} className="block pt-2">
                      <Button
                        variant="outline"
                        className="w-full border-[#047857]/25 bg-[#047857]/5 text-[#047857] hover:bg-[#047857]/10 h-9 text-sm font-medium transition-colors"
                        aria-label={`${t('cta.learn_more')} ${t(app.nameKey)}`}
                        title={`${t('cta.learn_more')} ${t(app.nameKey)}`}
                      >
                        {t('cta.learn_more')}
                        <span className="sr-only"> {t(app.nameKey)}</span>
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
                {t('nav.oem')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
