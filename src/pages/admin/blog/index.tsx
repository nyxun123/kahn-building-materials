/**
 * 后台博客管理页面
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlogArticle {
    id: number;
    slug: string;
    title_zh: string;
    title_en: string;
    title_ru: string;
    category: string;
    is_published: number;
    is_featured: number;
    view_count: number;
    published_at: string;
    created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    news: '公司新闻',
    industry: '行业资讯',
    guide: '使用指南'
};

export default function AdminBlogPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

    useEffect(() => {
        fetchArticles();
    }, [statusFilter]);

    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            let url = '/api/admin/blog';
            if (statusFilter !== 'all') {
                url += `?status=${statusFilter}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setArticles(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
            return;
        }

        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`/api/admin/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchArticles();
            }
        } catch (error) {
            console.error('Failed to delete article:', error);
        }
    };

    const handleTogglePublish = async (article: BlogArticle) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`/api/admin/blog/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_published: article.is_published ? 0 : 1
                })
            });

            if (response.ok) {
                fetchArticles();
            }
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const filteredArticles = articles.filter(article => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            article.title_zh?.toLowerCase().includes(term) ||
            article.title_en?.toLowerCase().includes(term) ||
            article.slug?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">博客管理</h1>
                <Button onClick={() => navigate('/admin/blog/new')} className="bg-[#047857] hover:bg-[#064E3B]">
                    <Plus className="w-4 h-4 mr-2" />
                    新建文章
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="搜索标题或 slug..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                        >
                            全部
                        </Button>
                        <Button
                            variant={statusFilter === 'published' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('published')}
                        >
                            已发布
                        </Button>
                        <Button
                            variant={statusFilter === 'draft' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('draft')}
                        >
                            草稿
                        </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchArticles}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#047857]"></div>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">暂无文章</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">标题</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">分类</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">状态</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">浏览量</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">创建时间</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredArticles.map(article => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 line-clamp-1">
                                                {article.title_zh || article.title_en || article.slug}
                                            </div>
                                            <div className="text-xs text-gray-400">/{article.slug}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                            {CATEGORY_LABELS[article.category] || article.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        {article.is_published ? (
                                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                                已发布
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                                草稿
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                                        {article.view_count || 0}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                                        {formatDate(article.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/admin/blog/${article.id}`)}
                                                title="编辑"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleTogglePublish(article)}
                                                title={article.is_published ? '取消发布' : '发布'}
                                            >
                                                {article.is_published ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(article.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                title="删除"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
