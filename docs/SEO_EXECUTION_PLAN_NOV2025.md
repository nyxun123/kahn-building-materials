# SEO Execution Plan – November 2025
_Last updated: 2025-11-13_

## 1. Business Snapshot
- **Legal name**: 杭州卡恩新型建材有限公司
- **Primary NAP**: +86 571-88888888 · info@karn-materials.com · 浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场
- **Customer-facing contact**: Phone/WhatsApp/WeChat +86 13216156841 · karnstarch@gmail.com
- **Flagship domains**: `https://kn-wallpaperglue.com` (primary) · `/contact` for lead capture
- **Languages served**: zh, en, ru, vi, th, id (existing hreflang + sitemaps)
- **Hero products & services**: CMS 粉体系列 8810/8840/K5/K6/999、OEM/ODM、小包装私标、技术应用支持

## 2. Google Business Profile & Directory Audit
### 2.1 Field-by-field checklist
| Section | Canonical data / source | Audit actions |
| --- | --- | --- |
| Business name | 杭州卡恩新型建材有限公司 (`docs/README.md`) | Ensure identical string (GB, Bing, Apple, Yandex). Add English alias "Hangzhou Karn New Building Materials Co., Ltd" in description only. |
| Categories | Primary: Wallpaper adhesive manufacturer; Secondary: Chemical manufacturer, Building materials supplier, OEM supplier | Confirm availability per platform; if missing, select closest (e.g., "Wallpaper store" on GBP) and reinforce keywords in description. |
| Description (multi-language) | Templates in `SOCIAL_MEDIA_BIO_UPDATE_GUIDE.md` | Paste zh/en/ru text blocks; craft 120‑char summaries for vi/th/id. |
| Hours | Proposed: Mon–Fri 09:00‑18:00 (appointment only) | Add consistent schedule; toggle GBP attributes “预约参观” or “By appointment only”. |
| Service areas | China · Russia · Vietnam · Thailand · Indonesia + Zhejiang/Hangzhou local radius | Add to GBP "Service areas"; replicate in Bing Places/Yandex Business. |
| Phone/WhatsApp | +86 571-88888888 (main), +86 13216156841 (mobile/messaging) | Verify both numbers in GBP; set messaging to mobile line. |
| Website & CTA | https://kn-wallpaperglue.com, booking URL `/contact?utm_source=google&utm_medium=organic&utm_campaign=gbp-profile` | Configure GBP "预约" button; reuse UTM for Bing/Apple. |
| Products/Services | 8810/8840/K5/K6/999, OEM定制、私标包装、技术顾问 | Add under GBP “Products”, Bing “Services”, Apple “Showcase”. Include multilingual blurbs + price = “Custom quote”. |
| Media | Need 5 Logo + 10 Exterior/Interior + 10 Production + 5 Team + OEM flow video | Schedule monthly shoot; upload to GBP/Bing/Yandex; embed EXIF geotag near HQ. |
| Posts & Offers | Currently none | Follow cadence in Section 4: weekly posts (case, FAQ, promo). |
| Reviews | No documented process | Implement 48h SLA, add QR/short link `https://g.page/r/{id}` to packaging/email footer. |
| Q&A | Empty | Seed FAQs per region (“是否支持俄文标签?”). Update quarterly. |
| Citation consistency | Schema + robots already list 6 sitemaps | After each directory submission, log URL + status in `docs/SEO_EXECUTION_PLAN_NOV2025.md#appendix`. |

### 2.2 Priority directories & owners
1. Google Business Profile – Owner: 市场部; due 2025-11-18
2. Bing Places + automatic sync to Yahoo – Owner: 市场部; due 2025-11-20
3. Apple Business Connect – Owner: 品牌部; due 2025-11-21
4. Yandex Business / 2GIS (Russia) – Owner: 俄语销售; due 2025-11-25
5. 行业目录（慧聪、1688、GlobalSources） – Owner: 电商小组; due 2025-11-28

## 3. Service × Geography × Language Matrix
_Target: dedicated landing page or section + FAQ + schema markup for each high-intent cell._

