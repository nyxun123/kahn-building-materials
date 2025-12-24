/**
 * 博客文章详情页
 */
import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Eye, Tag, Share2, User } from 'lucide-react';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { KeywordHighlighter } from '@/components/KeywordHighlighter';

interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    author: string;
    viewCount: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    seo: {
        title: string;
        description: string;
    };
    translations: {
        zh: { title: string; available: boolean };
        en: { title: string; available: boolean };
        ru: { title: string; available: boolean };
    };
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    news: { zh: '公司新闻', en: 'Company News', ru: 'Новости компании' },
    industry: { zh: '行业资讯', en: 'Industry News', ru: 'Новости отрасли' },
    guide: { zh: '使用指南', en: 'User Guide', ru: 'Руководство' }
};

export default function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation(['common', 'blog']);
    const location = useLocation();
    const [article, setArticle] = useState<BlogArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentLang = i18n.language || 'en';

    useEffect(() => {
        if (slug) {
            fetchArticle();
        }
    }, [slug, currentLang]);

    const fetchArticle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/blog/${slug}?lang=${currentLang}`);
            const data = await response.json();
            if (data.success && data.data) {
                setArticle(data.data);
            } else {
                setError(data.message || 'Article not found');
            }
        } catch (err) {
            console.error('Failed to fetch article:', err);
            setError('Failed to load article');
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

    const handleShare = async () => {
        if (navigator.share && article) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href
                });
            } catch (err) {
                // 用户取消分享
            }
        } else {
            // 复制链接
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#047857]"></div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('blog:article_not_found', 'Article Not Found')}
                </h1>
                <p className="text-gray-600 mb-8">{error}</p>
                <Button asChild>
                    <Link to={`/${currentLang}/blog`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('blog:back_to_blog', 'Back to Blog')}
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <SEOHelmet
                title={article.seo.title || article.title}
                description={article.seo.description || article.excerpt}
                keywords={article.tags.join(', ')}
                type="article"
                lang={currentLang as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
                image={article.coverImage}
            />
            <StructuredData
                schema={{
                    type: 'WebPage',
                    name: article.title,
                    description: article.excerpt,
                    url: `https://kn-wallpaperglue.com${location.pathname}`,
                    inLanguage: currentLang,
                }}
            />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link to={`/${currentLang}`} className="hover:text-[#047857]">
                            {t('nav.home')}
                        </Link>
                        <span className="mx-2">/</span>
                        <Link to={`/${currentLang}/blog`} className="hover:text-[#047857]">
                            {t('nav.blog', 'Blog')}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
                    </nav>
                </div>
            </div>

            <article className="py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Article Header */}
                        <header className="mb-8">
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                <span className="inline-flex items-center px-3 py-1 bg-[#047857]/10 text-[#047857] rounded-full">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {getCategoryLabel(article.category)}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(article.publishedAt)}
                                </span>
                                <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {article.viewCount} {t('blog:views', 'views')}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {article.title}
                            </h1>

                            <p className="text-lg text-gray-600 mb-6">
                                {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-[#047857]/10 rounded-full flex items-center justify-center mr-3">
                                        <User className="w-5 h-5 text-[#047857]" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{article.author}</span>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center text-sm text-gray-500 hover:text-[#047857] transition-colors"
                                >
                                    <Share2 className="w-4 h-4 mr-1" />
                                    {t('blog:share', 'Share')}
                                </button>
                            </div>
                        </header>

                        {/* Cover Image */}
                        {article.coverImage && (
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <img
                                    src={article.coverImage}
                                    alt={article.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div
                            className="prose prose-base max-w-none
                                prose-headings:text-[#064E3B] prose-headings:font-semibold
                                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
                                prose-a:text-[#047857] prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900
                                prose-ul:my-4 prose-li:text-gray-700 prose-li:my-1
                                prose-img:rounded-lg prose-img:shadow-md
                                prose-table:text-sm prose-th:bg-[#064E3B] prose-th:text-white prose-th:p-3
                                prose-td:p-3 prose-td:border prose-td:border-gray-200
                                [&_.product-link]:text-[#047857] [&_.product-link]:font-medium
                                [&_.article-hero]:bg-gradient-to-r [&_.article-hero]:from-[#064E3B] [&_.article-hero]:to-[#047857]
                                [&_.article-hero]:text-white [&_.article-hero]:p-6 [&_.article-hero]:rounded-xl [&_.article-hero]:mb-8
                                [&_.article-hero_h2]:text-white [&_.article-hero_h2]:text-2xl [&_.article-hero_h2]:mb-2
                                [&_figcaption]:text-center [&_figcaption]:text-gray-500 [&_figcaption]:text-sm [&_figcaption]:mt-2"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">{t('blog:tags', 'Tags')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to Blog */}
                        <div className="mt-12">
                            <Button asChild variant="outline">
                                <Link to={`/${currentLang}/blog`}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('blog:back_to_blog', 'Back to Blog')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </article>

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
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
