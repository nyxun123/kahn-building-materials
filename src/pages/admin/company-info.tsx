import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Flex,
  Grid,
  Text,
  Button,
  Title,
  Badge,
  TextInput,
  Textarea,
} from "@tremor/react";
import { useList, useUpdate } from "@refinedev/core";
import toast from "react-hot-toast";
import { Save, XCircle, Search, Building2, Image as ImageIcon } from "lucide-react";
import { PageHeader, PageContent, TabLangInput, FormField, FormSection, StandardUploadButton } from "@/components/admin";

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
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="公司信息"
          description={`维护官网展示的企业介绍、地址与多语言文案 · 共 ${records.length} 条记录`}
        />

        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-wrap gap-2">
              {sectionOptions.map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    setActiveSection(section);
                    setEditingId(null);
                  }}
                  className={`
                    rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                    ${activeSection === section
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  {section === "all" ? "全部" : section}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <TextInput
                placeholder="搜索分区或标题"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <Card
                key={record.id}
                className={`
                  cursor-pointer border-2 transition-all duration-200 rounded-xl
                  ${editingId === record.id
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md"
                    : "border-gray-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1"
                  }
                `}
                onClick={() => handleSelectRecord(record)}
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
                        <Building2 className="h-4 w-4" />
                      </div>
                      <Text className={`font-semibold ${
                        editingId === record.id ? "text-indigo-700" : "text-gray-900"
                      }`}>
                        {record.section_type.toUpperCase()} · {record.title_zh || record.title_en || "未命名"}
                      </Text>
                    </Flex>
                    <Text className="text-xs text-gray-500 mb-2">
                      更新于 {new Date(record.updated_at || record.created_at || '').toLocaleString()}
                    </Text>
                    <Text className="line-clamp-2 text-sm text-gray-600">
                      {(record.content_zh || record.content_en || record.content_ru || "暂无内容").slice(0, 120)}
                    </Text>
                  </div>
                  <Badge
                    color={record.is_active ? "emerald" : "slate"}
                    className="rounded-full px-2 py-1 ml-2 flex-shrink-0"
                  >
                    {record.is_active ? "显示中" : "已隐藏"}
                  </Badge>
                </Flex>
              </Card>
            ))}
            {!filteredRecords.length && !isLoading && (
              <Card className="bg-white rounded-xl border-2 border-gray-200">
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                  <Text className="text-gray-500 text-lg">暂无公司信息记录</Text>
                </div>
              </Card>
            )}
          </div>

          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            {editingId && activeRecord ? (
              <div className="space-y-6 p-4">
                <div>
                  <Title className="text-lg font-bold text-gray-900 mb-1">编辑公司信息</Title>
                  <Text className="text-sm text-gray-500">
                    分区：{activeRecord.section_type} · ID #{activeRecord.id}
                  </Text>
                </div>

                <FormSection title="基础信息">
                  <TabLangInput
                    label="标题"
                    values={{
                      zh: formState.title_zh || "",
                      en: formState.title_en || "",
                      ru: formState.title_ru || "",
                    }}
                    onChange={(lang, value) => {
                      setFormState((prev) => ({
                        ...prev,
                        [`title_${lang}`]: value,
                      }));
                    }}
                    type="text"
                  />

                  <FormField label="图片地址">
                    <div className="flex gap-2">
                      <TextInput
                        value={formState.image_url || ""}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, image_url: event.target.value }))
                        }
                        placeholder="输入图片URL"
                        className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                      <StandardUploadButton
                        onUpload={(url) => setFormState((prev) => ({ ...prev, image_url: url }))}
                        folder="company"
                      />
                    </div>
                  </FormField>

                  <Grid numItemsSm={1} numItemsLg={2} className="gap-3">
                    <FormField label="排序权重">
                      <TextInput
                        type="number"
                        value={String(formState.sort_order ?? 0)}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, sort_order: Number(event.target.value) }))
                        }
                        className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                      />
                    </FormField>
                    <FormField label="状态">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(formState.is_active)}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, is_active: event.target.checked }))
                          }
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>是否显示</span>
                      </label>
                    </FormField>
                  </Grid>
                </FormSection>

                <FormSection title="多语言内容">
                  <TabLangInput
                    label="内容"
                    values={{
                      zh: formState.content_zh || "",
                      en: formState.content_en || "",
                      ru: formState.content_ru || "",
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
                    onClick={() => {
                      setEditingId(null);
                      setFormState({});
                    }}
                    className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    取消
                  </Button>
                  <Button
                    icon={Save}
                    loading={saving}
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    保存修改
                  </Button>
                </Flex>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8">
                <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                <Text className="text-gray-500 text-lg">
                  {isLoading ? "正在加载公司信息..." : "请选择左侧记录进行编辑"}
                </Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContent>
  );
};

export default CompanyInfoPage;
