# SEO 后续优化工作清单（2025-11-14）

记录当前 SEO 基线，并列出下一工作日需要 Codex 执行的任务，方便直接开工。

## 0. 基线速记
- 站点具备主 sitemap + 6 个语言子 sitemap，robots.txt 正确暴露。
- 前台主要页面已接入 `SEOHelmet` + JSON-LD，产品列表等个别页面仍使用裸 `Helmet`。
- Search Console 仍显示 “Sitemap 是 HTML”，推测是缓存；Bing 匿名 ping 已失效，需后台手提。

## 1. 搜索引擎控制台操作（高优先级）
1. **Google Search Console**
   - 访问 “站点地图” 页面，删除 `sitemap.xml`，立即重新添加同 URL。
   - 在 “URL 检查” 中输入 `https://kn-wallpaperglue.com/sitemap.xml`，执行 “测试实时 URL”，确认返回 `application/xml`。
   - 若仍报错，导出 “查看抓取数据” 的 HTTP 详情供排查。
2. **Bing Webmaster Tools**
   - 登录后台，进入 “Sitemaps”，重新提交 `https://kn-wallpaperglue.com/sitemap.xml`。
   - 记录提交时间和响应状态。
3. **Yandex Webmaster**
   - 检查 2025-11-13 的 ping 是否在后台出现，若缺失则在 “索引 → Sitemap 文件” 再次提交。

## 2. 页面级 SEO（优先级：高）
1. **产品列表页 `src/pages/products/index.tsx`**
   - 用 `SEOHelmet` 替换当前 `Helmet`，补充 canonical、hreflang、OG/Twitter 标签。
   - 添加 `StructuredData`，输出 `WebPage`（或 `CollectionPage`）JSON-LD；如可能，再为循环中的产品生成 `ItemList`。
2. **应用领域页 `src/pages/applications/index.tsx`**
   - 注入 `StructuredData`（`WebPage` + 可选 `FAQPage`/`ItemList`）。
   - 补充 canonical/hreflang（可直接复用 `SEOHelmet`）。
3. **其它未覆盖页面**
   - 全局搜索确认是否仍有页面未使用 `SEOHelmet`；若有，按统一格式接入。

## 3. 结构化数据拓展（优先级：中）
- 为 FAQ/解决方案条目补充 `BreadcrumbList`，帮助搜索引擎理解层级。
- 如果后续有新闻/更新模块，预留 `Article` JSON-LD 模板。

## 4. 站点基本配置（优先级：中）
1. **robots.txt 调整**
   - 当前 `Disallow: /api/` 会阻止公开 API 被索引；如果未来需要对外展示 JSON feed，改为：
     ```
     Disallow: /api/admin/
     Allow: /api/products
     Allow: /api/content
     ```
   - 同步更新 `docs/SEARCH_ENGINE_SUBMISSION_GUIDE.md` 中的说明。
2. **Manifest 国际化**
   - 现有 `public/manifest.json` 的 `lang` 固定为 `zh-CN`；评估是否需要多语言版本（例如构建后生成 `manifest-en.json` 等），或在前端加载后根据当前语言写入 `navigator.language`。
3. **性能/抓取诊断**
   - 运行一次 `pnpm build && pnpm preview` + Lighthouse（桌面+移动）并记录：LCP、CLS、INP、SEO 分数。
   - 若有 <90 的指标，加入专项优化计划。

## 5. 内容与外链（优先级：低-中）
- 校对多语言文案，确保 meta description 与页面主体一致且 <160 字。
- 根据 `SOCIAL_MEDIA_AUTO_UPDATE.md`，评估是否需要在社媒简介/外链中新增 sitemap/landing link，提升友情链接权重。
- 盘点 `public/images/…` 中的大图，必要时压缩/生成 WebP，避免影响 Core Web Vitals。

---
> 执行建议：明天开始按章节顺序推进，完成一项在此文档内勾选/追加备注，方便持续跟踪。

## ✅ 已完成任务（2025-11-14）

### 1. 页面级 SEO（已完成 ✅）
- ✅ **产品列表页** (`src/pages/products/index.tsx`)
  - 已用 `SEOHelmet` 替换 `Helmet`
  - 添加 `WebPage` 结构化数据
  - 添加 `ItemList` 结构化数据（包含产品列表）
  - 添加 `BreadcrumbList` 结构化数据

- ✅ **应用领域页** (`src/pages/applications/index.tsx`)
  - 已使用 `SEOHelmet`
  - 添加 `WebPage` 结构化数据
  - 添加 `ItemList` 结构化数据（包含应用领域列表）
  - 添加 `BreadcrumbList` 结构化数据

- ✅ **产品详情页** (`src/pages/product-detail/index.tsx`)
  - 添加 `BreadcrumbList` 结构化数据（首页 > 产品中心 > 产品详情）

### 2. 结构化数据拓展（已完成 ✅）
- ✅ 扩展 `StructuredData` 组件支持 `ItemList` 类型
- ✅ 扩展 `StructuredData` 组件支持 `BreadcrumbList` 类型
- ✅ 为关键页面添加面包屑导航结构化数据

### 3. 站点基本配置（已完成 ✅）
- ✅ **robots.txt 调整**
  - 已更新为允许 `/api/products` 和 `/api/content` 被索引
  - 禁止 `/api/admin/` 和其他 `/api/` 路径
- ✅ **文档更新**
  - 更新 `SEARCH_ENGINE_SUBMISSION_GUIDE.md`，添加 robots.txt 配置说明

### 4. 搜索引擎控制台操作（需要手动完成 ⚠️）
- ⚠️ **Google Search Console** - 需要登录后手动操作
  - 已创建详细操作指南：`scripts/automate-search-console-operations.md`
  - 已创建验证脚本：`scripts/auto-submit-sitemaps.js`
  - 所有 sitemap 文件已验证可访问（7/7 成功）

- ⚠️ **Bing Webmaster Tools** - 需要登录后手动操作
  - 操作步骤已包含在指南中

- ⚠️ **Yandex Webmaster** - 需要登录后手动操作
  - 操作步骤已包含在指南中

### 5. 其他页面检查（已完成 ✅）
- ✅ 所有前台页面已使用 `SEOHelmet`
- ✅ 后台页面使用 `Helmet`（合理，无需 SEO）

## 📝 下一步操作

1. **手动完成搜索引擎控制台操作**：
   - 按照 `scripts/automate-search-console-operations.md` 中的详细步骤操作
   - 或运行 `node scripts/auto-submit-sitemaps.js` 验证 sitemap 文件

2. **部署代码更改**：
   - 运行 `pnpm build` 构建项目
   - 部署到 Cloudflare Pages
   - 验证结构化数据是否正确输出

3. **验证 SEO 效果**：
   - 使用 Google Rich Results Test 验证结构化数据
   - 监控搜索引擎索引状态
   - 检查搜索排名变化
