import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { STATIC_BLOG_ARTICLES } from '../functions/lib/blog-static-data.js';

const siteUrl = 'https://kn-wallpaperglue.com';
const siteName = 'Hangzhou Karn New Building Materials Co., Ltd';
const languages = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
const blogLanguages = ['zh', 'en', 'ru'];
const faqLanguages = ['zh', 'en', 'ru'];
const localeMap = {
  zh: 'zh_CN',
  en: 'en_US',
  ru: 'ru_RU',
  vi: 'vi_VN',
  th: 'th_TH',
  id: 'id_ID',
};
const defaultImage = `${siteUrl}/images/IMG_1412.jpg`;
const defaultLogo = `${siteUrl}/images/logo.png`;
const brandMarkers = [siteName, 'Hangzhou Karn', '杭州卡恩', 'Ханчжоу Карн'];
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const distIndexPath = path.join(distDir, 'index.html');

const solutionHubMeta = {
  zh: {
    title: '市场落地页中心',
    description: '根据目标市场选择 OEM / CMS / 私标 / 培训页面，快速查看物流、证书、FAQ 与市场方案。',
  },
  en: {
    title: 'Market Landing Hub',
    description: 'Pick OEM, CMS bulk, private label, or training pages tailored for each market.',
  },
  ru: {
    title: 'Центр локальных страниц',
    description: 'Выберите OEM, bulk CMS, private label или обучение для нужного рынка.',
  },
  vi: {
    title: 'Trung tâm trang thị trường',
    description: 'Chọn trang OEM, CMS số lượng lớn, private label hoặc đào tạo theo thị trường.',
  },
  th: {
    title: 'ฮับหน้าตลาดเฉพาะ',
    description: 'เลือกหน้า OEM, CMS จำนวนมาก, private label หรือโปรแกรมอบรมตามตลาดเป้าหมาย.',
  },
  id: {
    title: 'Pusat Halaman Pasar',
    description: 'Pilih halaman OEM, CMS bulk, private label, atau training sesuai pasar target.',
  },
};

const faqMeta = {
  zh: {
    title: '常见问题解答',
    description: '查找关于羧甲基淀粉(CMS)产品、订购、技术等常见问题的答案。',
    keywords: 'CMS,羧甲基淀粉,常见问题,FAQ,技术支持,产品咨询',
  },
  en: {
    title: 'FAQ',
    description: 'Find answers about CMS products, orders, storage, technical support, and application guidance.',
    keywords: 'CMS FAQ, carboxymethyl starch FAQ, technical support, product questions',
  },
  ru: {
    title: 'FAQ',
    description: 'Ответы на частые вопросы о продукции CMS, заказах, хранении и технической поддержке.',
    keywords: 'FAQ по CMS, карбоксиметилкрахмал, техническая поддержка, вопросы по продукту',
  },
};

if (!fs.existsSync(distIndexPath)) {
  throw new Error('dist/index.html not found. Run the Vite build before generating SEO snapshots.');
}

const baseHtml = fs.readFileSync(distIndexPath, 'utf8');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function getValue(object, pathValue, fallback = '') {
  return pathValue.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), object) ?? fallback;
}

