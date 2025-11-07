import React, { useState, useEffect } from 'react';

interface AboutContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  company_story: string;
  mission: string;
  vision: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  team: Array<{
    name: string;
    position: string;
    bio: string;
    image: string;
  }>;
  milestones: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  certifications: string[];
  images: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  created_at: string;
  updated_at: string;
}

interface AboutVersion {
  id: number;
  version: number;
  content: AboutContent;
  created_at: string;
  created_by: string;
  action: 'created' | 'updated' | 'published';
}

// 模拟数据
const mockAboutContent: AboutContent = {
  id: 1,
  hero_title: "关于我们 - 专业墙纸胶制造商",
  hero_subtitle: "20年专注墙纸胶研发与生产，为全球客户提供高品质粘合解决方案",
  hero_image: "/api/placeholder/1200/600",
  company_story: "我们成立于2005年，专注于墙纸胶的研发、生产和销售。经过20年的发展，已成为行业领先的墙纸胶制造商，产品远销全球50多个国家和地区。我们始终坚持'质量第一，客户至上'的经营理念，致力于为客户提供最优质的墙纸胶产品和解决方案。",
  mission: "通过持续创新和卓越品质，成为全球最受信赖的墙纸胶供应商，为客户创造更大价值。",
  vision: "成为全球墙纸胶行业的领导者，推动行业技术进步和可持续发展。",
  values: [
    {
      title: "质量至上",
      description: "严格的质量控制体系，确保每一批产品都符合最高标准",
      icon: "quality"
    },
    {
      title: "客户第一",
      description: "以客户需求为中心，提供个性化的解决方案和优质服务",
      icon: "customer"
    },
    {
      title: "持续创新",
      description: "不断投入研发，推动产品技术升级和工艺改进",
      icon: "innovation"
    },
    {
      title: "诚信经营",
      description: "坚持诚信为本，建立长期稳定的合作关系",
      icon: "integrity"
    }
  ],
  team: [
    {
      name: "张明华",
      position: "创始人 & CEO",
      bio: "拥有25年墙纸胶行业经验，曾主导多个重大技术突破",
      image: "/api/placeholder/200/200"
    },
    {
      name: "李建国",
      position: "技术总监",
      bio: "化学工程博士，专注于环保粘合剂研发15年",
      image: "/api/placeholder/200/200"
    },
    {
      name: "王小红",
      position: "生产总监",
      bio: "15年生产管理经验，精通现代化生产工艺",
      image: "/api/placeholder/200/200"
    }
  ],
  milestones: [
    {
      year: "2005",
      title: "公司成立",
      description: "在广东省成立，开始墙纸胶生产"
    },
    {
      year: "2010",
      title: "扩大生产",
      description: "建立新厂房，年产能达到5000吨"
    },
    {
      year: "2015",
      title: "技术突破",
      description: "成功研发环保型墙纸胶，获得多项专利"
    },
    {
      year: "2020",
      title: "国际认证",
      description: "通过多项国内质量检测认证，产品出口欧美"
    },
    {
      year: "2024",
      title: "智能化升级",
      description: "完成智能化工厂改造，年产能突破10000吨"
    }
  ],
  certifications: [
    "全程质量控制体系",
    "国家环保标准认证",
    "SGS环保认证",
    "CE认证",
    "RoHS认证"
  ],
  images: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
  seo_title: "关于我们 - 专业墙纸胶制造商 | 20年行业经验",
  seo_description: "了解我们的公司历史、使命愿景、核心团队和20年专注墙纸胶制造的丰富经验。我们是值得信赖的专业墙纸胶供应商。",
  seo_keywords: "墙纸胶制造商,墙纸胶工厂,墙纸胶公司,专业墙纸胶,墙纸胶供应商",
  status: "published",
  version: 1,
  created_at: "2025-09-10 16:00:00",
  updated_at: "2025-09-10 16:00:00"
};

const mockVersions: AboutVersion[] = [
  {
    id: 1,
    version: 1,
    content: mockAboutContent,
    created_at: "2025-09-10 16:00:00",
    created_by: "管理员",
    action: "created"
  }
];

