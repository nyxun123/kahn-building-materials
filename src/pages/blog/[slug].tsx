/**
 * 博客文章详情页
 */
import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Eye, Tag, Share2, User } from 'lucide-react';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';

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

const SITE_NAME = 'Hangzhou Karn New Building Materials Co., Ltd';
const SITE_LOGO = '/images/logo.png';

const slugifyHeading = (value: string) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

const estimateWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    const cjkCount = trimmed.match(/[\u4E00-\u9FFF]/g)?.length || 0;
    const latinText = trimmed.replace(/[\u4E00-\u9FFF]/g, ' ').trim();
    const wordCount = latinText ? latinText.split(/\s+/).length : 0;
    return cjkCount + wordCount;
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

    const summaryLabel = t('blog:summary', 'Summary');
    const tocLabel = t('blog:toc', 'Contents');

    const { contentHtml, tocItems, wordCount } = useMemo(() => {
        if (!article?.content) {
            return { contentHtml: '', tocItems: [], wordCount: 0 };
        }
        if (typeof DOMParser === 'undefined') {
            return { contentHtml: article.content, tocItems: [], wordCount: 0 };
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(article.content, 'text/html');
        const headings = Array.from(doc.querySelectorAll('h2, h3'));
        const usedIds = new Map<string, number>();

        const toc = headings.map((heading, index) => {
            const text = heading.textContent?.trim() || '';
            const baseId = slugifyHeading(text) || `section-${index + 1}`;
            const count = usedIds.get(baseId) || 0;
            const id = count ? `${baseId}-${count + 1}` : baseId;
            usedIds.set(baseId, count + 1);
            heading.id = id;
            return {
                id,
                text,
                level: heading.tagName === 'H2' ? 2 : 3,
            };
        });

        const textContent = doc.body.textContent || '';
        const words = estimateWordCount(textContent);

        return {
            contentHtml: doc.body.innerHTML,
            tocItems: toc,
            wordCount: words,
        };
    }, [article?.content]);

    const showToc = tocItems.length >= 2;

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
                    type: 'BlogPosting',
                    headline: article.title,
                    description: article.excerpt,
                    url: `https://kn-wallpaperglue.com${location.pathname}`,
                    image: article.coverImage,
                    datePublished: article.publishedAt,
                    dateModified: article.updatedAt || article.publishedAt,
                    author: { name: article.author || SITE_NAME },
                    publisher: { name: SITE_NAME, logo: SITE_LOGO },
                    inLanguage: currentLang,
                    keywords: article.tags?.join(', '),
                    articleSection: getCategoryLabel(article.category),
                    wordCount,
                }}
            />
            <StructuredData
                schema={{
                    type: 'BreadcrumbList',
                    itemListElement: [
                        {
                            '@type': 'ListItem',
                            position: 1,
                            name: t('nav.home'),
                            item: `/${currentLang}`,
                        },
                        {
                            '@type': 'ListItem',
                            position: 2,
                            name: t('nav.blog', 'Blog'),
                            item: `/${currentLang}/blog`,
                        },
                        {
                            '@type': 'ListItem',
                            position: 3,
                            name: article.title,
                            item: `https://kn-wallpaperglue.com${location.pathname}`,
                        },
                    ],
                }}
            />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
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

            <article className="pt-0 pb-10 md:pt-2 md:pb-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Article Header */}
                    <header className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/60 p-6 md:p-8 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                            <span className="inline-flex items-center px-3 py-1 bg-[#047857]/10 text-[#047857] rounded-full">
                                <Tag className="w-3 h-3 mr-1" />
                                {getCategoryLabel(article.category)}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <time dateTime={article.publishedAt}>
                                    {formatDate(article.publishedAt)}
                                </time>
                            </span>
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-[#047857]" />
                                {article.author}
                            </span>
                            <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {article.viewCount} {t('blog:views', 'views')}
                            </span>
                            <button
                                onClick={handleShare}
                                className="sm:ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-3 py-1 text-xs font-medium text-[#047857] transition-colors hover:bg-emerald-50"
                            >
                                <Share2 className="w-4 h-4" />
                                {t('blog:share', 'Share')}
                            </button>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            {article.title}
                        </h1>

                        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 md:p-5">
                            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
                                {summaryLabel}
                            </p>
                            <p className="mt-2 text-base md:text-lg text-emerald-900/90 leading-relaxed">
                                {article.excerpt}
                            </p>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {article.coverImage && (
                        <figure className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </figure>
                    )}

                    {/* Article Content */}
                    <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
                        <div className="min-w-0">
                            {showToc && (
                                <div className="lg:hidden mb-6">
                                    <details className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                        <summary className="cursor-pointer text-sm font-semibold text-gray-900">
                                            {tocLabel}
                                        </summary>
                                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                            {tocItems.map(item => (
                                                <li key={item.id} className={item.level === 3 ? 'pl-3 text-gray-500' : ''}>
                                                    <a href={`#${item.id}`} className="block leading-snug hover:text-[#047857]">
                                                        {item.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </div>
                            )}

                            <div
                                className="article-content prose"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        </div>

                        {showToc && (
                            <aside className="mt-10 lg:mt-0">
                                <div className="sticky top-24 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                                    <div className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase mb-3">
                                        {tocLabel}
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        {tocItems.map(item => (
                                            <li key={item.id} className={item.level === 3 ? 'pl-3 text-gray-500' : ''}>
                                                <a href={`#${item.id}`} className="block leading-snug hover:text-[#047857]">
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </aside>
                        )}
                    </div>

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
