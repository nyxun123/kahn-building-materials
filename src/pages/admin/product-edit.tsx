import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { productAPI } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import type { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

const ProductEdit = () => {
  const { t } = useTranslation('admin');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewProduct = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 产品表单数据
  const [productForm, setProductForm] = useState<ProductInsert>({
    product_code: '',
    name_zh: '',
    name_en: '',
    name_ru: '',
    description_zh: '',
    description_en: '',
    description_ru: '',
    specifications_zh: '',
    specifications_en: '',
    specifications_ru: '',
    applications_zh: '',
    applications_en: '',
    applications_ru: '',
    image_url: '',
    features_zh: [],
    features_en: [],
    features_ru: [],
    price_range: '',
    packaging_options_zh: '',
    packaging_options_en: '',
    packaging_options_ru: '',
    is_active: true,
    sort_order: 999
  });

  // 加载产品数据
  useEffect(() => {
    if (!isNewProduct && id) {
      loadProduct(parseInt(id));
    }
  }, [id, isNewProduct]);

  const loadProduct = async (productId: number) => {
    try {
      setIsLoading(true);
      const product = await productAPI.getProduct(productId);
      setProductForm(product);
    } catch (error) {
      console.error('加载产品失败:', error);
      toast.error('加载产品失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>, language: 'zh' | 'en' | 'ru') => {
    const features = e.target.value
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.trim());

    setProductForm((prev) => ({
      ...prev,
      [`features_${language}`]: features
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setProductForm((prev) => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // 验证必填字段
      if (!productForm.product_code || !productForm.name_zh || !productForm.name_en || !productForm.name_ru) {
        toast.error('请填写所有必填字段');
        return;
      }

      if (isNewProduct) {
        await productAPI.createProduct(productForm);
        toast.success('产品创建成功');
      } else {
        await productAPI.updateProduct(parseInt(id!), productForm);
        toast.success('产品更新成功');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('保存产品失败:', error);
      toast.error('保存产品失败');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isNewProduct ? t('products.add_new') : t('products.edit')} | 杭州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            to="/admin/products"
            className="flex items-center text-primary hover:text-primary/80 mr-4"
          >
            <RiArrowLeftSLine className="w-5 h-5" />
            {t('common.back')}
          </Link>
          <h1 className="text-2xl font-bold">{isNewProduct ? t('products.add_new') : t('products.edit')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：基本信息 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('products.product_code')} *</label>
                <input
                  type="text"
                  name="product_code"
                  value={productForm.product_code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.name_zh')} *</label>
                <input
                  type="text"
                  name="name_zh"
                  value={productForm.name_zh}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.name_en')} *</label>
                <input
                  type="text"
                  name="name_en"
                  value={productForm.name_en}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.name_ru')} *</label>
                <input
                  type="text"
                  name="name_ru"
                  value={productForm.name_ru}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.image')}</label>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  currentImage={productForm.image_url}
                  folder="products"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.price_range')}</label>
                <input
                  type="text"
                  name="price_range"
                  value={productForm.price_range}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.sort_order')}</label>
                <input
                  type="number"
                  name="sort_order"
                  value={productForm.sort_order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={productForm.is_active}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  {t('products.active')}
                </label>
              </div>
            </div>

            {/* 右侧：详细描述 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('products.description_zh')}</label>
                <textarea
                  name="description_zh"
                  value={productForm.description_zh}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.description_en')}</label>
                <textarea
                  name="description_en"
                  value={productForm.description_en}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.description_ru')}</label>
                <textarea
                  name="description_ru"
                  value={productForm.description_ru}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.specifications_zh')}</label>
                <textarea
                  name="specifications_zh"
                  value={productForm.specifications_zh}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.specifications_en')}</label>
                <textarea
                  name="specifications_en"
                  value={productForm.specifications_en}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.specifications_ru')}</label>
                <textarea
                  name="specifications_ru"
                  value={productForm.specifications_ru}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Link
              to="/admin/products"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? '保存中...' : (isNewProduct ? t('products.create') : t('products.update'))}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductEdit;