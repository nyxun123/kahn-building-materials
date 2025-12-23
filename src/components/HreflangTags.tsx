import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['zh', 'en', 'ru', 'th', 'vi', 'id'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    ru: 'ru-RU',
    th: 'th-TH',
    vi: 'vi-VN',
    id: 'id-ID',
};

interface HreflangTagsProps {
    /**
     * Current language
     */
    currentLanguage: SupportedLanguage;
    /**
     * Base URL without language prefix
     * e.g. "/products/wallpaper-glue"
     */
    basePath?: string;
}

/**
 * Hreflang Tags Component
 * Adds hreflang link tags for multi-language SEO
 * 
 * Usage:
 * <HreflangTags currentLanguage="zh" basePath="/products/wallpaper-glue" />
 * 
 * This will generate:
 * <link rel="alternate" hreflang="zh-CN" href="https://kn-wallpaperglue.com/zh/products/wallpaper-glue" />
 * <link rel="alternate" hreflang="en-US" href="https://kn-wallpaperglue.com/en/products/wallpaper-glue" />
 * etc.
 */
export function HreflangTags({
    currentLanguage,
    basePath
}: HreflangTagsProps) {
    const location = useLocation();
    const baseUrl = 'https://kn-wallpaperglue.com';

    // Use basePath if provided, otherwise derive from location
    const path = basePath || location.pathname.replace(/^\/(zh|en|ru|th|vi|id)/, '');

    return (
        <Helmet>
            {/* Default language (x-default) - use English for international audience */}
            <link
                rel="alternate"
                hrefLang="x-default"
                href={`${baseUrl}/en${path}`}
            />

            {/* Language-specific links */}
            {SUPPORTED_LANGUAGES.map(lang => {
                const hreflang = LANGUAGE_CODES[lang];
                const href = `${baseUrl}/${lang}${path}`;

                return (
                    <link
                        key={lang}
                        rel="alternate"
                        hrefLang={hreflang}
                        href={href}
                    />
                );
            })}

            {/* Canonical URL for current language */}
            <link
                rel="canonical"
                href={`${baseUrl}/${currentLanguage}${path}`}
            />
        </Helmet>
    );
}
