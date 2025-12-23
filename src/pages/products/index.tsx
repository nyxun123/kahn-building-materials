import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, Package, Check } from 'lucide-react';
import { useDebounce, useLocalStorage } from '@/lib/performance-utils';
import { LazyImage } from '@/components/LazyImage';
import { Button } from '@/components/ui/button';

import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { LOCAL_PRODUCTS } from '@/data/products-data';

// 使用D1 API
interface Product {
  id: number;
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: string;
  features_zh?: string[];
  features_en?: string[];
  features_ru?: string[];
}

// Helper functions for product text
const getProductName = (product: Product, lang: string) => {
  const nameKey = `name_${lang}` as keyof typeof product;
  return product[nameKey] as string || product.name_zh;
};

const getProductDescription = (product: Product, lang: string) => {
  const descKey = `description_${lang}` as keyof typeof product;
  return product[descKey] as string || product.description_zh;
};

const getProductFeatures = (product: Product, lang: string) => {
  const featuresKey = `features_${lang}` as keyof typeof product;
  return (product[featuresKey] as string[]) || product.features_zh || [];
};

// 优化的产品卡片组件
const ProductCard = ({ product }: { product: Product }) => {
  const { t, i18n } = useTranslation(['common', 'products', 'home']);
  const currentLang = i18n.language || 'zh';
  const productDetailUrl = `/${currentLang}/products/${product.product_code}`;

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
      {/* 可点击的图片区域 */}
      <Link to={productDetailUrl} className="block">
        {product.image_url ? (
          <div className="aspect-square mb-5 overflow-hidden rounded-md bg-muted cursor-pointer">
            <LazyImage
              src={product.image_url}
              alt={getProductName(product, currentLang)}
              className="h-full w-full object-cover object-center transition-all group-hover:scale-105"
            />
            {/* 点击提示覆盖层 - 仅在桌面端显示 hover 效果 */}
            <div className="hidden md:flex absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-10 transition-all duration-200 items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 rounded-full p-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3-3m3 3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-square mb-5 overflow-hidden rounded-md bg-muted flex items-center justify-center text-muted-foreground cursor-pointer">
            {t('home:products.no_image')}
          </div>
        )}
      </Link>

      <h3 className="text-lg font-semibold">{getProductName(product, currentLang)}</h3>
      <p className="mt-2 line-clamp-3 text-muted-foreground">
        {getProductDescription(product, currentLang)}
      </p>
      <Link
        to={productDetailUrl}
        className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        {t('cta.learn_more')}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};


