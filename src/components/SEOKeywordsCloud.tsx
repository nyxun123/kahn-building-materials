import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

    // Select keywords based on current language
    // For Chinese ('zh'), we default to English as per user request to focus on foreign markets,
    // or we could show Chinese if they change their mind. Given "Chinese optimization is unnecessary",
    // we will show English keywords for Chinese users to emphasize international nature.
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
            // User explicitly said Chinese optimization is not needed, so we show English
            // to maintain the "foreign trade" feel even on the Chinese page.
            keywords = SEO_KEYWORDS_EN;
            break;
        default:
            keywords = SEO_KEYWORDS_EN;
    }

    // Fallback to English if something goes wrong or for default
    if (!keywords || keywords.length === 0) {
        console.warn('SEOKeywordsCloud: No keywords found for language ' + i18n.language + ', falling back to EN');
        keywords = SEO_KEYWORDS_EN;
    }

    console.log('SEOKeywordsCloud rendering for language:', i18n.language, 'Keyword count:', keywords.length);

    return (
        <div id="seo-keywords-cloud" className="bg-gray-100 py-10 mt-0 border-t border-b border-gray-300">
            <div className="container mx-auto px-4">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center">
                    <span className="w-1 h-4 bg-green-600 mr-2 rounded-full"></span>
                    Popular Searches ({i18n.language.toUpperCase()})
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
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
                <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <p>
                        Hangzhou Karn New Building Materials Co., Ltd. specializes in high-quality Carboxymethyl Starch (CMS) for construction, textile, paper, and oil drilling industries.
                    </p>
                </div>
            </div>
        </div>
    );
}
