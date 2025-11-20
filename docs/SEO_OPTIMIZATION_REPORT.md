# SEO 优化报告 & 实施计划

> 本计划基于 2025-11-17 的代码库与内容结构编写，配合 `scripts/seo-check.js` 可形成“检测 + 优化”闭环。

## 1. Meta 标签

### 1.1 Title
- **现状**：
  - 各语言页面通过 `SEOHelmet` 生成 Title，但部分页面长度超过 60 字符，且未统一“关键词 - 品牌”格式。
- **行动**：
  1. 在 `src/lib/seo-config.ts` 中为 `PAGE_KEYWORDS` 增加 `titles` 配置，集中管理。
  2. 规范格式：`核心关键词 | Hangzhou Karn New Building Materials Co., Ltd`。
  3. 通过 `pnpm lint` 确认无 TS 报错后发布。

### 1.2 Description
- **现状**：
  - `SEOHelmet` 使用 `t('page:meta_description')`，中文描述约 120~140 字符，英文 150~180 字符，基本合格。
  - 个别页面（如 `applications`）包含大量行业关键词，可再精简以提升可读性。
- **行动**：
  - 逐个语言检查 `src/locales/*/*` 中的 `meta_description`；确保 150~160 字符内并包含主关键词（羧甲基淀粉、墙纸胶）。
  - 英文描述加入 CTA 文案（如 “Contact us for OEM solutions”）。

### 1.3 Keywords
- **现状**：
  - 已在 `src/lib/seo-config.ts` 中统一关键词；需定期校对是否与实际产品、内容一致。
- **行动**：
  - 每季度更新关键词列表，剔除热度低或与内容不符的词。

### 1.4 Open Graph / Twitter
- **现状**：
  - `SEOHelmet` 已输出 `og:title/description/image` 与 `twitter:card`。
  - 需确认 `DEFAULT_IMAGE`（`/images/IMG_1412.JPG`）在 1200×630 范围；若不是，建议新增专用 OG 图。
- **行动**：
  - 在 `public/images/og-default.jpg` 放置 1200×630 图，并在 `seo-config` 中更新。

## 2. 结构化数据

| 类型 | 现状 | 行动 |
| --- | --- | --- |
| `Organization` | 由 `src/pages/home/index.tsx` 中的 `StructuredData` 输出，信息完整 | 补充 `sameAs` 链接（TikTok、YouTube 等）。 |
| `BreadcrumbList` | 已在多页面实现 | 确保所有主要导航页面均注入（`products`, `applications`, `about`, `contact`）。 |
| `ItemList` | 产品/应用列表页已有 | 追加 `numberOfItems` 与 `item` URL 列表，保持与实际数量一致。 |
| `Product` | 产品详情页 `src/pages/product-detail/index.tsx` 输出基础信息 | 补充 `offers`（价格可写 `"price": "0", "priceCurrency": "CNY"` 作为占位）、`aggregateRating`（没有评价可省略）。 |
| `FAQPage` | 暂无 | 若 CMS 中有常见问题，可在 `faq` 页面加入结构化数据组件。 |

**验证**：提交后使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 与 [Schema Markup Validator](https://validator.schema.org/)。

## 3. 内容与内部链接

- **H1 结构**：确保每个页面仅使用一个 H1（目前大部分页面符合，后台页面需复查）。
- **内容长度**：公共页面均超 300 字；若新增英文/俄文页面，需同步翻译，避免只保留中文内容。
- **关键词密度**：建议 1.5%~2.5%；可在 Markdown/文案阶段通过 VSCode 插件统计。
- **内部链接**：
  - 在首页、应用页等插入 `Link` 指向产品详情/OEM 页面，提升爬虫抓取效率。
  - 博客/内容页上线后，记录在 `docs/CONTENT_MAP.md` 并安排交叉链接。

## 4. 图片 SEO

- 所有 `img` 均需设置 `alt`（现有组件已通过 i18n 提供文案，但应检查手动添加的图片）。
- 文件命名遵循 `category-keyword-description.jpg` 格式；避免 `IMG_xxxx`。
- 继续使用 `.webp` 与懒加载（`loading="lazy"`），并在构建阶段使用 `pnpm optimize-images`（可新增脚本）。

## 5. 页面速度 / Core Web Vitals

- 运行 `pnpm build && pnpm preview` 后用 Lighthouse 检测：
  - 目标：Performance > 90，CLS < 0.1，LCP < 2.5s。
- **优化建议**：
  - 复查 `src/pages/home/index.tsx` 中的图片是否都走 CDN，可在 `public/_headers` 中配置长缓存。
  - 确认 `vite.config.ts` 已开启 `splitVendorChunkPlugin`（如未启用可加入）。
  - 对 `lucide-react` 等大型依赖启用按需导入。

## 6. 技术 SEO

- `robots.txt`：位于 `public/robots.txt`，需确认包含 `Sitemap: https://kn-wallpaperglue.com/sitemap.xml` 行并允许主要目录。
- `sitemap`：使用 `scripts/submit-sitemaps.js`（若存在）或通过 Search Console 提交，修改静态文件后更新 `lastmod`。
- `canonical`/`hreflang`：
  - `SEOHelmet` 目前未输出 canonical，可在组件中增加 `<link rel="canonical" href={canonicalUrl} />`。
  - hreflang 可参照现有语言切换逻辑生成。

## 7. 执行节奏

| 周期 | 任务 |
| --- | --- |
| 每周 | 运行 `scripts/seo-check.js`，更新 `docs/SEO_AUDIT_REPORT.md` 中的表格 |
| 每月 | Lighthouse、Core Web Vitals、内容更新复盘 |
| 每季度 | 关键词库、反向链接策略、结构化数据新增类型 |

## 8. 待办追踪

- [ ] 在 `SEOHelmet` 中加 canonical + og:image 覆盖。
- [ ] `scripts/seo-check.js` 输出 JSON，方便自动化入库。
- [ ] 编写 `scripts/seo-submit.js` 自动调用 Search Console API（可选）。
- [ ] 通过 `docs/SEO_CHECKLIST.md` 落实巡检流程。
