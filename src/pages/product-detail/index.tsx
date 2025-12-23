import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Package, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { isLocalProduct, getLocalProduct, type LocalProduct, type ProductSpec } from '@/data/products-data';

const SITE_URL = 'https://kn-wallpaperglue.com';

interface Product {
  id: number;
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  features_zh: string[];
  features_en: string[];
  features_ru: string[];
  specifications_zh: string | null;
  specifications_en: string | null;
  specifications_ru: string | null;
  applications_zh: string | null;
  applications_en: string | null;
  applications_ru: string | null;
  packaging_options_zh: string | null;
  packaging_options_en: string | null;
  packaging_options_ru: string | null;
  price_range: string;
  image_url: string;
  gallery_images: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category: string;
  tags: string[];
}

// 处理图片URL，确保相对路径转换为完整URL
const processImageUrl = (url: string): string => {
  if (!url) return '';
  // 如果是相对路径，转换为完整URL
  if (url.startsWith('/')) {
    return `${SITE_URL}${url}`;
  }
  // 如果已经是完整URL或base64，直接返回
  return url;
};

export default function ProductDetailPage() {
  const { productCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation(['common', 'products']);
  const [product, setProduct] = useState<Product | null>(null);
  const [localProduct, setLocalProduct] = useState<LocalProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedProductCode = productCode ? decodeURIComponent(productCode) : '';

  useEffect(() => {
    async function fetchProductDetail() {
      if (!resolvedProductCode) return;

      setIsLoading(true);
      setError(null);

      // 检查是否为本地产品
      if (isLocalProduct(resolvedProductCode)) {
        const localData = getLocalProduct(resolvedProductCode);
        if (localData) {
          setLocalProduct(localData);
          setIsLoading(false);
          return;
        }
      }

      // 从API获取产品
      try {
        // 使用添加时间戳的方式绕过缓存
        const cacheBuster = `?_t=${Date.now()}`;
        const response = await fetch(`/api/products/${resolvedProductCode}${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError(t('products:product_not_found'));
            return;
          }
          throw new Error(`获取产品详情失败: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.message || t('products:product_not_found'));
        }
      } catch (err) {
        console.error('获取产品详情失败:', err);
        setError(t('products:product_not_found'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductDetail();
  }, [resolvedProductCode, t]);

  // 根据当前语言获取内容
  const getLocalizedContent = (fieldPrefix: string): string => {
    // 优先使用本地产品数据
    if (localProduct) {
      const lang = i18n.language || 'en';
      const fieldKey = `${fieldPrefix}_${lang}` as keyof LocalProduct;
      const fallbackKeyEn = `${fieldPrefix}_en` as keyof LocalProduct;
      const fallbackKeyZh = `${fieldPrefix}_zh` as keyof LocalProduct;

      return (localProduct[fieldKey] as string) || (localProduct[fallbackKeyEn] as string) || (localProduct[fallbackKeyZh] as string) || '';
    }

    if (!product) return '';

    const lang = i18n.language || 'en';
    const fieldKey = `${fieldPrefix}_${lang}` as keyof Product;
    const fallbackKeyEn = `${fieldPrefix}_en` as keyof Product;
    const fallbackKeyZh = `${fieldPrefix}_zh` as keyof Product;

    return (product[fieldKey] as string) || (product[fallbackKeyEn] as string) || (product[fallbackKeyZh] as string) || '';
  };

  // 获取本地化的特点列表
  const getLocalizedFeatures = (): string[] => {
    // 优先使用本地产品数据
    if (localProduct) {
      const lang = i18n.language || 'en';
      const featureKey = `features_${lang}` as keyof LocalProduct;
      const fallbackKeyEn = 'features_en' as keyof LocalProduct;
      const fallbackKeyZh = 'features_zh' as keyof LocalProduct;

      const features = (localProduct[featureKey] as string[]) || (localProduct[fallbackKeyEn] as string[]) || (localProduct[fallbackKeyZh] as string[]) || [];
      return Array.isArray(features) ? features : [];
    }

    if (!product) return [];

    const lang = i18n.language || 'en';
    const featureKey = `features_${lang}` as keyof typeof product;
    const fallbackKeyEn = 'features_en' as keyof typeof product;
    const fallbackKeyZh = 'features_zh' as keyof typeof product;

    const features = (product[featureKey] as string[]) || (product[fallbackKeyEn] as string[]) || (product[fallbackKeyZh] as string[]) || [];
    return Array.isArray(features) ? features : [];
  };

  // 获取本地化的性能参数
  const getLocalizedSpecs = (): ProductSpec[] => {
    if (!localProduct) return [];

    const lang = i18n.language || 'en';
    const specsKey = `specs_${lang}` as keyof LocalProduct;
    const fallbackKeyEn = 'specs_en' as keyof LocalProduct;
    const fallbackKeyZh = 'specs_zh' as keyof LocalProduct;

    const specs = (localProduct[specsKey] as ProductSpec[]) || (localProduct[fallbackKeyEn] as ProductSpec[]) || (localProduct[fallbackKeyZh] as ProductSpec[]) || [];
    return Array.isArray(specs) ? specs : [];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || (!product && !localProduct)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">{error || t('products:product_not_found')}</h2>
        <Button asChild variant="outline">
          <Link to={`/${i18n.language}/applications`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回应用领域
          </Link>
        </Button>
      </div>
    );
  }

  // 获取产品代码（优先使用本地产品）
  const displayProductCode = localProduct?.product_code || product?.product_code || '';
  const productUrl = `${SITE_URL}${location.pathname}${location.search || ''}`;

  return (
    <>
      <SEOHelmet
        title={getLocalizedContent('name')}
        description={getLocalizedContent('description')}
        keywords={`${displayProductCode},羧甲基淀粉,${getLocalizedContent('name')},CMS,carboxymethyl starch,${localProduct?.category || product?.category || ''}`}
        type="product"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image={localProduct?.image_url || product?.image_url || '/images/IMG_1412.JPG'}
      />
      <StructuredData
        schema={{
          type: 'Product',
          name: getLocalizedContent('name'),
          description: getLocalizedContent('description'),
          image: localProduct?.image_url || product?.image_url || '/images/IMG_1412.JPG',
          sku: displayProductCode,
          brand: {
            name: 'Hangzhou Karn New Building Materials Co., Ltd',
          },
          manufacturer: {
            name: 'Hangzhou Karn New Building Materials Co., Ltd',
          },
          offers: {
            availability: 'https://schema.org/InStock',
            url: productUrl,
          },
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
              item: `/${i18n.language || 'zh'}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: t('nav.products'),
              item: `/${i18n.language || 'zh'}/products`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: getLocalizedContent('name'),
              item: location.pathname,
            },
          ],
        }}
      />

      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:bg-white">
        {/* Mobile View */}
        <div className="lg:hidden">
          {/* 1. Full Width Hero Image */}
          <div className="relative aspect-square w-full bg-white">
            {(localProduct?.image_url || product?.image_url) ? (
              <img
                src={localProduct?.image_url || processImageUrl(product?.image_url || '')}
                alt={getLocalizedContent('name')}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                <Package className="h-16 w-16" />
              </div>
            )}

            {/* Floating Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          {/* 2. Content Sheet (Overlapping Image) */}
          <div className="relative -mt-6 bg-gray-50 rounded-t-3xl pt-6 px-4 space-y-4">
            {/* Title Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                {getLocalizedContent('name')}
              </h1>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-[#047857] text-xs font-medium">
                  {displayProductCode}
                </div>
                <div className="flex items-center text-[#047857] text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5 animate-pulse"></span>
                  In Stock
                </div>
              </div>
            </div>

            {/* Specs Grid (Mobile) */}
            {getLocalizedSpecs().length > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 text-[#047857] mr-1.5" />
                  Technical Specs
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {getLocalizedSpecs().slice(0, 4).map((spec, i) => (
                    <div key={i} className="bg-gray-50 rounded p-2">
                      <div className="text-[10px] text-gray-500 mb-0.5">{spec.label}</div>
                      <div className="text-xs font-bold text-gray-800 line-clamp-1">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <Package className="w-4 h-4 text-[#047857] mr-1.5" />
                Packaging
              </h3>
              <div className="text-sm text-gray-600">
                20kg / 25kg Kraft Paper Bag
              </div>
            </div>

            {/* Description */}
            {getLocalizedContent('description') && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {getLocalizedContent('description')}
                </p>
              </div>
            )}

            {/* Spacer for Fixed Footer */}
            <div className="h-24"></div>
          </div>

          {/* 3. Fixed Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50 flex gap-3 safe-area-bottom">
            <Button variant="outline" className="flex-1 border-[#047857] text-[#047857]" onClick={() => navigate(`/${i18n.language}/products`)}>
              Catalog
            </Button>
            <Button className="flex-[2] bg-[#047857] text-white hover:bg-[#064E3B] shadow-lg shadow-green-900/20" onClick={() => navigate(`/${i18n.language}/contact`)}>
              Inquire Now
            </Button>
          </div>
        </div>


        {/* Desktop View (Original Cleaned Up) */}
        <div className="hidden lg:block container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(`/${i18n.language}/applications`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回应用领域
          </Button>

          {/* 产品头部信息 */}
          <div className="bg-white border-l-4 border-[#047857] shadow-sm rounded-sm p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-3">
                  {getLocalizedContent('name')}
                </h1>
                <div className="inline-flex items-center gap-2 bg-[#047857]/10 text-[#047857] px-4 py-2 rounded-sm text-sm font-semibold">
                  <Package className="h-4 w-4" />
                  产品型号：{displayProductCode}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：产品图片 */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square border border-gray-200">
                  {(localProduct?.image_url || product?.image_url) ? (
                    <img
                      src={localProduct?.image_url || processImageUrl(product?.image_url || '')}
                      alt={getLocalizedContent('name')}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="h-16 w-16" />
                    </div>
                  )}
                </div>

                {/* 联系按钮 */}
                <div className="mt-6">
                  <Button asChild size="lg" className="w-full bg-[#047857] hover:bg-[#064E3B]">
                    <Link to={`/${i18n.language}/contact`}>
                      立即咨询
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* 右侧：产品信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 产品描述 */}
              {getLocalizedContent('description') && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-[#064E3B] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#047857]"></div>
                    产品简介
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {getLocalizedContent('description')}
                  </p>
                </div>
              )}

              {/* 性能参数 - 突出显示 */}
              {getLocalizedSpecs().length > 0 && (
                <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] rounded-lg p-6 text-white">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    技术参数
                  </h2>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getLocalizedSpecs().map((spec, index) => (
                        <div key={index} className="bg-white/5 rounded p-3 border border-white/20">
                          <dt className="text-green-100 text-sm mb-1">
                            {spec.label}
                          </dt>
                          <dd className="text-white font-bold text-base">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {/* 产品特点 */}
              {getLocalizedFeatures().length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-[#064E3B] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#047857]"></div>
                    产品特点
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getLocalizedFeatures().map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 应用场景 */}
              {getLocalizedContent('applications') && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-[#064E3B] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#047857]"></div>
                    应用领域
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {getLocalizedContent('applications')}
                  </p>
                </div>
              )}

              {/* 规格说明 */}
              {getLocalizedContent('specifications') && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-[#064E3B] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#047857]"></div>
                    规格说明
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {getLocalizedContent('specifications')}
                  </p>
                </div>
              )}

              {/* 包装规格 */}
              <div className="bg-gradient-to-br from-[#064E3B]/5 to-[#047857]/5 border border-[#047857]/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#064E3B] mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#047857]" />
                  {t('products:packaging_title')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-sm p-4 border-l-4 border-[#047857] shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="h-5 w-5 text-[#047857]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{t('products:bag_weight').split('：')[0]}</div>
                        <div className="text-2xl font-bold text-[#064E3B]">20kg</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-sm p-4 border-l-4 border-[#047857] shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="h-5 w-5 text-[#047857]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{t('products:bags_per_ton').split('：')[0]}</div>
                        <div className="text-2xl font-bold text-[#064E3B]">50{t('products:bags_per_ton').includes('袋') ? '袋' : t('products:bags_per_ton').includes('bags') ? ' bags' : ' мешков'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-sm p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg className="h-5 w-5 text-[#047857]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">{t('products:packaging_material').split('：')[0]}</div>
                      <div className="text-base font-semibold text-[#064E3B] mb-2">
                        {t('products:packaging_material').split('：')[1] || t('products:packaging_material').split(': ')[1]}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {t('products:packaging_note')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
