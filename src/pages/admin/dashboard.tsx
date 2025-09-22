import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Grid,
  Flex,
  Metric,
  Text,
  AreaChart,
  DonutChart,
  Title,
  Button,
  Badge,
} from "@tremor/react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, PackageSearch, Activity } from "lucide-react";

interface DashboardResponse {
  data: {
    totalProducts: number;
    totalContacts: number;
    unreadContacts: number;
    activeProducts: number;
    recentActivities: number;
    dailyContacts: { date: string; count: number }[];
    categoryStats: { category: string; count: number }[];
  };
}

const fetchDashboard = async (): Promise<DashboardResponse["data"]> => {
  const headers = {
    "Content-Type": "application/json",
    ...(() => {
      try {
        const adminAuth = localStorage.getItem("admin-auth");
        if (adminAuth) {
          const parsed = JSON.parse(adminAuth);
          return parsed?.token
            ? { Authorization: `Bearer ${parsed.token}` }
            : { Authorization: "Bearer admin-session" };
        }
        if (localStorage.getItem("temp-admin-auth")) {
          return { Authorization: "Bearer temp-admin" };
        }
      } catch (error) {
        console.warn("读取认证信息失败", error);
      }
      return {};
    })(),
  };

  const response = await fetch("/api/admin/dashboard/stats", { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "仪表盘数据获取失败");
  }
  const payload = (await response.json()) as DashboardResponse;
  return payload.data;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60,
  });

  const lineChartData = useMemo(() => {
    if (!data?.dailyContacts?.length) return [];
    return data.dailyContacts.map((item) => ({
      日期: item.date,
      留言: item.count,
    }));
  }, [data?.dailyContacts]);

  const donutChartData = useMemo(() => {
    if (!data?.categoryStats?.length) return [];
    return data.categoryStats.map((item) => ({
      name: item.category || "未分类",
      count: item.count,
    }));
  }, [data?.categoryStats]);

  return (
    <div className="space-y-6">
      {error && (
        <Card decoration="top" decorationColor="rose">
          <Title>加载仪表盘失败</Title>
          <Text className="mt-2 text-sm text-rose-600">
            {error instanceof Error ? error.message : "未知错误"}
          </Text>
        </Card>
      )}

      <Grid numItemsSm={1} numItemsMd={2} numItemsLg={4} className="gap-4">
        <Card decoration="left" decorationColor="indigo">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Text>总产品数</Text>
              <Metric>{isLoading ? "--" : data?.totalProducts ?? 0}</Metric>
            </div>
            <PackageSearch className="h-10 w-10 text-indigo-500" />
          </Flex>
          <Text className="mt-3 text-xs text-slate-500">活跃产品：{data?.activeProducts ?? 0}</Text>
        </Card>

        <Card decoration="left" decorationColor="emerald">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Text>客户留言</Text>
              <Metric>{isLoading ? "--" : data?.totalContacts ?? 0}</Metric>
            </div>
            <MessageCircle className="h-10 w-10 text-emerald-500" />
          </Flex>
          <Text className="mt-3 text-xs text-slate-500">未读留言：{data?.unreadContacts ?? 0}</Text>
        </Card>

        <Card decoration="left" decorationColor="amber">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Text>近 7 天互动</Text>
              <Metric>{isLoading ? "--" : data?.recentActivities ?? 0}</Metric>
            </div>
            <Activity className="h-10 w-10 text-amber-500" />
          </Flex>
          <Text className="mt-3 text-xs text-slate-500">联系表单提交趋势</Text>
        </Card>

        <Card decoration="left" decorationColor="cyan">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Text>工作状态</Text>
              <Metric>{isLoading ? "加载中" : "系统正常"}</Metric>
            </div>
            <Badge color="cyan" className="mt-2">
              自动化部署
            </Badge>
          </Flex>
          <Text className="mt-3 text-xs text-slate-500">Cloudflare Pages 最近发布已同步</Text>
        </Card>
      </Grid>

      <Grid numItemsSm={1} numItemsLg={3} className="gap-4">
        <Card className="lg:col-span-2">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Title>30 日留言走势</Title>
              <Text className="text-sm text-slate-500">
                结合销售漏斗，评估市场推广效果
              </Text>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate("/admin/messages")}>
              查看留言
            </Button>
          </Flex>
          <AreaChart
            className="mt-6 h-60"
            data={lineChartData}
            index="日期"
            categories={["留言"]}
            colors={["indigo"]}
            noDataText={isLoading ? "正在加载数据..." : "暂无数据"}
            yAxisWidth={56}
          />
        </Card>

        <Card>
          <Title>活跃产品分类占比</Title>
          <DonutChart
            className="mt-6"
            data={donutChartData}
            index="name"
            category="count"
            colors={["indigo", "emerald", "amber", "rose", "cyan", "violet"]}
            valueFormatter={(value) => `${value} 款`}
            noDataText={isLoading ? "正在载入" : "暂无分类数据"}
          />
        </Card>
      </Grid>

      <Card>
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title>常用快捷操作</Title>
            <Text className="text-sm text-slate-500">高频任务一键直达</Text>
          </div>
        </Flex>
        <Grid numItemsSm={1} numItemsMd={2} numItemsLg={4} className="mt-6 gap-4">
          <Card decoration="top" decorationColor="indigo">
            <Title>新增产品</Title>
            <Text className="mt-2 text-sm text-slate-500">快速发布新品，支持多语言内容</Text>
            <Button className="mt-4" onClick={() => navigate("/admin/products/new")}>
              立即创建
            </Button>
          </Card>
          <Card decoration="top" decorationColor="emerald">
            <Title>管理产品</Title>
            <Text className="mt-2 text-sm text-slate-500">上下架、排序与规格维护</Text>
            <Button className="mt-4" variant="secondary" onClick={() => navigate("/admin/products")}
            >
              前往列表
            </Button>
          </Card>
          <Card decoration="top" decorationColor="rose">
            <Title>回复留言</Title>
            <Text className="mt-2 text-sm text-slate-500">跟进客户意向，记录处理备注</Text>
            <Button className="mt-4" variant="secondary" onClick={() => navigate("/admin/messages")}
            >
              处理留言
            </Button>
          </Card>
          <Card decoration="top" decorationColor="amber">
            <Title>内容管理</Title>
            <Text className="mt-2 text-sm text-slate-500">保持中文/英文/俄文内容一致</Text>
            <Button className="mt-4" variant="secondary" onClick={() => navigate("/admin/content")}
            >
              更新文案
            </Button>
          </Card>
        </Grid>
      </Card>
    </div>
  );
};

export default Dashboard;