function toAbsoluteUrl(url) {
  if (!url) return defaultImage;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createFullTitle(title) {
  return brandMarkers.some(marker => title.includes(marker))
    ? title
    : `${title} - ${siteName}`;
}

function extractLiteral(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Unable to find marker: ${marker}`);
  }

  const assignIndex = source.indexOf('=', markerIndex);
  if (assignIndex === -1) {
    throw new Error(`Unable to find assignment for marker: ${marker}`);
  }

  const startIndex = source.slice(assignIndex + 1).search(/[{\[]/);
  if (startIndex === -1) {
    throw new Error(`Unable to find literal start for marker: ${marker}`);
  }

  const absoluteStart = assignIndex + 1 + startIndex;
  const openingChar = source[absoluteStart];
  const closingChar = openingChar === '{' ? '}' : ']';
  const stack = [openingChar];
  let quote = null;
  let isEscaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = absoluteStart + 1; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }
      if (char === '\\') {
        isEscaped = true;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{' || char === '[') {
      stack.push(char);
      continue;
    }

    if (char === '}' || char === ']') {
      const last = stack.pop();
      const expected = last === '{' ? '}' : ']';
      if (char !== expected) {
        throw new Error(`Mismatched literal near marker: ${marker}`);
      }
      if (!stack.length) {
        return source.slice(absoluteStart, index + 1);
      }
      continue;
    }

    if (char === closingChar && stack.length === 1) {
      return source.slice(absoluteStart, index + 1);
    }
  }

  throw new Error(`Unable to extract literal for marker: ${marker}`);
}

function evaluateLiteral(literal) {
  return vm.runInNewContext(`(${literal})`, {});
}

function buildAlternateUrls(routePath, supportedLangs) {
  const [pathname, search = ''] = routePath.split('?');
  const parts = pathname.split('/').filter(Boolean);
  const alternates = supportedLangs.map((lang) => {
    const newParts = [...parts];
    if (newParts.length > 0 && languages.includes(newParts[0])) {
      newParts[0] = lang;
    } else {
      newParts.unshift(lang);
    }
    return {
      lang,
      url: `${siteUrl}/${newParts.join('/')}/${search ? `?${search}` : ''}`,
    };
  });

  return alternates;
}

function renderSeoBlock(snapshot) {
  // Ensure trailing slash for Cloudflare Pages directory-based serving
  const routeWithSlash = snapshot.route.endsWith('/') ? snapshot.route : `${snapshot.route}/`;
  const currentUrl = `${siteUrl}${routeWithSlash}`;
  const fullTitle = createFullTitle(snapshot.title);
  const absoluteImage = toAbsoluteUrl(snapshot.image);
  const activeLangs = snapshot.supportedLangs?.length ? snapshot.supportedLangs : languages;
  const alternateLinks = buildAlternateUrls(snapshot.route, activeLangs);
  const xDefaultUrl = alternateLinks.find((item) => item.lang === 'en')?.url || alternateLinks[0]?.url || currentUrl;
  const alternateLocales = activeLangs
    .filter((lang) => lang !== snapshot.lang)
    .map((lang) => localeMap[lang])
    .filter(Boolean);

  return [
    '  <!-- Route-specific SEO snapshot -->',
    `  <title data-rh="true">${escapeHtml(fullTitle)}</title>`,
    `  <meta data-rh="true" name="description" content="${escapeHtml(snapshot.description)}" />`,
    snapshot.keywords ? `  <meta data-rh="true" name="keywords" content="${escapeHtml(snapshot.keywords)}" />` : null,
    '  <meta data-rh="true" name="robots" content="index, follow" />',
    `  <link data-rh="true" rel="canonical" href="${escapeHtml(currentUrl)}" />`,
    ...alternateLinks.map((item) => `  <link data-rh="true" rel="alternate" hrefLang="${item.lang}" href="${escapeHtml(item.url)}" />`),
    `  <link data-rh="true" rel="alternate" hrefLang="x-default" href="${escapeHtml(xDefaultUrl)}" />`,
    `  <meta data-rh="true" property="og:type" content="${escapeHtml(snapshot.type || 'website')}" />`,
    `  <meta data-rh="true" property="og:url" content="${escapeHtml(currentUrl)}" />`,
    `  <meta data-rh="true" property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `  <meta data-rh="true" property="og:description" content="${escapeHtml(snapshot.description)}" />`,
    `  <meta data-rh="true" property="og:image" content="${escapeHtml(absoluteImage)}" />`,
    `  <meta data-rh="true" property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `  <meta data-rh="true" property="og:locale" content="${escapeHtml(localeMap[snapshot.lang])}" />`,
    ...alternateLocales.map((locale) => `  <meta data-rh="true" property="og:locale:alternate" content="${escapeHtml(locale)}" />`),
    '  <meta data-rh="true" name="twitter:card" content="summary_large_image" />',
    `  <meta data-rh="true" name="twitter:url" content="${escapeHtml(currentUrl)}" />`,
    `  <meta data-rh="true" name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    `  <meta data-rh="true" name="twitter:description" content="${escapeHtml(snapshot.description)}" />`,
    `  <meta data-rh="true" name="twitter:image" content="${escapeHtml(absoluteImage)}" />`,
    `  <link data-rh="true" rel="logo" href="${escapeHtml(defaultLogo)}" />`,
  ].filter(Boolean).join('\n');
}

