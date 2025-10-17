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
import { Save, XCircle, Plus, Video, Package, Factory } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

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

function HomeContentManager() {
  const [activeSection, setActiveSection] = useState("video");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    content_zh: "",
    content_en: "",
    content_ru: "",
  });

  const { data, refetch, isLoading } = useList({
    resource: "contents",
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

  const handleSave = () => {
    if (!editingField) return;

    const sectionContent = getFieldContent(activeSection, editingField);
    
    const contentData = {
      page_key: "home",
      section_key: `${activeSection}_${editingField}`,
      content_zh: formState.content_zh,
      content_en: formState.content_en,
      content_ru: formState.content_ru,
      // 根据字段类型设置content_type
      ...(editingField === "image" && { content_type: "image" }),
      ...(editingField === "video" && { content_type: "video" }),
      ...(editingField === "url" && { content_type: "url" }),
    };

    if (sectionContent) {
      // 更新现有内容
      updateContent(
        {
          resource: "contents",
          id: sectionContent.id,
          values: contentData,
        },
        {
          onSuccess: () => {
            setEditingField(null);
            refetch();
          },
        }
      );
    } else {
      // 创建新内容
      createContent(
        {
          resource: "contents",
          values: contentData,
        },
        {
          onSuccess: () => {
            setEditingField(null);
            refetch();
          },
        }
      );
    }
  };

  // 自定义视频上传组件
  const VideoUpload = ({ value, onChange, folder = "home" }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

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

        // 使用修复后的上传服务
        const { uploadService } = await import('@/lib/upload-service');
        const result = await uploadService.uploadWithRetry(file, {
          folder,
          maxSize: 100,
          acceptVideo: true,
          allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/mov', 'video/avi']
        });

        onChange(result.url);
        alert('视频上传成功！');
      } catch (error) {
        console.error('视频上传失败:', error);
        alert('视频上传失败: ' + (error.message || '未知错误'));
      } finally {
        setUploading(false);
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
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <Text className="text-sm text-gray-600">上传中...</Text>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Video className="h-8 w-8 text-gray-400 mb-2" />
              <Text className="text-sm font-medium text-gray-600">点击上传视频</Text>
              <Text className="text-xs text-gray-500 mt-1">支持 MP4, WebM, OGG, MOV 格式</Text>
            </div>
          )}
        </label>
        {value && (
          <div className="mt-3 text-left">
            <Text className="text-xs text-gray-500">已上传视频链接:</Text>
            <TextInput 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
              className="mt-1"
            />
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
                          // 图片上传字段
                          <div>
                            <Text className="text-xs text-slate-500 mb-2">上传图片</Text>
                            <ImageUpload
                              value={formState.content_zh}
                              onChange={(url) => setFormState(prev => ({ ...prev, content_zh: url }))}
                              folder={activeSection === "oem" ? "home/oem" : activeSection === "semi" ? "home/semi" : "home"}
                            />
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500">中文</Text>
                              <TextInput
                                placeholder="或输入图片URL"
                                value={formState.content_zh}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_zh: e.target.value }))
                                }
                              />
                            </div>
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500">英文</Text>
                              <TextInput
                                placeholder="或输入图片URL"
                                value={formState.content_en}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_en: e.target.value }))
                                }
                              />
                            </div>
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500">俄文</Text>
                              <TextInput
                                placeholder="或输入图片URL"
                                value={formState.content_ru}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_ru: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                        ) : field.type === "video" ? (
                          // 视频上传字段
                          <div>
                            <Text className="text-xs text-slate-500 mb-2">上传视频</Text>
                            <VideoUpload
                              value={formState.content_zh}
                              onChange={(url) => setFormState(prev => ({ ...prev, content_zh: url }))}
                              folder="home/video"
                            />
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500">中文</Text>
                              <TextInput
                                placeholder="或输入视频URL"
                                value={formState.content_zh}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_zh: e.target.value }))
                                }
                              />
                            </div>
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500">英文</Text>
                              <TextInput
                                placeholder="或输入视频URL"
                                value={formState.content_en}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_en: e.target.value }))
                                }
                              />
                            </div>
                            <div className="mt-3">
                              <Text className="text-xs text-slate-500">俄文</Text>
                              <TextInput
                                placeholder="或输入视频URL"
                                value={formState.content_ru}
                                onChange={(e) =>
                                  setFormState(prev => ({ ...prev, content_ru: e.target.value }))
                                }
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
                          >
                            取消
                          </Button>
                          <Button 
                            size="xs" 
                            icon={Save} 
                            loading={saving || creating} 
                            onClick={handleSave}
                          >
                            保存
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