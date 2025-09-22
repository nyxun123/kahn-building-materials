import React, { useState, useEffect } from 'react';

interface ContactContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    working_hours: string;
  };
  map_embed: string;
  contact_form: {
    enabled: boolean;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      placeholder: string;
    }>;
  };
  social_links: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  images: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  created_at: string;
  updated_at: string;
}

interface ContactVersion {
  id: number;
  version: number;
  content: ContactContent;
  created_at: string;
  created_by: string;
  action: 'created' | 'updated' | 'published';
}

// 模拟数据
const mockContactContent: ContactContent = {
  id: 1,
  hero_title: "联系我们 - 专业墙纸胶制造商",
  hero_subtitle: "随时为您提供专业的墙纸胶解决方案和技术支持",
  hero_image: "/api/placeholder/1200/600",
  contact_info: {
    phone: "+86-400-123-4567",
    email: "info@wallpaperglue.com",
    address: "广东省佛山市南海区狮山镇科技工业园A区8号",
    working_hours: "周一至周五: 8:30-18:00, 周六: 9:00-17:00"
  },
  map_embed: '<iframe src="https://maps.google.com/maps?q=广东省佛山市南海区狮山镇科技工业园A区8号&output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
  contact_form: {
    enabled: true,
    fields: [
      { name: "name", type: "text", required: true, placeholder: "您的姓名" },
      { name: "email", type: "email", required: true, placeholder: "您的邮箱" },
      { name: "phone", type: "tel", required: false, placeholder: "联系电话" },
      { name: "company", type: "text", required: false, placeholder: "公司名称" },
      { name: "message", type: "textarea", required: true, placeholder: "请描述您的需求..." }
    ]
  },
  social_links: [
    { platform: "微信", url: "wechat:wallpaperglue", icon: "wechat" },
    { platform: "QQ", url: "tencent://message/?uin=123456789", icon: "qq" },
    { platform: "电话", url: "tel:+86-400-123-4567", icon: "phone" },
    { platform: "邮箱", url: "mailto:info@wallpaperglue.com", icon: "email" }
  ],
  faqs: [
    {
      question: "你们的最小起订量是多少？",
      answer: "我们的标准产品最小起订量为100桶，OEM定制产品最小起订量为500桶。"
    },
    {
      question: "交货周期是多久？",
      answer: "标准产品现货3-5天发货，定制产品根据数量不同，通常需要7-15天。"
    },
    {
      question: "是否提供样品？",
      answer: "是的，我们提供免费样品，但需要客户承担运费。"
    },
    {
      question: "产品保质期多久？",
      answer: "我们的产品保质期为24个月，建议在阴凉干燥处储存。"
    },
    {
      question: "是否提供技术支持？",
      answer: "是的，我们有专业的技术团队提供24小时技术支持服务。"
    }
  ],
  images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
  seo_title: "联系我们 - 专业墙纸胶制造商 | 24小时技术支持",
  seo_description: "联系专业墙纸胶制造商，获取产品咨询、技术支持和定制服务。我们提供24小时客户服务，随时为您解答疑问。",
  seo_keywords: "联系墙纸胶厂家,墙纸胶咨询,墙纸胶技术支持,墙纸胶定制服务",
  status: "published",
  version: 1,
  created_at: "2025-09-10 17:00:00",
  updated_at: "2025-09-10 17:00:00"
};

const mockVersions: ContactVersion[] = [
  {
    id: 1,
    version: 1,
    content: mockContactContent,
    created_at: "2025-09-10 17:00:00",
    created_by: "管理员",
    action: "created"
  }
];