function writeSnapshot(snapshot) {
  const htmlWithLang = baseHtml.replace(/<html lang="[^"]+">/, `<html lang="${snapshot.lang}">`);
  const seoBlock = renderSeoBlock(snapshot);
  const renderedHtml = htmlWithLang.replace(
    /<!-- Base fallback tags \(route-specific SEO is injected by SEOHelmet\) -->[\s\S]*?<!-- Google Analytics \(configure via VITE_GA_ID; skipped if unset\) -->/,
    `${seoBlock}\n\n  <!-- Google Analytics (configure via VITE_GA_ID; skipped if unset) -->`,
  );

  const outputDir = path.join(distDir, snapshot.route.replace(/^\//, ''));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), renderedHtml, 'utf8');
}

const localeBundles = Object.fromEntries(
  languages.map((lang) => [
    lang,
    {
      common: readJson(`src/locales/${lang}/common.json`),
      home: readJson(`src/locales/${lang}/home.json`),
      about: readJson(`src/locales/${lang}/about.json`),
      products: readJson(`src/locales/${lang}/products.json`),
      applications: readJson(`src/locales/${lang}/applications.json`),
      oem: readJson(`src/locales/${lang}/oem.json`),
      contact: readJson(`src/locales/${lang}/contact.json`),
      blog: blogLanguages.includes(lang) ? readJson(`src/locales/${lang}/blog.json`) : null,
    },
  ]),
);

const productsSource = fs.readFileSync(path.join(rootDir, 'src/data/products-data.ts'), 'utf8');
const productsLiteral = extractLiteral(productsSource, 'export const LOCAL_PRODUCTS');
const localProducts = evaluateLiteral(productsLiteral);

const solutionsSource = fs.readFileSync(path.join(rootDir, 'src/data/solution-pages.ts'), 'utf8');
const solutionsLiteral = extractLiteral(solutionsSource, 'export const solutionLandingPages');
const solutionPages = evaluateLiteral(solutionsLiteral);
const solutionLangsBySlug = solutionPages.reduce((acc, page) => {
  const list = acc.get(page.slug) || [];
  list.push(page.lang);
  acc.set(page.slug, Array.from(new Set(list)));
  return acc;
}, new Map());

const snapshots = [];

for (const lang of languages) {
  const bundle = localeBundles[lang];

  snapshots.push(
    {
      route: `/${lang}`,
      lang,
      title: getValue(bundle.common, 'title', siteName),
      description: getValue(bundle.home, 'meta_description'),
      keywords: getValue(bundle.home, 'keywords'),
      image: '/images/IMG_1412.jpg',
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/products`,
      lang,
      title: getValue(bundle.common, 'nav.products', 'Products'),
      description: getValue(bundle.products, 'meta_description'),
      keywords: getValue(bundle.products, 'keywords'),
      image: '/images/IMG_1412.jpg',
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/applications`,
      lang,
      title: getValue(bundle.common, 'nav.applications', 'Applications'),
      description: getValue(bundle.applications, 'meta_description'),
      keywords: getValue(bundle.applications, 'keywords'),
      image: '/images/应用领域/纺织印染.jpg',
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/oem`,
      lang,
      title: getValue(bundle.common, 'nav.oem', 'OEM Services'),
      description: getValue(bundle.oem, 'meta_description'),
      image: '/images/oem-home.png',
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/about`,
      lang,
      title: getValue(bundle.common, 'nav.about', 'About Us'),
      description: getValue(bundle.about, 'meta_description'),
      keywords: getValue(bundle.about, 'keywords'),
      image: '/images/IMG_1515.JPG',
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/contact`,
      lang,
      title: getValue(bundle.common, 'nav.contact', 'Contact'),
      description: getValue(bundle.contact, 'meta_description'),
      keywords: getValue(bundle.contact, 'keywords'),
      image: '/images/IMG_1515.JPG',
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/privacy`,
      lang,
      title: getValue(bundle.common, 'footer.bottom_links.privacy', 'Privacy Policy'),
      description: getValue(bundle.common, 'privacy.meta_description', 'Privacy policy for Hangzhou Karn New Building Materials website and customer communication.'),
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/terms`,
      lang,
      title: getValue(bundle.common, 'footer.bottom_links.terms', 'Terms of Service'),
      description: getValue(bundle.common, 'terms.meta_description', 'Terms of service for using Hangzhou Karn New Building Materials website and inquiry channels.'),
      type: 'website',
      supportedLangs: languages,
    },
    {
      route: `/${lang}/solutions`,
      lang,
      title: solutionHubMeta[lang].title,
      description: solutionHubMeta[lang].description,
      image: '/images/oem-home.png',
      type: 'website',
      supportedLangs: languages,
    },
  );

  if (faqLanguages.includes(lang)) {
    snapshots.push({
      route: `/${lang}/faq`,
      lang,
      title: faqMeta[lang].title,
      description: faqMeta[lang].description,
      keywords: faqMeta[lang].keywords,
      type: 'website',
      supportedLangs: faqLanguages,
    });
  }

  if (blogLanguages.includes(lang)) {
    snapshots.push({
      route: `/${lang}/blog`,
      lang,
      title: getValue(bundle.blog, 'title', 'Blog & News'),
      description: getValue(bundle.blog, 'meta_description'),
      keywords: 'blog, news, industry, CMS, carboxymethyl starch, wallpaper adhesive',
      type: 'website',
      supportedLangs: blogLanguages,
    });
  }
}

for (const [slug, product] of Object.entries(localProducts)) {
  for (const lang of languages) {
    snapshots.push({
      route: `/${lang}/products/${slug}`,
      lang,
      title: product[`name_${lang}`] || product.name_en || product.name_zh,
      description: product[`description_${lang}`] || product.description_en || product.description_zh,
      image: product.image_url,
      type: 'product',
      supportedLangs: languages,
    });
  }
}

for (const article of STATIC_BLOG_ARTICLES) {
  const supportedLangs = blogLanguages.filter((lang) => article[`title_${lang}`]);
  for (const lang of supportedLangs) {
    snapshots.push({
      route: `/${lang}/blog/${article.slug}`,
      lang,
      title: article[`meta_title_${lang}`] || article[`title_${lang}`] || article.title_en || article.title_zh,
      description: article[`meta_description_${lang}`] || article[`excerpt_${lang}`] || article.excerpt_en || article.excerpt_zh,
      image: article.cover_image,
      type: 'article',
      supportedLangs,
    });
  }
}

for (const page of solutionPages) {
  snapshots.push({
    route: `/${page.lang}/solutions/${page.slug}`,
    lang: page.lang,
    title: page.meta.title,
    description: page.meta.description,
    keywords: Array.isArray(page.meta.keywords) ? page.meta.keywords.join(', ') : '',
    image: page.meta.image,
    type: 'article',
    supportedLangs: solutionLangsBySlug.get(page.slug) || [page.lang],
  });
}

const dedupedSnapshots = [];
const seenRoutes = new Set();

for (const snapshot of snapshots) {
  if (seenRoutes.has(snapshot.route)) {
    continue;
  }
  seenRoutes.add(snapshot.route);
  dedupedSnapshots.push(snapshot);
}

for (const snapshot of dedupedSnapshots) {
  writeSnapshot(snapshot);
}

console.log(`Generated ${dedupedSnapshots.length} SEO snapshot pages in dist/`);
