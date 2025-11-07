import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  lang?: 'zh' | 'en' | 'ru';
  noindex?: boolean;
}

const SITE_NAME = 'Hangzhou Karn New Building Materials Co., Ltd';
const SITE_URL = 'https://kn-wallpaperglue.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/IMG_1412.JPG`;

export function SEOHelmet({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  type = 'website',
  lang = 'en',
  noindex = false,
}: SEOHelmetProps) {
  const location = useLocation();
  
  // 构建完整URL
  const currentUrl = `${SITE_URL}${location.pathname}`;
  
  // 生成多语言URL
  const getAlternateUrl = (targetLang: string) => {
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const supportedLanguages = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
    
    // 如果第一个部分是语言代码，替换它
    if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
      pathParts[0] = targetLang;
    } else {
      pathParts.unshift(targetLang);
    }
    
    return `${SITE_URL}/${pathParts.join('/')}`;
  };
  
  const zhUrl = getAlternateUrl('zh');
  const enUrl = getAlternateUrl('en');
  const ruUrl = getAlternateUrl('ru');
  
  // 完整标题
  const fullTitle = `${title} - ${SITE_NAME}`;
  
  return (
    <Helmet>
      {/* 基础Meta标签 */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />
      
      {/* 多语言Hreflang标签 */}
      <link rel="alternate" hrefLang="zh" href={zhUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ru" href={ruUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === 'zh' ? 'zh_CN' : lang === 'ru' ? 'ru_RU' : 'en_US'} />
      <meta property="og:locale:alternate" content="zh_CN" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 地理位置信息 */}
      <meta name="geo.region" content="CN-ZJ" />
      <meta name="geo.placename" content="Hangzhou" />
      <meta name="geo.position" content="30.2741;120.1551" />
      <meta name="ICBM" content="30.2741, 120.1551" />
      
      {/* 额外的SEO标签 */}
      <meta name="author" content={SITE_NAME} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_NAME}`} />
      <meta name="language" content={lang} />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}




