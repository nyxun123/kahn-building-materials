import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';

interface OEMService {
  id: number;
  title: string;
  description: string;
  features: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  capabilities: string[];
  images: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  created_at: string;
  updated_at: string;
}

interface OEMVersion {
  id: number;
  version: number;
  content: OEMService;
  created_at: string;
  created_by: string;
  action: 'created' | 'updated' | 'published';
}

export function AdminOEM() {
  const [oemService, setOEMService] = useState<OEMService | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<OEMService>>({
    title: '',
    description: '',
    features: [],
    process: [],
    capabilities: [],
    images: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchOEMData();
  }, []);

  const fetchOEMData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/oem', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token') || 'admin-session'}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取OEM数据失败');
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setOEMService(result.data);
        setFormData(result.data);
      } else {
        // 如果没有数据，使用默认值
        const defaultData: OEMService = {
          id: 1,
          title: '',
          description: '',
          features: [],
          process: [],
          capabilities: [],
          images: [],
          seo_title: '',
          seo_description: '',
          seo_keywords: '',
          status: 'published',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setOEMService(defaultData);
        setFormData(defaultData);
      }
    } catch (error) {
      console.error('获取OEM数据失败:', error);
      toast.error('获取OEM数据失败');
      
      // 使用默认数据
      const defaultData: OEMService = {
        id: 1,
        title: '',
        description: '',
        features: [],
        process: [],
        capabilities: [],
        images: [],
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        status: 'published',
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setOEMService(defaultData);
      setFormData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('请填写服务标题');
      return;
    }

    console.log('🚀 开始保存OEM数据:', {
      title: formData.title,
      imagesCount: (formData.images || []).length,
      images: formData.images,
      allFormData: formData
    });

    setIsSaving(true);
    try {
      const saveData = {
        ...formData,
        id: oemService?.id || 1,
        // 确保images字段是一个有效的数组
        images: (formData.images || []).filter(img => img && img.trim() !== '')
      };

      console.log('📤 发送保存数据:', saveData);

      const response = await fetch('/api/admin/oem', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token') || 'admin-session'}`
        },
        body: JSON.stringify(saveData)
      });

      const result = await response.json();
      console.log('📝 保存响应:', result);

      if (response.ok && result.success) {
        toast.success('OEM服务信息已更新！');
        setOEMService(formData as OEMService);
        setIsEditing(false);
        console.log('✅ 保存成功');
      } else {
        throw new Error(result.error?.message || '保存失败');
      }
    } catch (error) {
      console.error('❌ 保存OEM数据失败:', error);
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), '']
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleProcessChange = (index: number, field: string, value: string) => {
    const newProcess = [...(formData.process || [])];
    newProcess[index] = { ...newProcess[index], [field]: value };
    setFormData({ ...formData, process: newProcess });
  };

  const addProcess = () => {
    setFormData({
      ...formData,
      process: [...(formData.process || []), { step: (formData.process?.length || 0) + 1, title: '', description: '' }]
    });
  };

  const removeProcess = (index: number) => {
    const newProcess = (formData.process || []).filter((_, i) => i !== index);
    setFormData({ ...formData, process: newProcess });
  };

  const handleCapabilityChange = (index: number, value: string) => {
    const newCapabilities = [...(formData.capabilities || [])];
    newCapabilities[index] = value;
    setFormData({ ...formData, capabilities: newCapabilities });
  };

  const addCapability = () => {
    setFormData({
      ...formData,
      capabilities: [...(formData.capabilities || []), '']
    });
  };

  const removeCapability = (index: number) => {
    const newCapabilities = (formData.capabilities || []).filter((_, i) => i !== index);
    setFormData({ ...formData, capabilities: newCapabilities });
  };

  const handleImageChange = (index: number, value: string) => {
    console.log('🔄 处理图片变更:', { index, value, currentImages: formData.images });

    const newImages = [...(formData.images || [])];

    // 确保数组有足够长度
    while (newImages.length <= index) {
      newImages.push('');
    }

    newImages[index] = value;
    console.log('📝 更新后的图片数组:', newImages);

    setFormData({ ...formData, images: newImages });

    // 实时验证图片URL是否有效
    if (value && value.startsWith('https://')) {
      console.log('🔍 验证图片URL:', value);
      const img = new Image();
      img.onload = () => console.log('✅ 图片URL验证成功');
      img.onerror = () => console.warn('⚠️ 图片URL可能无效');
      img.src = value;
    }
  };

  const addImage = () => {
    const newImages = [...(formData.images || []), ''];
    console.log('➕ 添加新图片槽位，当前图片数组:', newImages);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">OEM服务管理</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            编辑内容
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => setPreviewOpen(true)}
          >
            预览
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            内容编辑
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('seo')}
          >
            SEO设置
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            版本历史
          </button>
        </nav>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">服务介绍</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">服务标题</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="输入服务标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">服务描述</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="输入服务描述..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">服务特色</h3>
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="输入特色..."
                  />
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeFeature(index)}
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addFeature}
              >
                添加特色
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">服务流程</h3>
              {(formData.process || []).map((process, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">步骤 {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeProcess(index)}
                    >
                      删除
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={process.title}
                    onChange={(e) => handleProcessChange(index, 'title', e.target.value)}
                    placeholder="步骤标题..."
                  />
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={process.description}
                    onChange={(e) => handleProcessChange(index, 'description', e.target.value)}
                    placeholder="步骤描述..."
                    rows={2}
                  />
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addProcess}
              >
                添加步骤
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">生产能力</h3>
              {(formData.capabilities || []).map((capability, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={capability}
                    onChange={(e) => handleCapabilityChange(index, e.target.value)}
                    placeholder="输入能力..."
                  />
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeCapability(index)}
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addCapability}
              >
                添加能力
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                服务图片
                <span className="text-sm text-gray-500 ml-2">
                  (当前 {(formData.images || []).length} 张图片)
                </span>
              </h3>

              {/* 调试信息 */}
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="text-xs text-gray-600">
                  <p><strong>调试信息:</strong></p>
                  <p>当前图片数组: {JSON.stringify(formData.images || [])}</p>
                  <p>数组长度: {(formData.images || []).length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(formData.images || []).map((image, index) => (
                  <div key={index} className="relative border border-gray-200 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">
                      图片 #{index + 1}: {image ? '已上传' : '等待上传'}
                    </div>
                    <ImageUpload
                      value={image}
                      onChange={(url) => handleImageChange(index, url)}
                      folder="oem"
                      className="w-full"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addImage}
              >
                添加图片
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">状态设置</h3>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">SEO设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">SEO标题</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.seo_title || ''}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="SEO标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SEO描述</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.seo_description || ''}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="SEO描述..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SEO关键词</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.seo_keywords || ''}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    placeholder="关键词用逗号分隔..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">版本历史</h3>
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-8">
                  <p>暂无版本历史记录</p>
                  <p className="text-sm mt-2">功能开发中...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 预览模态框 */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">OEM服务预览</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setPreviewOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{formData.title}</h3>
              <p className="text-gray-600">{formData.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2">服务特色</h4>
                <ul className="list-disc list-inside space-y-1">
                  {formData.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">服务流程</h4>
                <div className="space-y-2">
                  {formData.process?.map((process, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                        {process.step}
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium">{process.title}</h5>
                        <p className="text-sm text-gray-600">{process.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">生产能力</h4>
                <ul className="list-disc list-inside space-y-1">
                  {formData.capabilities?.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">服务图片</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((img, index) => (
                      <img key={index} src={img} alt={`Service ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}