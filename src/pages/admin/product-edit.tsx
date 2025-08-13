import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RiArrowLeftSLine, RiImageAddLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
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
  const [uploading, setUploading] = useState(false);

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
    sort_order: 0
  });

  // 验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 上传预览图片
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isNewProduct && id) {
      fetchProduct(parseInt(id));
    }
  }, [id, isNewProduct]);

  const fetchProduct = async (productId: number) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProductForm(data);
        if (data.image_url) {
          setPreviewImage(data.image_url);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('加载产品信息失败');
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // 验证必填字段
    if (!productForm.product_code) {
      newErrors.product_code = t('product_form.required');
      isValid = false;
    }

    if (!productForm.name_zh) {
      newErrors.name_zh = t('product_form.required');
      isValid = false;
    }

    if (!productForm.name_en) {
      newErrors.name_en = t('product_form.required');
      isValid = false;
    }

    if (!productForm.name_ru) {
      newErrors.name_ru = t('product_form.required');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
      setUploading(true);

      // 上传文件到 Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 获取公共URL
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);

      if (data) {
        setPreviewImage(data.publicUrl);
        setProductForm((prev) => ({
          ...prev,
          image_url: data.publicUrl
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('上传图片失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // 滚动到第一个错误字段
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setIsSaving(true);

      if (isNewProduct) {
        // 创建新产品
        const { error } = await supabase.from('products').insert([productForm]);

        if (error) {
          throw error;
        }

        toast.success(t('products.create_success'));
      } else {
        // 更新现有产品
        const { error } = await supabase
          .from('products')
          .update(productForm)
          .eq('id', id);

        if (error) {
          throw error;
        }

        toast.success(t('products.update_success'));
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(isNewProduct ? t('products.create_error') : t('products.update_error'));
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
        <title>
          {isNewProduct ? t('product_form.add_title') : t('product_form.edit_title')} | 杭州卡恩新型建材有限公司
        </title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/admin/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <RiArrowLeftSLine size={20} className="mr-1" />
            返回产品列表
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {isNewProduct ? t('product_form.add_title') : t('product_form.edit_title')}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* 基本信息 */}
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('product_form.basic_info')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 产品代码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.product_code')} *
              </label>
              <input
                type="text"
                name="product_code"
                value={productForm.product_code}
                onChange={handleInputChange}
                placeholder={t('product_form.product_code_placeholder')}
                className={`w-full px-3 py-2 border ${errors.product_code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                aria-invalid={errors.product_code ? 'true' : 'false'}
              />
              {errors.product_code && (
                <p className="mt-1 text-sm text-red-500">{errors.product_code}</p>
              )}
            </div>

            {/* 价格区间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.price_range')}
              </label>
              <input
                type="text"
                name="price_range"
                value={productForm.price_range || ''}
                onChange={handleInputChange}
                placeholder={t('product_form.price_range_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 产品名称（多语言） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.name_zh')} *
              </label>
              <input
                type="text"
                name="name_zh"
                value={productForm.name_zh}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name_zh ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                aria-invalid={errors.name_zh ? 'true' : 'false'}
              />
              {errors.name_zh && (
                <p className="mt-1 text-sm text-red-500">{errors.name_zh}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.name_en')} *
              </label>
              <input
                type="text"
                name="name_en"
                value={productForm.name_en}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name_en ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                aria-invalid={errors.name_en ? 'true' : 'false'}
              />
              {errors.name_en && (
                <p className="mt-1 text-sm text-red-500">{errors.name_en}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.name_ru')} *
              </label>
              <input
                type="text"
                name="name_ru"
                value={productForm.name_ru}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name_ru ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                aria-invalid={errors.name_ru ? 'true' : 'false'}
              />
              {errors.name_ru && (
                <p className="mt-1 text-sm text-red-500">{errors.name_ru}</p>
              )}
            </div>
          </div>

          {/* 产品特点（多语言） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.features_zh')}
              </label>
              <textarea
                name="features_zh"
                value={productForm.features_zh?.join('\n') || ''}
                onChange={(e) => handleFeaturesChange(e, 'zh')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder={t('product_form.features_tip')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.features_en')}
              </label>
              <textarea
                name="features_en"
                value={productForm.features_en?.join('\n') || ''}
                onChange={(e) => handleFeaturesChange(e, 'en')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder={t('product_form.features_tip')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.features_ru')}
              </label>
              <textarea
                name="features_ru"
                value={productForm.features_ru?.join('\n') || ''}
                onChange={(e) => handleFeaturesChange(e, 'ru')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder={t('product_form.features_tip')}
              />
            </div>
          </div>

          {/* 产品描述（多语言） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.description_zh')}
              </label>
              <textarea
                name="description_zh"
                value={productForm.description_zh || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.description_en')}
              </label>
              <textarea
                name="description_en"
                value={productForm.description_en || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.description_ru')}
              </label>
              <textarea
                name="description_ru"
                value={productForm.description_ru || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 产品规格（多语言） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.specifications_zh')}
              </label>
              <textarea
                name="specifications_zh"
                value={productForm.specifications_zh || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.specifications_en')}
              </label>
              <textarea
                name="specifications_en"
                value={productForm.specifications_en || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.specifications_ru')}
              </label>
              <textarea
                name="specifications_ru"
                value={productForm.specifications_ru || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 应用场景（多语言） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.applications_zh')}
              </label>
              <textarea
                name="applications_zh"
                value={productForm.applications_zh || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.applications_en')}
              </label>
              <textarea
                name="applications_en"
                value={productForm.applications_en || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.applications_ru')}
              </label>
              <textarea
                name="applications_ru"
                value={productForm.applications_ru || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 包装选项（多语言） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.packaging_zh')}
              </label>
              <textarea
                name="packaging_options_zh"
                value={productForm.packaging_options_zh || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.packaging_en')}
              </label>
              <textarea
                name="packaging_options_en"
                value={productForm.packaging_options_en || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.packaging_ru')}
              </label>
              <textarea
                name="packaging_options_ru"
                value={productForm.packaging_options_ru || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 产品图片 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('product_form.image')}
            </label>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {previewImage ? (
                <div className="relative w-40 h-40 overflow-hidden border border-gray-300 dark:border-gray-600 rounded-md">
                  <img
                    src={previewImage}
                    alt="产品预览"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-40 h-40 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                  <RiImageAddLine size={40} className="text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="image_url"
                    value={productForm.image_url || ''}
                    onChange={handleInputChange}
                    placeholder={t('product_form.image_url_placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white mb-2"
                  />
                  <div className="flex items-center">
                    <label className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-md border border-blue-600 dark:border-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading ? '正在上传...' : t('product_form.upload_image')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 状态和排序 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.status')}
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={productForm.is_active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {t('product_form.active')}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_form.sort_order')}
              </label>
              <input
                type="number"
                name="sort_order"
                value={productForm.sort_order || 0}
                onChange={handleInputChange}
                placeholder={t('product_form.sort_order_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 按钮区 */}
          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/admin/products"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('product_form.cancel')}
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? t('product_form.saving') : t('product_form.save')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductEdit;