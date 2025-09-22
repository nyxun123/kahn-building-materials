import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Flex,
  Grid,
  Text,
  Button,
  Title,
  Badge,
} from "@tremor/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useList, useUpdate } from "@refinedev/core";
import toast from "react-hot-toast";
import { Save, XCircle } from "lucide-react";

interface CompanyInfoRecord {
  id: number;
  section_type: string;
  title_zh?: string;
  title_en?: string;
  title_ru?: string;
  content_zh?: string;
  content_en?: string;
  content_ru?: string;
  image_url?: string;
  language?: string;
  sort_order?: number;
  is_active?: number | boolean;
  created_at?: string;
  updated_at?: string;
}

const CompanyInfoPage = () => {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState<Partial<CompanyInfoRecord>>({});

  const { data, isLoading, refetch } = useList<CompanyInfoRecord>({
    resource: "company-info",
    pagination: {
      pageSize: 100,
    },
    queryOptions: {
      keepPreviousData: true,
      staleTime: 60_000,
    },
  });

  const { mutate: updateRecord, isLoading: saving } = useUpdate();

  const records = data?.data ?? [];
  const sectionOptions = useMemo(() => {
    const sections = new Set(records.map((record) => record.section_type));
    return ["all", ...Array.from(sections)];
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (activeSection !== "all" && record.section_type !== activeSection) {
        return false;
      }
      if (!search) return true;
      const keyword = search.toLowerCase();
      return (
        record.section_type.toLowerCase().includes(keyword) ||
        record.title_zh?.toLowerCase().includes(keyword) ||
        record.title_en?.toLowerCase().includes(keyword) ||
        record.title_ru?.toLowerCase().includes(keyword)
      );
    });
  }, [records, activeSection, search]);

  useEffect(() => {
    if (editingId) {
      const current = records.find((record) => record.id === editingId);
      if (current) {
        setFormState({
          ...current,
          is_active: Boolean(current.is_active),
        });
      }
    }
  }, [editingId, records]);

  const handleSelectRecord = (record: CompanyInfoRecord) => {
    setEditingId(record.id);
    setFormState({
      ...record,
      is_active: Boolean(record.is_active),
    });
  };

  const handleSave = () => {
    if (!editingId) return;

    updateRecord(
      {
        resource: "company-info",
        id: editingId,
        values: {
          title_zh: formState.title_zh ?? "",
          title_en: formState.title_en ?? "",
          title_ru: formState.title_ru ?? "",
          content_zh: formState.content_zh ?? "",
          content_en: formState.content_en ?? "",
          content_ru: formState.content_ru ?? "",
          image_url: formState.image_url ?? "",
          language: formState.language ?? "zh",
          sort_order: Number(formState.sort_order) || 0,
          is_active: formState.is_active ? 1 : 0,
        },
      },
      {
        onSuccess: () => {
          toast.success("公司信息已更新");
          setEditingId(null);
          setFormState({});
          refetch();
        },
        onError: () => {
          toast.error("更新失败，请稍后再试");
        },
      }
    );
  };

  const activeRecord = editingId
    ? records.find((record) => record.id === editingId)
    : undefined;

  return (
    <div className="space-y-4">
      <Card>
        <Flex justifyContent="between" alignItems="center" className="gap-4">
          <div>
            <Text className="text-lg font-semibold text-slate-900">公司信息</Text>
            <Text className="text-sm text-slate-500">维护官网展示的企业介绍、地址与多语言文案</Text>
          </div>
          <Badge color="indigo">共 {records.length} 条记录</Badge>
        </Flex>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {sectionOptions.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => {
                  setActiveSection(section);
                  setEditingId(null);
                }}
                className={`rounded-md px-3 py-1 text-sm transition ${
                  activeSection === section
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {section === "all" ? "全部" : section}
              </button>
            ))}
          </div>
          <Input
            placeholder="搜索分区或标题"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className={`cursor-pointer border transition hover:shadow-sm ${
                editingId === record.id ? "border-indigo-300 bg-indigo-50" : "border-slate-200"
              }`}
              onClick={() => handleSelectRecord(record)}
            >
              <Flex justifyContent="between" alignItems="start">
                <div>
                  <Text className="font-semibold text-slate-900">
                    {record.section_type.toUpperCase()} · {record.title_zh || record.title_en || "未命名"}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-500">
                    更新于 {new Date(record.updated_at || record.created_at || '').toLocaleString()}
                  </Text>
                </div>
                <Badge color={record.is_active ? "emerald" : "slate"}>
                  {record.is_active ? "显示中" : "已隐藏"}
                </Badge>
              </Flex>
              <Text className="mt-3 line-clamp-2 text-sm text-slate-600">
                {(record.content_zh || record.content_en || record.content_ru || "暂无内容").slice(0, 120)}
              </Text>
            </Card>
          ))}
          {!filteredRecords.length && !isLoading && (
            <Card>
              <Text className="text-center text-slate-400">暂无公司信息记录</Text>
            </Card>
          )}
        </div>

        <Card>
          {editingId && activeRecord ? (
            <div className="space-y-4">
              <div>
                <Title className="text-lg font-semibold text-slate-900">编辑公司信息</Title>
                <Text className="text-sm text-slate-500">
                  分区：{activeRecord.section_type} · ID #{activeRecord.id}
                </Text>
              </div>

              <Grid numItemsSm={1} numItemsLg={2} className="gap-3">
                <div>
                  <Text className="text-sm font-medium text-slate-600">中文标题</Text>
                  <Input
                    value={formState.title_zh || ""}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, title_zh: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">英文标题</Text>
                  <Input
                    value={formState.title_en || ""}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, title_en: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">俄文标题</Text>
                  <Input
                    value={formState.title_ru || ""}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, title_ru: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">图片地址</Text>
                  <Input
                    value={formState.image_url || ""}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, image_url: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium text-slate-600">排序权重</Text>
                  <Input
                    type="number"
                    value={formState.sort_order ?? 0}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, sort_order: Number(event.target.value) }))
                    }
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={Boolean(formState.is_active)}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, is_active: event.target.checked }))
                      }
                    />
                    是否显示
                  </label>
                </div>
              </Grid>

              <div>
                <Text className="text-sm font-medium text-slate-600">中文内容</Text>
                <Textarea
                  className="mt-1 min-h-[150px]"
                  value={formState.content_zh || ""}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, content_zh: event.target.value }))
                  }
                />
              </div>

              <div>
                <Text className="text-sm font-medium text-slate-600">英文内容</Text>
                <Textarea
                  className="mt-1 min-h-[150px]"
                  value={formState.content_en || ""}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, content_en: event.target.value }))
                  }
                />
              </div>

              <div>
                <Text className="text-sm font-medium text-slate-600">俄文内容</Text>
                <Textarea
                  className="mt-1 min-h-[150px]"
                  value={formState.content_ru || ""}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, content_ru: event.target.value }))
                  }
                />
              </div>

              <Flex justifyContent="end" className="gap-2">
                <Button
                  variant="secondary"
                  icon={XCircle}
                  onClick={() => {
                    setEditingId(null);
                    setFormState({});
                  }}
                >
                  取消
                </Button>
                <Button icon={Save} loading={saving} onClick={handleSave}>
                  保存修改
                </Button>
              </Flex>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              {isLoading ? "正在加载公司信息..." : "请选择左侧记录进行编辑"}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CompanyInfoPage;
