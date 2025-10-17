import React, { useState } from "react";
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
import { useOne, useUpdate } from "@refinedev/core";
import { Save, XCircle, Video, Package, Factory, Upload } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const HOME_SECTIONS = [
  { key: "video", label: "演示视频", icon: <Video className="h-4 w-4" /> },
  { key: "oem", label: "OEM定制", icon: <Factory className="h-4 w-4" /> },
  { key: "semi", label: "半成品小袋", icon: <Package className="h-4 w-4" /> },
];

const LANGUAGES = [
  { code: "zh", name: "中文" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

// 默认内容结构
const defaultContentData = {
  video: {
    title: { zh: "", en: "", ru: "" },
    subtitle: { zh: "", en: "", ru: "" },
    video_url: "",
    description: { zh: "", en: "", ru: "" },
  },
  oem: {
    title: { zh: "", en: "", ru: "" },
    image_url: "",
    description: { zh: "", en: "", ru: "" },
  },
  semi: {
    title: { zh: "", en: "", ru: "" },
    image_url: "",
    description: { zh: "", en: "", ru: "" },
  },
};

function HomeContentManagerNew() {
  const [activeSection, setActiveSection] = useState("video");
  const [activeLanguage, setActiveLanguage] = useState("zh");
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState(defaultContentData);

  // 获取单个首页内容文档
  const { data, refetch, isLoading } = useOne({
    resource: "home-content",
    id: "home",
    queryOptions: {
      staleTime: 60_000,
      onSuccess: (data) => {
        console.log('📦 获取到首页内容:', data);
        if (data?.data?.content_data) {
          setFormData(data.data.content_data);
        }
      },
      onError: (error) => {
        console.error('❌ 获取首页内容失败:', error);
      }
    }
  });

  const { mutate: updateContent, isLoading: saving } = useUpdate();

  const currentSection = HOME_SECTIONS.find(s => s.key === activeSection);
  const sectionData = formData[activeSection] || {};

  // 处理表单数据变化
  const handleFieldChange = (field: string, value: any) => {
    const newFormData = {
      ...formData,
      [activeSection]: {
        ...formData[activeSection],
        [field]: value,
      },
    };
    setFormData(newFormData);
    setHasChanges(true);
  };

  // 处理多语言字段变化
  const handleLanguageFieldChange = (field: string, language: string, value: string) => {
    const newFormData = {
      ...formData,
      [activeSection]: {
        ...formData[activeSection],
        [field]: {
          ...formData[activeSection]?.[field],
          [language]: value,
        },
      },
    };
    setFormData(newFormData);
    setHasChanges(true);
  };

  // 保存操作
  const handleSave = async () => {
    console.log('🚀 开始保存首页内容...');

    updateContent(
      {
        resource: "home-content",
        id: "home",
        values: {
          content_data: formData,
        },
      },
      {
        onSuccess: (response) => {
          console.log('✅ 保存成功:', response);
          setHasChanges(false);
          alert('首页内容保存成功！');
          refetch();
        },
        onError: (error) => {
          console.error('❌ 保存失败:', error);
          alert('保存失败: ' + (error.message || '未知错误'));
        },
      }
    );
  };

  // 重置操作
  const handleReset = () => {
    if (data?.data?.content_data) {
      setFormData(data.data.content_data);
      setHasChanges(false);
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

        // 使用上传服务
        const { uploadService } = await import('@/lib/upload-service');
        const result = await uploadService.uploadWithRetry(file, {
          folder,
          maxSize: 100,
          acceptVideo: true,
          allowedTypes: allowedTypes
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title className="text-2xl font-bold text-slate-900">首页内容管理（单文档模式）</Title>
        <Text className="text-slate-500">管理首页演示视频、OEM定制、半成品小袋板块内容</Text>
      </div>

      {/* 操作按钮区域 */}
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <Flex alignItems="center" className="gap-3">
            {hasChanges && (
              <Badge color="orange">有未保存的更改</Badge>
            )}
          </Flex>
          <Flex justifyContent="end" className="gap-2">
            <Button
              variant="secondary"
              icon={XCircle}
              onClick={handleReset}
              disabled={!hasChanges}
            >
              重置
            </Button>
            <Button
              icon={Save}
              loading={saving}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              保存更改
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* 板块选择 */}
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

        {/* 语言选择 */}
        <div className="mb-6">
          <Text className="text-lg font-semibold text-slate-900 mb-4">选择语言</Text>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                size="xs"
                variant={activeLanguage === lang.code ? "primary" : "secondary"}
                onClick={() => setActiveLanguage(lang.code)}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 编辑区域 */}
        {currentSection && (
          <div>
            <Text className="text-lg font-semibold text-slate-900 mb-4">
              {currentSection.label}内容编辑
            </Text>

            <div className="space-y-6">
              {/* 多语言文本字段 */}
              <Card>
                <Text className="font-medium text-slate-900 mb-4">标题</Text>
                <div className="space-y-3">
                  {LANGUAGES.map((lang) => (
                    <div key={`${currentSection.key}_title_${lang.code}`}>
                      <Text className="text-xs text-slate-500 mb-1">{lang.name}</Text>
                      <TextInput
                        value={sectionData.title?.[lang.code] || ""}
                        onChange={(e) => handleLanguageFieldChange("title", lang.code, e.target.value)}
                        placeholder={`输入${lang.name}标题`}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* 副标题（仅视频板块） */}
              {activeSection === "video" && (
                <Card>
                  <Text className="font-medium text-slate-900 mb-4">副标题</Text>
                  <div className="space-y-3">
                    {LANGUAGES.map((lang) => (
                      <div key={`video_subtitle_${lang.code}`}>
                        <Text className="text-xs text-slate-500 mb-1">{lang.name}</Text>
                        <TextInput
                          value={sectionData.subtitle?.[lang.code] || ""}
                          onChange={(e) => handleLanguageFieldChange("subtitle", lang.code, e.target.value)}
                          placeholder={`输入${lang.name}副标题`}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 描述 */}
              <Card>
                <Text className="font-medium text-slate-900 mb-4">描述</Text>
                <div className="space-y-3">
                  {LANGUAGES.map((lang) => (
                    <div key={`${currentSection.key}_description_${lang.code}`}>
                      <Text className="text-xs text-slate-500 mb-1">{lang.name}</Text>
                      <Textarea
                        className="min-h-[100px]"
                        value={sectionData.description?.[lang.code] || ""}
                        onChange={(e) => handleLanguageFieldChange("description", lang.code, e.target.value)}
                        placeholder={`输入${lang.name}描述`}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* 媒体文件 */}
              <Card>
                <Text className="font-medium text-slate-900 mb-4">
                  {activeSection === "video" ? "视频文件" : "图片文件"}
                </Text>

                {activeSection === "video" ? (
                  <div>
                    <Text className="text-xs text-slate-500 mb-2">上传视频</Text>
                    <VideoUpload
                      value={sectionData.video_url || ""}
                      onChange={(url) => handleFieldChange("video_url", url)}
                      folder="home/video"
                    />
                  </div>
                ) : (
                  <div>
                    <Text className="text-xs text-slate-500 mb-2">上传图片</Text>
                    <ImageUpload
                      value={sectionData.image_url || ""}
                      onChange={(url) => handleFieldChange("image_url", url)}
                      folder={`home/${activeSection}`}
                    />
                  </div>
                )}

                {/* URL输入框 */}
                <div className="mt-4">
                  <Text className="text-xs text-slate-500 mb-2">
                    或直接输入{activeSection === "video" ? "视频" : "图片"}URL
                  </Text>
                  <TextInput
                    value={activeSection === "video"
                      ? (sectionData.video_url || "")
                      : (sectionData.image_url || "")
                    }
                    onChange={(e) => handleFieldChange(
                      activeSection === "video" ? "video_url" : "image_url",
                      e.target.value
                    )}
                    placeholder={`https://example.com/${activeSection}.${activeSection === "video" ? "mp4" : "jpg"}`}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default HomeContentManagerNew;