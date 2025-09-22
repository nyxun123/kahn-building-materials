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
import { useList, useUpdate } from "@refinedev/core";
import { Save, XCircle } from "lucide-react";

const PAGE_TABS = [
  { key: "all", label: "全部页面" },
  { key: "home", label: "首页" },
  { key: "products", label: "产品" },
  { key: "oem", label: "OEM 服务" },
  { key: "about", label: "关于我们" },
  { key: "contact", label: "联系我们" },
];

const Content = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
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
      query: activeTab !== "all" ? { page_key: activeTab } : undefined,
    },
    queryOptions: {
      keepPreviousData: true,
      staleTime: 60_000,
    },
  });

  const { mutate: updateContent, isLoading: saving } = useUpdate();

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
          content_zh: current.content_zh || "",
          content_en: current.content_en || "",
          content_ru: current.content_ru || "",
        });
      }
    }
  }, [editingId, records]);

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setFormState({
      content_zh: record.content_zh || "",
      content_en: record.content_en || "",
      content_ru: record.content_ru || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editingId) return;
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
      },
    );
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
          {filteredRecords.map((record: any) => (
            <Card
              key={record.id}
              className={`cursor-pointer border transition hover:shadow-sm ${editingId === record.id ? "border-indigo-300 bg-indigo-50" : "border-slate-200"}`}
              onClick={() => handleEdit(record)}
            >
              <Flex justifyContent="between" alignItems="start">
                <div>
                  <Text className="font-semibold text-slate-900">
                    {record.page_key.toUpperCase()} · {record.section_key}
                  </Text>
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
          {editingId ? (
            <div className="space-y-4">
              <div>
                <Title className="text-lg font-semibold text-slate-900">编辑内容</Title>
                <Text className="text-sm text-slate-500">请保持三种语言内容一致</Text>
              </div>

              <div className="space-y-3">
                <div>
                  <Text className="text-sm font-medium text-slate-600">中文内容</Text>
                  <Textarea
                    className="mt-1 min-h-[140px]"
                    value={formState.content_zh}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, content_zh: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">英文内容</Text>
                  <Textarea
                    className="mt-1 min-h-[140px]"
                    value={formState.content_en}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, content_en: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">俄文内容</Text>
                  <Textarea
                    className="mt-1 min-h-[140px]"
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
                <Button icon={Save} loading={saving} onClick={handleSave}>
                  保存修改
                </Button>
              </Flex>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              请选择左侧内容进行编辑
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Content;
