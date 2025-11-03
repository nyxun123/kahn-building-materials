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
import { Trash2, PencilLine, Plus, RefreshCcw, Search } from "lucide-react";
import toast from "react-hot-toast";
import { d1Api } from "@/lib/d1-api";
import { PageHeader, PageContent } from "@/components/admin";

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
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="产品管理"
          description="支持多语言内容与上下架控制"
          actions={
            <>
              <Button
                variant="secondary"
                icon={RefreshCcw}
                loading={isLoading}
                onClick={() => refetch?.()}
                className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                刷新
              </Button>
              <Button
                icon={Plus}
                onClick={() => navigate("/admin/products/new")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                新增产品
              </Button>
            </>
          }
        />

        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              placeholder="搜索产品代码或名称"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              className="pl-10 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    产品代码
                  </TableHeaderCell>
                  <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    中文名称
                  </TableHeaderCell>
                  <TableHeaderCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    英文名称
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
                {records.map((product: any) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150"
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.product_code}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-900">
                      {product.name_zh || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-900">
                      {product.name_en || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <Badge
                        color={product.is_active ? "emerald" : "slate"}
                        className="rounded-full px-3 py-1"
                      >
                        {product.is_active ? "已发布" : "已下架"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          icon={PencilLine}
                          size="xs"
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          className="rounded-md border-2 border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-200"
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
                          className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 hover:shadow-lg transition-all duration-200"
                        >
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!records.length && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Text className="text-gray-500 text-lg">暂无产品数据</Text>
                        <Button
                          icon={Plus}
                          onClick={() => navigate("/admin/products/new")}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                        >
                          创建第一个产品
                        </Button>
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
            className="pt-4 mt-4 border-t border-gray-200"
          >
            <Text className="text-sm text-gray-600">
              共 <span className="font-semibold text-gray-900">{total}</span> 条记录 · 第{" "}
              <span className="font-semibold text-gray-900">{current}</span> /{" "}
              <span className="font-semibold text-gray-900">{Math.max(pageCount ?? 1, 1)}</span> 页
            </Text>
            <div className="flex items-center gap-3">
              <select
                className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                value={pageSize}
                onChange={(event) => setPageSize?.(Number(event.target.value))}
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    每页 {size}
                  </option>
                ))}
              </select>
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
            </div>
          </Flex>
        </Card>
      </div>
    </PageContent>
  );
};

export default Products;
