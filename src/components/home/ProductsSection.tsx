import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/LazyImage';

interface Product {
  id: number;
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  price_range: string;
  image_url?: string;
  category: string;
  is_active: boolean;
}

interface ProductsSectionProps {
  products: Product[];
  pageContent: Record<string, string>;
  isLoading: boolean;
  lang: string;
}

export const ProductsSection = memo(function ProductsSection({ 
  products, 
  pageContent, 
  isLoading, 
  lang 
}: ProductsSectionProps) {
  const { t, i18n } = useTranslation(['common', 'home']);

  // 根据当前语言获取产品名称
  const getProductName = (product: Product) => {
    const currentLang = i18n.language || 'en';
    const nameKey = `name_${currentLang}` as keyof typeof product;
    return (product[nameKey] as string) || product.name_en || product.name_zh;
  };

  return (
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
          
          <p className="text-black max-w-2xl leading-relaxed text-lg">
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
                    <LazyImage
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
                <p className="mt-3 line-clamp-3 text-black">
                  {(() => {
                    const currentLang = i18n.language || 'en';
                    const descKey = `description_${currentLang}` as keyof typeof product;
                    return (product[descKey] as string) || product.description_en || product.description_zh || '';
                  })()}
                </p>
                <Link 
                  to={`/${lang}/products/${product.product_code}`}
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
            <Link to={`/${lang}/products`}>
              {t('home:products.view_all')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
});