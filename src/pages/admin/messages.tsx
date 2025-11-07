import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Flex,
  Text,
  Textarea,
  Button,
  Title,
} from "@tremor/react";
import { useTable, useUpdate } from "@refinedev/core";
import { Mail, Phone, Building2, Eye, CheckCircle2, MessageCircle, Globe, MessageSquare, Languages } from "lucide-react";
import { PageHeader, PageContent } from "@/components/admin";

const Messages = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");

  const {
    tableQueryResult,
    current,
    setCurrent,
    pageCount,
    pageSize,
    setPageSize,
  } = useTable({
    resource: "messages",
    pagination: {
      pageSize: 8,
    },
    syncWithLocation: false,
    queryOptions: {
      keepPreviousData: true,
      staleTime: 60_000,
    },
  });

  const { mutate: updateMessage, isLoading: updating } = useUpdate();

  const isLoading = tableQueryResult?.isLoading ?? false;
  const records = tableQueryResult?.data?.data ?? [];
  const total = tableQueryResult?.data?.total ?? 0;

  const selectedMessage = useMemo(() => {
    if (!selectedId) return records[0];
    return records.find((item: any) => item.id === selectedId) ?? records[0];
  }, [records, selectedId]);

  // 同步管理员备注
  useEffect(() => {
    if (selectedMessage) {
      setAdminNotes(selectedMessage.admin_notes || "");
    }
  }, [selectedMessage]);

  return (
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="客户留言"
          description={`总计 ${total} 条留言记录`}
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Flex justifyContent="between" alignItems="center" className="mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-indigo-600" />
                <Text className="text-lg font-semibold text-gray-900">留言列表</Text>
              </div>
              <Badge color="indigo" className="rounded-full px-3 py-1">
                第 {current}/{Math.max(pageCount ?? 1, 1)} 页
              </Badge>
            </Flex>

            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      姓名
                    </TableHeaderCell>
                    <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      邮箱
                    </TableHeaderCell>
                    <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      公司
                    </TableHeaderCell>
                    <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      状态
                    </TableHeaderCell>
                    <TableHeaderCell className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      操作
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((message: any) => (
                    <TableRow
                      key={message.id}
                      className={`
                        border-b border-gray-200 transition-colors duration-150
                        ${selectedId === message.id ? 'bg-indigo-50' : 'hover:bg-indigo-50'}
                        ${!message.is_read ? 'border-l-4 border-l-amber-500' : ''}
                      `}
                    >
                      <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                        {message.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-900">
                        {message.email}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-900">
                        {message.company || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <Badge
                          color={message.is_read ? "emerald" : "amber"}
                          className="rounded-full px-3 py-1"
                        >
                          {message.is_read ? "已读" : "未读"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedId(message.id)}
                          className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        >
                          查看
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!records.length && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <MessageCircle className="h-12 w-12 text-gray-300" />
                          <Text className="text-gray-500 text-lg">暂无留言数据</Text>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Flex
              justifyContent="between"
              alignItems="center"
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <Text className="text-sm text-gray-600">
                共 <span className="font-semibold text-gray-900">{total}</span> 条 · 每页
                <select
                  className="mx-1 rounded-lg border-2 border-gray-200 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  value={pageSize}
                  onChange={(event) => setPageSize?.(Number(event.target.value))}
                >
                  {[8, 15, 30].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                条
              </Text>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={current === 1}
                  onClick={() => setCurrent?.((current ?? 1) - 1)}
                  className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={current === pageCount}
                  onClick={() => setCurrent?.((current ?? 1) + 1)}
                  className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </Button>
              </div>
            </Flex>
          </Card>

          <Card className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            {selectedMessage ? (
              <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Title className="text-lg font-bold text-gray-900 mb-1">留言详情</Title>
                    <Text className="text-sm text-gray-500">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </Text>
                  </div>
                  {!selectedMessage.is_read && (
                    <Badge color="amber" className="rounded-full px-3 py-1">
                      未读
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 rounded-xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <Flex alignItems="center" className="gap-3 text-gray-700">
                    <div className="rounded-lg bg-indigo-100 p-2">
                      <Mail className="h-4 w-4 text-indigo-600" />
                    </div>
                    <Text className="font-medium">{selectedMessage.email}</Text>
                  </Flex>
                  {selectedMessage.phone && (
                    <Flex alignItems="center" className="gap-3 text-gray-700">
                      <div className="rounded-lg bg-emerald-100 p-2">
                        <Phone className="h-4 w-4 text-emerald-600" />
                      </div>
                      <Text className="font-medium">{selectedMessage.phone}</Text>
                    </Flex>
                  )}
                  {selectedMessage.company && (
                    <Flex alignItems="center" className="gap-3 text-gray-700">
                      <div className="rounded-lg bg-purple-100 p-2">
                        <Building2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <Text className="font-medium">{selectedMessage.company}</Text>
                    </Flex>
                  )}
                  {selectedMessage.country && (
                    <Flex alignItems="center" className="gap-3 text-gray-700">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <Text className="font-medium">{selectedMessage.country}</Text>
                    </Flex>
                  )}
                  {selectedMessage.subject && (
                    <Flex alignItems="center" className="gap-3 text-gray-700">
                      <div className="rounded-lg bg-amber-100 p-2">
                        <MessageSquare className="h-4 w-4 text-amber-600" />
                      </div>
                      <Text className="font-medium">{selectedMessage.subject}</Text>
                    </Flex>
                  )}
                  {selectedMessage.language && (
                    <Flex alignItems="center" className="gap-3 text-gray-700">
                      <div className="rounded-lg bg-rose-100 p-2">
                        <Languages className="h-4 w-4 text-rose-600" />
                      </div>
                      <Text className="font-medium">
                        {selectedMessage.language === 'zh' && '中文'}
                        {selectedMessage.language === 'en' && 'English'}
                        {selectedMessage.language === 'ru' && 'Русский'}
                        {selectedMessage.language === 'vi' && 'Tiếng Việt'}
                        {selectedMessage.language === 'th' && 'ไทย'}
                        {selectedMessage.language === 'id' && 'Indonesia'}
                        {!['zh', 'en', 'ru', 'vi', 'th', 'id'].includes(selectedMessage.language) && selectedMessage.language}
                      </Text>
                    </Flex>
                  )}
                </div>

                <div className="rounded-xl border-2 border-gray-100 bg-white p-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">留言内容</Text>
                  <Textarea
                    className="min-h-[160px] resize-none rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    value={selectedMessage.message}
                    readOnly
                  />
                </div>

                <div className="rounded-xl border-2 border-indigo-100 bg-white p-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">管理员备注</Text>
                  <Textarea
                    className="min-h-[120px] resize-none rounded-lg border-2 border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="添加管理员备注..."
                  />
                  <Flex justifyContent="end" className="mt-3">
                    <Button
                      size="sm"
                      loading={updating}
                      onClick={() =>
                        updateMessage({
                          resource: "messages",
                          id: selectedMessage.id,
                          values: { admin_notes: adminNotes },
                        })
                      }
                      className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                    >
                      保存备注
                    </Button>
                  </Flex>
                </div>

                <Flex justifyContent="end" className="gap-3 pt-2 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    icon={CheckCircle2}
                    loading={updating}
                    onClick={() =>
                      updateMessage({
                        resource: "messages",
                        id: selectedMessage.id,
                        values: { is_read: selectedMessage.is_read ? 0 : 1 },
                      })
                    }
                    className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    标记为{selectedMessage.is_read ? "未读" : "已读"}
                  </Button>
                </Flex>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8">
                <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                <Text className="text-gray-500 text-lg">请选择左侧的留言查看详情</Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContent>
  );
};

export default Messages;
