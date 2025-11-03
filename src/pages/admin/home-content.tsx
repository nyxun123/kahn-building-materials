import { useState, useEffect } from "react";
import {
  Card,
  Flex,
  Text,
  Textarea,
  Button,
  Title,
  TextInput,
  Badge,
  Select,
  SelectItem,
} from "@tremor/react";
import { useList, useUpdate, useCreate } from "@refinedev/core";
import { Save, XCircle, Video, Package, Factory } from "lucide-react";
import { toast } from "react-hot-toast";
// 使用新的组件库
import {
  MultiLangMediaUpload,
  TabLangInput,
  InlineLangInput,
  FormSection,
  FormField,
  PageHeader,
  PageContent,
} from "@/components/admin";
import { MediaUpload } from "@/components/admin/upload/MediaUpload";

const HOME_SECTIONS = [
  { key: "video", label: "演示视频", icon: <Video className="h-4 w-4" /> },
  { key: "oem", label: "OEM定制", icon: <Factory className="h-4 w-4" /> },
  { key: "semi", label: "半成品小袋", icon: <Package className="h-4 w-4" /> },
];

const CONTENT_FIELDS = [
  { key: "title", label: "标题" },
  { key: "subtitle", label: "副标题" },
  { key: "description", label: "描述" },
  { key: "url", label: "链接/URL" },
  { key: "image", label: "图片", type: "image" },
  { key: "video", label: "视频", type: "video" }, // 添加视频字段
];

// 旧的CompactImageUploadButton已移除，使用新的StandardUploadButton组件

