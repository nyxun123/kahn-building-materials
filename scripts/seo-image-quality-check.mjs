#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { STATIC_BLOG_ARTICLES } from '../functions/lib/blog-static-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const creditsPath = path.join(projectRoot, 'docs', 'blog-image-credits.md');
const reportsDir = path.join(projectRoot, 'docs', 'seo-reports');

const suspiciousNamePatterns = [
  /(^|[\s_-])generated([\s_-]|$)/i,
  /(^|[\s_-])ai([\s_-]|$)/i,
  /midjourney/i,
  /dall[\s_-]?e/i,
  /stable[\s_-]?diffusion/i,
  /aigc/i,
  /synthetic/i,
  /render/i,
  /mockup/i,
  /默认标题/i
];

const scanExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.md',
  '.json'
]);

const ignoreDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  '.wrangler',
  '.cache',
  'coverage'
]);

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function normalizeImageRef(ref) {
  if (!ref || typeof ref !== 'string') return '';
  const trimmed = ref.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const u = new URL(trimmed);
      return `${u.origin}${decodeURIComponent(u.pathname)}`;
    } catch {
      return trimmed;
    }
  }

  const noHash = trimmed.split('#')[0];
  const noQuery = noHash.split('?')[0];
  return decodeURIComponent(noQuery);
}

function getFileNameFromRef(ref) {
  if (!ref) return '';
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    try {
      const u = new URL(ref);
      return path.basename(u.pathname);
    } catch {
      return '';
    }
  }
  return path.basename(ref);
}

function isSuspiciousImageName(ref) {
  const fileName = getFileNameFromRef(ref);
  return suspiciousNamePatterns.some((pattern) => pattern.test(fileName));
}

function extractImgSrcs(html) {
  if (!html || typeof html !== 'string') return [];
  const refs = [];
  const regex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match = regex.exec(html);
  while (match) {
    refs.push(match[1]);
    match = regex.exec(html);
  }
  return refs;
}

function loadCreditsUrls() {
  if (!fs.existsSync(creditsPath)) return new Set();
  const text = fs.readFileSync(creditsPath, 'utf8');
  const matches = text.match(/https?:\/\/[^\s)]+/g) || [];
  return new Set(matches.map((url) => normalizeImageRef(url)));
}

function walkFiles(dir, collector) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walkFiles(path.join(dir, entry.name), collector);
      continue;
    }
    const ext = path.extname(entry.name);
    if (!scanExtensions.has(ext)) continue;
    collector.push(path.join(dir, entry.name));
  }
}

function formatPath(p) {
  return path.relative(projectRoot, p);
}

function pushUniqueIssue(list, dedupe, issue) {
  const key = `${issue.type}|${issue.message}|${issue.where}`;
  if (dedupe.has(key)) return;
  dedupe.add(key);
  list.push(issue);
}

async function main() {
  const noFail = hasFlag('--no-fail');
  const now = new Date();
  const nowStamp = now.toISOString().replace(/[:.]/g, '-');

  const errors = [];
  const warnings = [];
  const dedupe = new Set();
  const referencedLocalImages = new Set();
  const referencedExternalImages = new Set();

  const credits = loadCreditsUrls();

  for (const article of STATIC_BLOG_ARTICLES) {
    const refs = new Set([
      article.cover_image,
      ...extractImgSrcs(article.content_zh),
      ...extractImgSrcs(article.content_en),
      ...extractImgSrcs(article.content_ru)
    ]);

    for (const rawRef of refs) {
      const ref = normalizeImageRef(rawRef);
      if (!ref) continue;

      if (isSuspiciousImageName(ref)) {
        pushUniqueIssue(errors, dedupe, {
          type: 'suspicious_name',
          where: `blog:${article.slug}`,
          message: `Suspicious image filename: ${ref}`
        });
      }

      if (ref.startsWith('http://') || ref.startsWith('https://')) {
        referencedExternalImages.add(ref);
        if (!credits.has(ref)) {
          pushUniqueIssue(errors, dedupe, {
            type: 'missing_credit',
            where: `blog:${article.slug}`,
            message: `External image missing credits record: ${ref}`
          });
        }
        continue;
      }

      if (!ref.startsWith('/images/')) continue;
      referencedLocalImages.add(ref);

      const abs = path.join(publicDir, ref.replace(/^\//, ''));
      if (!fs.existsSync(abs)) {
        pushUniqueIssue(errors, dedupe, {
          type: 'missing_file',
          where: `blog:${article.slug}`,
          message: `Image file not found: ${ref}`
        });
      }
    }
  }

  const filesToScan = [];
  walkFiles(path.join(projectRoot, 'src'), filesToScan);
  walkFiles(path.join(projectRoot, 'functions'), filesToScan);
  walkFiles(path.join(projectRoot, 'content-marketing'), filesToScan);

  const imagePathRegex = /\/images\/[^"'`)\n]+/g;
  for (const file of filesToScan) {
    const text = fs.readFileSync(file, 'utf8');
    const matches = text.match(imagePathRegex) || [];
    for (const rawRef of matches) {
      const ref = normalizeImageRef(rawRef);
      if (!ref.startsWith('/images/')) continue;

      if (isSuspiciousImageName(ref)) {
        pushUniqueIssue(errors, dedupe, {
          type: 'suspicious_name',
          where: formatPath(file),
          message: `Suspicious image filename: ${ref}`
        });
      }

      const abs = path.join(publicDir, ref.replace(/^\//, ''));
      if (!fs.existsSync(abs)) {
        pushUniqueIssue(errors, dedupe, {
          type: 'missing_file',
          where: formatPath(file),
          message: `Referenced image not found: ${ref}`
        });
      }
    }
  }

  try {
    const sharp = (await import('sharp')).default;
    for (const article of STATIC_BLOG_ARTICLES) {
      const cover = normalizeImageRef(article.cover_image);
      if (!cover.startsWith('/images/')) continue;
      const coverAbs = path.join(publicDir, cover.replace(/^\//, ''));
      if (!fs.existsSync(coverAbs)) continue;

      const meta = await sharp(coverAbs).metadata();
      const width = meta.width || 0;
      const height = meta.height || 0;
      if (width < 1200 || height < 630) {
        pushUniqueIssue(warnings, dedupe, {
          type: 'low_resolution_cover',
          where: `blog:${article.slug}`,
          message: `Cover image is below 1200x630: ${cover} (${width}x${height})`
        });
      }
    }
  } catch (error) {
    pushUniqueIssue(warnings, dedupe, {
      type: 'dimension_check_skipped',
      where: 'script',
      message: `Image dimension checks skipped: ${String(error?.message || error)}`
    });
  }

  const report = {
    generatedAt: now.toISOString(),
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      referencedLocalImages: referencedLocalImages.size,
      referencedExternalImages: referencedExternalImages.size
    },
    errors,
    warnings
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  const reportFile = path.join(reportsDir, `image-quality-${nowStamp}.json`);
  const latestFile = path.join(reportsDir, 'image-quality-latest.json');
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(latestFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Image quality check: errors=${errors.length}, warnings=${warnings.length}`);
  console.log(`Report: ${reportFile}`);
  console.log(`Latest: ${latestFile}`);

  if (errors.length > 0 && !noFail) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Image quality check failed: ${String(error?.message || error)}`);
  process.exit(1);
});
