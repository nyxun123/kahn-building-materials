#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const DEFAULT_SITE_URL = process.env.SEO_SITE_URL || 'https://kn-wallpaperglue.com';
const REPORT_DIR = path.join(process.cwd(), 'docs', 'seo-reports');
const LATEST_JSON = path.join(REPORT_DIR, 'continuous-seo-latest.json');
const LATEST_MD = path.join(REPORT_DIR, 'continuous-seo-latest.md');

const SUPPORTED_LANGS = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
const CORE_PATHS = ['', 'products', 'applications', 'oem', 'about', 'contact', 'solutions', 'blog'];
const PRODUCT_SLUGS = [
  'wallpaper-adhesive',
  'construction-cms',
  'textile-cms',
  'coating-cms',
  'paper-dyeing-cms',
  'desiccant-gel',
  'oem-service',
];

function getArg(name, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === name || arg.startsWith(`${name}=`));
  if (index === -1) return fallback;
  const exact = process.argv[index];
  if (exact.includes('=')) return exact.split('=').slice(1).join('=');
  return process.argv[index + 1] ?? fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function normalizeSiteUrl(input) {
  const value = (input || '').trim().replace(/\/+$/, '');
  if (!value) return DEFAULT_SITE_URL;
  return value.startsWith('http') ? value : `https://${value}`;
}