| Service intent ↓ / Region-language → | 杭州·华东 (zh) | Russia (ru) | Vietnam (vi) | Thailand (th) | Indonesia (id) |
| --- | --- | --- | --- | --- | --- |
| OEM wallpaper adhesive | URL: `/zh/solutions/hangzhou-oem-wallpaper-adhesive` · Keywords: “OEM墙纸胶, 杭州墙纸胶代工” · CTA: 7‑day sample | `/ru/solutions/russia-oem-wallpaper-adhesive` · “OEM клей для обоев, контрактное производство” · Include Russian labels PDF | `/vi/solutions/vietnam-oem-wallpaper-adhesive` · “OEM keo dán tường” · Add shipping timelines table | `/th/solutions/thailand-oem-wallpaper-adhesive` · “OEM กาววอลเปเปอร์” · Add ASTM/ใบรับรอง section | `/id/solutions/indonesia-oem-wallpaper-adhesive` · “OEM lem wallpaper” · Explain halal/BPOM readiness |
| CMS bulk supply | `/zh/cms-bulk-hangzhou` · highlight 8810/8840 specs | `/ru/cms-bulk` · emphasize REACH/COA | `/vi/cms-bulk` · include MOQ FAQ | `/th/cms-bulk` · mention LC payment | `/id/cms-bulk` · detail CIF Jakarta flow |
| Private label packaging | `/zh/private-label` · small packs photo gallery | `/ru/private-label` · show Cyrillic packaging options | `/vi/private-label` · pricing tiers | `/th/private-label` · packaging compliance | `/id/private-label` · label translation workflow |
| Application & training | `/zh/application-training` · onsite workshop CTA | `/ru/application-training` · Russian manuals download | `/vi/application-training` · video tutorials | `/th/application-training` · Thai interpreter availability | `/id/application-training` · Surabaya/Jakarta onsite support |

Implementation steps:
1. Clone existing `/oem` layout as template; inject locale-specific copy + hero stats.
2. Add 3 unique FAQ items per locale; render via StructuredData `FAQPage`.
3. Append each new route to language-specific sitemaps + `robots.txt` references.
4. Internal link from homepage hero + `/products` cards to locale pages.

## 4. Content, Reviews & Off-page Cadence
### 4.1 Monthly cycle (repeat every 4 weeks)
| Week | Content/SEO | Reputation | Outreach |
| --- | --- | --- | --- |
| W1 | Publish bilingual case study blog + GBP Post (项目/产能) | Send review invites to new buyers (target ≥3) | Share case with Zhejiang chamber newsletter |
| W2 | Update 1 locale landing page section + resubmit sitemap | Seed/answer 1 GBP Q&A | Pitch Russian/Vietnamese partners with tech whitepaper |
| W3 | Shoot 30s OEM tip video → TikTok/Instagram Reels → embed on relevant pages | Highlight best review on social + thank-you post | Respond to 1 HARO/SourceBottle query for backlink |
| W4 | Release “Monthly production update” blog + LinkedIn note | KPI retro: reply to any pending reviews <48h | Pitch guest article to industry portal / association |

### 4.2 Templates (shortened for quick copy)
- **Review invite (email/WeChat)**
  > 你好 {姓名}，感谢本周采购 {产品}。若体验满意，请在 Google 搜索“杭州卡恩墙纸胶”后点“撰写评论”，或使用 {review_link}（仅需1分钟）。我们会48小时内回复，也欢迎上传施工照片。
- **GBP Post skeleton**
  ```
  标题：{城市} OEM 墙纸胶 {吨数} 出货
  正文：{亮点1} + {认证/时效} + 联系方式（+86 13216156841 / info@karn-materials.com）
  CTA 链接：/ru/oem-wallpaper-adhesive?utm_source=google&utm_medium=organic&utm_campaign=gbp-post-{YYYYMM}
  ```
- **Outreach email (association / media)**
  ```
  Subject: 墙纸胶 OEM 技术白皮书 & 成功案例共享
  您好 {Name}，杭州卡恩（总部：杭州市余杭区）刚交付 {行业} 客户订单，整理了《墙纸胶 OEM 技术要点 2025》俄/英版，愿在贵平台发布。可安排采访或样品测试，敬请回复。
  ```

## 5. Tracking & Measurement
- **UTM conventions**: `utm_source` = google/bing/yandex/apple/tiktok/wechat; `utm_medium` = organic_profile/organic_post/referral; `utm_campaign` = gbp-profile, gbp-post-YYYYMM, directory-{name}. Apply to GBP buttons, posts, directory listings, bio link aggregators.
- **GA4 events**:
  - `lead_form_submit` (params: language, service_intent, utm_campaign)
  - `click_to_call` (params: phone_type=main/whatsapp)
  - `whatsapp_chat_start`
  - `download_spec` (track whitepapers per locale)
- **Dashboards**:
  - Looker Studio combining Cloudflare logs + GA4 + GSC (per language folder) → KPI: organic sessions, form leads, call clicks, review count, GBP discovery vs branded impressions.
  - Monthly GBP Insights export archived under `analytics/gbp/{YYYY-MM}.csv`.
- **Review & alerting**:
  - Monday: check Search Console Coverage + International targeting for hreflang errors.
  - Wednesday: verify sitemap fetch status for new locale pages.
  - Friday: audit UTM-tagged leads vs CRM to validate attribution; flag gaps >10%.

## 6. Appendices
- **Directory submission log** (add rows after execution)
  | Platform | URL | Status | Last verified | Notes |
  | --- | --- | --- | --- | --- |
- **Content inventory tracker** (copy existing Notion/Sheet link once ready)
