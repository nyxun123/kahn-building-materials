/**
 * 博客列表页
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, Eye, Tag, Newspaper } from 'lucide-react';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';

interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: string;
    viewCount: number;
    publishedAt: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    news: { zh: '公司新闻', en: 'Company News', ru: 'Новости компании' },
    industry: { zh: '行业资讯', en: 'Industry News', ru: 'Новости отрасли' },
    guide: { zh: '使用指南', en: 'User Guide', ru: 'Руководство' }
};

export default function BlogPage() {
    const { t, i18n } = useTranslation(['common', 'blog']);
    const location = useLocation();
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const currentLang = i18n.language || 'en';

    useEffect(() => {
        fetchArticles();
    }, [selectedCategory, currentLang]);

    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            let url = `/api/blog?lang=${currentLang}`;
            if (selectedCategory) {
                url += `&category=${selectedCategory}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setArticles(data.data || []);
                setPagination(data.pagination || null);
            }
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : currentLang === 'ru' ? 'ru-RU' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryLabel = (category: string) => {
        return CATEGORY_LABELS[category]?.[currentLang] || category;
    };

    return (
        <>
            <SEOHelmet
                title={t('blog:title', 'Blog & News')}
                description={t('blog:meta_description', 'Latest news, industry insights, and product guides from Kahn Building Materials')}
                keywords="blog, news, industry, CMS, carboxymethyl starch, wallpaper adhesive"
                type="website"
                lang={currentLang as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
            />
            <StructuredData
                schema={{
                    type: 'WebPage',
                    name: t('blog:title', 'Blog & News'),
                    description: t('blog:meta_description'),
                    url: `https://kn-wallpaperglue.com${location.pathname}`,
                    inLanguage: currentLang,
                }}
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#064E3B] to-[#047857] py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-sm mb-4">
                        <Newspaper className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium tracking-wider uppercase">
                            {t('blog:badge', 'News & Insights')}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t('blog:title', 'Blog & News')}
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        {t('blog:subtitle', 'Stay updated with the latest industry news, product guides, and company updates')}
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-6 bg-white border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory
                                    ? 'bg-[#047857] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t('blog:all_categories', 'All')}
                        </button>
                        {Object.keys(CATEGORY_LABELS).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-[#047857] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {getCategoryLabel(cat)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#047857]"></div>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-12">
                            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {t('blog:no_articles', 'No articles yet')}
                            </h3>
                            <p className="text-gray-500">
                                {t('blog:no_articles_description', 'Check back soon for new content')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map(article => (
                                <article
                                    key={article.id}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <Link to={`/${currentLang}/blog/${article.slug}`}>
                                        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                                            {article.coverImage ? (
                                                <img
                                                    src={article.coverImage}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Newspaper className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <span className="inline-flex items-center px-2 py-1 bg-[#047857]/10 text-[#047857] rounded">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {getCategoryLabel(article.category)}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(article.publishedAt)}
                                            </span>
                                        </div>
                                        <Link to={`/${currentLang}/blog/${article.slug}`}>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#047857] transition-colors">
                                                {article.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Eye className="w-3 h-3 mr-1" />
                                                {article.viewCount} {t('blog:views', 'views')}
                                            </span>
                                            <Link
                                                to={`/${currentLang}/blog/${article.slug}`}
                                                className="text-sm font-medium text-[#047857] hover:text-[#064E3B] flex items-center"
                                            >
                                                {t('cta.read_more', 'Read More')}
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-12 gap-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`w-10 h-10 rounded ${page === pagination.page
                                            ? 'bg-[#047857] text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-[#064E3B] to-[#047857]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {t('blog:cta_title', 'Have Questions About Our Products?')}
                    </h2>
                    <p className="text-white/90 max-w-2xl mx-auto mb-8">
                        {t('blog:cta_description', 'Our team is ready to help you find the right solution')}
                    </p>
                    <Button asChild size="lg" className="bg-white text-[#047857] hover:bg-green-50">
                        <Link to={`/${currentLang}/contact`}>
                            {t('cta.contact')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
