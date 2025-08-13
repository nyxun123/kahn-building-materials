import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductsPage() {
  const { t, i18n } = useTranslation(['common', 'products']);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('获取产品失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // 根据当前语言获取产品名称
  const getProductName = (product: Product) => {
    const lang = i18n.language || 'zh';
    const nameKey = `name_${lang}` as keyof typeof product;
    return product[nameKey] as string || product.name_zh;
  };

  // 根据当前语言获取产品描述
  const getProductDescription = (product: Product) => {
    const lang = i18n.language || 'zh';
    const descKey = `description_${lang}` as keyof typeof product;
    return product[descKey] as string || product.description_zh || '';
  };

  return (
    <>
      <Helmet>
        <title>{t('title')} - {t('nav.products')}</title>
        <meta name="description" content={t('products:meta_description')} />
      </Helmet>

      {/* 页面标题区 */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-800 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('products:title')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {t('products:subtitle')}
          </p>
        </div>
      </section>

      {/* 产品列表区 */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('products:no_products')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  {product.image_url ? (
                    <div className="aspect-square mb-5 overflow-hidden rounded-md bg-muted">
                      <img
                        src={product.image_url.startsWith('http') ? product.image_url : product.image_url}
                        alt={getProductName(product)}
                        className="h-full w-full object-cover object-center transition-all group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square mb-5 overflow-hidden rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      暂无图片
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{getProductName(product)}</h3>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">
                    {getProductDescription(product)}
                  </p>
                  <Link 
                    to={`/products/${product.product_code}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    {t('cta.learn_more')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
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
}
