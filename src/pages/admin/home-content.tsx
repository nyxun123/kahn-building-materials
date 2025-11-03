import { useState, useEffect, useRef } from "react";
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
import { Save, XCircle, Plus, Video, Package, Factory } from "lucide-react";
import { toast } from "react-hot-toast";
import { RiUpload2Line, RiLoader4Line } from "react-icons/ri";
import { uploadService } from "@/lib/upload-service";

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

// 紧凑的上传按钮组件
function CompactImageUploadButton({ 
  onUpload, 
  folder, 
  className = "" 
}: { 
  onUpload: (url: string) => void; 
  folder: string;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      
      const result = await uploadService.uploadWithRetry(file, {
        folder,
        maxSize: 5,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });

      onUpload(result.url);
      toast.success('图片上传成功！');
      
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      toast.error(error instanceof Error ? error.message : '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        size="sm"
        variant="light"
        className="min-w-[100px]"
      >
        {uploading ? (
          <>
            <RiLoader4Line className="mr-1 animate-spin" />
            上传中...
          </>
        ) : (
          <>
            <RiUpload2Line className="mr-1" />
            上传图片
          </>
        )}
      </Button>
    </div>
  );
}

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

  // 自定义视频上传组件
  const VideoUpload = ({ value, onChange, folder = "home/video" }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      console.log('🎬 开始视频上传:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder
      });

      // 验证文件类型
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mov', 'video/avi'];
      if (!allowedTypes.includes(file.type)) {
        alert('请上传支持的视频格式 (MP4, WebM, OGG, MOV, AVI)');
        return;
      }

      // 验证文件大小 (100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('文件大小不能超过100MB');
        return;
      }

      try {
        setUploading(true);
        setUploadProgress(0);

        // 使用统一的上传服务
        const { uploadService } = await import('@/lib/upload-service');
        console.log('📤 调用上传服务...');

        const result = await uploadService.uploadVideo(file, {
          folder,
          maxSize: 100,
          allowedTypes: allowedTypes
        });

        console.log('✅ 视频上传成功:', result);
        onChange(result.url);

        // 更好的成功提示
        const fileSize = (result.fileSize / 1024 / 1024).toFixed(2);
        alert(`视频上传成功！\n文件名: ${result.fileName}\n大小: ${fileSize}MB\n上传方式: ${result.uploadMethod === 'cloudflare' ? '云端存储' : '本地存储'}`);

      } catch (error) {
        console.error('❌ 视频上传失败:', error);
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        alert(`视频上传失败: ${errorMessage}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };
    
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
          disabled={uploading}
        />
        <label
          htmlFor="video-upload"
          className={`cursor-pointer flex flex-col items-center justify-center ${uploading ? 'opacity-50' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <Text className="text-sm text-gray-600 mb-2">上传中...</Text>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <Text className="text-xs text-gray-500 mt-2">{uploadProgress}%</Text>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Video className="h-8 w-8 text-gray-400 mb-2" />
              <Text className="text-sm font-medium text-gray-600">点击上传视频</Text>
              <Text className="text-xs text-gray-500 mt-1">支持 MP4, WebM, OGG, MOV, AVI 格式</Text>
              <Text className="text-xs text-gray-400 mt-1">最大文件大小: 100MB</Text>
            </div>
          )}
        </label>
        {value && (
          <div className="mt-3 text-left">
            <Text className="text-xs text-gray-500 mb-1">已上传视频链接:</Text>
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1"
              placeholder="视频URL将显示在这里"
            />
            {value && (
              <div className="mt-2">
                <Text className="text-xs text-blue-600">✅ 视频已上传</Text>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const currentSection = HOME_SECTIONS.find(s => s.key === activeSection);
  
  return (
    <div className="space-y-6">
      <div>
        <Text className="text-2xl font-bold text-slate-900">首页内容管理</Text>
        <Text className="text-slate-500">管理首页演示视频、OEM定制、半成品小袋板块内容</Text>
      </div>

      <Card>
        <div className="mb-6">
          <Text className="text-lg font-semibold text-slate-900 mb-4">选择板块</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOME_SECTIONS.map((section) => (
              <Card
                key={section.key}
                className={`cursor-pointer border transition hover:shadow-sm ${
                  activeSection === section.key 
                    ? "border-indigo-300 bg-indigo-50" 
                    : "border-slate-200"
                }`}
                onClick={() => {
                  setActiveSection(section.key);
                  setEditingField(null);
                }}
              >
                <Flex alignItems="center" className="gap-3">
                  {section.icon}
                  <Text className="font-medium text-slate-900">{section.label}</Text>
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
                    className={`border transition ${
                      isEditing 
                        ? "border-indigo-300 bg-indigo-50" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
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
                          // 多语言图片上传字段 - URL输入框 + 上传按钮
                          <div className="space-y-4">
                            <Text className="text-xs text-slate-500 mb-3">为每个语言上传图片（可独立上传）</Text>
                            
                            {/* 中文图片上传 */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                              <Text className="text-sm font-medium text-slate-900 mb-3">🇨🇳 中文图片</Text>
                              
                              {/* URL输入框 + 上传按钮 */}
                              <div className="flex gap-2 mb-3">
                                <div className="flex-1">
                                  <Text className="text-xs text-slate-500 mb-1">图片URL</Text>
                                  <TextInput
                                    placeholder="https://... 或点击右侧按钮上传本地图片"
                                    value={formState.content_zh}
                                    onChange={(e) => {
                                      console.log('📝 中文URL输入:', e.target.value);
                                      setFormState(prev => ({ ...prev, content_zh: e.target.value }));
                                    }}
                                  />
                                </div>
                                <div className="flex items-end">
                                  <CompactImageUploadButton
                                    onUpload={(url) => {
                                      console.log('🖼️ 中文图片上传回调:', url);
                                      setFormState(prev => ({ ...prev, content_zh: url }));
                                    }}
                                    folder={`home/${activeSection}/zh`}
                                  />
                                </div>
                              </div>
                              
                              {/* 图片预览 */}
                              {formState.content_zh && (
                                <div className="mt-2">
                                  <img
                                    src={formState.content_zh}
                                    alt="中文图片预览"
                                    className="w-full h-32 object-cover rounded border border-slate-200"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* 英文图片上传 */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                              <Text className="text-sm font-medium text-slate-900 mb-3">🇬🇧 英文图片</Text>
                              
                              {/* URL输入框 + 上传按钮 */}
                              <div className="flex gap-2 mb-3">
                                <div className="flex-1">
                                  <Text className="text-xs text-slate-500 mb-1">图片URL</Text>
                                  <TextInput
                                    placeholder="https://... 或点击右侧按钮上传本地图片"
                                    value={formState.content_en}
                                    onChange={(e) => {
                                      console.log('📝 英文URL输入:', e.target.value);
                                      setFormState(prev => ({ ...prev, content_en: e.target.value }));
                                    }}
                                  />
                                </div>
                                <div className="flex items-end">
                                  <CompactImageUploadButton
                                    onUpload={(url) => {
                                      console.log('🖼️ 英文图片上传回调:', url);
                                      setFormState(prev => ({ ...prev, content_en: url }));
                                    }}
                                    folder={`home/${activeSection}/en`}
                                  />
                                </div>
                              </div>
                              
                              {/* 图片预览 */}
                              {formState.content_en && (
                                <div className="mt-2">
                                  <img
                                    src={formState.content_en}
                                    alt="英文图片预览"
                                    className="w-full h-32 object-cover rounded border border-slate-200"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* 俄文图片上传 */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                              <Text className="text-sm font-medium text-slate-900 mb-3">🇷🇺 俄文图片</Text>
                              
                              {/* URL输入框 + 上传按钮 */}
                              <div className="flex gap-2 mb-3">
                                <div className="flex-1">
                                  <Text className="text-xs text-slate-500 mb-1">图片URL</Text>
                                  <TextInput
                                    placeholder="https://... 或点击右侧按钮上传本地图片"
                                    value={formState.content_ru}
                                    onChange={(e) => {
                                      console.log('📝 俄文URL输入:', e.target.value);
                                      setFormState(prev => ({ ...prev, content_ru: e.target.value }));
                                    }}
                                  />
                                </div>
                                <div className="flex items-end">
                                  <CompactImageUploadButton
                                    onUpload={(url) => {
                                      console.log('🖼️ 俄文图片上传回调:', url);
                                      setFormState(prev => ({ ...prev, content_ru: url }));
                                    }}
                                    folder={`home/${activeSection}/ru`}
                                  />
                                </div>
                              </div>
                              
                              {/* 图片预览 */}
                              {formState.content_ru && (
                                <div className="mt-2">
                                  <img
                                    src={formState.content_ru}
                                    alt="俄文图片预览"
                                    className="w-full h-32 object-cover rounded border border-slate-200"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : field.type === "video" ? (
                          // 视频上传字段
                          <div>
                            <Text className="text-xs text-slate-500 mb-2">上传视频</Text>
                            <VideoUpload
                              value={formState.content_zh}
                              onChange={(url) => {
                                console.log('🎬 视频上传回调:', url);
                                setFormState(prev => ({ ...prev, content_zh: url }));
                              }}
                              folder="home/video"
                            />
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500 mb-1">中文内容</Text>
                              <TextInput
                                placeholder="或输入视频URL"
                                value={formState.content_zh}
                                onChange={(e) => {
                                  console.log('📝 中文视频URL输入:', e.target.value);
                                  setFormState(prev => ({ ...prev, content_zh: e.target.value }));
                                }}
                              />
                            </div>
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500 mb-1">英文内容</Text>
                              <TextInput
                                placeholder="或输入视频URL"
                                value={formState.content_en}
                                onChange={(e) => {
                                  console.log('📝 英文视频URL输入:', e.target.value);
                                  setFormState(prev => ({ ...prev, content_en: e.target.value }));
                                }}
                              />
                            </div>
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500 mb-1">俄文内容</Text>
                              <TextInput
                                placeholder="或输入视频URL"
                                value={formState.content_ru}
                                onChange={(e) => {
                                  console.log('📝 俄文视频URL输入:', e.target.value);
                                  setFormState(prev => ({ ...prev, content_ru: e.target.value }));
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          // 普通文本字段
                          <>
                            <div>
                              <Text className="text-xs text-slate-500">中文</Text>
                              <Textarea
                                className="mt-1 min-h-[80px]"
                                value={formState.content_zh}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_zh: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Text className="text-xs text-slate-500">英文</Text>
                              <Textarea
                                className="mt-1 min-h-[80px]"
                                value={formState.content_en}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_en: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Text className="text-xs text-slate-500">俄文</Text>
                              <Textarea
                                className="mt-1 min-h-[80px]"
                                value={formState.content_ru}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_ru: e.target.value }))
                                }
                              />
                            </div>
                          </>
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
  );
}

export default HomeContentManager;