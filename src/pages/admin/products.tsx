import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Badge,
  TextInput,
  Card,
  Button,
  Flex,
  Text,
} from "@tremor/react";
import { useTable } from "@refinedev/core";
import { Trash2, PencilLine, Plus, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { d1Api } from "@/lib/d1-api";

const Products = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const {
    tableQueryResult,
    current,
    setCurrent,
    pageCount,
    pageSize,
    setPageSize,
    setFilters,
  } = useTable({
    resource: "products",
    pagination: {
      pageSize: 10,
    },
    filters: {
      initial: [
        {
          field: "q",
          operator: "contains",
          value: "",
        },
      ],
    },
    syncWithLocation: false,
    queryOptions: {
      keepPreviousData: true,
      staleTime: 60_000,
    },
  });

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isLoading = tableQueryResult?.isLoading ?? false;
  const refetch = tableQueryResult?.refetch;
  const records = tableQueryResult?.data?.data ?? [];
  const total = tableQueryResult?.data?.total ?? 0;

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters([{
      field: "q",
      operator: "contains",
      value,
    }]);
  };

  return (
    <Card className="space-y-4">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Text className="text-lg font-semibold text-slate-900">产品管理</Text>
          <Text className="text-sm text-slate-500">支持多语言内容与上下架控制</Text>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={RefreshCcw} loading={isLoading} onClick={() => refetch?.()}>
            刷新
          </Button>
          <Button icon={Plus} onClick={() => navigate("/admin/products/new")}>
            新增产品
          </Button>
        </div>
      </Flex>

      <TextInput
        placeholder="搜索产品代码或名称"
        value={search}
        onChange={(event) => handleSearch(event.target.value)}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>产品代码</TableHeaderCell>
              <TableHeaderCell>中文名称</TableHeaderCell>
              <TableHeaderCell>英文名称</TableHeaderCell>
              <TableHeaderCell>状态</TableHeaderCell>
              <TableHeaderCell className="text-right">操作</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-slate-900">{product.product_code}</TableCell>
                <TableCell>{product.name_zh || "-"}</TableCell>
                <TableCell>{product.name_en || "-"}</TableCell>
                <TableCell>
                  <Badge color={product.is_active ? "emerald" : "slate"}>
                    {product.is_active ? "已发布" : "已下架"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      icon={PencilLine}
                      size="xs"
                      onClick={() => navigate(`/admin/products/${product.id}`)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="secondary"
                      color="rose"
                      icon={Trash2}
                      size="xs"
                      loading={deletingId === product.id}
                      onClick={async () => {
                        try {
                          setDeletingId(product.id);
                          const result = await d1Api.deleteProduct(product.id);
                          if (result.error) {
                            throw new Error(result.error.message);
                          }
                          toast.success("产品已删除");
                          await refetch?.();
                        } catch (error) {
                          console.error("删除产品失败:", error);
                          const message = error instanceof Error ? error.message : "删除失败，请重试";
                          toast.error(message || "删除失败，请重试");
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!records.length && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-slate-500">
                  暂无产品数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Flex justifyContent="between" alignItems="center" className="pt-2 text-sm text-slate-500">
        <Text>
          共 {total} 条记录 · 第 {current} / {Math.max(pageCount ?? 1, 1)} 页
        </Text>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-slate-200 px-2 py-1 text-sm"
            value={pageSize}
            onChange={(event) => setPageSize?.(Number(event.target.value))}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                每页 {size}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
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
        </div>
      </Flex>
    </Card>
  );
};

export default Products;
