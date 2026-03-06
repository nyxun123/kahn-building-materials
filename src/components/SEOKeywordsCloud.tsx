import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FALLBACK_KEYWORDS = [
    'Carboxymethyl Starch',
    'Wallpaper Adhesive',
    'CMS Manufacturer',
    'OEM Wallpaper Glue',
    'Textile Printing Thickener',
    'Construction Additive',
];

export function SEOKeywordsCloud() {
    const { i18n, t } = useTranslation('common');
    const [isExpanded, setIsExpanded] = useState(false);
    const [keywords, setKeywords] = useState<string[]>(FALLBACK_KEYWORDS);
    const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

    useEffect(() => {
        let cancelled = false;
        const normalizedLang = (i18n.language || 'en').split('-')[0].toLowerCase();
        // Keep Chinese version showing EN keywords to emphasize international positioning.
        const keywordLang = normalizedLang === 'zh' ? 'en' : normalizedLang;
        const supportedLangs = new Set(['en', 'ru', 'vi', 'th', 'id']);
        const lang = supportedLangs.has(keywordLang) ? keywordLang : 'en';

        fetch(`/data/seo-keywords/${lang}.json`)
            .then(response => response.ok ? response.json() : [])
            .then((data) => {
                if (cancelled) {
                    return;
                }
                if (Array.isArray(data) && data.length > 0) {
                    setKeywords(data);
                } else {
                    setKeywords(FALLBACK_KEYWORDS);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setKeywords(FALLBACK_KEYWORDS);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [i18n.language]);

    if (!keywords || keywords.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border-t border-gray-100 py-8 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {tr('seo.popular_tags', 'Popular Tags')}
                    </h3>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center text-xs text-gray-600 hover:text-green-700 transition-colors"
                    >
                        {isExpanded ? (
                            <>{tr('seo.show_less', 'Show Less')} <ChevronUp className="w-3 h-3 ml-1" /></>
                        ) : (
                            <>{tr('seo.show_more', 'Show More')} <ChevronDown className="w-3 h-3 ml-1" /></>
                        )}
                    </button>
                </div>

                <div className={`flex flex-wrap gap-x-3 gap-y-2 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-full opacity-100' : 'max-h-6 overflow-hidden opacity-60'}`}>
                    {keywords.map((keyword, index) => (
                        <Link
                            key={index}
                            to={`/${i18n.language}/products?search=${encodeURIComponent(keyword)}`}
                            className="text-xs text-gray-600 hover:text-green-700 transition-colors hover:underline whitespace-nowrap"
                        >
                            {keyword}
                        </Link>
                    ))}
                </div>

                {!isExpanded && (
                    <div className="text-xs text-gray-600 mt-2 italic">
                        + {keywords.length - 15} {tr('seo.more_keywords', 'more keywords...')}
                    </div>
                )}
            </div>
        </div>
    );
}
