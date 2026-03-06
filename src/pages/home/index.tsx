import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Play, Leaf, Zap, Layers, Droplets, Check, ShoppingBag, Hammer, Shirt, Brush, FileText, Factory, Grid, Star, Truck, Package, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { getPageContents } from '@/lib/api/content-api';
import { getOEMContentForFrontend } from '@/lib/api/oem-api';
import { COMPANY_PROFILE } from '@/lib/company-profile';
import { SOCIAL_LINKS } from '@/lib/social-links';

interface Product {
  id: number;
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  price_range?: string;
  image_url: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function HomePage() {
  const { t, i18n } = useTranslation(['common', 'home', 'applications']);
  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });
  const [products, setProducts] = useState<Product[]>([]);
  const [rawContentData, setRawContentData] = useState<any[]>([]); // 保存原始数据
  const [pageContent, setPageContent] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  const socialProfileLinks = [
    SOCIAL_LINKS.tiktok,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.whatsapp,
  ].filter(Boolean);

  // 监听语言变化，确保组件重新渲染
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng || 'en');
    };

    i18n.on('languageChanged', handleLanguageChanged);

    // 初始化时也设置一次
    setCurrentLang(i18n.language || 'en');

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // 根据当前语言从原始数据中提取内容
  const processedContent = useMemo(() => {
    if (!rawContentData || rawContentData.length === 0) {
      return {};
    }

    const lang = currentLang || 'en';
    const langKey = `content_${lang}`;
    const contentMap: Record<string, any> = {};

    rawContentData.forEach((item: any) => {
      const contentValue = item[langKey] || item.content_en || item.content_zh || '';

        // 特殊处理OEM图片（根据当前语言选择对应字段）
        if (item.section_key === 'oem_image' ||
          item.section_key === 'oem_images' ||
          item.section_key.startsWith('oem_image')) {
          // 根据当前语言选择对应的图片URL
          const langContent = item[langKey] || item.content_en || item.content_zh || item.content_ru || '';

          if (langContent) {
          try {
            // 尝试解析为JSON数组
            const parsed = JSON.parse(langContent);
            if (Array.isArray(parsed)) {
              contentMap['oem_images'] = parsed;
            } else {
              contentMap['oem_images'] = [parsed];
            }
          } catch {
            // 如果不是JSON，作为单个图片URL处理
            contentMap['oem_images'] = [langContent];
          }
        }
      } else {
        contentMap[item.section_key] = contentValue;
      }

      // 如果是数组内容，尝试解析（根据当前语言选择对应字段）
      if (item.section_key.includes('features') || item.section_key.includes('capabilities') || item.section_key.includes('process')) {
        try {
          const langContent = item[langKey] || item.content_en || item.content_zh || item.content_ru || '';
          contentMap[item.section_key] = JSON.parse(langContent) || langContent.split('\n');
        } catch {
          const langContent = item[langKey] || item.content_en || item.content_zh || item.content_ru || '';
          contentMap[item.section_key] = langContent.split('\n').filter((i: string) => i.trim());
        }
      }
    });

    return contentMap;
  }, [rawContentData, currentLang]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        // 获取首页内容（只获取一次，保存原始数据）
        try {
          const contentData = await getPageContents('home');
          setRawContentData(contentData || []); // 保存原始数据，processedContent会自动更新
        } catch (contentError) {
          console.error('页面内容API调用失败:', contentError);
          setRawContentData([]); // 清空原始数据
        }

        // 获取热门产品 - 修复API调用，添加时间戳绕过缓存
        const cacheBuster = `?limit=3&_t=${Date.now()}`;
        const productsResponse = await fetch(`/api/products${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const productsData = await productsResponse.json();

        if (productsResponse.ok && productsData.success) {
          // API返回成功，使用返回的数据
          setProducts(productsData.data || []);
        } else {
          // API失败，使用模拟数据
          const mockProducts: Product[] = [
            {
              id: 1,
              product_code: 'KARN-WPG-001',
              name_zh: '高强度墙纸胶粉',
              name_en: 'High Strength Wallpaper Adhesive Powder',
              name_ru: 'Высокопрочный клей для обоев в порошке',
              description_zh: '适用于各种墙纸的高强度粘合剂，具有优异的粘接性能和环保特性。',
              description_en: 'High-strength adhesive for various wallpapers with excellent bonding performance and eco-friendly properties.',
              description_ru: 'Высокопрочный клей для различных обоев с отличными адгезионными свойствами и экологичностью。',
              price_range: '¥15-25/包',
              image_url: '/images/product1.jpg',
              category: '墙纸胶粉',
              is_active: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 2,
              product_code: 'KARN-WPG-002',
              name_zh: '环保型墙纸胶粉',
              name_en: 'Eco-friendly Wallpaper Adhesive Powder',
              name_ru: 'Экологичный клей для обоев в порошке',
              description_zh: '采用环保配方，无甲醛，无异味，适合家庭装修使用。',
              description_en: 'Made with eco-friendly formula, formaldehyde-free, odorless, suitable for home decoration.',
              description_ru: 'Изготовлен по экологичной формуле, без формальдегида, без запаха, подходит для домашнего декора.',
              price_range: '¥18-28/包',
              image_url: '/images/product2.jpg',
              category: '墙纸胶粉',
              is_active: true,
              sort_order: 2,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 3,
              product_code: 'KARN-WPG-003',
              name_zh: '快干型墙纸胶粉',
              name_en: 'Quick-dry Wallpaper Adhesive Powder',
              name_ru: 'Быстросохнущий клей для обоев в порошке',
              description_zh: '快速干燥，施工效率高，适合大面积墙纸铺贴工程。',
              description_en: 'Quick drying, high construction efficiency, suitable for large-area wallpaper installation projects.',
              description_ru: 'Быстрое высыхание, высокая эффективность строительства, подходит для проектов установки обоев на больших площадях。',
              price_range: '¥20-30/包',
              image_url: '/images/product3.jpg',
              category: '墙纸胶粉',
              is_active: true,
              sort_order: 3,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          setProducts(mockProducts);
        }

      } catch (error) {
        console.error('❌ 获取数据失败:', error);
        // 设置模拟数据确保页面正常显示
        const mockProducts: Product[] = [
          {
            id: 1,
            product_code: 'KARN-WPG-001',
            name_zh: '高强度墙纸胶粉',
            name_en: 'High Strength Wallpaper Adhesive Powder',
            name_ru: 'Высокопрочный клей для обоев в порошке',
            description_zh: '适用于各种墙纸的高强度粘合剂，具有优异的粘接性能和环保特性。',
            description_en: 'High-strength adhesive for various wallpapers with excellent bonding performance and eco-friendly properties.',
            description_ru: 'Высокопрочный клей для различных обоев с отличными адгезионными свойствами и экологичностью。',
            price_range: '¥15-25/包',
            image_url: '/images/product1.jpg',
            category: '墙纸胶粉',
            is_active: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []); // 只在组件挂载时获取一次数据

  // 当语言或处理后的内容变化时，更新pageContent
  useEffect(() => {
    if (Object.keys(processedContent).length > 0) {
      // 获取OEM内容并合并
      getOEMContentForFrontend(currentLang || 'en')
        .then((oemContent) => {
          const existingOemImages = processedContent['oem_images'];
          const mergedContent = { ...processedContent, ...oemContent };
          // 如果home页面有oem_images，优先使用
          if (existingOemImages && existingOemImages.length > 0) {
            mergedContent['oem_images'] = existingOemImages;
          }
          setPageContent(mergedContent);
        })
        .catch(() => {
          // OEM API失败，只使用processedContent
          setPageContent(processedContent);
        });
    }
  }, [processedContent, currentLang]);

  // 根据当前语言获取产品名称
  const getProductName = (product: Product) => {
    const lang = currentLang || 'en';
    const nameKey = `name_${lang}` as keyof typeof product;
    return (product[nameKey] as string) || product.name_en || product.name_zh;
  };

  // 英雄区背景图片URL
  const heroBackgroundUrl = pageContent.hero_background || '/images/white_powder_chemical_building_material_display.jpg';

  return (
    <>
      <SEOHelmet
        title={i18n.language === 'zh'
          ? '羧甲基淀粉CMS专业生产商 - 杭州卡恩新型建材有限公司'
          : i18n.language === 'en'
            ? 'Professional Carboxymethyl Starch CMS Manufacturer - Hangzhou Karn'
            : t('nav.home')}
        description={pageContent.meta_description || t('home:meta_description')}
        keywords={t('home:keywords') + ", high strength wallpaper adhesive, eco-friendly wallpaper glue, professional wallcovering adhesive, 强力墙纸胶粉, 环保墙纸胶, 专业墙纸粘合剂, клей для обоев усиленный, экологичный обойный клей"}
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image="/images/IMG_1412.jpg"
        logo="/images/logo.png"
      />
      <StructuredData
        schema={{
          type: 'Organization',
          name: 'Hangzhou Karn New Building Materials Co., Ltd',
          alternateName: '浙江卡恩新型建材有限公司',
          description: pageContent.meta_description || t('home:meta_description'),
          url: 'https://kn-wallpaperglue.com',
          logo: '/images/logo.png',
          image: '/images/IMG_1515.JPG',
          telephone: '+86-13216156841',
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
          type: 'WebSite',
          name: 'Hangzhou Karn New Building Materials Co., Ltd',
          url: 'https://kn-wallpaperglue.com',
          logo: '/images/logo.png',
        }}
      />

      {/* 英雄区域 (Banner) - B2B 工厂看板风格 */}
      <section className="home-hero relative py-0 flex items-center overflow-hidden">
        {/* 背景图片 */}
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
              alt={t('home:hero.company_alt')}
              className="w-full h-full object-cover object-bottom"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="100vw"
              width={1440}
              height={1080}
            />
          </picture>
        </div>

        {/* 渐变覆盖层 - 增加专业感 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 to-transparent z-10"></div>

        <div className="container mx-auto px-4 relative z-30 h-full flex flex-col justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex flex-col items-start lg:space-y-8">
              {/* Mobile Factory Identity */}
              <div className="lg:hidden flex items-center space-x-2 mb-2 bg-white/10 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                <Factory className="w-3 h-3 text-[#10B981]" />
                <span className="text-white text-xs uppercase tracking-wider font-medium">
                  {tr('home:mobile.source_factory', 'Source Factory')}
                </span>
              </div>

              <h1 className="text-xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-2 lg:mb-0">
                <span className="block">{pageContent.hero_title || t('home:hero.title')}</span>
              </h1>
              <p className="hidden lg:block text-green-100 text-xl leading-relaxed max-w-xl">
                {pageContent.hero_subtitle || t('home:hero.subtitle')}
              </p>

              {/* Mobile Trust Badges */}
              <div className="lg:hidden flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-white/80 bg-black/20 px-2 py-0.5 rounded flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-[#10B981]" /> {tr('home:mobile.trust_years', '15+ Years')}
                </span>
                <span className="text-xs text-white/80 bg-black/20 px-2 py-0.5 rounded flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-[#10B981]" /> ISO 9001
                </span>
                <span className="text-xs text-white/80 bg-black/20 px-2 py-0.5 rounded flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-[#10B981]" /> {tr('home:mobile.trust_shipping', 'Global Shipping')}
                </span>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex flex-row gap-5 mt-4">
                <Button asChild size="lg" className="bg-[#10B981] text-white hover:bg-[#059669] px-8 py-6 text-lg rounded-sm">
                  <Link to={`/${currentLang}/products`}>{t('cta.view_products')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-sm">
                  <Link to={`/${currentLang}/contact`}>{t('cta.contact')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Factory Capability Stats (The "Trust" Row) */}
      <section className="bg-white border-b border-gray-100 lg:hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="p-3 text-center">
            <div className="text-[#047857] font-bold text-lg">2010</div>
            <div className="text-xs text-gray-600">{t('home:stats.years.description') || tr('home:mobile.established', 'Established')}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[#047857] font-bold text-lg">45+</div>
            <div className="text-xs text-gray-600">{tr('home:mobile.export_countries', 'Export Countries')}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[#047857] font-bold text-lg">100%</div>
            <div className="text-xs text-gray-600">{tr('home:mobile.quality_assured', 'Quality Assured')}</div>
          </div>
        </div>
      </section>

      {/* Mobile Category Dashboard (Grid Navigation) */}
      <section className="bg-gray-50 py-4 lg:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{tr('home:mobile.product_catalog', 'Product Catalog')}</h2>
            <Link to={`/${currentLang}/applications`} className="text-xs text-[#047857] font-medium flex items-center">
              {tr('home:mobile.all_products', 'All Products')} <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Wallpaper Adhesive */}
            <Link to={`/${currentLang}/products/wallpaper-adhesive`} className="group bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#047857]/50 transition-colors">
              <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#047857] transition-colors">
                <Package className="w-5 h-5 text-[#047857] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('nav.wallpaper_glue')}</span>
              <span className="text-xs text-gray-600 mt-1">{tr('home:mobile.wallpaper_hint', 'High Strength / Eco')}</span>
            </Link>

            {/* Construction Grade */}
            <Link to={`/${currentLang}/products/construction-cms`} className="group bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#047857]/50 transition-colors">
              <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#047857] transition-colors">
                <Hammer className="w-5 h-5 text-[#047857] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('home:applications.construction.title')}</span>
              <span className="text-xs text-gray-600 mt-1">{tr('home:mobile.construction_hint', 'Putty / Mortar Additive')}</span>
            </Link>

            {/* Textile Grade */}
            <Link to={`/${currentLang}/products/textile-cms`} className="group bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#047857]/50 transition-colors">
              <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#047857] transition-colors">
                <Shirt className="w-5 h-5 text-[#047857] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('home:applications.textile.title')}</span>
              <span className="text-xs text-gray-600 mt-1">{tr('home:mobile.textile_hint', 'Sizing / Printing')}</span>
            </Link>

            {/* Coating Grade */}
            <Link to={`/${currentLang}/products/coating-cms`} className="group bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#047857]/50 transition-colors">
              <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#047857] transition-colors">
                <Brush className="w-5 h-5 text-[#047857] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('home:applications.coating.title')}</span>
              <span className="text-xs text-gray-600 mt-1">{tr('home:mobile.coating_hint', 'Water-based Paint')}</span>
            </Link>

            {/* Paper Grade */}
            <Link to={`/${currentLang}/products/paper-dyeing-cms`} className="group bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#047857]/50 transition-colors">
              <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#047857] transition-colors">
                <FileText className="w-5 h-5 text-[#047857] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('home:applications.paper.title')}</span>
              <span className="text-xs text-gray-600 mt-1">{tr('home:mobile.paper_hint', 'Wet End / Coating')}</span>
            </Link>

            {/* Desiccant */}
            <Link to={`/${currentLang}/products/desiccant-gel`} className="group bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-[#047857]/50 transition-colors">
              <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#047857] transition-colors">
                <Droplets className="w-5 h-5 text-[#047857] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('home:applications.desiccant.title')}</span>
              <span className="text-xs text-gray-600 mt-1">{tr('home:mobile.desiccant_hint', 'Moisture Control')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Factory Info Preview (Mobile) - Replaces Product Feed */}
      <section className="bg-white py-6 lg:hidden border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">{tr('home:mobile.factory_overview', 'Factory Overview')}</h2>
          <div className="bg-gray-50 rounded p-4 border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-white rounded border border-gray-200 p-1 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{t('header.company_name')}</h4>
                <p className="text-xs text-gray-600">{tr('home:mobile.factory_meta', 'Est. 2010 · Hangzhou, China')}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-3">
              {t('footer.company_brief')}
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs border-gray-300">
                <Link to={`/${currentLang}/about`}>{tr('home:mobile.view_profile', 'View Profile')}</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 h-8 text-xs bg-[#047857] hover:bg-[#064E3B]">
                <Link to={`/${currentLang}/contact`}>{tr('home:mobile.contact_us', 'Contact Us')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Sections (Hidden on Mobile) */}
      <section className="hidden lg:block py-20 md:py-28 bg-white industrial-bg cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* 工业风格标题区 */}
          <div className="mb-10 md:mb-16 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-1 bg-[#047857]"></div>
              <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:applications.badge')}</span>
              <div className="w-8 h-1 bg-[#047857]"></div>
            </div>

            <h2 className="industrial-title text-2xl md:text-4xl font-bold text-[#064E3B] mb-4 md:mb-6">
              {t('home:applications.title')}
            </h2>

            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
              {t('home:applications.subtitle')}
            </p>
          </div>

          {/* 6大应用领域卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
            {/* 纺织印染 */}
            <div className="group bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-[#047857]/40 flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/应用领域/纺织印染.webp"
                  srcSet="/images/应用领域/纺织印染-480.webp 480w, /images/应用领域/纺织印染-640.webp 640w, /images/应用领域/纺织印染.webp 1200w"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  alt="纺织印染应用"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-all"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors mb-2 md:mb-3 line-clamp-2 min-h-[3.5rem]">
                  {t('home:applications.textile.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 min-h-[2.5rem]">
                  {t('home:applications.textile.description')}
                </p>
                <ul className="space-y-1 mb-4 min-h-[3.75rem]">
                  {(t('applications:textile.features', { returnObjects: true }) as string[]).slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${currentLang}/products/textile-cms`}
                  className="mt-auto inline-flex items-center justify-center w-full rounded-md border border-[#047857]/25 bg-[#047857]/5 py-2 text-sm font-medium text-[#047857] transition-colors hover:bg-[#047857]/10"
                >
                  {t('common:nav.view_applications')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 建筑材料 */}
            <div className="group bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-[#047857]/40 flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/应用领域/腻子粉.webp"
                  srcSet="/images/应用领域/腻子粉-480.webp 480w, /images/应用领域/腻子粉-640.webp 640w, /images/应用领域/腻子粉.webp 1200w"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  alt="建筑材料应用"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-all"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors mb-2 md:mb-3 line-clamp-2 min-h-[3.5rem]">
                  {t('home:applications.construction.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 min-h-[2.5rem]">
                  {t('home:applications.construction.description')}
                </p>
                <ul className="space-y-1 mb-4 min-h-[3.75rem]">
                  {(t('applications:construction.features', { returnObjects: true }) as string[]).slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${currentLang}/products/construction-cms`}
                  className="mt-auto inline-flex items-center justify-center w-full rounded-md border border-[#047857]/25 bg-[#047857]/5 py-2 text-sm font-medium text-[#047857] transition-colors hover:bg-[#047857]/10"
                >
                  {t('common:nav.view_applications')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 涂料工业 */}
            <div className="group bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-[#047857]/40 flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/应用领域/水性涂料.webp"
                  srcSet="/images/应用领域/水性涂料-480.webp 480w, /images/应用领域/水性涂料-640.webp 640w, /images/应用领域/水性涂料.webp 1200w"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  alt="涂料工业应用"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-all"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors mb-2 md:mb-3 line-clamp-2 min-h-[3.5rem]">
                  {t('home:applications.coating.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 min-h-[2.5rem]">
                  {t('home:applications.coating.description')}
                </p>
                <ul className="space-y-1 mb-4 min-h-[3.75rem]">
                  {(t('applications:coating.features', { returnObjects: true }) as string[]).slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${currentLang}/products/coating-cms`}
                  className="mt-auto inline-flex items-center justify-center w-full rounded-md border border-[#047857]/25 bg-[#047857]/5 py-2 text-sm font-medium text-[#047857] transition-colors hover:bg-[#047857]/10"
                >
                  {t('common:nav.view_applications')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 染纸工业 */}
            <div className="group bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-[#047857]/40 flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/应用领域/paper_roll_v2.webp"
                  srcSet="/images/应用领域/paper_roll_v2-480.webp 480w, /images/应用领域/paper_roll_v2-640.webp 640w, /images/应用领域/paper_roll_v2.webp 1200w"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  alt="染纸工业应用"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-all"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors mb-2 md:mb-3 line-clamp-2 min-h-[3.5rem]">
                  {t('home:applications.paper.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 min-h-[2.5rem]">
                  {t('home:applications.paper.description')}
                </p>
                <ul className="space-y-1 mb-4 min-h-[3.75rem]">
                  {(t('applications:paper.features', { returnObjects: true }) as string[]).slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${currentLang}/products/paper-dyeing-cms`}
                  className="mt-auto inline-flex items-center justify-center w-full rounded-md border border-[#047857]/25 bg-[#047857]/5 py-2 text-sm font-medium text-[#047857] transition-colors hover:bg-[#047857]/10"
                >
                  {t('common:nav.view_applications')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 墙纸胶 */}
            <div className="group bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-[#047857]/40 flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/应用领域/墙纸胶.webp"
                  srcSet="/images/应用领域/墙纸胶-480.webp 480w, /images/应用领域/墙纸胶-640.webp 640w, /images/应用领域/墙纸胶.webp 1200w"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  alt="墙纸胶应用"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-all"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors mb-2 md:mb-3 line-clamp-2 min-h-[3.5rem]">
                  {t('home:applications.wallpaper.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 min-h-[2.5rem]">
                  {t('home:applications.wallpaper.description')}
                </p>
                <ul className="space-y-1 mb-4 min-h-[3.75rem]">
                  {(t('applications:wallpaper.features', { returnObjects: true }) as string[]).slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${currentLang}/products/wallpaper-adhesive`}
                  className="mt-auto inline-flex items-center justify-center w-full rounded-md border border-[#047857]/25 bg-[#047857]/5 py-2 text-sm font-medium text-[#047857] transition-colors hover:bg-[#047857]/10"
                >
                  {t('common:nav.view_applications')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 干燥剂 */}
            <div className="group bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-[#047857]/40 flex flex-col h-full">
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/应用领域/desiccant_bag_v2.webp"
                  srcSet="/images/应用领域/desiccant_bag_v2-480.webp 480w, /images/应用领域/desiccant_bag_v2-640.webp 640w, /images/应用领域/desiccant_bag_v2.webp 1200w"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  alt="干燥剂应用"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-all"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors mb-2 md:mb-3 line-clamp-2 min-h-[3.5rem]">
                  {t('home:applications.desiccant.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 min-h-[2.5rem]">
                  {t('home:applications.desiccant.description')}
                </p>
                <ul className="space-y-1 mb-4 min-h-[3.75rem]">
                  {(t('applications:desiccant.features', { returnObjects: true }) as string[]).slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-[#10B981] mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${currentLang}/products/desiccant-gel`}
                  className="mt-auto inline-flex items-center justify-center w-full rounded-md border border-[#047857]/25 bg-[#047857]/5 py-2 text-sm font-medium text-[#047857] transition-colors hover:bg-[#047857]/10"
                >
                  {t('common:nav.view_applications')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 查看全部按钮 */}
          <div className="mt-12 md:mt-16 text-center">
            <Button asChild size="lg" className="bg-[#047857] text-white hover:bg-[#059669] w-full sm:w-auto px-10 py-7 text-lg rounded-sm group">
              <Link to={`/${currentLang}/applications`}>
                {t('common:nav.view_applications')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 数据统计区 - 工业风格 */}
      <section className="hidden lg:block py-20 md:py-28 bg-gradient-to-br from-[#064E3B] to-[#047857] relative overflow-hidden cv-auto">
        {/* 装饰性工业网格 */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 标题区 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#064E3B] px-4 py-1.5 rounded-sm mb-4">
              <div className="w-2 h-2 bg-[#10B981] rotate-45"></div>
              <span className="text-white text-sm font-medium tracking-wider uppercase">{t('home:stats.badge')}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home:stats.title')}
            </h2>

            <p className="text-green-100 text-lg max-w-3xl mx-auto">
              {t('home:stats.subtitle')}
            </p>
          </div>

          {/* 数据网格 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 生产经验 */}
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-sm p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-[#10B981] mb-3">
                  {t('home:stats.years.value')}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {t('home:stats.years.label')}
                </div>
                <div className="text-sm text-green-100">
                  {t('home:stats.years.description')}
                </div>
              </div>
            </div>

            {/* 产品型号 */}
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-sm p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-[#10B981] mb-3">
                  {t('home:stats.products.value')}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {t('home:stats.products.label')}
                </div>
                <div className="text-sm text-green-100">
                  {t('home:stats.products.description')}
                </div>
              </div>
            </div>

            {/* 应用领域 */}
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-sm p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-[#10B981] mb-3">
                  {t('home:stats.applications.value')}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {t('home:stats.applications.label')}
                </div>
                <div className="text-sm text-green-100">
                  {t('home:stats.applications.description')}
                </div>
              </div>
            </div>

            {/* 质量检测 */}
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-sm p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-[#10B981] mb-3">
                  {t('home:stats.quality.value')}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {t('home:stats.quality.label')}
                </div>
                <div className="text-sm text-green-100">
                  {t('home:stats.quality.description')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 演示视频区 - 工业风格 */}
      <section className="hidden lg:block py-20 md:py-28 bg-[#F9FAFB] cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-16">
            {/* 左侧视频区域 */}
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="relative rounded-sm overflow-hidden shadow-xl">
                {/* 工业风格装饰框 */}
                <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[#047857] z-10"></div>
                <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-[#047857] z-10"></div>

                {/* 视频播放器 */}
                <div className="aspect-video w-full bg-black relative z-0">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/JJ8y8gjfpHY"
                    title={pageContent.video_title || t('home:video.title')}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* 工业化粒子效果底部条 */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#10B981]"></div>
              </div>
            </div>

            {/* 右侧内容区域 */}
            <div className="md:w-1/2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-1 bg-[#047857]"></div>
                <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:video.badge')}</span>
              </div>

              <h2 className="industrial-title text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
                {pageContent.video_title || t('home:video.title')}
              </h2>

              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {pageContent.video_subtitle || t('home:video.subtitle')}
              </p>

              {/* 工业风格特点列表 */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-sm bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#064E3B]">{t('home:video.features.mixing.title')}</h4>
                    <p className="text-gray-600">{t('home:video.features.mixing.description')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-sm bg-[#10B981] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#064E3B]">{t('home:video.features.application.title')}</h4>
                    <p className="text-gray-600">{t('home:video.features.application.description')}</p>
                  </div>
                </div>
              </div>

              <Button asChild className="bg-[#047857] hover:bg-[#064E3B] text-white rounded-sm px-8 py-6 text-lg transition-colors">
                <Link to={`/${currentLang}/products`}>
                  {t('home:video.explore_products')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 产品核心优势区 - 工业风格 */}
      <section className="hidden lg:block py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden cv-auto">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#047857] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#064E3B] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 标题区 */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-1 bg-[#047857]"></div>
              <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:advantages.badge')}</span>
              <div className="w-8 h-1 bg-[#047857]"></div>
            </div>

            <h2 className="industrial-title text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
              {t('home:advantages.title')}
            </h2>

            <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-lg">
              {t('home:advantages.subtitle')}
            </p>
          </div>

          {/* 优势卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 环保安全 */}
            <div className="group relative bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              {/* 装饰性数字 */}
              <div className="absolute top-4 right-4 text-7xl font-bold text-[#047857]/5 group-hover:text-[#047857]/10 transition-colors">
                01
              </div>

              <div className="relative z-10">
                {/* 图标和徽章 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#047857] to-[#064E3B] flex items-center justify-center shadow-lg">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    {t('home:advantages.eco_friendly.badge')}
                  </span>
                </div>

                {/* 标题 */}
                <h3 className="text-2xl font-bold text-[#064E3B] mb-3 group-hover:text-[#047857] transition-colors">
                  {t('home:advantages.eco_friendly.title')}
                </h3>

                {/* 描述 */}
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {t('home:advantages.eco_friendly.description')}
                </p>

                {/* 特点列表 */}
                <ul className="space-y-3">
                  {(t('home:advantages.eco_friendly.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-[#047857] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 装饰性底部线条 */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#047857] to-[#10B981] group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* 高性能 */}
            <div className="group relative bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-4 right-4 text-7xl font-bold text-[#047857]/5 group-hover:text-[#047857]/10 transition-colors">
                02
              </div>

              <div className="relative z-10">
                {/* 图标和徽章 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#047857] to-[#064E3B] flex items-center justify-center shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-green-50 text-[#047857] text-xs font-semibold rounded-full border border-green-200">
                    {t('home:advantages.high_performance.badge')}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#064E3B] mb-3 group-hover:text-[#047857] transition-colors">
                  {t('home:advantages.high_performance.title')}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {t('home:advantages.high_performance.description')}
                </p>

                {/* 特点列表 */}
                <ul className="space-y-3">
                  {(t('home:advantages.high_performance.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-[#047857] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#047857] to-[#10B981] group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* 多功能性 */}
            <div className="group relative bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-4 right-4 text-7xl font-bold text-[#047857]/5 group-hover:text-[#047857]/10 transition-colors">
                03
              </div>

              <div className="relative z-10">
                {/* 图标和徽章 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#047857] to-[#064E3B] flex items-center justify-center shadow-lg">
                    <Layers className="h-8 w-8 text-white" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-green-50 text-[#047857] text-xs font-semibold rounded-full border border-green-200">
                    {t('home:advantages.multi_functional.badge')}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#064E3B] mb-3 group-hover:text-[#047857] transition-colors">
                  {t('home:advantages.multi_functional.title')}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {t('home:advantages.multi_functional.description')}
                </p>

                {/* 特点列表 */}
                <ul className="space-y-3">
                  {(t('home:advantages.multi_functional.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-[#047857] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#047857] to-[#10B981] group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* 易溶解 */}
            <div className="group relative bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-4 right-4 text-7xl font-bold text-[#047857]/5 group-hover:text-[#047857]/10 transition-colors">
                04
              </div>

              <div className="relative z-10">
                {/* 图标和徽章 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#047857] to-[#064E3B] flex items-center justify-center shadow-lg">
                    <Droplets className="h-8 w-8 text-white" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-green-50 text-[#047857] text-xs font-semibold rounded-full border border-green-200">
                    {t('home:advantages.easy_to_use.badge')}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#064E3B] mb-3 group-hover:text-[#047857] transition-colors">
                  {t('home:advantages.easy_to_use.title')}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {t('home:advantages.easy_to_use.description')}
                </p>

                {/* 特点列表 */}
                <ul className="space-y-3">
                  {(t('home:advantages.easy_to_use.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-[#047857] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#047857] to-[#10B981] group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 为什么选择我们 - 工业风格 */}
      <section className="py-20 md:py-28 bg-white industrial-bg cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* 工业风格标题区 */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-[#047857] rotate-45"></div>
              <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:why_us.badge')}</span>
              <div className="w-3 h-3 bg-[#047857] rotate-45"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
              {pageContent.why_us_title || t('home:why_us.title')}
            </h2>

            <div className="mx-auto max-w-2xl relative">
              <p className="text-gray-600 leading-relaxed text-lg">
                {pageContent.why_us_subtitle || t('home:why_us.subtitle')}
              </p>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#10B981]"></div>
            </div>
          </div>

          {/* 工业风格优势卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* 优势点 1 */}
            <div className="bg-white p-8 rounded-sm shadow-md relative group hover:shadow-lg transition-all border-t border-l border-gray-100 overflow-hidden">
              {/* 侧边装饰条 */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#047857] group-hover:w-2 transition-all"></div>

              {/* 装饰性底部线条 */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#10B981] group-hover:w-full transition-all duration-300"></div>

              {/* 图标区 */}
              <div className="w-16 h-16 rounded-sm bg-[#047857]/10 flex items-center justify-center mb-6 group-hover:bg-[#047857]/20 transition-colors">
                <div className="w-10 h-10 rounded-sm bg-[#047857] flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#064E3B] mb-4 group-hover:text-[#047857] transition-colors">{t('home:why_us.quality.title')}</h3>
              <p className="text-gray-600">{t('home:why_us.quality.description')}</p>
            </div>

            {/* 优势点 2 */}
            <div className="bg-white p-8 rounded-sm shadow-md relative group hover:shadow-lg transition-all border-t border-l border-gray-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#047857] group-hover:w-2 transition-all"></div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#10B981] group-hover:w-full transition-all duration-300"></div>

              <div className="w-16 h-16 rounded-sm bg-[#047857]/10 flex items-center justify-center mb-6 group-hover:bg-[#047857]/20 transition-colors">
                <div className="w-10 h-10 rounded-sm bg-[#047857] flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#064E3B] mb-4 group-hover:text-[#047857] transition-colors">{t('home:why_us.experience.title')}</h3>
              <p className="text-gray-600">{t('home:why_us.experience.description')}</p>
            </div>

            {/* 优势点 3 */}
            <div className="bg-white p-8 rounded-sm shadow-md relative group hover:shadow-lg transition-all border-t border-l border-gray-100 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#047857] group-hover:w-2 transition-all"></div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#10B981] group-hover:w-full transition-all duration-300"></div>

              <div className="w-16 h-16 rounded-sm bg-[#047857]/10 flex items-center justify-center mb-6 group-hover:bg-[#047857]/20 transition-colors">
                <div className="w-10 h-10 rounded-sm bg-[#047857] flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#064E3B] mb-4 group-hover:text-[#047857] transition-colors">{t('home:why_us.service.title')}</h3>
              <p className="text-gray-600">{t('home:why_us.service.description')}</p>
            </div>
          </div>

          {/* 工业风格装饰性分隔线 */}
          <div className="industrial-divider mx-auto w-1/2 mt-16"></div>
        </div>
      </section>

      {/* 行动召唤区 CTA - 工业风格 */}
      <section className="py-20 md:py-28 relative overflow-hidden cv-auto">
        {/* 背景图片 */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/IMG_3247.webp"
            alt={t('home:cta.image_alt')}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 渐变覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B]/95 via-[#047857]/90 to-[#064E3B]/85 z-10"></div>

        {/* 装饰性网格引导线 */}
        <div className="absolute inset-0 z-20 opacity-10">
          <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="max-w-4xl mx-auto text-center">
            {/* 装饰性图形 */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-12 h-1 bg-[#10B981]"></div>
              <div className="w-3 h-3 bg-[#10B981] mx-2 rotate-45"></div>
              <div className="w-12 h-1 bg-[#10B981]"></div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              {pageContent.cta_title || t('home:cta.title')}
            </h2>

            <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              {pageContent.cta_description || t('home:cta.description')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Button asChild size="lg" className="bg-white text-[#047857] hover:bg-green-50 px-10 py-7 text-lg rounded-sm">
                <Link to={`/${currentLang}/contact`}>
                  {t('cta.contact')}
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-sm">
                <Link to={`/${currentLang}/products`}>
                  {t('home:cta.browse_products')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* 装饰性底部图形 */}
            <div className="mt-16 inline-flex items-center justify-center">
              <div className="w-20 h-0.5 bg-[#10B981]/40"></div>
              <div className="w-2 h-2 bg-[#10B981] mx-2 rotate-45"></div>
              <div className="w-20 h-0.5 bg-[#10B981]/40"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
