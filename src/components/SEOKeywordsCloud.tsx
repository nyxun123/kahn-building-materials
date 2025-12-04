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

    // Randomly select 50 keywords to display to avoid overwhelming the UI, 
    // but render them in a way that search engines can see.
    // Ideally, we might want to rotate them or show them all in a collapsed section.
    // For now, let's show a categorized view or a simple cloud.

    return (
        <div className="bg-muted/30 py-8 mt-12 border-t">
            <div className="container mx-auto px-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                        <Link
                            key={index}
                            to={`/${i18n.language}/products?search=${encodeURIComponent(keyword)}`}
                            className="text-xs text-muted-foreground/70 hover:text-primary transition-colors hover:underline"
                        >
                            {keyword}
                        </Link>
                    ))}
                </div>
                <div className="mt-6 text-xs text-muted-foreground/50">
                    <p>
                        Hangzhou Karn New Building Materials Co., Ltd. specializes in high-quality Carboxymethyl Starch (CMS) for construction, textile, paper, and oil drilling industries.
                    </p>
                </div>
            </div>
        </div>
    );
}
