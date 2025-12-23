/**
 * 生成多语言站点地图：主页/核心页/产品页，输出到 public 目录。
 */
import fs from 'fs';
import path from 'path';

const siteUrl = 'https://kn-wallpaperglue.com';
const publicDir = path.join(process.cwd(), 'public');
const now = new Date().toISOString();

const languages = ['zh', 'en', 'ru', 'vi', 'th', 'id'];

const basePaths = [
  '', // home
  'products',
  'applications',
  'oem',
  'about',
  'contact',
  'solutions',
];

const productSlugs = [
  'wallpaper-adhesive',
  'construction-cms',
  'textile-cms',
  'coating-cms',
  'paper-dyeing-cms',
  'desiccant-gel',
  'oem-service',
];

const buildUrl = (lang, slug) => {
  const cleaned = slug ? `/${slug.replace(/^\//, '')}` : '';
  return `${siteUrl}/${lang}${cleaned}`;
};

const renderUrlSet = (urls) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(loc => `  <url><loc>${loc}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
  '</urlset>',
].join('\n');

// 生成每个语言的 sitemap
const langSitemaps = languages.map((lang) => {
  const urls = [
    ...basePaths.map(slug => buildUrl(lang, slug)),
    ...productSlugs.map(slug => buildUrl(lang, `products/${slug}`)),
  ];
  const xml = renderUrlSet(urls);
  const filename = `sitemap-${lang}.xml`;
  fs.writeFileSync(path.join(publicDir, filename), xml, 'utf8');
  return filename;
});

// 产品站点地图（包含全部语言产品 URL）
const productUrls = languages.flatMap(lang =>
  productSlugs.map(slug => buildUrl(lang, `products/${slug}`))
);
const productsXml = renderUrlSet(productUrls);
fs.writeFileSync(path.join(publicDir, 'sitemap-products.xml'), productsXml, 'utf8');

// 总 sitemap（汇总主页与核心页，无语言前缀），用于兼容历史引用
const rootUrls = [
  `${siteUrl}/zh`,
  `${siteUrl}/en`,
  `${siteUrl}/ru`,
  `${siteUrl}/vi`,
  `${siteUrl}/th`,
  `${siteUrl}/id`,
];
const rootXml = renderUrlSet(rootUrls);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), rootXml, 'utf8');

// sitemap 索引
const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...langSitemaps.map(name => `  <sitemap><loc>${siteUrl}/${name}</loc><lastmod>${now}</lastmod></sitemap>`),
  `  <sitemap><loc>${siteUrl}/sitemap-products.xml</loc><lastmod>${now}</lastmod></sitemap>`,
  '</sitemapindex>',
].join('\n');
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex, 'utf8');

console.log('Sitemaps generated at', now);
