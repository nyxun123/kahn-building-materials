import { Helmet } from 'react-helmet-async';

interface OpenGraphProps {
    /**
     * Page title
     */
    title: string;
    /**
     * Page description
     */
    description: string;
    /**
     * Page URL (absolute)
     */
    url: string;
    /**
     * Image URL (absolute)
     */
    image?: string;
    /**
     * Page type: website, article, product, etc.
     */
    type?: 'website' | 'article' | 'product';
    /**
     * Current language
     */
    locale?: string;
    /**
     * Alternate languages
     */
    alternateLocales?: string[];
    /**
     * Site name
     */
    siteName?: string;
    /**
     * For product type: price
     */
    price?: string;
    /**
     * For product type: currency
     */
    currency?: string;
    /**
     * For product type: availability
     */
    availability?: 'in stock' | 'out of stock' | 'preorder';
    /**
     * Twitter card type
     */
    twitterCard?: 'summary' | 'summary_large_image';
    /**
     * Twitter username
     */
    twitterSite?: string;
}

/**
 * Enhanced Open Graph and Twitter Card Meta Tags
 * 
 * Usage:
 * <OpenGraphTags
 *   title="Page Title"
 *   description="Page description"
 *   url="https://example.com/page"
 *   image="https://example.com/image.jpg"
 *   type="website"
 *   locale="zh_CN"
 *   alternateLocales={['en_US', 'ru_RU']}
 * />
 */
export function OpenGraphTags({
    title,
    description,
    url,
    image,
    type = 'website',
    locale = 'zh_CN',
    alternateLocales = [],
    siteName = '杭州卡恩新型建材有限公司',
    price,
    currency,
    availability,
    twitterCard = 'summary_large_image',
    twitterSite = '@kahnmaterials',
}: OpenGraphProps) {
    // Default image if not provided
    const ogImage = image || 'https://kn-wallpaperglue.com/images/og-default.jpg';

    return (
        <Helmet>
            {/* Essential Open Graph tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content={siteName} />

            {/* Locale tags for multi-language */}
            <meta property="og:locale" content={locale} />
            {alternateLocales.map(altLocale => (
                <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
            ))}

            {/* Product-specific tags */}
            {type === 'product' && price && (
                <>
                    <meta property="product:price:amount" content={price} />
                    {currency && <meta property="product:price:currency" content={currency} />}
                    {availability && <meta property="product:availability" content={availability} />}
                </>
            )}

            {/* Twitter Card tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content={twitterSite} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={title} />
        </Helmet>
    );
}
