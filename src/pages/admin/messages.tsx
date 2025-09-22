import { useState, useMemo } from "react";
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
import { Mail, Phone, Building2, Eye, CheckCircle2 } from "lucide-react";

const Messages = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <Flex justifyContent="between" alignItems="center" className="mb-4">
          <div>
            <Text className="text-lg font-semibold text-slate-900">客户留言</Text>
            <Text className="text-sm text-slate-500">总计 {total} 条记录</Text>
          </div>
          <Badge color="indigo">分页 {current}/{Math.max(pageCount ?? 1, 1)}</Badge>
        </Flex>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>姓名</TableHeaderCell>
                <TableHeaderCell>邮箱</TableHeaderCell>
                <TableHeaderCell>公司</TableHeaderCell>
                <TableHeaderCell>状态</TableHeaderCell>
                <TableHeaderCell className="text-right">操作</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((message: any) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium text-slate-900">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.company || "-"}</TableCell>
                  <TableCell>
                    <Badge color={message.is_read ? "emerald" : "amber"}>
                      {message.is_read ? "已读" : "未读"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="xs"
                      icon={Eye}
                      onClick={() => setSelectedId(message.id)}
                    >
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!records.length && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                    暂无留言数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Flex justifyContent="between" alignItems="center" className="mt-4 text-sm text-slate-500">
          <div>
            共 {total} 条 · 每页
            <select
              className="mx-1 rounded-md border border-slate-200 px-2 py-1 text-sm"
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
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              disabled={current === 1}
              onClick={() => setCurrent?.((current ?? 1) - 1)}
            >
              上一页
            </Button>
            <Button
              variant="secondary"
              size="xs"
              disabled={current === pageCount}
              onClick={() => setCurrent?.((current ?? 1) + 1)}
            >
              下一页
            </Button>
          </div>
        </Flex>
      </Card>

      <Card className="lg:col-span-2">
        {selectedMessage ? (
          <div className="space-y-4">
            <div>
              <Title className="text-lg font-semibold text-slate-900">留言详情</Title>
              <Text className="text-sm text-slate-500">
                创建时间：{new Date(selectedMessage.created_at).toLocaleString()}
              </Text>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-sm">
              <Flex alignItems="center" className="gap-2 text-slate-700">
                <Mail className="h-4 w-4" />
                {selectedMessage.email}
              </Flex>
              {selectedMessage.phone && (
                <Flex alignItems="center" className="gap-2 text-slate-700">
                  <Phone className="h-4 w-4" />
                  {selectedMessage.phone}
                </Flex>
              )}
              {selectedMessage.company && (
                <Flex alignItems="center" className="gap-2 text-slate-700">
                  <Building2 className="h-4 w-4" />
                  {selectedMessage.company}
                </Flex>
              )}
            </div>

            <Card className="bg-white shadow-sm">
              <Text className="text-sm text-slate-500">留言内容</Text>
              <Textarea
                className="mt-2 min-h-[160px] resize-none bg-slate-50"
                value={selectedMessage.message}
                readOnly
              />
            </Card>

            <Flex justifyContent="end" className="gap-2">
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
              >
                标记为{selectedMessage.is_read ? "未读" : "已读"}
              </Button>
            </Flex>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            请选择左侧的留言查看详情
          </div>
        )}
      </Card>
    </div>
  );
};

export default Messages;
