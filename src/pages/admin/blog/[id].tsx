/**
 * 后台博客文章编辑页
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ArticleData {
    id?: number;
    slug: string;
    title_zh: string;
    title_en: string;
    title_ru: string;
    content_zh: string;
    content_en: string;
    content_ru: string;
    excerpt_zh: string;
    excerpt_en: string;
    excerpt_ru: string;
    cover_image: string;
    category: string;
    tags: string[];
    author: string;
    is_published: boolean;
    is_featured: boolean;
    meta_title_zh: string;
    meta_title_en: string;
    meta_title_ru: string;
    meta_description_zh: string;
    meta_description_en: string;
    meta_description_ru: string;
}

const INITIAL_DATA: ArticleData = {
    slug: '',
    title_zh: '',
    title_en: '',
    title_ru: '',
    content_zh: '',
    content_en: '',
    content_ru: '',
    excerpt_zh: '',
    excerpt_en: '',
    excerpt_ru: '',
    cover_image: '',
    category: 'news',
    tags: [],
    author: 'Kahn Team',
    is_published: false,
    is_featured: false,
    meta_title_zh: '',
    meta_title_en: '',
    meta_title_ru: '',
    meta_description_zh: '',
    meta_description_en: '',
    meta_description_ru: ''
};

const CATEGORIES = [
    { value: 'news', label: '公司新闻' },
    { value: 'industry', label: '行业资讯' },
    { value: 'guide', label: '使用指南' }
];

export default function AdminBlogEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [data, setData] = useState<ArticleData>(INITIAL_DATA);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'zh' | 'en' | 'ru'>('zh');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew && id) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success && result.data) {
                setData({
                    ...INITIAL_DATA,
                    ...result.data,
                    tags: result.data.tags || [],
                    is_published: !!result.data.is_published,
                    is_featured: !!result.data.is_featured
                });
            }
        } catch (err) {
            console.error('Failed to fetch article:', err);
            setError('加载文章失败');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (publish?: boolean) => {
        // 验证
        if (!data.slug) {
            setError('请填写 URL 标识符 (Slug)');
            return;
        }
        if (!data.title_zh && !data.title_en) {
            setError('请至少填写一种语言的标题');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('admin_token');
            const payload = {
                ...data,
                is_published: publish !== undefined ? publish : data.is_published
            };

            const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                navigate('/admin/blog');
            } else {
                setError(result.message || '保存失败');
            }
        } catch (err) {
            console.error('Failed to save article:', err);
            setError('保存失败，请重试');
        } finally {
            setIsSaving(false);
        }
    };

    const generateSlug = () => {
        const title = data.title_en || data.title_zh;
        if (title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
                .replace(/^-|-$/g, '');
            setData({ ...data, slug });
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#047857]"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/blog')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isNew ? '新建文章' : '编辑文章'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        保存草稿
                    </Button>
                    <Button
                        className="bg-[#047857] hover:bg-[#064E3B]"
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        发布
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">基本信息</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL 标识符 (Slug) *
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={data.slug}
                                    onChange={(e) => setData({ ...data, slug: e.target.value })}
                                    placeholder="article-url-slug"
                                />
                                <Button variant="outline" size="sm" onClick={generateSlug}>
                                    生成
                                </Button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">文章 URL: /blog/{data.slug || 'your-slug'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                            <select
                                value={data.category}
                                onChange={(e) => setData({ ...data, category: e.target.value })}
                                className="w-full border rounded-md px-3 py-2"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                            <Input
                                value={data.author}
                                onChange={(e) => setData({ ...data, author: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">封面图片 URL</label>
                            <Input
                                value={data.cover_image}
                                onChange={(e) => setData({ ...data, cover_image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">文章内容</h2>
                        <div className="flex border rounded-md overflow-hidden">
                            {(['zh', 'en', 'ru'] as const).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveTab(lang)}
                                    className={`px-4 py-1.5 text-sm font-medium ${activeTab === lang
                                            ? 'bg-[#047857] text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : 'Русский'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                标题 {activeTab === 'zh' && '*'}
                            </label>
                            <Input
                                value={data[`title_${activeTab}` as keyof ArticleData] as string}
                                onChange={(e) => setData({ ...data, [`title_${activeTab}`]: e.target.value })}
                                placeholder={`${activeTab === 'zh' ? '中文' : activeTab === 'en' ? '英文' : '俄文'}标题`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                            <Textarea
                                value={data[`excerpt_${activeTab}` as keyof ArticleData] as string}
                                onChange={(e) => setData({ ...data, [`excerpt_${activeTab}`]: e.target.value })}
                                rows={2}
                                placeholder="文章摘要..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                内容 (支持 HTML)
                            </label>
                            <Textarea
                                value={data[`content_${activeTab}` as keyof ArticleData] as string}
                                onChange={(e) => setData({ ...data, [`content_${activeTab}`]: e.target.value })}
                                rows={12}
                                placeholder="文章内容..."
                                className="font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">SEO 设置 ({activeTab === 'zh' ? '中文' : activeTab === 'en' ? '英文' : '俄文'})</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 标题</label>
                            <Input
                                value={data[`meta_title_${activeTab}` as keyof ArticleData] as string}
                                onChange={(e) => setData({ ...data, [`meta_title_${activeTab}`]: e.target.value })}
                                placeholder="留空则使用文章标题"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 描述</label>
                            <Textarea
                                value={data[`meta_description_${activeTab}` as keyof ArticleData] as string}
                                onChange={(e) => setData({ ...data, [`meta_description_${activeTab}`]: e.target.value })}
                                rows={2}
                                placeholder="留空则使用文章摘要"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
