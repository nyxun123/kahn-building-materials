# SEO 巡检清单

## 每周
- [ ] 运行 `pnpm node scripts/seo-check.js`，更新收录表
- [ ] 检查 Cloudflare Pages 构建是否成功 + 手动 Purge CDN（如有变更）
- [ ] 通过 Search Console / Bing Webmaster 查看抓取异常
- [ ] 随机抽查 3 篇页面的 Title、Description、H1 是否符合规范

## 每月
- [ ] Lighthouse / PageSpeed Insights 检测桌面与移动端
- [ ] 核对 sitemap 是否包含新增页面，并更新 `lastmod`
- [ ] 复查结构化数据（Organization / Product / ItemList / Breadcrumb）
- [ ] 检查内部链接：确保新页面至少有 2 个入口
- [ ] 统计并补充图片 alt 文案、文件名

## 每季度
- [ ] 调整 `seo-config.ts` 中的关键词库
- [ ] 复盘内容策略：是否需要新增 FAQ/Blog/Case Study
- [ ] 衡量各搜索引擎的收录曲线，必要时提交重新抓取
- [ ] 检查 robots.txt 与 canonical/hreflang 是否与 URL 结构一致

## 发生重大更新时
- [ ] 部署完成后立即运行 `scripts/seo-check.js`
- [ ] 在 Search Console 提交“抓取”请求
- [ ] Lighthouse 测试确认性能无明显下降
- [ ] 更新本清单或相关文档中的记录时间戳

> 建议将此清单添加到项目例行会议流程中，配合 `docs/SEO_AUDIT_REPORT.md` 与 `docs/SEO_OPTIMIZATION_REPORT.md` 跟踪闭环。
