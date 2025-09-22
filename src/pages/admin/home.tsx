import React, { useState, useEffect } from 'react';

interface HomeContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  version: number;
}

interface HomeVersion {
  id: number;
  version: number;
  content: HomeContent;
  created_at: string;
  created_by: string;
}

// 模拟数据
const mockContent: HomeContent = {
  id: 1,
  hero_title: "专业墙纸胶解决方案",
  hero_subtitle: "为全球市场提供高品质墙纸胶产品，包括OEM/ODM服务",
  hero_image: "/api/placeholder/1200/600",
  features: [
    { title: "高强度粘合", description: "超强粘合力，持久耐用", icon: "strength" },
    { title: "环保配方", description: "无毒无害，安全环保", icon: "eco" },
    { title: "快速施工", description: "易于使用，提高施工效率", icon: "speed" }
  ],
  seo_title: "专业墙纸胶制造商 - 高强度环保墙纸胶",
  seo_description: "我们提供专业的墙纸胶解决方案，包括高强度、环保、快速施工的墙纸胶产品，支持OEM/ODM服务。",
  seo_keywords: "墙纸胶,高强度墙纸胶,环保墙纸胶,OEM墙纸胶,墙纸胶制造商",
  version: 1
};

const mockVersions: HomeVersion[] = [
  {
    id: 1,
    version: 1,
    content: mockContent,
    created_at: "2025-09-10 13:00:00",
    created_by: "管理员"
  }
];

export function AdminHome() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<HomeContent>>({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    features: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFormData({
        hero_title: mockContent.hero_title,
        hero_subtitle: mockContent.hero_subtitle,
        hero_image: mockContent.hero_image,
        features: mockContent.features || [],
        seo_title: mockContent.seo_title,
        seo_description: mockContent.seo_description,
        seo_keywords: mockContent.seo_keywords,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('首页内容已更新！');
    }, 1000);
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), { title: '', description: '', icon: '' }],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
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
        <h1 className="text-3xl font-bold">首页管理</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPreviewOpen(true)}
            disabled={isSaving}
          >
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            预览
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="h-4 w-4 inline mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            保存
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
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            版本历史
          </button>
        </nav>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">英雄区域</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">主标题</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.hero_title || ''}
                    onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                    placeholder="输入主标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">副标题</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    placeholder="输入副标题..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">英雄图片URL</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.hero_image || ''}
                    onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                    placeholder="输入图片URL..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">特色功能</h3>
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="space-y-4 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">功能 {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-800 text-sm"
                      onClick={() => removeFeature(index)}
                    >
                      删除
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">标题</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="功能标题..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">描述</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="功能描述..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">图标</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={feature.icon}
                      onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                      placeholder="图标名称..."
                    />
                  </div>
                </div>
              ))}
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={addFeature}
              >
                添加功能
              </button>
            </div>
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
                        创建时间: {version.created_at} | 创建者: {version.created_by}
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
              <h2 className="text-2xl font-bold">首页预览</h2>
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
              <div>
                <h3 className="text-xl font-semibold mb-2">{formData.hero_title}</h3>
                <p className="text-gray-600 mb-4">{formData.hero_subtitle}</p>
                {formData.hero_image && (
                  <img src={formData.hero_image} alt="Hero" className="w-full h-64 object-cover rounded-lg" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">特色功能</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.features?.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h5 className="font-medium">{feature.title}</h5>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}