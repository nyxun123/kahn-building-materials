import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['zh', 'en', 'ru', 'vi', 'th', 'id'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  logo?: string;
  type?: 'website' | 'article' | 'product';
  lang?: SupportedLanguage;
  noindex?: boolean;
  supportedLangs?: SupportedLanguage[];
}

const SITE_NAME = 'Hangzhou Karn New Building Materials Co., Ltd';
const SITE_URL = 'https://kn-wallpaperglue.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/IMG_1412.JPG`;
const DEFAULT_LOGO = `${SITE_URL}/images/logo.png`; // Logo for search results

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  ru: 'ru_RU',
  vi: 'vi_VN',
  th: 'th_TH',
  id: 'id_ID',
};

// 将相对路径转换为绝对 URL
const toAbsoluteUrl = (url: string): string => {
  if (!url) return url;
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // 如果是相对路径，添加 SITE_URL
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export function SEOHelmet({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  logo = DEFAULT_LOGO,
  type = 'website',
  lang = 'en',
  noindex = false,
  supportedLangs,
}: SEOHelmetProps) {
  const location = useLocation();

  // 转换图片和 logo 路径为绝对 URL
  const absoluteImage = toAbsoluteUrl(image);
  const absoluteLogo = toAbsoluteUrl(logo);
  const languagePool = supportedLangs?.length
    ? supportedLangs.filter((code): code is SupportedLanguage => SUPPORTED_LANGUAGES.includes(code))
    : SUPPORTED_LANGUAGES;
  const activeLanguages = languagePool.length ? languagePool : SUPPORTED_LANGUAGES;
  const normalizedLang: SupportedLanguage = activeLanguages.includes(lang)
    ? lang
    : activeLanguages[0];

  // 构建完整URL
  const currentUrl = `${SITE_URL}${location.pathname}`;

  // 生成多语言URL
  const getAlternateUrl = (targetLang: SupportedLanguage) => {
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const newParts = [...pathParts];
    if (newParts.length > 0 && SUPPORTED_LANGUAGES.includes(newParts[0] as SupportedLanguage)) {
      newParts[0] = targetLang;
    } else {
      newParts.unshift(targetLang);
    }

    return `${SITE_URL}/${newParts.join('/')}`.replace(/\/+$/, '');
  };

  const alternateLinks = activeLanguages.map(languageCode => ({
    lang: languageCode,
    url: getAlternateUrl(languageCode),
  }));

  const xDefaultUrl = alternateLinks.find(link => link.lang === 'en')?.url || alternateLinks[0]?.url || currentUrl;
  const currentLocale = LOCALE_MAP[normalizedLang];
  const alternateLocales = activeLanguages
    .filter(code => code !== normalizedLang)
    .map(code => LOCALE_MAP[code]);

  // 完整标题
  const fullTitle = `${title} - ${SITE_NAME}`;

  return (
    <Helmet>
      {/* 基础Meta标签 */}
      <html lang={normalizedLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />

      {/* 多语言Hreflang标签 */}
      {alternateLinks.map(({ lang: langCode, url }) => (
        <link key={langCode} rel="alternate" hrefLang={langCode} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={`${SITE_NAME} Logo`} />
      <meta property="og:logo" content={absoluteLogo} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={currentLocale} />
      {alternateLocales.map(locale => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} Logo`} />

      {/* Favicons with Absolute URLs for Search Engines */}
      <link rel="icon" href={`${SITE_URL}/favicon-v8.ico`} sizes="any" />
      <link rel="apple-touch-icon" href={`${SITE_URL}/apple-touch-icon-v8.png`} />

      {/* Logo for Search Engines */}
      <link rel="logo" href={absoluteLogo} />
      <meta itemProp="logo" content={absoluteLogo} />
      {/* Additional logo meta tags for better recognition */}
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:type" content="image/png" />

      {/* 地理位置信息 */}
      <meta name="geo.region" content="CN-ZJ" />
      <meta name="geo.placename" content="Hangzhou" />
      <meta name="geo.position" content="30.2741;120.1551" />
      <meta name="ICBM" content="30.2741, 120.1551" />

      {/* 额外的SEO标签 */}
      <meta name="author" content={SITE_NAME} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_NAME}`} />
      <meta name="language" content={normalizedLang} />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}