function HomeContentManager() {
  const [activeSection, setActiveSection] = useState("video");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    content_zh: "",
    content_en: "",
    content_ru: "",
  });

  const { data, refetch, isLoading } = useList({
    resource: "home-content",
    pagination: {
      pageSize: 100,
    },
    meta: {
      query: { page_key: "home" },
    },
    queryOptions: {
      keepPreviousData: true,
      staleTime: 60_000,
    },
  });

  const { mutate: updateContent, isLoading: saving } = useUpdate();
  const { mutate: createContent, isLoading: creating } = useCreate();

  const records = data?.data ?? [];

  // 获取特定板块的内容
  const getSectionContent = (sectionKey: string) => {
    return records.filter((record: any) => 
      record.section_key.startsWith(sectionKey + "_")
    );
  };

  // 获取特定字段的内容
  const getFieldContent = (sectionKey: string, fieldKey: string) => {
    return records.find((record: any) => 
      record.section_key === `${sectionKey}_${fieldKey}`
    );
  };

  useEffect(() => {
    if (editingField) {
      const current = getFieldContent(activeSection, editingField);
      if (current) {
        setFormState({
          content_zh: current.content_zh || "",
          content_en: current.content_en || "",
          content_ru: current.content_ru || "",
        });
      } else {
        setFormState({
          content_zh: "",
          content_en: "",
          content_ru: "",
        });
      }
    }
  }, [activeSection, editingField, records]);

  const handleEdit = (fieldKey: string) => {
    setEditingField(fieldKey);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleSave = async () => {
    if (!editingField) {
      console.error('❌ 没有编辑中的字段');
      return;
    }

    console.log('🚀 开始保存操作:', {
      activeSection,
      editingField,
      formState,
      hasContentZh: !!formState.content_zh,
      hasContentEn: !!formState.content_en,
      hasContentRu: !!formState.content_ru
    });

    const sectionContent = getFieldContent(activeSection, editingField);

    const contentData = {
      page_key: "home",
      section_key: `${activeSection}_${editingField}`,
      content_zh: formState.content_zh || "",
      content_en: formState.content_en || "",
      content_ru: formState.content_ru || "",
      // 根据字段类型设置content_type
      ...(editingField === "image" && { content_type: "image" }),
      ...(editingField === "video" && { content_type: "video" }),
      ...(editingField === "url" && { content_type: "url" }),
      ...(editingField === "title" && { content_type: "title" }),
      ...(editingField === "subtitle" && { content_type: "subtitle" }),
      ...(editingField === "description" && { content_type: "description" }),
    };

    console.log('📦 准备保存的数据:', contentData);

    // 使用 AuthManager 获取有效的 JWT Token
    const getAuthToken = async () => {
      try {
        const { AuthManager } = await import('@/lib/auth-manager');
        const token = await AuthManager.getValidAccessToken();
        
        if (token) {
          console.log('✅ 使用 AuthManager 获取的 JWT Token');
          return token;
        }
        
        // 回退到直接从 localStorage 读取
        const directToken = localStorage.getItem('admin_access_token');
        if (directToken) {
          console.log('⚠️ 使用直接读取的 Token');
          return directToken;
        }
        
        // 兼容旧的存储方式
        const adminAuth = localStorage.getItem("admin-auth");
        if (adminAuth) {
          try {
            const parsed = JSON.parse(adminAuth);
            if (parsed?.accessToken) {
              console.log('⚠️ 使用兼容模式 accessToken');
              return parsed.accessToken;
            }
            if (parsed?.token) {
              console.log('⚠️ 使用兼容模式 token');
              return parsed.token;
            }
          } catch (error) {
            console.warn("解析 admin-auth 失败", error);
          }
        }
        
        throw new Error('未找到有效的认证Token');
      } catch (error) {
        console.error('❌ 获取认证Token失败:', error);
        throw new Error('未登录或登录已过期，请重新登录后再试');
      }
    };

    const authToken = await getAuthToken();
    const apiUrl = sectionContent
      ? `/api/admin/home-content/${sectionContent.id}`
      : `/api/admin/home-content`;
    
    const method = sectionContent ? 'PUT' : 'POST';

    console.log('🌐 发送直接API请求:', {
      url: apiUrl,
      method,
      authToken: authToken.substring(0, 10) + '...',
      hasData: !!contentData
    });

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(contentData)
      });

      console.log('📝 API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API响应错误:', errorText);
        throw new Error(`保存失败 (${response.status}): ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ 保存成功响应:', result);

      // 保存成功后的处理
      setEditingField(null);
      await refetch();
      alert('保存成功！');

    } catch (error) {
      console.error('💥 保存操作失败:', {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      alert(`保存失败: ${errorMessage}`);
    }
  };

  // 旧的VideoUpload组件已移除，使用新的MediaUpload组件

  const currentSection = HOME_SECTIONS.find(s => s.key === activeSection);
  
  return (
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="首页内容管理"
          description="管理首页演示视频、OEM定制、半成品小袋板块内容"
        />

      <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">选择板块</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOME_SECTIONS.map((section) => (
              <Card
                key={section.key}
                className={`
                  cursor-pointer border-2 transition-all duration-200
                  ${activeSection === section.key 
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md" 
                    : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                  }
                `}
                onClick={() => {
                  setActiveSection(section.key);
                  setEditingField(null);
                }}
              >
                <Flex alignItems="center" className="gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${activeSection === section.key 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                      : "bg-gray-100 text-gray-600"
                    }
                  `}>
                    {section.icon}
                  </div>
                  <Text className={`font-semibold ${
                    activeSection === section.key ? "text-indigo-700" : "text-gray-900"
                  }`}>
                    {section.label}
                  </Text>
                </Flex>
              </Card>
            ))}
          </div>
        </div>

        {currentSection && (
          <div>
            <Flex justifyContent="between" alignItems="center" className="mb-4">
              <Text className="text-lg font-semibold text-slate-900">
                {currentSection.label}板块内容
              </Text>
              <Badge color="indigo">
                {getSectionContent(activeSection).length} 个内容项
              </Badge>
            </Flex>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTENT_FIELDS.map((field) => {
                // 只在特定板块显示特定字段
                if (field.key === "video" && activeSection !== "video") return null;
                if (field.key === "image" && activeSection === "video") return null;
                
                const fieldContent = getFieldContent(activeSection, field.key);
                const isEditing = editingField === field.key;
                
                return (
                  <Card 
                    key={field.key} 
                    className={`
                      bg-white rounded-xl border-2 transition-all duration-300
                      ${isEditing 
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg" 
                        : "border-gray-200 hover:border-indigo-200 hover:shadow-md"
                      }
                    `}
                  >
                    <Flex justifyContent="between" alignItems="start" className="mb-3">
                      <Text className="font-medium text-slate-900">{field.label}</Text>
                      <Button 
                        size="xs" 
                        variant="light"
                        onClick={() => handleEdit(field.key)}
                      >
                        {isEditing ? "编辑中..." : "编辑"}
                      </Button>
                    </Flex>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        {field.type === "image" ? (
                          // 使用新的MultiLangMediaUpload组件
                          <MultiLangMediaUpload
                            values={{
                              zh: formState.content_zh,
                              en: formState.content_en,
                              ru: formState.content_ru,
                            }}
                            onChange={(lang, url) => {
                              setFormState(prev => ({
                                ...prev,
                                [`content_${lang}`]: url,
                              }));
                            }}
                            folder={`home/${activeSection}`}
                            type="image"
                            label="图片上传"
                          />
                        ) : field.type === "video" ? (
                          // 使用新的MultiLangMediaUpload组件（视频）
                          <MultiLangMediaUpload
                            values={{
                              zh: formState.content_zh,
                              en: formState.content_en,
                              ru: formState.content_ru,
                            }}
                            onChange={(lang, url) => {
                              setFormState(prev => ({
                                ...prev,
                                [`content_${lang}`]: url,
                              }));
                            }}
                            folder="home/video"
                            type="video"
                            label="视频上传"
                          />
                        ) : (
                          // 使用新的TabLangInput组件（文本字段）
                          <TabLangInput
                            label={field.label}
                            values={{
                              zh: formState.content_zh,
                              en: formState.content_en,
                              ru: formState.content_ru,
                            }}
                            onChange={(lang, value) => {
                              setFormState(prev => ({
                                ...prev,
                                [`content_${lang}`]: value,
                              }));
                            }}
                            type={field.key === "description" ? "textarea" : "text"}
                          />
                        )}
                        <Flex justifyContent="end" className="gap-2 mt-2">
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={XCircle}
                            onClick={handleCancel}
                            disabled={saving || creating}
                          >
                            取消
                          </Button>
                          <Button
                            size="xs"
                            icon={Save}
                            loading={saving || creating}
                            disabled={saving || creating}
                            onClick={handleSave}
                            className="min-w-[80px]"
                          >
                            {saving || creating ? '保存中...' : '保存'}
                          </Button>
                        </Flex>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {field.type === "image" ? (
                          // 图片预览
                          <>
                            {fieldContent?.content_zh ? (
                              <div className="space-y-2">
                                <div>
                                  <Text className="text-xs text-slate-500">中文</Text>
                                  <div className="mt-1">
                                    <img 
                                      src={fieldContent.content_zh} 
                                      alt="预览" 
                                      className="max-h-32 object-contain rounded border"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </div>
                                {fieldContent.content_en && (
                                  <div>
                                    <Text className="text-xs text-slate-500">英文</Text>
                                    <Text className="block mt-1 text-slate-700 line-clamp-1">
                                      {fieldContent.content_en}
                                    </Text>
                                  </div>
                                )}
                                {fieldContent.content_ru && (
                                  <div>
                                    <Text className="text-xs text-slate-500">俄文</Text>
                                    <Text className="block mt-1 text-slate-700 line-clamp-1">
                                      {fieldContent.content_ru}
                                    </Text>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Text className="text-slate-500 italic">未设置图片</Text>
                            )}
                          </>
                        ) : field.type === "video" ? (
                          // 视频链接显示
                          <>
                            {fieldContent?.content_zh ? (
                              <div className="space-y-2">
                                <div>
                                  <Text className="text-xs text-slate-500">中文</Text>
                                  <TextInput 
                                    value={fieldContent.content_zh} 
                                    readOnly
                                    className="mt-1"
                                  />
                                </div>
                                {fieldContent.content_en && (
                                  <div>
                                    <Text className="text-xs text-slate-500">英文</Text>
                                    <TextInput 
                                      value={fieldContent.content_en} 
                                      readOnly
                                      className="mt-1"
                                    />
                                  </div>
                                )}
                                {fieldContent.content_ru && (
                                  <div>
                                    <Text className="text-xs text-slate-500">俄文</Text>
                                    <TextInput 
                                      value={fieldContent.content_ru} 
                                      readOnly
                                      className="mt-1"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Text className="text-slate-500 italic">未设置视频</Text>
                            )}
                          </>
                        ) : (
                          // 普通文本内容
                          <>
                            <div className="text-sm">
                              <Text className="text-xs text-slate-500">中文</Text>
                              <Text className="block mt-1 text-slate-700 line-clamp-2">
                                {fieldContent?.content_zh || "未设置"}
                              </Text>
                            </div>
                            <div className="text-sm">
                              <Text className="text-xs text-slate-500">英文</Text>
                              <Text className="block mt-1 text-slate-700 line-clamp-2">
                                {fieldContent?.content_en || "未设置"}
                              </Text>
                            </div>
                            <div className="text-sm">
                              <Text className="text-xs text-slate-500">俄文</Text>
                              <Text className="block mt-1 text-slate-700 line-clamp-2">
                                {fieldContent?.content_ru || "未设置"}
                              </Text>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>
      </div>
    </PageContent>
  );
}

export default HomeContentManager;