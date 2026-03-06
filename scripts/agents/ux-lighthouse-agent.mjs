#!/usr/bin/env node

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const reportsDir = path.join(projectRoot, 'docs', 'seo-reports');

const DEFAULT_PATHS = ['/', '/zh/blog', '/zh/oem'];

function getArg(name, fallback) {
  const full = `--${name}=`;
  const matched = process.argv.find((arg) => arg.startsWith(full));
  if (!matched) return fallback;
  return matched.slice(full.length);
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function runLighthouse(url, outputFile) {
  const args = [
    '-y',
    'lighthouse',
    url,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--output=json',
    `--output-path=${outputFile}`,
  ];

  const result = spawnSync('npx', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function scoreToInt(score) {
  if (typeof score !== 'number') return 0;
  return Math.round(score * 100);
}

function summarize(resultJson, pagePath) {
  const categories = resultJson.categories || {};
  const audits = resultJson.audits || {};

  return {
    path: pagePath,
    performance: scoreToInt(categories.performance?.score),
    accessibility: scoreToInt(categories.accessibility?.score),
    bestPractices: scoreToInt(categories['best-practices']?.score),
    seo: scoreToInt(categories.seo?.score),
    lcp: audits['largest-contentful-paint']?.displayValue || '',
    tbt: audits['total-blocking-time']?.displayValue || '',
  };
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# UX Lighthouse Agent Report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Site: ${report.site}`);
  lines.push(`- Errors: ${report.summary.errors}`);
  lines.push(`- Warnings: ${report.summary.warnings}`);
  lines.push('');
  lines.push('## Page Scores');
  lines.push('');
  lines.push('| Path | Perf | Acc | Best | SEO | LCP | TBT |');
  lines.push('|---|---:|---:|---:|---:|---|---|');

  for (const page of report.pages) {
    lines.push(`| ${page.path} | ${page.performance} | ${page.accessibility} | ${page.bestPractices} | ${page.seo} | ${page.lcp || '-'} | ${page.tbt || '-'} |`);
  }

  if (report.warnings.length > 0) {
    lines.push('');
    lines.push('## Warnings');
    lines.push('');
    for (const warning of report.warnings) {
      lines.push(`- ${warning}`);
    }
  }

  if (report.errors.length > 0) {
    lines.push('');
    lines.push('## Errors');
    lines.push('');
    for (const error of report.errors) {
      lines.push(`- ${error}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

async function main() {
  const site = getArg('site', process.env.OPS_SITE_URL || 'https://kn-wallpaperglue.com');
  const noFail = hasFlag('no-fail');
  const pathsArg = getArg('paths', '');
  const paths = pathsArg ? pathsArg.split(',').map((item) => item.trim()).filter(Boolean) : DEFAULT_PATHS;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  fs.mkdirSync(reportsDir, { recursive: true });

  const pages = [];
  const warnings = [];
  const errors = [];

  for (const pagePath of paths) {
    const url = `${site.replace(/\/$/, '')}${pagePath}`;
    const outFile = path.join(reportsDir, `ux-lighthouse-${timestamp}-${pagePath.replace(/[\/]/g, '_') || 'root'}.json`);
    const cmdResult = runLighthouse(url, outFile);

    if (!cmdResult.ok) {
      errors.push(`Lighthouse failed for ${pagePath} (${url})`);
      continue;
    }

    try {
      const json = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      const summary = summarize(json, pagePath);
      pages.push(summary);

      if (summary.performance < 60) warnings.push(`${pagePath}: performance score ${summary.performance} < 60`);
      if (summary.accessibility < 90) warnings.push(`${pagePath}: accessibility score ${summary.accessibility} < 90`);
      if (summary.seo < 90) warnings.push(`${pagePath}: seo score ${summary.seo} < 90`);
    } catch (error) {
      errors.push(`Failed to parse Lighthouse output for ${pagePath}: ${String(error?.message || error)}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    site,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      pages: pages.length,
    },
    pages,
    warnings,
    errors,
  };

  const jsonFile = path.join(reportsDir, `ux-lighthouse-${timestamp}.json`);
  const mdFile = path.join(reportsDir, `ux-lighthouse-${timestamp}.md`);
  const latestJson = path.join(reportsDir, 'ux-lighthouse-latest.json');
  const latestMd = path.join(reportsDir, 'ux-lighthouse-latest.md');

  fs.writeFileSync(jsonFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(mdFile, `${buildMarkdown(report)}\n`, 'utf8');
  fs.writeFileSync(latestJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(latestMd, `${buildMarkdown(report)}\n`, 'utf8');

  console.log(`UX lighthouse: pages=${pages.length}, errors=${errors.length}, warnings=${warnings.length}`);
  console.log(`Report JSON: ${jsonFile}`);
  console.log(`Report MD: ${mdFile}`);

  if (errors.length > 0 && !noFail) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`UX lighthouse agent failed: ${String(error?.message || error)}`);
  process.exit(1);
});
