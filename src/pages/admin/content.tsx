import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Flex,
  Text,
  Textarea,
  Button,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Title,
  TextInput,
  Badge,
} from "@tremor/react";
import { useList, useUpdate, useCreate } from "@refinedev/core";
import { Save, XCircle, Plus, Trash2, Video, Package, Factory, Search, FileText } from "lucide-react";
import { PageHeader, PageContent, TabLangInput, FormField, FormSection, FormActions } from "@/components/admin";

const PAGE_TABS = [
  { key: "all", label: "全部页面" },
  { key: "home", label: "首页" },
  { key: "products", label: "产品" },
  { key: "oem", label: "OEM 服务" },
  { key: "about", label: "关于我们" },
  { key: "contact", label: "联系我们" },
];

const SECTION_KEYS = {
  home: [
    "hero_title",
    "hero_subtitle",
    "products_title",
    "products_subtitle",
    "video_title",
    "video_subtitle",
    "video_url",
    "oem_title",
    "oem_subtitle",
    "oem_description",
    "semi_title",
    "semi_subtitle",
    "semi_description",
    "why_us_title",
    "why_us_subtitle",
    "cta_title",
    "cta_description",
  ],
};

const Content = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formState, setFormState] = useState({
    page_key: "home",
    section_key: "",
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
      query: activeTab !== "all" ? { page_key: activeTab } : undefined,
    },
    queryOptions: {
      keepPreviousData: true,
      staleTime: 60_000,
    },
  });

  const { mutate: updateContent, isLoading: saving } = useUpdate();
  const { mutate: createContent, isLoading: creating } = useCreate();

  const records = data?.data ?? [];

  const filteredRecords = useMemo(() => {
    if (!search) return records;
    return records.filter((record: any) =>
      `${record.page_key}-${record.section_key}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  useEffect(() => {
    if (editingId) {
      const current = records.find((item: any) => item.id === editingId);
      if (current) {
        setFormState({
          page_key: current.page_key || "home",
          section_key: current.section_key || "",
          content_zh: current.content_zh || "",
          content_en: current.content_en || "",
          content_ru: current.content_ru || "",
        });
      }
    }
  }, [editingId, records]);

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setIsCreating(false);
    setFormState({
      page_key: record.page_key || "home",
      section_key: record.section_key || "",
      content_zh: record.content_zh || "",
      content_en: record.content_en || "",
      content_ru: record.content_ru || "",
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormState({
      page_key: "home",
      section_key: "",
      content_zh: "",
      content_en: "",
      content_ru: "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (isCreating) {
      createContent(
        {
          resource: "contents",
          values: formState,
        },
        {
          onSuccess: () => {
            setIsCreating(false);
            refetch();
          },
        }
      );
    } else if (editingId) {
      updateContent(
        {
          resource: "contents",
          id: editingId,
          values: formState,
        },
        {
          onSuccess: () => {
            setEditingId(null);
            refetch();
          },
        }
      );
    }
  };

  const getSectionIcon = (sectionKey: string) => {
    if (sectionKey.includes("video")) return <Video className="h-4 w-4" />;
    if (sectionKey.includes("oem")) return <Factory className="h-4 w-4" />;
    if (sectionKey.includes("semi")) return <Package className="h-4 w-4" />;
    return null;
  };

  return (
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="内容管理"
          description={`统一维护中/英/俄多语言文案 · 总计 ${records.length} 条内容块`}
        />

        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid gap-4 md:grid-cols-2">
            <TabGroup
              index={PAGE_TABS.findIndex((tab) => tab.key === activeTab)}
              onIndexChange={(index) => setActiveTab(PAGE_TABS[index].key)}
            >
              <TabList className="bg-gray-50 rounded-lg p-1">
                {PAGE_TABS.map((tab) => (
                  <Tab
                    key={tab.key}
                    className={`
                      rounded-md px-4 py-2 font-medium transition-all duration-200
                      ${activeTab === tab.key
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {tab.label}
                  </Tab>
                ))}
              </TabList>
            </TabGroup>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <TextInput
                placeholder="按页面或分区搜索"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <Text className="font-semibold text-gray-900 text-lg">内容列表</Text>
              </div>
              <Button
                icon={Plus}
                size="sm"
                onClick={handleCreate}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                新增内容
              </Button>
            </div>
            {filteredRecords.map((record: any) => (
              <Card
                key={record.id}
                className={`
                  cursor-pointer border-2 transition-all duration-200 rounded-xl
                  ${editingId === record.id
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md"
                    : "border-gray-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1"
                  }
                `}
                onClick={() => handleEdit(record)}
              >
                <Flex justifyContent="between" alignItems="start">
                  <div className="flex-1 min-w-0">
                    <Flex alignItems="center" className="gap-2 mb-2">
                      <div className={`
                        p-1.5 rounded-lg
                        ${editingId === record.id
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-600"
                        }
                      `}>
                        {getSectionIcon(record.section_key)}
                      </div>
                      <Text className={`font-semibold ${
                        editingId === record.id ? "text-indigo-700" : "text-gray-900"
                      }`}>
                        {record.page_key.toUpperCase()} · {record.section_key}
                      </Text>
                    </Flex>
                    <Text className="text-xs text-gray-500 mb-2">
                      更新于 {new Date(record.updated_at).toLocaleString()}
                    </Text>
                    <Text className="line-clamp-2 text-sm text-gray-600">
                      {(record.content_zh || record.content_en || "尚未填写").slice(0, 120)}
                    </Text>
                  </div>
                  <Badge
                    color={editingId === record.id ? "indigo" : "slate"}
                    className="rounded-full px-2 py-1 ml-2 flex-shrink-0"
                  >
                    #{record.id}
                  </Badge>
                </Flex>
              </Card>
            ))}
            {!filteredRecords.length && !isLoading && (
              <Card className="bg-white rounded-xl border-2 border-gray-200">
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <Text className="text-gray-500 text-lg">暂无内容，换个条件试试</Text>
                </div>
              </Card>
            )}
          </div>

          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            {editingId || isCreating ? (
              <div className="space-y-6 p-4">
                <div>
                  <Title className="text-lg font-bold text-gray-900 mb-1">
                    {isCreating ? "新增内容" : "编辑内容"}
                  </Title>
                  <Text className="text-sm text-gray-500">请保持三种语言内容一致</Text>
                </div>

                <FormSection title="基础信息">
                  <FormField label="页面标识" required>
                    <TextInput
                      value={formState.page_key}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, page_key: event.target.value }))
                      }
                      placeholder="页面标识，如 home"
                      className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </FormField>
                  
                  <FormField label="分区标识" required>
                    <TextInput
                      value={formState.section_key}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, section_key: event.target.value }))
                      }
                      placeholder="分区标识，如 video_title"
                      className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </FormField>
                </FormSection>

                <FormSection title="多语言内容">
                  <TabLangInput
                    label="内容"
                    values={{
                      zh: formState.content_zh,
                      en: formState.content_en,
                      ru: formState.content_ru,
                    }}
                    onChange={(lang, value) => {
                      setFormState((prev) => ({
                        ...prev,
                        [`content_${lang}`]: value,
                      }));
                    }}
                    type="textarea"
                  />
                </FormSection>

                <Flex justifyContent="end" className="gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    icon={XCircle}
                    onClick={handleCancel}
                    className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    取消
                  </Button>
                  <Button
                    icon={Save}
                    loading={saving || creating}
                    onClick={handleSave}
                    disabled={!formState.page_key || !formState.section_key || saving || creating}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "创建" : "保存修改"}
                  </Button>
                </Flex>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <Text className="text-gray-500 text-lg">
                  请选择左侧内容进行编辑或点击"新增内容"按钮创建新内容
                </Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContent>
  );
};

export default Content;