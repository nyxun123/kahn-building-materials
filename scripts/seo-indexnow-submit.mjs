#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const DEFAULT_SITE = 'https://kn-wallpaperglue.com';
const REPORT_DIR = path.join(process.cwd(), 'docs', 'seo-reports');

function getArg(name, fallback) {
  const prefix = `${name}=`;
  const exact = process.argv.find((arg) => arg.startsWith(prefix));
  if (exact) return exact.slice(prefix.length);
  const idx = process.argv.indexOf(name);
  if (idx >= 0) return process.argv[idx + 1] ?? fallback;
  return fallback;
}

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

async function fetchText(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text };
  } finally {
    clearTimeout(timeout);
  }
}

function parseLocsFromXml(xml) {
  const locs = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = regex.exec(xml))) {
    const loc = m[1]?.trim();
    if (loc) locs.push(loc);
  }
  return locs;
}

async function loadUrlsFromSitemaps(site) {
  const base = site.replace(/\/$/, '');
  const indexUrl = `${base}/sitemap-index.xml`;
  const fallbackUrl = `${base}/sitemap.xml`;

  const indexResp = await fetchText(indexUrl);
  const sitemapUrls = [];

  if (indexResp.ok && indexResp.text.includes('<sitemapindex')) {
    sitemapUrls.push(...parseLocsFromXml(indexResp.text));
  } else {
    sitemapUrls.push(fallbackUrl);
  }

  const finalUrls = new Set();
  const sitemapChecks = [];

  for (const sitemapUrl of [...new Set(sitemapUrls)]) {
    const resp = await fetchText(sitemapUrl);
    sitemapChecks.push({
      sitemapUrl,
      status: resp.status,
      ok: resp.ok,
    });
    if (!resp.ok) continue;
    const urls = parseLocsFromXml(resp.text);
    for (const url of urls) {
      if (url.startsWith(base)) finalUrls.add(url);
    }
  }

  return {
    urls: [...finalUrls],
    sitemapChecks,
  };
}

async function submitIndexNow({ endpoint, host, key, keyLocation, urlList }) {
  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body: text.slice(0, 500),
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# IndexNow Submission Report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Site: ${report.site}`);
  lines.push(`- Key location: ${report.keyLocation}`);
  lines.push(`- URLs discovered: ${report.urlsDiscovered}`);
  lines.push(`- URLs submitted: ${report.urlsSubmitted}`);
  lines.push('');
  lines.push('## Sitemap Checks');
  lines.push('');
  lines.push('| Sitemap | Status | OK |');
  lines.push('|---|---:|---|');
  for (const item of report.sitemapChecks) {
    lines.push(`| ${item.sitemapUrl} | ${item.status} | ${item.ok ? 'yes' : 'no'} |`);
  }
  lines.push('');
  lines.push('## IndexNow Endpoints');
  lines.push('');
  lines.push('| Endpoint | Status | OK |');
  lines.push('|---|---:|---|');
  for (const endpoint of report.endpointResults) {
    lines.push(`| ${endpoint.endpoint} | ${endpoint.status} | ${endpoint.ok ? 'yes' : 'no'} |`);
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const site = getArg('--site', DEFAULT_SITE);
  const key = getArg('--key', '');
  const host = new URL(site).host;
  const keyFile = getArg('--key-file', '');
  const batchSize = Number(getArg('--batch-size', '1000'));

  if (!key || key.length < 8) {
    console.error('Missing valid --key for IndexNow submission');
    process.exit(1);
  }

  if (keyFile && !fs.existsSync(keyFile)) {
    console.error(`Key file not found: ${keyFile}`);
    process.exit(1);
  }

  const keyLocation = `${site.replace(/\/$/, '')}/${key}.txt`;
  const startedAt = new Date().toISOString();

  const { urls, sitemapChecks } = await loadUrlsFromSitemaps(site);
  const urlBatches = chunk(urls, Math.max(100, batchSize));

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  const endpointResults = [];

  for (const endpoint of endpoints) {
    let okCount = 0;
    let lastStatus = 0;
    let lastBody = '';
    for (const urlBatch of urlBatches) {
      const result = await submitIndexNow({
        endpoint,
        host,
        key,
        keyLocation,
        urlList: urlBatch,
      });
      lastStatus = result.status;
      lastBody = result.body;
      if (result.ok) okCount += 1;
    }
    endpointResults.push({
      endpoint,
      ok: okCount === urlBatches.length,
      status: lastStatus,
      okBatches: okCount,
      totalBatches: urlBatches.length,
      responseSample: lastBody,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    startedAt,
    site,
    host,
    keyLocation,
    urlsDiscovered: urls.length,
    urlsSubmitted: urls.length,
    sitemapChecks,
    endpointResults,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(REPORT_DIR, `indexnow-${ts}.json`);
  const mdPath = path.join(REPORT_DIR, `indexnow-${ts}.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(mdPath, renderMarkdown(report), 'utf8');
  fs.writeFileSync(path.join(REPORT_DIR, 'indexnow-latest.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(REPORT_DIR, 'indexnow-latest.md'), renderMarkdown(report), 'utf8');

  console.log(`IndexNow submitted URLs: ${urls.length}`);
  console.log(`Report JSON: ${jsonPath}`);
  console.log(`Report MD: ${mdPath}`);
}

main().catch((error) => {
  console.error(`IndexNow submission failed: ${String(error?.message || error)}`);
  process.exit(1);
});

