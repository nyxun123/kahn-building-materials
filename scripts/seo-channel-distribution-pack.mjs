#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://kn-wallpaperglue.com';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/seo-reports');
const CAMPAIGN = 'offsite-seeding-2026q1';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

const channels = [
  {
    channelName: 'Google Business Profile',
    channelType: 'map_profile',
    source: 'google',
    medium: 'organic_profile',
    locale: 'en',
    landingPath: '/en/contact',
    content: 'gbp-profile',
    anchorText: 'Wallpaper adhesive supplier contact',
    publishTitle: 'Factory profile update with contact CTA',
    publishAngle: 'Update profile description, products, and add UTM website link.',
  },
  {
    channelName: 'Bing Places',
    channelType: 'map_profile',
    source: 'bing',
    medium: 'organic_profile',
    locale: 'en',
    landingPath: '/en/contact',
    content: 'bing-places-profile',
    anchorText: 'Carboxymethyl starch factory contact',
    publishTitle: 'Bing listing profile and product section update',
    publishAngle: 'Use primary category and insert tracked website link.',
  },
  {
    channelName: 'Yandex Business',
    channelType: 'map_profile',
    source: 'yandex',
    medium: 'organic_profile',
    locale: 'ru',
    landingPath: '/ru/contact',
    content: 'yandex-business-profile',
    anchorText: 'OEM adhesive manufacturer contact',
    publishTitle: 'Yandex business listing and service highlights',
    publishAngle: 'Upload real factory images and add tracked URL.',
  },
  {
    channelName: 'LinkedIn Company Page',
    channelType: 'social',
    source: 'linkedin',
    medium: 'organic_post',
    locale: 'en',
    landingPath: '/en/oem',
    content: 'linkedin-oem-post',
    anchorText: 'OEM wallpaper adhesive manufacturer',
    publishTitle: 'OEM wallpaper adhesive manufacturing capability',
    publishAngle: 'Post factory workflow and quality control process.',
  },
  {
    channelName: 'Facebook Page',
    channelType: 'social',
    source: 'facebook',
    medium: 'organic_post',
    locale: 'en',
    landingPath: '/en/products/wallpaper-adhesive',
    content: 'facebook-product-post',
    anchorText: 'Wallpaper adhesive powder supplier',
    publishTitle: 'Wallpaper adhesive powder product spotlight',
    publishAngle: 'Share product use cases and packaging options.',
  },
  {
    channelName: 'YouTube Channel',
    channelType: 'social',
    source: 'youtube',
    medium: 'organic_video',
    locale: 'en',
    landingPath: '/en/oem',
    content: 'youtube-factory-video',
    anchorText: 'Factory direct OEM adhesive powder',
    publishTitle: 'Factory floor short: OEM adhesive packaging',
    publishAngle: 'Publish short video and pin tracked URL in description.',
  },
  {
    channelName: 'Quora Space',
    channelType: 'social',
    source: 'quora',
    medium: 'organic_answer',
    locale: 'en',
    landingPath: '/en/blog/eco-friendly-wallpaper-glue-guide',
    content: 'quora-guide-answer',
    anchorText: 'Eco friendly wallpaper glue guide',
    publishTitle: 'Answer: how to choose wallpaper adhesive supplier',
    publishAngle: 'Answer buyer intent question and link to guide.',
  },
  {
    channelName: 'Medium Publication',
    channelType: 'social',
    source: 'medium',
    medium: 'organic_article',
    locale: 'en',
    landingPath: '/en/blog',
    content: 'medium-industry-article',
    anchorText: 'Industrial starch application articles',
    publishTitle: 'Industrial starch uses in construction and textile',
    publishAngle: 'Republish summary with canonical link to site blog.',
  },
  {
    channelName: 'Alibaba Supplier Profile',
    channelType: 'b2b_directory',
    source: 'alibaba',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/oem',
    content: 'alibaba-company-profile',
    anchorText: 'OEM adhesive powder factory',
    publishTitle: 'Supplier profile completion and product links',
    publishAngle: 'Update certifications, OEM terms, and tracked website link.',
  },
  {
    channelName: 'Made-in-China Profile',
    channelType: 'b2b_directory',
    source: 'made_in_china',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/products',
    content: 'madeinchina-products',
    anchorText: 'Carboxymethyl starch product catalog',
    publishTitle: 'Product catalog refresh and company profile',
    publishAngle: 'Fill all product specs and add tracked landing URL.',
  },
  {
    channelName: 'Global Sources',
    channelType: 'b2b_directory',
    source: 'global_sources',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/oem',
    content: 'globalsources-oem',
    anchorText: 'Private label wallpaper adhesive',
    publishTitle: 'OEM and private label capability listing',
    publishAngle: 'Highlight minimum order and export capabilities.',
  },
  {
    channelName: 'EC21',
    channelType: 'b2b_directory',
    source: 'ec21',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/products/wallpaper-adhesive',
    content: 'ec21-wallpaper-product',
    anchorText: 'Wallpaper adhesive powder manufacturer',
    publishTitle: 'EC21 product listing with specification sheet',
    publishAngle: 'Use product keywords in title and link to product page.',
  },
  {
    channelName: 'TradeKey',
    channelType: 'b2b_directory',
    source: 'tradekey',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/products',
    content: 'tradekey-product-listing',
    anchorText: 'Industrial carboxymethyl starch supplier',
    publishTitle: 'TradeKey listing for industrial starch products',
    publishAngle: 'Publish multiple product entries with unique descriptions.',
  },
  {
    channelName: 'ExportHub',
    channelType: 'b2b_directory',
    source: 'exporthub',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/solutions',
    content: 'exporthub-solution-listing',
    anchorText: 'OEM starch solution provider',
    publishTitle: 'OEM solution page distribution listing',
    publishAngle: 'Use solution-specific keywords for buyer intent.',
  },
  {
    channelName: 'IndiaMART',
    channelType: 'b2b_directory',
    source: 'indiamart',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/products/construction-cms',
    content: 'indiamart-construction',
    anchorText: 'Construction additive starch supplier',
    publishTitle: 'Construction grade starch product listing',
    publishAngle: 'Target putty and gypsum additive buyer keywords.',
  },
  {
    channelName: 'Europages',
    channelType: 'business_directory',
    source: 'europages',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/about',
    content: 'europages-company',
    anchorText: 'Wall covering adhesive manufacturer',
    publishTitle: 'Company profile with category-specific tags',
    publishAngle: 'Complete company category and tracked URL fields.',
  },
  {
    channelName: 'Kompass',
    channelType: 'business_directory',
    source: 'kompass',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/oem',
    content: 'kompass-oem',
    anchorText: 'OEM adhesive powder supplier',
    publishTitle: 'Kompass profile update and capability tags',
    publishAngle: 'Add service tags and product keywords consistently.',
  },
  {
    channelName: 'Hotfrog',
    channelType: 'business_directory',
    source: 'hotfrog',
    medium: 'directory_listing',
    locale: 'en',
    landingPath: '/en/contact',
    content: 'hotfrog-contact',
    anchorText: 'Industrial adhesive supplier contact',
    publishTitle: 'Hotfrog business listing completion',
    publishAngle: 'Use concise value proposition and tracked contact URL.',
  },
];

