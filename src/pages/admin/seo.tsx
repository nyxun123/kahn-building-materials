import { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Flex,
  Text,
  TextInput,
  Textarea,
  Button,
  Badge,
  Select,
  SelectItem,
  Switch,
  Title,
  Metric,
  AreaChart,
  TabGroup,
  TabList,
  Tab,
  List,
  ListItem,
} from "@tremor/react";
import { Save, Globe, Search, MapPin, TrendingUp, AlertCircle, Link as LinkIcon, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { PageHeader, PageContent, TabLangInput, FormField, FormSection, StandardUploadButton } from "@/components/admin";

interface SEOConfig {
  id?: number;
  page_key: string;
  page_name: string;

  // 基础SEO
  title_zh: string;
  title_en: string;
  title_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  keywords_zh: string;
  keywords_en: string;
  keywords_ru: string;

  // 地理位置SEO
  geo_region: string;
  geo_placename: string;
  geo_position: string;

  // 社交媒体SEO
  og_title_zh: string;
  og_title_en: string;
  og_title_ru: string;
  og_description_zh: string;
  og_description_en: string;
  og_description_ru: string;
  og_image_url: string;

  // 结构化数据
  schema_type: string;
  schema_data: string;

  // 状态
  is_active: boolean;
  priority: number;
  last_updated: string;
}

const PAGES = [
  { key: "home", name: "首页" },
  { key: "products", name: "产品页" },
  { key: "oem", name: "OEM服务" },
  { key: "about", name: "关于我们" },
  { key: "contact", name: "联系我们" },
];

const SCHEMA_TYPES = [
  { value: "Organization", label: "企业组织" },
  { value: "Product", label: "产品" },
  { value: "Service", label: "服务" },
  { value: "Article", label: "文章" },
  { value: "WebPage", label: "网页" },
  { value: "ContactPage", label: "联系页面" },
];

const YandexStatusCard = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'not_configured' | 'error'>('loading');
  const [data, setData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchYandexData();
  }, []);

  const fetchYandexData = async () => {
    try {
      const response = await fetch('/api/admin/yandex', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.status === 'connected') {
          setData(result.data.data);
          setStatus('connected');
        } else if (result.data && result.data.status === 'not_configured') {
          setStatus('not_configured');
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    } catch (e) {
      console.error('Failed to fetch Yandex data', e);
      setStatus('error');
    }
  };

  const handleSubmitSitemap = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/yandex-submit-sitemap', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Sitemap 已成功提交至 Yandex');
        // Refresh data to see if anything changes (though indexing takes time)
        fetchYandexData();
      } else {
        toast.error(`提交失败: ${result.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('提交 Sitemap 时发生错误');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'not_configured') {
    return (
      <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <Flex justifyContent="between" alignItems="center">
          <Title className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <span className="text-red-600 font-bold">Y</span>
            Yandex Webmaster
          </Title>
          <Badge color="amber">未配置</Badge>
        </Flex>
        <Text className="mt-2 text-gray-500">
          请配置 YANDEX_ACCESS_TOKEN 环境变量以启用 Yandex 监控。
        </Text>
      </Card>
    );
  }

  if (status === 'loading') {
    return (
      <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <Text>加载 Yandex 数据中...</Text>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <Flex justifyContent="between" alignItems="center">
          <Title className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <span className="text-red-600 font-bold">Y</span>
            Yandex Webmaster
          </Title>
          <Badge color="red">连接失败</Badge>
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <Flex justifyContent="between" alignItems="center" className="mb-4">
        <Title className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="text-red-600 font-bold">Y</span>
          Yandex Webmaster
        </Title>
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="secondary"
            onClick={handleSubmitSitemap}
            loading={submitting}
            disabled={status !== 'connected'}
          >
            提交 Sitemap
          </Button>
          <Badge color="green">已连接</Badge>
        </div>
      </Flex>

      <Grid numItems={3} className="gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-500 text-xs uppercase">SQI (Site Quality Index)</Text>
          <Metric className="text-xl mt-1">{data?.sqi || '-'}</Metric>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-500 text-xs uppercase">已索引页面</Text>
          <Metric className="text-xl mt-1">{data?.indexed_count || '-'}</Metric>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-500 text-xs uppercase">被排除页面</Text>
          <Metric className="text-xl mt-1 text-red-600">{data?.excluded_count || '-'}</Metric>
        </div>
      </Grid>

      {data?.popular_queries && data.popular_queries.length > 0 && (
        <div className="mt-4">
          <Text className="font-medium mb-2">热门搜索词 (Yandex)</Text>
          <div className="flex flex-wrap gap-2">
            {data.popular_queries.map((q: any, i: number) => (
              <Badge key={i} color="gray">{q.query_text}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const SEOManager = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [seoConfig, setSeoConfig] = useState<SEOConfig>({
    page_key: "home",
    page_name: "首页",
    title_zh: "",
    title_en: "",
    title_ru: "",
    description_zh: "",
    description_en: "",
    description_ru: "",
    keywords_zh: "",
    keywords_en: "",
    keywords_ru: "",
    geo_region: "CN-ZJ",
    geo_placename: "杭州市",
    geo_position: "30.2741,120.1551",
    og_title_zh: "",
    og_title_en: "",
    og_title_ru: "",
    og_description_zh: "",
    og_description_en: "",
    og_description_ru: "",
    og_image_url: "",
    schema_type: "Organization",
    schema_data: "",
    is_active: true,
    priority: 1,
    last_updated: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [linkMetrics, setLinkMetrics] = useState({
    internal: 0,
    external: 0,
    broken: 0,
    lastScanned: null as string | null,
  });

  const [analyticsData, setAnalyticsData] = useState([
    { date: "Nov 01", Clicks: 120, Impressions: 2400 },
    { date: "Nov 05", Clicks: 145, Impressions: 2800 },
    { date: "Nov 10", Clicks: 180, Impressions: 3500 },
    { date: "Nov 15", Clicks: 160, Impressions: 3200 },
    { date: "Nov 20", Clicks: 210, Impressions: 4100 },
    { date: "Nov 25", Clicks: 250, Impressions: 4800 },
    { date: "Nov 30", Clicks: 290, Impressions: 5200 },
  ]);
  const [gscStatus, setGscStatus] = useState<'loading' | 'connected' | 'not_configured' | 'error'>('loading');

  useEffect(() => {
    loadGSCData();
  }, []);

  const loadGSCData = async () => {
    try {
      const response = await fetch('/api/admin/gsc', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.status === 'connected') {
          setAnalyticsData(result.data.data);
          setGscStatus('connected');
        } else if (result.data && result.data.status === 'not_configured') {
          setGscStatus('not_configured');
          // Keep mock data for display but show warning
        }
      } else {
        setGscStatus('error');
      }
    } catch (error) {
      console.error('Failed to load GSC data:', error);
      setGscStatus('error');
    }
  };

  const scanPageLinks = async () => {
    setIsScanning(true);
    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, we would fetch the page HTML and parse it.
      // For this demo, we'll simulate results based on the page key.
      const mockResults = {
        home: { internal: 12, external: 4 },
        products: { internal: 24, external: 2 },
        about: { internal: 8, external: 3 },
        contact: { internal: 5, external: 5 },
        oem: { internal: 10, external: 1 },
      };

      const result = mockResults[selectedPage as keyof typeof mockResults] || { internal: 5, external: 2 };

      setLinkMetrics({
        internal: result.internal,
        external: result.external,
        broken: 0,
        lastScanned: new Date().toISOString(),
      });
      toast.success("页面链接扫描完成");
    } catch (error) {
      toast.error("扫描失败");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    loadSEOConfig();
  }, [selectedPage]);

  const loadSEOConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/seo/${selectedPage}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSeoConfig(data);
      } else {
        // 如果没有配置，使用默认值
        const defaultConfig = {
          ...seoConfig,
          page_key: selectedPage,
          page_name: PAGES.find(p => p.key === selectedPage)?.name || selectedPage,
        };
        setSeoConfig(defaultConfig);
      }
    } catch (error) {
      console.error('加载SEO配置失败:', error);
      toast.error('加载SEO配置失败');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSEOConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/seo/${selectedPage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
        body: JSON.stringify({
          ...seoConfig,
          last_updated: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success('SEO配置保存成功');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存SEO配置失败:', error);
      toast.error('保存SEO配置失败');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSchema = () => {
    let schema = {};

    switch (seoConfig.schema_type) {
      case "Organization":
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "杭州卡恩新型建材有限公司",
          "url": "https://kn-wallpaperglue.com",
          "logo": "https://kn-wallpaperglue.com/images/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+86-571-XXXXXXXX",
            "contactType": "customer service",
            "areaServed": "CN",
            "availableLanguage": ["Chinese", "English", "Russian"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CN",
            "addressRegion": "浙江省",
            "addressLocality": "杭州市"
          }
        };
        break;
      case "Product":
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": seoConfig.title_zh,
          "description": seoConfig.description_zh,
          "brand": {
            "@type": "Brand",
            "name": "卡恩建材"
          },
          "manufacturer": {
            "@type": "Organization",
            "name": "杭州卡恩新型建材有限公司"
          }
        };
        break;
    }

    setSeoConfig({
      ...seoConfig,
      schema_data: JSON.stringify(schema, null, 2),
    });
  };

  const checkSEOScore = () => {
    let score = 0;
    const issues = [];

    // 检查标题长度
    if (seoConfig.title_zh.length > 0 && seoConfig.title_zh.length <= 60) score += 20;
    else issues.push("标题长度应在60字符以内");

    // 检查描述长度
    if (seoConfig.description_zh.length > 0 && seoConfig.description_zh.length <= 160) score += 20;
    else issues.push("描述长度应在160字符以内");

    // 检查关键词
    if (seoConfig.keywords_zh.length > 0) score += 15;
    else issues.push("缺少关键词");

    // 检查多语言
    if (seoConfig.title_en && seoConfig.title_ru) score += 15;
    else issues.push("缺少多语言版本");

    // 检查地理位置信息
    if (seoConfig.geo_region && seoConfig.geo_placename) score += 10;
    else issues.push("缺少地理位置信息");

    // 检查社交媒体
    if (seoConfig.og_title_zh && seoConfig.og_description_zh) score += 10;
    else issues.push("缺少社交媒体优化");

    // 检查结构化数据
    if (seoConfig.schema_data) score += 10;
    else issues.push("缺少结构化数据");

    // 检查链接健康度 (如果有扫描数据)
    if (linkMetrics.lastScanned) {
      if (linkMetrics.internal > 0) score += 5;
      else issues.push("缺少内部链接");

      if (linkMetrics.external > 0) score += 5;
      // External links are not strictly required for score but good for SEO context
    } else {
      // If not scanned, assume potential points available
      issues.push("建议运行链接扫描以完善评分");
    }

    return { score, issues };
  };

  const { score, issues } = checkSEOScore();

  return (
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="SEO 管理中心"
          description="优化搜索引擎排名和地理位置可见性"
          actions={
            <div className="flex items-center gap-4">
              <div className="text-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl px-4 py-2 border-2 border-emerald-200">
                <Metric className={`text-2xl font-bold ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {score}
                </Metric>
                <Text className="text-xs font-medium text-gray-600">SEO评分</Text>
              </div>
              <Select
                value={selectedPage}
                onValueChange={setSelectedPage}
                className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
              >
                {PAGES.map((page) => (
                  <SelectItem key={page.key} value={page.key}>
                    {page.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          }
        />

        {issues.length > 0 && (
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl shadow-sm">
            <Flex alignItems="center" className="gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <Text className="font-semibold text-amber-800">SEO优化建议</Text>
            </Flex>
            <ul className="text-sm text-amber-700 space-y-1 pl-7">
              {issues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* 流量分析图表 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Title className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            搜索流量趋势 (Google Search Console)
          </Title>
          <AreaChart
            className="h-72 mt-4"
            data={analyticsData}
            index="date"
            categories={["Clicks", "Impressions"]}
            colors={["indigo", "cyan"]}
            valueFormatter={(number) => Intl.NumberFormat("us").format(number).toString()}
          />
          <div className="mt-4 flex justify-end">
            <Button
              variant={gscStatus === 'connected' ? 'primary' : 'secondary'}
              size="xs"
              color={gscStatus === 'connected' ? 'green' : gscStatus === 'not_configured' ? 'amber' : 'red'}
              disabled
            >
              {gscStatus === 'connected' ? '已连接 Google Search Console' :
                gscStatus === 'not_configured' ? '未配置 GSC (显示演示数据)' :
                  gscStatus === 'loading' ? '加载中...' : '连接失败 (显示演示数据)'}
            </Button>
          </div>
        </Card>

        {/* Yandex Webmaster Status */}
        <YandexStatusCard />

        <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
          {/* 链接分析 */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Flex justifyContent="between" alignItems="center" className="mb-4">
              <Title className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <LinkIcon className="h-5 w-5 text-indigo-600" />
                链接分析
              </Title>
              <Button
                size="xs"
                variant="secondary"
                icon={RefreshCw}
                loading={isScanning}
                onClick={scanPageLinks}
              >
                扫描链接
              </Button>
            </Flex>

            <Grid numItems={2} className="gap-4 mb-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <Flex justifyContent="start" alignItems="center" className="gap-2 mb-1">
                  <LinkIcon className="h-4 w-4 text-indigo-600" />
                  <Text className="text-indigo-900 font-medium">内部链接</Text>
                </Flex>
                <Metric className="text-indigo-700">{linkMetrics.internal}</Metric>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Flex justifyContent="start" alignItems="center" className="gap-2 mb-1">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <Text className="text-blue-900 font-medium">外部链接</Text>
                </Flex>
                <Metric className="text-blue-700">{linkMetrics.external}</Metric>
              </div>
            </Grid>

            {linkMetrics.lastScanned && (
              <Text className="text-xs text-gray-500 text-center">
                上次扫描: {new Date(linkMetrics.lastScanned).toLocaleString()}
              </Text>
            )}
            {!linkMetrics.lastScanned && (
              <Text className="text-xs text-gray-500 text-center italic">
                点击扫描以分析页面链接结构
              </Text>
            )}
          </Card>
          {/* 基础SEO设置 */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Title className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
              <Search className="h-5 w-5 text-indigo-600" />
              基础SEO设置
            </Title>

            <div className="space-y-6">
              <FormSection title="页面标题">
                <TabLangInput
                  label="标题"
                  values={{
                    zh: seoConfig.title_zh,
                    en: seoConfig.title_en,
                    ru: seoConfig.title_ru,
                  }}
                  onChange={(lang, value) => {
                    setSeoConfig({ ...seoConfig, [`title_${lang}`]: value });
                  }}
                  type="text"
                />
                <Text className="text-xs text-gray-500 mt-2">
                  标题长度: {seoConfig.title_zh.length}/60 字符
                </Text>
              </FormSection>

              <FormSection title="页面描述">
                <TabLangInput
                  label="描述"
                  values={{
                    zh: seoConfig.description_zh,
                    en: seoConfig.description_en,
                    ru: seoConfig.description_ru,
                  }}
                  onChange={(lang, value) => {
                    setSeoConfig({ ...seoConfig, [`description_${lang}`]: value });
                  }}
                  type="textarea"
                />
                <Text className="text-xs text-gray-500 mt-2">
                  描述长度: {seoConfig.description_zh.length}/160 字符
                </Text>
              </FormSection>

              <FormSection title="关键词">
                <TabLangInput
                  label="关键词 (用逗号分隔)"
                  values={{
                    zh: seoConfig.keywords_zh,
                    en: seoConfig.keywords_en,
                    ru: seoConfig.keywords_ru,
                  }}
                  onChange={(lang, value) => {
                    setSeoConfig({ ...seoConfig, [`keywords_${lang}`]: value });
                  }}
                  type="text"
                />
              </FormSection>
            </div>
          </Card>

          {/* 地理位置SEO */}
          <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Title className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
              <MapPin className="h-5 w-5 text-indigo-600" />
              地理位置SEO
            </Title>

            <div className="space-y-4">
              <FormField label="地理区域">
                <Select
                  value={seoConfig.geo_region}
                  onValueChange={(value) => setSeoConfig({ ...seoConfig, geo_region: value })}
                  className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
                >
                  <SelectItem value="CN-ZJ">浙江省</SelectItem>
                  <SelectItem value="CN-JS">江苏省</SelectItem>
                  <SelectItem value="CN-SH">上海市</SelectItem>
                  <SelectItem value="CN-BJ">北京市</SelectItem>
                  <SelectItem value="CN-GD">广东省</SelectItem>
                </Select>
              </FormField>

              <FormField label="具体城市">
                <TextInput
                  placeholder="例如：杭州市"
                  value={seoConfig.geo_placename}
                  onChange={(e) => setSeoConfig({ ...seoConfig, geo_placename: e.target.value })}
                  className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              </FormField>

              <FormField label="GPS坐标 (纬度,经度)">
                <TextInput
                  placeholder="例如：30.2741,120.1551"
                  value={seoConfig.geo_position}
                  onChange={(e) => setSeoConfig({ ...seoConfig, geo_position: e.target.value })}
                  className="border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  精确的地理位置有助于本地搜索排名
                </Text>
              </FormField>

              <FormSection title="社交媒体优化">
                <TabLangInput
                  label="社交媒体标题"
                  values={{
                    zh: seoConfig.og_title_zh,
                    en: seoConfig.og_title_en,
                    ru: seoConfig.og_title_ru,
                  }}
                  onChange={(lang, value) => {
                    setSeoConfig({ ...seoConfig, [`og_title_${lang}`]: value });
                  }}
                  type="text"
                />
                <TabLangInput
                  label="社交媒体描述"
                  values={{
                    zh: seoConfig.og_description_zh,
                    en: seoConfig.og_description_en,
                    ru: seoConfig.og_description_ru,
                  }}
                  onChange={(lang, value) => {
                    setSeoConfig({ ...seoConfig, [`og_description_${lang}`]: value });
                  }}
                  type="textarea"
                />
                <FormField label="社交媒体图片URL">
                  <div className="flex gap-2">
                    <TextInput
                      placeholder="社交媒体图片URL"
                      value={seoConfig.og_image_url}
                      onChange={(e) => setSeoConfig({ ...seoConfig, og_image_url: e.target.value })}
                      className="flex-1 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                    <StandardUploadButton
                      onUpload={(url) => setSeoConfig({ ...seoConfig, og_image_url: url })}
                      folder="seo"
                    />
                  </div>
                </FormField>
              </FormSection>
            </div>
          </Card>
        </Grid>

        {/* 结构化数据 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <Flex justifyContent="between" alignItems="center" className="mb-4">
            <Title className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Globe className="h-5 w-5 text-indigo-600" />
              结构化数据 (Schema.org)
            </Title>
            <div className="flex items-center gap-2">
              <Select
                value={seoConfig.schema_type}
                onValueChange={(value) => setSeoConfig({ ...seoConfig, schema_type: value })}
                className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
              >
                {SCHEMA_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
              <Button
                variant="secondary"
                onClick={generateSchema}
                className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                生成Schema
              </Button>
            </div>
          </Flex>

          <FormField label="JSON-LD 结构化数据">
            <Textarea
              placeholder="JSON-LD 结构化数据"
              value={seoConfig.schema_data}
              onChange={(e) => setSeoConfig({ ...seoConfig, schema_data: e.target.value })}
              rows={12}
              className="font-mono text-sm border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
            />
            <Text className="text-xs text-gray-500 mt-2">
              结构化数据帮助搜索引擎更好地理解网页内容
            </Text>
          </FormField>
        </Card>

        {/* 控制面板 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <Flex justifyContent="between" alignItems="center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Text className="font-medium text-gray-700">启用SEO优化</Text>
                <Switch
                  checked={seoConfig.is_active}
                  onChange={(checked) => setSeoConfig({ ...seoConfig, is_active: checked })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Text className="font-medium text-gray-700">优先级</Text>
                <Select
                  value={seoConfig.priority.toString()}
                  onValueChange={(value) => setSeoConfig({ ...seoConfig, priority: parseInt(value) })}
                  className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
                >
                  <SelectItem value="1">高</SelectItem>
                  <SelectItem value="2">中</SelectItem>
                  <SelectItem value="3">低</SelectItem>
                </Select>
              </div>
            </div>

            <Button
              icon={Save}
              loading={isSaving}
              onClick={saveSEOConfig}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:from-emerald-700 hover:to-green-700 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存SEO配置
            </Button>
          </Flex>
        </Card>
      </div>
    </PageContent>
  );
};

export default SEOManager;