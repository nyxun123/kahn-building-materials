import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle, Package } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductDetailPage() {
  const { productCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['common', 'products']);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetail() {
      if (!productCode) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('product_code', productCode)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('获取产品详情失败:', err);
        setError(t('products:product_not_found'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductDetail();
  }, [productCode, t]);

  // 根据当前语言获取内容
  const getLocalizedContent = <K extends keyof Product>(fieldPrefix: string): string => {
    if (!product) return '';
    
    const lang = i18n.language || 'zh';
    const fieldKey = `${fieldPrefix}_${lang}` as K;
    const fallbackKey = `${fieldPrefix}_zh` as K;
    
    return (product[fieldKey] as string) || (product[fallbackKey] as string) || '';
  };

  // 获取本地化的特点列表
  const getLocalizedFeatures = (): string[] => {
    if (!product) return [];
    
    const lang = i18n.language || 'zh';
    const featureKey = `features_${lang}` as keyof typeof product;
    const fallbackKey = 'features_zh' as keyof typeof product;
    
    return (product[featureKey] as string[]) || (product[fallbackKey] as string[]) || [];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">{error || t('products:product_not_found')}</h2>
        <Button asChild variant="outline">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('products:back_to_products')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getLocalizedContent('name')} - {t('title')}</title>
        <meta name="description" content={getLocalizedContent('description')} />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('products:back_to_products')}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* 产品图片 */}
          <div className="bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url.startsWith('http') ? product.image_url : product.image_url} 
                alt={getLocalizedContent('name')} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-muted-foreground">
                暂无图片
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {getLocalizedContent('name')}
            </h1>
            <div className="text-sm text-muted-foreground mb-4">
              {t('products:product_code')}: {product.product_code}
            </div>
            
            {product.price_range && (
              <div className="text-lg font-medium text-foreground mb-6">
                {t('products:price_range')}: {product.price_range}
              </div>
            )}

            <div className="prose dark:prose-invert mb-6">
              <h3 className="text-lg font-semibold mb-2">{t('products:description')}</h3>
              <p>{getLocalizedContent('description')}</p>
            </div>

            {/* 产品特点 */}
            {getLocalizedFeatures().length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{t('products:features')}</h3>
                <ul className="space-y-2">
                  {getLocalizedFeatures().map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="ml-2">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 规格说明 */}
            {getLocalizedContent('specifications') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{t('products:specifications')}</h3>
                <div className="prose dark:prose-invert">
                  <p>{getLocalizedContent('specifications')}</p>
                </div>
              </div>
            )}

            {/* 应用场景 */}
            {getLocalizedContent('applications') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{t('products:applications')}</h3>
                <div className="prose dark:prose-invert">
                  <p>{getLocalizedContent('applications')}</p>
                </div>
              </div>
            )}

            {/* 包装选项 */}
            {getLocalizedContent('packaging_options') && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  {t('products:packaging')}
                </h3>
                <div className="prose dark:prose-invert">
                  <p>{getLocalizedContent('packaging_options')}</p>
                </div>
              </div>
            )}

            {/* 联系按钮 */}
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/contact">
                  {t('products:inquiry_button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
