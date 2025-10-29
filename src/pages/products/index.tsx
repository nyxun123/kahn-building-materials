import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { optimizedFetch } from '@/lib/api-cache';
import { useDebounce, useLocalStorage } from '@/lib/performance-utils';
import { LazyImage } from '@/components/LazyImage';

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
}

const ProductsPage = memo(function ProductsPage() {
  const { t, i18n } = useTranslation(['common', 'products', 'home']);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // 强制刷新产品列表
  const forceRefreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // 清除localStorage缓存
      localStorage.removeItem('products-cache');

      // 强制获取最新数据
      const result = await fetch('/api/products?_t=' + Date.now()); // 添加时间戳绕过缓存
      const data = await result.json();

      if (data.success) {
        setProducts(data.data);
        setCachedProducts(data.data);
        setLastUpdated(Date.now());
      } else {
        console.error('获取产品失败:', data.message);
      }
    } catch (error) {
      console.error('强制刷新产品失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 使用防抖优化搜索
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // 优化的获取产品名称函数
  const getProductName = useCallback((product: Product) => {
    const currentLang = i18n.language || 'zh';
    const nameKey = `name_${currentLang}` as keyof typeof product;
    return product[nameKey] as string || product.name_zh;
  }, [i18n.language]);
  
  // 优化的获取产品描述函数
  const getProductDescription = useCallback((product: Product) => {
    const currentLang = i18n.language || 'zh';
    const descKey = `description_${currentLang}` as keyof typeof product;
    return product[descKey] as string || product.description_zh;
  }, [i18n.language]);
  
  // 缓存过滤结果
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;
    return products.filter(product => {
      const name = getProductName(product);
      const description = getProductDescription(product);
      const searchLower = debouncedSearchTerm.toLowerCase();
      return name.toLowerCase().includes(searchLower) || 
             description.toLowerCase().includes(searchLower);
    });
  }, [products, debouncedSearchTerm, getProductName, getProductDescription]);
  
  // 缓存产品数据到localStorage
  const [cachedProducts, setCachedProducts] = useLocalStorage<Product[]>('products-cache', []);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      
      try {
        // 使用添加时间戳的方式绕过缓存
        const cacheBuster = `?_t=${Date.now()}`;
        const response = await fetch(`/api/products${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data);
          setCachedProducts(result.data);
        } else {
          console.error('获取产品失败:', result.message);
          if (cachedProducts.length === 0) {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('获取产品失败:', error);
        if (cachedProducts.length === 0) {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [cachedProducts, setCachedProducts]);

  // 优化的产品卡片组件
  const ProductCard = memo(({ product }: { product: Product }) => {
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
                alt={getProductName(product)}
                className="h-full w-full object-cover object-center transition-all group-hover:scale-105"
              />
              {/* 点击提示覆盖层 */}
              <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-10 transition-all duration-200 flex items-center justify-center">
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

        <h3 className="text-lg font-semibold">{getProductName(product)}</h3>
        <p className="mt-2 line-clamp-3 text-muted-foreground">
          {getProductDescription(product)}
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
  });

  return (
    <>
      <Helmet>
        <title>{t('title')} - {t('nav.products')}</title>
        <meta name="description" content={t('products:meta_description')} />
      </Helmet>

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

      {/* 搜索和刷新区 */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="max-w-md mx-auto flex-1">
              <input
              type="text"
              placeholder={t('products:search_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <button
              onClick={forceRefreshProducts}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              刷新产品
            </button>
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
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t('products:contact_title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('products:contact_description')}
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            {t('cta.contact')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
});

export default ProductsPage;