import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import {
  RiSave3Line,
  RiArrowLeftLine,
  RiDeleteBin6Line,
  RiImageAddLine
} from 'react-icons/ri';
import { d1Api, type Product } from '@/lib/d1-api';
import ImageUpload from '@/components/ImageUpload';

interface ProductFormData {
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  specifications_zh: string;
  specifications_en: string;
  specifications_ru: string;
  applications_zh: string;
  applications_en: string;
  applications_ru: string;
  category: string;
  price: number;
  price_range: string;
  features_zh: string;
  features_en: string;
  features_ru: string;
  image_url: string;
  gallery_images: string;
  packaging_options_zh: string;
  packaging_options_en: string;
  packaging_options_ru: string;
  tags: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  stock_quantity: number;
  min_order_quantity: number;
  meta_title_zh: string;
  meta_title_en: string;
  meta_title_ru: string;
  meta_description_zh: string;
  meta_description_en: string;
  meta_description_ru: string;
}

const ProductForm = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
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
    category: 'adhesive',
    price: 0,
    price_range: '',
    features_zh: '',
    features_en: '',
    features_ru: '',
    image_url: '',
    gallery_images: '',
    packaging_options_zh: '',
    packaging_options_en: '',
    packaging_options_ru: '',
    tags: '',
    is_active: true,
    is_featured: false,
    sort_order: 0,
    stock_quantity: 0,
    min_order_quantity: 1,
    meta_title_zh: '',
    meta_title_en: '',
    meta_title_ru: '',
    meta_description_zh: '',
    meta_description_en: '',
    meta_description_ru: '',
  });

  // 加载产品数据（编辑模式）
  useEffect(() => {
    if (isEdit && id) {
      loadProduct(parseInt(id));
    }
  }, [isEdit, id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      console.log('🔄 开始加载产品数据, ID:', productId);
      
      const response = await d1Api.getProduct(productId);
      console.log('📤 API响应:', response);
      
      if (response.error) {
        console.error('❌ API响应错误:', response.error);
        toast.error(`加载产品失败: ${response.error.message}`);
        navigate('/admin/products');
        return;
      }

      if (response.data && response.data.length > 0) {
        const product = response.data[0];
        console.log('📦 加载的产品数据:', product);
        
        const newFormData = {
          product_code: product.product_code || '',
          name_zh: product.name_zh || '',
          name_en: product.name_en || '',
          name_ru: product.name_ru || '',
          description_zh: product.description_zh || '',
          description_en: product.description_en || '',
          description_ru: product.description_ru || '',
          specifications_zh: product.specifications_zh || '',
          specifications_en: product.specifications_en || '',
          specifications_ru: product.specifications_ru || '',
          applications_zh: product.applications_zh || '',
          applications_en: product.applications_en || '',
          applications_ru: product.applications_ru || '',
          category: product.category || 'adhesive',
          price: product.price || 0,
          price_range: product.price_range || '',
          features_zh: product.features_zh || '',
          features_en: product.features_en || '',
          features_ru: product.features_ru || '',
          image_url: product.image_url || '',
          gallery_images: product.gallery_images || '',
          packaging_options_zh: product.packaging_options_zh || '',
          packaging_options_en: product.packaging_options_en || '',
          packaging_options_ru: product.packaging_options_ru || '',
          tags: product.tags || '',
          is_active: product.is_active,
          is_featured: product.is_featured || false,
          sort_order: product.sort_order || 0,
          stock_quantity: product.stock_quantity || 0,
          min_order_quantity: product.min_order_quantity || 1,
          meta_title_zh: product.meta_title_zh || '',
          meta_title_en: product.meta_title_en || '',
          meta_title_ru: product.meta_title_ru || '',
          meta_description_zh: product.meta_description_zh || '',
          meta_description_en: product.meta_description_en || '',
          meta_description_ru: product.meta_description_ru || '',
        };
        
        console.log('📝 设置表单数据:', newFormData);
        setFormData(newFormData);
        console.log('✅ 产品数据加载完成');
      } else {
        console.warn('⚠️ API返回空数据:', response);
        toast.error('产品数据为空');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('❌ 加载产品失败:', error);
      toast.error('加载产品失败');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基础验证 - 只要求产品代码和中文名称
    if (!formData.product_code || !formData.name_zh) {
      toast.error('请至少填写产品代码和中文名称');
      return;
    }

    try {
      setSaving(true);
      
      const productData = {
        ...formData,
        // 保留base64图片数据，不自动清空
        image_url: formData.image_url, // 支持base64和HTTPS URL
        // 确保特性是JSON数组格式
        features_zh: formData.features_zh || '[]',
        features_en: formData.features_en || '[]',
        features_ru: formData.features_ru || '[]',
      };

      let response;
      if (isEdit && id) {
        response = await d1Api.updateProduct(parseInt(id), productData);
      } else {
        response = await d1Api.createProduct(productData);
      }

      if (response.error) {
        toast.error(`${isEdit ? '更新' : '创建'}产品失败: ${response.error.message}`);
        return;
      }

      toast.success(`产品${isEdit ? '更新' : '创建'}成功！`);
      navigate('/admin/products');
    } catch (error) {
      console.error('保存产品失败:', error);
      toast.error(`${isEdit ? '更新' : '创建'}产品失败`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !id) return;
    
    if (!confirm('确定要删除这个产品吗？此操作不可撤销。')) {
      return;
    }

    try {
      setSaving(true);
      const response = await d1Api.deleteProduct(parseInt(id));
      
      if (response.error) {
        toast.error(`删除产品失败: ${response.error.message}`);
        return;
      }

      toast.success('产品删除成功！');
      navigate('/admin/products');
    } catch (error) {
      console.error('删除产品失败:', error);
      toast.error('删除产品失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? '编辑产品' : '新增产品'} | 杭州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
            >
              <RiArrowLeftLine className="mr-1" />
              返回产品列表
            </button>
            <h1 className="text-2xl font-bold">{isEdit ? '编辑产品' : '新增产品'}</h1>
          </div>
          
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiDeleteBin6Line className="mr-2" />
              删除产品
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 基本信息 */}
            <div>
              <h3 className="text-lg font-medium mb-4">基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    产品代码 *
                  </label>
                  <input
                    type="text"
                    value={formData.product_code}
                    onChange={(e) => handleInputChange('product_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="如: WG-001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    分类 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="adhesive">胶水产品</option>
                    <option value="coating">涂料产品</option>
                    <option value="sealant">密封胶</option>
                    <option value="primer">底涂产品</option>
                    <option value="tools">工具配件</option>
                    <option value="other">其他产品</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 多语言名称 */}
            <div>
              <h3 className="text-lg font-medium mb-4">产品名称</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    中文名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name_zh}
                    onChange={(e) => handleInputChange('name_zh', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="产品的中文名称"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    英文名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => handleInputChange('name_en', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Product English name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    俄文名称
                  </label>
                  <input
                    type="text"
                    value={formData.name_ru}
                    onChange={(e) => handleInputChange('name_ru', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Русское название продукта"
                  />
                </div>
              </div>
            </div>

            {/* 多语言描述 */}
            <div>
              <h3 className="text-lg font-medium mb-4">产品描述</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    中文描述
                  </label>
                  <textarea
                    value={formData.description_zh}
                    onChange={(e) => handleInputChange('description_zh', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="详细的产品描述"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    英文描述
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => handleInputChange('description_en', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Detailed product description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    俄文描述
                  </label>
                  <textarea
                    value={formData.description_ru}
                    onChange={(e) => handleInputChange('description_ru', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Подробное описание продукта"
                  />
                </div>
              </div>
            </div>

            {/* 价格和其他信息 */}
            <div>
              <h3 className="text-lg font-medium mb-4">价格和设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    价格
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="25.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    价格区间
                  </label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => handleInputChange('price_range', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="20-30元/包"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    排序顺序
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* 图片上传 */}
            <div>
              <h3 className="text-lg font-medium mb-4">产品图片</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  主图片
                </label>
                
                {/* 检测旧的相对路径图片并显示警告 */}
                {formData.image_url && formData.image_url.startsWith('/images/') && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          图片需要升级
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>当前图片使用的是旧的相对路径，可能无法正常显示。建议重新上传图片以获得更好的存储和显示效果。</p>
                          <p className="mt-1 font-mono text-xs break-all">当前路径：{formData.image_url}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => handleInputChange('image_url', url)}
                  folder="products"
                  className="mb-4"
                />
                
                {/* 手动输入图片URL的选项 */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    或手动输入图片URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    支持 HTTPS 图片链接或上传的图片
                  </p>
                </div>
              </div>
            </div>

            {/* 状态设置 */}
            <div>
              <h3 className="text-lg font-medium mb-4">状态设置</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  启用产品（启用后在前端显示）
                </label>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <RiSave3Line className="mr-2" />
                {saving ? '保存中...' : (isEdit ? '更新产品' : '创建产品')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;