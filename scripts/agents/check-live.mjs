#!/usr/bin/env node
// Simple live site and API probe for the deployed domain
// Usage: AGENT_DOMAIN=kn-wallpaperglue.com node scripts/agents/check-live.mjs

const domain = process.env.AGENT_DOMAIN || 'kn-wallpaperglue.com';
const base = `https://${domain}`;

const targets = [
  '/',
  '/zh',
  '/api/products',
  '/api/content/home',
  '/api/admin/dashboard/health',
  '/api/contact-api'
];

const timeout = (ms) => new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms));

async function probe(path) {
  const url = `${base}${path}`;
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'Accept': 'application/json,text/html;q=0.9,*/*;q=0.8' },
      signal: controller.signal
    });
    const ct = res.headers.get('content-type') || '';
    let snippet = '';
    try {
      if (ct.includes('application/json')) {
        const j = await res.json();
        snippet = JSON.stringify(j).slice(0, 180);
      } else {
        const t = await res.text();
        snippet = t.replace(/\s+/g, ' ').slice(0, 180);
      }
    } catch { /* ignore body errors */ }
    console.log(`${url} -> ${res.status} ${res.statusText} | ${ct}`);
    if (snippet) console.log(`  body: ${snippet}${snippet.length === 180 ? '…' : ''}`);
    return { path, status: res.status };
  } catch (e) {
    console.log(`${url} -> ERROR: ${e.message}`);
    return { path, status: 0, error: e.message };
  } finally {
    clearTimeout(to);
  }
}

(async () => {
  console.log(`Probing domain: ${base}`);
  const results = [];
  for (const p of targets) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await probe(p));
  }
  const summary = Object.fromEntries(results.map(r => [r.path, r.status]));
  console.log('\nSummary:', summary);
  const apiOk = results.filter(r => r.path.startsWith('/api/') && r.status === 200).length > 0;
  if (!apiOk) {
    console.log('\nHint: /api/* currently not serving full API. Likely a Worker route is intercepting.');
  }
})();