const ProductsPage = memo(function ProductsPage() {
  const { t, i18n } = useTranslation(['common', 'products', 'home']);
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // 缓存产品数据到localStorage
  const [cachedProducts, setCachedProducts] = useLocalStorage<Product[]>('products-cache', []);

  // 强制刷新产品列表
  const forceRefreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // 清除localStorage缓存
      localStorage.removeItem('products-cache');

      console.log('🔄 强制刷新产品数据...');
      // 强制获取最新数据
      const result = await fetch('/api/products?_t=' + Date.now()); // 添加时间戳绕过缓存
      const data = await result.json();

      if (data.success && Array.isArray(data.data)) {
        console.log(`✅ 刷新成功，获取 ${data.data.length} 个产品`);
        setProducts(data.data);
        setCachedProducts(data.data);
        setLastUpdated(Date.now());
      } else {
        console.error('❌ 获取产品失败:', data.message);
      }
    } catch (error) {
      console.error('❌ 强制刷新产品失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setCachedProducts]);

  // 使用防抖优化搜索
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 缓存过滤结果
  const filteredProducts = useMemo(() => {
    // 优先处理搜索词
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return products.filter(product => {
        const name = getProductName(product, currentLang);
        const description = getProductDescription(product, currentLang);
        return name.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower);
      });
    }

    // 处理分类筛选
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      return products.filter(product => product.category === category);
    }

    return products;
  }, [products, debouncedSearchTerm, i18n.language, location.search]);


  useEffect(() => {
    // Temporarily force using LOCAL_PRODUCTS to match user expectation (ignoring DB "Wallpaper Glue" data)
    // async function fetchProducts() {
    //   setIsLoading(true);
    //   ...
    // }
    // fetchProducts();

    const loadLocalData = () => {
      const localProducts = Object.values(LOCAL_PRODUCTS).map((p, index) => ({
        id: index + 1,
        product_code: p.product_code,
        name_zh: p.name_zh,
        name_en: p.name_en,
        name_ru: p.name_ru,
        description_zh: p.description_zh,
        description_en: p.description_en,
        description_ru: p.description_ru,
        image_url: p.image_url,
        is_active: true,
        sort_order: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        features_zh: p.features_zh,
        features_en: p.features_en,
        features_ru: p.features_ru,
        category: p.category,
      }));
      setProducts(localProducts as any);
      setIsLoading(false);
    };

    loadLocalData();
  }, []);

  // 构建当前页面URL
  const currentUrl = `https://kn-wallpaperglue.com${location.pathname}`;
  const currentLang = i18n.language || 'zh';

  // 生成产品列表的 ItemList 结构化数据
  const itemListSchema = useMemo(() => {
    if (filteredProducts.length === 0) return null;

    return {
      type: 'ItemList' as const,
      name: t('products:title'),
      description: t('products:meta_description'),
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.map((product, index) => {
        const productName = getProductName(product, currentLang);
        const productUrl = `/${currentLang}/products/${product.product_code}`;
        return {
          '@type': 'ListItem' as const,
          position: index + 1,
          item: {
            '@type': 'Product' as const,
            name: productName,
            description: getProductDescription(product, currentLang),
            image: product.image_url || '/images/IMG_1412.JPG',
            sku: product.product_code,
            url: productUrl,
            brand: {
              '@type': 'Brand' as const,
              name: 'Hangzhou Karn New Building Materials Co., Ltd',
            },
          },
        };
      }),
    };
  }, [filteredProducts, i18n.language, t, currentLang]);
  // Specialized Mobile OEM Card (Horizontal List Style)
  const MobileOEMCard = ({ product }: { product: Product }) => {
    const features = getProductFeatures(product, currentLang);
    const topFeatures = features.slice(0, 3); // Show top 3 features to keep it compact

    return (
      <div className="bg-white rounded p-3 shadow-sm border border-gray-100 flex gap-3">
        {/* Left: Image Thumbnail (Matches standard card size w-20 h-20) */}
        <Link to={`/${currentLang}/oem`} className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative border border-gray-100 group">
          <img
            src="/images/oem-v999.jpg"
            alt={getProductName(product, currentLang)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 bg-[#047857] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br">
            OEM
          </div>
        </Link>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                {getProductName(product, currentLang)}
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[9px] font-medium bg-gray-100 text-gray-500 whitespace-nowrap ml-2">
                Source Factory
              </span>
            </div>

            {topFeatures && topFeatures.length > 0 ? (
              <div className="space-y-1 mb-2">
                {topFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start text-[10px] text-gray-500 leading-tight">
                    <Check className="w-3 h-3 text-[#047857] mr-1 flex-shrink-0" strokeWidth={3} />
                    <span className="line-clamp-1">{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                {getProductDescription(product, currentLang)}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <Link to={`/${currentLang}/oem`} className="text-[10px] text-gray-500 hover:text-[#047857]">
              {t('cta.learn_more') || 'Details'}
            </Link>
            <Link to={`/${currentLang}/contact`}>
              <button className="bg-[#047857] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm flex items-center shadow-sm active:scale-95 transition-transform">
                {t('cta.contact') || 'Contact'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Mobile App-Style Product List Logic
  const MobileProductList = () => (
    <div className="lg:hidden bg-gray-50 min-h-screen">
      {/* Mobile Hero Section (Matches Home & Applications) */}
      <section className="relative h-[200px] flex items-center overflow-hidden bg-gradient-to-r from-[#064E3B] to-[#047857]" id="top">
        {/* Background Image Removed as per request */}

        <div className="container mx-auto px-4 relative z-30 h-full flex flex-col justify-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-[2px] px-2 py-0.5 rounded border border-white/20 mb-2 w-fit">
            <Package className="w-3 h-3 text-[#10B981]" />
            <span className="text-white text-[10px] uppercase tracking-wider font-bold">Product Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight shadow-sm mb-1">
            {t('products:title')}
          </h1>
          <p className="text-green-50 text-xs max-w-[90%] leading-relaxed opacity-90">
            {t('products:subtitle') || 'Professional Construction Materials'}
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[56px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-full shadow-sm transition-colors ${!searchTerm ? 'bg-[#047857] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Products
            </button>
            {/* Can add more specific category filters here if data supports it structurally */}
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-3 h-24 animate-pulse shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">{t('products:no_results')}</h3>
            <p className="text-gray-500 text-xs mt-1">Try adjusting your search criteria</p>
          </div>
        ) : <div className="space-y-3">
          {filteredProducts.map((product) => (
            product.product_code === 'OEM' ? (
              <MobileOEMCard key={product.id} product={product} />
            ) : (
              <div key={product.id} className="bg-white rounded p-3 shadow-sm border border-gray-100 flex gap-3">
                {/* Thumbnail */}
                <Link to={`/${currentLang}/products/${product.product_code}`} className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-100 relative group">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={getProductName(product, currentLang)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start">
                      {product.category && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[9px] font-medium bg-gray-100 text-gray-500 mb-1">
                          {t(`home:applications.${product.category}.title`) || product.category}
                        </span>
                      )}
                    </div>
                    <Link to={`/${currentLang}/products/${product.product_code}`}>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
                        {getProductName(product, currentLang)}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-gray-500 line-clamp-1 leading-relaxed">
                      {getProductDescription(product, currentLang)}
                    </p>
                  </div>

                  <div className="flex items-center justify-end mt-2">
                    <Link to={`/${currentLang}/products/${product.product_code}`}>
                      <button className="bg-[#047857] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm flex items-center shadow-sm active:scale-95 transition-transform">
                        {t('cta.learn_more') || 'View'}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        }
      </div>

      {/* Mobile CTA Section */}
      <div className="py-16 bg-gradient-to-r from-[#064E3B] to-[#047857] text-white text-center px-6">
        <h2 className="text-2xl font-bold mb-4">
          {t('home:cta.title')}
        </h2>
        <p className="text-white/90 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          {t('home:cta.description')}
        </p>
        <Button asChild size="lg" className="bg-white text-[#047857] hover:bg-green-50 w-full shadow-lg">
          <Link to={`/${currentLang}/contact`}>
            {t('cta.contact')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SEOHelmet
        title={t('nav.products')}
        description={t('products:meta_description')}
        keywords={t('products:keywords') + ", heavy duty wallpaper adhesive, vinyl wallpaper glue, methyl cellulose adhesive"}
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image="/images/IMG_1412.JPG"
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: t('products:title'),
          description: t('products:meta_description'),
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
              name: t('nav.products'),
              item: `/${currentLang}/products`,
            },
          ],
        }}
      />
      {itemListSchema && (
        <StructuredData schema={itemListSchema} />
      )}

      {/* Main Container with Background Switch */}
      <div className="min-h-screen bg-gray-50 lg:bg-background">

        {/* Mobile View */}
        <MobileProductList />

        {/* Desktop View (Original) */}
        <div className="hidden lg:block">
          {/* 页面标题区 */}
          <section className="bg-gradient-to-r from-green-500 to-green-700 py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('products:title')}
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                {t('products:subtitle')}
              </p>
            </div>
          </section>

          {/* 搜索区 */}
          <section className="py-8 bg-background border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center">
                <div className="max-w-md w-full">
                  <input
                    type="text"
                    placeholder={t('products:search_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 产品列表区 */}
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchTerm ? t('products:no_search_results') : t('products:no_products')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 联系信息区 */}
          <section className="py-16 md:py-24 bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#059669]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('products:contact_title')}
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8">
                {t('products:contact_description')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-[#047857] shadow hover:bg-white/90 h-9 px-4 py-2"
              >
                {t('cta.contact')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
});

export default ProductsPage;
