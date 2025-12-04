import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    SEO_KEYWORDS_EN,
    SEO_KEYWORDS_ZH,
    SEO_KEYWORDS_RU,
    SEO_KEYWORDS_VI,
    SEO_KEYWORDS_TH,
    SEO_KEYWORDS_ID
} from '@/data/seo-keywords';

export function SEOKeywordsCloud() {
    const { i18n } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    // Select keywords based on current language
    let keywords = SEO_KEYWORDS_EN;

    switch (i18n.language) {
        case 'ru':
            keywords = SEO_KEYWORDS_RU;
            break;
        case 'vi':
            keywords = SEO_KEYWORDS_VI;
            break;
        case 'th':
            keywords = SEO_KEYWORDS_TH;
            break;
        case 'id':
            keywords = SEO_KEYWORDS_ID;
            break;
        case 'zh':
            // Show English keywords for Chinese users to emphasize international nature
            keywords = SEO_KEYWORDS_EN;
            break;
        default:
            keywords = SEO_KEYWORDS_EN;
    }

    // Fallback
    if (!keywords || keywords.length === 0) {
        keywords = SEO_KEYWORDS_EN;
    }

    return (
        <div className="bg-white border-t border-gray-100 py-8 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Popular Tags
                    </h3>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center text-xs text-gray-400 hover:text-green-600 transition-colors"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
                        ) : (
                            <>Show More <ChevronDown className="w-3 h-3 ml-1" /></>
                        )}
                    </button>
                </div>

                <div className={`flex flex-wrap gap-x-3 gap-y-2 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-full opacity-100' : 'max-h-6 overflow-hidden opacity-60'}`}>
                    {keywords.map((keyword, index) => (
                        <Link
                            key={index}
                            to={`/${i18n.language}/products?search=${encodeURIComponent(keyword)}`}
                            className="text-[10px] text-gray-300 hover:text-green-600 transition-colors hover:underline whitespace-nowrap"
                        >
                            {keyword}
                        </Link>
                    ))}
                </div>

                {!isExpanded && (
                    <div className="text-[10px] text-gray-300 mt-2 italic">
                        + {keywords.length - 15} more keywords...
                    </div>
                )}
            </div>
        </div>
    );
}
