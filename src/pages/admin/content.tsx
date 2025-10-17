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
import { Save, XCircle, Plus, Trash2, Video, Package, Factory } from "lucide-react";

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
    <div className="space-y-4">
      <Card>
        <Flex justifyContent="between" alignItems="center" className="gap-4">
          <div>
            <Text className="text-lg font-semibold text-slate-900">内容管理</Text>
            <Text className="text-sm text-slate-500">统一维护中/英/俄多语言文案</Text>
          </div>
          <Badge color="indigo">总计 {records.length} 条内容块</Badge>
        </Flex>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <TabGroup index={PAGE_TABS.findIndex((tab) => tab.key === activeTab)} onIndexChange={(index) => setActiveTab(PAGE_TABS[index].key)}>
            <TabList>
              {PAGE_TABS.map((tab) => (
                <Tab key={tab.key}>{tab.label}</Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text className="text-sm text-slate-500">
                  选择页面以查看对应的内容模块。
                </Text>
              </TabPanel>
            </TabPanels>
          </TabGroup>
          <TextInput
            placeholder="按页面或分区搜索"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Text className="font-medium text-slate-700">内容列表</Text>
            <Button icon={Plus} size="sm" onClick={handleCreate}>
              新增内容
            </Button>
          </div>
          {filteredRecords.map((record: any) => (
            <Card
              key={record.id}
              className={`cursor-pointer border transition hover:shadow-sm ${editingId === record.id ? "border-indigo-300 bg-indigo-50" : "border-slate-200"}`}
              onClick={() => handleEdit(record)}
            >
              <Flex justifyContent="between" alignItems="start">
                <div>
                  <Flex alignItems="center" className="gap-2">
                    {getSectionIcon(record.section_key)}
                    <Text className="font-semibold text-slate-900">
                      {record.page_key.toUpperCase()} · {record.section_key}
                    </Text>
                  </Flex>
                  <Text className="mt-1 text-xs text-slate-500">
                    更新于 {new Date(record.updated_at).toLocaleString()}
                  </Text>
                </div>
                <Badge color="slate">ID #{record.id}</Badge>
              </Flex>
              <Text className="mt-3 line-clamp-2 text-sm text-slate-600">
                {(record.content_zh || record.content_en || "尚未填写").slice(0, 120)}
              </Text>
            </Card>
          ))}
          {!filteredRecords.length && !isLoading && (
            <Card>
              <Text className="text-center text-slate-400">暂无内容，换个条件试试</Text>
            </Card>
          )}
        </div>

        <Card>
          {editingId || isCreating ? (
            <div className="space-y-4">
              <div>
                <Title className="text-lg font-semibold text-slate-900">
                  {isCreating ? "新增内容" : "编辑内容"}
                </Title>
                <Text className="text-sm text-slate-500">请保持三种语言内容一致</Text>
              </div>

              <div className="space-y-3">
                <div>
                  <Text className="text-sm font-medium text-slate-600">页面标识</Text>
                  <TextInput
                    className="mt-1"
                    value={formState.page_key}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, page_key: event.target.value }))
                    }
                    placeholder="页面标识，如 home"
                  />
                </div>
                
                <div>
                  <Text className="text-sm font-medium text-slate-600">分区标识</Text>
                  <TextInput
                    className="mt-1"
                    value={formState.section_key}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, section_key: event.target.value }))
                    }
                    placeholder="分区标识，如 video_title"
                  />
                </div>

                <div>
                  <Text className="text-sm font-medium text-slate-600">中文内容</Text>
                  <Textarea
                    className="mt-1 min-h-[100px]"
                    value={formState.content_zh}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, content_zh: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">英文内容</Text>
                  <Textarea
                    className="mt-1 min-h-[100px]"
                    value={formState.content_en}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, content_en: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">俄文内容</Text>
                  <Textarea
                    className="mt-1 min-h-[100px]"
                    value={formState.content_ru}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, content_ru: event.target.value }))
                    }
                  />
                </div>
              </div>

              <Flex justifyContent="end" className="gap-2">
                <Button variant="secondary" icon={XCircle} onClick={handleCancel}>
                  取消
                </Button>
                <Button 
                  icon={Save} 
                  loading={saving || creating} 
                  onClick={handleSave}
                  disabled={!formState.page_key || !formState.section_key}
                >
                  {isCreating ? "创建" : "保存修改"}
                </Button>
              </Flex>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              请选择左侧内容进行编辑或点击"新增内容"按钮创建新内容
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Content;