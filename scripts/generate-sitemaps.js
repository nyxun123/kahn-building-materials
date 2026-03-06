/**
 * Generate sitemap set for multilingual routes.
 * Includes core pages, product pages, solution detail pages, and blog pages.
 */
import fs from 'fs';
import path from 'path';
import { STATIC_BLOG_ARTICLES } from '../functions/lib/blog-static-data.js';

const siteUrl = 'https://kn-wallpaperglue.com';
const publicDir = path.join(process.cwd(), 'public');
const nowIso = new Date().toISOString();
const nowDate = nowIso.split('T')[0];

const languages = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
const blogLanguages = ['zh', 'en', 'ru'];
const faqLanguages = ['zh', 'en', 'ru'];
const corePaths = ['', 'products', 'applications', 'oem', 'about', 'contact', 'solutions', 'privacy', 'terms'];
const productSlugs = [
  'wallpaper-adhesive',
  'construction-cms',
  'textile-cms',
  'coating-cms',
  'paper-dyeing-cms',
  'desiccant-gel',
  'oem-service',
];

const priorityByPath = {
  '': '1.0',
  products: '0.9',
  applications: '0.8',
  oem: '0.8',
  solutions: '0.8',
  blog: '0.8',
  about: '0.7',
  contact: '0.7',
};

function toUrl(lang, slug = '') {
  const normalized = slug ? `/${slug.replace(/^\//, '')}` : '';
  return `${siteUrl}/${lang}${normalized}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderUrlSet(items) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items.map(
      (item) =>
        `  <url><loc>${escapeXml(item.loc)}</loc><lastmod>${item.lastmod || nowIso}</lastmod><changefreq>${item.changefreq || 'monthly'}</changefreq><priority>${item.priority || '0.8'}</priority></url>`
    ),
    '</urlset>',
  ].join('\n');
}

function readSolutionSlugsByLang() {
  const sourcePath = path.join(process.cwd(), 'src', 'data', 'solution-pages.ts');
  if (!fs.existsSync(sourcePath)) return new Map();
  const text = fs.readFileSync(sourcePath, 'utf8');
  const result = new Map();

  // Matches blocks like: slug: '...', lang: 'zh'
  const re = /slug:\s*'([^']+)'\s*,\s*lang:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text))) {
    const slug = m[1].trim();
    const lang = m[2].trim();
    if (!languages.includes(lang)) continue;
    const list = result.get(lang) || [];
    list.push(slug);
    result.set(lang, list);
  }

  for (const [lang, slugs] of result.entries()) {
    result.set(lang, [...new Set(slugs)]);
  }
  return result;
}

function blogEntriesByLang() {
  const slugs = [...new Set((STATIC_BLOG_ARTICLES || []).map((a) => a.slug).filter(Boolean))];
  const articleLastmod = new Map();
  for (const article of STATIC_BLOG_ARTICLES || []) {
    const lastmod = article.updated_at || article.published_at || nowIso;
    articleLastmod.set(article.slug, lastmod);
  }
  return {
    slugs,
    articleLastmod,
  };
}

function writeFile(name, content) {
  fs.writeFileSync(path.join(publicDir, name), content, 'utf8');
}

const solutionsByLang = readSolutionSlugsByLang();
const { slugs: blogSlugs, articleLastmod } = blogEntriesByLang();

const generatedLangSitemaps = [];

for (const lang of languages) {
  const urls = [];
  for (const corePath of corePaths) {
    urls.push({
      loc: toUrl(lang, corePath),
      lastmod: nowIso,
      changefreq: corePath === '' ? 'weekly' : 'monthly',
      priority: priorityByPath[corePath] || '0.8',
    });
  }

  if (faqLanguages.includes(lang)) {
    urls.push({
      loc: toUrl(lang, 'faq'),
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: '0.75',
    });
  }

  if (blogLanguages.includes(lang)) {
    urls.push({
      loc: toUrl(lang, 'blog'),
      lastmod: nowIso,
      changefreq: 'weekly',
      priority: priorityByPath.blog || '0.8',
    });
  }

  for (const productSlug of productSlugs) {
    urls.push({
      loc: toUrl(lang, `products/${productSlug}`),
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  const solutionSlugs = solutionsByLang.get(lang) || [];
  for (const slug of solutionSlugs) {
    urls.push({
      loc: toUrl(lang, `solutions/${slug}`),
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: '0.75',
    });
  }

  if (blogLanguages.includes(lang)) {
    for (const slug of blogSlugs) {
      urls.push({
        loc: toUrl(lang, `blog/${slug}`),
        lastmod: articleLastmod.get(slug) || nowIso,
        changefreq: 'monthly',
        priority: '0.7',
      });
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const item of urls) {
    if (seen.has(item.loc)) continue;
    seen.add(item.loc);
    deduped.push(item);
  }

  const fileName = `sitemap-${lang}.xml`;
  writeFile(fileName, renderUrlSet(deduped));
  generatedLangSitemaps.push(fileName);
}

const productItems = [];
for (const lang of languages) {
  for (const productSlug of productSlugs) {
    productItems.push({
      loc: toUrl(lang, `products/${productSlug}`),
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }
}
writeFile('sitemap-products.xml', renderUrlSet(productItems));

const blogItems = [];
for (const lang of blogLanguages) {
  blogItems.push({
    loc: toUrl(lang, 'blog'),
    lastmod: nowIso,
    changefreq: 'weekly',
    priority: '0.8',
  });
  for (const slug of blogSlugs) {
    blogItems.push({
      loc: toUrl(lang, `blog/${slug}`),
      lastmod: articleLastmod.get(slug) || nowIso,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }
}
writeFile('sitemap-blog.xml', renderUrlSet(blogItems));

const rootItems = languages.map((lang) => ({
  loc: `${siteUrl}/${lang}`,
  lastmod: nowIso,
  changefreq: 'weekly',
  priority: lang === 'zh' || lang === 'en' || lang === 'ru' ? '1.0' : '0.8',
}));
writeFile('sitemap.xml', renderUrlSet(rootItems));

const mobileItems = [];
for (const lang of languages) {
  const mobilePaths = ['', 'products', 'applications', 'oem', 'about', 'contact', 'privacy', 'terms'];
  if (faqLanguages.includes(lang)) {
    mobilePaths.push('faq');
  }
  if (blogLanguages.includes(lang)) {
    mobilePaths.push('blog');
  }

  for (const pathSegment of mobilePaths) {
    mobileItems.push({
      loc: toUrl(lang, pathSegment),
      lastmod: nowDate,
      changefreq: pathSegment === '' ? 'daily' : 'weekly',
      priority: pathSegment === '' ? '1.0' : pathSegment === 'products' ? '0.9' : '0.8',
    });
  }
}

const mobileXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">',
  ...mobileItems.map(
    (item) =>
      `  <url><loc>${escapeXml(item.loc)}</loc><mobile:mobile/><lastmod>${item.lastmod}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`
  ),
  '</urlset>',
].join('\n');
writeFile('sitemap-mobile.xml', mobileXml);

const indexItems = [
  ...generatedLangSitemaps.map((name) => `${siteUrl}/${name}`),
  `${siteUrl}/sitemap-products.xml`,
  `${siteUrl}/sitemap-blog.xml`,
  `${siteUrl}/sitemap-mobile.xml`,
];
const sitemapIndexXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexItems.map((loc) => `  <sitemap><loc>${loc}</loc><lastmod>${nowIso}</lastmod></sitemap>`),
  '</sitemapindex>',
].join('\n');
writeFile('sitemap-index.xml', sitemapIndexXml);

console.log(`Generated sitemaps at ${nowIso}`);