export function AdminAbout() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AboutContent>>({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    company_story: '',
    mission: '',
    vision: '',
    values: [],
    team: [],
    milestones: [],
    certifications: [],
    images: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 'draft'
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAboutContent(mockAboutContent);
      setFormData(mockAboutContent);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setAboutContent(formData as AboutContent);
      setIsSaving(false);
      alert('关于我们页面已更新！');
    }, 1000);
  };

  const handleValueChange = (index: number, field: string, value: string) => {
    const newValues = [...(formData.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    setFormData({ ...formData, values: newValues });
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values: [...(formData.values || []), { title: '', description: '', icon: '' }]
    });
  };

  const removeValue = (index: number) => {
    const newValues = (formData.values || []).filter((_, i) => i !== index);
    setFormData({ ...formData, values: newValues });
  };

  const handleTeamChange = (index: number, field: string, value: string) => {
    const newTeam = [...(formData.team || [])];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setFormData({ ...formData, team: newTeam });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [...(formData.team || []), { name: '', position: '', bio: '', image: '' }]
    });
  };

  const removeTeamMember = (index: number) => {
    const newTeam = (formData.team || []).filter((_, i) => i !== index);
    setFormData({ ...formData, team: newTeam });
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const newMilestones = [...(formData.milestones || [])];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
  };

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...(formData.milestones || []), { year: '', title: '', description: '' }]
    });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = (formData.milestones || []).filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones });
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCertifications = [...(formData.certifications || [])];
    newCertifications[index] = value;
    setFormData({ ...formData, certifications: newCertifications });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...(formData.certifications || []), '']
    });
  };

  const removeCertification = (index: number) => {
    const newCertifications = (formData.certifications || []).filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: newCertifications });
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
        <h1 className="text-3xl font-bold">关于我们管理</h1>
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">公司故事</h3>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.company_story || ''}
                onChange={(e) => setFormData({ ...formData, company_story: e.target.value })}
                placeholder="输入公司故事..."
                rows={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">使命</h3>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.mission || ''}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  placeholder="输入公司使命..."
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">愿景</h3>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.vision || ''}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="输入公司愿景..."
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">价值观</h3>
                {(formData.values || []).map((value, index) => (
                  <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">价值观 {index + 1}</h4>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeValue(index)}
                      >
                        删除
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={value.title}
                      onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                      placeholder="价值观标题..."
                    />
                    <textarea
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                      placeholder="价值观描述..."
                      rows={2}
                    />
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={value.icon}
                      onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                      placeholder="图标名称..."
                    />
                  </div>
                ))}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                  onClick={addValue}
                >
                  添加价值观
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">团队成员</h3>
              {(formData.team || []).map((member, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">团队成员 {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeTeamMember(index)}
                    >
                      删除
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={member.name}
                    onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                    placeholder="姓名..."
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={member.position}
                    onChange={(e) => handleTeamChange(index, 'position', e.target.value)}
                    placeholder="职位..."
                  />
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={member.bio}
                    onChange={(e) => handleTeamChange(index, 'bio', e.target.value)}
                    placeholder="简介..."
                    rows={2}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={member.image}
                    onChange={(e) => handleTeamChange(index, 'image', e.target.value)}
                    placeholder="图片URL..."
                  />
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addTeamMember}
              >
                添加团队成员
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">发展历程</h3>
              {(formData.milestones || []).map((milestone, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">里程碑 {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeMilestone(index)}
                    >
                      删除
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={milestone.year}
                    onChange={(e) => handleMilestoneChange(index, 'year', e.target.value)}
                    placeholder="年份..."
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    placeholder="标题..."
                  />
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    placeholder="描述..."
                    rows={2}
                  />
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addMilestone}
              >
                添加里程碑
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">认证资质</h3>
              {(formData.certifications || []).map((cert, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={cert}
                    onChange={(e) => handleCertificationChange(index, e.target.value)}
                    placeholder="输入认证..."
                  />
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeCertification(index)}
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={addCertification}
              >
                添加认证
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
              <h2 className="text-2xl font-bold">关于我们预览</h2>
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
                <h4 className="font-semibold mb-2">公司故事</h4>
                <p className="text-gray-700">{formData.company_story}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">使命</h4>
                  <p className="text-gray-700">{formData.mission}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">愿景</h4>
                  <p className="text-gray-700">{formData.vision}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">核心价值观</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.values?.map((value, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h5 className="font-medium">{value.title}</h5>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">核心团队</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.team?.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center">
                      <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                      <h5 className="font-medium">{member.name}</h5>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">发展历程</h4>
                <div className="space-y-4">
                  {formData.milestones?.map((milestone, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-16 text-right pr-4">
                        <span className="font-semibold">{milestone.year}</span>
                      </div>
                      <div className="flex-1 border-l-2 border-blue-500 pl-4">
                        <h5 className="font-medium">{milestone.title}</h5>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">认证资质</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications?.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {cert}
                    </span>
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