function buildUrl(pathname, params) {
  const url = new URL(pathname, SITE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function csvEscape(value) {
  const stringValue = String(value ?? '');
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toCsv(headers, rows) {
  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  });
  return `${lines.join('\n')}\n`;
}

function buildRows() {
  return channels.map((channel, index) => {
    const id = `CH-${String(index + 1).padStart(3, '0')}`;
    const dueDate = addDays(new Date(), index % 7);
    const targetUrl = buildUrl(channel.landingPath, {
      utm_source: channel.source,
      utm_medium: channel.medium,
      utm_campaign: CAMPAIGN,
      utm_content: channel.content,
    });

    return {
      id,
      channel_name: channel.channelName,
      channel_type: channel.channelType,
      locale: channel.locale,
      utm_source: channel.source,
      utm_medium: channel.medium,
      utm_campaign: CAMPAIGN,
      utm_content: channel.content,
      target_url: targetUrl,
      anchor_text: channel.anchorText,
      publish_title: channel.publishTitle,
      publish_angle: channel.publishAngle,
      due_date: dueDate,
      status: 'pending',
    };
  });
}

function buildSummary(rows) {
  const byType = rows.reduce((map, row) => {
    map[row.channel_type] = (map[row.channel_type] ?? 0) + 1;
    return map;
  }, {});

  const typeLines = Object.entries(byType)
    .map(([type, count]) => `- ${type}: ${count}`)
    .join('\n');

  return [
    '# Offsite Distribution Pack',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Campaign: ${CAMPAIGN}`,
    `- Total channels: ${rows.length}`,
    '',
    '## Channel Mix',
    typeLines,
    '',
    '## Execution Rules',
    '- Use one unique tracked URL per channel row.',
    '- Keep profile NAP and company intro consistent across all listings.',
    '- Use real factory and product photos only (no synthetic look).',
    '- Do not duplicate identical text across all directories.',
    '',
    '## KPI Targets (First 14 Days)',
    '- Published rows: >= 18',
    '- Indexed profile pages: >= 8',
    '- Referral sessions from offsite channels: >= 120',
    '- Contact form submissions from utm_campaign offsite-seeding-2026q1: >= 8',
    '',
    '## Next Actions',
    '- Complete account login and publish all pending rows.',
    '- Capture live listing URL in a separate status log after each publish.',
    '- Re-crawl all published URLs with IndexNow in 24 hours.',
    '',
  ].join('\n');
}

async function writeOutputs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const rows = buildRows();

  const headers = [
    'id',
    'channel_name',
    'channel_type',
    'locale',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'target_url',
    'anchor_text',
    'publish_title',
    'publish_angle',
    'due_date',
    'status',
  ];

  const csv = toCsv(headers, rows);
  const summary = buildSummary(rows);

  const csvFile = path.join(OUTPUT_DIR, `offsite-distribution-${timestamp}.csv`);
  const csvLatest = path.join(OUTPUT_DIR, 'offsite-distribution-latest.csv');
  const mdFile = path.join(OUTPUT_DIR, `offsite-distribution-${timestamp}.md`);
  const mdLatest = path.join(OUTPUT_DIR, 'offsite-distribution-latest.md');

  await fs.writeFile(csvFile, csv, 'utf8');
  await fs.writeFile(csvLatest, csv, 'utf8');
  await fs.writeFile(mdFile, summary, 'utf8');
  await fs.writeFile(mdLatest, summary, 'utf8');

  console.log(`Offsite rows: ${rows.length}`);
  console.log(`CSV: ${csvFile}`);
  console.log(`MD: ${mdFile}`);
}

await writeOutputs();