function toAbs(siteUrl, maybePath) {
  if (!maybePath) return siteUrl;
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://')) return maybePath;
  return `${siteUrl}${maybePath.startsWith('/') ? '' : '/'}${maybePath}`;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeMatch(input, regex) {
  const m = input.match(regex);
  return m && m[1] ? m[1].trim() : '';
}

function parseHeadSignals(html) {
  const title = safeMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = safeMatch(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i
  );
  const canonical = safeMatch(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([\s\S]*?)["'][^>]*>/i
  );

  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const hreflangs = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["']/gi)].map(
    (m) => m[1]
  );
  const jsonLdCount = (html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi) || []).length;
  const bodyText = stripHtml(html);

  return {
    title,
    description,
    canonical,
    noindex,
    hreflangCount: hreflangs.length,
    hreflangs,
    jsonLdCount,
    wordCount: bodyText ? bodyText.split(' ').length : 0,
  };
}

async function fetchWithTimeout(url, timeoutMs = 20000, accept = 'text/html') {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { Accept: accept, 'User-Agent': 'KarnSEOAuditBot/1.0' },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, url: response.url, text };
  } catch (error) {
    return { ok: false, status: 0, url, text: '', error: String(error?.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

function parseUrlset(xml) {
  const locMatches = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
  const lastmods = [...xml.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi)].map((m) => m[1].trim());
  return { urls: locMatches, lastmods };
}

function unique(arr) {
  return [...new Set(arr)];
}

function daysBetween(dateA, dateB) {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.floor(Math.abs(a - b) / (1000 * 60 * 60 * 24));
}

async function checkPage(siteUrl, url, indexable = true) {
  const result = await fetchWithTimeout(url);
  const page = {
    url,
    status: result.status,
    indexable,
    checks: {
      hasTitle: false,
      hasDescription: false,
      hasCanonical: false,
      noindex: false,
      hreflangCount: 0,
      jsonLdCount: 0,
      wordCount: 0,
    },
    issues: [],
  };

  if (!result.ok) {
    page.issues.push(`HTTP status ${result.status || '0'}`);
    return page;
  }

  const signals = parseHeadSignals(result.text);
  page.checks.hasTitle = Boolean(signals.title);
  page.checks.hasDescription = Boolean(signals.description);
  page.checks.hasCanonical = Boolean(signals.canonical);
  page.checks.noindex = signals.noindex;
  page.checks.hreflangCount = signals.hreflangCount;
  page.checks.jsonLdCount = signals.jsonLdCount;
  page.checks.wordCount = signals.wordCount;

  if (!signals.title) page.issues.push('Missing <title>');
  if (!signals.description) page.issues.push('Missing meta description');
  if (!signals.canonical) {
    page.issues.push('Missing canonical URL');
  } else if (!signals.canonical.startsWith(siteUrl)) {
    page.issues.push(`Canonical out of domain: ${signals.canonical}`);
  }

  if (indexable && signals.noindex) page.issues.push('Unexpected noindex on indexable page');
  if (signals.hreflangCount < 2) page.issues.push('Too few hreflang alternates');
  if (signals.jsonLdCount < 1) page.issues.push('Missing JSON-LD structured data');

  return page;
}

async function checkSitemaps(siteUrl, maxSampleUrls) {
  const indexUrl = `${siteUrl}/sitemap-index.xml`;
  const fallbackUrl = `${siteUrl}/sitemap.xml`;
  const reports = [];
  const sampleUrls = [];

  const indexResp = await fetchWithTimeout(indexUrl, 20000, 'application/xml,text/xml');
  if (indexResp.ok && indexResp.text.includes('<sitemapindex')) {
    const { urls, lastmods } = parseUrlset(indexResp.text);
    for (let i = 0; i < urls.length; i += 1) {
      const sitemapUrl = urls[i];
      const lastmod = lastmods[i] || '';
      const sitemapResp = await fetchWithTimeout(sitemapUrl, 20000, 'application/xml,text/xml');
      const entry = {
        url: sitemapUrl,
        status: sitemapResp.status,
        lastmod,
        staleDays: lastmod ? daysBetween(new Date().toISOString(), lastmod) : null,
        urlCount: 0,
      };

      if (sitemapResp.ok) {
        const parsed = parseUrlset(sitemapResp.text);
        entry.urlCount = parsed.urls.length;
        sampleUrls.push(...parsed.urls.slice(0, Math.max(1, Math.floor(maxSampleUrls / Math.max(urls.length, 1)))));
      }
      reports.push(entry);
    }
  } else {
    const fallbackResp = await fetchWithTimeout(fallbackUrl, 20000, 'application/xml,text/xml');
    const entry = {
      url: fallbackUrl,
      status: fallbackResp.status,
      lastmod: '',
      staleDays: null,
      urlCount: 0,
    };
    if (fallbackResp.ok) {
      const parsed = parseUrlset(fallbackResp.text);
      entry.urlCount = parsed.urls.length;
      sampleUrls.push(...parsed.urls.slice(0, maxSampleUrls));
      if (parsed.lastmods[0]) {
        entry.lastmod = parsed.lastmods[0];
        entry.staleDays = daysBetween(new Date().toISOString(), parsed.lastmods[0]);
      }
    }
    reports.push(entry);
  }

  return { reports, sampleUrls: unique(sampleUrls).slice(0, maxSampleUrls) };
}

function buildFixedTargets(siteUrl) {
  const staticPages = SUPPORTED_LANGS.flatMap((lang) =>
    CORE_PATHS.map((p) => `${siteUrl}/${lang}${p ? `/${p}` : ''}`)
  );
  const productPages = SUPPORTED_LANGS.flatMap((lang) =>
    PRODUCT_SLUGS.map((slug) => `${siteUrl}/${lang}/products/${slug}`)
  );
  return unique([...staticPages, ...productPages]);
}

function markdownReport(report) {
  const lines = [];
  lines.push(`# Continuous SEO Report`);
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Site: ${report.site}`);
  lines.push(`- Score: ${report.summary.score}/100`);
  lines.push(`- Critical: ${report.summary.critical}`);
  lines.push(`- Warning: ${report.summary.warning}`);
  lines.push('');
  lines.push(`## Critical Findings`);
  if (report.findings.critical.length === 0) {
    lines.push('- None');
  } else {
    for (const item of report.findings.critical) lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push(`## Warning Findings`);
  if (report.findings.warning.length === 0) {
    lines.push('- None');
  } else {
    for (const item of report.findings.warning) lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push(`## Priority Actions`);
  if (report.actions.length === 0) {
    lines.push('- Keep publishing fresh content and keep technical checks green.');
  } else {
    for (const action of report.actions) lines.push(`- ${action}`);
  }
  return lines.join('\n');
}

function scoreFromFindings(critical, warning) {
  const raw = 100 - critical * 12 - warning * 3;
  return Math.max(0, Math.min(100, raw));
}

async function run() {
  const siteUrl = normalizeSiteUrl(getArg('--site', DEFAULT_SITE_URL));
  const maxSampleUrls = Number(getArg('--max-urls', '80')) || 80;
  const noFail = hasFlag('--no-fail');
  const now = new Date().toISOString();
  const ts = now.replace(/[:.]/g, '-');

  const outputJson = getArg('--output-json', path.join(REPORT_DIR, `continuous-seo-${ts}.json`));
  const outputMd = getArg('--output-md', path.join(REPORT_DIR, `continuous-seo-${ts}.md`));

  const findings = { critical: [], warning: [] };
  const pageChecks = [];
  const robots = await fetchWithTimeout(`${siteUrl}/robots.txt`, 15000, 'text/plain');
  const homepage = await fetchWithTimeout(siteUrl, 15000, 'text/html');
  const isSpaSite =
    homepage.ok &&
    homepage.text.includes('<div id="root"></div>') &&
    homepage.text.includes('type="module"');

  if (!robots.ok) {
    findings.critical.push(`robots.txt unavailable (${robots.status})`);
  } else {
    const requiredSitemaps = ['/sitemap.xml', '/sitemap-index.xml'];
    for (const pathSuffix of requiredSitemaps) {
      if (!robots.text.includes(`${siteUrl}${pathSuffix}`)) {
        findings.warning.push(`robots.txt missing sitemap reference: ${pathSuffix}`);
      }
    }
  }

  const { reports: sitemapReports, sampleUrls } = await checkSitemaps(siteUrl, maxSampleUrls);
  for (const sitemap of sitemapReports) {
    if (!(sitemap.status >= 200 && sitemap.status < 400)) {
      findings.critical.push(`Sitemap unavailable: ${sitemap.url} (${sitemap.status})`);
    }
    if (sitemap.staleDays !== null && sitemap.staleDays > 14) {
      findings.warning.push(`Sitemap lastmod too old (${sitemap.staleDays} days): ${sitemap.url}`);
    }
  }

  const fixedTargets = buildFixedTargets(siteUrl);
  const auditTargets = unique([...fixedTargets, ...sampleUrls]).slice(0, maxSampleUrls);
  for (const url of auditTargets) {
    const page = await checkPage(siteUrl, url, true);
    pageChecks.push(page);
    if (!(page.status >= 200 && page.status < 400)) {
      findings.critical.push(`Page unavailable: ${url} (${page.status})`);
      continue;
    }
    for (const issue of page.issues) {
      const isSpaMetaIssue =
        issue.includes('Missing canonical') ||
        issue.includes('Too few hreflang') ||
        issue.includes('Missing JSON-LD');

      if (isSpaSite && isSpaMetaIssue) {
        continue;
      }

      if (issue.includes('Unexpected noindex') || issue.includes('Missing canonical')) {
        findings.critical.push(`${issue} @ ${url}`);
      } else {
        findings.warning.push(`${issue} @ ${url}`);
      }
    }
  }

  const deduped = {
    critical: unique(findings.critical),
    warning: unique(findings.warning),
  };

  const actions = [];
  if (deduped.critical.some((i) => i.includes('noindex'))) {
    actions.push('Remove unintended noindex from important pages and redeploy immediately.');
  }
  if (deduped.critical.some((i) => i.includes('canonical'))) {
    actions.push('Fix canonical URL generation to ensure one absolute canonical per page.');
  }
  if (deduped.warning.some((i) => i.includes('lastmod'))) {
    actions.push('Regenerate sitemaps after each content update to keep lastmod fresh.');
  }
  if (deduped.warning.some((i) => i.includes('JSON-LD'))) {
    actions.push('Add JSON-LD schema to pages missing structured data.');
  }
  if (actions.length === 0) {
    actions.push('Publish at least 2 high-intent articles per week with internal links to money pages.');
  }

  const report = {
    generatedAt: now,
    site: siteUrl,
    summary: {
      score: scoreFromFindings(deduped.critical.length, deduped.warning.length),
      critical: deduped.critical.length,
      warning: deduped.warning.length,
      auditedPages: pageChecks.length,
      auditedSitemaps: sitemapReports.length,
      spaMetaChecksSkipped: isSpaSite,
    },
    findings: deduped,
    sitemapReports,
    pageChecks,
    actions,
  };

  fs.mkdirSync(path.dirname(outputJson), { recursive: true });
  fs.writeFileSync(outputJson, JSON.stringify(report, null, 2), 'utf8');
  fs.writeFileSync(outputMd, markdownReport(report), 'utf8');
  fs.writeFileSync(LATEST_JSON, JSON.stringify(report, null, 2), 'utf8');
  fs.writeFileSync(LATEST_MD, markdownReport(report), 'utf8');

  console.log(`SEO score: ${report.summary.score}/100`);
  console.log(`Critical: ${report.summary.critical}, Warning: ${report.summary.warning}`);
  console.log(`Report JSON: ${outputJson}`);
  console.log(`Report MD: ${outputMd}`);

  if (!noFail && report.summary.critical > 0) process.exit(1);
}

run().catch((error) => {
  console.error(`SEO audit failed: ${String(error?.message || error)}`);
  process.exit(1);
});
