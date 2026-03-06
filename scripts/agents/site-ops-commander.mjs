#!/usr/bin/env node

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const reportsDir = path.join(projectRoot, 'docs', 'seo-reports');

function getArg(name, fallback) {
  const full = `--${name}=`;
  const matched = process.argv.find((arg) => arg.startsWith(full));
  if (!matched) return fallback;
  return matched.slice(full.length);
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function runCommand(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return {
    label,
    command: `${command} ${args.join(' ')}`,
    status: result.status ?? 1,
    success: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# Site Ops Commander Report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Site: ${report.site}`);
  lines.push(`- Success: ${report.summary.success}/${report.summary.total}`);
  lines.push(`- Failed: ${report.summary.failed}`);
  lines.push('');
  lines.push('## Agent Runs');
  lines.push('');
  for (const task of report.tasks) {
    lines.push(`- ${task.success ? 'PASS' : 'FAIL'} ${task.label}: \`${task.command}\``);
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const site = getArg('site', process.env.OPS_SITE_URL || 'https://kn-wallpaperglue.com');
  const noFail = hasFlag('no-fail');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const tasks = [];
  tasks.push(runCommand('SEO sitemap agent', 'pnpm', ['seo:sitemaps:generate']));
  tasks.push(runCommand('Image quality agent', 'pnpm', ['seo:images:check', '--no-fail']));
  tasks.push(runCommand('SEO audit agent', 'pnpm', ['seo:audit:continuous', `--site=${site}`, '--no-fail']));
  tasks.push(runCommand('UX lighthouse agent', 'pnpm', ['ops:ux:lighthouse', `--site=${site}`, '--no-fail']));

  const success = tasks.filter((item) => item.success).length;
  const failed = tasks.length - success;

  const report = {
    generatedAt: new Date().toISOString(),
    site,
    summary: {
      total: tasks.length,
      success,
      failed,
    },
    tasks,
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `site-ops-commander-${timestamp}.json`);
  const mdFile = path.join(reportsDir, `site-ops-commander-${timestamp}.md`);
  const latestJson = path.join(reportsDir, 'site-ops-commander-latest.json');
  const latestMd = path.join(reportsDir, 'site-ops-commander-latest.md');

  fs.writeFileSync(jsonFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(mdFile, `${buildMarkdown(report)}\n`, 'utf8');
  fs.writeFileSync(latestJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(latestMd, `${buildMarkdown(report)}\n`, 'utf8');

  console.log(`Ops commander summary: success=${success}, failed=${failed}`);
  console.log(`Report JSON: ${jsonFile}`);
  console.log(`Report MD: ${mdFile}`);

  if (failed > 0 && !noFail) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Site ops commander failed: ${String(error?.message || error)}`);
  process.exit(1);
});
