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
} from "@tremor/react";
import { Save, Globe, Search, MapPin, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

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
    let issues = [];

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

    return { score, issues };
  };

  const { score, issues } = checkSEOScore();

  return (
    <div className="space-y-6">
      {/* 页面选择器和概览 */}
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title>SEO 管理中心</Title>
            <Text className="text-slate-500">
              优化搜索引擎排名和地理位置可见性
            </Text>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Metric className={`${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {score}
              </Metric>
              <Text className="text-xs">SEO评分</Text>
            </div>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              {PAGES.map((page) => (
                <SelectItem key={page.key} value={page.key}>
                  {page.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </Flex>
        
        {issues.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Flex alignItems="center" className="gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <Text className="font-medium text-yellow-800">SEO优化建议</Text>
            </Flex>
            <ul className="text-sm text-yellow-700 space-y-1">
              {issues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        {/* 基础SEO设置 */}
        <Card>
          <Title className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            基础SEO设置
          </Title>
          
          <div className="mt-4 space-y-4">
            <div className="space-y-3">
              <Text className="font-medium">页面标题</Text>
              <TextInput
                placeholder="中文标题"
                value={seoConfig.title_zh}
                onChange={(e) => setSeoConfig({...seoConfig, title_zh: e.target.value})}
              />
              <TextInput
                placeholder="英文标题"
                value={seoConfig.title_en}
                onChange={(e) => setSeoConfig({...seoConfig, title_en: e.target.value})}
              />
              <TextInput
                placeholder="俄文标题"
                value={seoConfig.title_ru}
                onChange={(e) => setSeoConfig({...seoConfig, title_ru: e.target.value})}
              />
              <Text className="text-xs text-slate-500">
                标题长度: {seoConfig.title_zh.length}/60 字符
              </Text>
            </div>

            <div className="space-y-3">
              <Text className="font-medium">页面描述</Text>
              <Textarea
                placeholder="中文描述"
                value={seoConfig.description_zh}
                onChange={(e) => setSeoConfig({...seoConfig, description_zh: e.target.value})}
                rows={3}
              />
              <Textarea
                placeholder="英文描述"
                value={seoConfig.description_en}
                onChange={(e) => setSeoConfig({...seoConfig, description_en: e.target.value})}
                rows={3}
              />
              <Textarea
                placeholder="俄文描述"
                value={seoConfig.description_ru}
                onChange={(e) => setSeoConfig({...seoConfig, description_ru: e.target.value})}
                rows={3}
              />
              <Text className="text-xs text-slate-500">
                描述长度: {seoConfig.description_zh.length}/160 字符
              </Text>
            </div>

            <div className="space-y-3">
              <Text className="font-medium">关键词 (用逗号分隔)</Text>
              <TextInput
                placeholder="中文关键词"
                value={seoConfig.keywords_zh}
                onChange={(e) => setSeoConfig({...seoConfig, keywords_zh: e.target.value})}
              />
              <TextInput
                placeholder="英文关键词"
                value={seoConfig.keywords_en}
                onChange={(e) => setSeoConfig({...seoConfig, keywords_en: e.target.value})}
              />
              <TextInput
                placeholder="俄文关键词"
                value={seoConfig.keywords_ru}
                onChange={(e) => setSeoConfig({...seoConfig, keywords_ru: e.target.value})}
              />
            </div>
          </div>
        </Card>

        {/* 地理位置SEO */}
        <Card>
          <Title className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            地理位置优化
          </Title>
          
          <div className="mt-4 space-y-4">
            <div>
              <Text className="font-medium mb-2">地理区域</Text>
              <Select value={seoConfig.geo_region} onValueChange={(value) => setSeoConfig({...seoConfig, geo_region: value})}>
                <SelectItem value="CN-ZJ">浙江省</SelectItem>
                <SelectItem value="CN-JS">江苏省</SelectItem>
                <SelectItem value="CN-SH">上海市</SelectItem>
                <SelectItem value="CN-BJ">北京市</SelectItem>
                <SelectItem value="CN-GD">广东省</SelectItem>
              </Select>
            </div>

            <div>
              <Text className="font-medium mb-2">具体城市</Text>
              <TextInput
                placeholder="例如：杭州市"
                value={seoConfig.geo_placename}
                onChange={(e) => setSeoConfig({...seoConfig, geo_placename: e.target.value})}
              />
            </div>

            <div>
              <Text className="font-medium mb-2">GPS坐标 (纬度,经度)</Text>
              <TextInput
                placeholder="例如：30.2741,120.1551"
                value={seoConfig.geo_position}
                onChange={(e) => setSeoConfig({...seoConfig, geo_position: e.target.value})}
              />
              <Text className="text-xs text-slate-500 mt-1">
                精确的地理位置有助于本地搜索排名
              </Text>
            </div>

            <div className="mt-6">
              <Title className="text-sm mb-3">社交媒体优化</Title>
              <div className="space-y-3">
                <TextInput
                  placeholder="社交媒体标题 (中文)"
                  value={seoConfig.og_title_zh}
                  onChange={(e) => setSeoConfig({...seoConfig, og_title_zh: e.target.value})}
                />
                <TextInput
                  placeholder="社交媒体标题 (英文)"
                  value={seoConfig.og_title_en}
                  onChange={(e) => setSeoConfig({...seoConfig, og_title_en: e.target.value})}
                />
                <Textarea
                  placeholder="社交媒体描述"
                  value={seoConfig.og_description_zh}
                  onChange={(e) => setSeoConfig({...seoConfig, og_description_zh: e.target.value})}
                  rows={2}
                />
                <TextInput
                  placeholder="社交媒体图片URL"
                  value={seoConfig.og_image_url}
                  onChange={(e) => setSeoConfig({...seoConfig, og_image_url: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Card>
      </Grid>

      {/* 结构化数据 */}
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <Title className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            结构化数据 (Schema.org)
          </Title>
          <div className="flex items-center gap-2">
            <Select value={seoConfig.schema_type} onValueChange={(value) => setSeoConfig({...seoConfig, schema_type: value})}>
              {SCHEMA_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            <Button variant="secondary" onClick={generateSchema}>
              生成Schema
            </Button>
          </div>
        </Flex>
        
        <div className="mt-4">
          <Textarea
            placeholder="JSON-LD 结构化数据"
            value={seoConfig.schema_data}
            onChange={(e) => setSeoConfig({...seoConfig, schema_data: e.target.value})}
            rows={12}
            className="font-mono text-sm"
          />
          <Text className="text-xs text-slate-500 mt-2">
            结构化数据帮助搜索引擎更好地理解网页内容
          </Text>
        </div>
      </Card>

      {/* 控制面板 */}
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Text>启用SEO优化</Text>
              <Switch
                checked={seoConfig.is_active}
                onChange={(checked) => setSeoConfig({...seoConfig, is_active: checked})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Text>优先级</Text>
              <Select value={seoConfig.priority.toString()} onValueChange={(value) => setSeoConfig({...seoConfig, priority: parseInt(value)})}>
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
            className="bg-green-600 hover:bg-green-700"
          >
            保存SEO配置
          </Button>
        </Flex>
      </Card>
    </div>
  );
};

export default SEOManager;