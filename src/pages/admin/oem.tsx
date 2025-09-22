import React, { useState, useEffect } from 'react';

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

// 模拟数据
const mockOEMServices: OEMService[] = [
  {
    id: 1,
    title: "OEM/ODM 墙纸胶定制服务",
    description: "为品牌商和经销商提供专业的墙纸胶OEM/ODM定制服务，从配方研发到包装设计的一站式解决方案",
    features: [
      "专业研发团队",
      "先进生产设备",
      "严格质量控制",
      "个性化包装",
      "快速交付",
      "技术支持"
    ],
    process: [
      {
        step: 1,
        title: "需求沟通",
        description: "详细了解客户需求，包括产品规格、包装要求、数量等"
      },
      {
        step: 2,
        title: "配方研发",
        description: "根据需求进行配方设计和样品制作"
      },
      {
        step: 3,
        title: "样品确认",
        description: "客户确认样品，进行必要的调整"
      },
      {
        step: 4,
        title: "批量生产",
        description: "确认订单后进行批量生产"
      },
      {
        step: 5,
        title: "质量检测",
        description: "严格的质量检测确保产品符合标准"
      },
      {
        step: 6,
        title: "包装发货",
        description: "按客户要求进行包装并安排发货"
      }
    ],
    capabilities: [
      "年产能10000吨",
      "10条自动化生产线",
      "ISO9001认证",
      "SGS环保认证",
      "专业质检团队",
      "24小时技术支持"
    ],
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    seo_title: "OEM/ODM墙纸胶定制服务 - 专业墙纸胶代工生产厂家",
    seo_description: "提供专业的墙纸胶OEM/ODM定制服务，拥有先进生产设备和专业研发团队，支持个性化包装和快速交付。",
    seo_keywords: "墙纸胶OEM,墙纸胶ODM,墙纸胶代工,定制墙纸胶,墙纸胶生产厂家",
    status: "published",
    version: 1,
    created_at: "2025-09-10 15:00:00",
    updated_at: "2025-09-10 15:00:00"
  }
];

const mockVersions: OEMVersion[] = [
  {
    id: 1,
    version: 1,
    content: mockOEMServices[0],
    created_at: "2025-09-10 15:00:00",
    created_by: "管理员",
    action: "created"
  }
];

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
    setIsLoading(true);
    setTimeout(() => {
      setOEMService(mockOEMServices[0]);
      setFormData(mockOEMServices[0]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setOEMService(formData as OEMService);
      setIsSaving(false);
      alert('OEM服务信息已更新！');
    }, 1000);
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
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...(formData.images || []), '']
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">服务图片</h3>
              {(formData.images || []).map((image, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="输入图片URL..."
                  />
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeImage(index)}
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
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
                {mockVersions.map((version) => (
                  <div key={version.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">版本 {version.version}</p>
                      <p className="text-sm text-gray-600">
                        创建时间: {version.created_at} | 创建者: {version.created_by} | 操作: {version.action}
                      </p>
                    </div>
                    <button
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setFormData(version.content);
                        alert('已加载版本 ' + version.version);
                      }}
                    >
                      恢复此版本
                    </button>
                  </div>
                ))}
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