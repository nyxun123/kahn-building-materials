import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getPageContents } from '@/lib/api/content-api';
import { getOEMContentForFrontend } from '@/lib/api/oem-api';

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
  const { t, i18n } = useTranslation(['common', 'home']);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      try {
        // 获取首页内容
        try {
          const contentData = await getPageContents('home');
          // 整理页面内容数据
          const contentMap: Record<string, any> = {}
          contentData?.forEach((item: any) => {
            const lang = i18n.language || 'en';
            const langKey = `content_${lang}`;
            const contentValue = item[langKey] || item.content_en || item.content_zh || '';
            
            // 特殊处理OEM图片
            if (item.section_key === 'oem_image') {
              contentMap['oem_images'] = [contentValue];
            } else {
              contentMap[item.section_key] = contentValue;
            }
            
            // 如果是数组内容，尝试解析
            if (item.section_key.includes('features') || item.section_key.includes('capabilities') || item.section_key.includes('process') || item.section_key.includes('images')) {
              try {
                contentMap[item.section_key] = JSON.parse(item.content_zh) || item.content_zh.split('\n');
              } catch {
                contentMap[item.section_key] = item.content_zh.split('\n').filter((i: string) => i.trim());
              }
            }
          });
          
          // 获取OEM内容
          try {
            const oemContent = await getOEMContentForFrontend();
            Object.assign(contentMap, oemContent);
          } catch (oemError) {
            console.log('OEM内容API不可用，使用默认内容');
          }
          
          setPageContent(contentMap);
        } catch (contentError) {
          console.log('页面内容API不可用，使用默认内容');
          
          // 获取OEM内容作为默认值
          const oemContent = await getOEMContentForFrontend().catch(() => ({}));
          
          setPageContent({
            hero_title: t('home:hero.title'),
            hero_subtitle: t('home:hero.subtitle'),
            products_title: t('home:products.title'),
            products_subtitle: t('home:products.subtitle'),
            video_title: t('home:video.title'),
            video_subtitle: t('home:video.subtitle'),
            video_url: t('home:video.url'),
            oem_title: t('home:oem.title'),
            oem_description: t('home:oem.description'), // Updated from oem_subtitle
            oem_images: ['/images/oem_manufacturing_custom_packaging_uv_stickers.jpg'],
            semi_title: t('home:semi.title'),
            semi_subtitle: t('home:semi.description'),
            why_us_title: t('home:why_us.title'),
            why_us_subtitle: t('home:why_us.subtitle'),
            cta_title: t('home:cta.title'),
            cta_description: t('home:cta.description'),
            ...oemContent
          });
        }
        
        // 获取热门产品 - 修复API调用
        const productsResponse = await fetch('/api/products?limit=3');
        const productsData = await productsResponse.json();
        
        if (productsResponse.ok && productsData.success) {
          // API返回成功，使用返回的数据
          setProducts(productsData.data || []);
          console.log('✅ 产品数据加载成功:', productsData.data?.length || 0, '条产品');
        } else {
          // API失败，使用模拟数据
          console.log('⚠️ API不可用，使用模拟数据');
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
        // 获取OEM内容作为默认值
        const oemContent = await getOEMContentForFrontend().catch(() => ({}));
        setProducts(mockProducts);
        setPageContent({
          hero_title: t('home:hero.title'),
          hero_subtitle: t('home:hero.subtitle'),
          video_title: t('home:video.title'),
          video_subtitle: t('home:video.subtitle'),
          video_url: t('home:video.url'),
          oem_title: t('home:oem.title'),
          oem_description: t('home:oem.description'), // Updated from oem_subtitle
          oem_images: ['/images/oem_manufacturing_custom_packaging_uv_stickers.jpg'],
          semi_title: t('home:semi.title'),
          semi_subtitle: t('home:semi.description'),
          why_us_title: t('home:why_us.title'),
          why_us_subtitle: t('home:why_us.subtitle'),
          cta_title: t('home:cta.title'),
          cta_description: t('home:cta.description'),
          ...oemContent
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [i18n.language]);

  // 根据当前语言获取产品名称
  const getProductName = (product: Product) => {
    const lang = i18n.language || 'en';
    const nameKey = `name_${lang}` as keyof typeof product;
    return (product[nameKey] as string) || product.name_en || product.name_zh;
  };

  // 英雄区背景图片URL
  const heroBackgroundUrl = pageContent.hero_background || '/images/white_powder_chemical_building_material_display.jpg';

  return (
    <>
      <Helmet>
        <title>{t('title')} - {t('nav.home')}</title>
        <meta name="description" content={pageContent.meta_description || t('home:meta_description')} />
      </Helmet>

      {/* 英雄区域 - 工业化设计 */}
      <section className="relative py-0 h-[90vh] flex items-center overflow-hidden">
        {/* 背景图片 - 更大更清晰的工厂或生产线图片 */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/modern_powder_production_line_factory.jpg" 
            alt={t('home:hero.company_alt')} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 渐变覆盖层 - 使用深绿色调 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 via-[#047857]/85 to-[#064E3B]/80 z-10"></div>

        {/* 装饰性工业线条元素 */}
        <div className="absolute left-0 top-1/4 w-full h-px bg-[#10B981]/20 z-20"></div>
        <div className="absolute left-0 bottom-1/4 w-full h-px bg-[#10B981]/20 z-20"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-[#10B981]/20 z-20"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-[#10B981]/20 z-20"></div>

        {/* 装饰性几何元素 */}
        <div className="absolute top-20 left-20 w-24 h-24 border-l-2 border-t-2 border-[#10B981]/30 z-20"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-r-2 border-b-2 border-[#10B981]/30 z-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-start space-y-8">
              {/* 工业风格小标题 */}
              <div className="inline-flex items-center space-x-2 bg-[#064E3B] px-4 py-1.5 rounded-sm">
                <div className="w-2 h-2 bg-[#10B981] rotate-45"></div>
                <span className="text-white text-sm font-medium tracking-wider uppercase">{t('home:hero.badge')}</span>
              </div>

              {/* 大标题 - 使用更大更精细的字体 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                <span className="block">{pageContent.hero_title || t('home:hero.title')}</span>
                <span className="block mt-2 text-[#10B981]">{t('home:hero.subtitle_highlight')}</span>
              </h1>

              {/* 副标题 - 清晰简洁 */}
              <p className="text-green-100 text-lg md:text-xl leading-relaxed max-w-xl">
                {pageContent.hero_subtitle || t('home:hero.subtitle')}
              </p>

              {/* 工业风格分隔线 */}
              <div className="w-24 h-1 bg-[#10B981]"></div>

              {/* 按钮区 - 更大更突出 */}
              <div className="flex flex-col sm:flex-row gap-5 mt-4">
                <Button asChild size="lg" className="bg-[#10B981] text-white hover:bg-[#059669] px-8 py-6 text-lg rounded-sm">
                  <Link to={`/${i18n.language}/products`}>
                    {t('cta.view_products')}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-sm">
                  <Link to={`/${i18n.language}/contact`}>
                    {t('cta.contact')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 产品展示区 - 工业风格 */}
      <section className="py-20 md:py-28 bg-white industrial-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* 工业风格标题区 */}
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-1 bg-[#047857]"></div>
              <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:products.series')}</span>
            </div>

            <h2 className="industrial-title text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
              {pageContent.products_title || t('home:products.title')}
            </h2>

            <p className="text-gray-600 max-w-2xl leading-relaxed text-lg">
              {pageContent.products_subtitle || t('home:products.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#047857]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {products.map((product) => (
                <div key={product.id} className="group relative bg-white overflow-hidden rounded-sm border-t border-l border-gray-200 p-6 shadow-sm transition-all hover:shadow-md hover:border-[#10B981]">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#047857]"></div>
                  {product.image_url ? (
                    <div className="aspect-[4/3] mb-5 overflow-hidden rounded-sm bg-gray-100">
                      <img
                        src={product.image_url}
                        alt={getProductName(product)}
                        className="h-full w-full object-cover object-center transition-all group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] mb-5 overflow-hidden rounded-sm bg-gray-100 flex items-center justify-center text-gray-400">
                      {t('home:products.no_image')}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors">{getProductName(product)}</h3>
                  <p className="mt-3 line-clamp-3 text-gray-600">
                    {(() => {
                      const lang = i18n.language || 'zh';
                      const descKey = `description_${lang}` as keyof typeof product;
                      return (product[descKey] as string) || product.description_zh || '';
                    })()}
                  </p>
                  <Link 
                    to={`/${i18n.language}/products/${product.product_code}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-[#047857] hover:text-[#10B981] transition-colors"
                  >
                    {t('cta.learn_more')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Button asChild variant="outline" className="border-[#047857] text-[#047857] hover:bg-[#047857] hover:text-white transition-colors rounded-sm px-8 py-6">
              <Link to={`/${i18n.language}/products`}>
                {t('home:products.view_all')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 演示视频区 - 工业风格 */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]">
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
                  {pageContent.video_url ? (
                    <iframe 
                      className="w-full h-full"
                      src={pageContent.video_url}
                      title={pageContent.video_title || t('home:video.title')}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-white mx-auto mb-4" />
                        <p className="text-white text-lg">{t('home:video.no_video')}</p>
                      </div>
                    </div>
                  )}
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
                <Link to={`/${i18n.language}/products`}>
                  {t('home:video.explore_products')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* OEM定制区 - 工业风格 */}
      <section className="py-20 md:py-28 bg-white industrial-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* 工业风格标题区 */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-1 bg-[#047857]"></div>
                <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:oem.badge')}</span>
              </div>
              
              <h2 className="industrial-title text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
                {pageContent.oem_title || t('home:oem.title')}
              </h2>
              
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {pageContent.oem_description || pageContent.oem_subtitle || t('home:oem.description')}
              </p>
              
              {/* 工业风格特点列表 */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:oem.features.brand')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:oem.features.packaging')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:oem.features.formula')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:oem.features.export')}</span>
                </li>
              </ul>
              
              <Button asChild className="bg-[#047857] hover:bg-[#064E3B] text-white rounded-sm px-8 py-6 text-lg transition-colors">
                <Link to={`/${i18n.language}/oem`}>
                  {t('home:oem.learn_more')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="order-1 lg:order-2">
              {/* 工业风格图片展示 */}
              <div className="relative">
                {/* 装饰性角块 */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-[#047857] z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-[#047857] z-10"></div>
                
                {/* 主图片 */}
                <div className="rounded-sm overflow-hidden shadow-xl relative">
                  <img 
                    src={pageContent.oem_images && pageContent.oem_images.length > 0 ? pageContent.oem_images[0] : '/images/oem_manufacturing_custom_packaging_uv_stickers.jpg'} 
                    alt={t('home:oem.image_alt')} 
                    className="w-full h-auto object-cover rounded-sm"
                  />
                  
                  {/* 装饰性覆盖层 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#047857]/20 to-transparent pointer-events-none"></div>
                  
                  {/* 工业风格标记 */}
                  <div className="absolute top-4 right-4 bg-[#047857] text-white px-4 py-1.5 text-sm font-medium tracking-wider">
                    {t('home:oem.badge')}
                  </div>
                </div>
                
                {/* 工业风格装饰元素 */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2/3 h-1.5 bg-[#10B981]/80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 半成品小袋区 - 工业风格 */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-1 lg:order-1">
              {/* 工业风格图片展示 */}
              <div className="relative">
                {/* 装饰性角块 */}
                <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-[#047857] z-10"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-[#047857] z-10"></div>
                
                {/* 主图片 */}
                <div className="rounded-sm overflow-hidden shadow-xl relative">
                  <img 
                    src="/images/silver_aluminum_foil_small_packaging_pouches.jpg" 
                    alt={t('home:semi.image_alt')} 
                    className="w-full h-auto object-cover rounded-sm"
                  />
                  
                  {/* 装饰性覆盖层 */}
                  <div className="absolute inset-0 bg-gradient-to-tl from-[#047857]/20 to-transparent pointer-events-none"></div>
                  
                  {/* 工业风格标记 */}
                  <div className="absolute top-4 left-4 bg-[#047857] text-white px-4 py-1.5 text-sm font-medium tracking-wider">
                    {t('home:semi.badge')}
                  </div>
                </div>
                
                {/* 工业风格装饰元素 */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2/3 h-1.5 bg-[#10B981]/80"></div>
              </div>
            </div>
            
            <div className="order-2 lg:order-2">
              {/* 工业风格标题区 */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-1 bg-[#047857]"></div>
                <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">{t('home:semi.badge')}</span>
              </div>
              
              <h2 className="industrial-title text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
                {pageContent.semi_title || t('home:semi.title')}
              </h2>
              
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {pageContent.semi_subtitle || t('home:semi.description')}
              </p>
              
              {/* 工业风格特点列表 */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:semi.features.specs')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:semi.features.packaging')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:semi.features.market')}</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">{t('home:semi.features.custom_brand')}</span>
                </li>
              </ul>
              
              <Button asChild className="bg-[#047857] hover:bg-[#064E3B] text-white rounded-sm px-8 py-6 text-lg transition-colors">
                <Link to={`/${i18n.language}/products/KARN-SEMI`}>
                  {t('home:semi.view_products')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 为什么选择我们 - 工业风格 */}
      <section className="py-20 md:py-28 bg-white industrial-bg">
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
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* 背景图片 */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/modern_industrial_robotics_factory_china.jpg" 
            alt={t('home:cta.image_alt')} 
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
                <Link to={`/${i18n.language}/contact`}>
                  {t('cta.contact')}
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-sm">
                <Link to={`/${i18n.language}/products`}>
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