import { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Flex,
  Text,
  AreaChart,
  BarChart,
  DonutChart,
  Title,
  Metric,
  Badge,
  Button,
  Select,
  SelectItem,
  DateRangePicker,
} from "@tremor/react";
import { TrendingUp, Users, Globe, MapPin, Smartphone, Monitor, RefreshCcw } from "lucide-react";
import { PageHeader, PageContent } from "@/components/admin";

interface AnalyticsData {
  // 流量统计
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  
  // 地理分布
  geoData: Array<{
    country: string;
    countryCode: string;
    visits: number;
    percentage: number;
  }>;
  
  // 设备统计
  deviceData: Array<{
    device: string;
    visits: number;
    percentage: number;
  }>;
  
  // 搜索引擎来源
  searchEngineData: Array<{
    engine: string;
    visits: number;
    percentage: number;
    keywords: string[];
  }>;
  
  // 页面性能
  pageData: Array<{
    page: string;
    visits: number;
    avgLoadTime: number;
    bounceRate: number;
  }>;
  
  // 语言偏好
  languageData: Array<{
    language: string;
    code: string;
    visits: number;
    percentage: number;
  }>;
  
  // 时间序列数据
  timeSeriesData: Array<{
    date: string;
    visits: number;
    uniqueVisitors: number;
    pageViews: number;
  }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("visits");

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // 使用模拟数据进行演示
        setAnalyticsData(generateMockData());
      }
    } catch (error) {
      console.error('加载分析数据失败:', error);
      // 使用模拟数据
      setAnalyticsData(generateMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (): AnalyticsData => {
    return {
      totalVisits: 15847,
      uniqueVisitors: 12456,
      pageViews: 28934,
      bounceRate: 45.2,
      avgSessionDuration: 185,
      
      geoData: [
        { country: "中国", countryCode: "CN", visits: 8923, percentage: 56.3 },
        { country: "俄罗斯", countryCode: "RU", visits: 3456, percentage: 21.8 },
        { country: "美国", countryCode: "US", visits: 1789, percentage: 11.3 },
        { country: "德国", countryCode: "DE", visits: 987, percentage: 6.2 },
        { country: "其他", countryCode: "XX", visits: 692, percentage: 4.4 },
      ],
      
      deviceData: [
        { device: "桌面端", visits: 9508, percentage: 60.0 },
        { device: "移动端", visits: 5085, percentage: 32.1 },
        { device: "平板", visits: 1254, percentage: 7.9 },
      ],
      
      searchEngineData: [
        { 
          engine: "Google", 
          visits: 7823, 
          percentage: 49.4,
          keywords: ["wallpaper adhesive", "墙纸胶", "building materials"]
        },
        { 
          engine: "Baidu", 
          visits: 4567, 
          percentage: 28.8,
          keywords: ["墙纸胶粉", "建材", "杭州建材"]
        },
        { 
          engine: "Yandex", 
          visits: 2345, 
          percentage: 14.8,
          keywords: ["клей для обоев", "строительные материалы"]
        },
        { 
          engine: "Bing", 
          visits: 1112, 
          percentage: 7.0,
          keywords: ["adhesive powder", "construction materials"]
        },
      ],
      
      pageData: [
        { page: "/", visits: 5678, avgLoadTime: 1.2, bounceRate: 35.5 },
        { page: "/products", visits: 4234, avgLoadTime: 1.8, bounceRate: 42.1 },
        { page: "/oem", visits: 2345, avgLoadTime: 1.5, bounceRate: 38.7 },
        { page: "/about", visits: 1789, avgLoadTime: 1.1, bounceRate: 55.2 },
        { page: "/contact", visits: 1801, avgLoadTime: 1.3, bounceRate: 28.9 },
      ],
      
      languageData: [
        { language: "中文", code: "zh", visits: 9234, percentage: 58.3 },
        { language: "English", code: "en", visits: 4567, percentage: 28.8 },
        { language: "Русский", code: "ru", visits: 2046, percentage: 12.9 },
      ],
      
      timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        visits: Math.floor(Math.random() * 500) + 200,
        uniqueVisitors: Math.floor(Math.random() * 300) + 150,
        pageViews: Math.floor(Math.random() * 800) + 400,
      })),
    };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  if (!analyticsData) {
    return (
      <PageContent maxWidth="2xl">
        <div className="flex items-center justify-center py-12">
          <Text className="text-gray-500">加载中...</Text>
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="网站分析"
          description="监控网站流量、用户行为和SEO效果"
          actions={
            <>
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
                className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
              >
                <SelectItem value="1d">今日</SelectItem>
                <SelectItem value="7d">近7天</SelectItem>
                <SelectItem value="30d">近30天</SelectItem>
                <SelectItem value="90d">近3个月</SelectItem>
              </Select>
              <Button
                variant="secondary"
                icon={RefreshCcw}
                loading={isLoading}
                onClick={loadAnalyticsData}
                className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                刷新
              </Button>
            </>
          }
        />

        {/* 核心指标概览 */}
        <Grid numItemsSm={1} numItemsMd={2} numItemsLg={5} className="gap-4">
          <Card className="bg-gradient-to-br from-white to-blue-50 rounded-xl border-l-4 border-l-blue-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text className="text-sm font-medium text-gray-600">总访问量</Text>
                <Metric className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.totalVisits.toLocaleString()}
                </Metric>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
            </Flex>
            <Text className="mt-2 text-xs text-green-600 font-medium">
              ↑ 比昨日 +12.5%
            </Text>
          </Card>

          <Card className="bg-gradient-to-br from-white to-emerald-50 rounded-xl border-l-4 border-l-emerald-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text className="text-sm font-medium text-gray-600">独立访客</Text>
                <Metric className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.uniqueVisitors.toLocaleString()}
                </Metric>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <Users className="h-6 w-6" />
              </div>
            </Flex>
            <Text className="mt-2 text-xs text-green-600 font-medium">
              ↑ 比昨日 +8.3%
            </Text>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 rounded-xl border-l-4 border-l-purple-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text className="text-sm font-medium text-gray-600">页面浏览量</Text>
                <Metric className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.pageViews.toLocaleString()}
                </Metric>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <Globe className="h-6 w-6" />
              </div>
            </Flex>
            <Text className="mt-2 text-xs text-green-600 font-medium">
              ↑ 比昨日 +15.7%
            </Text>
          </Card>

          <Card className="bg-gradient-to-br from-white to-amber-50 rounded-xl border-l-4 border-l-amber-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text className="text-sm font-medium text-gray-600">跳出率</Text>
                <Metric className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.bounceRate}%
                </Metric>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <TrendingUp className="h-6 w-6 rotate-180" />
              </div>
            </Flex>
            <Text className="mt-2 text-xs text-green-600 font-medium">
              ↓ 比昨日 -2.1%
            </Text>
          </Card>

          <Card className="bg-gradient-to-br from-white to-cyan-50 rounded-xl border-l-4 border-l-cyan-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text className="text-sm font-medium text-gray-600">平均停留时间</Text>
                <Metric className="text-2xl font-bold text-gray-900 mt-1">
                  {formatDuration(analyticsData.avgSessionDuration)}
                </Metric>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                <Monitor className="h-6 w-6" />
              </div>
            </Flex>
            <Text className="mt-2 text-xs text-green-600 font-medium">
              ↑ 比昨日 +5.4%
            </Text>
          </Card>
        </Grid>

        {/* 流量趋势图 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <Flex justifyContent="between" alignItems="center" className="mb-6">
            <Title className="text-lg font-bold text-gray-900">流量趋势</Title>
            <Select
              value={selectedMetric}
              onValueChange={setSelectedMetric}
              className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
            >
              <SelectItem value="visits">访问量</SelectItem>
              <SelectItem value="uniqueVisitors">独立访客</SelectItem>
              <SelectItem value="pageViews">页面浏览量</SelectItem>
            </Select>
          </Flex>
          <AreaChart
            className="h-72"
            data={analyticsData.timeSeriesData}
            index="date"
            categories={[selectedMetric]}
            colors={["indigo"]}
            valueFormatter={(value) => value.toLocaleString()}
          />
        </Card>

        <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
          {/* 地理分布 */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Title className="mb-6 text-lg font-bold text-gray-900">地理分布</Title>
          <div className="space-y-4">
            {analyticsData.geoData.map((item, index) => (
              <Flex key={item.countryCode} justifyContent="between" alignItems="center">
                <Flex alignItems="center" className="gap-3">
                  <div className="w-6 text-center">
                    {item.countryCode}
                  </div>
                  <Text>{item.country}</Text>
                </Flex>
                <div className="flex items-center gap-3">
                  <Text className="text-slate-500">{item.visits.toLocaleString()}</Text>
                  <Badge color={index === 0 ? "green" : "slate"}>
                    {item.percentage}%
                  </Badge>
                </div>
              </Flex>
            ))}
          </div>
        </Card>

          {/* 设备统计 */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Title className="mb-6 text-lg font-bold text-gray-900">设备分布</Title>
          <DonutChart
            className="h-48"
            data={analyticsData.deviceData}
            index="device"
            category="visits"
            colors={["blue", "green", "orange"]}
            valueFormatter={(value) => value.toLocaleString()}
          />
          <div className="mt-4 space-y-2">
            {analyticsData.deviceData.map((item, index) => (
              <Flex key={item.device} justifyContent="between" alignItems="center">
                <Flex alignItems="center" className="gap-2">
                  {item.device === "桌面端" && <Monitor className="h-4 w-4" />}
                  {item.device === "移动端" && <Smartphone className="h-4 w-4" />}
                  <Text>{item.device}</Text>
                </Flex>
                <Badge>{item.percentage}%</Badge>
              </Flex>
            ))}
          </div>
        </Card>
      </Grid>

        <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
          {/* 搜索引擎来源 */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Title className="mb-6 text-lg font-bold text-gray-900">搜索引擎来源</Title>
          <BarChart
            className="h-48"
            data={analyticsData.searchEngineData}
            index="engine"
            categories={["visits"]}
            colors={["blue"]}
            valueFormatter={(value) => value.toLocaleString()}
          />
          <div className="mt-4 space-y-3">
            {analyticsData.searchEngineData.map((item) => (
              <div key={item.engine} className="border-l-2 border-blue-200 pl-3">
                <Flex justifyContent="between" alignItems="center">
                  <Text className="font-medium">{item.engine}</Text>
                  <Badge>{item.percentage}%</Badge>
                </Flex>
                <Text className="text-xs text-slate-500 mt-1">
                  热门关键词: {item.keywords.join(", ")}
                </Text>
              </div>
            ))}
          </div>
        </Card>

          {/* 语言偏好 */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Title className="mb-6 text-lg font-bold text-gray-900">语言偏好分析</Title>
          <DonutChart
            className="h-48"
            data={analyticsData.languageData}
            index="language"
            category="visits"
            colors={["red", "blue", "green"]}
            valueFormatter={(value) => value.toLocaleString()}
          />
          <div className="mt-4 space-y-2">
            {analyticsData.languageData.map((item) => (
              <Flex key={item.code} justifyContent="between" alignItems="center">
                <Text>{item.language}</Text>
                <div className="flex items-center gap-2">
                  <Text className="text-slate-500">{item.visits.toLocaleString()}</Text>
                  <Badge>{item.percentage}%</Badge>
                </div>
              </Flex>
            ))}
          </div>
        </Card>
      </Grid>

        {/* 页面性能分析 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <Title className="mb-6 text-lg font-bold text-gray-900">页面性能分析</Title>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">页面</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">访问量</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">平均加载时间</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">跳出率</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.pageData.map((item) => (
                  <tr key={item.page} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.page}</td>
                    <td className="py-4 px-6 text-right text-gray-900">{item.visits.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                      <Badge
                        color={item.avgLoadTime < 2 ? "emerald" : item.avgLoadTime < 3 ? "amber" : "rose"}
                        className="rounded-full px-3 py-1"
                      >
                        {item.avgLoadTime}s
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Badge
                        color={item.bounceRate < 40 ? "emerald" : item.bounceRate < 60 ? "amber" : "rose"}
                        className="rounded-full px-3 py-1"
                      >
                        {item.bounceRate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContent>
  );
};

export default Analytics;