export function AdminContact() {
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ContactContent>>({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    contact_info: {
      phone: '',
      email: '',
      address: '',
      working_hours: ''
    },
    map_embed: '',
    contact_form: {
      enabled: true,
      fields: []
    },
    social_links: [],
    faqs: [],
    images: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 'draft'
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setContactContent(mockContactContent);
      setFormData(mockContactContent);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setContactContent(formData as ContactContent);
      setIsSaving(false);
      alert('联系我们页面已更新！');
    }, 1000);
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      contact_info: {
        ...formData.contact_info!,
        [field]: value
      }
    });
  };

  const handleFormFieldChange = (index: number, field: string, value: string | boolean) => {
    const newFields = [...(formData.contact_form?.fields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData({
      ...formData,
      contact_form: {
        ...formData.contact_form!,
        fields: newFields
      }
    });
  };

  const addFormField = () => {
    setFormData({
      ...formData,
      contact_form: {
        ...formData.contact_form!,
        fields: [...(formData.contact_form?.fields || []), { name: '', type: 'text', required: false, placeholder: '' }]
      }
    });
  };

  const removeFormField = (index: number) => {
    const newFields = (formData.contact_form?.fields || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      contact_form: {
        ...formData.contact_form!,
        fields: newFields
      }
    });
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...(formData.social_links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, social_links: newLinks });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      social_links: [...(formData.social_links || []), { platform: '', url: '', icon: '' }]
    });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = (formData.social_links || []).filter((_, i) => i !== index);
    setFormData({ ...formData, social_links: newLinks });
  };

  const handleFAQChange = (index: number, field: string, value: string) => {
    const newFAQs = [...(formData.faqs || [])];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFormData({ ...formData, faqs: newFAQs });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...(formData.faqs || []), { question: '', answer: '' }]
    });
  };

  const removeFAQ = (index: number) => {
    const newFAQs = (formData.faqs || []).filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: newFAQs });
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
        <h1 className="text-3xl font-bold">联系我们管理</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">页面头部</h3>
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
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    placeholder="输入副标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">头部图片URL</label>
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">联系信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">电话</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contact_info?.phone || ''}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    placeholder="联系电话..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contact_info?.email || ''}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    placeholder="联系邮箱..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">地址</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contact_info?.address || ''}
                    onChange={(e) => handleContactInfoChange('address', e.target.value)}
                    placeholder="公司地址..."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">工作时间</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contact_info?.working_hours || ''}
                    onChange={(e) => handleContactInfoChange('working_hours', e.target.value)}
                    placeholder="工作时间..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">地图嵌入代码</h3>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.map_embed || ''}
                onChange={(e) => setFormData({ ...formData, map_embed: e.target.value })}
                placeholder="粘贴地图嵌入代码..."
                rows={4}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">联系表单</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.contact_form?.enabled || false}
                    />
                    启用联系表单
                  </label>
                </div>
                {(formData.contact_form?.fields || []).map((field, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">字段 {index + 1}</h4>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeFormField(index)}
                      >
                        删除
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={field.name}
                      onChange={(e) => handleFormFieldChange(index, 'name', e.target.value)}
                      placeholder="字段名称..."
                    />
                    <select
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={field.type}
                      onChange={(e) => handleFormFieldChange(index, 'type', e.target.value)}
                    >
                      <option value="text">文本</option>
                      <option value="email">邮箱</option>
                      <option value="tel">电话</option>
                      <option value="textarea">多行文本</option>
                    </select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={field.required}
                        onChange={(e) => handleFormFieldChange(index, 'required', e.target.checked)}
                      />
                      必填
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={field.placeholder}
                      onChange={(e) => handleFormFieldChange(index, 'placeholder', e.target.value)}
                      placeholder="占位符文本..."
                    />
                  </div>
                ))}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                  onClick={addFormField}
                >
                  添加字段
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">社交媒体链接</h3>
              {(formData.social_links || []).map((link, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">链接 {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeSocialLink(index)}
                    >
                      删除
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    placeholder="平台名称..."
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    placeholder="链接URL..."
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={link.icon}
                    onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                    placeholder="图标名称..."
                  />
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addSocialLink}
              >
                添加链接
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">常见问题</h3>
              {(formData.faqs || []).map((faq, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">FAQ {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeFAQ(index)}
                    >
                      删除
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                    placeholder="问题..."
                  />
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                    placeholder="答案..."
                    rows={3}
                  />
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addFAQ}
              >
                添加FAQ
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">页面图片</h3>
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
              <h2 className="text-2xl font-bold">联系我们预览</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">联系信息</h4>
                  <div className="space-y-2">
                    <p><strong>电话:</strong> {formData.contact_info?.phone}</p>
                    <p><strong>邮箱:</strong> {formData.contact_info?.email}</p>
                    <p><strong>地址:</strong> {formData.contact_info?.address}</p>
                    <p><strong>工作时间:</strong> {formData.contact_info?.working_hours}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">社交媒体</h4>
                  <div className="space-y-2">
                    {formData.social_links?.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <span className="font-medium mr-2">{link.platform}:</span>
                        <a href={link.url} className="text-blue-600 hover:underline">{link.url}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">常见问题</h4>
                <div className="space-y-4">
                  {formData.faqs?.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">{faq.question}</h5>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">页面图片</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((img, index) => (
                      <img key={index} src={img} alt={`Contact ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
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