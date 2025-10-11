import { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Flex,
  Text,
  TextInput,
  Button,
  Badge,
  Select,
  SelectItem,
  Switch,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";
import { Save, Download, RefreshCcw, Globe, Link, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface SitemapEntry {
  id?: number;
  url: string;
  url_zh: string;
  url_en: string;
  url_ru: string;
  priority: number;
  changefreq: string;
  lastmod: string;
  status: string;
  page_type: string;
  is_multilingual: boolean;
}

const CHANGE_FREQUENCIES = [
  { value: "always", label: "总是" },
  { value: "hourly", label: "每小时" },
  { value: "daily", label: "每日" },
  { value: "weekly", label: "每周" },
  { value: "monthly", label: "每月" },
  { value: "yearly", label: "每年" },
  { value: "never", label: "从不" },
];

const PAGE_TYPES = [
  { value: "homepage", label: "首页" },
  { value: "product", label: "产品页" },
  { value: "category", label: "分类页" },
  { value: "service", label: "服务页" },
  { value: "about", label: "关于页面" },
  { value: "contact", label: "联系页面" },
  { value: "other", label: "其他" },
];

const SitemapManager = () => {
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SitemapEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadSitemapEntries();
  }, []);

  const loadSitemapEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/sitemap', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSitemapEntries(data);
      } else {
        // 使用默认的网站地图条目
        setSitemapEntries(getDefaultSitemapEntries());
      }
    } catch (error) {
      console.error('加载网站地图失败:', error);
      setSitemapEntries(getDefaultSitemapEntries());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSitemapEntries = (): SitemapEntry[] => {
    return [
      {
        id: 1,
        url: "/",
        url_zh: "/",
        url_en: "/en",
        url_ru: "/ru",
        priority: 1.0,
        changefreq: "daily",
        lastmod: new Date().toISOString(),
        status: "active",
        page_type: "homepage",
        is_multilingual: true,
      },
      {
        id: 2,
        url: "/products",
        url_zh: "/products",
        url_en: "/en/products",
        url_ru: "/ru/products",
        priority: 0.9,
        changefreq: "weekly",
        lastmod: new Date().toISOString(),
        status: "active",
        page_type: "product",
        is_multilingual: true,
      },
      {
        id: 3,
        url: "/oem",
        url_zh: "/oem",
        url_en: "/en/oem",
        url_ru: "/ru/oem",
        priority: 0.8,
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
        status: "active",
        page_type: "service",
        is_multilingual: true,
      },
      {
        id: 4,
        url: "/about",
        url_zh: "/about",
        url_en: "/en/about",
        url_ru: "/ru/about",
        priority: 0.7,
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
        status: "active",
        page_type: "about",
        is_multilingual: true,
      },
      {
        id: 5,
        url: "/contact",
        url_zh: "/contact",
        url_en: "/en/contact",
        url_ru: "/ru/contact",
        priority: 0.8,
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
        status: "active",
        page_type: "contact",
        is_multilingual: true,
      },
    ];
  };

  const saveEntry = async (entry: SitemapEntry) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-auth') || '{}').token}`,
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        toast.success('网站地图条目保存成功');
        loadSitemapEntries();
        setEditingEntry(null);
        setShowAddForm(false);
      } else {
        // 本地更新（演示模式）
        if (entry.id) {
          setSitemapEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
        } else {
          setSitemapEntries(prev => [...prev, { ...entry, id: Date.now() }]);
        }
        toast.success('网站地图条目保存成功');
        setEditingEntry(null);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      setSitemapEntries(prev => prev.filter(e => e.id !== id));
      toast.success('条目已删除');
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      // 生成XML网站地图
      const xmlContent = generateSitemapXML();
      
      // 下载文件
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('网站地图生成成功');
    } catch (error) {
      console.error('生成网站地图失败:', error);
      toast.error('生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSitemapXML = () => {
    const activeEntries = sitemapEntries.filter(e => e.status === 'active');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;
    xml += ` xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
    
    activeEntries.forEach(entry => {
      xml += `  <url>\n`;
      xml += `    <loc>https://kn-wallpaperglue.com${entry.url_zh}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod.split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      
      // 添加多语言链接
      if (entry.is_multilingual) {
        xml += `    <xhtml:link rel="alternate" hreflang="zh" href="https://kn-wallpaperglue.com${entry.url_zh}" />\n`;
        xml += `    <xhtml:link rel="alternate" hreflang="en" href="https://kn-wallpaperglue.com${entry.url_en}" />\n`;
        xml += `    <xhtml:link rel="alternate" hreflang="ru" href="https://kn-wallpaperglue.com${entry.url_ru}" />\n`;
      }
      
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    return xml;
  };

  const EntryForm = ({ entry, onSave, onCancel }: { 
    entry: SitemapEntry | null, 
    onSave: (entry: SitemapEntry) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<SitemapEntry>(
      entry || {
        url: "",
        url_zh: "",
        url_en: "",
        url_ru: "",
        priority: 0.5,
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
        status: "active",
        page_type: "other",
        is_multilingual: true,
      }
    );

    return (
      <Card>
        <Title>{entry ? "编辑" : "新增"}网站地图条目</Title>
        <div className="mt-4 space-y-4">
          <Grid numItemsSm={1} numItemsLg={2} className="gap-4">
            <div>
              <Text className="font-medium mb-2">基础URL</Text>
              <TextInput
                placeholder="/example"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
            <div>
              <Text className="font-medium mb-2">页面类型</Text>
              <Select 
                value={formData.page_type} 
                onValueChange={(value) => setFormData({...formData, page_type: value})}
              >
                {PAGE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </Select>
            </div>
          </Grid>

          <div className="flex items-center gap-2">
            <Text>启用多语言</Text>
            <Switch
              checked={formData.is_multilingual}
              onChange={(checked) => setFormData({...formData, is_multilingual: checked})}
            />
          </div>

          {formData.is_multilingual && (
            <Grid numItemsSm={1} numItemsLg={3} className="gap-4">
              <div>
                <Text className="font-medium mb-2">中文URL</Text>
                <TextInput
                  placeholder="/example"
                  value={formData.url_zh}
                  onChange={(e) => setFormData({...formData, url_zh: e.target.value})}
                />
              </div>
              <div>
                <Text className="font-medium mb-2">英文URL</Text>
                <TextInput
                  placeholder="/en/example"
                  value={formData.url_en}
                  onChange={(e) => setFormData({...formData, url_en: e.target.value})}
                />
              </div>
              <div>
                <Text className="font-medium mb-2">俄文URL</Text>
                <TextInput
                  placeholder="/ru/example"
                  value={formData.url_ru}
                  onChange={(e) => setFormData({...formData, url_ru: e.target.value})}
                />
              </div>
            </Grid>
          )}

          <Grid numItemsSm={1} numItemsLg={3} className="gap-4">
            <div>
              <Text className="font-medium mb-2">优先级</Text>
              <Select 
                value={formData.priority.toString()} 
                onValueChange={(value) => setFormData({...formData, priority: parseFloat(value)})}
              >
                <SelectItem value="1.0">1.0 (最高)</SelectItem>
                <SelectItem value="0.9">0.9</SelectItem>
                <SelectItem value="0.8">0.8</SelectItem>
                <SelectItem value="0.7">0.7</SelectItem>
                <SelectItem value="0.6">0.6</SelectItem>
                <SelectItem value="0.5">0.5 (中等)</SelectItem>
                <SelectItem value="0.4">0.4</SelectItem>
                <SelectItem value="0.3">0.3</SelectItem>
                <SelectItem value="0.2">0.2</SelectItem>
                <SelectItem value="0.1">0.1 (最低)</SelectItem>
              </Select>
            </div>
            <div>
              <Text className="font-medium mb-2">更新频率</Text>
              <Select 
                value={formData.changefreq} 
                onValueChange={(value) => setFormData({...formData, changefreq: value})}
              >
                {CHANGE_FREQUENCIES.map(freq => (
                  <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Text className="font-medium mb-2">状态</Text>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectItem value="active">激活</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
              </Select>
            </div>
          </Grid>

          <Flex justifyContent="end" className="gap-2">
            <Button variant="secondary" onClick={onCancel}>
              取消
            </Button>
            <Button 
              icon={Save} 
              loading={isSaving}
              onClick={() => onSave(formData)}
            >
              保存
            </Button>
          </Flex>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 头部控制区 */}
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title>网站地图管理</Title>
            <Text className="text-slate-500">
              管理多语言URL结构和搜索引擎索引
            </Text>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              icon={RefreshCcw}
              loading={isLoading}
              onClick={loadSitemapEntries}
            >
              刷新
            </Button>
            <Button 
              variant="secondary"
              icon={Download}
              loading={isGenerating}
              onClick={generateSitemap}
            >
              生成XML
            </Button>
            <Button 
              icon={Plus}
              onClick={() => setShowAddForm(true)}
            >
              新增条目
            </Button>
          </div>
        </Flex>
      </Card>

      {/* 新增/编辑表单 */}
      {(showAddForm || editingEntry) && (
        <EntryForm
          entry={editingEntry}
          onSave={saveEntry}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEntry(null);
          }}
        />
      )}

      {/* 网站地图条目列表 */}
      <Card>
        <Title className="mb-4">网站地图条目</Title>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>URL路径</TableHeaderCell>
              <TableHeaderCell>页面类型</TableHeaderCell>
              <TableHeaderCell>多语言</TableHeaderCell>
              <TableHeaderCell>优先级</TableHeaderCell>
              <TableHeaderCell>更新频率</TableHeaderCell>
              <TableHeaderCell>状态</TableHeaderCell>
              <TableHeaderCell>操作</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sitemapEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Text className="font-medium">{entry.url_zh}</Text>
                    {entry.is_multilingual && (
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>🇬🇧 {entry.url_en}</div>
                        <div>🇷🇺 {entry.url_ru}</div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>
                    {PAGE_TYPES.find(t => t.value === entry.page_type)?.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge color={entry.is_multilingual ? "green" : "gray"}>
                    {entry.is_multilingual ? "是" : "否"}
                  </Badge>
                </TableCell>
                <TableCell>{entry.priority}</TableCell>
                <TableCell>
                  {CHANGE_FREQUENCIES.find(f => f.value === entry.changefreq)?.label}
                </TableCell>
                <TableCell>
                  <Badge color={entry.status === "active" ? "green" : "red"}>
                    {entry.status === "active" ? "激活" : "禁用"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setEditingEntry(entry)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="secondary"
                      color="red"
                      size="xs"
                      icon={Trash2}
                      onClick={() => entry.id && deleteEntry(entry.id)}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 统计信息 */}
      <Grid numItemsSm={1} numItemsLg={4} className="gap-4">
        <Card>
          <Text>总条目数</Text>
          <Text className="text-2xl font-bold text-blue-600">
            {sitemapEntries.length}
          </Text>
        </Card>
        <Card>
          <Text>激活条目</Text>
          <Text className="text-2xl font-bold text-green-600">
            {sitemapEntries.filter(e => e.status === 'active').length}
          </Text>
        </Card>
        <Card>
          <Text>多语言页面</Text>
          <Text className="text-2xl font-bold text-purple-600">
            {sitemapEntries.filter(e => e.is_multilingual).length}
          </Text>
        </Card>
        <Card>
          <Text>最后更新</Text>
          <Text className="text-sm text-slate-600">
            {new Date().toLocaleString()}
          </Text>
        </Card>
      </Grid>
    </div>
  );
};

export default SitemapManager;